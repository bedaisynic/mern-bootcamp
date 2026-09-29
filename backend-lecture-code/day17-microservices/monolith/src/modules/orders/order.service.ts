import { withTransaction } from "../../db";
import { HttpError } from "../../shared/errors";
import { Order } from "../../shared/types";
// Checkout needs five other modules. Each one is just an import and a
// function call: no network, no timeouts, no partial failures.
import { cartService } from "../cart/cart.service";
import { catalogService } from "../catalog/catalog.service";
import { inventoryService } from "../inventory/inventory.service";
import { notificationService } from "../notifications/notification.service";
import { paymentService } from "../payments/payment.service";
import { userService } from "../users/user.service";
import { OrderLine, orderRepository } from "./order.repository";

export const orderService = {
  async checkout(userId: number): Promise<Order> {
    // ONE transaction around the whole checkout. Every service below gets
    // `tx`, so if the card is declined, ROLLBACK un-reserves the stock,
    // deletes the order, and restores the cart, all at once, for free.
    const { user, order } = await withTransaction(async (tx) => {
      const user = await userService.getUser(userId, tx);
      const items = await cartService.getItems(userId, tx);
      if (items.length === 0) throw new HttpError(400, "cart is empty");

      const lines: OrderLine[] = [];
      for (const item of items) {
        const product = await catalogService.getProduct(item.sku, tx);
        await inventoryService.reserve(item.sku, item.quantity, tx);
        lines.push({ sku: item.sku, quantity: item.quantity, unitPrice: product.price });
      }
      const total = Math.round(lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0) * 100) / 100;

      const order = await orderRepository.create(userId, total, tx);
      for (const line of lines) await orderRepository.addLine(order.id, line, tx);

      await paymentService.charge(order.id, total, tx);
      await cartService.clear(userId, tx);
      return { user, order };
    });

    // After COMMIT, and its failure is only logged: a broken email must not
    // undo an order the customer already paid for.
    await notificationService
      .sendOrderConfirmation(user, order)
      .catch((err) => console.error("notification failed, order still placed:", err.message));

    return order;
  },

  async listOrders(userId: number): Promise<Order[]> {
    return orderRepository.findByUser(userId);
  },

  async getOrderDetail(id: number, userId: number) {
    const order = await orderRepository.findDetail(id, userId);
    if (!order) throw new HttpError(404, `order ${id} not found`);
    return order;
  },
};
