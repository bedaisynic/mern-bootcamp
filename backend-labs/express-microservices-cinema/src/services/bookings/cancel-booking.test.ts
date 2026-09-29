// Spec for exercise 4 (challenge): bookingService.cancelBooking().
// Exercises 1 and 2 must be done first.

import express from "express";
import { afterEach, describe, expect, it } from "vitest";
import { api, startSystem } from "../../test-utils";

let system: Awaited<ReturnType<typeof startSystem>>;
afterEach(() => system?.stop());

const book = (userId: number, showtimeId: number, seats: string[]) =>
  api(system.urls.bookings, "POST", "/bookings", { userId, body: { showtimeId, seats } });

const cancel = (userId: number, id: number) =>
  api(system.urls.bookings, "POST", `/bookings/${id}/cancel`, { userId });

const takenSeats = async (showtimeId: number): Promise<string[]> =>
  (await api(system.urls.seats, "GET", `/seats/${showtimeId}`)).body.taken;

describe("POST /bookings/:id/cancel", () => {
  it("refunds the payment, releases the seats, and marks the booking cancelled", async () => {
    system = await startSystem();
    const { body: booking } = await book(1, 1, ["B1", "B2"]);
    const res = await cancel(1, booking.id);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("cancelled");
    expect(await takenSeats(1)).not.toContain("B1");
    expect(system.calls.payments).toContainEqual(
      expect.objectContaining({ method: "POST", path: `/internal/payments/${booking.paymentId}/refund` })
    );
  });

  it("404s someone else's booking", async () => {
    system = await startSystem();
    const { body: booking } = await book(1, 1, ["B1"]);

    expect((await cancel(2, booking.id)).status).toBe(404);
  });

  it("409s a booking that's already cancelled", async () => {
    system = await startSystem();
    const { body: booking } = await book(1, 1, ["B1"]);
    await cancel(1, booking.id);

    expect((await cancel(1, booking.id)).status).toBe(409);
  });

  it("409s a booking whose payment failed (there's nothing to refund)", async () => {
    system = await startSystem();
    await book(1, 2, ["A1", "A2"]); // declined
    const { body: mine } = await api(system.urls.bookings, "GET", "/bookings", { userId: 1 });

    expect((await cancel(1, mine[0].id)).status).toBe(409);
  });
});

describe("POST /bookings/:id/cancel — when a step fails", () => {
  it("if the refund fails, changes nothing: the booking stays confirmed and the seats stay held", async () => {
    const brokenRefunds = express();
    brokenRefunds.use(express.json());
    brokenRefunds.post("/internal/payments/charges", (_req, res) => {
      res.status(201).json({ id: 1, status: "approved" });
    });
    brokenRefunds.post("/internal/payments/:id/refund", (_req, res) => {
      res.status(503).json({ error: "card processor unavailable" });
    });
    system = await startSystem({ replace: { payments: brokenRefunds } });

    const { body: booking } = await book(1, 1, ["B1"]);
    const res = await cancel(1, booking.id);

    expect(res.status).toBe(503);
    const after = await api(system.urls.bookings, "GET", `/bookings/${booking.id}`, { userId: 1 });
    expect(after.body.status).toBe("confirmed");
    expect(await takenSeats(1)).toContain("B1");
  });

  it("if releasing the seats fails after the refund, the booking is still cancelled", async () => {
    const brokenRelease = express();
    brokenRelease.use(express.json());
    brokenRelease.post("/internal/seats/holds", (_req, res) => {
      res.status(201).json({ holdId: 1 });
    });
    brokenRelease.delete("/internal/seats/holds/:id", (_req, res) => {
      res.status(500).json({ error: "seats database unavailable" });
    });
    system = await startSystem({ replace: { seats: brokenRelease } });

    const { body: booking } = await book(1, 1, ["B1"]);
    const res = await cancel(1, booking.id);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("cancelled");
  });
});
