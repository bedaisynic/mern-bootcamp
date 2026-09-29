import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";

const PORT = Number(process.env.PORT) || 4107;

// No database: "sent" emails are kept in memory and logged to the console.
type Email = { id: number; userId: number; to: string; subject: string; body: string; sentAt: string };
const sent: Email[] = [];

class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

function userIdOf(req: Request): number {
  const id = Number(req.header("x-user-id"));
  if (!id) throw new HttpError(401, "missing x-user-id: call this through the gateway");
  return id;
}

const app = express();
app.use(express.json());
app.use((req, res, next) => {
  const start = Date.now();
  const reqId = (req.header("x-request-id") ?? "-").slice(0, 8);
  res.on("finish", () =>
    console.log(`[${reqId}] ${req.method} ${req.originalUrl} → ${res.statusCode} ${Date.now() - start}ms`)
  );
  next();
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Internal: Orders calls this after checkout.
app.post("/internal/notifications/emails", (req, res) => {
  const { userId, to, subject, body } = req.body ?? {};
  if (!userId || !to || !subject) throw new HttpError(400, "userId, to, and subject are required");
  const email: Email = { id: sent.length + 1, userId, to, subject, body: body ?? "", sentAt: new Date().toISOString() };
  sent.push(email);
  console.log(`📧 to ${to}: ${subject}`);
  res.status(201).json(email);
});

app.get("/notifications", (req, res) => {
  const userId = userIdOf(req);
  res.json(sent.filter((e) => e.userId === userId).reverse());
});

// DEMO: the same bug as the monolith's notifications module. This time it
// kills only this process; every other service keeps serving.
app.post("/notifications/debug/crash", (req, res) => {
  res.json({ message: "notifications service crashing in 100ms" });
  setTimeout(() => {
    throw new Error("💥 unhandled error in the notifications service");
  }, 100);
});

app.use((req, res) => {
  res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

app.listen(PORT, () => console.log(`notifications service on http://localhost:${PORT}`));
