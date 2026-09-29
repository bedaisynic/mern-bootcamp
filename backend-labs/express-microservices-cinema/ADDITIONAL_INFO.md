# Additional info

## How services talk to each other

- **Clients only ever call the gateway** (`:3000`). The gateway picks the service from the first
  path segment (`/bookings/...` → bookings) and forwards the request.
- **The gateway decides who the caller is.** It checks the `Authorization: Bearer <token>`
  header, then forwards `x-user-id` to the service. Services never see the token; they trust
  `x-user-id` because only the gateway can reach them.
- **Every request carries an `x-request-id`.** The gateway creates it; every service passes it
  on. Search the `npm run dev` logs for one id to follow a booking through every service.
- **Services call each other directly**, not through the gateway, on `/internal/...` routes. The
  gateway has no route for `/internal`, so those are unreachable from outside.
- **Errors are always `{ "error": "..." }`**, plus `"service"` when the error came from a service
  further down the chain.

## Business rules

- Every hall has rows **A–E** and seats **1–8** (`A1` … `E8`). Anything else is a `400` from seats.
- Showtime **1** starts with seats **C4** and **C5** already sold.
- Payments **declines any charge over $100** (`402`). Showtime **2** (IMAX) is $60 a seat, so
  two seats is always declined.
- A booking's status is one of `pending_payment`, `confirmed`, `payment_failed`, `cancelled`.
- Only a `confirmed` booking can be cancelled.

## Endpoints, through the gateway (`:3000`)

| Method | Path | Token | Notes |
|---|---|---|---|
| POST | `/auth/login` | — | `{ name }` → `{ token, userId }` |
| GET | `/health` | — | up/down for every service |
| GET | `/showtimes` | — | all showtimes |
| GET | `/showtimes/:id` | — | `404` if missing |
| GET | `/seats/:showtimeId` | — | `{ showtimeId, taken: [...] }` |
| POST | `/bookings` | ✓ | `{ showtimeId, seats: ["A1", "A2"] }` → `201` booking |
| GET | `/bookings` | ✓ | my bookings, newest first |
| GET | `/bookings/:id` | ✓ | `404` if missing or someone else's |
| POST | `/bookings/:id/cancel` | ✓ | challenge |
| GET | `/notifications` | ✓ | emails sent to me |
| POST | `/payments/debug/slow` | — | `{ ms }`: every charge now takes that long. `{ "ms": 0 }` to reset |

## Internal endpoints (service to service only)

| Service | Method | Path | Body → result |
|---|---|---|---|
| seats | POST | `/internal/seats/holds` | `{ showtimeId, seats }` → `201 { holdId }`, `409` if any seat is taken |
| seats | DELETE | `/internal/seats/holds/:holdId` | `204`. Releasing twice is fine |
| payments | POST | `/internal/payments/charges` | `{ bookingId, userId, amount }` → `201 { id, status }`, `402` if declined |
| payments | POST | `/internal/payments/:id/refund` | `200`, `409` if not an approved payment |
| notifications | POST | `/internal/notifications/emails` | `{ userId, subject, body }` → `201` |

## Try the failure cases by hand

With `npm run dev` running, in another terminal:

- **Card declined:** book two seats for showtime 2.
- **Payments too slow:** `POST /payments/debug/slow` with `{ "ms": 5000 }`, then book.
- **A service down:** `npm run dev` stops all six together, so for this start each process in
  its own terminal instead (`npx tsx src/gateway/server.ts`, `npx tsx src/services/seats/server.ts`,
  …) and stop just the one you want down. The tests already cover every one of these cases.
