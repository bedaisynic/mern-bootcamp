// REFERENCE — fully implemented. Read this (and notifications.client.ts)
// before writing movies.client.ts and seats.client.ts: every client is the
// same shape. Each method is one call to callService() with:
//   - the service's name ("payments")
//   - the path on that service
//   - for anything but a GET: the method, and the body to send

import { callService, RequestContext } from "./http";

export type Charge = { id: number; status: "approved" | "declined" | "refunded" };

export const paymentsClient = {
  /** POST /internal/payments/charges on payments. Declined → throws payments' 402. */
  async charge(context: RequestContext, bookingId: number, amount: number): Promise<Charge> {
    return callService<Charge>(context, "payments", "/internal/payments/charges", {
      method: "POST",
      body: { bookingId, userId: context.userId, amount },
    });
  },

  /** POST /internal/payments/:paymentId/refund on payments. No body needed. */
  async refund(context: RequestContext, paymentId: number): Promise<Charge> {
    return callService<Charge>(context, "payments", `/internal/payments/${paymentId}/refund`, {
      method: "POST",
    });
  },
};
