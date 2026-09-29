import { randomUUID } from "node:crypto";
import type { Request } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET ?? "cinema-lab-secret";

/** given — the demo users. Logging in takes just a name. */
export const USERS: Record<string, number> = { alice: 1, bob: 2, carol: 3 };

/** given — throw this and the gateway answers 401. */
export class UnauthorizedError extends Error {}

/** given */
export function signToken(userId: number): string {
  return jwt.sign({ sub: String(userId) }, JWT_SECRET, { expiresIn: "1h" });
}

/** given — the user id inside a valid `Bearer <token>` header, or null. */
export function verifyToken(authorizationHeader: string | undefined): number | null {
  const token = authorizationHeader?.startsWith("Bearer ") ? authorizationHeader.slice(7) : undefined;
  if (!token) return null;
  try {
    return Number((jwt.verify(token, JWT_SECRET) as { sub: string }).sub);
  } catch {
    return null;
  }
}

// YOUR TASK — exercise 3. The gateway calls this for every request it
// forwards, and sends ONLY the headers you return to the service. The
// services behind the gateway trust x-user-id completely, so this function
// is the one place that decides who the caller is.
//
// Spec: gateway.test.ts. Everything else in this file (and the whole
// gateway) is given.
export function buildForwardHeaders(req: Request, isPublic: boolean): Record<string, string> {
  // TODO:
  //   1. Build a NEW headers object from scratch. Never copy headers from
  //      `req`: a client could send its own x-user-id and pretend to be
  //      anyone.
  //   2. "x-request-id": keep the client's if it sent one
  //      (req.header("x-request-id")), otherwise make one with randomUUID().
  //   3. Check the token: verifyToken(req.header("authorization")).
  //        - valid → set "x-user-id" to that user id (as a string)
  //        - no valid token, and the route isn't public → throw
  //          new UnauthorizedError() (the gateway turns it into a 401)
  //        - no valid token on a public route → fine, just no x-user-id
  //   4. Return the headers.
  throw new Error("not implemented");
}
