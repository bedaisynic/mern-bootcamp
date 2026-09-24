# Demos

Every demo spot in `src/` is marked with a `#demo-...` comment. Search the
project for the keyword to jump straight to the code. Searching `#demo-` lists
all of them.

| Keyword | Concept | Endpoint |
| --- | --- | --- |
| `#demo-n-plus-1` | N+1 query vs. join | `GET /orders/with-products/n-plus-1`, `GET /orders/with-products/join` |
| `#demo-indexing` | Same filter, unindexed vs. indexed column | `GET /orders/by-customer/:id`, `GET /orders/by-customer-indexed/:id` |
| `#demo-pagination` | Offset vs. cursor pagination on 10M rows | `GET /activity/offset?page=N`, `GET /activity/cursor?after=id` |
| `#demo-cache-aside` | Redis cache-aside + invalidation | `GET /products`, `GET /products/:id`, `PATCH /products/:id` |
| `#demo-atomicity` | Transaction: all or nothing | `POST /inventory/:id/adjust` |
| `#demo-isolation` | Row lock with `FOR UPDATE` | `PATCH /inventory/:id`, `POST /inventory/:id/adjust`, `POST /orders` |
| `#demo-idempotency` | Idempotency-Key header | `POST /inventory` |
| `#demo-error-handling` | `AppError` classes + one central `errorHandler` | any route |
| `#demo-blocking` | CPU work blocks the event loop | `GET /blocking` |

Setup: `docker-compose up`, `npm run db:push`, `npm run db:seed`, `npm run dev`.
The server runs on `http://localhost:3100`.

The seed script wipes and reinserts rows, so ids don't start at 1. Grab real ids first:

```bash
ID=$(curl -s "localhost:3100/inventory?limit=1" | node -pe 'JSON.parse(require("fs").readFileSync(0))[0].id')
PID=$(curl -s "localhost:3100/products?limit=1" | node -pe 'JSON.parse(require("fs").readFileSync(0))[0].id')
```

---

## `#demo-n-plus-1` — N+1 query problem

**Where:** `src/modules/orders/controller.ts` has two self-contained handlers
with raw SQL, `getWithProductsNPlusOne()` and `getWithProductsJoin()`. Both
return the same rows as `{ queryCount, rows }`. `---- x ----` comments mark
which layer each part would normally live in, and `logQuery()` prints each SQL
statement to the terminal. The frontend is the **N+1 queries** tab of
`curriculum/src/week3/day14-database-performance/Lecture.tsx`.

**Run:**

```bash
curl -s -o /dev/null "localhost:3100/orders/with-products/n-plus-1?limit=500"
curl -s -o /dev/null "localhost:3100/orders/with-products/join?limit=500"
```

**Watch the server terminal:**
- N+1 prints one `SELECT ... FROM orders`, then
  `SELECT name FROM products WHERE id = $1` **500 times**, each with a
  different param. Those repeated lines are the N queries.
- JOIN prints a single `SELECT ... FROM orders o JOIN products p ...`.
- Measured: at `limit=500` it's about 160ms vs. 3ms; at `limit=2000`, about 560–700ms vs. 5–9ms.

---- x ----` comments mark which layer each part would normally live in.
BEFORE ends with `return res.json(before);`. Delete that line to run AFTER.
`logQuery()` prints each SQL statement to the terminal.

**Run:**

```bash
curl -s -o /dev/null "localhost:3100/orders/with-products?limit=500"
```

**Watch the server terminal:**
- BEFORE prints one `SELECT ... FROM orders`, then
  `SELECT name FROM products WHERE id = $1` **500 times**, each with a
  different param. Those repeated lines are the N queries.
- AFTER prints a single `SELECT ... FROM orders o JOIN products p ...`.
- The timers show the difference: about 216ms for 501 queries vs. about 2ms for
  1 query. Raise `limit` to widen the gap.

---

## `#demo-indexing` — with vs. without an index

**Setup:** `orders` stores the same customer id twice, in `customer_id` and
`customer_id_indexed`. The values are identical; only the second column has an
index (`orders_customer_id_indexed_idx`). There are 300k orders spread over
10k customers, so about 30 rows match each id.

**Where:**
- `src/db/schema.ts`: the two columns and the `index(...)` definition
- `src/modules/orders/controller.ts` → `getByCustomer()` / `getByCustomerIndexed()`:
  two self-contained handlers with raw SQL, identical except for the column in the `WHERE`
- Frontend: the **Indexing** tab of `curriculum/src/week3/day14-database-performance/Lecture.tsx`

**Run:**

```bash
curl -s -o /dev/null localhost:3100/orders/by-customer/42           # WITHOUT index
curl -s -o /dev/null localhost:3100/orders/by-customer-indexed/42   # WITH index
```

The terminal prints `WITHOUT index: ~8ms` vs. `WITH index: ~1ms`. Most of that
1ms is the network round trip. To see the database work alone, run
`EXPLAIN ANALYZE` in psql
(`docker exec -it backend-lecture-postgres psql -U lecture -d lecture_db`):

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42;
-- Parallel Seq Scan on orders ... Rows Removed by Filter: 99989 (x3 workers)
-- Execution Time: ~7.6 ms

EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id_indexed = 42;
-- Bitmap Index Scan on orders_customer_id_indexed_idx
-- Execution Time: ~0.05 ms
```

This demo uses a customer id instead of `status`, the column in the notes.
With 3 statuses, each value matches about 1/3 of the table, so Postgres
would read the whole table anyway and ignore an index. Indexes pay off on
columns where each value matches only a few rows.

---

## `#demo-pagination` — offset vs. cursor pagination

**Setup:** `activity_logs` holds 10,000,000 rows (`npm run db:seed` builds
them in one `INSERT ... SELECT generate_series()`). Both styles list it
newest-first by `id`, which the primary key already indexes.

**Where:**
- `src/modules/activity/controller.ts`: one self-contained handler per endpoint (validation, raw SQL and response in one place), each timed. Compare `LIMIT $1 OFFSET $2` with `WHERE id < $1 LIMIT $2`
- Frontend: the **Pagination** tab of `curriculum/src/week3/day14-database-performance/Lecture.tsx`, with both pagers side by side

**Run:**

```bash
curl -s -o /dev/null "localhost:3100/activity/offset?page=1"        # ~15ms
curl -s -o /dev/null "localhost:3100/activity/offset?page=250000"   # ~260ms
curl -s -o /dev/null "localhost:3100/activity/offset?page=500000"   # ~500-650ms, last page
curl -s -o /dev/null "localhost:3100/activity/cursor?last=true"     # ~3ms, also the last page
curl -s "localhost:3100/activity/cursor?after=9999981"              # next page after id 9,999,981
```

Offset time grows with the page number, because Postgres reads and discards
every skipped row. Cursor time stays flat, but a cursor can only step
first / prev / next / last. It can't jump to page 250,000.
`GET /activity/count` shows the extra cost offset pages carry: the
`COUNT(*)` needed for "page X of Y" takes about 300ms on its own.

---

## `#demo-cache-aside` — Redis cache-aside

**Where:** `src/modules/products/service.ts`
- Read path (`list`, `getById`): check Redis first. On a miss, query Postgres,
  then store the result with a TTL.
- Write path (`create`, `update`, `remove`): bump the list version key so every
  cached list is skipped, and `DEL` the one item key.

**Run:**

```bash
time curl -s -o /dev/null localhost:3100/products   # miss: hits postgres
time curl -s -o /dev/null localhost:3100/products   # hit: served from redis
curl -s -X PATCH localhost:3100/products/$PID -H 'content-type: application/json' -d '{"name":"renamed"}'
time curl -s -o /dev/null localhost:3100/products   # miss again: version was bumped
```

To inspect Redis, run `redis-cli KEYS 'products:*'` and `redis-cli GET products:cache:version`.

---

## `#demo-atomicity` — all or nothing

**Where:** `src/modules/inventory/service.ts` → `adjust()`. The audit-log
insert runs **before** the "would go below 0" guard. The table is
`inventory_adjustments` in `src/db/schema.ts`.

**Run:** adjust by a delta that goes negative.

```bash
curl -s -X POST localhost:3100/inventory/$ID/adjust -H 'content-type: application/json' -d '{"delta":-99999}'
# → 409
```

Then check `inventory_adjustments`. It has no row for that attempt: the insert
already ran, but the whole transaction was rolled back.

---

## `#demo-isolation` — row lock with `FOR UPDATE`

**Where:**
- `src/modules/inventory/service.ts` → `setQuantity()` and `adjust()` (Drizzle `db.transaction`)
- `src/modules/orders/controller.ts` → `create()` (the same idea, written as raw
  `BEGIN` / `FOR UPDATE` / `COMMIT`)

**Run:** fire two adjustments at the same row at the same time.

```bash
curl -s -X POST localhost:3100/inventory/$ID/adjust -H 'content-type: application/json' -d '{"delta":-1}' &
curl -s -X POST localhost:3100/inventory/$ID/adjust -H 'content-type: application/json' -d '{"delta":-1}' &
wait
```

The second request waits for the first one's lock, so the quantity drops by 2,
not 1. Without `FOR UPDATE`, both requests could read the same starting value.

---

## `#demo-idempotency` — Idempotency-Key

**Where:** `src/modules/inventory/service.ts` → `create()`. The table is
`idempotency_keys` in `src/db/schema.ts`.

**Run:** send the same request twice with the same key.

```bash
curl -s -X POST localhost:3100/inventory -H 'content-type: application/json' \
  -H 'Idempotency-Key: abc-123' -d '{"productId":<id without inventory>,"quantity":5}'
# run it again: same response replayed, no second row
# same key with a different body → 409
```

---

## `#demo-error-handling` — centralized error handling

**Where:**
- `src/lib/errors.ts`: the `AppError` subclasses (`NotFoundError`,
  `ConflictError`, ...) and the `errorHandler` middleware
- `src/server.ts`: `app.use(errorHandler)`, mounted last
- `src/modules/products/controller.ts`: each controller does `try { ... } catch (err) { next(err) }`
- `src/modules/products/service.ts` → `list()`: a commented-out `throw`.
  Uncomment it to see an unknown error turn into a clean 500.

**Run:**

```bash
curl -s localhost:3100/products/999999999   # NotFoundError → 404 NOT_FOUND
curl -s localhost:3100/products/abc         # ZodError      → 400 VALIDATION_ERROR
```

---

## `#demo-blocking` — blocking the event loop

**Where:** `src/server.ts` → `GET /blocking`, which busy-waits for 5 seconds.

**Run:** in two terminals, one right after the other:

```bash
curl localhost:3100/blocking
curl localhost:3100/health    # hangs until /blocking finishes
```
