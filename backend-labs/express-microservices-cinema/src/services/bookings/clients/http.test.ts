// given — these already pass. They check callService() in http.ts, which
// is given, against small fake servers: slow ones, dead ones, ones that
// answer with errors. Read them to see every way a network call can fail.

import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { deadUrl, listen } from "../../../test-utils";
import { setServiceUrls } from "../config";
import { callService, UpstreamError } from "./http";

const context = { userId: 7, requestId: "req-123" };
const closers: (() => Promise<void>)[] = [];
afterEach(async () => {
  await Promise.all(closers.splice(0).map((close) => close()));
});

/** Starts `app` and makes it the "movies" service for this test. */
async function fakeMovies(app: express.Express) {
  const { url, close } = await listen(app);
  closers.push(close);
  setServiceUrls({ movies: url });
}

describe("callService", () => {
  it("returns the parsed JSON body", async () => {
    const app = express();
    app.get("/showtimes/1", (_req, res) => {
      res.json({ id: 1, movieTitle: "Test" });
    });
    await fakeMovies(app);

    await expect(callService(context, "movies", "/showtimes/1")).resolves.toEqual({ id: 1, movieTitle: "Test" });
  });

  it("sends the method and a JSON body, and forwards x-user-id and x-request-id", async () => {
    const app = express();
    app.use(express.json());
    app.post("/echo", (req, res) => {
      res.json({
        method: req.method,
        body: req.body,
        userId: req.header("x-user-id"),
        requestId: req.header("x-request-id"),
      });
    });
    await fakeMovies(app);

    const echoed = await callService(context, "movies", "/echo", { method: "POST", body: { seats: ["A1"] } });
    expect(echoed).toEqual({ method: "POST", body: { seats: ["A1"] }, userId: "7", requestId: "req-123" });
  });

  it("returns undefined for a 204 No Content", async () => {
    const app = express();
    app.delete("/thing", (_req, res) => {
      res.status(204).end();
    });
    await fakeMovies(app);

    await expect(callService(context, "movies", "/thing", { method: "DELETE" })).resolves.toBeUndefined();
  });

  it("turns an error response into an UpstreamError with the same status and message", async () => {
    const app = express();
    app.get("/busy", (_req, res) => {
      res.status(409).json({ error: "seat A1 is already taken" });
    });
    await fakeMovies(app);

    const err = await callService(context, "movies", "/busy").catch((e) => e);
    expect(err).toBeInstanceOf(UpstreamError);
    expect(err).toMatchObject({ status: 409, service: "movies", message: "seat A1 is already taken" });
  });

  it("throws a 503 UpstreamError when the service is unreachable", async () => {
    setServiceUrls({ movies: await deadUrl() });

    const err = await callService(context, "movies", "/showtimes/1").catch((e) => e);
    expect(err).toBeInstanceOf(UpstreamError);
    expect(err).toMatchObject({ status: 503, service: "movies" });
  });

  it("throws a 504 UpstreamError when the service is slower than timeoutMs", async () => {
    const app = express();
    app.get("/slow", (_req, res) => {
      setTimeout(() => res.json({ ok: true }), 1000);
    });
    await fakeMovies(app);

    const started = Date.now();
    const err = await callService(context, "movies", "/slow", { timeoutMs: 200 }).catch((e) => e);
    expect(err).toBeInstanceOf(UpstreamError);
    expect(err).toMatchObject({ status: 504, service: "movies" });
    expect(Date.now() - started).toBeLessThan(900); // gave up, didn't wait the full second
  });

  it("times out after 3 seconds by default", async () => {
    const app = express();
    app.get("/very-slow", (_req, res) => {
      setTimeout(() => res.json({ ok: true }), 5000);
    });
    await fakeMovies(app);

    const started = Date.now();
    const err = await callService(context, "movies", "/very-slow").catch((e) => e);
    expect(err).toMatchObject({ status: 504 });
    expect(Date.now() - started).toBeGreaterThanOrEqual(2900);
    expect(Date.now() - started).toBeLessThan(4500);
  }, 10_000);
});
