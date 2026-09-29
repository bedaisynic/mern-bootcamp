import { Db, pool } from "../../db";
import { User } from "../../shared/types";

// DATA ACCESS ONLY: SQL in, rows out. No rules, no HTTP.
export const userRepository = {
  async findById(id: number, db: Db = pool): Promise<User | null> {
    const { rows } = await db.query<User>("SELECT id, email, name FROM users WHERE id = $1", [id]);
    return rows[0] ?? null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const { rows } = await pool.query<User>("SELECT id, email, name FROM users WHERE email = $1", [email]);
    return rows[0] ?? null;
  },

  async create(email: string, name: string): Promise<User> {
    const { rows } = await pool.query<User>(
      "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name",
      [email, name]
    );
    return rows[0];
  },
};
