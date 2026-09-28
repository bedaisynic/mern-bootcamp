# Day 16 — Auth & Security lecture code

| Folder            | What it is                                                                   | Port |
| ----------------- | ---------------------------------------------------------------------------- | ---- |
| `auth-demo/`      | The empty project that gets coded live during the lecture                    | —    |
| `auth-reference/` | The finished version: bcrypt, JWT + refresh tokens, Google OAuth by hand, a policy engine | 4000 |

Everything is in memory (no database) and resets on restart.

The frontend is the day 16 lecture page in the curriculum app
(`curriculum/src/week4/day16-auth-security/lecture/`). It talks to `auth-reference` on port 4000;
set `VITE_DAY16_API` in `curriculum/.env.local` only if you change that port.

## Endpoints

| Endpoint                   | Who can call it                                                        |
| -------------------------- | ---------------------------------------------------------------------- |
| `GET /products`            | Public                                                                 |
| `POST /products`           | manager, admin                                                         |
| `DELETE /products/:id`     | admin, or any user granted `product:delete` directly (the west manager) |
| `GET /orders`              | Logged in: customers get their own, managers their region's, admins all |
| `GET /orders/:id`          | The owner, a manager of its region, admin (404 for anyone else)        |
| `POST /orders`             | Logged in. Optional `region`: `"east"` (default) or `"west"`           |
| `PATCH /orders/:id/status` | A manager of its region, up to their approval limit; admin. Never once delivered or cancelled |
| `GET /admin/users`         | admin                                                                  |
| `GET /auth/me`             | Logged in                                                              |

Auth itself: `POST /auth/signup`, `POST /auth/login`, `POST /auth/refresh`, `POST /auth/logout`,
`GET /auth/google` (+ callback), and the session-based comparison under `/session/login`,
`/session/me`, `/session/logout`.

A missing, invalid or expired access token gets `401`. A valid token the policy engine says no to
gets `403`, with the reason in the body.

The access rules live in `src/policy/policies.ts` (the config) and are applied by
`src/policy/engine.ts`. Access and refresh tokens are in `src/tokens.ts`.

## Running it

```bash
cd auth-reference
cp .env.example .env   # then set JWT_SECRET
npm install
npm run dev
```

Seed accounts, all with the same password (the `seedHash` line in `src/db.ts`): `admin@shop.com`,
`manager@shop.com` (east, $100 limit), `manager.west@shop.com` (west, $500 limit, plus a direct
`product:delete` grant), `alice@shop.com`, `bob@shop.com`. Orders 1 and 3 are Alice's and order 2
is Bob's, so logging in as Alice and requesting `GET /orders/2` shows the IDOR check.

Set `ACCESS_TOKEN_TTL=30s` in `.env` to watch the page swap an expired access token for a new one.

**Google login (optional):** in Google Cloud Console → APIs & Services → Credentials, create an
OAuth client ID of type *Web application*. Add `http://localhost:4000/auth/google/callback` as an
Authorized redirect URI (the backend's callback, not the lecture page), then put the client ID and
secret in `.env`. Without them, everything except the Google button still works.
