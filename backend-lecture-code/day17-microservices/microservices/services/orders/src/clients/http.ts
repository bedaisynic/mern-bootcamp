// The one helper every client uses. This is what replaced the monolith's
// in-process function call, and everything that comes with the network.

const URLS = {
  users: process.env.USERS_URL ?? "http://localhost:4101",
  catalog: process.env.CATALOG_URL ?? "http://localhost:4102",
  inventory: process.env.INVENTORY_URL ?? "http://localhost:4103",
  cart: process.env.CART_URL ?? "http://localhost:4104",
  payments: process.env.PAYMENTS_URL ?? "http://localhost:4106",
  notifications: process.env.NOTIFICATIONS_URL ?? "http://localhost:4107",
};
export type ServiceName = keyof typeof URLS;

/** Who is asking. Passed along on every downstream call. */
export type Ctx = { requestId: string; userId: number };

/** A downstream service failed, timed out, or couldn't be reached. */
export class UpstreamError extends Error {
  constructor(
    public status: number,
    public service: ServiceName,
    message: string
  ) {
    super(message);
  }
}

type CallOptions = { method?: string; body?: unknown; timeoutMs?: number };

export async function callService<T>(
  ctx: Ctx,
  service: ServiceName,
  path: string,
  { method = "GET", body, timeoutMs = 3000 }: CallOptions = {}
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(URLS[service] + path, {
      method,
      headers: {
        "content-type": "application/json",
        "x-request-id": ctx.requestId, // the same id, all the way down the chain
        "x-user-id": String(ctx.userId),
      },
      body: body === undefined ? undefined : JSON.stringify(body),
      // Every network call gets a timeout. Without one, a slow service holds
      // this request, and the one calling us, open indefinitely.
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch (err) {
    const timedOut = err instanceof Error && err.name === "TimeoutError";
    throw new UpstreamError(
      timedOut ? 504 : 503,
      service,
      timedOut ? `${service} timed out after ${timeoutMs}ms` : `${service} is unreachable`
    );
  }
  if (res.status === 204) return undefined as T;
  const data = (await res.json().catch(() => ({}))) as { error?: string };
  if (!res.ok) throw new UpstreamError(res.status, service, data.error ?? `${service} responded ${res.status}`);
  return data as T;
}
