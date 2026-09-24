import { useCallback, useEffect, useRef, useState } from "react";
import DayNav from "../../components/DayNav";

// Day 14 demos, one tab each, all calling the monolithic backend
// (backend-lecture-code/monolithic — see DEMOS.md there):
//   #demo-n-plus-1   → /orders/with-products/n-plus-1 vs /join
//   #demo-indexing   → /orders/by-customer/:id vs /by-customer-indexed/:id
//   demo-pagination → /activity/offset vs /activity/cursor (10M rows)
const BASE_URL = "http://localhost:3100";
const API = `${BASE_URL}/activity`;
const LIMIT = 20;

type ActivityRow = {
  id: number;
  userId: number;
  action: string;
  createdAt: string;
};
type OffsetPage = { rows: ActivityRow[]; page: number; offset: number };
type CursorPage = {
  rows: ActivityRow[];
  hasNewer: boolean;
  hasOlder: boolean;
  prevCursor: number | null;
  nextCursor: number | null;
};
type Timing = { label: string; ms: number };

type OrderWithProduct = {
  id: number;
  quantity: number;
  status: string;
  productId: number;
  productName: string;
};
type WithProducts = { queryCount: number; rows: OrderWithProduct[] };
type OrderRow = {
  id: number;
  product_id: number;
  quantity: number;
  status: string;
  customer_id: number;
};

const fmt = (n: number) => n.toLocaleString();

// green < 100ms, yellow < 300ms, red otherwise
function speed(ms: number) {
  return ms < 100 ? "fast" : ms < 300 ? "medium" : "slow";
}

function ElapsedBadge({ ms }: { ms: number }) {
  return (
    <span className={`elapsed-badge is-${speed(ms)}`}>{fmt(Math.round(ms))} ms</span>
  );
}

// fetches a URL and times the round trip. a response that arrives after a
// newer click is dropped, so fast-clicking never shows a stale page.
function useTimedFetch<T>() {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<Timing[]>([]);
  const latest = useRef(0);

  const run = useCallback(async (label: string, url: string) => {
    const requestId = ++latest.current;
    setLoading(true);
    setError(null);
    const start = performance.now();
    try {
      const res = await fetch(url);
      const body = await res.json();
      if (!res.ok) throw new Error(body?.error?.message ?? `HTTP ${res.status}`);
      if (requestId !== latest.current) return;
      const ms = performance.now() - start;
      setData(body);
      setHistory((h) => [{ label, ms }, ...h].slice(0, 6));
    } catch (err) {
      if (requestId !== latest.current) return;
      setError(
        err instanceof TypeError
          ? "can't reach the API — is the monolithic server running on :3100?"
          : String(err instanceof Error ? err.message : err),
      );
    } finally {
      if (requestId === latest.current) setLoading(false);
    }
  }, []);

  return { data, loading, error, history, run };
}

// ------------------------------------------------------------------
// backend check — runs before any demo mounts
// ------------------------------------------------------------------

type BackendStatus =
  | { state: "checking" }
  | { state: "ok" }
  | { state: "down"; reason: string };

// one cheap request per demo, to make sure this backend has its endpoints
// (and that the tables they read exist)
const DEMO_ENDPOINTS = [
  { tag: "#demo-n-plus-1", path: "/orders/with-products/join?limit=1" },
  { tag: "#demo-indexing", path: "/orders/by-customer-indexed/1" },
  { tag: "#demo-pagination", path: "/activity/cursor?limit=1" },
];

// 1. GET /health → is the server up, and can it reach postgres?
// 2. one GET per demo → does this backend have the demo endpoints?
async function checkBackend(): Promise<BackendStatus> {
  const get = (url: string) => fetch(url, { signal: AbortSignal.timeout(5000) });

  let health: Response;
  try {
    health = await get(`${BASE_URL}/health`);
  } catch {
    return {
      state: "down",
      reason: `nothing is answering at ${BASE_URL}. Start it with npm run dev in backend-lecture-code/monolithic.`,
    };
  }
  if (!health.ok) {
    return {
      state: "down",
      reason: `the server is up but GET /health returned ${health.status}, so the database is probably down. Is docker-compose up running?`,
    };
  }

  for (const { tag, path } of DEMO_ENDPOINTS) {
    let res: Response;
    try {
      res = await get(`${BASE_URL}${path}`);
    } catch {
      return { state: "down", reason: `GET ${path} didn't respond.` };
    }
    if (res.status === 404) {
      return {
        state: "down",
        reason: `the server is running but GET ${path} doesn't exist. Is this the monolithic backend with ${tag}?`,
      };
    }
    if (!res.ok) {
      return {
        state: "down",
        reason: `GET ${path} returned ${res.status}. Are the tables there? Run npm run db:seed.`,
      };
    }
  }
  return { state: "ok" };
}

// ------------------------------------------------------------------
// shared pieces
// ------------------------------------------------------------------

function StatusLine({
  loading,
  error,
  history,
  children,
}: {
  loading: boolean;
  error: string | null;
  history: Timing[];
  children: React.ReactNode;
}) {
  return (
    <div className="pager-status">
      {loading ? (
        <span className="spinner" aria-label="loading" />
      ) : history[0] ? (
        <ElapsedBadge ms={history[0].ms} />
      ) : null}
      <span>{children}</span>
      {error && <span className="pager-error">{error}</span>}
    </div>
  );
}

function ActivityTable({ rows, loading }: { rows: ActivityRow[]; loading: boolean }) {
  return (
    <div className={`pager-table-wrap${loading ? " is-loading" : ""}`}>
      <table className="ref-table pager-table">
        <thead>
          <tr>
            <th>id</th>
            <th>user</th>
            <th>action</th>
            <th>created_at</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id}>
              <td>{fmt(r.id)}</td>
              <td>{r.userId}</td>
              <td>{r.action}</td>
              <td>{new Date(r.createdAt).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && (
        <div className="pager-overlay">
          <span className="spinner spinner-lg" aria-label="loading" />
        </div>
      )}
    </div>
  );
}

function History({ history }: { history: Timing[] }) {
  if (history.length === 0) return null;
  return (
    <p className="pager-history">
      recent:{" "}
      {history.map((t, i) => (
        <span key={i} className={`history-chip is-${speed(t.ms)}`}>
          {t.label} · {fmt(Math.round(t.ms))}ms
        </span>
      ))}
    </p>
  );
}

// the first few rows of a result — enough to show both sides returned the
// same data without a 2,000-row table
function PreviewTable<Row extends { id: number }>({
  rows,
  columns,
  loading,
  max = 8,
}: {
  rows: Row[];
  columns: { label: string; render: (row: Row) => React.ReactNode }[];
  loading: boolean;
  max?: number;
}) {
  return (
    <div className={`pager-table-wrap${loading ? " is-loading" : ""}`}>
      <table className="ref-table pager-table">
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c.label}>{c.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.slice(0, max).map((r) => (
            <tr key={r.id}>
              {columns.map((c) => (
                <td key={c.label}>{c.render(r)}</td>
              ))}
            </tr>
          ))}
          {rows.length > max && (
            <tr>
              <td colSpan={columns.length} className="pager-more">
                … {fmt(rows.length - max)} more rows
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {loading && (
        <div className="pager-overlay">
          <span className="spinner spinner-lg" aria-label="loading" />
        </div>
      )}
    </div>
  );
}

// the two latest timings as bars on the same scale, plus "N× faster"
function Compare({ bars }: { bars: { label: string; timing?: Timing }[] }) {
  const done = bars.filter((b): b is { label: string; timing: Timing } => !!b.timing);
  if (done.length < 2) return null;

  const max = Math.max(...done.map((b) => b.timing.ms));
  const fastest = done.reduce((a, b) => (b.timing.ms < a.timing.ms ? b : a));
  const ratio = max / fastest.timing.ms;

  return (
    <div className="speed-compare">
      {done.map((b) => (
        <div key={b.label} className="speed-compare-row">
          <span className="speed-compare-label">
            {b.label} <small>({b.timing.label})</small>
          </span>
          <div className="speed-compare-track">
            <div
              className={`speed-compare-bar is-${speed(b.timing.ms)}`}
              style={{ width: `${Math.max((b.timing.ms / max) * 100, 1)}%` }}
            />
          </div>
          <ElapsedBadge ms={b.timing.ms} />
        </div>
      ))}
      <p className="speed-compare-ratio">
        <strong>{fastest.label}</strong> was{" "}
        <strong>{ratio < 10 ? ratio.toFixed(1) : fmt(Math.round(ratio))}× faster</strong>
      </p>
    </div>
  );
}

// 1 2 … 249,999 250,000 250,001 … 499,999 500,000
function pageNumbers(current: number, last: number): (number | "…")[] {
  const pages = [
    ...new Set([1, 2, current - 1, current, current + 1, last - 1, last]),
  ]
    .filter((p) => p >= 1 && p <= last)
    .sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  pages.forEach((p, i) => {
    if (i > 0 && p - pages[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

// ------------------------------------------------------------------
// OFFSET — page numbers, jump anywhere, slower the deeper you go
// ------------------------------------------------------------------

function OffsetPager() {
  const { data, loading, error, history, run } = useTimedFetch<OffsetPage>();
  const [total, setTotal] = useState<number | null>(null);
  const [countMs, setCountMs] = useState<number | null>(null);
  const [jump, setJump] = useState("");

  const lastPage = total === null ? null : Math.ceil(total / LIMIT);
  const page = data?.page ?? 1;

  const goTo = (p: number) =>
    run(`p. ${fmt(p)}`, `${API}/offset?page=${p}&limit=${LIMIT}`);

  useEffect(() => {
    run("p. 1", `${API}/offset?page=1&limit=${LIMIT}`);

    // numbered pages need a total — which means a COUNT(*) over every row
    const start = performance.now();
    fetch(`${API}/count`)
      .then((r) => r.json())
      .then((body: { total: number }) => {
        setTotal(body.total);
        setCountMs(performance.now() - start);
      })
      .catch(() => {});
  }, [run]);

  const onJump = () => {
    const p = Number(jump);
    if (Number.isInteger(p) && p >= 1 && (lastPage === null || p <= lastPage)) goTo(p);
  };

  return (
    <section className="pager-panel">
      <h2>
        Offset pagination <code>?page=N</code>
      </h2>
      <p className="console-intro">
        <code>LIMIT 20 OFFSET (page − 1) × 20</code>. Postgres reads and throws
        away every skipped row.
      </p>

      <div className="pager-controls">
        <button disabled={loading || page <= 1} onClick={() => goTo(1)}>
          « First
        </button>
        <button disabled={loading || page <= 1} onClick={() => goTo(page - 1)}>
          ‹ Prev
        </button>
        {lastPage !== null &&
          pageNumbers(page, lastPage).map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="pager-gap">
                …
              </span>
            ) : (
              <button
                key={p}
                className={p === page ? "is-current" : undefined}
                disabled={loading}
                onClick={() => goTo(p)}
              >
                {fmt(p)}
              </button>
            ),
          )}
        <button
          disabled={loading || (lastPage !== null && page >= lastPage)}
          onClick={() => goTo(page + 1)}
        >
          Next ›
        </button>
        <button
          disabled={loading || lastPage === null || page >= lastPage}
          onClick={() => lastPage && goTo(lastPage)}
        >
          Last »
        </button>
      </div>

      <form
        className="pager-controls"
        onSubmit={(e) => {
          e.preventDefault();
          onJump();
        }}
      >
        <label>
          Go to page{" "}
          <input
            type="number"
            min={1}
            max={lastPage ?? undefined}
            value={jump}
            onChange={(e) => setJump(e.target.value)}
            placeholder="250000"
          />
        </label>
        <button type="submit" disabled={loading}>
          Go
        </button>
        {[1_000, 100_000, 250_000].map((p) => (
          <button key={p} type="button" disabled={loading} onClick={() => goTo(p)}>
            {fmt(p)}
          </button>
        ))}
      </form>

      <StatusLine loading={loading} error={error} history={history}>
        page <strong>{fmt(page)}</strong>
        {lastPage !== null && <> of {fmt(lastPage)}</>} · OFFSET{" "}
        {fmt(data?.offset ?? 0)}
      </StatusLine>
      {/* <p className="pager-note">
        {countMs === null ? (
          "counting rows for the page total…"
        ) : (
          <>
            page total needed a <code>COUNT(*)</code> of {fmt(total ?? 0)} rows:{" "}
            <ElapsedBadge ms={countMs} />
          </>
        )}
      </p> */}

      <ActivityTable rows={data?.rows ?? []} loading={loading} />
      <History history={history} />
    </section>
  );
}

// ------------------------------------------------------------------
// CURSOR — first / prev / next / last only, same speed everywhere
// ------------------------------------------------------------------

function CursorPager() {
  const { data, loading, error, history, run } = useTimedFetch<CursorPage>();
  const [position, setPosition] = useState("first page");

  const go = useCallback(
    (label: string, query: string, where: string) => {
      setPosition(where);
      return run(label, `${API}/cursor?limit=${LIMIT}${query}`);
    },
    [run],
  );

  useEffect(() => {
    run("first", `${API}/cursor?limit=${LIMIT}`);
  }, [run]);

  const prev = data?.prevCursor;
  const next = data?.nextCursor;

  return (
    <section className="pager-panel">
      <h2>
        Cursor pagination <code>?after=id</code>
      </h2>
      <p className="console-intro">
        <code>WHERE id &lt; cursor LIMIT 20</code>. The index seeks straight to
        the cursor, with nothing skipped.
      </p>

      <div className="pager-controls">
        <button disabled={loading || !data?.hasNewer} onClick={() => go("first", "", "first page")}>
          « First
        </button>
        <button
          disabled={loading || !data?.hasNewer || prev == null}
          onClick={() => go(`before ${fmt(prev!)}`, `&before=${prev}`, `WHERE id > ${fmt(prev!)}`)}
        >
          ‹ Prev
        </button>
        <button
          disabled={loading || !data?.hasOlder || next == null}
          onClick={() => go(`after ${fmt(next!)}`, `&after=${next}`, `WHERE id < ${fmt(next!)}`)}
        >
          Next ›
        </button>
        <button disabled={loading || !data?.hasOlder} onClick={() => go("last", "&last=true", "last page")}>
          Last »
        </button>
      </div>

      <div className="pager-controls pager-no-jump">
        No page numbers and no "go to page". A cursor only knows "the rows
        after id X", not which page number that is.
      </div>

      <StatusLine loading={loading} error={error} history={history}>
        <strong>{position}</strong>
      </StatusLine>
      <p className="pager-note">no COUNT(*) needed. It only asks "is there one more row?"</p>

      <ActivityTable rows={data?.rows ?? []} loading={loading} />
      <History history={history} />
    </section>
  );
}

// ------------------------------------------------------------------
// TAB: N+1 — one query per order vs one join
// ------------------------------------------------------------------

const N_PLUS_ONE_LIMITS = [100, 500, 1_000, 2_000];

const orderWithProductColumns = [
  { label: "order", render: (r: OrderWithProduct) => fmt(r.id) },
  { label: "qty", render: (r: OrderWithProduct) => r.quantity },
  { label: "status", render: (r: OrderWithProduct) => r.status },
  { label: "product", render: (r: OrderWithProduct) => r.productName },
];

function NPlusOneDemo() {
  const [limit, setLimit] = useState(500);
  const nPlusOne = useTimedFetch<WithProducts>();
  const join = useTimedFetch<WithProducts>();
  const busy = nPlusOne.loading || join.loading;

  const runNPlusOne = () =>
    nPlusOne.run(`${fmt(limit)} orders`, `${BASE_URL}/orders/with-products/n-plus-1?limit=${limit}`);
  const runJoin = () =>
    join.run(`${fmt(limit)} orders`, `${BASE_URL}/orders/with-products/join?limit=${limit}`);
  // one after the other, so the two don't compete for db connections
  const runBoth = async () => {
    await runNPlusOne();
    await runJoin();
  };

  return (
    <>
      <p className="console-intro">
        A page of orders, each with its product's name. Both sides return the
        same rows. The N+1 side sends one extra query per order.
      </p>

      <div className="demo-toolbar">
        <span>orders:</span>
        {N_PLUS_ONE_LIMITS.map((n) => (
          <button
            key={n}
            className={n === limit ? "is-current" : undefined}
            disabled={busy}
            onClick={() => setLimit(n)}
          >
            {fmt(n)}
          </button>
        ))}
        <button className="demo-run-both" disabled={busy} onClick={runBoth}>
          ▶ Run both
        </button>
      </div>

      <Compare
        bars={[
          { label: "N+1", timing: nPlusOne.history[0] },
          { label: "JOIN", timing: join.history[0] },
        ]}
      />

      <div className="pager-grid">
        <section className="pager-panel">
          <h2>
            N+1 <code>1 + N queries</code>
          </h2>
          <pre className="demo-sql">{`SELECT ... FROM orders LIMIT ${limit};
-- then, once PER order:
SELECT name FROM products WHERE id = $1;`}</pre>
          <div className="pager-controls">
            <button disabled={busy} onClick={runNPlusOne}>
              ▶ Run
            </button>
          </div>
          <StatusLine loading={nPlusOne.loading} error={nPlusOne.error} history={nPlusOne.history}>
            {nPlusOne.data ? (
              <>
                <strong>{fmt(nPlusOne.data.queryCount)} queries</strong> ·{" "}
                {fmt(nPlusOne.data.rows.length)} rows
              </>
            ) : (
              "not run yet"
            )}
          </StatusLine>
          <PreviewTable
            rows={nPlusOne.data?.rows ?? []}
            columns={orderWithProductColumns}
            loading={nPlusOne.loading}
          />
          <History history={nPlusOne.history} />
        </section>

        <section className="pager-panel">
          <h2>
            JOIN <code>1 query</code>
          </h2>
          <pre className="demo-sql">{`SELECT o.id, ..., p.name
FROM orders o
JOIN products p ON p.id = o.product_id
LIMIT ${limit};`}</pre>
          <div className="pager-controls">
            <button disabled={busy} onClick={runJoin}>
              ▶ Run
            </button>
          </div>
          <StatusLine loading={join.loading} error={join.error} history={join.history}>
            {join.data ? (
              <>
                <strong>{fmt(join.data.queryCount)} query</strong> ·{" "}
                {fmt(join.data.rows.length)} rows
              </>
            ) : (
              "not run yet"
            )}
          </StatusLine>
          <PreviewTable
            rows={join.data?.rows ?? []}
            columns={orderWithProductColumns}
            loading={join.loading}
          />
          <History history={join.history} />
        </section>
      </div>
    </>
  );
}

// ------------------------------------------------------------------
// TAB: indexing — same query on an unindexed vs an indexed column
// ------------------------------------------------------------------

const CUSTOMER_COUNT = 10_000;

const orderColumns = [
  { label: "order", render: (r: OrderRow) => fmt(r.id) },
  { label: "product", render: (r: OrderRow) => r.product_id },
  { label: "qty", render: (r: OrderRow) => r.quantity },
  { label: "status", render: (r: OrderRow) => r.status },
];

function IndexingDemo() {
  const [customerId, setCustomerId] = useState("42");
  const withoutIndex = useTimedFetch<OrderRow[]>();
  const withIndex = useTimedFetch<OrderRow[]>();
  const busy = withoutIndex.loading || withIndex.loading;

  const id = Number(customerId);
  const valid = Number.isInteger(id) && id >= 1 && id <= CUSTOMER_COUNT;

  const runWithout = (cid = id) =>
    withoutIndex.run(`customer ${cid}`, `${BASE_URL}/orders/by-customer/${cid}`);
  const runWith = (cid = id) =>
    withIndex.run(`customer ${cid}`, `${BASE_URL}/orders/by-customer-indexed/${cid}`);
  // one after the other, so the two don't compete for db connections
  const runBoth = async (cid = id) => {
    await runWithout(cid);
    await runWith(cid);
  };
  const runRandom = () => {
    const cid = Math.floor(Math.random() * CUSTOMER_COUNT) + 1;
    setCustomerId(String(cid));
    runBoth(cid);
  };

  return (
    <>
      <p className="console-intro">
        All orders for one customer, out of 300,000. <code>orders</code> stores
        the same customer id twice, and only <code>customer_id_indexed</code>{" "}
        has an index. At this table size both are quick, so watch the ratio. The
        full scan grows with the table; the index lookup barely does.
      </p>

      <form
        className="demo-toolbar"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) runBoth();
        }}
      >
        <label>
          customer id{" "}
          <input
            type="number"
            min={1}
            max={CUSTOMER_COUNT}
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
          />
        </label>
        <button type="submit" className="demo-run-both" disabled={busy || !valid}>
          ▶ Run both
        </button>
        <button type="button" disabled={busy} onClick={runRandom}>
          🎲 Random customer
        </button>
      </form>

      <Compare
        bars={[
          { label: "WITHOUT index", timing: withoutIndex.history[0] },
          { label: "WITH index", timing: withIndex.history[0] },
        ]}
      />

      <div className="pager-grid">
        <section className="pager-panel">
          <h2>
            Without index <code>customer_id</code>
          </h2>
          <pre className="demo-sql">{`SELECT * FROM orders
WHERE customer_id = ${valid ? id : "$1"};
-- no index: reads all 300,000 rows`}</pre>
          <div className="pager-controls">
            <button disabled={busy || !valid} onClick={() => runWithout()}>
              ▶ Run
            </button>
          </div>
          <StatusLine loading={withoutIndex.loading} error={withoutIndex.error} history={withoutIndex.history}>
            {withoutIndex.data ? <>{fmt(withoutIndex.data.length)} orders found</> : "not run yet"}
          </StatusLine>
          <PreviewTable rows={withoutIndex.data ?? []} columns={orderColumns} loading={withoutIndex.loading} />
          <History history={withoutIndex.history} />
        </section>

        <section className="pager-panel">
          <h2>
            With index <code>customer_id_indexed</code>
          </h2>
          <pre className="demo-sql">{`SELECT * FROM orders
WHERE customer_id_indexed = ${valid ? id : "$1"};
-- index: jumps to the ~30 matching rows`}</pre>
          <div className="pager-controls">
            <button disabled={busy || !valid} onClick={() => runWith()}>
              ▶ Run
            </button>
          </div>
          <StatusLine loading={withIndex.loading} error={withIndex.error} history={withIndex.history}>
            {withIndex.data ? <>{fmt(withIndex.data.length)} orders found</> : "not run yet"}
          </StatusLine>
          <PreviewTable rows={withIndex.data ?? []} columns={orderColumns} loading={withIndex.loading} />
          <History history={withIndex.history} />
        </section>
      </div>
    </>
  );
}

// ------------------------------------------------------------------
// TAB: pagination — offset vs cursor (the two pagers above)
// ------------------------------------------------------------------

function PaginationDemo() {
  return (
    <>
      <p className="console-intro">
        Offset vs. cursor pagination over <code>activity_logs</code> (10,000,000
        rows, newest first).
      </p>

      <div className="pager-grid">
        <OffsetPager />
        <CursorPager />
      </div>

      <h2>Trade-offs</h2>
      <table className="ref-table">
        <thead>
          <tr>
            <th></th>
            <th>Offset</th>
            <th>Cursor</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Jump to page N</td>
            <td>✅ any page, any time</td>
            <td>❌ only first / prev / next / last</td>
          </tr>
          <tr>
            <td>Deep pages</td>
            <td>❌ slower the deeper you go</td>
            <td>✅ same speed on every page</td>
          </tr>
          <tr>
            <td>"Page X of Y"</td>
            <td>needs a <code>COUNT(*)</code>, itself slow on big tables</td>
            <td>not needed</td>
          </tr>
          <tr>
            <td>New rows while browsing</td>
            <td>rows shift, so you see duplicates or skips</td>
            <td>stable, since the cursor is a fixed id</td>
          </tr>
          <tr>
            <td>Best for</td>
            <td>admin tables, search results, small tables</td>
            <td>feeds, infinite scroll, big tables, public APIs</td>
          </tr>
        </tbody>
      </table>
    </>
  );
}

// ------------------------------------------------------------------
// page — tabs (plain state + #hash, not routes)
// ------------------------------------------------------------------

const TABS = [
  { id: "n-plus-1", label: "N+1 queries" },
  { id: "indexing", label: "Indexing" },
  { id: "pagination", label: "Pagination" },
] as const;
type TabId = (typeof TABS)[number]["id"];

// the hash only remembers the tab across a reload — it's not a route
function initialTab(): TabId {
  const hash = window.location.hash.slice(1);
  return TABS.find((t) => t.id === hash)?.id ?? "n-plus-1";
}

export default function Lecture() {
  const [tab, setTab] = useState<TabId>(initialTab);

  const selectTab = (id: TabId) => {
    setTab(id);
    window.history.replaceState(null, "", `#${id}`);
  };

  const [backend, setBackend] = useState<BackendStatus>({ state: "checking" });

  useEffect(() => {
    checkBackend().then(setBackend);
  }, []);

  const retry = () => {
    setBackend({ state: "checking" });
    checkBackend().then(setBackend);
  };

  return (
    <div className="page lecture-page lecture-console">
      <title>Day 14 — Lecture Canvas</title>
      <DayNav day="day14-database-performance" current="lecture" />
      <h1>Day 14 — Lecture Canvas</h1>

      <div className="demo-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? "is-active" : undefined}
            onClick={() => selectTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <p className="console-intro">
        Every time shown is the browser's full round trip:{" "}
        <span className="elapsed-badge is-fast">&lt; 100 ms</span>{" "}
        <span className="elapsed-badge is-medium">100–300 ms</span>{" "}
        <span className="elapsed-badge is-slow">≥ 300 ms</span>
      </p>

      {backend.state === "checking" && (
        <div className="backend-banner is-checking">
          <span className="spinner" aria-label="checking" /> Checking the backend
          at {BASE_URL}…
        </div>
      )}
      {backend.state === "down" && (
        <div className="backend-banner is-down" role="alert">
          <div>
            <strong>The backend isn't running, so this demo won't work.</strong>
            <br />
            {backend.reason}
          </div>
          <button onClick={retry}>Retry</button>
        </div>
      )}
      {/* every tab stays mounted and is only hidden, so switching tabs
          keeps each demo's results */}
      {backend.state === "ok" && (
        <>
          <div role="tabpanel" hidden={tab !== "n-plus-1"}>
            <NPlusOneDemo />
          </div>
          <div role="tabpanel" hidden={tab !== "indexing"}>
            <IndexingDemo />
          </div>
          <div role="tabpanel" hidden={tab !== "pagination"}>
            <PaginationDemo />
          </div>
        </>
      )}
    </div>
  );
}
