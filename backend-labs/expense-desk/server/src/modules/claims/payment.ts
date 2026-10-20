import { ConflictError, ValidationError } from "../../errors";
import { db } from "../../store";
import { tools } from "../../tools";
import type { ClaimResult } from "../../types";
import type { Facts } from "../../ai/workflow";

// Scoped to this single-process, in-memory lab. No awaits between checking and paying.
const evidence = new Map<string, Facts>();
export function rememberEvidence(id: string, facts: Facts) {
  evidence.set(id, facts);
}
export function clearEvidence() {
  evidence.clear();
}
export function payOnce(id: string, result: ClaimResult, managerApproved = false) {
  const existing = db.payments.find((p) => p.claimId === id);
  if (existing) {
    if (Math.round(existing.amount * 100) !== Math.round(result.approvedAmount * 100))
      throw new ConflictError("Payment amount differs from the stored payment");
    return existing;
  }
  const amount = result.approvedAmount;
  const claim = tools.getClaim({ claimId: id });
  if (
    !["approve", "partial", "needs_approval"].includes(result.decision) ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > claim.amount ||
    Math.abs(amount * 100 - Math.round(amount * 100)) > 0.000001
  )
    throw new ValidationError("Invalid payment decision or amount");
  if ((amount > 500 || result.decision === "needs_approval") && !managerApproved)
    throw new ConflictError("Manager approval required before payment");
  const facts = evidence.get(id);
  const normalize = (value: string) => value.toLowerCase().replace(/[^a-z0-9]/g, "");
  if (
    facts &&
    db.pastClaims.some(
      (p) =>
        p.employeeId === claim.employeeId &&
        ((facts.receiptNumber &&
          p.receiptNumber &&
          normalize(facts.receiptNumber) === normalize(p.receiptNumber)) ||
          (facts.merchant &&
            normalize(facts.merchant) === normalize(p.merchant) &&
            p.expenseDate === (facts.receiptDate ?? claim.expenseDate) &&
            Math.round(p.amount * 100) === Math.round((facts.receiptTotal ?? claim.amount) * 100))),
    )
  )
    throw new ConflictError(
      "This receipt was paid under another claim. Reject the duplicate instead.",
    );
  if (
    facts?.category === "meal" &&
    db.pastClaims.some(
      (p) =>
        p.employeeId === claim.employeeId &&
        p.expenseDate === claim.expenseDate &&
        /meal|breakfast|lunch|dinner/i.test(p.description),
    )
  )
    throw new ConflictError(
      "A meal was paid after this review. Finance must recheck the daily allowance.",
    );
  const payment = tools.payClaim({ claimId: id, amount });
  db.pastClaims.push({
    id: payment.id,
    employeeId: claim.employeeId,
    merchant: facts?.merchant ?? claim.receiptText.split("\n")[0],
    description: `[${facts?.category ?? "expense"}] ${claim.note}`,
    expenseDate: facts?.receiptDate ?? claim.expenseDate,
    submittedAt: claim.submittedAt,
    amount: facts?.receiptTotal ?? claim.amount,
    receiptNumber: facts?.receiptNumber ?? null,
    status: "paid",
  });
  evidence.delete(id);
  return payment;
}
