import { useEffect, useState } from "react";
import { api } from "../api";
import { money } from "../format";
import type { ApprovalItem } from "../types";

type Props = { revision: number; onChanged: () => void; onSelect: (id: string) => void };
export default function ApprovalQueue({ revision, onChanged, onSelect }: Props) {
  const [items, setItems] = useState<ApprovalItem[]>([]);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    api
      .approvals()
      .then((rows) => {
        if (active) setItems(rows);
      })
      .catch((err) => {
        if (active) setError(err.message);
      });
    return () => {
      active = false;
    };
  }, [revision]);
  async function review(id: string, approve: boolean) {
    setBusy(id);
    setError("");
    try {
      await (approve ? api.approveClaim(id) : api.rejectClaim(id));
      setItems((rows) => rows.filter((row) => row.claim.id !== id));
      onChanged();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  }
  return (
    <section className="approval-queue card" aria-label="Manager approval queue">
      <h2>Manager approvals ({items.length})</h2>
      <p className="muted">
        Review the proposed amount before approving payment. Demo queue: manager identity is not
        verified.
      </p>
      {error && (
        <p className="error" role="alert">
          {error}
        </p>
      )}
      {items.length === 0 && <p className="muted">No claims waiting for approval.</p>}
      {items.map(({ claim, employee, manager, result }) => (
        <article className="approval-item" key={claim.id}>
          <div className="row">
            <button className="secondary" onClick={() => onSelect(claim.id)}>
              {claim.id}
            </button>
            <strong>
              {employee?.name} · {money(result?.approvedAmount ?? 0)}
            </strong>
          </div>
          <p className="muted">
            Manager: {manager?.name ?? "Unassigned"} · Rules: {result?.ruleIds.join(", ")}
          </p>
          <p>{result?.summary}</p>
          <div className="actions">
            <button disabled={busy !== null} onClick={() => review(claim.id, true)}>
              {busy === claim.id ? "Saving…" : "Approve & pay"}
            </button>
            <button
              className="secondary"
              disabled={busy !== null}
              onClick={() => review(claim.id, false)}
            >
              Reject
            </button>
          </div>
        </article>
      ))}
    </section>
  );
}
