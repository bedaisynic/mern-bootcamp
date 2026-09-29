// given — a fake card processor.

import { HttpError } from "../../lib/http-error";
import { Charge, paymentRepository } from "./payment.repository";

const DECLINE_ABOVE = 100; // any charge over $100 is declined

// DEMO knob: make every charge take this long. See POST /payments/debug/slow.
let slowMs = 0;

export const paymentService = {
  async charge(bookingId: unknown, userId: unknown, amount: unknown): Promise<Charge> {
    if (!Number.isInteger(bookingId) || !Number.isInteger(userId) || typeof amount !== "number" || amount <= 0) {
      throw new HttpError(400, "bookingId, userId (integers) and a positive amount are required");
    }
    if (slowMs > 0) await new Promise((resolve) => setTimeout(resolve, slowMs));

    const status = amount > DECLINE_ABOVE ? "declined" : "approved";
    const charge = paymentRepository.create({
      bookingId: bookingId as number,
      userId: userId as number,
      amount,
      status,
    });
    if (status === "declined") throw new HttpError(402, `payment of $${amount} declined`);
    return charge;
  },

  async refund(id: number): Promise<Charge> {
    const charge = paymentRepository.findById(id);
    if (!charge) throw new HttpError(404, `payment ${id} not found`);
    if (charge.status !== "approved") {
      throw new HttpError(409, `payment ${id} is ${charge.status}, only approved payments can be refunded`);
    }
    return paymentRepository.markRefunded(id);
  },

  setSlow(ms: number): number {
    slowMs = Math.max(0, ms);
    return slowMs;
  },
};
