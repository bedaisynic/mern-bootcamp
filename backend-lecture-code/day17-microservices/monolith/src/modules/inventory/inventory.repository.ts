import { Db, pool } from "../../db";

export type Stock = { sku: string; onHand: number };

const COLUMNS = 'sku, on_hand AS "onHand"';

export const inventoryRepository = {
  async findAll(): Promise<Stock[]> {
    const { rows } = await pool.query<Stock>(`SELECT ${COLUMNS} FROM inventory ORDER BY sku`);
    return rows;
  },

  async findBySku(sku: string): Promise<Stock | null> {
    const { rows } = await pool.query<Stock>(`SELECT ${COLUMNS} FROM inventory WHERE sku = $1`, [sku]);
    return rows[0] ?? null;
  },

  /** Takes stock only if there's enough, in one atomic statement. Returns false if there wasn't. */
  async decrementIfAvailable(sku: string, quantity: number, db: Db = pool): Promise<boolean> {
    const { rowCount } = await db.query(
      "UPDATE inventory SET on_hand = on_hand - $1 WHERE sku = $2 AND on_hand >= $1",
      [quantity, sku]
    );
    return rowCount === 1;
  },
};
