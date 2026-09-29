// REFERENCE — these already pass. They show the testing pattern the other
// test files use: start the whole system, call a service, check the answer.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { api, startSystem } from "../../test-utils";

let system: Awaited<ReturnType<typeof startSystem>>;
beforeEach(async () => {
  system = await startSystem();
});
afterEach(() => system.stop());

describe("movies service", () => {
  it("lists every showtime", async () => {
    const res = await api(system.urls.movies, "GET", "/showtimes");
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(3);
  });

  it("returns one showtime", async () => {
    const res = await api(system.urls.movies, "GET", "/showtimes/1");
    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ id: 1, movieTitle: "Dune: Part Three", price: 15 });
  });

  it("404s a showtime that doesn't exist", async () => {
    const res = await api(system.urls.movies, "GET", "/showtimes/999");
    expect(res.status).toBe(404);
  });
});
