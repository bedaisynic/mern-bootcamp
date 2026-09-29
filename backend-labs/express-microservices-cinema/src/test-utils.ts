// given — used by every *.test.ts file. Starts the whole system in this one
// test process, each service on its own random port with fresh seed data,
// and records every request each service receives so tests can check
// "was payments called?" or "which user id did seats see?".

import http from "node:http";
import type { AddressInfo } from "node:net";
import express from "express";
import { createGatewayApp } from "./gateway/app";
import { createBookingsApp } from "./services/bookings/app";
import { createMoviesApp } from "./services/movies/app";
import { createNotificationsApp } from "./services/notifications/app";
import { createPaymentsApp } from "./services/payments/app";
import { createSeatsApp } from "./services/seats/app";

export type SystemService = "movies" | "seats" | "payments" | "notifications" | "bookings";
export type RecordedCall = { method: string; path: string; userId?: string; requestId?: string };

type Running = { url: string; close: () => Promise<void> };

/** Starts an Express app on a random port. */
export async function listen(app: express.Express): Promise<Running> {
  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  const { port } = server.address() as AddressInfo;
  return {
    url: `http://127.0.0.1:${port}`,
    close: () =>
      new Promise<void>((resolve) => {
        server.closeAllConnections();
        server.close(() => resolve());
      }),
  };
}

/** A URL where nothing is listening: calling it fails with "connection refused". */
export async function deadUrl(): Promise<string> {
  const { url, close } = await listen(express());
  await close();
  return url;
}

export async function startSystem(
  options: { replace?: Partial<Record<SystemService, express.Express | "down">> } = {}
) {
  const calls: Record<SystemService, RecordedCall[]> = {
    movies: [],
    seats: [],
    payments: [],
    notifications: [],
    bookings: [],
  };
  const urls = {} as Record<SystemService, string>;
  const running: Running[] = [];

  async function start(name: SystemService, createReal: () => express.Express) {
    const replacement = options.replace?.[name];
    if (replacement === "down") {
      urls[name] = await deadUrl();
      return;
    }
    const recorder = express();
    recorder.use((req, _res, next) => {
      calls[name].push({
        method: req.method,
        path: req.originalUrl,
        userId: req.header("x-user-id"),
        requestId: req.header("x-request-id"),
      });
      next();
    });
    recorder.use(replacement ?? createReal());
    const r = await listen(recorder);
    running.push(r);
    urls[name] = r.url;
  }

  await start("movies", createMoviesApp);
  await start("seats", createSeatsApp);
  await start("payments", createPaymentsApp);
  await start("notifications", createNotificationsApp);
  await start("bookings", () =>
    createBookingsApp({
      movies: urls.movies,
      seats: urls.seats,
      payments: urls.payments,
      notifications: urls.notifications,
    })
  );
  const gateway = await listen(createGatewayApp(urls));
  running.push(gateway);

  return {
    urls,
    gatewayUrl: gateway.url,
    calls,
    stop: () => Promise.all(running.map((r) => r.close())),
  };
}

export type ApiResponse = { status: number; body: any };

/** A small fetch wrapper: JSON in, `{ status, body }` out. */
export async function api(
  baseUrl: string,
  method: string,
  path: string,
  options: { userId?: number; token?: string; body?: unknown; headers?: Record<string, string> } = {}
): Promise<ApiResponse> {
  const headers: Record<string, string> = { ...options.headers };
  if (options.userId !== undefined) headers["x-user-id"] = String(options.userId);
  if (options.token) headers.authorization = `Bearer ${options.token}`;
  if (options.body !== undefined) headers["content-type"] = "application/json";
  const res = await fetch(baseUrl + path, {
    method,
    headers,
    body: options.body === undefined ? undefined : JSON.stringify(options.body),
  });
  const text = await res.text();
  return { status: res.status, body: text ? JSON.parse(text) : undefined };
}

/** Logs in through the gateway and returns the token. */
export async function login(gatewayUrl: string, name: string): Promise<string> {
  const { body } = await api(gatewayUrl, "POST", "/auth/login", { body: { name } });
  return body.token;
}

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
