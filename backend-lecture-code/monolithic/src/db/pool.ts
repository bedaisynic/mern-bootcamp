import { Pool, Client } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";

(async () => {
  const client = new Client();
  try {
    await client.query("SELECT * FROM Orders");
  } catch (err) {
  } finally {
    client.end();
  }
})();

import * as schema from "./schema";

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// drizzle client — used everywhere except the products/inventory/orders
// routers, which intentionally use `pool` directly with raw SQL.
//
// logger: true prints every SQL statement drizzle sends — that's how you
// spot an N+1: the same query repeated over and over with a different param.
// (raw pool.query calls don't go through this — see logQuery() in
// orders/controller.ts for the raw-SQL equivalent.)
export const db = drizzle(pool, { schema, logger: true });
