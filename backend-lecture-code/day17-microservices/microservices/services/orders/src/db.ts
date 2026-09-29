import { Pool, types } from "pg";

// Return NUMERIC columns (totals) as numbers instead of strings.
types.setTypeParser(types.builtins.NUMERIC, parseFloat);

// orders_svc can connect to orders_db and nothing else. There are no users,
// products, or payments tables here to JOIN against.
export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgresql://orders_svc:orders_svc@localhost:5435/orders_db",
});

export async function initDb(): Promise<void> {
  // No foreign keys to users or products: those tables live in other
  // databases. The order keeps its own SNAPSHOT of what it needs instead.
  await pool.query(`CREATE TABLE IF NOT EXISTS orders (
    id             SERIAL PRIMARY KEY,
    user_id        INT            NOT NULL,
    customer_email TEXT           NOT NULL,
    status         TEXT           NOT NULL,
    total          NUMERIC(10, 2) NOT NULL,
    items          JSONB          NOT NULL,
    reservation_id INT,
    payment_id     INT,
    created_at     TIMESTAMPTZ    NOT NULL DEFAULT now()
  )`);
}
