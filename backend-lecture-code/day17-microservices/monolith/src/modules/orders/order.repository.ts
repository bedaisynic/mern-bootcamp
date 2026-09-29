import { Db, pool } from "../../db";
import { Order } from "../../shared/types";

export type OrderLine = { sku: string; quantity: number; unitPrice: number };

const COLUMNS = 'id, user_id AS "userId", status, total, created_at AS "createdAt"';

export const orderRepository = {
  async create(userId: number, total: number, db: Db = pool): Promise<Order> {
    const { rows } = await db.query<Order>(
      `INSERT INTO orders (user_id, status, total) VALUES ($1, 'placed', $2) RETURNING ${COLUMNS}`,
      [userId, total]
    );
    return rows[0];
  },

  async addLine(orderId: number, line: OrderLine, db: Db = pool): Promise<void> {
    await db.query(
      "INSERT INTO order_items (order_id, sku, quantity, unit_price) VALUES ($1, $2, $3, $4)",
      [orderId, line.sku, line.quantity, line.unitPrice]
    );
  },

  async findByUser(userId: number): Promise<Order[]> {
    const { rows } = await pool.query<Order>(
      `SELECT ${COLUMNS} FROM orders WHERE user_id = $1 ORDER BY id DESC`,
      [userId]
    );
    return rows;
  },

  // One query across four modules' tables. Convenient, and exactly the
  // coupling that splitting the database takes away.
  async findDetail(id: number, userId: number) {
    const { rows } = await pool.query(
      `SELECT o.id, o.status, o.total, o.created_at AS "createdAt",
              u.email AS "customerEmail", u.name AS "customerName",
              json_agg(json_build_object(
                'sku', p.sku, 'name', p.name, 'quantity', oi.quantity, 'unitPrice', oi.unit_price
              ) ORDER BY p.sku) AS items
       FROM orders o
       JOIN users u        ON u.id = o.user_id
       JOIN order_items oi ON oi.order_id = o.id
       JOIN products p     ON p.sku = oi.sku
       WHERE o.id = $1 AND o.user_id = $2
       GROUP BY o.id, u.id`,
      [id, userId]
    );
    return rows[0] ?? null;
  },
};
