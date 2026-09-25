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
        <p>
          An instance's disk is actually a separate service called <strong>EBS (Elastic Block
          Store)</strong> — the OS and any extra storage live on an EBS volume attached to the
          instance. Unlike the instance's own temporary local storage, an EBS volume survives the
          instance being stopped and restarted, and it can be snapshotted for backup — the same
          idea as the RDS and S3 backups elsewhere on this page.
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
        <p className="compare-label">
          <strong>Commonly used for</strong>
        </p>
        <ul>
          <li>
            <strong>Scheduled jobs</strong> — Lambda can run automatically on a timer, like a cron
            job. A nightly function that emails a sales report or cleans up old records, without a
            server sitting around waiting for that one moment each day.
          </li>
          <li>
            <strong>Webhook handlers</strong> — when an outside service (like a payment provider)
            needs to notify your app that something happened, Lambda can be the endpoint that
            receives that one-off notification and reacts to it, instead of running a whole server
            just to catch occasional pings.
          </li>
          <li>
            <strong>Event-driven processing</strong> — Lambda runs automatically whenever something
            happens elsewhere in AWS, like a new file landing in an S3 bucket. The moment a user
            uploads a photo, a Lambda function can resize it — nobody has to trigger anything by
            hand.
          </li>
          <li>
            <strong>Serverless API backends</strong> — instead of an always-on server for your
            app's API, each incoming request can trigger its own Lambda function through API
            Gateway. There's no server to manage, and it costs nothing while no one's making
            requests.
          </li>
          <li>
            <strong>Stream processing</strong> — as a continuous flow of data comes in (site clicks,
            sensor readings), Lambda can process each new piece the moment it arrives instead of
            waiting to handle it all later in a batch.
          </li>
          <li>
            <strong>Orchestrated workflows (Step Functions)</strong> — for a task with several
            steps that must happen in order (charge the customer → update inventory → send a
            confirmation), Step Functions can chain multiple Lambda functions together and
            automatically retry a step that fails.
          </li>
        </ul>
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
        <p className="compare-label">
          <strong>Commonly used for</strong>
        </p>
        <ul>
          <li>
            <strong>User uploads</strong> — profile pictures, PDFs, videos, anything a user adds
            through the app. It gets dropped straight into a bucket instead of living on your
            server.
          </li>
          <li>
            <strong>Hosting a static website</strong> — build your React app once, upload the
            output files to a bucket, and S3 serves them directly (usually with the CloudFront CDN
            in front so pages load fast everywhere).
          </li>
          <li>
            <strong>Data lakes queried with Athena</strong> — dump raw logs or event data into S3
            as plain files, then run SQL-style queries against them with Athena instead of loading
            everything into a database first.
          </li>
          <li>
            <strong>Backups and log archives</strong> — a cheap, practically bottomless place to
            keep database backups and old logs you rarely open but can't throw away.
          </li>
          <li>
            <strong>Disaster recovery</strong> — a bucket can automatically keep a copy of itself
            in a second AWS region, so one region having a bad day doesn't mean losing the data.
          </li>
        </ul>
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
              stores the file and your database stores its key plus the metadata. To actually run
              SQL over a pile of objects (Parquet, CSV, JSON), point <strong>Athena</strong> at the
              bucket instead of looping over files yourself.
            </li>
            <li>
              <strong>Downloads cost money</strong> (~$0.09/GB out of S3). For anything fetched
              often or from around the world, put <strong>CloudFront</strong> in front — it caches
              at edge locations, which ends up both faster and cheaper than serving straight from
              S3.
            </li>
            <li>
              <strong>Lifecycle rules are the biggest cost lever.</strong> A rule can auto-move
              objects to a cheaper storage class after N days and delete them after N more — e.g. a
              100&nbsp;GB backup nobody's touched in two years drops from ~$2.30/mo on Standard to
              ~$0.10/mo in Deep Archive, with nobody having to remember to move it.
            </li>
          </ul>
        </div>

        <p className="compare-label">
          <strong>Storage classes</strong> — same durability, priced by how fast you need it back:
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>~Cost / GB / mo</th>
              <th>Retrieval</th>
              <th>Use it for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Standard</td>
              <td>$0.023</td>
              <td>Instant</td>
              <td>Frequently accessed data</td>
            </tr>
            <tr>
              <td>Standard-IA</td>
              <td>$0.0125</td>
              <td>Instant</td>
              <td>Infrequent access (monthly backups)</td>
            </tr>
            <tr>
              <td>Glacier Flexible</td>
              <td>$0.0036</td>
              <td>Hours</td>
              <td>Compliance archives, rarely opened</td>
            </tr>
            <tr>
              <td>Glacier Deep Archive</td>
              <td>$0.00099</td>
              <td>12+ hours</td>
              <td>Long-term regulatory archives</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Unsure how a given object will be accessed? <strong>Intelligent-Tiering</strong> watches
          actual access patterns and moves objects between tiers for you.
        </p>

        {/* ---------------- Availability Zones & Regions ---------------- */}
        <h4 className="topic">Availability Zones &amp; Regions</h4>
        <p>
          A <strong>Region</strong> is a geographic area AWS operates in — <code>us-east-1</code>{" "}
          is Northern Virginia. An <strong>Availability Zone (AZ)</strong> is one physically
          separate data center inside that region; a region is made up of several AZs.
        </p>
        <div className="concept">
          <p className="concept-label">Key ideas</p>
          <ul>
            <li>
              Spreading a resource across multiple AZs is how AWS avoids one data center's bad day
              (a power outage, a hardware failure) from taking the whole app down with it.
            </li>
            <li>
              It also comes up for compliance — some regulations require data to physically stay
              within a specific country or region.
            </li>
            <li>
              <strong>How S3 uses this:</strong> S3 automatically stores copies of your objects
              across multiple AZs in a region for you. That's part of why it's so durable, and it
              isn't something you have to configure.
            </li>
            <li>
              <strong>How RDS uses this:</strong> a "Multi-AZ" database (see the RDS section below)
              keeps a live standby copy in a different AZ, ready to take over automatically if the
              primary's data center has a problem.
            </li>
          </ul>
        </div>

        {/* ---------------- RDS ---------------- */}
        <h4 className="topic">RDS — Relational Database Service</h4>
        <p>
          RDS is AWS's managed relational database service — Postgres, MySQL, and others. You
          could technically install Postgres yourself on an EC2 server, but RDS exists
          specifically to take a handful of painful, error-prone jobs off your plate.
        </p>
        <div className="concept">
          <p className="concept-label">What RDS solves</p>
          <ul>
            <li>
              <strong>Backups.</strong> Without RDS, you'd have to write and schedule your own
              backup scripts and hope you remember before it's too late. RDS runs automated
              backups on a schedule and can restore your database to almost any point in time with
              a few clicks.
            </li>
            <li>
              <strong>Patching.</strong> Without RDS, you're responsible for applying database
              security patches yourself, on your own schedule, without breaking anything. RDS
              applies patches for you during a maintenance window you choose.
            </li>
            <li>
              <strong>Replicas.</strong> Without RDS, standing up a second copy of your database and
              keeping it continuously in sync with the first is genuinely hard to get right. With
              RDS, adding a replica is a few clicks, and AWS keeps it in sync.
            </li>
            <li>
              <strong>Failover.</strong> Without RDS, if your database server crashes, someone has
              to notice and manually point the app at a backup. With Multi-AZ turned on, RDS
              detects the failure and switches over automatically, usually within a minute or two.
            </li>
          </ul>
        </div>
        <div className="concept">
          <p className="concept-label">Key ideas</p>
          <ul>
            <li>
              <strong>Multi-AZ</strong> is an always-on safety copy of your database in a different
              data center, there purely for backup and failover — you don't read from it day to
              day.
            </li>
            <li>
              <strong>A read replica</strong> is an extra copy you <em>can</em> send read traffic
              to, to take load off the main database. It's there for performance, not safety, and
              it can lag slightly behind the primary.
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
          AWS's fully managed, very high-performing NoSQL database. No servers to size or manage,
          and it handles enormous amounts of traffic with very fast lookups, scaling horizontally
          almost without limit.
        </p>
        <ul>
          <li>
            Every item is found by a simple key, which is what keeps reads and writes fast even at
            huge scale.
          </li>
          <li>
            It's fully managed — no server to size, patch, or scale by hand; AWS grows or shrinks
            capacity automatically as traffic changes.
          </li>
          <li>
            Commonly used for simple, high-volume data that doesn't need complex relationships —
            sessions, shopping carts, and similar.
          </li>
        </ul>

        <h3 className="part">Operations &amp; security</h3>

        {/* ---------------- CloudWatch ---------------- */}
        <h4 className="topic">CloudWatch</h4>
        <p>
          AWS's own built-in monitoring for AWS resources and services — not a full third-party
          application-performance-monitoring product. It's scoped to watching AWS infrastructure
          (logs, metrics, alarms), not tracing what happens line-by-line inside your code.
        </p>
        <p>It's made of four parts:</p>
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

        {/* ---------------- IAM ---------------- */}
        <h4 className="topic">IAM — Identity and Access Management</h4>
        <p>
          Controls who or what can access AWS <em>resources and services</em> — who can read this
          S3 bucket, who can launch an EC2 instance. It is <strong>not</strong> related to your own
          application's user accounts or login system; that's a separate concern the app itself
          handles.
        </p>
        <p>It has four building blocks:</p>
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
        <p>
          Instead of clicking through the AWS console by hand, you write your infrastructure
          (instances, databases, buckets, IAM roles) down as configuration files. Running Terraform
          reads that configuration and automatically creates — or updates — the real resources to
          match it.
        </p>
        <ul>
          <li>
            <strong>Why bother:</strong> dev, staging and prod get built from the same code, every
            change is reviewed in a PR and kept in git history, and there's no more "someone
            clicked something in the console and nobody knows what."
          </li>
          <li>
            <strong>Other options exist</strong> — CloudFormation (AWS's own version) and AWS CDK
            (write it in TypeScript) solve the same problem. Terraform is just the most widely used.
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
