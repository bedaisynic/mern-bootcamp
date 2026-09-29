// YOUR TASK — exercise 1, part 1 (start here). Read payments.client.ts first:
// this client is the same shape. Spec: clients.test.ts.

import { callService, RequestContext } from "./http";

/** given — what the movies service sends back for one showtime. */
export type Showtime = { id: number; movieTitle: string; startsAt: string; price: number };

export const moviesClient = {
  async getShowtime(context: RequestContext, showtimeId: number): Promise<Showtime> {
    // TODO: call GET /showtimes/:showtimeId on the "movies" service with
    // callService<Showtime>(...) and return the result. A GET needs no
    // options. If the showtime doesn't exist, movies answers 404 and
    // callService throws it for you: nothing to catch here.
    throw new Error("not implemented");
  },
};
