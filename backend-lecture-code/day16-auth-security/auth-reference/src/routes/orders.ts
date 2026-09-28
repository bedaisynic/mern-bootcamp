import { Router } from "express";
import { Request } from "express";
import { orders, products, nextId, Order, OrderStatus, Region } from "../db";
import { requireAuth, authorize, currentUser } from "../middleware/auth";
import { can } from "../policy/engine";

const router = Router();

// Every route in this file needs a logged-in user.
router.use(requireAuth);

const findOrder = (req: Request) => orders.find((o) => o.id === Number(req.params.id));

// Same endpoint for everyone, but the policy engine decides WHICH rows come back: a customer gets
// their own, a manager gets their region's, an admin gets all. The same rules guard GET /orders/:id,
// so the list and the detail page can never disagree.
router.get("/", (req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ message: "Account no longer exists" });
  res.json(orders.filter((o) => can(user, "order:read", o).allowed));
});

router.get("/:id", (req, res) => {
  const user = currentUser(req);
  if (!user) return res.status(401).json({ message: "Account no longer exists" });
  const order = findOrder(req);

  // The IDOR bug would be to stop here and return the order: any logged-in customer could read
  // any order just by changing the id in the URL.
  //
  // The fix is an ownership check. We answer 404 rather than 403, so a customer can't even
  // learn that someone else's order id exists.
  if (!order || !can(user, "order:read", order).allowed) {
    return res.status(404).json({ message: "Order not found" });
  }
  res.json(order);
});

router.post("/", (req, res) => {
  const items: { productId: number; quantity: number }[] = Array.isArray(req.body.items) ? req.body.items : [];
  if (items.length === 0) {
    return res.status(400).json({ message: 'Body must be { items: [{ "productId": 1, "quantity": 2 }] }' });
  }
  const region: Region = req.body.region ?? "east";
  if (region !== "east" && region !== "west") {
    return res.status(400).json({ message: 'region must be "east" or "west"' });
  }

  let total = 0;
  for (const item of items) {
    const product = products.find((p) => p.id === item.productId);
    if (!product || !(item.quantity > 0)) {
      return res.status(400).json({ message: `Invalid item: productId ${item.productId}` });
    }
    // The server computes the price from its own data. Never trust a total sent by the client.
    total += product.price * item.quantity;
  }

  const order: Order = {
    id: nextId.order++,
    customerId: req.user!.id, // taken from the verified token, never from the request body
    items: items.map(({ productId, quantity }) => ({ productId, quantity })),
    total: Math.round(total * 100) / 100,
    status: "placed",
    region,
  };
  orders.push(order);
  res.status(201).json(order);
});

const statuses: OrderStatus[] = ["placed", "shipped", "delivered", "cancelled"];

// authorize loads the order first, because the answer depends on it: its region, its total,
// and whether it's already delivered or cancelled.
router.patch("/:id/status", authorize("order:updateStatus", findOrder), (req, res) => {
  const order: Order = res.locals.order;
  if (!statuses.includes(req.body.status)) {
    return res.status(400).json({ message: `status must be one of: ${statuses.join(", ")}` });
  }

  order.status = req.body.status;
  res.json(order);
});

export default router;
