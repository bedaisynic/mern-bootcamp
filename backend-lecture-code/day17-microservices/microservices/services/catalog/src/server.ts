import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { MongoClient } from "mongodb";

const PORT = Number(process.env.PORT) || 4102;

// MongoDB, not Postgres: a shoe has sizes, a TV has a resolution. Every
// product's `attributes` has a different shape, and no migration is needed
// to add a new kind of product.
type ProductDoc = {
  _id: string; // the SKU. Other services refer to products by this string.
  name: string;
  price: number;
  category: string;
  attributes: Record<string, unknown>;
};

const mongo = new MongoClient(process.env.MONGO_URL ?? "mongodb://localhost:27018");
const products = mongo.db("catalog").collection<ProductDoc>("products");

const SEED: ProductDoc[] = [
  { _id: "SKU-1001", name: "Running Shoes", price: 89.99, category: "footwear", attributes: { sizes: [8, 9, 10, 11], color: "black" } },
  { _id: "SKU-1002", name: "Hiking Boots", price: 149.0, category: "footwear", attributes: { sizes: [9, 10], waterproof: true } },
  { _id: "SKU-2001", name: '85" 8K TV', price: 5999.0, category: "electronics", attributes: { resolution: "8K", screenInches: 85 } },
  { _id: "SKU-2002", name: "Wireless Headphones", price: 199.99, category: "electronics", attributes: { batteryHours: 30, noiseCancelling: true } },
  { _id: "SKU-2003", name: "USB-C Cable", price: 12.99, category: "electronics", attributes: { lengthMeters: 2 } },
  { _id: "SKU-3001", name: "Coffee Mug", price: 14.5, category: "kitchen", attributes: { capacityMl: 350, dishwasherSafe: true } },
  { _id: "SKU-3002", name: "Chef Knife", price: 79.0, category: "kitchen", attributes: { bladeCm: 20, steel: "VG-10" } },
];

class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

function toProduct({ _id, ...rest }: ProductDoc) {
  return { sku: _id, ...rest };
}

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  const reqId = (req.header("x-request-id") ?? "-").slice(0, 8);
  res.on("finish", () =>
    console.log(`[${reqId}] ${req.method} ${req.originalUrl} → ${res.statusCode} ${Date.now() - start}ms (port ${PORT})`)
  );
  next();
});

app.get("/health", async (req, res) => {
  await mongo.db("catalog").command({ ping: 1 });
  res.json({ status: "ok", port: PORT });
});

app.get("/products", async (req, res) => {
  const category = typeof req.query.category === "string" ? req.query.category : undefined;
  const docs = await products.find(category ? { category } : {}).sort({ _id: 1 }).toArray();
  res.json(docs.map(toProduct));
});

app.get("/products/:sku", async (req, res) => {
  const doc = await products.findOne({ _id: req.params.sku });
  if (!doc) throw new HttpError(404, `product ${req.params.sku} not found`);
  res.json(toProduct(doc));
});

app.post("/products", async (req, res) => {
  if (!req.header("x-user-id")) throw new HttpError(401, "call this through the gateway");
  const { sku, name, price, category, attributes = {} } = req.body ?? {};
  if (!sku || !name || typeof price !== "number" || !category) {
    throw new HttpError(400, "sku, name, price (number), and category are required");
  }
  const doc: ProductDoc = { _id: sku, name, price, category, attributes };
  await products.insertOne(doc);
  res.status(201).json(toProduct(doc));
});

app.use((req, res) => {
  res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if ((err as { code?: number }).code === 11000) {
    res.status(409).json({ error: "sku already exists" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

async function start() {
  await mongo.connect();
  if ((await products.countDocuments()) === 0) await products.insertMany(SEED);
  app.listen(PORT, () => console.log(`catalog service on http://localhost:${PORT}`));
}
start();
