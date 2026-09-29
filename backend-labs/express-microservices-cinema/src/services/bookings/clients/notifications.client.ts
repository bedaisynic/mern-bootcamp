// REFERENCE — fully implemented. See payments.client.ts for the pattern.

import type { Booking } from "../booking.repository";
import { callService, RequestContext } from "./http";

export const notificationsClient = {
  /**
   * POST /internal/notifications/emails on notifications. Returns nothing
   * useful, so the type is `void`. A shorter timeout than the default: an
   * email isn't worth waiting 3 seconds for.
   */
  async sendBookingConfirmation(context: RequestContext, booking: Booking): Promise<void> {
    return callService<void>(context, "notifications", "/internal/notifications/emails", {
      method: "POST",
      body: {
        userId: context.userId,
        subject: `Booking #${booking.id} confirmed`,
        body: `${booking.movieTitle}, seats ${booking.seats.join(", ")}, total $${booking.total}`,
      },
      timeoutMs: 2000,
    });
  },
};
