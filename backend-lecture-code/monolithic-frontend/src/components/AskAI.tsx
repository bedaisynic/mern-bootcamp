import { useState } from "react";
import { api, ApiError } from "../api";

// #demo-secrets-manager — minimal demo widget: calls POST /ai/ask, which
// retrieves a fake API key via Secrets Manager (or .env locally) and
// returns a hardcoded reply. No real AI is called anywhere in this flow.
export default function AskAI() {
  const [reply, setReply] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function ask() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.askAI();
      setReply(res.reply);
      setNote(res.note);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to reach the AI endpoint.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ask-ai">
      <button onClick={ask} disabled={loading}>
        {loading ? "Asking..." : "Ask AI"}
      </button>
      {reply && (
        <div className="ask-ai-reply">
          <p>{reply}</p>
          <p className="muted">{note}</p>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
}
