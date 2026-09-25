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
              It's when you run one query to get a list, then fire one more query for every item in
              that list to get its related data. Loading 50 orders and then their items one order
              at a time is 51 queries where 1 or 2 would do.
            </p>
            <p>
              What makes it dangerous is that nothing breaks. Each query is fast on its own, and
              with a few seed rows you'd never notice. But the cost grows with your data, and each
              query is a separate network round trip, so the page gets slower and slower as the
              table grows. It also hides well: inside a helper function, inside a{" "}
              <code>Promise.all</code> (parallel, but still N queries), or behind ORM lazy loading,
              where just reading <code>order.customer</code> quietly runs a query.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you fix an N+1 query?</summary>
          <div className="answer">
            <p>
              Stop querying inside the loop and get the related data in bulk. There are two usual
              ways to do that. You can write one <code>JOIN</code> that returns parents and
              children together. Or you can fetch the parents, collect their ids, and get all the
              children in a single batched query like{" "}
              <code>WHERE order_id = ANY($1)</code>, then match them up in code. Either way it's one
              or two queries no matter how many rows come back.
            </p>
            <p>
              The batched version is often better when a join would repeat the parent's columns on
              every child row, or when you join several one-to-many tables and the rows multiply.
              With an ORM, the fix is usually its eager-loading option (<code>include</code>,{" "}
              <code>populate</code>, and so on), which does one of those two things for you.
            </p>
          </div>
        </details>

        <details>
          <summary>What does a database index actually do?</summary>
          <div className="answer">
            <p>
              An index is a separate data structure, usually a B-tree, that keeps a column's values
              in sorted order along with pointers to the rows that hold them. With it, the database
              can find{" "}
              <code>WHERE status = 'packed'</code> the way you'd use the index at the back of a
              book. It jumps to the right spot in a few steps instead of reading all 5 million
              rows.
            </p>
            <p>
              Because the entries are sorted, the same index also helps range filters (
              <code>&gt;</code>, <code>BETWEEN</code>), <code>ORDER BY</code> and joins on that
              column. Two caveats. It only helps if the query can actually use it: wrapping the
              column in a function like <code>LOWER(email)</code> usually stops the index from being
              used. And if a filter matches a large share of the table, Postgres may decide a full
              scan is cheaper and skip the index anyway.
            </p>
          </div>
        </details>

        <details>
          <summary>What's the tradeoff of adding an index?</summary>
          <div className="answer">
            <p>
              You trade write speed and storage for read speed. Every <code>INSERT</code>,{" "}
              <code>DELETE</code>, and every <code>UPDATE</code> that touches an indexed column has
              to update each index on that table as well. So a write-heavy table with eight indexes
              pays for all eight on every write. Indexes also take disk space and memory, and on a
              big table they can grow to a size comparable to the table itself.
            </p>
            <p>
              So you don't index every column. You index the ones your real queries filter, join or
              sort on, check with <code>EXPLAIN</code> that the index actually gets used, and drop
              the ones that never do. Columns where most rows share the same value, like a boolean,
              rarely pay off on their own.
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
              A Seq Scan reads the whole table from start to finish and checks each row against the
              filter. An Index Scan walks the index to find the matching entries, then fetches only
              those rows. On a large table where the filter matches a few rows, that's the gap
              between hundreds of milliseconds and well under one.
            </p>
            <p>
              A Seq Scan isn't automatically bad, though. On a small table, or when the filter
              matches a big share of the rows, reading straight through is actually cheaper, and the
              planner picks it on purpose. The red flag is a Seq Scan on a large table when you
              expected only a few rows back. Also, use <code>EXPLAIN ANALYZE</code> rather than
              plain <code>EXPLAIN</code>, because it runs the query and shows real times and row
              counts next to the estimates.
            </p>
          </div>
        </details>

        <details>
          <summary>What problem does sharding solve?</summary>
          <div className="answer">
            <p>
              Sharding is for when one database server can't keep up anymore, either because the
              data won't fit or because there are more writes than one machine can handle. You
              split a table's rows across several independent databases by a shard key (e.g.{" "}
              <code>user_id</code>), so each server holds and writes only its slice. It's the main
              way to scale writes horizontally. Replicas don't help there, because every write
              still goes to one primary.
            </p>
            <p>
              The cost is complexity. Queries and transactions that span several shards get slow or
              impossible. Pick a bad shard key and one shard becomes a hot spot. Moving data around
              later is painful. That's why it's the last thing you reach for, after indexing, query
              fixes, a bigger machine, read replicas and partitioning.
            </p>
          </div>
        </details>

        <details>
          <summary>What problem does replication solve?</summary>
          <div className="answer">
            <p>
              Replication keeps full copies of the database on other servers. All writes go to the
              primary and stream out to one or more replicas. That solves two things. You can send
              read traffic to the replicas, which is great for read-heavy apps. And you have a
              standby that can be promoted if the primary dies.
            </p>
            <p>
              What it doesn't do is scale writes, since every write still hits the primary. The
              catch is replication lag: replicas are usually a little behind. So if a user saves
              something and the next request reads from a replica, they may not see their own
              change. The common fix is to send reads that must be fresh to the primary.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you pick a NoSQL store over a relational database for a table?</summary>
          <div className="answer">
            <p>
              When that data's access pattern is simple and its volume is huge. The records are
              read and written by a key, they don't need joins or multi-row transactions, and you
              need throughput that's easy to scale out. An append-only event or status log is the
              classic case: tons of writes, each one on its own, always looked up by something like
              "all events for order X".
            </p>
            <p>
              The flip side is that you give up flexible querying. In NoSQL you design the data
              around the questions you already know you'll ask. A new kind of query later can mean
              reshaping the data, and consistency is often eventual rather than ACID. So it's
              usually not a whole-app decision: orders, payments and users stay in Postgres, and
              just the high-volume, simple-access piece moves out.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
