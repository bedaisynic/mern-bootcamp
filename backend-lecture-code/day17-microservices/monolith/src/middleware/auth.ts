import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";

// Every module has to remember to put this in front of its private routes.
// Forget it once, in any module, and that route is public.
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;
  if (!token) {
    res.status(401).json({ error: "missing token" });
    return;
  }
  try {
    const claims = jwt.verify(token, JWT_SECRET) as { sub: string };
    res.locals.userId = Number(claims.sub);
    next();
  } catch {
    res.status(401).json({ error: "invalid token" });
  }
}
