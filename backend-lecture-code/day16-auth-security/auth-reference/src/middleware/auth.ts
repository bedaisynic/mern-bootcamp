import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { users, Role, User, Order } from "../db";
import { can } from "../policy/engine";
import type { Action } from "../policy/policies";

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
}

// Lets every route handler read req.user with a real type.
declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

// AUTHENTICATION: "who are you?" Failure is a 401.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // The client sends: Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing token" });
  }
  const token = header.slice("Bearer ".length);

  try {
    // jwt.verify recomputes the signature from the token's header + payload + OUR secret,
    // and compares it to the signature on the token. It also rejects an expired `exp`.
    // Notice there is no database lookup here: a valid signature is all we need.
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = { id: Number(payload.sub), email: payload.email, role: payload.role };
    next();
  } catch {
    res.status(401).json({ message: "Invalid or expired token" });
  }
}

// The token only carries id, email and role. The attributes the policy engine needs (region,
// approval limit, direct grants) are read from the database on every request, so changing them
// takes effect immediately, without waiting for the user's token to expire.
export function currentUser(req: Request): User | undefined {
  return users.find((u) => u.id === req.user!.id);
}

// AUTHORIZATION: "are you allowed to do this?" Failure is a 403.
// Always runs after requireAuth, so req.user is already set.
// The route names the action; the policy engine decides. For an action on one specific order,
// pass loadOrder so the engine can check the order's attributes too.
export function authorize(action: Action, loadOrder?: (req: Request) => Order | undefined) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = currentUser(req);
    if (!user) return res.status(401).json({ message: "Account no longer exists" });

    let order: Order | undefined;
    if (loadOrder) {
      order = loadOrder(req);
      if (!order) return res.status(404).json({ message: "Not found" });
      res.locals.order = order; // the handler reuses it instead of looking it up again
    }

    const decision = can(user, action, order);
    if (!decision.allowed) {
      // The reason is sent back so you can watch the engine decide during the lecture.
      // A real API would log it and send only "Forbidden".
      return res.status(403).json({ message: "Forbidden", reason: decision.reason });
    }
    next();
  };
}
