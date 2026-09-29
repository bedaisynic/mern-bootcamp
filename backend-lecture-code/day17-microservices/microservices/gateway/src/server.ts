import "dotenv/config";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import path from "node:path";
import express from "express";
import jwt from "jsonwebtoken";
import swaggerUi from "swagger-ui-express";
import YAML from "yaml";

const PORT = Number(process.env.PORT) || 8080;
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

type Route = {
  service: string;
  /** One or more instances. More than one means round-robin. */
  urls: string[];
  /** Which requests can skip the token check. Everything else needs one. */
  isPublic: (method: string, path: string) => boolean;
  next: number;
};

function urls(envName: string, fallback: string): string[] {
  return (process.env[envName] ?? fallback).split(",").map((u) => u.trim()).filter(Boolean);
}

// The routing table: first path segment → the service that owns it.
// Nothing under /internal is listed, so internal endpoints are unreachable
// from outside.
const routes: Record<string, Route> = {
  users: {
    service: "users",
    urls: urls("USERS_URLS", "http://localhost:4101"),
    isPublic: (m, p) => m === "POST" && (p === "/users" || p === "/users/login"),
    next: 0,
  },
  products: {
    service: "catalog",
    urls: urls("CATALOG_URLS", "http://localhost:4102"),
    isPublic: (m) => m === "GET",
    next: 0,
  },
  inventory: {
    service: "inventory",
    urls: urls("INVENTORY_URLS", "http://localhost:4103"),
    isPublic: (m) => m === "GET",
    next: 0,
  },
  cart: {
    service: "cart",
    urls: urls("CART_URLS", "http://localhost:4104"),
    isPublic: () => false,
    next: 0,
  },
  orders: {
    service: "orders",
    urls: urls("ORDERS_URLS", "http://localhost:4105"),
    isPublic: () => false,
    next: 0,
  },
  payments: {
    service: "payments",
    urls: urls("PAYMENTS_URLS", "http://localhost:4106"),
    isPublic: (m, p) => p.startsWith("/payments/debug/"),
    next: 0,
  },
  notifications: {
    service: "notifications",
    urls: urls("NOTIFICATIONS_URLS", "http://localhost:4107"),
    isPublic: (m, p) => p.startsWith("/notifications/debug/"),
    next: 0,
  },
  recommendations: {
    service: "recommendations",
    urls: urls("RECOMMENDATIONS_URLS", "http://localhost:4108"),
    isPublic: () => true,
    next: 0,
  },
};

/** Verify the JWT once, here, so no service behind the gateway has to. */
function userIdFromToken(header: string | undefined): string | undefined {
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) return undefined;
  try {
    return (jwt.verify(token, JWT_SECRET) as { sub: string }).sub;
  } catch {
    return undefined;
  }
}

const app = express();
app.use(express.json());

// API docs for the whole public API: Swagger UI at /docs, the raw spec at
// /openapi.json. Registered before the proxy so the gateway answers these itself.
const openapi = YAML.parse(readFileSync(path.join(__dirname, "..", "openapi.yaml"), "utf8"));
app.get("/openapi.json", (_req, res) => {
  res.json(openapi);
});
app.use("/docs", swaggerUi.serve, swaggerUi.setup(openapi));

// Which instances are up right now. Kill one service and watch only its row change.
app.get("/health", async (req, res) => {
  const checks = Object.values(routes).flatMap((route) =>
    route.urls.map(async (url) => {
      try {
        const r = await fetch(`${url}/health`, { signal: AbortSignal.timeout(1000) });
        return [`${route.service} ${url}`, r.ok ? "up" : `down (${r.status})`] as const;
      } catch {
        return [`${route.service} ${url}`, "down"] as const;
      }
    })
  );
  res.json({ gateway: "up", services: Object.fromEntries(await Promise.all(checks)) });
});

app.use(async (req, res) => {
  const start = Date.now();
  const requestId = req.header("x-request-id") ?? randomUUID();
  const route = routes[req.path.split("/")[1]];
  if (!route) {
    res.status(404).json({ error: `no service handles ${req.path}` });
    return;
  }

  // 1. Auth at the edge. The headers are built from scratch, so a client
  //    can't smuggle in its own x-user-id: only the gateway sets it.
  const headers: Record<string, string> = { "x-request-id": requestId };
  if (!route.isPublic(req.method, req.path)) {
    const userId = userIdFromToken(req.header("authorization"));
    if (!userId) {
      res.status(401).json({ error: "missing or invalid token" });
      return;
    }
    headers["x-user-id"] = userId;
  }

  // 2. Pick an instance, round-robin.
  const target = route.urls[route.next++ % route.urls.length];

  // 3. Forward the request and relay the answer.
  const hasBody = req.body !== undefined && req.method !== "GET" && req.method !== "HEAD";
  if (hasBody) headers["content-type"] = "application/json";
  try {
    const upstream = await fetch(target + req.originalUrl, {
      method: req.method,
      headers,
      body: hasBody ? JSON.stringify(req.body) : undefined,
      signal: AbortSignal.timeout(10_000),
    });
    const body = await upstream.text();
    res.status(upstream.status);
    const type = upstream.headers.get("content-type");
    if (type) res.type(type);
    res.send(body);
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    res
      .status(timedOut ? 504 : 502)
      .json({ error: `${route.service} is ${timedOut ? "too slow" : "unavailable"}`, service: route.service });
  } finally {
    console.log(
      `[${requestId.slice(0, 8)}] ${req.method} ${req.originalUrl} → ${route.service} ${target} ${res.statusCode} ${Date.now() - start}ms`
    );
  }
});

app.listen(PORT, () => {
  console.log(`API gateway on http://localhost:${PORT}  (docs: http://localhost:${PORT}/docs)`);
  for (const [prefix, route] of Object.entries(routes)) {
    console.log(`  /${prefix.padEnd(16)} → ${route.urls.join(", ")}`);
  }
});
