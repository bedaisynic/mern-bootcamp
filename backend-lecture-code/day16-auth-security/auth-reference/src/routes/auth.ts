import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { users, nextId, User } from "../db";
import { requireAuth } from "../middleware/auth";
import {
  signAccessToken,
  startRefreshFamily,
  rotateRefreshToken,
  revokeRefreshToken,
  readRefreshCookie,
} from "../tokens";

const router = Router();

const publicUser = (user: User) => ({ id: user.id, email: user.email, role: user.role });

// ---------------------------------------------------------------------------
// Email + password
// ---------------------------------------------------------------------------

router.post("/signup", async (req, res) => {
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");

  if (!email.includes("@") || password.length < 8) {
    return res.status(400).json({ message: "A valid email and an 8+ character password are required" });
  }
  if (users.some((u) => u.email === email)) {
    return res.status(409).json({ message: "Email is already registered" });
  }

  const user: User = {
    id: nextId.user++,
    email,
    // Store a slow, salted hash, never the password itself.
    passwordHash: await bcrypt.hash(password, 10),
    // Always "customer". Never read the role from req.body: that is mass assignment,
    // letting anyone sign up as an admin by sending { "role": "admin" }.
    role: "customer",
    provider: "password",
  };
  users.push(user);

  startRefreshFamily(res, user);
  res.status(201).json({ token: signAccessToken(user), user: publicUser(user) });
});

router.post("/login", async (req, res) => {
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const password = String(req.body.password ?? "");

  const user = users.find((u) => u.email === email);
  // One generic message for "no such user" and "wrong password". Two different messages
  // would tell an attacker which emails are registered.
  if (!user || !user.passwordHash || !(await bcrypt.compare(password, user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  // Two tokens come back. The access token in the body: the server signs it and forgets it.
  // The refresh token in an httpOnly cookie: the server DOES keep a record of that one.
  startRefreshFamily(res, user);
  res.json({ token: signAccessToken(user), user: publicUser(user) });
});

// ---------------------------------------------------------------------------
// Refresh tokens
// ---------------------------------------------------------------------------

// The page calls this when it loads (the in-memory access token is gone after a refresh) and
// whenever its access token is about to expire. The browser attaches the cookie by itself.
router.post("/refresh", (req, res) => {
  const userId = rotateRefreshToken(res, readRefreshCookie(req.cookies));
  const user = users.find((u) => u.id === userId);
  if (!user) return res.status(401).json({ message: "Not logged in" });

  // The user is read from the database again here, so a changed role or a deleted account
  // takes effect at the next refresh: within 15 minutes, not whenever an old token expires.
  res.json({ token: signAccessToken(user), user: publicUser(user) });
});

// Logout finally means something: the refresh token is revoked on the server. An access token
// already handed out still works until it expires, which is why it only lives for 15 minutes.
router.post("/logout", (req, res) => {
  revokeRefreshToken(res, readRefreshCookie(req.cookies));
  res.json({ message: "Logged out" });
});

// Returns whatever the token says about the caller.
router.get("/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

// ---------------------------------------------------------------------------
// Log in with Google: the OAuth 2.0 / OIDC authorization-code flow, by hand
// ---------------------------------------------------------------------------

// A random `state` value for each login attempt. Google echoes it back on the callback, so we
// can reject a callback we never started (a CSRF attack on the login itself).
const pendingStates = new Set<string>();

// Step 1: send the browser to Google's consent screen.
router.get("/google", (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.status(500).send("Google login isn't configured: set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env");
  }

  const state = crypto.randomUUID();
  pendingStates.add(state);

  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });
  res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

// Steps 2-3 happen on Google's side: the user logs in there (we never see their Google
// password), then Google redirects back here with ?code=...&state=...
router.get("/google/callback", async (req, res) => {
  const fail = (message: string) =>
    res.redirect(`${process.env.FRONTEND_URL}#error=${encodeURIComponent(message)}`);

  const code = String(req.query.code ?? "");
  const state = String(req.query.state ?? "");
  if (!pendingStates.delete(state)) return fail("Unknown or reused OAuth state");
  if (!code) return fail("Google did not return a code");

  try {
    // Step 4: trade the one-time code for tokens. This is a server-to-server call, which is
    // why the client_secret never reaches the browser.
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID!,
        client_secret: process.env.GOOGLE_CLIENT_SECRET!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        grant_type: "authorization_code",
      }),
    });
    if (!tokenRes.ok) return fail("Google rejected the code exchange");
    const tokens = (await tokenRes.json()) as { access_token: string; id_token: string };

    // Step 5: the id_token (the OIDC part) is a JWT that says who the user is.
    // jwt.decode only reads it and does NOT check the signature. That's acceptable here only
    // because we received it straight from Google over HTTPS. A token that came from a browser
    // must go through jwt.verify, like in requireAuth.
    const google = jwt.decode(tokens.id_token) as JwtPayload;
    if (google.aud !== process.env.GOOGLE_CLIENT_ID) return fail("id_token was issued for another app");
    if (!google.email_verified) return fail("Google account email is not verified");

    // Find or create the matching local account. A Google user never has a password here.
    const email = String(google.email).toLowerCase();
    let user = users.find((u) => u.email === email);
    if (!user) {
      user = { id: nextId.user++, email, passwordHash: null, role: "customer", provider: "google" };
      users.push(user);
    }

    // Step 6: from here on it's exactly like the email/password login. Set the refresh cookie
    // and send the browser back to the page. No token goes in the URL: the page calls
    // POST /auth/refresh as soon as it loads, and that hands it an access token.
    startRefreshFamily(res, user);
    res.redirect(process.env.FRONTEND_URL!);
  } catch {
    fail("Could not reach Google");
  }
});

export default router;
