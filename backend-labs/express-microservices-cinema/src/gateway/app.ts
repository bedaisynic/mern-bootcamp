// given — never edit this file. The single public entry point: logs in
// users, then forwards every other request to the service that owns it.

import express, { NextFunction, Request, Response } from "express";
import { buildForwardHeaders, signToken, UnauthorizedError, USERS } from "./auth";
import { ROUTES, ServiceName } from "./routes";

export function createGatewayApp(urls: Record<ServiceName, string>) {
  const app = express();
  app.use(express.json());

  app.use((req, res, next) => {
    if (process.env.VITEST) return next();
    const start = Date.now();
    res.on("finish", () =>
      console.log(`${req.method} ${req.originalUrl} → ${res.statusCode} ${Date.now() - start}ms`)
    );
    next();
  });

  // Demo login: a name is enough. Returns a token to send as
  // `Authorization: Bearer <token>` on every private request.
  app.post("/auth/login", (req, res) => {
    const userId = USERS[String(req.body?.name ?? "").toLowerCase()];
    if (!userId) {
      res.status(401).json({ error: "unknown user (try alice, bob, or carol)" });
      return;
    }
    res.json({ token: signToken(userId), userId });
  });

  // Which services are up right now.
  app.get("/health", async (_req, res) => {
    const entries = await Promise.all(
      (Object.entries(urls) as [ServiceName, string][]).map(async ([service, url]) => {
        try {
          const r = await fetch(`${url}/health`, { signal: AbortSignal.timeout(1000) });
          return [service, r.ok ? "up" : "down"];
        } catch {
          return [service, "down"];
        }
      })
    );
    res.json({ gateway: "up", services: Object.fromEntries(entries) });
  });

  app.use(async (req, res) => {
    const route = ROUTES[req.path.split("/")[1]];
    if (!route) {
      res.status(404).json({ error: `no service handles ${req.path}` });
      return;
    }

    let headers: Record<string, string>;
    try {
      headers = buildForwardHeaders(req, route.isPublic(req.method, req.path));
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        res.status(401).json({ error: "missing or invalid token" });
        return;
      }
      throw err;
    }

    const hasBody = req.body !== undefined && req.method !== "GET" && req.method !== "HEAD";
    if (hasBody) headers["content-type"] = "application/json";
    try {
      const upstream = await fetch(urls[route.service] + req.originalUrl, {
        method: req.method,
        headers,
        body: hasBody ? JSON.stringify(req.body) : undefined,
        signal: AbortSignal.timeout(10_000),
      });
      res.status(upstream.status);
      const type = upstream.headers.get("content-type");
      if (type) res.type(type);
      res.send(await upstream.text());
    } catch (err) {
      const timedOut = err instanceof Error && err.name === "TimeoutError";
      res
        .status(timedOut ? 504 : 502)
        .json({ error: `${route.service} is ${timedOut ? "too slow" : "unavailable"}`, service: route.service });
    }
  });

  app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    console.error("[gateway]", err);
    res.status(500).json({ error: err instanceof Error ? err.message : "internal error" });
  });

  return app;
}
