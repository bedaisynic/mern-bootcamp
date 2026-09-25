import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 15 — Concepts Reference</title>
      <DayNav day="day15-aws-deployment" current="concepts" />
      <h1>Day 15 — Concepts Reference</h1>
      <p className="intro">
        A reference list of concept questions — try answering each one before revealing it.
      </p>

      <section id="tier-1">
        <h2>1. Basic concepts</h2>
        <p className="tier-note">
          Foundational stuff — straight from the lecture and/or comes up constantly in interviews. If
          you&apos;re shaky on any of these, that&apos;s the priority to fix.
        </p>

        <details>
          <summary>Why does the app run on EC2 while the database runs on RDS, instead of installing Postgres on the same instance?</summary>
          <div className="answer">
            <p>
              Compute and storage have different lifecycles — EC2 can be resized or replaced without
              touching the database, and RDS handles backups, patching, and failover automatically
              instead of you owning that by hand.
            </p>
          </div>
        </details>

        <details>
          <summary>What does a presigned URL let a client do, and why doesn&apos;t the server proxy the file bytes?</summary>
          <div className="answer">
            <p>
              It lets the client upload or download directly to/from S3 using a short-lived signed
              URL. The server never touches the file&apos;s bytes, so it isn&apos;t a bottleneck or a
              cost center for large files.
            </p>
          </div>
        </details>

        <details>
          <summary>What kind of workload is Lambda well-suited for, and what&apos;s a bad fit for it?</summary>
          <div className="answer">
            <p>
              Bursty, one-shot, event-triggered work (generate a PDF, resize an image) fits well — it
              runs on demand and costs nothing idle. A long-running server holding open database
              connections and serving continuous traffic, like this project&apos;s API, belongs on
              EC2 instead.
            </p>
          </div>
        </details>

        <details>
          <summary>When would you reach for DynamoDB instead of RDS in this project?</summary>
          <div className="answer">
            <p>
              For data that&apos;s high-write, append-only, and never joined — <code>order_status_history</code>{" "}
              is the example from Day 14. Data with real relationships, like orders/products/inventory,
              stays on RDS.
            </p>
          </div>
        </details>

        <details>
          <summary>What does CloudWatch give you that <code>console.log</code> on your own laptop doesn&apos;t?</summary>
          <div className="answer">
            <p>
              Once the app runs on a remote EC2 instance, nobody is watching its terminal — CloudWatch
              Logs collects that output so you can search it after the fact, and CloudWatch Metrics
              turns numbers into graphs and alarms.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between vertical scaling and adding a read replica on RDS?</summary>
          <div className="answer">
            <p>
              Vertical scaling makes the single instance bigger (more CPU/RAM). A read replica adds a
              second instance that copies the primary and serves read traffic, so reads scale without
              resizing the primary at all.
            </p>
          </div>
        </details>

        <details>
          <summary>Why keep the shipping-label Lambda separate from the main Express app instead of adding a <code>/generate-label</code> endpoint to it?</summary>
          <div className="answer">
            <p>
              The work is bursty and one-shot, not continuous — running it on Lambda means it scales
              to zero when idle and doesn&apos;t compete with the API&apos;s own request-handling
              capacity during a traffic spike.
            </p>
          </div>
        </details>
      </section>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today&apos;s lecture covered — mostly
          &quot;gotcha&quot; interview trivia and things that sharpen how you code without being
          asked often.
        </p>

        <details>
          <summary>What happens to in-flight requests when you deploy a new version to a single EC2 instance with no load balancer?</summary>
          <div className="answer">
            <p>
              They get dropped the moment the old process stops — a single instance with no load
              balancer has no way to drain traffic before restarting. This is the gap a load balancer
              and multiple instances close later in the curriculum.
            </p>
          </div>
        </details>

        <details>
          <summary>Why is a presigned URL&apos;s expiration time a security control, not just a convenience default?</summary>
          <div className="answer">
            <p>
              A presigned URL grants access to whoever holds it, with no further auth check — a short
              expiry limits how long a leaked or logged URL stays usable.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s a &quot;cold start&quot; in Lambda, and why does it matter for latency-sensitive work?</summary>
          <div className="answer">
            <p>
              A cold start is the extra latency Lambda pays to initialize a new execution environment
              when no warm one is available — fine for background work, but a real problem if you put
              a user-facing request on the same path.
            </p>
          </div>
        </details>

        <details>
          <summary>What durability guarantee does S3 advertise?</summary>
          <div className="answer">
            <p>S3 advertises &quot;11 nines&quot; (99.999999999%) durability for stored objects.</p>
          </div>
        </details>
      </section>
    </div>
  );
}
