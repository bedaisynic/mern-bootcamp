// Spec for exercise 1: movies.client.ts and seats.client.ts. All of these
// fail until both clients are written. They call the real movies and seats
// services (started fresh for every test) through your clients.

import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { api, startSystem } from "../../../test-utils";
import { RequestContext, UpstreamError } from "./http";
import { moviesClient } from "./movies.client";
import { seatsClient } from "./seats.client";

let system: Awaited<ReturnType<typeof startSystem>>;
beforeEach(async () => {
  system = await startSystem(); // also points the clients at these services
});
afterEach(() => system.stop());

const context: RequestContext = { userId: 7, requestId: "req-123" };

const takenSeats = async (showtimeId: number): Promise<string[]> =>
  (await api(system.urls.seats, "GET", `/seats/${showtimeId}`)).body.taken;

describe("moviesClient.getShowtime", () => {
  it("returns the showtime from the movies service", async () => {
    const showtime = await moviesClient.getShowtime(context, 1);

    expect(showtime).toMatchObject({ id: 1, movieTitle: "Dune: Part Three", price: 15 });
  });

  it("calls GET /showtimes/:id on movies, as the caller", async () => {
    await moviesClient.getShowtime(context, 3);

    expect(system.calls.movies).toEqual([
      { method: "GET", path: "/showtimes/3", userId: "7", requestId: "req-123" },
    ]);
  });

  it("throws movies' 404 for a showtime that doesn't exist", async () => {
    const err = await moviesClient.getShowtime(context, 999).catch((e) => e);

    expect(err).toBeInstanceOf(UpstreamError);
    expect(err).toMatchObject({ status: 404, service: "movies" });
  });
});

describe("seatsClient.hold", () => {
  it("holds the seats and returns the hold id as a number", async () => {
    const holdId = await seatsClient.hold(context, 1, ["A1", "A2"]);

    expect(holdId).toEqual(expect.any(Number));
    expect(await takenSeats(1)).toEqual(expect.arrayContaining(["A1", "A2"]));
  });

  it("calls POST /internal/seats/holds on seats, as the caller", async () => {
    await seatsClient.hold(context, 1, ["A1"]);

    expect(system.calls.seats[0]).toEqual({
      method: "POST",
      path: "/internal/seats/holds",
      userId: "7",
      requestId: "req-123",
    });
  });

  it("throws seats' 409 when a seat is already taken", async () => {
    const err = await seatsClient.hold(context, 1, ["C4"]).catch((e) => e); // C4 is sold in the seed data

    expect(err).toBeInstanceOf(UpstreamError);
    expect(err).toMatchObject({ status: 409, service: "seats", message: "seat C4 is already taken" });
  });
});

describe("seatsClient.release", () => {
  it("puts the seats back on sale", async () => {
    const holdId = await seatsClient.hold(context, 1, ["A1"]);
    await seatsClient.release(context, holdId);

    expect(await takenSeats(1)).not.toContain("A1");
  });

  it("calls DELETE /internal/seats/holds/:id on seats, and returns nothing", async () => {
    const holdId = await seatsClient.hold(context, 1, ["A1"]);
    const result = await seatsClient.release(context, holdId);

    expect(result).toBeUndefined();
    expect(system.calls.seats[1]).toMatchObject({ method: "DELETE", path: `/internal/seats/holds/${holdId}` });
  });

  it("throws seats' 404 for a hold that doesn't exist", async () => {
    const err = await seatsClient.release(context, 999).catch((e) => e);

    expect(err).toMatchObject({ status: 404, service: "seats" });
  });
});
