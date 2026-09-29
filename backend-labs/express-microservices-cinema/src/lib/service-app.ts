// given — the Express setup every service is built on: JSON parsing, request
// logging, /health, a 404 for unknown routes, and one error handler.
//
// It's shared here only to keep the lab small. In a real company each service
// is its own repo and would have its own copy of this (or a shared package).

import express, { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "./http-error";

export function createServiceApp(name: string, mountRoutes: (app: express.Express) => void) {
  const app = express();
  app.use(express.json());

  app.use((req, res, next) => {
    if (process.env.VITEST) return next(); // keep test output quiet
    const start = Date.now();
    const requestId = (req.header("x-request-id") ?? "-").slice(0, 8);
    res.on("finish", () =>
      console.log(`[${requestId}] ${req.method} ${req.originalUrl} → ${res.statusCode} ${Date.now() - start}ms`)
    );
    next();
  });

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", service: name });
  });

  mountRoutes(app);

  app.use((req, res) => {
    res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
  });

  // Express 5 sends errors thrown in async controllers here, so controllers
  // don't need try/catch.
  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
      const message = err.issues.map((i) => `${i.path.join(".") || "body"}: ${i.message}`).join("; ");
      res.status(400).json({ error: message });
      return;
    }
    if (err instanceof HttpError) {
      res.status(err.status).json(err.service ? { error: err.message, service: err.service } : { error: err.message });
      return;
    }
    if ((err as { type?: string }).type === "entity.parse.failed") {
      res.status(400).json({ error: "invalid JSON body" });
      return;
    }
    console.error(`[${name}]`, err);
    res.status(500).json({ error: "internal error" });
  });

  return app;
}
