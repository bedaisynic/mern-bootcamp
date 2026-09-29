// given — every service behind the gateway trusts the x-user-id header,
// because only the gateway can reach them and only the gateway sets it.

import type { Request } from "express";
import { HttpError } from "./http-error";

export function requireUserId(req: Request): number {
  const userId = Number(req.header("x-user-id"));
  if (!Number.isInteger(userId) || userId < 1) {
    throw new HttpError(401, "missing x-user-id: call this through the gateway");
  }
  return userId;
}
