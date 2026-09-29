import { pool } from "../db";

export type OrderLine = { sku: string; name: string; unitPrice: number; quantity: number };

export type Order = {
  id: number;
  userId: number;
  status: "pending_payment" | "placed" | "payment_failed";
  total: number;
  customerEmail: string;
  items: OrderLine[];
  reservationId: number | null;
  paymentId: number | null;
  createdAt: string;
};

const COLUMNS = `id, user_id AS "userId", status, total, customer_email AS "customerEmail",
  items, reservation_id AS "reservationId", payment_id AS "paymentId", created_at AS "createdAt"`;

// DATA ACCESS ONLY, and only ever this service's own database.
export const orderRepository = {
  async createPending(input: {
    userId: number;
    customerEmail: string;
    total: number;
    items: OrderLine[];
    reservationId: number;
  }): Promise<Order> {
    const { rows } = await pool.query<Order>(
      `INSERT INTO orders (user_id, customer_email, status, total, items, reservation_id)
       VALUES ($1, $2, 'pending_payment', $3, $4, $5) RETURNING ${COLUMNS}`,
      [input.userId, input.customerEmail, input.total, JSON.stringify(input.items), input.reservationId]
    );
    return rows[0];
  },

  async markPlaced(id: number, paymentId: number): Promise<Order> {
    const { rows } = await pool.query<Order>(
      `UPDATE orders SET status = 'placed', payment_id = $2 WHERE id = $1 RETURNING ${COLUMNS}`,
      [id, paymentId]
    );
    return rows[0];
  },

  async markPaymentFailed(id: number): Promise<void> {
    await pool.query("UPDATE orders SET status = 'payment_failed' WHERE id = $1", [id]);
  },

  async findByUser(userId: number): Promise<Order[]> {
    const { rows } = await pool.query<Order>(
      `SELECT ${COLUMNS} FROM orders WHERE user_id = $1 ORDER BY id DESC`,
      [userId]
    );
    return rows;
  },

  // No JOIN. Everything the page needs was copied in at checkout time.
  async findByIdForUser(id: number, userId: number): Promise<Order | null> {
    const { rows } = await pool.query<Order>(
      `SELECT ${COLUMNS} FROM orders WHERE id = $1 AND user_id = $2`,
      [id, userId]
    );
    return rows[0] ?? null;
  },
};
