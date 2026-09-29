import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { createClient } from "redis";

const PORT = Number(process.env.PORT) || 4104;
const CATALOG_URL = process.env.CATALOG_URL ?? "http://localhost:4102";
const CART_TTL_SECONDS = 7 * 24 * 60 * 60;

// Redis, not SQL: a cart is short-lived, changes constantly, and losing one
// is annoying rather than a disaster. Each cart is one hash, sku → quantity.
const redis = createClient({ url: process.env.REDIS_URL ?? "redis://localhost:6381" });

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

const cartKey = (userId: number) => `cart:${userId}`;

async function readCart(userId: number) {
  const hash = await redis.hGetAll(cartKey(userId));
  const items = Object.entries(hash)
    .map(([sku, quantity]) => ({ sku, quantity: Number(quantity) }))
    .sort((a, b) => a.sku.localeCompare(b.sku));
  return { items };
}

// A service-to-service call: Cart asks Catalog whether the SKU exists.
async function assertProductExists(sku: string, requestId: string) {
  let res: globalThis.Response;
  try {
    res = await fetch(`${CATALOG_URL}/products/${encodeURIComponent(sku)}`, {
      headers: { "x-request-id": requestId },
      signal: AbortSignal.timeout(2000),
    });
  } catch {
    throw new HttpError(503, "catalog is unavailable, try again");
  }
  if (res.status === 404) throw new HttpError(400, `unknown sku ${sku}`);
  if (!res.ok) throw new HttpError(502, `catalog responded ${res.status}`);
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
  await redis.ping();
  res.json({ status: "ok" });
});

app.get("/cart", async (req, res) => {
  res.json(await readCart(userIdOf(req)));
});

app.post("/cart/items", async (req, res) => {
  const userId = userIdOf(req);
  const { sku, quantity = 1 } = req.body ?? {};
  if (!sku || !Number.isInteger(quantity) || quantity < 1) {
    throw new HttpError(400, "sku and a positive integer quantity are required");
  }
  await assertProductExists(sku, req.header("x-request-id") ?? "");
  await redis.hIncrBy(cartKey(userId), sku, quantity);
  await redis.expire(cartKey(userId), CART_TTL_SECONDS);
  res.status(201).json(await readCart(userId));
});

app.delete("/cart/items/:sku", async (req, res) => {
  const userId = userIdOf(req);
  await redis.hDel(cartKey(userId), req.params.sku);
  res.json(await readCart(userId));
});

app.delete("/cart", async (req, res) => {
  await redis.del(cartKey(userIdOf(req)));
  res.status(204).end();
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

redis.connect().then(() => {
  app.listen(PORT, () => console.log(`cart service on http://localhost:${PORT}`));
});
