# Day 17 — Monolith vs. microservices, lecture code

The same small store built twice. Both versions share the same users, SKUs, stock levels, and
**endpoint paths**. Only the port changes: the monolith is on `4100`, the gateway on `8080`.

```
day17-microservices/
  monolith/          one process, 8 modules, 1 Postgres
  microservices/     an API gateway + 8 services, 3 database engines, 2 languages
```

## Ports

| What                          | Port  | Runs as                    | Storage                       |
| ----------------------------- | ----- | -------------------------- | ----------------------------- |
| **monolith** (all 8 modules)  | 4100  | `npm run dev`              | Postgres `:5434` `monolith_db` |
| **gateway**                   | 8080  | `npm run dev:all`          | none                          |
| users                         | 4101  | 〃                         | Postgres `:5435` `users_db`     |
| catalog                       | 4102  | 〃                         | MongoDB `:27018`                |
| inventory                     | 4103  | 〃                         | Postgres `:5435` `inventory_db` |
| cart                          | 4104  | 〃                         | Redis `:6381`                   |
| orders                        | 4105  | 〃                         | Postgres `:5435` `orders_db`    |
| payments                      | 4106  | 〃                         | Postgres `:5435` `payments_db`  |
| notifications                 | 4107  | 〃                         | none (in memory)              |
| recommendations (**Python**)  | 4108  | Docker container           | none                          |

The microservices share one Postgres **server**, but each service has its own database and its
own login, and no login can connect to another service's database. Try it:
`docker exec day17-ms-postgres psql postgresql://orders_svc:orders_svc@localhost/users_db`
fails with *permission denied*.

## Running the monolith

```bash
cd monolith
npm install
npm run db:up        # Postgres on :5434, schema + seed applied automatically
npm run dev          # http://localhost:4100
```

## Running the microservices

```bash
cd microservices
npm install          # one install for every Node service (npm workspaces)
npm run infra:up     # Postgres, MongoDB, Redis, and the Python service in Docker
npm run dev:all      # gateway + 7 Node services in one terminal, color-prefixed logs
```

Each service creates its own tables and seeds itself on first start. To work on one service
only, the way a single team would, run the gateway plus that service:

```bash
npm run dev -w gateway
npm run dev -w services/orders
```

`services/orders/docker-compose.yml` shows the real-world version of that: the Orders team's
service and its own database, and nothing else. Its header comment says how to try it.

Reset everything to the seed data: `npm run db:reset` (monolith) / `npm run infra:reset`
(microservices).

## Getting a token

Login takes just an email (a demo shortcut, not real auth). Seeded users: `alice@shop.com`,
`bob@shop.com`, `carol@shop.com`. Use port 4100 for the monolith or 8080 for the gateway:

```bash
B=http://localhost:8080
TOKEN=$(curl -s -X POST $B/users/login -H 'content-type: application/json' \
  -d '{"email":"alice@shop.com"}' | node -pe 'JSON.parse(require("fs").readFileSync(0)).token')
A="authorization: Bearer $TOKEN"
```

## API docs (Swagger UI)

| Version        | Swagger UI                     | Raw spec                              | Source                             |
| -------------- | ------------------------------ | ------------------------------------- | ---------------------------------- |
| Monolith       | http://localhost:4100/docs     | http://localhost:4100/openapi.json    | `monolith/openapi.yaml`            |
| Microservices  | http://localhost:8080/docs     | http://localhost:8080/openapi.json    | `microservices/gateway/openapi.yaml` |

Log in with `POST /users/login`, then paste the token into **Authorize**. The gateway's spec also
lists the `/internal` service-to-service endpoints, each with its own service's address. Those are
for reference; the browser blocks "Try it out" calls to another port.

## Endpoints (identical in both versions)

| Endpoint                                   | Auth   |
| ------------------------------------------ | ------ |
| `POST /users` `{ email, name }`            | public |
| `POST /users/login` `{ email }`            | public |
| `GET /users/me`                            | token  |
| `GET /products` `?category=`, `GET /products/:sku` | public |
| `POST /products`                           | token  |
| `GET /inventory`, `GET /inventory/:sku`    | public |
| `GET /cart`, `POST /cart/items` `{ sku, quantity }`, `DELETE /cart/items/:sku`, `DELETE /cart` | token |
| `POST /orders` (checks out the cart), `GET /orders`, `GET /orders/:id` | token |
| `GET /payments/:id`                        | token  |
| `GET /notifications`                       | token  |
| `GET /recommendations` `?ms=5000`          | public |
| `POST /notifications/debug/crash`          | public (demo) |
| `POST /payments/debug/slow` `{ ms }`       | public (demo, microservices only) |
| `GET /health`                              | public. On the gateway it shows every service up/down |

Services also expose `/internal/...` routes for each other (e.g. `POST
/internal/inventory/reservations`). The gateway has no route for them, so they can't be reached
from outside.

Seed data to know: the **85" TV (`SKU-2001`, $5,999)** is over the $5,000 limit, so paying for it
is always declined. The **Coffee Mug (`SKU-3001`)** has only 1 in stock.

## Demo script: each pain point, then the fix

Run each monolith step, then the same command against the gateway.

| # | Pain point | Monolith (`:4100`) | Microservices (`:8080`) |
|---|---|---|---|
| 1 | **Noisy neighbor** | `curl "$B/recommendations?ms=5000" &` then `curl $B/products`: **products hangs** until the loop ends | Same two commands: products answers in ~10ms. The slow work is in a separate Python process |
| 2 | **Blast radius** | `curl -X POST $B/notifications/debug/crash`, then `curl $B/products`: **connection refused**, the whole shop is down | Same crash: `curl $B/health` shows only notifications down. Checkout still returns 201 and logs `notification failed, order still placed` |
| 3 | **All-or-nothing scaling** | Only one way to scale: run more copies of *everything* | Start a 2nd catalog: `PORT=4112 npm run start -w services/catalog`, restart the gateway with `CATALOG_URLS=http://localhost:4102,http://localhost:4112`. The gateway log alternates between the two |
| 4 | **Shared database** | `GET /orders/:id` is one JOIN across 4 modules' tables | `GET /orders/:id` reads a **snapshot** saved at checkout, with no JOIN. The `orders_svc` login can't even open `users_db` |
| 5 | **Losing the transaction** | Add the TV to the cart, `POST /orders` → 402. `ROLLBACK` restores stock and cart for free | Same → 402. Orders **releases the reservation by hand** (a compensating action) and marks the order `payment_failed` |
| 6 | **Network calls can hang** | (not possible: every call is in-process) | `curl -X POST $B/payments/debug/slow -H 'content-type: application/json' -d '{"ms":5000}'`, then check out → **504 after 3s**, stock released. Reset with `{"ms":0}` |
| 7 | **Team ownership** | Read `monolith/CODEOWNERS`: 8 teams, plus 5 files nobody owns that everyone edits | Each service has its own `package.json`, database, and deploy. Edit catalog and only catalog restarts |
| 8 | **Tech-stack lock-in** | One language, one database | Postgres + MongoDB + Redis, Node + Python, all behind one gateway |

Where to look in the code:

- `monolith/src/modules/orders/order.service.ts`: checkout calls five other modules' services as plain
  function imports, all sharing one `BEGIN … COMMIT`. Each module is layered routes → controller →
  service → repository, and a module only ever calls another module's *service*, never its repository.
- `microservices/services/orders/src/orders/order.service.ts`: the same checkout, same layers, but
  each import is a **client** instead of a service. `userService.getUser(id, tx)` in the monolith
  becomes `userClient.getUser(ctx, id)`, an HTTP call. No transaction wraps the steps, so a failed
  payment is undone by hand in the `catch` (a compensating action).
- `microservices/services/orders/src/clients/`: one client per service Orders talks to, all built on
  `http.ts`, where every call gets a timeout and forwards `x-request-id`.
- `microservices/gateway/src/server.ts`: the routing table, auth at the edge, round-robin.

Follow one request across services: every log line starts with the first 8 characters of its
`x-request-id`, which the gateway creates and every service passes along.

**No Java service, on purpose.** Building Spring Boot in Docker is slow and memory-hungry on a
laptop. The Notes page shows a Spring Boot controller next to the Express one instead. Behind the
gateway, it would be just another URL in the routing table.
