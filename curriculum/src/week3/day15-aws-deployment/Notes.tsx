import { Link } from "react-router-dom";
import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 15 Notes</title>
      <DayNav day="day15-aws-deployment" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 3 · Day 15 · Notes</p>
        <h1>AWS</h1>
        <p className="subtitle">Executive summary → the services → comparisons</p>
      </header>

      {/* ============================================================ */}
      {/* Section 1 — Executive Summary                                 */}
      {/* ============================================================ */}
      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what each service covered today is, in one line:</p>

        <p className="compare-label">
          <strong>Compute</strong>
        </p>
        <ul>
          <li>
            <strong>EC2</strong> — a virtual server you rent; you control the OS and everything
            running on it.
          </li>
          <li>
            <strong>Lambda</strong> — runs a single function when an event happens, with no server
            to manage; you pay only while it runs.
          </li>
        </ul>

        <p className="compare-label">
          <strong>Storage &amp; databases</strong>
        </p>
        <ul>
          <li>
            <strong>S3</strong> — storage for files (images, PDFs, backups), each one fetched by a
            key.
          </li>
          <li>
            <strong>RDS</strong> — a managed relational database (Postgres, MySQL, …); AWS runs the
            server, you run the SQL.
          </li>
          <li>
            <strong>DynamoDB</strong> — a fully managed NoSQL key-value database built for fast
            lookups at huge scale.
          </li>
        </ul>

        <p className="compare-label">
          <strong>Operations &amp; security</strong>
        </p>
        <ul>
          <li>
            <strong>CloudWatch</strong> — logs, metrics and alarms for everything running in AWS.
          </li>
          <li>
            <strong>IAM</strong> — decides who (a person or a service) is allowed to do what, on
            which AWS resource.
          </li>
          <li>
            <strong>VPC</strong> — your own private network inside AWS; security groups act as the
            firewall around each resource.
          </li>
          <li>
            <strong>Secrets Manager</strong> — stores passwords and API keys so they never sit in
            your code or <code>.env</code> file.
          </li>
          <li>
            <strong>Infrastructure as Code (Terraform)</strong> — describes your AWS setup in code
            files, so it can be rebuilt and reviewed instead of clicked together by hand.
          </li>
        </ul>

        <p>
          Want more? <Link to="/week3/day15-aws-deployment/concepts">View all concepts?</Link>
        </p>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 2 — The services, one by one                          */}
      {/* ============================================================ */}
      <section id="full-walkthrough">
        <h2>Section 2 — The Services, One by One</h2>

        <h3 className="part">Compute</h3>

        {/* ---------------- EC2 ---------------- */}
        <h4 className="topic">EC2 — Elastic Compute Cloud</h4>
        <p>
          A virtual machine in an AWS data center. You pick its size (the <em>instance type</em>:
          CPU and RAM) and its OS image, and from the OS up everything is yours: installing Node,
          applying patches, keeping the process running.
        </p>
        <p>
          <strong>Commonly used for:</strong> long-running web servers and APIs, background
          workers, anything that holds open connections (WebSockets), and anything needing full
          control of the machine.
        </p>
        <div className="concept">
          <p className="concept-label">Key ideas</p>
          <ul>
            <li>
              <strong>Vertical scaling</strong> means moving to a bigger instance type. It's simple,
              but it needs a restart, and there's always a biggest machine.
            </li>
            <li>
              <strong>Horizontal scaling</strong> means running more instances. An{" "}
              <strong>Auto Scaling Group</strong> keeps a target number running, adds or removes
              instances based on a metric (CPU, request count), and replaces any that fail. A{" "}
              <strong>load balancer (ALB)</strong> in front spreads traffic across them and stops
              sending traffic to unhealthy ones.
            </li>
            <li>
              For horizontal scaling to work, <strong>servers must be stateless</strong>. Instances
              get added and killed at any time, so sessions, uploaded files and anything else that
              must survive can't live on the instance. They go to the database, S3, or a cache.
            </li>
            <li>
              <strong>Pricing models:</strong> On-Demand (pay by the second, no commitment);
              Reserved / Savings Plans (commit for 1–3 years, much cheaper); Spot (spare capacity
              at up to ~90% off, but AWS can take it back with 2 minutes' notice, so it's only for
              work that can be interrupted).
            </li>
          </ul>
        </div>

        {/* ---------------- Lambda ---------------- */}
        <h4 className="topic">Lambda — serverless functions</h4>
        <p>
          You upload a function and AWS runs it whenever an event triggers it. There's no server to
          manage, it scales automatically, and you pay per request and per millisecond of run
          time. When nothing is happening, it costs nothing.
        </p>
        <p>
          <strong>Common triggers:</strong> an HTTP request through API Gateway, a file landing in
          S3, a message on a queue (SQS), a schedule (cron). <strong>Commonly used for:</strong>{" "}
          resizing an image after upload, webhook handlers, nightly jobs, glue between services,
          low- or spiky-traffic APIs.
        </p>
        <CodeBlock
          language="typescript"
          code={`// Runs ONCE per cold start, then reused by every warm invocation —
// so create clients here, not inside the handler
const s3 = new S3Client({});

export async function handler(event: S3Event) {
  // runs on EVERY invocation
  const key = event.Records[0].s3.object.key;
  await createThumbnail(s3, key);
}`}
        />
        <div className="concept">
          <p className="concept-label">Key ideas</p>
          <ul>
            <li>
              <strong>Cold start.</strong> On the first call, after a period of no traffic, or when
              scaling out to a new copy, AWS has to create a fresh environment and load your code
              before the handler runs. That adds roughly 100ms to over a second. Later calls reuse
              the warm environment. To reduce cold starts: keep the bundle small, avoid heavy
              startup work, or pay for <strong>provisioned concurrency</strong> to keep copies
              warm.
            </li>
            <li>
              <strong>Hard limits:</strong> a function can run for at most 15 minutes, and its CPU
              grows with the memory you give it. Long jobs don't belong here.
            </li>
            <li>
              <strong>Every concurrent request gets its own copy.</strong> 500 requests at once
              means 500 separate environments, each with its own memory and its own database
              connection. That can use up all of Postgres's connections, the Day 14 pooling problem
              at a bigger scale. <strong>RDS Proxy</strong> exists to pool those connections.
            </li>
            <li>
              <strong>Stateless by design:</strong> nothing is guaranteed to survive between calls,
              so any state lives in a database or S3.
            </li>
          </ul>
        </div>

        <h3 className="part">Storage &amp; databases</h3>

        {/* ---------------- S3 ---------------- */}
        <h4 className="topic">S3 — Simple Storage Service</h4>
        <p>
          Object storage. You put files (<em>objects</em>) into <em>buckets</em>, and each one is
          addressed by a key like <code>orders/42/label.pdf</code>. It isn't a real file system:
          the "folders" are just prefixes in the key. Storage is effectively unlimited and it's
          built for 99.999999999% (11 nines) durability.
        </p>
        <p>
          <strong>Commonly used for:</strong> user uploads, images and video, hosting a static
          React build (usually with the CloudFront CDN in front), backups, and log archives.
        </p>
        <div className="concept">
          <p className="concept-label">Key ideas</p>
          <ul>
            <li>
              <strong>Buckets are private by default.</strong> Access is granted through IAM and
              bucket policies. The well-known S3 data leaks were almost always a bucket someone made
              public by mistake.
            </li>
            <li>
              <strong>Presigned URLs:</strong> the server signs a short-lived URL, and the browser
              uploads or downloads the file directly to S3. The file's bytes never pass through
              your API, and the expiry time is a security control: a leaked link stops working.
            </li>
            <li>
              <strong>S3 isn't a database.</strong> You can't query what's inside a file, and you
              replace an object as a whole rather than editing it. The usual pattern is that S3
              stores the file and your database stores its key plus the metadata.
            </li>
            <li>
              <strong>Storage classes</strong> trade retrieval speed for price: Standard, then
              Infrequent Access, then Glacier (cheap archive that takes minutes to hours to
              retrieve). <em>Lifecycle rules</em> move old objects down automatically.
            </li>
          </ul>
        </div>

        {/* ---------------- RDS ---------------- */}
        <h4 className="topic">RDS — Relational Database Service</h4>
        <p>
          A managed relational database: Postgres, MySQL, SQL Server and others, plus{" "}
          <strong>Aurora</strong>, AWS's own Postgres/MySQL-compatible engine. You still design the
          schema and write the SQL. AWS runs the server underneath.
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>AWS handles</th>
              <th>You still handle</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Provisioning, OS and database patching</td>
              <td>Schema design, queries, indexes</td>
            </tr>
            <tr>
              <td>Automated backups, point-in-time restore</td>
              <td>Choosing the instance size</td>
            </tr>
            <tr>
              <td>Failover to a standby, read replicas (a few clicks)</td>
              <td>Deciding when you need them</td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Key ideas</p>
          <ul>
            <li>
              <strong>Multi-AZ vs. read replica</strong> is the classic question.{" "}
              <strong>Multi-AZ</strong> keeps a standby in another data center, written to at the
              same moment as the primary. It's there for <em>availability</em>: if the primary
              fails, AWS switches over automatically in about a minute or two, and in the standard
              setup you can't read from the standby. A <strong>read replica</strong> is a copy
              that's updated asynchronously and that you <em>can</em> read from. It's there for{" "}
              <em>performance</em>, and it lags slightly behind the primary.
            </li>
            <li>
              <strong>Scaling:</strong> you can move up to a bigger instance and add read replicas,
              but all writes still go to one primary. Past that point, you're back to Day 14's
              sharding.
            </li>
            <li>
              <strong>Why not install Postgres on an EC2 instance?</strong> You'd take on backups,
              patching and failover yourself. You'd only do that if you need something RDS doesn't
              allow, like full superuser access.
            </li>
          </ul>
        </div>

        {/* ---------------- DynamoDB ---------------- */}
        <h4 className="topic">DynamoDB</h4>
        <p>
          A fully managed, serverless NoSQL key-value and document database. There's no instance to
          size and no server to patch, and lookups take single-digit milliseconds whether the
          table has a thousand items or a billion.
        </p>
        <p>
          <strong>Commonly used for:</strong> sessions, shopping carts, user preferences, event and
          status logs, IoT readings. In other words, huge volume, always looked up the same way.
        </p>
        <CodeBlock
          language="plaintext"
          code={`Table: order_events
partition key: orderId      sort key: timestamp
────────────────────────────────────────────────────────────
orderId=1042  timestamp=2026-09-20T10:01  status=placed
orderId=1042  timestamp=2026-09-20T10:14  status=packed
orderId=1042  timestamp=2026-09-20T16:40  status=shipped
orderId=1043  timestamp=2026-09-20T10:02  status=placed

"all events for order 1042, newest first" → one fast Query
"all events where status=shipped"          → full Scan, or add an index`}
        />
        <div className="concept">
          <p className="concept-label">Key ideas</p>
          <ul>
            <li>
              <strong>The key design is everything.</strong> The <em>partition key</em> decides
              which storage partition an item lives on. The optional <em>sort key</em> orders items
              within that partition and allows range queries. A fast <code>Query</code> must go
              through the key. Anything else is a <code>Scan</code> (reads the whole table: slow and
              expensive) or needs a <strong>Global Secondary Index</strong>.
            </li>
            <li>
              <strong>Design around the questions you'll ask, not the shape of the data.</strong>{" "}
              That's the reverse of SQL, where you normalize first and query freely later. There are
              no joins, so related data is often duplicated on purpose.
            </li>
            <li>
              <strong>Hot partitions:</strong> a partition key with only a few distinct values (like{" "}
              <code>status</code>) sends most of the traffic to one partition and throttles it.
            </li>
            <li>
              Reads are <strong>eventually consistent</strong> by default, and strongly consistent
              reads are an opt-in. For capacity you choose on-demand (pay per request) or
              provisioned (cheaper under steady, predictable load).
            </li>
          </ul>
        </div>

        <h3 className="part">Operations &amp; security</h3>

        {/* ---------------- CloudWatch ---------------- */}
        <h4 className="topic">CloudWatch</h4>
        <p>AWS's built-in monitoring, made of four parts:</p>
        <ul>
          <li>
            <strong>Logs</strong> — collects what your app writes to stdout or a log file
          </li>
          <li>
            <strong>Metrics</strong> — numbers over time: CPU, request count, or a custom value
          </li>
          <li>
            <strong>Alarms</strong> — trigger when a metric crosses a line: notify someone, or scale
            out
          </li>
          <li>
            <strong>Dashboards</strong> — graphs of all of the above
          </li>
        </ul>
        <div className="concept">
          <p className="concept-label">Key ideas</p>
          <ul>
            <li>
              Lambda sends its logs to CloudWatch automatically. EC2 doesn't: you have to install the{" "}
              <strong>CloudWatch agent</strong> to ship log files.
            </li>
            <li>
              <strong>Gotcha:</strong> EC2's default metrics include CPU, network and disk I/O, but{" "}
              <strong>not memory</strong>, because AWS can't see inside your OS. Memory metrics also
              need the agent.
            </li>
            <li>
              <strong>Alarms drive automation.</strong> An Auto Scaling Group adds instances because
              a CloudWatch alarm on CPU fired.
            </li>
            <li>
              Log groups keep logs <strong>forever by default</strong>. Set a retention period or
              the bill keeps growing.
            </li>
          </ul>
        </div>

        {/* ---------------- IAM ---------------- */}
        <h4 className="topic">IAM — Identity and Access Management</h4>
        <p>Controls who can do what, on which AWS resource. It has four building blocks:</p>
        <ul>
          <li>
            <strong>User</strong> — a person or app with long-term credentials (password or access
            keys)
          </li>
          <li>
            <strong>Group</strong> — a set of users who share the same permissions
          </li>
          <li>
            <strong>Role</strong> — an identity that is <em>assumed</em> temporarily by a service
            (EC2, Lambda) or a person, handing out short-lived credentials that rotate on their own
          </li>
          <li>
            <strong>Policy</strong> — a JSON document listing which actions are allowed or denied on
            which resources
          </li>
        </ul>
        <CodeBlock
          language="json"
          code={`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject"],
      "Resource": "arn:aws:s3:::oms-shipping-labels/*"
    }
  ]
}`}
        />
        <div className="concept">
          <p className="concept-label">Key ideas</p>
          <ul>
            <li>
              <strong>Least privilege:</strong> grant only the actions and resources a job actually
              needs, like the policy above (two actions, one bucket) rather than{" "}
              <code>s3:*</code> on everything.
            </li>
            <li>
              <strong>Roles, not access keys, for your code.</strong> Attach a role to the EC2
              instance or the Lambda, and the AWS SDK picks up temporary credentials automatically.
              Access keys in code, <code>.env</code> or git are a top cause of breaches, and leaked
              keys get found and abused within minutes.
            </li>
            <li>
              <strong>How AWS decides:</strong> everything is denied by default, an explicit Allow
              grants access, and an explicit Deny always wins.
            </li>
          </ul>
        </div>

        {/* ---------------- VPC ---------------- */}
        <h4 className="topic">VPC — Virtual Private Cloud</h4>
        <p>Your own isolated network inside AWS. Every EC2 instance and RDS database lives in one.</p>
        <ul>
          <li>
            <strong>Public subnet:</strong> reachable from the internet. This is where load
            balancers go.
          </li>
          <li>
            <strong>Private subnet:</strong> no inbound traffic from the internet. Databases belong
            here.
          </li>
          <li>
            <strong>Security group:</strong> a firewall around one resource, with allow rules only.
            A rule can point at another security group, e.g. RDS accepts port 5432{" "}
            <em>only</em> from the app servers' security group.
          </li>
        </ul>

        {/* ---------------- Secrets Manager ---------------- */}
        <h4 className="topic">Secrets Manager</h4>
        <ul>
          <li>
            Stores secrets (DB passwords, API keys) encrypted. The app fetches them at startup
            through the SDK, and its IAM role is what allows the read. No password in the code, on
            disk or in git.
          </li>
          <li>
            Can <strong>rotate</strong> secrets automatically, e.g. change the RDS password on a
            schedule without anyone redeploying.
          </li>
          <li>
            <strong>SSM Parameter Store</strong> is the cheaper sibling: fine for config values and
            simple secrets, but without built-in rotation.
          </li>
        </ul>

        {/* ---------------- IaC ---------------- */}
        <h4 className="topic">Infrastructure as Code — Terraform</h4>
        <ul>
          <li>
            You describe the infrastructure you want (instances, databases, buckets, IAM roles) in
            code files. <code>terraform plan</code> shows what would change, and{" "}
            <code>terraform apply</code> makes it so.
          </li>
          <li>
            <strong>Why bother:</strong> dev, staging and prod get built from the same code, every
            change is reviewed in a PR and kept in git history, and there's no more "someone
            clicked something in the console and nobody knows what."
          </li>
          <li>
            <strong>Declarative:</strong> you state the end result you want, and the tool works out
            what to create, update or delete.
          </li>
          <li>
            <strong>Options:</strong> Terraform (works across clouds), CloudFormation (AWS's own,
            YAML/JSON), AWS CDK (write it in TypeScript).
          </li>
        </ul>
      </section>

      <hr className="section-divider" />

      {/* ============================================================ */}
      {/* Section 3 — Comparisons                                       */}
      {/* ============================================================ */}
      <section id="comparisons">
        <h2>Section 3 — Comparisons</h2>

        <h3>EC2 vs. Lambda</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>EC2</th>
              <th>Lambda</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>You manage</td>
              <td>The OS, runtime, patching, process manager</td>
              <td>Just the function code</td>
            </tr>
            <tr>
              <td>Runs</td>
              <td>Continuously, until you stop it</td>
              <td>Only while handling an event (max 15 min)</td>
            </tr>
            <tr>
              <td>Scaling</td>
              <td>You set it up: Auto Scaling Group + load balancer, takes minutes</td>
              <td>Automatic, one copy per concurrent request, takes seconds</td>
            </tr>
            <tr>
              <td>Cost model</td>
              <td>Pay per hour it's running, busy or idle</td>
              <td>Pay per request and ms of run time; idle is free</td>
            </tr>
            <tr>
              <td>Latency</td>
              <td>Consistent, always warm</td>
              <td>Occasional cold-start spikes</td>
            </tr>
            <tr>
              <td>State &amp; connections</td>
              <td>Can hold WebSockets and one long-lived DB pool</td>
              <td>Nothing persists; each copy opens its own DB connection</td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">How to choose</p>
          <ul>
            <li>
              <strong>Lambda</strong> wins for event-driven, bursty or low-traffic work: the upload
              handler, the nightly report, the webhook that gets hit 50 times a day.
            </li>
            <li>
              <strong>EC2</strong> wins for steady, high traffic, long-running work, persistent
              connections, and anything sensitive to latency spikes.
            </li>
            <li>
              <strong>The cost crossover:</strong> Lambda is far cheaper while traffic is low or
              spiky. Under constant heavy load, you're paying per request around the clock, and an
              always-on server becomes cheaper.
            </li>
            <li>
              Real systems usually <strong>mix both</strong>: the main API on EC2 (or containers),
              and side jobs like thumbnails, emails and PDFs on Lambda. Containers on ECS/Fargate
              sit in between the two and come up on Day 17.
            </li>
          </ul>
        </div>

        <h3>RDS vs. DynamoDB</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>RDS</th>
              <th>DynamoDB</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Data model</td>
              <td>Tables with a fixed schema, joined at query time</td>
              <td>Items looked up by key, no joins</td>
            </tr>
            <tr>
              <td>Querying</td>
              <td>Any question you can write in SQL, any time</td>
              <td>Fast only through the key; new questions may need a new index</td>
            </tr>
            <tr>
              <td>Transactions</td>
              <td>Full ACID across tables</td>
              <td>Limited transactions; reads eventually consistent by default</td>
            </tr>
            <tr>
              <td>Scaling</td>
              <td>Bigger instance + read replicas; writes capped by one primary</td>
              <td>Horizontal and automatic, reads and writes alike</td>
            </tr>
            <tr>
              <td>You manage</td>
              <td>Instance size, connections, some tuning</td>
              <td>Key design, and not much else</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Default to relational; move one specific high-volume, simple-access dataset to DynamoDB
          when you can prove SQL is the bottleneck — it's rarely all-or-nothing.
        </p>

        <h3>Where does a file go? S3 vs. the database vs. the server's disk</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Store it in</th>
              <th>When</th>
              <th>Why</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>S3</td>
              <td>The file itself: images, PDFs, uploads</td>
              <td>Cheap, unlimited, and servable by URL</td>
            </tr>
            <tr>
              <td>The database</td>
              <td>The file's S3 key and its metadata (owner, size, date)</td>
              <td>Large binary data bloats the DB and slows backups</td>
            </tr>
            <tr>
              <td>The EC2 disk</td>
              <td>Temporary scratch work only</td>
              <td>Belongs to one instance; lost or invisible to others once you scale out</td>
            </tr>
          </tbody>
        </table>

        <h3>IAM vs. security groups vs. database login</h3>
        <p>
          Three separate locks, and a request to your database has to get past all of them:
        </p>
        <ul>
          <li>
            <strong>IAM</strong> controls calls to <em>AWS's API</em>: who can create, delete or
            resize the RDS instance, or read from an S3 bucket.
          </li>
          <li>
            <strong>Security groups</strong> control <em>network traffic</em>: which machines can
            even open a connection to port 5432.
          </li>
          <li>
            <strong>The database's own users</strong> control <em>what happens once connected</em>:
            the Postgres username and password, and what that user can read and write.
          </li>
        </ul>

        <h3>How it fits together</h3>
        <CodeBlock
          language="plaintext"
          code={`                     users
                       │
          ┌────────────▼─────────────┐   public subnet
          │   Load balancer (ALB)    │
          └────────────┬─────────────┘
                       │
          ┌────────────▼─────────────┐   private subnet
          │ Auto Scaling Group: EC2  │── IAM role ──► Secrets Manager (DB password)
          │  EC2   EC2   EC2  (API)  │── IAM role ──► S3 (presigned URLs)
          └────────────┬─────────────┘                  │ upload event
                       │ port 5432 (security group)     ▼
          ┌────────────▼─────────────┐           Lambda (thumbnail / PDF)
          │ RDS Postgres + Multi-AZ  │   private subnet
          └──────────────────────────┘

          CloudWatch collects logs + metrics from all of it
          Terraform defines all of it`}
        />
      </section>
    </div>
  );
}
