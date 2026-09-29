import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { Pool, types } from "pg";

types.setTypeParser(types.builtins.NUMERIC, parseFloat);

const PORT = Number(process.env.PORT) || 4106;
const DECLINE_ABOVE = 5000;
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgresql://payments_svc:payments_svc@localhost:5435/payments_db",
});

// DEMO knob: artificial latency, set with POST /payments/debug/slow.
let slowMs = 0;

class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

function userIdOf(req: Request): number {
  const id = Number(req.header("x-user-id"));
  if (!id) throw new HttpError(401, "missing x-user-id: call this through the gateway");
  return id;
}

const PAYMENT_COLUMNS = 'id, order_id AS "orderId", user_id AS "userId", amount, status';

async function initDb() {
  // Stores user_id itself: it can't JOIN into orders to find the owner.
  await pool.query(`CREATE TABLE IF NOT EXISTS payments (
    id         SERIAL PRIMARY KEY,
    order_id   INT            NOT NULL,
    user_id    INT            NOT NULL,
    amount     NUMERIC(10, 2) NOT NULL,
    status     TEXT           NOT NULL,
    created_at TIMESTAMPTZ    NOT NULL DEFAULT now()
  )`);
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

// Internal: a fake card processor. Anything over $5,000 is declined.
app.post("/internal/payments/charges", async (req, res) => {
  const { orderId, userId, amount } = req.body ?? {};
  if (!orderId || !userId || typeof amount !== "number") {
    throw new HttpError(400, "orderId, userId, and amount (number) are required");
  }
  if (slowMs > 0) await new Promise((resolve) => setTimeout(resolve, slowMs));

  const status = amount > DECLINE_ABOVE ? "declined" : "approved";
  const { rows } = await pool.query(
    `INSERT INTO payments (order_id, user_id, amount, status) VALUES ($1, $2, $3, $4)
     RETURNING ${PAYMENT_COLUMNS}`,
    [orderId, userId, amount, status]
  );
  if (status === "declined") {
    res.status(402).json({ error: `payment of $${amount} declined`, payment: rows[0] });
    return;
  }
  res.status(201).json(rows[0]);
});

app.get("/payments/:id", async (req, res) => {
  const { rows } = await pool.query(
    `SELECT ${PAYMENT_COLUMNS} FROM payments WHERE id = $1 AND user_id = $2`,
    [req.params.id, userIdOf(req)]
  );
  if (!rows[0]) throw new HttpError(404, `payment ${req.params.id} not found`);
  res.json(rows[0]);
});

// DEMO: make every charge take this long. Orders gives up after 3 seconds.
app.post("/payments/debug/slow", (req, res) => {
  slowMs = Math.max(0, Number(req.body?.ms) || 0);
  res.json({ slowMs });
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
  app.listen(PORT, () => console.log(`payments service on http://localhost:${PORT}`));
});
