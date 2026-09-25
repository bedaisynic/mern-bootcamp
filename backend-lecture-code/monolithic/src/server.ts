import "dotenv/config";

import express from "express";
import cors from "cors";
import { sql } from "drizzle-orm";

import { db } from "./db/pool";
import { redisClient } from "./redis/client";
import { errorHandler } from "./lib/errors";
import { productsRouter } from "./modules/products/router";
import { inventoryRouter } from "./modules/inventory/router";
import { ordersRouter } from "./modules/orders/router";
import { activityRouter } from "./modules/activity/router";
import { uploadsRouter } from "./modules/uploads/router";
import { aiRouter } from "./modules/ai/router";

const app = express();
const PORT = Number(process.env.PORT) || 3100;

// lets browser pages on other origins (e.g. the curriculum site's day 14
// lecture page on localhost:5173) read our responses. wide open is fine for
// a local lecture playground — a real API would list its allowed origins.
app.use(cors());
app.use(express.json());

// #demo-blocking (see DEMOS.md)
// blocking
app.get("/blocking", async (_req, res) => {
  // intentionally block for 5 seconds
  const start = Date.now();
  // cpu related tasks will block the main thread
  while (Date.now() - start < 5000) {
    /* busy-wait: the thread is stuck here */
  }

  res.send("hello");
});

// resource routers — each one owns its own CRUD routes + validation
app.use("/products", productsRouter);
app.use("/inventory", inventoryRouter);
app.use("/orders", ordersRouter);
app.use("/activity", activityRouter); // #demo-pagination
app.use("/uploads", uploadsRouter); // #demo-s3
app.use("/ai", aiRouter); // #demo-secrets-manager

// GET http://localhost:3100/health
app.get("/health", async (_req, res) => {
  try {
    await db.execute(sql`SELECT 1`);
    res.status(200).json({ status: "ok", db: "up" });
  } catch (err) {
    res.status(503).json({ status: "degraded", db: "down" });
  }
});

// #demo-error-handling
// mounted last, after every route — turns any thrown AppError (or a Zod
// validation failure) into one consistent JSON response. see lib/errors.ts.
app.use(errorHandler);

async function start() {
  await redisClient.connect();

  app.listen(PORT, () => {
    console.log(`Monolithic API listening on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("failed to start server:", err);
  process.exit(1);
});