import { callService, Ctx } from "./http";

export const notificationClient = {
  sendOrderConfirmation: (ctx: Ctx, to: string, order: { id: number; total: number }) =>
    callService<void>(ctx, "notifications", "/internal/notifications/emails", {
      method: "POST",
      body: {
        userId: ctx.userId,
        to,
        subject: `Order #${order.id} confirmed`,
        body: `Total $${order.total.toFixed(2)}`,
      },
      timeoutMs: 2000,
    }),
};
