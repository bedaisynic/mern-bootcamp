import { Db, pool } from "../../db";
import { CartItem } from "../../shared/types";

export const cartRepository = {
  async findByUser(userId: number, db: Db = pool): Promise<CartItem[]> {
    const { rows } = await db.query<CartItem>(
      "SELECT sku, quantity FROM cart_items WHERE user_id = $1 ORDER BY sku",
      [userId]
    );
    return rows;
  },

  /** Adds to the quantity if the SKU is already in the cart. */
  async addItem(userId: number, sku: string, quantity: number): Promise<void> {
    await pool.query(
      `INSERT INTO cart_items (user_id, sku, quantity) VALUES ($1, $2, $3)
       ON CONFLICT (user_id, sku) DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity`,
      [userId, sku, quantity]
    );
  },

  async removeItem(userId: number, sku: string): Promise<void> {
    await pool.query("DELETE FROM cart_items WHERE user_id = $1 AND sku = $2", [userId, sku]);
  },

  async clear(userId: number, db: Db = pool): Promise<void> {
    await db.query("DELETE FROM cart_items WHERE user_id = $1", [userId]);
  },
};
