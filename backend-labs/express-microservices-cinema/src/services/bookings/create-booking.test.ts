// Spec for exercise 2: bookingService.createBooking(). These call the
// bookings service directly (not through the gateway), sending x-user-id
// the way the gateway would. Exercise 1 must be done first.

import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { api, sleep, startSystem } from "../../test-utils";

let system: Awaited<ReturnType<typeof startSystem>>;
afterEach(() => system?.stop());

const book = (userId: number, body: unknown, headers?: Record<string, string>) =>
  api(system.urls.bookings, "POST", "/bookings", { userId, body, headers });

const takenSeats = async (showtimeId: number): Promise<string[]> =>
  (await api(system.urls.seats, "GET", `/seats/${showtimeId}`)).body.taken;

describe("POST /bookings — the happy path", () => {
  it("confirms the booking and keeps a snapshot of the showtime", async () => {
    system = await startSystem();
    const res = await book(1, { showtimeId: 1, seats: ["A1", "A2"] });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      userId: 1,
      showtimeId: 1,
      movieTitle: "Dune: Part Three",
      startsAt: "2026-10-02T19:00:00.000Z",
      seats: ["A1", "A2"],
      total: 30,
      status: "confirmed",
    });
    expect(res.body.paymentId).toEqual(expect.any(Number));
    expect(res.body.holdId).toEqual(expect.any(Number));
  });

  it("holds the seats in the seats service", async () => {
    system = await startSystem();
    await book(1, { showtimeId: 1, seats: ["A1", "A2"] });

    expect(await takenSeats(1)).toEqual(expect.arrayContaining(["A1", "A2"]));
  });

  it("calls movies, then seats, then payments, passing along the user id and request id", async () => {
    system = await startSystem();
    await book(1, { showtimeId: 1, seats: ["A1"] }, { "x-request-id": "req-abc" });

    const { movies, seats, payments } = system.calls;
    expect(movies[0]).toMatchObject({ method: "GET", path: "/showtimes/1", userId: "1", requestId: "req-abc" });
    expect(seats[0]).toMatchObject({ method: "POST", path: "/internal/seats/holds", userId: "1", requestId: "req-abc" });
    expect(payments[0]).toMatchObject({ method: "POST", path: "/internal/payments/charges", userId: "1", requestId: "req-abc" });
  });

  it("sends a confirmation email", async () => {
    system = await startSystem();
    const { body: booking } = await book(1, { showtimeId: 1, seats: ["A1"] });
    await sleep(200);

    const emails = await api(system.urls.notifications, "GET", "/notifications", { userId: 1 });
    expect(emails.body).toHaveLength(1);
    expect(emails.body[0].subject).toContain(`#${booking.id}`);
  });
});

describe("POST /bookings — when a step fails", () => {
  it("404s a showtime that doesn't exist, before holding seats or charging", async () => {
    system = await startSystem();
    const res = await book(1, { showtimeId: 999, seats: ["A1"] });

    expect(res.status).toBe(404);
    expect(res.body.service).toBe("movies");
    expect(system.calls.seats).toHaveLength(0);
    expect(system.calls.payments).toHaveLength(0);
  });

  it("409s when a seat is already taken, and never charges the card", async () => {
    system = await startSystem();
    const res = await book(1, { showtimeId: 1, seats: ["C3", "C4"] }); // C4 is sold in the seed data

    expect(res.status).toBe(409);
    expect(res.body).toMatchObject({ error: "seat C4 is already taken", service: "seats" });
    expect(system.calls.payments).toHaveLength(0);
  });

  it("passes the seats service's 400 through for a seat that doesn't exist", async () => {
    system = await startSystem();
    const res = await book(1, { showtimeId: 1, seats: ["Z9"] });

    expect(res.status).toBe(400);
    expect(res.body.service).toBe("seats");
  });

  it("402s when the card is declined, releases the seats, and records payment_failed", async () => {
    system = await startSystem();
    const res = await book(1, { showtimeId: 2, seats: ["A1", "A2"] }); // 2 × $60 = $120, over the $100 limit

    expect(res.status).toBe(402);
    expect(res.body.service).toBe("payments");
    expect(await takenSeats(2)).not.toContain("A1");
    const mine = await api(system.urls.bookings, "GET", "/bookings", { userId: 1 });
    expect(mine.body[0]).toMatchObject({ showtimeId: 2, status: "payment_failed" });
  });

  it("503s when payments is down, and releases the seats", async () => {
    system = await startSystem({ replace: { payments: "down" } });
    const res = await book(1, { showtimeId: 1, seats: ["A1"] });

    expect(res.status).toBe(503);
    expect(await takenSeats(1)).not.toContain("A1");
  });

  it("504s when payments is too slow, and releases the seats", async () => {
    system = await startSystem();
    await api(system.urls.payments, "POST", "/payments/debug/slow", { body: { ms: 5000 } });
    const res = await book(1, { showtimeId: 1, seats: ["A1"] });

    expect(res.status).toBe(504);
    expect(await takenSeats(1)).not.toContain("A1");
  }, 10_000);

  it("still confirms the booking when notifications is down", async () => {
    system = await startSystem({ replace: { notifications: "down" } });
    const res = await book(1, { showtimeId: 1, seats: ["A1"] });

    expect(res.status).toBe(201);
    expect(res.body.status).toBe("confirmed");
  });

  it("doesn't wait for the confirmation email to be sent", async () => {
    const slowNotifications = express();
    slowNotifications.post("/internal/notifications/emails", (_req, res) => {
      setTimeout(() => res.status(201).json({}), 1500);
    });
    system = await startSystem({ replace: { notifications: slowNotifications } });

    const started = Date.now();
    const res = await book(1, { showtimeId: 1, seats: ["A1"] });
    expect(res.status).toBe(201);
    expect(Date.now() - started).toBeLessThan(1000);
  });
});

describe("GET /bookings", () => {
  it("lists only my bookings, and 404s someone else's", async () => {
    system = await startSystem();
    const { body: alices } = await book(1, { showtimeId: 1, seats: ["A1"] });
    await book(2, { showtimeId: 1, seats: ["A2"] });

    const mine = await api(system.urls.bookings, "GET", "/bookings", { userId: 1 });
    expect(mine.body.map((b: { id: number }) => b.id)).toEqual([alices.id]);
    const theirs = await api(system.urls.bookings, "GET", `/bookings/${alices.id}`, { userId: 2 });
    expect(theirs.status).toBe(404);
  });
});
