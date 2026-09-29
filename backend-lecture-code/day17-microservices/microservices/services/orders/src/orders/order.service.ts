// Checkout still needs the same five other parts of the system. Each import
// is now a CLIENT: every call below is an HTTP request that can be slow,
// fail, or time out.
import { cartClient } from "../clients/cart.client";
import { catalogClient } from "../clients/catalog.client";
import { Ctx } from "../clients/http";
import { inventoryClient } from "../clients/inventory.client";
import { notificationClient } from "../clients/notification.client";
import { paymentClient } from "../clients/payment.client";
import { userClient } from "../clients/user.client";
import { HttpError } from "../errors";
import { Order, OrderLine, orderRepository } from "./order.repository";

export const orderService = {
  // Same steps as the monolith's checkout, but there is no transaction
  // around them: each service commits its own step the moment it's called.
  async checkout(ctx: Ctx): Promise<Order> {
    // 1. The cart and the customer, fetched in parallel.
    const [items, user] = await Promise.all([cartClient.getItems(ctx), userClient.getUser(ctx, ctx.userId)]);
    if (items.length === 0) throw new HttpError(400, "cart is empty");

    // 2. Current prices, frozen into the order as a snapshot.
    const products = await Promise.all(items.map((item) => catalogClient.getProduct(ctx, item.sku)));
    const lines: OrderLine[] = items.map((item, i) => ({
      sku: item.sku,
      name: products[i].name,
      unitPrice: products[i].price,
      quantity: item.quantity,
    }));
    const total = Math.round(lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0) * 100) / 100;

    // 3. Reserve stock. Already committed in Inventory's database.
    const reservationId = await inventoryClient.reserve(ctx, items);

    // 4. Record the order in OUR database.
    const order = await orderRepository.createPending({
      userId: ctx.userId,
      customerEmail: user.email,
      total,
      items: lines,
      reservationId,
    });

    // 5. Charge the card. If this fails, no ROLLBACK will un-reserve the
    //    stock for us, so we undo step 3 by hand: a compensating action.
    let paymentId: number;
    try {
      paymentId = (await paymentClient.charge(ctx, order.id, total)).id;
    } catch (err) {
      // A timeout is ambiguous: the charge may still have gone through. Real
      // systems send an idempotency key so the charge can be safely retried.
      await inventoryClient
        .release(ctx, reservationId)
        .catch((e) => console.error(`⚠️ could not release reservation ${reservationId}: ${e.message}`));
      await orderRepository.markPaymentFailed(order.id);
      throw err;
    }
    const placed = await orderRepository.markPlaced(order.id, paymentId);

    // 6. Best effort: the order is placed either way.
    await cartClient.clear(ctx).catch((e) => console.warn(`cart not cleared: ${e.message}`));

    // 7. Fire-and-forget: not awaited. If Notifications is down, the order
    //    still succeeds; the failure is logged, not thrown.
    notificationClient
      .sendOrderConfirmation(ctx, user.email, placed)
      .catch((e) => console.warn(`notification failed, order ${order.id} still placed: ${e.message}`));

    return placed;
  },

  async listOrders(userId: number): Promise<Order[]> {
    return orderRepository.findByUser(userId);
  },

  async getOrder(id: number, userId: number): Promise<Order> {
    const order = await orderRepository.findByIdForUser(id, userId);
    if (!order) throw new HttpError(404, `order ${id} not found`);
    return order;
  },
};
