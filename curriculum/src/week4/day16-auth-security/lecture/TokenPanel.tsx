// Shows that a JWT is readable by anyone holding it: the client can decode the header and
// payload without any secret. Only the server can check the signature.
export default function TokenPanel({ token }: { token: string }) {
  const [header, payload, signature] = token.split(".");

  const decode = (part: string) => {
    const base64 = part.replace(/-/g, "+").replace(/_/g, "/");
    return JSON.stringify(JSON.parse(atob(base64)), null, 2);
  };

  return (
    <div className="token-panel">
      <p className="resp-label">The token this page is holding (in memory)</p>
      <code className="token-raw">
        <span className="token-header">{header}</span>.<span className="token-payload">{payload}</span>.
        <span className="token-signature">{signature}</span>
      </code>
      <div className="token-decoded">
        <div>
          <p className="resp-label token-header">Header</p>
          <pre className="resp-body">{decode(header)}</pre>
        </div>
        <div>
          <p className="resp-label token-payload">Payload</p>
          <pre className="resp-body">{decode(payload)}</pre>
        </div>
        <div>
          <p className="resp-label token-signature">Signature</p>
          <p className="token-note">Can&apos;t be decoded into anything. Only the server can check it.</p>
        </div>
      </div>
    </div>
  );
}
