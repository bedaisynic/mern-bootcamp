import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 17 Notes</title>
      <DayNav day="day17-microservices" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 4 · Day 17 · Notes</p>
        <h1>Microservices</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>Argue both sides of monolith vs. microservices, and say what actually forces the split</li>
          <li>List the pain points a monolith hits as its team and codebase grow</li>
          <li>Define what makes something a microservice, and trace a request from the client through the API Gateway to a service, and between services</li>
          <li>Explain why each service owns its own database, and what you give up by it</li>
          <li>Say why a real system mixes languages and databases, and what actually drives that choice</li>
          <li>Describe at a high level what ECS/Fargate and Kubernetes/EKS each do</li>
        </ul>
        <p>
          Want more? <Link to="/week4/day17-microservices/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        <h3>1. The e-commerce monolith</h3>
        <p>Start here: one codebase, one database, one deploy — for a small team, this is correct.</p>
        <svg viewBox="0 0 560 260" role="img" aria-label="A single monolith box containing eight modules — Users, Catalog, Inventory, Cart, Orders, Payments, Notifications, and Recommendations — all sharing one database, deployed as one artifact.">
          <rect x="20" y="20" width="520" height="160" rx="8" fill="#fdf3f3" stroke="#d98b8b" strokeWidth="2" />
          <text x="280" y="42" textAnchor="middle" fontSize="13" fontWeight="700" fill="#1c1c1c">the monolith — one codebase, one deploy</text>
          {[
            ["Users", 36, 58], ["Catalog", 152, 58], ["Inventory", 268, 58], ["Cart", 384, 58],
            ["Orders", 36, 108], ["Payments", 152, 108], ["Notifications", 268, 108], ["Recommendations", 384, 108],
          ].map(([label, x, y]) => (
            <g key={label as string}>
              <rect x={x as number} y={y as number} width={104} height={34} rx="5" fill="#fff" stroke="#b98a8a" strokeWidth="1.2" />
              <text x={(x as number) + 52} y={(y as number) + 21} textAnchor="middle" fontSize="10" fill="#1c1c1c">{label}</text>
            </g>
          ))}
          <rect x="230" y="205" width="100" height="36" rx="18" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="280" y="228" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1c1c1c">one database</text>
          <path d="M280,180 L280,205" fill="none" stroke="#444" strokeWidth="1.5" />
        </svg>
        <p className="callout">
          Everything you&apos;re about to see is what happens to this picture once the team and the
          traffic outgrow it — not a sign the monolith was built wrong.
        </p>

        <h3>2. Where it starts to hurt</h3>
        <p>None of these show up with 3 developers. They show up with 100+, all in one codebase:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Pain point</th>
              <th>What it looks like at scale</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Team coordination</td>
              <td>The Payments team can&apos;t ship until the Catalog team&apos;s branch merges first</td>
            </tr>
            <tr>
              <td>Merge conflicts</td>
              <td>Everyone edits the same <code>server.ts</code>, <code>schema.sql</code>, <code>package.json</code></td>
            </tr>
            <tr>
              <td>Release train</td>
              <td>One broken test in Reviews blocks a Payments hotfix from shipping</td>
            </tr>
            <tr>
              <td>Blast radius</td>
              <td>An unhandled error in the notification code crashes the whole process — checkout too</td>
            </tr>
            <tr>
              <td>All-or-nothing scaling</td>
              <td>Catalog needs 20 instances at peak, so Payments runs 20 idle copies too</td>
            </tr>
            <tr>
              <td>Noisy neighbor</td>
              <td>A slow recommendations query eats the CPU every other request needed</td>
            </tr>
            <tr>
              <td>Tech-stack lock-in</td>
              <td>One language, one framework, one database — for every module, forever</td>
            </tr>
            <tr>
              <td>Shared-database coupling</td>
              <td>Nobody can change the <code>users</code> table without checking every module that joins on it</td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>These are problems of <strong>scale</strong> — team size and traffic — not of code quality.</li>
            <li>A small, well-written monolith has none of these problems. A messy one with 3 developers still doesn&apos;t need microservices.</li>
            <li>Microservices are, first, an <strong>organizational</strong> fix — they let teams ship without waiting on each other.</li>
          </ul>
        </div>

        <h3>3. What traffic actually looks like</h3>
        <p>Before splitting anything up, it helps to know which parts of the store actually get hit hardest.</p>
        <p className="callout">
          Most visits never turn into an order — a typical e-commerce conversion rate is around
          <strong> 2–3%</strong>. Dozens of product views happen for every one purchase.
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Service</th>
              <th>Request volume</th>
              <th>What stresses it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Catalog / Search</td>
              <td>Highest — every page view, every search</td>
              <td>Raw read throughput — solved with caching, not more logic</td>
            </tr>
            <tr>
              <td>Inventory</td>
              <td>High reads, low writes</td>
              <td>Contention: 10,000 people buying the same flash-sale item at once</td>
            </tr>
            <tr>
              <td>Orders</td>
              <td>Low — only the ~2–3% who actually buy</td>
              <td>Correctness, not volume — this table must never be wrong</td>
            </tr>
            <tr>
              <td>Payments</td>
              <td>Lowest</td>
              <td>Reliability and third-party latency, never raw volume</td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              Traffic and importance are <strong>opposites</strong> here: Catalog takes the most
              requests but can serve slightly stale data from a cache. Orders takes the fewest but can
              never be wrong.
            </li>
            <li>
              That mismatch is exactly why you&apos;d want to scale and harden these differently — a
              monolith can&apos;t do that; it scales as one unit.
            </li>
            <li>
              In practice nobody guesses this. Teams watch metrics — requests/sec, latency, error
              rate per endpoint — and split where the data says to.
            </li>
          </ul>
        </div>

        <h3>4. What a microservice actually is</h3>
        <ul>
          <li><strong>Independently deployable</strong> — ship it without touching anyone else&apos;s code</li>
          <li><strong>Owns its data</strong> — its database, nobody else&apos;s to query directly</li>
          <li><strong>Talks only over its API</strong> — HTTP/JSON (or gRPC), never a shared function call</li>
        </ul>
        <p className="callout">
          One team owns a service end to end — this is why splitting up code is really about
          splitting up <em>teams</em>.
        </p>
        <svg viewBox="0 0 560 200" role="img" aria-label="The same eight modules as separate boxes, each with its own small database, no longer inside one shared monolith box.">
          {[
            ["Users", 8], ["Catalog", 78], ["Inventory", 148], ["Cart", 218],
            ["Orders", 288], ["Payments", 358], ["Notifications", 428], ["Recs", 498],
          ].map(([label, x]) => (
            <g key={label as string}>
              <rect x={x as number} y="20" width="54" height="34" rx="5" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.2" />
              <text x={(x as number) + 27} y="41" textAnchor="middle" fontSize="9" fontWeight="700" fill="#1c1c1c">{label}</text>
              <path d={`M${(x as number) + 27},54 L${(x as number) + 27},80`} fill="none" stroke="#999" strokeWidth="1.2" />
              <ellipse cx={(x as number) + 27} cy="92" rx="20" ry="8" fill="#fff" stroke="#999" strokeWidth="1.2" />
              <path d={`M${(x as number) + 7},92 L${(x as number) + 7},110 A20,8 0 0 0 ${(x as number) + 47},110 L${(x as number) + 47},92`} fill="#fff" stroke="#999" strokeWidth="1.2" />
            </g>
          ))}
          <text x="280" y="150" textAnchor="middle" fontSize="11" fill="#5b6b82">eight services, eight databases — no shared tables</text>
        </svg>

        <h3>5. How requests get in: the API Gateway</h3>
        <p>One public door in front of every private service. Clients only ever call the gateway.</p>
        <svg viewBox="0 0 640 190" role="img" aria-label="A browser calling the API Gateway, which routes to three private-subnet services: Catalog, Orders, and Notifications.">
          <defs>
            <marker id="gw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#444" />
            </marker>
          </defs>
          <rect x="20" y="70" width="110" height="40" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="75" y="95" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">browser</text>
          <rect x="200" y="70" width="150" height="40" rx="6" fill="#fff7e0" stroke="#e8b400" strokeWidth="2" />
          <text x="275" y="95" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">API Gateway</text>
          <path d="M130,90 L200,90" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#gw-arrow)" />
          <rect x="440" y="15" width="180" height="46" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="530" y="34" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Catalog</text>
          <text x="530" y="50" textAnchor="middle" fontSize="9" fill="#5b6b82">private subnet</text>
          <rect x="440" y="72" width="180" height="46" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="530" y="91" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Orders</text>
          <text x="530" y="107" textAnchor="middle" fontSize="9" fill="#5b6b82">private subnet</text>
          <rect x="440" y="129" width="180" height="46" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="530" y="148" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Notifications</text>
          <text x="530" y="164" textAnchor="middle" fontSize="9" fill="#5b6b82">private subnet</text>
          <path d="M350,88 Q400,38 440,38" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#gw-arrow)" />
          <path d="M350,90 L440,95" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#gw-arrow)" />
          <path d="M350,92 Q400,142 440,152" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#gw-arrow)" />
        </svg>
        <p className="callout">
          At the gateway: TLS, auth (checked once), rate limiting, routing, request logging —
          everything you don&apos;t want duplicated in every service.
        </p>

        <h3>6. How services talk to each other</h3>
        <p>Placing an order means the Orders service calling four other services, over the network:</p>
        <svg viewBox="0 0 560 220" role="img" aria-label="Orders service in the center calling Users, Catalog, Inventory, and Payments synchronously, and Notifications as a fire-and-forget call.">
          <rect x="230" y="90" width="100" height="40" rx="6" fill="#fff7e0" stroke="#e8b400" strokeWidth="2" />
          <text x="280" y="115" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Orders</text>
          {[
            ["Users", 20, 10], ["Catalog", 220, 10], ["Inventory", 420, 10],
            ["Payments", 20, 180], ["Notifications", 420, 180],
          ].map(([label, x, y]) => (
            <g key={label as string}>
              <rect x={x as number} y={y as number} width={120} height={34} rx="5" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.2" />
              <text x={(x as number) + 60} y={(y as number) + 21} textAnchor="middle" fontSize="10" fontWeight="700" fill="#1c1c1c">{label}</text>
            </g>
          ))}
          <path d="M280,90 L200,44" fill="none" stroke="#444" strokeWidth="1.3" />
          <path d="M280,90 L280,44" fill="none" stroke="#444" strokeWidth="1.3" />
          <path d="M280,90 L420,44" fill="none" stroke="#444" strokeWidth="1.3" />
          <path d="M280,130 L200,180" fill="none" stroke="#444" strokeWidth="1.3" />
          <path d="M280,130 L420,180" fill="none" stroke="#999" strokeWidth="1.3" strokeDasharray="4,3" />
          <text x="280" y="205" textAnchor="middle" fontSize="9" fill="#5b6b82">dashed = fire-and-forget, no waiting</text>
        </svg>
        <CodeBlock
          language="typescript"
          code={`// Orders calling Payments — a network call now, not a function call.
// No timeout here means a slow Payments service hangs every checkout.
const res = await fetch(\`\${PAYMENTS_URL}/charges\`, {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ orderId, amount, customerId }),
  signal: AbortSignal.timeout(3000),
});`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>A function call always succeeds or throws. A network call can also time out, retry, or arrive twice.</li>
            <li>Every outbound call needs a timeout — a missing one is the classic first microservices outage: one slow service holds every caller&apos;s connections open.</li>
            <li>Notification doesn&apos;t need to block checkout, so it&apos;s called and its failure is logged, not rethrown — the order already succeeded.</li>
          </ul>
        </div>
        <p className="callout">
          A call like this can also be made <em>asynchronous</em>: instead of waiting on
          Notification directly, Orders publishes an <code>OrderPlaced</code> event and moves on —
          whoever&apos;s listening picks it up.
        </p>

        <h3>7. One database per service</h3>
        <p>No shared tables. Two things a single database gave you for free now have to be rebuilt by hand:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>What the monolith had</th>
              <th>What replaces it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A cross-table JOIN (<code>orders JOIN users JOIN products</code>)</td>
              <td>Orders stores its own snapshot of what it needs</td>
            </tr>
            <tr>
              <td>One transaction across every write</td>
              <td>A hand-written compensating action if a later step fails</td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          code={`// Orders never joins into users/products — it stores what it needed, at that moment.
const order = {
  id: orderId,
  customerEmail: user.email,       // copied from Users at checkout time
  productName: product.name,       // copied from Catalog at checkout time
  unitPriceAtPurchase: product.price,
  status: "placed",
};`}
        />
        <p className="callout">
          If two services genuinely need the same transaction, that&apos;s usually a sign they
          should be one service, not two.
        </p>

        <h3>8. Different tools for different services</h3>
        <p>Nothing forces every service onto the same language or database:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Stack</th>
              <th>Good at</th>
              <th>Typical service</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Node.js</td>
              <td>I/O-bound work, many concurrent connections, JSON APIs</td>
              <td>Gateway, Catalog, Cart</td>
            </tr>
            <tr>
              <td>Java / Spring Boot</td>
              <td>Large, long-lived, transaction-heavy business logic</td>
              <td>Payments, Orders, banking/ERP integrations</td>
            </tr>
            <tr>
              <td>Python</td>
              <td>Data, machine learning, analytics</td>
              <td>Recommendations</td>
            </tr>
          </tbody>
        </table>
        <p>Same logic for databases — pick the one that fits the data, not one default for everything:</p>
        <ul>
          <li><strong>SQL</strong> — relationships and correctness matter (Orders, Payments)</li>
          <li><strong>MongoDB</strong> — every record&apos;s shape is different, or it needs easy horizontal scaling (Catalog: a shoe has a size, a TV has a resolution)</li>
          <li><strong>Redis</strong> — short-lived data you can afford to lose (Cart)</li>
        </ul>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              In practice, the choice is often <strong>who&apos;s on the team</strong> and{" "}
              <strong>what already exists</strong> — not a pure technical ranking.
            </li>
            <li>
              A company with 40 Java developers writes the new service in Java. A legacy billing
              system stays in Java because rewriting it is a risk nobody signs off on.
            </li>
            <li>
              Node and Spring Boot running in the same system is normal, and is what you&apos;ll see
              at real client sites.
            </li>
          </ul>
        </div>
        <p>The same endpoint, two stacks — the gateway can&apos;t tell the difference, and doesn&apos;t care:</p>
        <CodeBlock
          language="typescript"
          code={`// Express (Node) — GET /payments/:id
app.get("/payments/:id", async (req, res) => {
  const payment = await db.payments.findById(req.params.id);
  res.json(payment);
});`}
        />
        <CodeBlock
          language="plaintext"
          code={`// Spring Boot (Java) — GET /payments/{id}
@GetMapping("/payments/{id}")
public Payment getPayment(@PathVariable Long id) {
    return paymentRepository.findById(id).orElseThrow();
}`}
        />
        <p className="callout">
          Both speak HTTP + JSON. Behind the gateway, a service is a box that answers requests —
          nothing about the gateway&apos;s routing changes based on what&apos;s inside the box.
        </p>

        <h3>9. Pain point → fix → new cost</h3>
        <p>Each row from Section 2 now has an answer — and each answer has a price:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Pain point</th>
              <th>Microservices fix</th>
              <th>New cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Team coordination</td>
              <td>Independent deploys, per service</td>
              <td>Contracts between services must stay compatible</td>
            </tr>
            <tr>
              <td>Merge conflicts</td>
              <td>Separate codebases, no shared files</td>
              <td>Some logic gets duplicated instead of shared</td>
            </tr>
            <tr>
              <td>Blast radius</td>
              <td>One service crashing doesn&apos;t take down the rest</td>
              <td>Partial failures — some of a request&apos;s work succeeded, some didn&apos;t</td>
            </tr>
            <tr>
              <td>All-or-nothing scaling</td>
              <td>Scale only the service under load</td>
              <td>More infrastructure to run and pay for</td>
            </tr>
            <tr>
              <td>Tech-stack lock-in</td>
              <td>Pick the right language/DB per service</td>
              <td>More tooling, more things engineers need to know</td>
            </tr>
            <tr>
              <td>Shared-database coupling</td>
              <td>Each service owns its data</td>
              <td>No cross-service JOIN or transaction (Section 7)</td>
            </tr>
          </tbody>
        </table>

        <h3>10. Scaling one service: the load balancer</h3>
        <p>Scaling Catalog means running several identical copies of it. Something has to spread the traffic across them:</p>
        <svg viewBox="0 0 600 200" role="img" aria-label="The API Gateway sends Catalog traffic to a load balancer, which spreads it across three identical Catalog copies. The third copy failed its health check and receives no traffic.">
          <defs>
            <marker id="lb-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M0,0 L10,5 L0,10 z" fill="#444" />
            </marker>
          </defs>
          <rect x="20" y="80" width="120" height="40" rx="6" fill="#fff7e0" stroke="#e8b400" strokeWidth="2" />
          <text x="80" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">API Gateway</text>
          <rect x="200" y="80" width="130" height="40" rx="6" fill="#f3eefc" stroke="#8e5fd6" strokeWidth="2" />
          <text x="265" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Load balancer</text>
          <path d="M140,100 L200,100" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#lb-arrow)" />
          <rect x="420" y="15" width="160" height="40" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="500" y="40" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Catalog copy 1</text>
          <rect x="420" y="80" width="160" height="40" rx="6" fill="#eef3ff" stroke="#7ea6e0" strokeWidth="1.5" />
          <text x="500" y="105" textAnchor="middle" fontSize="12" fontWeight="700" fill="#1c1c1c">Catalog copy 2</text>
          <rect x="420" y="145" width="160" height="40" rx="6" fill="#f5f5f5" stroke="#bbb" strokeWidth="1.5" strokeDasharray="4,3" />
          <text x="500" y="163" textAnchor="middle" fontSize="12" fontWeight="700" fill="#999">Catalog copy 3</text>
          <text x="500" y="177" textAnchor="middle" fontSize="9" fill="#999">failed health check — skipped</text>
          <path d="M330,95 Q380,40 420,35" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#lb-arrow)" />
          <path d="M330,100 L420,100" fill="none" stroke="#444" strokeWidth="1.5" markerEnd="url(#lb-arrow)" />
        </svg>
        <ul>
          <li><strong>Spreads requests</strong> across identical copies — take turns (round robin), or send each one to the least busy copy (least connections)</li>
          <li><strong>Health checks</strong> — it pings every copy, and stops sending traffic to one that fails</li>
          <li><strong>Copies come and go</strong> — add three more for a sale, remove them after; the load balancer just updates its list</li>
        </ul>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Load balancer</th>
              <th>API Gateway</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Picks between</td>
              <td>Identical copies of <em>one</em> service</td>
              <td>Different services, by path</td>
            </tr>
            <tr>
              <td>Decides by</td>
              <td>Health and how busy each copy is</td>
              <td>The request — path, token, rate limit</td>
            </tr>
            <tr>
              <td>On AWS</td>
              <td>Application Load Balancer (ALB)</td>
              <td>Amazon API Gateway</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          They&apos;re usually stacked: the gateway picks <em>which service</em>, a load balancer picks{" "}
          <em>which copy</em> of it.
        </p>

        <h3>11. When not to do this</h3>
        <ul>
          <li>A small team, or an early product where the boundaries aren&apos;t clear yet — stay monolithic</li>
          <li>Split when a real seam proves itself, not because the file count looks big</li>
          <li>A premature split hardens a guess into a network protocol, which is expensive to undo</li>
        </ul>
        <p className="callout">
          The <strong>distributed monolith</strong>: services that look separate but must all deploy
          together to work — all of the network cost, none of the independence.
        </p>

        <h3>12. Running a fleet: containers and orchestration</h3>
        <p>Every service, in any language, ships the same way: as a container. Something still has to keep them running.</p>
        <ul>
          <li>Keep N copies of each service alive, restart any that crash</li>
          <li>Scale a service up or down based on load</li>
          <li>Roll out a new version without downtime</li>
          <li>Route traffic between services</li>
        </ul>
        <p>That &quot;something&quot; is an orchestrator. Two you&apos;ll hear about constantly:</p>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <strong>ECS</strong> is AWS&apos;s own orchestrator: give it a container image and a
              desired count, it keeps that many copies running.
            </li>
            <li>
              <strong>Fargate</strong> is a launch mode for ECS where AWS supplies the compute — no
              EC2 instances to patch, size, or scale.
            </li>
            <li>
              The pairing you&apos;ll hear: &quot;ECS on Fargate&quot; — ECS decides <em>what</em>{" "}
              runs, Fargate provides <em>where</em> it runs.
            </li>
            <li>
              Running one server yourself means patching, sizing, and scaling it by hand. A
              container definition like this hands all of that to AWS instead — and it matters
              because each service now scales independently.
            </li>
          </ul>
        </div>
        <CodeBlock
          language="json"
          code={`{
  "family": "notification-service",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "containerDefinitions": [
    {
      "name": "notification",
      "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/notification:1.4.0",
      "portMappings": [{ "containerPort": 3001 }],
      "environment": [{ "name": "NODE_ENV", "value": "production" }]
    }
  ]
}`}
        />
        <p>Three ways to run code on AWS, from most control to least to manage:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>EC2</th>
              <th>ECS on Fargate</th>
              <th>Lambda</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>You hand AWS</td>
              <td>Nothing — you rent a server</td>
              <td>A container image</td>
              <td>A single function</td>
            </tr>
            <tr>
              <td>You manage</td>
              <td>The OS, patches, scaling</td>
              <td>Only what&apos;s inside the container</td>
              <td>Only the code</td>
            </tr>
            <tr>
              <td>Runs</td>
              <td>Always on</td>
              <td>Always on, N copies</td>
              <td>Only when a request or event arrives</td>
            </tr>
            <tr>
              <td>You pay for</td>
              <td>Every hour the server exists</td>
              <td>CPU and memory reserved, per second</td>
              <td>Each call and how long it ran</td>
            </tr>
            <tr>
              <td>Good for</td>
              <td>Full control, legacy apps</td>
              <td>Long-running services — most microservices</td>
              <td>Short, spiky jobs — e.g. resize an image on upload</td>
            </tr>
            <tr>
              <td>Catch</td>
              <td>All the ops work is yours</td>
              <td>Costs more than a well-used EC2 box</td>
              <td>15-minute limit; a slow first call after idle (cold start)</td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li><strong>Kubernetes</strong> does the same job as ECS — keep containers running, scale, roll out — but it&apos;s open-source and runs on any cloud, not just AWS.</li>
            <li><strong>EKS</strong> is AWS running Kubernetes&apos;s control plane for you, the same relationship Fargate has to ECS.</li>
            <li>Vocabulary only for today: a <strong>Pod</strong> is one or more containers running together; a <strong>Deployment</strong> keeps a set of Pods alive; a <strong>Service</strong> gives them a stable address.</li>
          </ul>
        </div>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>ECS (on Fargate)</th>
              <th>Kubernetes (on EKS)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Runs on</td>
              <td>AWS only</td>
              <td>Any cloud, or your own servers</td>
            </tr>
            <tr>
              <td>Setup</td>
              <td>Simpler, fewer concepts</td>
              <td>More powerful, steeper learning curve</td>
            </tr>
            <tr>
              <td>Ecosystem</td>
              <td>AWS-native tooling</td>
              <td>Huge open-source ecosystem, industry standard</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Same job, different tools. We&apos;re not deploying either one today — this is vocabulary so
          the words aren&apos;t new the first time you see them on a job.
        </p>

        <h3>13. What this still costs you</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th>New problem</th>
              <th>How it&apos;s handled</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>A network call can fail in ways a function call never did</td>
              <td>Retries, and switching a call to an async event instead</td>
            </tr>
            <tr>
              <td>No single database, no cross-service transaction</td>
              <td>Accepting eventual consistency instead of forcing an atomic write</td>
            </tr>
            <tr>
              <td>One request now touches five services — no single stack trace</td>
              <td>A correlation ID passed through every call, and distributed tracing</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          These aren&apos;t exotic edge cases — they&apos;re the normal operating condition of any
          multi-service system.
        </p>
      </section>
    </div>
  );
}
