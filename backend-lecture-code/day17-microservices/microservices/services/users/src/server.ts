import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Pool } from "pg";

const PORT = Number(process.env.PORT) || 4101;
// Shared with the gateway: Users signs tokens, the gateway verifies them.
const JWT_SECRET = process.env.JWT_SECRET ?? "dev-secret-change-me";
// users_svc can connect to users_db and nothing else.
const pool = new Pool({
  connectionString:
    process.env.DATABASE_URL ?? "postgresql://users_svc:users_svc@localhost:5435/users_db",
});

type User = { id: number; email: string; name: string };

class HttpError extends Error {
  constructor(
    public status: number,
    message: string
  ) {
    super(message);
  }
}

// The gateway verified the token and put the caller's id in this header.
function userIdOf(req: Request): number {
  const id = Number(req.header("x-user-id"));
  if (!id) throw new HttpError(401, "missing x-user-id: call this through the gateway");
  return id;
}

async function initDb() {
  await pool.query(`CREATE TABLE IF NOT EXISTS users (
    id    SERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name  TEXT NOT NULL
  )`);
  await pool.query(`INSERT INTO users (email, name) VALUES
    ('alice@shop.com', 'Alice'), ('bob@shop.com', 'Bob'), ('carol@shop.com', 'Carol')
    ON CONFLICT (email) DO NOTHING`);
}

async function findUser(id: number): Promise<User> {
  const { rows } = await pool.query<User>("SELECT id, email, name FROM users WHERE id = $1", [id]);
  if (!rows[0]) throw new HttpError(404, `user ${id} not found`);
  return rows[0];
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

app.get("/health", async (req, res) => {
  await pool.query("SELECT 1");
  res.json({ status: "ok" });
});

app.post("/users", async (req, res) => {
  const { email, name } = req.body ?? {};
  if (!email || !name) throw new HttpError(400, "email and name are required");
  const { rows } = await pool.query<User>(
    "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING id, email, name",
    [email, name]
  );
  res.status(201).json(rows[0]);
});

// Demo login: an email is enough. A real login checks a hashed password.
app.post("/users/login", async (req, res) => {
  const { rows } = await pool.query<User>("SELECT id, email, name FROM users WHERE email = $1", [
    req.body?.email,
  ]);
  if (!rows[0]) throw new HttpError(401, "unknown email");
  const token = jwt.sign({ sub: String(rows[0].id) }, JWT_SECRET, { expiresIn: "1h" });
  res.json({ token, user: rows[0] });
});

app.get("/users/me", async (req, res) => {
  res.json(await findUser(userIdOf(req)));
});

// Internal: other services call this directly. The gateway never routes
// anything under /internal, so it isn't reachable from outside.
app.get("/internal/users/:id", async (req, res) => {
  res.json(await findUser(Number(req.params.id)));
});

app.use((req, res) => {
  res.status(404).json({ error: `no route for ${req.method} ${req.path}` });
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof HttpError) {
    res.status(err.status).json({ error: err.message });
    return;
  }
  if ((err as { code?: string }).code === "23505") {
    res.status(409).json({ error: "email already registered" });
    return;
  }
  console.error(err);
  res.status(500).json({ error: "internal error" });
});

initDb().then(() => {
  app.listen(PORT, () => console.log(`users service on http://localhost:${PORT}`));
});
