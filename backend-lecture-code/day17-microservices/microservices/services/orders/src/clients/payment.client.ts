import { callService, Ctx } from "./http";

export type Payment = { id: number; status: string };

export const paymentClient = {
  charge: (ctx: Ctx, orderId: number, amount: number) =>
    callService<Payment>(ctx, "payments", "/internal/payments/charges", {
      method: "POST",
      body: { orderId, userId: ctx.userId, amount },
    }),
};
