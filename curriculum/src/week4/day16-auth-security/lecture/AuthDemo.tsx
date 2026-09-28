import { useEffect, useState, type FormEvent } from "react";
import EndpointTester from "./EndpointTester";
import { SHOP_ENDPOINTS, type Endpoint } from "./endpoints";
import TokenPanel from "./TokenPanel";

// backend-lecture-code/day16-auth-security/auth-reference
const API = import.meta.env.VITE_DAY16_API ?? "http://localhost:4000";

const SEED_ACCOUNTS = [
  "admin@shop.com",
  "manager@shop.com",
  "manager.west@shop.com",
  "alice@shop.com",
  "bob@shop.com",
];

const SESSION_ENDPOINTS: Endpoint[] = [
  { method: "POST", path: "/session/login", access: "Public", body: { email: "bob@shop.com", password: "password123" } },
  { method: "GET", path: "/session/me", access: "Anyone holding the session cookie" },
  { method: "POST", path: "/session/logout", access: "Anyone holding the session cookie" },
];

// If Google login fails, the backend redirects back to this page as ...lecture#error=...
function readErrorFromUrlFragment() {
  return new URLSearchParams(window.location.hash.slice(1)).get("error");
}

// Asks the backend for a fresh access token. The refresh token isn't passed in: it's an
// httpOnly cookie this code can't even see, and credentials: "include" lets the browser attach it.
//
// Only one refresh may be in flight at a time. The server rotates the refresh token on every
// call, so two calls at once would send the same token twice, and the second would look like a
// stolen token being reused (and log the user out). React StrictMode running the on-load effect
// twice would trigger exactly that. So every caller shares the same pending request.
let pendingRefresh: Promise<string | null> | null = null;

function requestAccessToken(): Promise<string | null> {
  pendingRefresh ??= fetch(`${API}/auth/refresh`, { method: "POST", credentials: "include" })
    .then(async (res) => (res.ok ? ((await res.json()).token as string) : null))
    .catch(() => null)
    .finally(() => {
      pendingRefresh = null;
    });
  return pendingRefresh;
}

// Seconds until the access token's exp, read from its payload.
function secondsLeft(token: string) {
  const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));
  return payload.exp - Date.now() / 1000;
}

export default function AuthDemo() {
  // The access token lives only in React state: in memory. No injected script can dig it out of
  // localStorage later. A page refresh wipes it, and the refresh-token cookie gets it back.
  const [token, setToken] = useState<string | null>(null);
  const [checking, setChecking] = useState(true);
  const [oauthError] = useState(readErrorFromUrlFragment);
  const [page, setPage] = useState<"login" | "signup">("login");

  // On load: clear any #error from the address bar, then try the refresh cookie. If it's valid
  // (you logged in earlier, or just came back from Google), you're logged in without typing.
  useEffect(() => {
    if (window.location.hash) history.replaceState(null, "", window.location.pathname);
    requestAccessToken().then((fresh) => {
      setToken(fresh);
      setChecking(false);
    });
  }, []);

  // Handed to the endpoint tester: returns a token that's still good, refreshing it first if
  // it's about to expire.
  async function getValidToken() {
    if (!token) return null;
    if (secondsLeft(token) > 10) return token;
    const fresh = await requestAccessToken();
    setToken(fresh); // null means the refresh token is gone too: back to the login form
    return fresh;
  }

  async function refreshNow() {
    setToken(await requestAccessToken());
  }

  async function logout() {
    // Revokes the refresh token on the server and clears its cookie.
    await fetch(`${API}/auth/logout`, { method: "POST", credentials: "include" }).catch(() => {});
    setToken(null);
  }

  return (
    <>
      <h2>JWT auth (backend at {API})</h2>
      {checking ? (
        <p className="console-intro">Checking for a refresh-token cookie…</p>
      ) : token ? (
        <LoggedIn token={token} getToken={getValidToken} onRefresh={refreshNow} onLogout={logout} />
      ) : page === "login" ? (
        <AuthForm mode="login" oauthError={oauthError} onToken={setToken} onSwitch={() => setPage("signup")} />
      ) : (
        <AuthForm mode="signup" oauthError={null} onToken={setToken} onSwitch={() => setPage("login")} />
      )}

      <h2>Session-based auth (for comparison)</h2>
      <p className="console-intro">
        No token in JavaScript at all: the server keeps a session and the browser carries an httpOnly cookie.
      </p>
      <EndpointTester apiBase={API} endpoints={SESSION_ENDPOINTS} withCookies />
    </>
  );
}

interface AuthFormProps {
  mode: "login" | "signup";
  oauthError: string | null;
  onToken: (token: string) => void;
  onSwitch: () => void;
}

function AuthForm({ mode, oauthError, onToken, onSwitch }: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(oauthError);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API}/auth/${mode}`, {
        method: "POST",
        // Without this, the browser ignores the refresh-token cookie in the response.
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.message);
      onToken(data.token);
    } catch {
      setError(`Could not reach ${API}. Is the backend running?`);
    }
  }

  return (
    <div className="demo-card auth-card">
      <h3>{mode === "login" ? "Log in" : "Create an account"}</h3>
      <form className="auth-form" onSubmit={submit}>
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button className="send-btn" type="submit">
          {mode === "login" ? "Log in" : "Sign up"}
        </button>
      </form>

      <p className="auth-divider">or</p>
      {/* A plain navigation, not fetch: the whole browser goes to the backend, then to Google. */}
      <a className="auth-google" href={`${API}/auth/google`}>
        Continue with Google
      </a>

      {error && <p className="auth-error">{error}</p>}

      {mode === "login" && (
        <div className="auth-seeds">
          <p className="resp-label">Seed accounts (password123)</p>
          <div className="demo-actions">
            {SEED_ACCOUNTS.map((seed) => (
              <button
                key={seed}
                type="button"
                onClick={() => {
                  setEmail(seed);
                  setPassword("password123");
                }}
              >
                {seed}
              </button>
            ))}
          </div>
        </div>
      )}

      <button type="button" className="auth-switch" onClick={onSwitch}>
        {mode === "login" ? "No account? Sign up" : "Already have an account? Log in"}
      </button>
    </div>
  );
}

interface LoggedInProps {
  token: string;
  getToken: () => Promise<string | null>;
  onRefresh: () => void;
  onLogout: () => void;
}

function LoggedIn({ token, getToken, onRefresh, onLogout }: LoggedInProps) {
  const payload = JSON.parse(atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")));

  return (
    <>
      <div className="auth-status">
        <span>
          Logged in as <strong>{payload.email}</strong> · role <code>{payload.role}</code>
        </span>
        {/* Swaps the refresh cookie for a new access token (and a new refresh cookie). Watch the
            token below change. */}
        <button onClick={onRefresh}>New access token</button>
        {/* Revokes the refresh token on the server. A copy of the current access token would still
            work until it expires, which is why it's short-lived. */}
        <button onClick={onLogout}>Log out</button>
      </div>
      <TokenPanel token={token} />
      <EndpointTester apiBase={API} endpoints={SHOP_ENDPOINTS} getToken={getToken} />
    </>
  );
}
