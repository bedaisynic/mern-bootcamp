import crypto from "crypto";
import { Response } from "express";
import jwt from "jsonwebtoken";
import type { User } from "./db";

// Two tokens, two jobs:
//
//   access token   a JWT, ~15 min. Sent on every request, checked by signature alone (no lookup).
//                  Can't be revoked, so it's kept short: a leaked or stale one dies quickly.
//   refresh token  a random string, 7 days. Lives in an httpOnly cookie, only ever sent to /auth.
//                  Checked against the server's store every time, so it CAN be revoked.

const ACCESS_TOKEN_TTL = process.env.ACCESS_TOKEN_TTL || "15m";
const REFRESH_TOKEN_DAYS = 7;
const REFRESH_COOKIE = "refresh_token";

export function signAccessToken(user: User) {
  return jwt.sign({ sub: String(user.id), email: user.email, role: user.role }, process.env.JWT_SECRET!, {
    expiresIn: ACCESS_TOKEN_TTL as jwt.SignOptions["expiresIn"],
  });
}

// ---------------------------------------------------------------------------
// The refresh token store. This is server state again: the price of being able to revoke.
// ---------------------------------------------------------------------------

interface StoredRefreshToken {
  userId: number;
  familyId: string; // one login = one family; every rotated token from that login shares it
  expiresAt: number;
  used: boolean; // already swapped for a new one
}

// Keyed by a SHA-256 hash of the token, never the token itself: if this store leaked, the
// hashes would be useless to an attacker. (A fast hash is fine here; unlike a password, the
// token is long and random, so there's nothing to brute-force.)
const refreshTokens = new Map<string, StoredRefreshToken>();

const hash = (token: string) => crypto.createHash("sha256").update(token).digest("hex");

function issueRefreshToken(userId: number, familyId: string) {
  const token = crypto.randomBytes(32).toString("hex");
  refreshTokens.set(hash(token), {
    userId,
    familyId,
    expiresAt: Date.now() + REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
    used: false,
  });
  return token;
}

function revokeFamily(familyId: string) {
  for (const [key, stored] of refreshTokens) {
    if (stored.familyId === familyId) refreshTokens.delete(key);
  }
}

function setRefreshCookie(res: Response, token: string) {
  res.cookie(REFRESH_COOKIE, token, {
    httpOnly: true, // page JavaScript can't read it, so XSS can't steal it
    sameSite: "lax", // not sent on cross-site POSTs, which blocks CSRF against /auth/refresh
    secure: process.env.NODE_ENV === "production", // HTTPS only in production; localhost is plain http
    path: "/auth", // the browser only attaches it to /auth/* requests, not to every API call
    maxAge: REFRESH_TOKEN_DAYS * 24 * 60 * 60 * 1000,
  });
}

// Called at login and after Google login: starts a new family.
export function startRefreshFamily(res: Response, user: User) {
  setRefreshCookie(res, issueRefreshToken(user.id, crypto.randomUUID()));
}

// Called by POST /auth/refresh. Returns the user id if the token was good, and rotates it:
// the old token is spent, and a new one replaces it in the cookie.
export function rotateRefreshToken(res: Response, token: string | undefined): number | null {
  const stored = token ? refreshTokens.get(hash(token)) : undefined;
  if (!stored || stored.expiresAt < Date.now()) return null;

  // Reuse detection. A spent token should never come back. If it does, two parties hold copies
  // of it, and we can't tell which one is the real user. So we kill the whole family: the
  // attacker's copy stops working, and the real user just has to log in again.
  if (stored.used) {
    revokeFamily(stored.familyId);
    return null;
  }

  stored.used = true;
  setRefreshCookie(res, issueRefreshToken(stored.userId, stored.familyId));
  return stored.userId;
}

export function revokeRefreshToken(res: Response, token: string | undefined) {
  const stored = token ? refreshTokens.get(hash(token)) : undefined;
  if (stored) revokeFamily(stored.familyId);
  res.clearCookie(REFRESH_COOKIE, { path: "/auth" });
}

export function readRefreshCookie(cookies: Record<string, string | undefined>) {
  return cookies[REFRESH_COOKIE];
}
