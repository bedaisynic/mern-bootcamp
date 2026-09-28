import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { users } from "../db";

// Session-based auth, shown only for comparison with JWT.
// The difference to notice: the SERVER keeps state (this Map). A JWT server keeps none.
const router = Router();

const sessions = new Map<string, { userId: number }>();

router.post("/login", async (req, res) => {
  const email = String(req.body.email ?? "").trim().toLowerCase();
  const user = users.find((u) => u.email === email);
  if (!user || !user.passwordHash || !(await bcrypt.compare(String(req.body.password ?? ""), user.passwordHash))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const sessionId = crypto.randomUUID();
  sessions.set(sessionId, { userId: user.id });

  // The browser stores this cookie and sends it back automatically on every request.
  // httpOnly: page JavaScript can't read it.
  res.cookie("sid", sessionId, { httpOnly: true, sameSite: "lax", maxAge: 60 * 60 * 1000 });
  res.json({ message: "Logged in with a session", activeSessionsOnServer: sessions.size });
});

router.get("/me", (req, res) => {
  const session = sessions.get(req.cookies.sid);
  if (!session) return res.status(401).json({ message: "No valid session" });

  // A lookup on every single request. With 3 server instances, all 3 need this same Map,
  // which in practice means a shared store like Redis.
  const user = users.find((u) => u.id === session.userId)!;
  res.json({
    user: { id: user.id, email: user.email, role: user.role },
    sessionId: req.cookies.sid,
    activeSessionsOnServer: sessions.size,
  });
});

router.post("/logout", (req, res) => {
  // The upside of server state: logout takes effect instantly. You can't do this with a JWT.
  sessions.delete(req.cookies.sid);
  res.clearCookie("sid");
  res.json({ message: "Session destroyed on the server", activeSessionsOnServer: sessions.size });
});

export default router;
