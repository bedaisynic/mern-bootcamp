import { Db } from "../../db";
import { HttpError } from "../../shared/errors";
import { Payment } from "../../shared/types";
import { paymentRepository } from "./payment.repository";

const DECLINE_ABOVE = 5000;

export const paymentService = {
  // A fake card processor: anything over $5,000 is declined.
  async charge(orderId: number, amount: number, db?: Db): Promise<Payment> {
    if (amount > DECLINE_ABOVE) throw new HttpError(402, `payment of $${amount} declined`);
    return paymentRepository.create(orderId, amount, "approved", db);
  },

  async getPayment(id: number, userId: number): Promise<Payment> {
    const payment = await paymentRepository.findByIdForUser(id, userId);
    if (!payment) throw new HttpError(404, `payment ${id} not found`);
    return payment;
  },
};
