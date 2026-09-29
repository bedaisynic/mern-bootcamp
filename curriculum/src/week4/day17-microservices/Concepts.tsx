import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 17 — Concepts Reference</title>
      <DayNav day="day17-microservices" current="concepts" />
      <h1>Day 17 — Concepts Reference</h1>
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
          <summary>What is a monolithic application?</summary>
          <div className="answer">
            <p>
              One codebase, built and deployed as one unit, usually running as one process against
              one database. Modules call each other with plain function calls and can share a single
              database transaction — which is why a monolith is the simplest, correct way to start.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a microservice?</summary>
          <div className="answer">
            <p>
              A small service that is <strong>independently deployable</strong>,{" "}
              <strong>owns its own data</strong>, and is reached <strong>only through its API</strong>{" "}
              over the network. One team owns it end to end, so it can ship without waiting on
              anyone else.
            </p>
          </div>
        </details>

        <details>
          <summary>What goes wrong with a monolith as it grows, and how do microservices fix it?</summary>
          <div className="answer">
            <p>
              With 100+ developers in one codebase: teams wait on each other to release, everyone
              edits the same shared files (merge conflicts), one bug can crash the whole app (blast
              radius), you can only scale everything at once, and every module is stuck on the same
              language and database.
            </p>
            <p>
              Microservices answer each one: independent deploys, separate codebases, isolated
              failures, scaling only the busy service, and the right tool per service. These are
              problems of <em>team size and traffic</em>, not of code quality.
            </p>
          </div>
        </details>

        <details>
          <summary>What do you give up with microservices, and when should you stay a monolith?</summary>
          <div className="answer">
            <p>
              Every function call becomes a network call that can time out or fail halfway; there&apos;s
              no transaction or JOIN across services; one request now spans several services to debug;
              and there&apos;s far more infrastructure to run.
            </p>
            <p>
              So a small team or an early product with unclear boundaries should stay monolithic, and
              split only when teams are blocking each other or one part needs to scale on its own.
            </p>
          </div>
        </details>

        <details>
          <summary>What is an API Gateway, and how does it work?</summary>
          <div className="answer">
            <p>
              The single public entry point in front of all the services. It looks at the path (
              <code>/orders/...</code> → Orders service), checks the login token once, then forwards
              the request with the caller&apos;s id attached — so services never deal with tokens.
              It&apos;s also where rate limiting, TLS, and request logging live, instead of being
              copied into every service.
            </p>
          </div>
        </details>

        <details>
          <summary>How do microservices communicate with each other?</summary>
          <div className="answer">
            <p>
              <strong>Synchronously</strong> — one service calls another&apos;s HTTP API directly (not
              through the gateway) and waits for the answer, e.g. Orders asking Catalog for a price.{" "}
              <strong>Asynchronously</strong> — a service publishes an event (<code>OrderPlaced</code>)
              to a message broker and moves on; whoever cares picks it up.
            </p>
            <p>
              Use sync when you need the answer to continue, async for side effects like sending an
              email. Never by reading another service&apos;s database.
            </p>
          </div>
        </details>

        <details>
          <summary>Why does each service own its own database, and what replaces JOINs and transactions?</summary>
          <div className="answer">
            <p>
              If services shared tables, nobody could change a table without breaking another team —
              the coupling would come right back. Instead of a JOIN, a service stores a{" "}
              <strong>snapshot</strong> of what it needs (Orders keeps the price and email at checkout);
              instead of a transaction, it runs a <strong>compensating action</strong> by hand (release
              the stock if payment fails).
            </p>
          </div>
        </details>

        <details>
          <summary>What is a load balancer, and how is it different from an API Gateway?</summary>
          <div className="answer">
            <p>
              A load balancer spreads traffic across <em>identical copies</em> of one service (round
              robin or least busy) and skips copies that fail their health check — it&apos;s what makes
              &quot;run 5 copies of Catalog&quot; work. A gateway picks <em>which service</em> by path
              and handles auth; a load balancer picks <em>which copy</em>. They&apos;re usually stacked.
            </p>
          </div>
        </details>

        <details>
          <summary>Why would one system mix different languages and databases?</summary>
          <div className="answer">
            <p>
              Each service can pick what fits it: Node for I/O-heavy APIs, Java/Spring Boot for large
              transaction-heavy domains like payments, Python for data and ML; SQL where correctness
              matters, MongoDB where every record&apos;s shape differs, Redis for short-lived data like
              carts. In practice the choice is often driven by the team&apos;s skills and existing
              legacy systems as much as by technical fit.
            </p>
          </div>
        </details>

        <details>
          <summary>What do ECS and Fargate each do, and how do they relate?</summary>
          <div className="answer">
            <p>
              <strong>ECS</strong> is AWS&apos;s container orchestrator: give it an image and a desired
              count, and it keeps that many copies running, replaces crashed ones, and rolls out new
              versions. <strong>Fargate</strong> is a way to run ECS where AWS supplies the servers, so
              you never manage EC2 instances. &quot;ECS on Fargate&quot;: ECS decides{" "}
              <em>what</em> runs, Fargate provides <em>where</em>.
            </p>
          </div>
        </details>

        <details>
          <summary>How do EC2, Fargate, and Lambda compare?</summary>
          <div className="answer">
            <table className="ref-table">
              <thead>
                <tr>
                  <th></th>
                  <th>EC2</th>
                  <th>Fargate</th>
                  <th>Lambda</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>You manage</td>
                  <td>The whole server</td>
                  <td>Only the container</td>
                  <td>Only the function code</td>
                </tr>
                <tr>
                  <td>Runs</td>
                  <td>Always on</td>
                  <td>Always on, N copies</td>
                  <td>Only per request/event</td>
                </tr>
                <tr>
                  <td>Best for</td>
                  <td>Full control, legacy apps</td>
                  <td>Long-running services</td>
                  <td>Short, spiky jobs</td>
                </tr>
                <tr>
                  <td>Catch</td>
                  <td>All ops work is yours</td>
                  <td>Pricier than a busy EC2 box</td>
                  <td>15-min limit, cold starts</td>
                </tr>
              </tbody>
            </table>
            <p>Moving left to right: less to manage, less control.</p>
          </div>
        </details>

        <details>
          <summary>How does Kubernetes relate to ECS, and what is EKS?</summary>
          <div className="answer">
            <p>
              Same job — keep containers running, scale them, roll out new versions — but Kubernetes is
              open-source and runs on any cloud, while ECS is AWS-only and simpler.{" "}
              <strong>EKS</strong> is AWS running Kubernetes&apos;s control plane for you.
            </p>
          </div>
        </details>
      </section>

      <section id="tier-2">
        <h2>2. Advanced concepts</h2>
        <p className="tier-note">
          Less commonly asked, and some go beyond what today&apos;s lecture covered — mostly
          &quot;gotcha&quot; interview trivia and things that sharpen how you code without being asked
          often.
        </p>

        <details>
          <summary>Why does every call to another service need a timeout?</summary>
          <div className="answer">
            <p>
              Without one, a slow service holds every caller&apos;s request open; those callers run out
              of connections and slow down their own callers — a <strong>cascading failure</strong>{" "}
              where one sluggish service takes down the chain. A timeout turns &quot;hangs
              forever&quot; into a fast, handleable error.
            </p>
          </div>
        </details>

        <details>
          <summary>Why is retrying a failed call risky, and how do you retry safely?</summary>
          <div className="answer">
            <p>
              A timeout is ambiguous — the call may have succeeded and only the reply got lost, so a
              blind retry can charge a card twice. Retry only <strong>idempotent</strong> operations
              (or send an idempotency key the receiver de-duplicates on), and space retries out with{" "}
              <strong>exponential backoff plus jitter</strong> so thousands of clients don&apos;t retry in
              lockstep and flatten a service that&apos;s trying to recover.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a circuit breaker, and how is it different from a retry?</summary>
          <div className="answer">
            <p>
              A retry tries again; a circuit breaker <em>stops trying</em>. After too many failures it
              &quot;opens&quot; and fails every call instantly (often returning a fallback, like empty
              recommendations) instead of waiting on a dead service. After a cool-down it lets one test
              call through (&quot;half-open&quot;), and closes again if that succeeds.
            </p>
          </div>
        </details>

        <details>
          <summary>If checkout fails halfway through, how do you undo the earlier steps?</summary>
          <div className="answer">
            <p>
              There&apos;s no transaction across services, so each step that already committed needs a{" "}
              <strong>compensating action</strong> — payment declined → release the stock reservation,
              mark the order <code>payment_failed</code>. Chaining these steps and their undos is the{" "}
              <strong>saga</strong> pattern; two-phase commit exists but is avoided because it locks
              every service until the slowest one answers.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you debug one request that passed through five services?</summary>
          <div className="answer">
            <p>
              Give it a <strong>correlation ID</strong> at the gateway and pass it on every downstream
              call, so every service logs the same ID. Distributed tracing (OpenTelemetry, Jaeger, X-Ray)
              builds on that to show the whole request as one timeline, with which hop was slow.
            </p>
          </div>
        </details>

        <details>
          <summary>What makes a good service boundary?</summary>
          <div className="answer">
            <p>
              The two sides exchange little data and never need a shared transaction — Notifications is
              a clean split because nothing reads from it. If two services must always change or commit
              together, they&apos;re really one service.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a modular monolith?</summary>
          <div className="answer">
            <p>
              One deployable app, but split internally into modules with strict boundaries — each
              module owns its tables and other modules may only call its public interface, never
              reach into its internals. You keep function calls and real transactions, and if a module
              ever needs to become a service, the seam is already clean.
            </p>
          </div>
        </details>

        <details>
          <summary>What is the &quot;distributed monolith&quot; anti-pattern?</summary>
          <div className="answer">
            <p>
              Services that look separate but have to be deployed together — shared database, shared
              models, lockstep releases. You pay all the network costs of microservices and get none
              of the independence.
            </p>
          </div>
        </details>

        <details>
          <summary>Why should a service&apos;s API only ever add fields, never rename or remove them?</summary>
          <div className="answer">
            <p>
              Services deploy independently, so old callers keep sending and expecting the old shape
              while the new version is live. Adding a field breaks nobody; renaming or removing one
              breaks every caller that hasn&apos;t updated yet.
            </p>
          </div>
        </details>

        <details>
          <summary>Why can a service trust an <code>x-user-id</code> header set by the gateway?</summary>
          <div className="answer">
            <p>
              Because only the gateway is reachable from the internet — the services sit in a private
              network, and the gateway builds forwarded headers from scratch, discarding anything the
              client sent. If a service were publicly reachable, anyone could send that header and
              impersonate any user.
            </p>
          </div>
        </details>

        <details>
          <summary>How does one service find another service&apos;s address?</summary>
          <div className="answer">
            <p>
              Locally, a URL in an environment variable. In production copies come and go with
              changing IPs, so a <strong>service discovery</strong> system keeps a live registry — a
              Kubernetes Service name, AWS Cloud Map, or simply the DNS name of a load balancer.
            </p>
          </div>
        </details>

        <details>
          <summary>What is Conway&apos;s law, and why does it come up with microservices?</summary>
          <div className="answer">
            <p>
              &quot;Organizations design systems that mirror their communication structure.&quot; Service
              boundaries tend to follow team boundaries — which is why splitting services is really
              about splitting ownership between teams.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
