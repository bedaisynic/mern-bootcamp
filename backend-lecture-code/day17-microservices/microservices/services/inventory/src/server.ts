import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { Pool } from "pg";

const PORT = Number(process.env.PORT) || 4103;
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ??
    "postgresql://inventory_svc:inventory_svc@localhost:5435/inventory_db",
});

type Item = { sku: string; quantity: number };

class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

async function initDb() {
  // `sku` is just a string here, with no foreign key to products. The
  // product rows live in Catalog's MongoDB, which this service can't see.
  await pool.query(`CREATE TABLE IF NOT EXISTS stock (
    sku     TEXT PRIMARY KEY,
    on_hand INT  NOT NULL CHECK (on_hand >= 0)
  )`);
  await pool.query(`CREATE TABLE IF NOT EXISTS reservations (
    id         SERIAL PRIMARY KEY,
    items      JSONB       NOT NULL,
    status     TEXT        NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
  )`);
  await pool.query(`INSERT INTO stock (sku, on_hand) VALUES
    ('SKU-1001', 25), ('SKU-1002', 10), ('SKU-2001', 3), ('SKU-2002', 40),
    ('SKU-2003', 200), ('SKU-3001', 1), ('SKU-3002', 15)
    ON CONFLICT (sku) DO NOTHING`);
}

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  const reqId = (req.header("x-request-id") ?? "-").slice(0, 8);
  res.on("finish", () =>
    console.log(`[${reqId}] ${req.method} ${req.originalUrl} → ${res.statusCode} ${Date.now() - start}ms`)
  );
  next();
});

app.get("/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok" });
});

app.get("/inventory", async (req, res) => {
  const { rows } = await pool.query('SELECT sku, on_hand AS "onHand" FROM stock ORDER BY sku');
  res.json(rows);
});

app.get("/inventory/:sku", async (req, res) => {
  const { rows } = await pool.query('SELECT sku, on_hand AS "onHand" FROM stock WHERE sku = $1', [
    req.params.sku,
  ]);
  if (!rows[0]) throw new HttpError(404, `no stock record for ${req.params.sku}`);
  res.json(rows[0]);
});

// Internal: reserve every item or none. The transaction lives INSIDE this
// service; Orders can't join it, so it gets back a reservation id instead.
app.post("/internal/inventory/reservations", async (req, res) => {
  const items: Item[] = req.body?.items ?? [];
  if (items.length === 0) throw new HttpError(400, "items are required");

  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    for (const { sku, quantity } of items) {
      const { rowCount } = await client.query(
        "UPDATE stock SET on_hand = on_hand - $1 WHERE sku = $2 AND on_hand >= $1",
        [quantity, sku]
      );
      if (rowCount === 0) throw new HttpError(409, `not enough stock for ${sku}`);
    }
    const { rows } = await client.query<{ id: number }>(
      "INSERT INTO reservations (items) VALUES ($1) RETURNING id",
      [JSON.stringify(items)]
    );
    await client.query("COMMIT");
    res.status(201).json({ reservationId: rows[0].id });
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

// Internal: the compensating action. Orders calls this when a later step of
// checkout fails, to put the stock back. Releasing twice is a no-op.
app.delete("/internal/inventory/reservations/:id", async (req, res) => {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const { rows } = await client.query<{ items: Item[] }>(
      "UPDATE reservations SET status = 'released' WHERE id = $1 AND status = 'active' RETURNING items",
      [req.params.id]
    );
    for (const { sku, quantity } of rows[0]?.items ?? []) {
      await client.query("UPDATE stock SET on_hand = on_hand + $1 WHERE sku = $2", [quantity, sku]);
    }
    await client.query("COMMIT");
    res.status(204).end();
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
});

app.use((req, res) => {
  res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

initDb().then(() => {
  app.listen(PORT, () => console.log(`inventory service on http://localhost:${PORT}`));
});
