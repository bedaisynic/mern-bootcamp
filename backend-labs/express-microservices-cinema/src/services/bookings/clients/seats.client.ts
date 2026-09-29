// YOUR TASK — exercise 1, part 2. Same shape as payments.client.ts. The two
// endpoints you're calling are listed under "Internal endpoints" in
// ADDITIONAL_INFO.md. Spec: clients.test.ts.

import { callService, RequestContext } from "./http";

export const seatsClient = {
  /** Holds every seat or none. Returns the hold id you need to release them later. */
  async hold(context: RequestContext, showtimeId: number, seats: string[]): Promise<number> {
    // TODO:
    //   1. POST /internal/seats/holds on the "seats" service, with the body
    //      { showtimeId, seats }. It answers 201 { holdId }, so the type you
    //      pass to callService is { holdId: number }.
    //   2. Return just the holdId number, not the whole object.
    // A taken seat makes seats answer 409, and callService throws it for you.
    throw new Error("not implemented");
  },

  /** Puts held seats back on sale. Safe to call twice. */
  async release(context: RequestContext, holdId: number): Promise<void> {
    // TODO: DELETE /internal/seats/holds/:holdId on the "seats" service. No
    // body. It answers 204 No Content, so the type is `void` and there's
    // nothing to return.
    throw new Error("not implemented");
  },
};
