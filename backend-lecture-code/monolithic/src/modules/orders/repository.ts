import { pool } from "../../db/pool";
import { OrderStatus } from "./service";

export const getAll = async (params : any) => {
  // db query
  const { limit, offset } = params;
  const { rows } = await pool.query(
    "SELECT * FROM orders ORDER BY id LIMIT $1 OFFSET $2",
    [limit, offset],
  );

  return rows;
};


export const findById = async (orderId: number) => {

    // if not found, just return null;
}

export const insert = async (productId: number, quantity: number, status: OrderStatus) => {
    const { rows } = await pool.query(
      "INSERT INTO orders (product_id, quantity, status) VALUES ($1, $2, $3) RETURNING *",
      [productId, quantity, "pending"],
    );

    return rows[0];
}
