import "dotenv/config";
import { readFileSync } from "node:fs";
import path from "node:path";
import express, { NextFunction, Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";
import { pool } from "./db";
import { HttpError } from "./shared/errors";
import { cartRoutes } from "./modules/cart/cart.routes";
import { catalogRoutes } from "./modules/catalog/catalog.routes";
import { inventoryRoutes } from "./modules/inventory/inventory.routes";
import { notificationRoutes } from "./modules/notifications/notification.routes";
import { orderRoutes } from "./modules/orders/order.routes";
import { paymentRoutes } from "./modules/payments/payment.routes";
import { recommendationRoutes } from "./modules/recommendations/recommendation.routes";
import { userRoutes } from "./modules/users/user.routes";

const PORT = Number(process.env.PORT) || 4100;
const app = express();

app.use(express.json());
// Express 5 forwards errors from async controllers to the error handler below,
// so controllers don't need try/catch.
app.use((req, res, next) => {
  const start = Date.now();
  res.on("finish", () =>
    console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} ${Date.now() - start}ms`)
  );
  next();
});

// API docs: Swagger UI at /docs, the raw spec at /openapi.json.
const openapi = YAML.parse(readFileSync(path.join(__dirname, "..", "openapi.yaml"), "utf8"));
app.get("/openapi.json", (_req, res) => {
  res.json(openapi);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

app.get("/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok" });
});

// Every team's routes are mounted here, in this one file. Adding a module
// means editing it, and so does every other team.
app.use("/users", userRoutes);
app.use("/products", catalogRoutes);
app.use("/inventory", inventoryRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/recommendations", recommendationRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if ((err as { code?: string }).code === "23505") {
    res.status(409).json({ error: "already exists" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

app.listen(PORT, () => {
  console.log(`Monolith (all 8 modules, 1 process) on http://localhost:${PORT}`);
  console.log(`API docs on http://localhost:${PORT}/docs`);
});
