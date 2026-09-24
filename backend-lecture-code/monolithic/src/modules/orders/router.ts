import { Router } from "express";

import { pool } from "../../db/pool";
import * as orderController  from "./controller";
import { isValidTransition, ORDER_STATUSES, OrderStatus } from "./service";

export const ordersRouter = Router();



// GET /orders
ordersRouter.get("/", orderController.getAll);

// #demo-n-plus-1 — same result, 1 + N queries vs. 1 join. must be
// registered before /:id, otherwise "with-products" gets matched as an id
ordersRouter.get("/with-products/n-plus-1", orderController.getWithProductsNPlusOne);
ordersRouter.get("/with-products/join", orderController.getWithProductsJoin);

// demo-indexing — same query, unindexed column vs indexed column
ordersRouter.get("/by-customer/:customerId", orderController.getByCustomer);
ordersRouter.get(
  "/by-customer-indexed/:customerId",
  orderController.getByCustomerIndexed,
);

// GET /orders/:id
ordersRouter.get("/:id", async (req, res) => {
  // validation
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: { message: "id must be a number" } });
  }

  // service logic — none needed

  // db query
  try {
    const { rows } = await pool.query("SELECT * FROM orders WHERE id = $1", [
      id,
    ]);
    if (!rows[0]) {
      return res
        .status(404)
        .json({ error: { message: `order ${id} not found` } });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: { message: "failed to fetch order" } });
  }
});

// POST /orders
ordersRouter.post("/", orderController.create);

// PATCH /orders/:id
ordersRouter.patch("/:id", async (req, res) => {
  // validation
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: { message: "id must be a number" } });
  }
  const { status } = req.body;
  if (typeof status !== "string" || !ORDER_STATUSES.includes(status)) {
    return res.status(400).json({
      error: { message: `status must be one of: ${ORDER_STATUSES.join(", ")}` },
    });
  }
  const to = status as OrderStatus;

  // service logic — only transitions the ALLOWED_TRANSITIONS state machine
  // permits are allowed; everything else is rejected as a conflict

  // db query — lock the order row, check the transition is legal, then update
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: current } = await client.query(
      "SELECT * FROM orders WHERE id = $1 FOR UPDATE",
      [id],
    );
    if (!current[0]) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ error: { message: `order ${id} not found` } });
    }

    const from = current[0].status as OrderStatus;
    if (from === to) {
      // no-op: already in the requested state
      await client.query("ROLLBACK");
      return res.json(current[0]);
    }
    if (!isValidTransition(from, to)) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: { message: `cannot move order from "${from}" to "${to}"` },
      });
    }

    const { rows } = await client.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [to, id],
    );

    await client.query("COMMIT");
    res.json(rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ error: { message: "failed to update order" } });
  } finally {
    client.release();
  }
});

// DELETE /orders/:id
ordersRouter.delete("/:id", async (req, res) => {
  // validation
  const id = Number(req.params.id);
  if (Number.isNaN(id)) {
    return res.status(400).json({ error: { message: "id must be a number" } });
  }

  // service logic — none needed

  // db query
  try {
    const { rowCount } = await pool.query("DELETE FROM orders WHERE id = $1", [
      id,
    ]);
    if (!rowCount) {
      return res
        .status(404)
        .json({ error: { message: `order ${id} not found` } });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: { message: "failed to delete order" } });
  }
});
