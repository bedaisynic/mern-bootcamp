# Cinema Booking — Microservices

A cinema ticket system split into an API gateway and five Express + TypeScript services. Each
service is its own process on its own port, owns its own data, and can only reach the others over
HTTP. Day 17 lab. See `ADDITIONAL_INFO.md` for every endpoint and the business rules.

## The system

```
                          ┌──▶ movies         :3001   showtimes + ticket prices
                          ├──▶ seats          :3002   which seats are held
client ──▶ gateway :3000 ─┼──▶ payments       :3003   a fake card processor
                          ├──▶ notifications  :3004   "email" log
                          └──▶ bookings       :3005   ties the others together  ← you work here
```

Booking two seats means the bookings service calls four others:

```
POST /bookings ──▶ movies         GET  /showtimes/:id              price + title
               ──▶ seats          POST /internal/seats/holds       hold the seats
               ──▶ payments       POST /internal/payments/charges  charge the card
               ──▶ notifications  POST /internal/notifications/emails   confirmation (don't wait)
```

## Setup

```bash
npm install
npm run dev          # starts all 6 processes in one terminal, color-coded
npm test             # runs the test suite once
npm run test:watch   # reruns on save
```

Log in to get a token (users: `alice`, `bob`, `carol`):

```bash
curl -X POST localhost:3000/auth/login -H 'content-type: application/json' -d '{"name":"alice"}'
```

Or import `src/cinema.postman_collection.json` into Postman: every endpoint, the failure cases,
and the gateway security checks, ready to send. Run **Auth → Log in as alice** first; it saves the
token for all the other requests.

## Where to work

Details are in the `// TODO` comments in each file — this is just the map. The spec for each
exercise is the test file next to it; each one should go green without editing the test.

1. **`gateway/auth.ts` → `buildForwardHeaders()`** — decide who's calling, and make sure nobody
   can pretend to be someone else. Doesn't depend on 2 or 3. Spec: `gateway/gateway.test.ts`.
2. **`services/bookings/clients/movies.client.ts` and `seats.client.ts`** — start here. Write
   the two clients bookings uses to call movies and seats over HTTP. Copy the pattern from
   `payments.client.ts` and `notifications.client.ts`, which are done. They're all built on
   `callService()` in `http.ts` (given: read it, it's where timeouts and errors are handled).
   Spec: `clients/clients.test.ts`.
3. **`services/bookings/booking.service.ts` → `createBooking()`** — call the other services in
   order, and undo the earlier steps by hand when a later one fails. Needs exercise 1.
   Spec: `create-booking.test.ts`.
4. **Challenge: `booking.service.ts` → `cancelBooking()`** — refund and release, and decide what
   should happen when one of them fails. Needs 1 and 2. Spec: `cancel-booking.test.ts`.

**`services/movies/`** is the fully implemented reference service: read it before you start.
Every other service is layered the same way.

Only edit `movies.client.ts`, `seats.client.ts`, `booking.service.ts`, and `gateway/auth.ts`.
Everything else is given, including the other four services, the rest of the gateway, and
`test-utils.ts`.
