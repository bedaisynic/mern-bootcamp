// given — never edit this file, but do read it. callService() is the bookings
// service's only way to talk to another service. In a monolith this would be
// a plain function call; here it's an HTTP request that can fail, hang, or be
// refused, and this is where all of that gets handled once, for every client
// in this folder.

import { HttpError } from "../../../lib/http-error";
import { ServiceName, serviceUrls } from "../config";

/** Who is asking. Passed along on every call to another service. */
export type RequestContext = { userId: number; requestId: string };

/** Another service failed, timed out, or couldn't be reached. */
export class UpstreamError extends HttpError {
  constructor(status: number, service: ServiceName, message: string) {
    super(status, message, service);
  }
}

export type CallOptions = { method?: string; body?: unknown; timeoutMs?: number };

/**
 * Calls another service and returns its JSON response.
 *
 *   callService<Showtime>(context, "movies", "/showtimes/1")
 *   callService<Charge>(context, "payments", "/internal/payments/charges", { method: "POST", body: {...} })
 *
 * If the other service answers with an error, or can't be reached, this
 * throws an UpstreamError. You don't need to catch it: let it propagate and
 * the error handler sends the same status and message to the customer.
 */
export async function callService<T>(
  context: RequestContext,
  service: ServiceName,
  path: string,
  options: CallOptions = {}
): Promise<T> {
  const { method = "GET", body, timeoutMs = 3000 } = options;

  let res: Response;
  try {
    res = await fetch(serviceUrls[service] + path, {
      method,
      headers: {
        "content-type": "application/json",
        // The caller's identity travels with every call, so the next service
        // knows who's asking, and the same request id shows up in every log.
        "x-user-id": String(context.userId),
        "x-request-id": context.requestId,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // Every network call gets a timeout. Without one, a slow service would
      // hold this request, and the customer's, open indefinitely.
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    // fetch() itself threw, so there was never an answer at all.
    if (err instanceof Error && err.name === "TimeoutError") {
      throw new UpstreamError(504, service, `${service} timed out after ${timeoutMs}ms`);
    }
    throw new UpstreamError(503, service, `${service} is unreachable`); // e.g. connection refused
  }

  // 204 No Content: nothing to parse.
  if (res.status === 204) return undefined as T;

  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) {
    // The other service said no. Keep ITS status and message, so a 409 "seat
    // C4 is already taken" from seats reaches the customer as exactly that.
    throw new UpstreamError(res.status, service, data.error ?? `${service} responded ${res.status}`);
  }
  return data as T;
}
