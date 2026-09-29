import { Db, pool } from "../../db";
import { Payment } from "../../shared/types";

const COLUMNS = 'id, order_id AS "orderId", amount, status';

export const paymentRepository = {
  async create(orderId: number, amount: number, status: string, db: Db = pool): Promise<Payment> {
    const { rows } = await db.query<Payment>(
      `INSERT INTO payments (order_id, amount, status) VALUES ($1, $2, $3) RETURNING ${COLUMNS}`,
      [orderId, amount, status]
    );
    return rows[0];
  },

  // A JOIN into the orders module's table to check who owns the payment.
  // Easy with one database; impossible once payments and orders are split.
  async findByIdForUser(id: number, userId: number): Promise<Payment | null> {
    const { rows } = await pool.query<Payment>(
      `SELECT p.id, p.order_id AS "orderId", p.amount, p.status
       FROM payments p JOIN orders o ON o.id = p.order_id
       WHERE p.id = $1 AND o.user_id = $2`,
      [id, userId]
    );
    return rows[0] ?? null;
  },
};
