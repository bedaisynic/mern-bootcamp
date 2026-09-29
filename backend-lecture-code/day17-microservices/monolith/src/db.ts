import { Pool, PoolClient, types } from "pg";

// Return NUMERIC columns (prices, totals) as numbers instead of strings.
types.setTypeParser(types.builtins.NUMERIC, parseFloat);

// ONE connection pool shared by all eight modules. If Catalog traffic spikes
// and holds every connection, checkout waits in the same queue.
export const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgresql://lecture:lecture@localhost:5434/monolith_db",
  max: 10,
});

/** Anything that can run a query: the pool, or one client inside a transaction. */
export type Db = Pool | PoolClient;

/**
 * Runs `work` inside one BEGIN … COMMIT. Services pass `tx` down, through other
 * modules' services too, to every repository call, so they all share one transaction.
 */
export async function withTransaction<T>(work: (tx: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await work(client);
    await client.query("COMMIT");
    return result;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}
