-- Intentionally slow queries, for practicing slow-query tracking.
--
-- Every query here takes > 100ms on the seeded data (20k products, 300k
-- orders, 10M activity_logs), so each one shows up in BOTH places
-- docker-compose.yml turned on:
--   docker logs -f backend-lecture-postgres     -> "duration: ... ms  statement: ..."
--   SELECT ... FROM pg_stat_statements          -> see the report at the bottom
--
-- Run the whole file:
--   docker exec -i backend-lecture-postgres psql -U lecture -d lecture_db < src/slow-query.sql
-- or paste one query at a time into psql and prefix it with EXPLAIN ANALYZE
-- to see WHY it's slow (look for "Seq Scan", "Sort Method: external merge",
-- "Rows Removed by Filter", and a big "loops=" count).
--
-- Each query has a "why" and a "fix" comment. Don't apply the fixes here —
-- the point is to find these from the log / pg_stat_statements first.

-- start with a clean slate so the report only shows this file's queries
SELECT pg_stat_statements_reset();

\timing on


-- 0. sanity check: is the slow-query log working at all?
-- why: literally just sleeps.
-- fix: n/a — if this doesn't show up in `docker logs`, nothing below will.
SELECT pg_sleep(0.3);


-- 1. filter on an unindexed column of a big table
-- why: activity_logs has no index on user_id, so postgres reads all 10M rows
--      to find the ~1000 that match. Seq Scan + "Rows Removed by Filter: ~9.999M".
-- fix: CREATE INDEX activity_logs_user_id_idx ON activity_logs (user_id);
SELECT *
FROM activity_logs
WHERE user_id = 42;


-- 2. sort on an unindexed column
-- why: "latest 20 by created_at" has to look at every row to know which 20
--      are newest — a full Seq Scan feeding a top-N sort. (ORDER BY id DESC
--      would be instant: the primary-key index is already in that order.)
-- fix: CREATE INDEX activity_logs_created_at_idx ON activity_logs (created_at);
SELECT *
FROM activity_logs
ORDER BY created_at DESC
LIMIT 20;


-- 3. deep OFFSET pagination (#demo-pagination)
-- why: OFFSET doesn't skip rows, it reads them and throws them away. Page
--      450,000 walks 9M index entries just to return 20.
-- fix: cursor/keyset pagination — WHERE id < $lastSeenId ORDER BY id DESC LIMIT 20
SELECT *
FROM activity_logs
ORDER BY id DESC
LIMIT 20 OFFSET 9000000;


-- 4. leading-wildcard LIKE
-- why: a B-tree index can only match a known PREFIX ('check%'). With '%' in
--      front, every row's string has to be checked.
-- fix: match a prefix / exact value instead, or a pg_trgm GIN index for real
--      "contains" search.
SELECT count(*)
FROM activity_logs
WHERE action LIKE '%out%';


-- 5. wrapping a column in a function / cast kills its index
-- why: activity_logs_pkey indexes id, NOT id::text. Postgres can't use the
--      index for the cast expression, so a primary-key lookup that should
--      take 0.1ms becomes a Seq Scan of 10M rows.
--      (same trap: WHERE lower(email) = ..., WHERE date(created_at) = ...)
-- fix: compare the raw column — WHERE id = 5000000 — or build an expression
--      index on exactly the expression you query.
SELECT *
FROM activity_logs
WHERE id::text = '5000000';

-- same idea on 10M rows: date() on created_at means "compute date() for
-- every row, then compare".
-- fix: a range on the raw column —
--      WHERE created_at >= current_date - 1 AND created_at < current_date
SELECT count(*)
FROM activity_logs
WHERE date(created_at) = current_date - 1;


-- 6. OR with an unindexed column
-- why: the id half could use the primary-key index, but the user_id half
--      can't, and postgres needs rows matching EITHER side — so it scans the
--      whole table anyway. One unindexed column ruins the whole WHERE.
-- fix: index both columns (postgres can then BitmapOr them), or split into
--      two queries with UNION.
SELECT *
FROM activity_logs
WHERE id = 5000000
   OR user_id = 42;


-- 7. correlated subquery = N+1 inside the database (#demo-n-plus-1)
-- why: the subquery runs ONCE PER PRODUCT ROW, and orders.product_id has no
--      index, so each run is a Seq Scan of 300k orders.
--      200 products x 300k orders = 60M row checks. EXPLAIN ANALYZE shows
--      "SubPlan" with loops=200.
-- fix: one JOIN + GROUP BY, and/or CREATE INDEX ON orders (product_id).
SELECT
  p.id,
  p.name,
  (SELECT count(*) FROM orders o WHERE o.product_id = p.id) AS order_count
FROM products p
ORDER BY p.id
LIMIT 200;


-- 8. aggregating the whole big table
-- why: no WHERE, no index can help — COUNT(DISTINCT ...) has to read all 10M
--      rows and then sort/dedupe them.
-- fix: usually the answer is "don't do this per request": precompute it
--      (materialized view, summary table, or cache it — #demo-cache-aside).
SELECT action, count(DISTINCT user_id) AS unique_users
FROM activity_logs
GROUP BY action;


-- 9. SELECT * with no LIMIT
-- why: the query itself is simple, but it ships 300k joined rows to the
--      client. Time goes into serializing + sending, not searching.
-- fix: paginate, and select only the columns you need.
-- (\o sends the output to /dev/null so psql doesn't print 300k rows.)
\o /dev/null
SELECT o.*, p.*
FROM orders o
JOIN products p ON p.id = o.product_id;
\o


\timing off

-- ---------------------------------------------------------------------------
-- report: the slowest queries postgres has seen since the reset above.
-- mean_exec_time is the one to sort by when hunting for a bad query;
-- total_exec_time finds the query that costs the most overall (a 5ms query
-- called 100k times beats one 2s query).
-- ---------------------------------------------------------------------------
SELECT
  calls,
  round(mean_exec_time::numeric, 1)  AS mean_ms,
  round(total_exec_time::numeric, 1) AS total_ms,
  rows,
  left(regexp_replace(query, '\s+', ' ', 'g'), 90) AS query
FROM pg_stat_statements
WHERE query NOT ILIKE '%pg_stat_statements%'
ORDER BY mean_exec_time DESC
LIMIT 15;
