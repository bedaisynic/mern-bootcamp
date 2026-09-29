// given

import { HttpError } from "../../lib/http-error";
import { Hold, seatRepository } from "./seat.repository";

// Every hall has rows A–E and seats 1–8: A1 … E8.
const SEAT_PATTERN = /^[A-E][1-8]$/;

export const seatService = {
  async getSeatMap(showtimeId: number) {
    return { showtimeId, taken: seatRepository.takenSeats(showtimeId).sort() };
  },

  // Holds every seat or none. Seats doesn't know which showtimes exist; that's
  // the movies service's data. Checking the showtime is the caller's job.
  async hold(showtimeId: unknown, seats: unknown): Promise<Hold> {
    if (!Number.isInteger(showtimeId) || (showtimeId as number) < 1) {
      throw new HttpError(400, "showtimeId must be a positive integer");
    }
    if (!Array.isArray(seats) || seats.length === 0) {
      throw new HttpError(400, "seats must be a non-empty array");
    }
    for (const seat of seats) {
      if (typeof seat !== "string" || !SEAT_PATTERN.test(seat)) {
        throw new HttpError(400, `seat ${String(seat)} doesn't exist (valid seats are A1–E8)`);
      }
    }
    if (new Set(seats).size !== seats.length) throw new HttpError(400, "the same seat is listed twice");

    // No await between this check and create(), so two requests can never
    // both grab the same seat.
    const taken = new Set(seatRepository.takenSeats(showtimeId as number));
    const clash = (seats as string[]).find((s) => taken.has(s));
    if (clash) throw new HttpError(409, `seat ${clash} is already taken`);
    return seatRepository.create(showtimeId as number, seats as string[]);
  },

  // Releasing twice is fine: the second call does nothing.
  async release(holdId: number): Promise<void> {
    if (!seatRepository.findById(holdId)) throw new HttpError(404, `hold ${holdId} not found`);
    seatRepository.markReleased(holdId);
  },
};
