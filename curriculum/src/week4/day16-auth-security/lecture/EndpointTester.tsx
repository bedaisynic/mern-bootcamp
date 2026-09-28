import { useState } from "react";
import type { Endpoint, Method } from "./endpoints";

interface Props {
  apiBase: string;
  endpoints: Endpoint[];
  // Omit for endpoints that don't use a bearer token (the session demo).
  getToken?: () => Promise<string | null | undefined>;
  // Sends cookies cross-origin. Only the session demo needs it.
  withCookies?: boolean;
}

interface Result {
  status: number | null;
  body: string;
}

export default function EndpointTester({ apiBase, endpoints, getToken, withCookies }: Props) {
  const [method, setMethod] = useState<Method>(endpoints[0].method);
  const [path, setPath] = useState(endpoints[0].path);
  const [body, setBody] = useState("");
  const [attachToken, setAttachToken] = useState(true);
  const [result, setResult] = useState<Result | null>(null);
  const [sentHeader, setSentHeader] = useState<string | null>(null);

  function pick(endpoint: Endpoint) {
    setMethod(endpoint.method);
    setPath(endpoint.path);
    setBody(endpoint.body ? JSON.stringify(endpoint.body, null, 2) : "");
    setResult(null);
  }

  async function send() {
    const headers: Record<string, string> = {};
    if (body.trim()) headers["Content-Type"] = "application/json";

    const token = getToken && attachToken ? await getToken() : null;
    // This one line is how the client proves who it is on every request.
    if (token) headers.Authorization = `Bearer ${token}`;
    setSentHeader(token ? `Authorization: Bearer ${token.slice(0, 24)}…` : null);

    try {
      const res = await fetch(apiBase + path, {
        method,
        headers,
        body: body.trim() ? body : undefined,
        credentials: withCookies ? "include" : "same-origin",
      });
      const text = await res.text();
      let pretty = text;
      try {
        pretty = JSON.stringify(JSON.parse(text), null, 2);
      } catch {
        // not JSON; show as-is
      }
      setResult({ status: res.status, body: pretty });
    } catch {
      setResult({ status: null, body: `Could not reach ${apiBase}. Is the backend running?` });
    }
  }

  const tone =
    result === null
      ? ""
      : result.status === null
        ? "is-dead"
        : result.status < 400
          ? "is-ok"
          : result.status < 500
            ? "is-client-error"
            : "is-server-error";

  return (
    <div className="api-console">
      <div className="preset-row">
        {endpoints.map((e) => (
          <button
            key={e.method + e.path}
            className={`preset-btn method-${e.method.toLowerCase()}`}
            title={`Who can call it: ${e.access}`}
            onClick={() => pick(e)}
          >
            <span className="preset-method">{e.method}</span>
            {e.path}
          </button>
        ))}
      </div>
      <p className="preset-note">
        Who can call it: {endpoints.find((e) => e.method === method && e.path === path)?.access ?? "—"}
      </p>

      <div className="console-grid">
        <div className="request-form">
          <div className="request-line">
            <select value={method} onChange={(e) => setMethod(e.target.value as Method)}>
              <option>GET</option>
              <option>POST</option>
              <option>PATCH</option>
              <option>DELETE</option>
            </select>
            <input value={path} onChange={(e) => setPath(e.target.value)} />
            <button className="send-btn" onClick={send}>
              Send
            </button>
          </div>
          {getToken && (
            <label className="auth-check">
              <input type="checkbox" checked={attachToken} onChange={(e) => setAttachToken(e.target.checked)} />
              Attach the token (uncheck to see a 401)
            </label>
          )}
          <label>
            JSON body
            <textarea rows={6} value={body} onChange={(e) => setBody(e.target.value)} placeholder="(none)" />
          </label>
          {sentHeader && <code className="auth-sent-header">{sentHeader}</code>}
        </div>

        <div className={`resp-panel ${tone}`}>
          <p className="resp-label">Response</p>
          {result ? (
            <>
              <div className="resp-head">
                <span className="resp-status">{result.status ?? "—"}</span>
              </div>
              <pre className="resp-body">{result.body}</pre>
            </>
          ) : (
            <p className="resp-waiting">Pick an endpoint and press Send.</p>
          )}
        </div>
      </div>
    </div>
  );
}
