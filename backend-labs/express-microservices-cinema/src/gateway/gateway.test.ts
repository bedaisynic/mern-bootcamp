// Spec for exercise 3: buildForwardHeaders() in auth.ts. These go through
// the gateway, and only use the movies and notifications services, which
// already work, so you can do this exercise before or after 1 and 2.

import { afterEach, describe, expect, it } from "vitest";
import { api, login, startSystem } from "../test-utils";

let system: Awaited<ReturnType<typeof startSystem>>;
afterEach(() => system?.stop());

const viaGateway = (method: string, path: string, options?: Parameters<typeof api>[3]) =>
  api(system.gatewayUrl, method, path, options);

describe("gateway — who is calling", () => {
  it("lets a public GET through without a token", async () => {
    system = await startSystem();
    const res = await viaGateway("GET", "/showtimes");

    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it("401s a private route without a token, without calling the service", async () => {
    system = await startSystem();
    const res = await viaGateway("GET", "/notifications");

    expect(res.status).toBe(401);
    expect(system.calls.notifications).toHaveLength(0);
  });

  it("401s an invalid token", async () => {
    system = await startSystem();
    const res = await viaGateway("GET", "/notifications", { token: "not-a-real-token" });

    expect(res.status).toBe(401);
  });

  it("forwards the user id from the token as x-user-id", async () => {
    system = await startSystem();
    const token = await login(system.gatewayUrl, "alice");
    const res = await viaGateway("GET", "/notifications", { token });

    expect(res.status).toBe(200);
    expect(system.calls.notifications[0].userId).toBe("1");
  });

  it("ignores an x-user-id header sent by the client", async () => {
    system = await startSystem();
    const token = await login(system.gatewayUrl, "alice");
    await viaGateway("GET", "/notifications", { token, headers: { "x-user-id": "2" } });

    expect(system.calls.notifications[0].userId).toBe("1"); // alice, from the token — not bob
  });

  it("rejects a forged x-user-id with no token", async () => {
    system = await startSystem();
    const res = await viaGateway("GET", "/notifications", { headers: { "x-user-id": "1" } });

    expect(res.status).toBe(401);
    expect(system.calls.notifications).toHaveLength(0);
  });

  it("doesn't send x-user-id on a public request without a token", async () => {
    system = await startSystem();
    await viaGateway("GET", "/showtimes", { headers: { "x-user-id": "1" } });

    expect(system.calls.movies[0].userId).toBeUndefined();
  });
});

describe("gateway — request ids", () => {
  it("keeps the client's x-request-id", async () => {
    system = await startSystem();
    await viaGateway("GET", "/showtimes", { headers: { "x-request-id": "req-from-client" } });

    expect(system.calls.movies[0].requestId).toBe("req-from-client");
  });

  it("creates an x-request-id when the client didn't send one", async () => {
    system = await startSystem();
    await viaGateway("GET", "/showtimes");

    expect(system.calls.movies[0].requestId).toEqual(expect.any(String));
    expect(system.calls.movies[0].requestId).not.toBe("");
  });
});

describe("gateway — routing", () => {
  it("404s paths no service owns, including /internal", async () => {
    system = await startSystem();
    const res = await viaGateway("POST", "/internal/seats/holds", { body: { showtimeId: 1, seats: ["A1"] } });

    expect(res.status).toBe(404);
    expect(system.calls.seats).toHaveLength(0);
  });

  it("502s when the service behind a route is down", async () => {
    system = await startSystem({ replace: { movies: "down" } });
    const res = await viaGateway("GET", "/showtimes");

    expect(res.status).toBe(502);
    expect(res.body.service).toBe("movies");
  });
});
