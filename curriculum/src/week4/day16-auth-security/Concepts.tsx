import DayNav from "../../components/DayNav";

export default function Concepts() {
  return (
    <div className="page concepts-page">
      <title>Day 16 — Concepts Reference</title>
      <DayNav day="day16-auth-security" current="concepts" />
      <h1>Day 16 — Concepts Reference</h1>
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
          <summary>What&apos;s the difference between authentication and authorization?</summary>
          <div className="answer">
            <p>
              Authentication answers &quot;who are you&quot; and happens once at login; authorization
              answers &quot;are you allowed to do this&quot; and happens on every protected
              operation. They map to <code>401</code> and <code>403</code> respectively.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you authenticate a user on an incoming request?</summary>
          <div className="answer">
            <p>
              A <code>requireAuth</code> middleware runs before the route handler: it reads the{" "}
              <code>Authorization: Bearer &lt;token&gt;</code> header, verifies the JWT&apos;s
              signature and expiry, and attaches the decoded user (id, email, role) to{" "}
              <code>req.user</code>. Missing, invalid, or expired — it responds <code>401</code>{" "}
              before the route handler ever runs.
            </p>
          </div>
        </details>

        <details>
          <summary>How do you authorize a user once they&apos;re authenticated?</summary>
          <div className="answer">
            <ul>
              <li>
                A separate <code>authorize(action, loadResource?)</code> middleware runs after{" "}
                <code>requireAuth</code>.
              </li>
              <li>
                It calls a policy engine — <code>can(user, action, resource)</code> — that decides
                based on the user&apos;s role, attributes like region or approval limit, and any
                one-off grants, not just a fixed role list.
              </li>
              <li>
                For an action on one specific resource (an order, say), the middleware loads that
                resource first and hands it to the engine, so the decision can also depend on the
                resource&apos;s own attributes — its region, its total, who owns it.
              </li>
              <li>
                This is also where the IDOR check lives: it&apos;s not enough that the caller{" "}
                <em>is</em> a customer — the engine confirms the order is <em>theirs</em> (or in a
                manager&apos;s own region). It returns <code>404</code> instead of <code>403</code>{" "}
                so a customer can&apos;t even learn that another order id exists.
              </li>
              <li>
                If the engine says no, the middleware responds <code>403</code> with the reason.
              </li>
            </ul>
          </div>
        </details>

        <details>
          <summary>What are the three parts of a JWT, and which one can a client read?</summary>
          <div className="answer">
            <p>
              Header, payload, signature. The client can read <em>all three</em> — they&apos;re
              base64url-encoded, not encrypted. The signature only proves the payload wasn&apos;t
              modified, so never put a secret in it.
            </p>
          </div>
        </details>

        <details>
          <summary>Why can&apos;t you revoke a JWT, and what do you do about it?</summary>
          <div className="answer">
            <p>
              The server stores nothing, so there&apos;s no record to delete — a valid signature is
              accepted until <code>exp</code> passes. The standard mitigation is a short-lived access
              token (~15 min) plus a refresh token that <em>is</em> stored server-side and can be
              revoked.
            </p>
          </div>
        </details>

        <details>
          <summary>Walk through a full JWT auth flow, from login to an authenticated request.</summary>
          <div className="answer">
            <ol>
              <li>
                The client sends email + password to <code>POST /auth/login</code>.
              </li>
              <li>
                The server verifies the password, then signs two tokens: a short-lived{" "}
                <strong>access token</strong> (id, email, role, expires in minutes) and a
                longer-lived <strong>refresh token</strong>.
              </li>
              <li>
                The server returns the access token in the response body, and sets the refresh token
                as an httpOnly cookie.
              </li>
              <li>
                The client keeps the access token <strong>in memory only</strong> (never{" "}
                <code>localStorage</code>) and sends it as <code>Authorization: Bearer &lt;token&gt;</code>{" "}
                on every request.
              </li>
              <li>
                Once the access token expires, the client calls <code>POST /auth/refresh</code>. The
                browser attaches the httpOnly refresh-token cookie automatically; the server verifies
                it and issues a fresh access token.
              </li>
              <li>The client retries the original request with the new access token.</li>
            </ol>
          </div>
        </details>

        <details>
          <summary>Where should a JWT be stored on the client, and why?</summary>
          <div className="answer">
            <p>
              The access token: in memory (a JS variable or React state), never{" "}
              <code>localStorage</code>/<code>sessionStorage</code> — any injected script (XSS) can
              read those directly. The refresh token: an httpOnly, Secure,{" "}
              <code>SameSite</code> cookie, so client-side JavaScript can&apos;t read it at all. The
              trade-off is that an httpOnly cookie is sent automatically, so it needs CSRF defenses
              that a header-based bearer token doesn&apos;t.
            </p>
          </div>
        </details>

        <details>
          <summary>What&apos;s the difference between a 401 and a 403?</summary>
          <div className="answer">
            <p>
              <code>401</code> means the server doesn&apos;t know who you are — no token, or an
              invalid/expired one — and it happens before authorization even runs. <code>403</code>{" "}
              means the server knows exactly who you are, and the policy engine says no. Retrying a{" "}
              <code>401</code> means re-authenticating; retrying a <code>403</code> with the same
              identity will never succeed.
            </p>
          </div>
        </details>

        <details>
          <summary>What is CORS, and what purpose does it serve?</summary>
          <div className="answer">
            <p>
              CORS (Cross-Origin Resource Sharing) is a browser rule that blocks a page on one origin
              from reading a response from a different origin unless that server explicitly allows it
              via response headers. It exists to stop a malicious site from silently reading data from
              another site your browser happens to be logged into. The server still receives and
              answers the request normally — the browser is what refuses to hand the response to the
              page&apos;s JavaScript — which is why the same call works fine from Postman or curl, and
              still shows up in the server logs.
            </p>
          </div>
        </details>

        <details>
          <summary>Walk through the OAuth2 authorization-code flow.</summary>
          <div className="answer">
            <p>
              Redirect the browser to the provider → user authenticates there → provider redirects
              back with a short-lived <code>code</code> → your server exchanges that code plus its{" "}
              <code>client_secret</code> for tokens over a back channel → your server issues its own
              session. The exchange is server-to-server so the secret never reaches the browser.
            </p>
          </div>
        </details>

        <details>
          <summary>What is OIDC, and what does it add on top of OAuth2?</summary>
          <div className="answer">
            <p>
              OAuth2 alone is <em>authorization</em> — &quot;this app may act on your behalf&quot; —
              it never defines who the user is. OIDC is a thin identity layer on top that adds a
              standardized <code>id_token</code>, a JWT that actually says who the user is, turning an
              authorization protocol into one you can authenticate with too.
            </p>
          </div>
        </details>

        <details>
          <summary>What is single sign-on (SSO), and why do internal enterprise apps rely on it?</summary>
          <div className="answer">
            <p>
              SSO isn&apos;t a protocol itself — it&apos;s the outcome of several apps trusting one
              shared identity provider, so logging in once logs you into every connected app.
              Enterprises lean on it internally (think Okta) because employees need access to many
              internal tools and SaaS apps at once; one centrally managed login point lets IT enforce
              a single password policy and MFA, and instantly revoke <em>everything</em> when an
              employee leaves, instead of chasing down credentials app by app.
            </p>
          </div>
        </details>

        <details>
          <summary>What are some ways to make stored passwords more secure?</summary>
          <div className="answer">
            <p>
              Always hash passwords — never store them plain or reversibly encrypted — and always
              hash with a slow, purpose-built algorithm like <strong>bcrypt</strong> or argon2, never
              a fast general-purpose hash like SHA-256 or MD5. Those are designed for speed, which
              lets an attacker try billions of guesses per second against a stolen hash dump; bcrypt
              is deliberately slow, and salts every hash automatically, so two users with the same
              password get different hashes and no single precomputed table can crack every row at
              once. Beyond hashing: enforce a minimum length, rate-limit login attempts, and support
              MFA so a leaked password alone still isn&apos;t enough.
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
          <summary>What is XSS, and how do you prevent it?</summary>
          <div className="answer">
            <p>
              Cross-site scripting — an attacker gets their own script to run in another user&apos;s
              browser, usually by injecting it into content that later gets rendered as HTML (a
              comment field written with <code>innerHTML</code>, say). Prevent it by escaping all
              user-generated content on output — React does this automatically for anything rendered
              as <code>{"{"}value{"}"}</code> — and avoiding <code>dangerouslySetInnerHTML</code> or
              any other raw-HTML injection of untrusted input. A Content-Security-Policy header is a
              useful second line of defense.
            </p>
          </div>
        </details>

        <details>
          <summary>What is CSRF, and how do you prevent it?</summary>
          <div className="answer">
            <p>
              Cross-site request forgery — another site gets a logged-in user&apos;s browser to make
              an authenticated request using their existing session cookie, without the user meaning
              to. Prevent it with <code>SameSite=Strict</code> (or <code>Lax</code>) cookies, so the
              cookie isn&apos;t attached to cross-site requests, and/or a CSRF token the form has to
              echo back. A bearer token sent in an <code>Authorization</code> header instead of a
              cookie sidesteps the problem entirely — the browser won&apos;t attach it for you.
            </p>
          </div>
        </details>

        <details>
          <summary>What is a DDoS attack, and how do you prevent or mitigate it?</summary>
          <div className="answer">
            <p>
              Distributed denial-of-service — flooding a server with traffic from many sources at once
              so real users can&apos;t get through. Mitigation is mostly infrastructure, not app code:
              rate limiting per IP or user, a CDN/WAF in front of the app (e.g. Cloudflare) to absorb
              and filter traffic before it ever reaches your server, and autoscaling so a spike
              doesn&apos;t take the whole thing down.
            </p>
          </div>
        </details>
      </section>
    </div>
  );
}
