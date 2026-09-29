// YOUR TASK — exercise 2 (createBooking) and exercise 4, the challenge
// (cancelBooking). listBookings and getBooking are given.
//
// Booking a seat needs data owned by four other services. You can't import
// their code or read their data: the only way in is the clients in
// ./clients, and every client call is a network request (see clients/http.ts).
//
// That changes two things compared with a monolith:
//   - There is no transaction across services. When a later step fails, the
//     earlier steps have ALREADY happened in the other services, and you have
//     to undo them yourself: a "compensating action".
//   - Any call can fail. Throw errors from the clients straight through (the
//     error handler sends their status + message), except where a TODO says
//     to catch them.
//
// Specs: create-booking.test.ts and cancel-booking.test.ts.

import { HttpError } from "../../lib/http-error";
import { RequestContext } from "./clients/http";
import { moviesClient } from "./clients/movies.client";
import { notificationsClient } from "./clients/notifications.client";
import { paymentsClient } from "./clients/payments.client";
import { seatsClient } from "./clients/seats.client";
import { Booking, bookingRepository } from "./booking.repository";
import type { CreateBookingBody } from "./booking.validation";

export const bookingService = {
  async createBooking(context: RequestContext, input: CreateBookingBody): Promise<Booking> {
    // TODO, in order:
    //   1. Get the showtime from the movies service (moviesClient). Doesn't
    //      exist? The client already throws a 404 for you. This comes first so
    //      nothing is held or charged for a showtime that isn't real.
    //

    //   2. Hold the seats (seatsClient.hold). You get back a holdId: keep it,
    //      it's the only way to release these seats later. Taken seats → the
    //      client throws seats' 409, and you never reach the payment step.
    //
    //   3. Save the booking as pending (bookingRepository.createPending),
    //      copying what you need from the showtime into it: this service
    //      can't JOIN to the movies data later. total = price × number of seats.
    //
    //   4. Charge the card (paymentsClient.charge) for the total. If the charge
    //      fails for ANY reason (declined, payments down, too slow), before
    //      rethrowing the error:
    //        - release the seats you held in step 2 (they were already
    //          committed in the seats service; nothing undoes them for you).
    //          If the release itself fails, log it and carry on: the customer
    //          should still get the payment error, not a seats error.
    //        - mark the booking payment_failed
    //
    //   5. Mark the booking confirmed with the payment's id, and return it.
    //
    //   6. Send the confirmation email (notificationsClient), but DON'T
    //      await it: the booking is already done, and a slow or broken email
    //      service must neither delay nor fail it. Add a .catch() that logs,
    //      so a failed email doesn't crash the process.
    throw new Error("not implemented");
  },

  // given
  async listBookings(context: RequestContext): Promise<Booking[]> {
    return bookingRepository.findByUser(context.userId);
  },

  // given
  async getBooking(context: RequestContext, id: number): Promise<Booking> {
    const booking = bookingRepository.findByIdForUser(id, context.userId);
    if (!booking) throw new HttpError(404, `booking ${id} not found`);
    return booking;
  },

  async cancelBooking(context: RequestContext, id: number): Promise<Booking> {
    // CHALLENGE (exercise 4). The rules:
    //   - Only the booking's owner can cancel it (404 for anyone else).
    //   - Only a "confirmed" booking can be cancelled (409 otherwise).
    //   - Cancelling refunds the payment (paymentsClient.refund), releases
    //     the seats (seatsClient.release), and marks the booking cancelled.
    //
    // The hard part: two other services each have to undo something, and
    // either call can fail after the other one already succeeded. Which
    // step should go first, and which failure should stop the cancellation?
    // The last two tests in cancel-booking.test.ts pin down the answer —
    // think about which half-finished state is worse for the customer.
    throw new Error("not implemented");
  },
};
