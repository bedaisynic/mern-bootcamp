import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 14 — Concepts Reference</title>
      <DayNav day="day14-database-performance" current="concepts" />
      <h1>Day 14 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up constantly in interviews.
          If you're shaky on any of these, that's the priority to fix.
        </p>

        <details>
          <summary>What is an N+1 query problem?</summary>
          <div className="answer">
            <p>
              Running one query to fetch a list, then one more query per row to fetch that row's
              related data — 1 query becomes 1 + N. It scales badly: it's invisible with 5 rows and
              very visible with 5,000.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you fix an N+1 query?</summary>
          <div className="answer">
            <p>
              Replace the per-row queries with one query that joins the related table, so the whole
              result comes back in a single round trip instead of N+1.
            </p>
          </div>
        </details>

        <details>
          <summary>What does a database index actually do?</summary>
          <div className="answer">
            <p>
              It's a separate, sorted lookup structure Postgres maintains next to a table, so a
              query can find matching rows directly instead of scanning every row in the table.
            </p>
          </div>
        </details>

        <details>
          <summary>What's the tradeoff of adding an index?</summary>
          <div className="answer">
            <p>
              Faster reads, slower writes — every <code>INSERT</code>/<code>UPDATE</code>/
              <code>DELETE</code> also has to update every index on that table, so you index the
              columns you actually filter or join on, not everything.
            </p>
          </div>
        </details>

        <details>
          <summary>
            In an <code>EXPLAIN</code> plan, what's the difference between a Seq Scan and an Index
            Scan?
          </summary>
          <div className="answer">
            <p>
              A Seq Scan reads every row in the table and filters them one by one. An Index Scan
              uses an index to jump straight to the matching rows without reading the whole table.
            </p>
          </div>
        </details>

        <details>
          <summary>What problem does sharding solve?</summary>
          <div className="answer">
            <p>
              A single database running out of storage or write throughput. Sharding splits one
              table's rows across multiple separate databases by some key, so each shard only holds
              a fraction of the data.
            </p>
          </div>
        </details>

        <details>
          <summary>What problem does replication solve?</summary>
          <div className="answer">
            <p>
              Read load and durability. Replication copies the same data to one or more read
              replicas that stay in sync with the primary, so reads can be spread off the primary
              and the data survives the primary going down.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you pick a NoSQL store over a relational database for a table?</summary>
          <div className="answer">
            <p>
              When that table doesn't need joins or multi-table transactions and is high write
              volume with simple key-based lookups — e.g. an append-only status/event log. Tables
              that need relational joins and ACID guarantees stay in SQL.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
