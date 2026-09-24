import { Request, Response } from "express";
import { pool } from "../../db/pool";

import * as orderService from "./service";
import * as orderRepository from "./repository";

export const getAll = async (req: Request, res: Response) => {
  // validation
  const limit = req.query.limit ? Number(req.query.limit) : 10000000;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  if (Number.isNaN(limit) || Number.isNaN(offset)) {
    return res
      .status(400)
      .json({ error: { message: "limit and offset must be numbers" } });
  }

  try {
    // controller layer calling service layer
    const orders = await orderService.getAll({ limit, offset });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: { message: "failed to fetch orders" } });
  }
};

// ------------------------------------------------------------------
// DEMOS — each demo is one self-contained handler (no service/repository
// hop) so it reads top to bottom in one place. the "---- x ----" comments
// mark which layer each part would normally live in.
// ------------------------------------------------------------------

// pool.query + a log line. drizzle's logger only sees drizzle queries, so
// this prints each raw SQL statement to the terminal the same way.
const logQuery = (sql: string, params: unknown[]) => {
  console.log(`Query: ${sql.replace(/\s+/g, " ").trim()} -- params: ${JSON.stringify(params)}`);
  return pool.query(sql, params);
};

// #demo-n-plus-1 (see DEMOS.md)
// two endpoints, same result: each order with its product's name.
// default limit is high on purpose so the N+1 slowdown is obvious.
//   GET /orders/with-products/n-plus-1?limit=500 → 1 + N queries
//   GET /orders/with-products/join?limit=500     → 1 query

// ============================================================
// N+1 — 1 query for the orders, then 1 query PER order for its
// product. watch the terminal: one "SELECT ... FROM orders", then
// "SELECT name FROM products WHERE id = $1" repeated N times, each
// with a different id.
// ============================================================
export const getWithProductsNPlusOne = async (req: Request, res: Response) => {
  // ---- validation (controller) ----
  const limit = req.query.limit ? Number(req.query.limit) : 500;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  if (Number.isNaN(limit) || Number.isNaN(offset)) {
    return res
      .status(400)
      .json({ error: { message: "limit and offset must be numbers" } });
  }

  try {
    console.time("N+1");

    // ---- db query (repository): 1 query for the page of orders ----
    const { rows: orders } = await logQuery(
      "SELECT id, product_id, quantity, status FROM orders ORDER BY id LIMIT $1 OFFSET $2",
      [limit, offset],
    );

    // ---- service logic: attach each order's product name ----
    const rows = [];
    for (const order of orders) {
      // ---- db query (repository): +1 query PER order ← a query inside a loop ----
      // for loop, N query (n is the length of orders)
      const { rows: products } = await logQuery(
        "SELECT name FROM products WHERE id = $1",
        [order.product_id],
      );
      rows.push({
        id: order.id,
        quantity: order.quantity,
        status: order.status,
        productId: order.product_id,
        productName: products[0]?.name,
      });
    }

    console.timeEnd("N+1");
    const queryCount = orders.length + 1;
    console.log(`N+1: ${queryCount} queries`);
    res.json({ queryCount, rows });
  } catch (err) {
    res.status(500).json({ error: { message: "failed to fetch orders" } });
  }
};

// ============================================================
// JOIN — one query: join orders to products. the terminal shows a
// single "SELECT ... FROM orders o JOIN products p ...".
// ============================================================
export const getWithProductsJoin = async (req: Request, res: Response) => {
  // ---- validation (controller) ----
  const limit = req.query.limit ? Number(req.query.limit) : 500;
  const offset = req.query.offset ? Number(req.query.offset) : 0;
  if (Number.isNaN(limit) || Number.isNaN(offset)) {
    return res
      .status(400)
      .json({ error: { message: "limit and offset must be numbers" } });
  }

  try {
    console.time("JOIN");

    // ---- db query (repository): 1 query, no loop ----
    const { rows } = await logQuery(
      `SELECT o.id, o.quantity, o.status, p.id AS "productId", p.name AS "productName"
       FROM orders o
       JOIN products p ON p.id = o.product_id
       ORDER BY o.id
       LIMIT $1 OFFSET $2`,
      [limit, offset],
    );

    console.timeEnd("JOIN");
    console.log("JOIN: 1 query");
    res.json({ queryCount: 1, rows });
  } catch (err) {
    res.status(500).json({ error: { message: "failed to fetch orders" } });
  }
};

// #demo-indexing (see DEMOS.md)
// two endpoints, identical except for ONE column name in the WHERE.
// orders stores the same customer id twice; only customer_id_indexed has
// an index (see db/schema.ts). compare the timings in the terminal.

// GET /orders/by-customer/:customerId — WITHOUT index
export const getByCustomer = async (req: Request, res: Response) => {
  // ---- validation (controller) ----
  const customerId = Number(req.params.customerId);
  if (!Number.isInteger(customerId)) {
    return res
      .status(400)
      .json({ error: { message: "customerId must be an integer" } });
  }

  try {
    console.time("WITHOUT index");

    // ---- db query (repository): no index → postgres reads all 300k rows and checks each one ----
    const { rows } = await logQuery(
      "SELECT * FROM orders WHERE customer_id = $1",
      [customerId],
    );

    console.timeEnd("WITHOUT index");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: { message: "failed to fetch orders" } });
  }
};

// GET /orders/by-customer-indexed/:customerId — WITH index
export const getByCustomerIndexed = async (req: Request, res: Response) => {
  // ---- validation (controller) ----
  const customerId = Number(req.params.customerId);
  if (!Number.isInteger(customerId)) {
    return res
      .status(400)
      .json({ error: { message: "customerId must be an integer" } });
  }

  try {
    console.time("WITH index");

    // ---- db query (repository): indexed → postgres jumps straight to the matching rows ----
    const { rows } = await logQuery(
      "SELECT * FROM orders WHERE customer_id_indexed = $1",
      [customerId],
    );

    console.timeEnd("WITH index");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: { message: "failed to fetch orders" } });
  }
};

export const create = async (req: Request, res: Response) => {
  // validation
  const { productId, quantity } = req.body;
  if (typeof productId !== "number" || !Number.isInteger(productId)) {
    return res
      .status(400)
      .json({ error: { message: "productId must be an integer" } });
  }
  if (typeof quantity !== "number" || quantity <= 0) {
    return res
      .status(400)
      .json({ error: { message: "quantity must be a positive number" } });
  }

  // service logic — new orders always start out pending

  // #demo-isolation — raw-SQL BEGIN/COMMIT version of the same idea
  // db query — lock the inventory row, check there's enough stock, decrement
  // it, and insert the order, all in one transaction. the FOR UPDATE lock is
  // what stops two concurrent orders from both reading the same "1 left" and
  // both succeeding.
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const { rows: invRows } = await client.query(
      "SELECT quantity FROM inventory WHERE product_id = $1 FOR UPDATE",
      [productId],
    );
    const available = invRows[0]?.quantity ?? 0;

    if (available < quantity) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        error: {
          message: `only ${available} in stock for product ${productId}`,
        },
      });
    }

    await client.query(
      "UPDATE inventory SET quantity = quantity - $1, updated_at = now() WHERE product_id = $2",
      [quantity, productId],
    );

    const { rows } = await client.query(
      "INSERT INTO orders (product_id, quantity, status) VALUES ($1, $2, $3) RETURNING *",
      [productId, quantity, "pending"],
    );

    const newOrder = await orderRepository.insert(productId, quantity, "pending");

    await client.query("COMMIT");
    res.status(201).json(newOrder);
  } catch (err: any) {
    await client.query("ROLLBACK");
    if (err.code === "23503") {
      return res
        .status(409)
        .json({ error: { message: `product ${productId} does not exist` } });
    }
    res.status(500).json({ error: { message: "failed to create order" } });
  } finally {
    client.release();
  }
}
