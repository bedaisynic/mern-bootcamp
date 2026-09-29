import { Db, pool } from "../../db";
import { Product } from "../../shared/types";

const COLUMNS = "sku, name, price, category";

export const catalogRepository = {
  async findAll(category?: string): Promise<Product[]> {
    const { rows } = category
      ? await pool.query<Product>(`SELECT ${COLUMNS} FROM products WHERE category = $1 ORDER BY sku`, [category])
      : await pool.query<Product>(`SELECT ${COLUMNS} FROM products ORDER BY sku`);
    return rows;
  },

  async findBySku(sku: string, db: Db = pool): Promise<Product | null> {
    const { rows } = await db.query<Product>(`SELECT ${COLUMNS} FROM products WHERE sku = $1`, [sku]);
    return rows[0] ?? null;
  },

  async create(product: Product): Promise<Product> {
    const { rows } = await pool.query<Product>(
      `INSERT INTO products (sku, name, price, category) VALUES ($1, $2, $3, $4) RETURNING ${COLUMNS}`,
      [product.sku, product.name, product.price, product.category]
    );
    return rows[0];
  },
};
