import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import { UpstreamError } from "./clients/http";
import { initDb, pool } from "./db";
import { HttpError } from "./errors";
import { orderRoutes } from "./orders/order.routes";

const PORT = Number(process.env.PORT) || 4105;
const app = express();

app.use(express.json());
// Express 5 forwards errors from async controllers to the error handler below,
// so controllers don't need try/catch.
app.use((req, res, next) => {
  const start = Date.now();
  const reqId = (req.header("x-request-id") ?? "-").slice(0, 8);
  res.on("finish", () =>
    console.log(`[${reqId}] ${req.method} ${req.originalUrl} → ${res.statusCode} ${Date.now() - start}ms`)
  );
  next();
});

app.get("/health", async (_req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok" });
});

app.use("/orders", orderRoutes);

app.use((req, res) => {
  res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  // A service we called failed: pass its status and message through.
  if (err instanceof UpstreamError) {
    res.status(err.status).json({ error: err.message, service: err.service });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

initDb().then(() => {
  app.listen(PORT, () => console.log(`orders service on http://localhost:${PORT}`));
});
