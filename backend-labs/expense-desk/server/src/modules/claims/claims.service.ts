import { resultFor } from "../../ai/workflow";
import { clearEvidence, payOnce } from "./payment";
import { resetStore } from "../../store";
import { processClaim } from "../../ai/workflow";
import { AppError, ConflictError, NotFoundError, ValidationError } from "../../errors";
import { db } from "../../store";
import type { Claim, ClaimResult } from "../../types";
import type { ClaimDetail, ClaimSummary, NewClaim } from "./claims.types";

const DECISIONS = ["approve", "partial", "reject", "needs_approval", "escalate"];

function findClaim(id: string): Claim {
  const claim = db.claims.find((c) => c.id === id);
  if (!claim) throw new NotFoundError(`No claim with id ${id}`);
  return claim;
}

// The receipt's first line is usually the merchant
function merchantOf(claim: Claim) {
  return claim.receiptText.split("\n")[0]?.trim() || "(no receipt)";
}

export function listClaims(): ClaimSummary[] {
  return db.claims.map((claim) => ({
    id: claim.id,
    employeeName: db.employees.find((e) => e.id === claim.employeeId)?.name ?? claim.employeeId,
    merchant: merchantOf(claim),
    amount: claim.amount,
    submittedAt: claim.submittedAt,
    status: claim.status,
    decision: db.results.get(claim.id)?.decision ?? null,
  }));
}

export function getClaimDetail(id: string): ClaimDetail {
  const claim = findClaim(id);
  return {
    claim,
    employee: db.employees.find((e) => e.id === claim.employeeId) ?? null,
    result: db.results.get(id) ?? null,
    payments: db.payments.filter((p) => p.claimId === id),
  };
}

export function createClaim(input: NewClaim): Claim {
  if (!db.employees.some((e) => e.id === input.employeeId))
    throw new ValidationError("Unknown employee");
  if (!Number.isFinite(input.amount) || !(input.amount > 0))
    throw new ValidationError("Amount must be more than 0");
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.expenseDate ?? ""))
    throw new ValidationError("expenseDate must be YYYY-MM-DD");
  if (!input.note?.trim()) throw new ValidationError("Write a note about the expense");

  const claim: Claim = {
    id: `C${String(db.claims.length + 1).padStart(2, "0")}`,
    employeeId: input.employeeId,
    amount: Math.round(input.amount * 100) / 100,
    expenseDate: input.expenseDate,
    submittedAt: new Date().toISOString().slice(0, 10),
    note: input.note.trim(),
    receiptText: input.receiptText?.trim() ?? "",
    status: "new",
  };
  db.claims.push(claim);
  return claim;
}

// One run at a time prevents competing history/cap decisions in this in-memory lab.
let processing = false;
function assertIdle() {
  if (processing) throw new ConflictError("A claim is processing. Try again when it finishes.");
}
export function resetClaims() {
  assertIdle();
  resetStore();
  clearEvidence();
}
export function listApprovals() {
  return db.claims
    .filter((c) => c.status === "needs_approval")
    .map((c) => ({
      ...getClaimDetail(c.id),
      manager:
        db.employees.find(
          (e) => e.id === db.employees.find((e) => e.id === c.employeeId)?.managerId,
        ) ?? null,
    }));
}

export async function processClaimById(id: string): Promise<ClaimResult> {
  assertIdle();
  const claim = findClaim(id);
  if (claim.status !== "new" || db.results.has(id) || db.payments.some((p) => p.claimId === id))
    throw new ConflictError("This claim has already been reviewed. Reset data to start over.");
  processing = true;
  claim.status = "processing";
  try {
    const result = await processClaim(id);
    const problem = checkResult(result, claim.amount);
    if (problem) throw new AppError(500, `Invalid review result: ${problem}`);
    db.results.set(id, { ...result, processedAt: new Date().toISOString() });
    claim.status =
      result.decision === "needs_approval"
        ? "needs_approval"
        : db.payments.some((p) => p.claimId === id)
          ? "paid"
          : "processed";
    return result;
  } catch (error) {
    // A payment must never become retryable because result persistence failed.
    claim.status = db.payments.some((p) => p.claimId === id) ? "paid" : "new";
    throw error;
  } finally {
    processing = false;
  }
}

export function approveClaim(id: string): ClaimResult {
  assertIdle();
  const claim = findClaim(id);
  const stored = db.results.get(id);
  if (claim.status === "paid" && stored) return stored;
  if (claim.status !== "needs_approval" || stored?.decision !== "needs_approval")
    throw new ConflictError("This claim is not waiting for manager approval.");
  const problem = checkResult(stored, claim.amount);
  if (problem) throw new ValidationError(problem);
  const employee = db.employees.find((e) => e.id === claim.employeeId);
  if (!employee?.managerId || !db.employees.some((e) => e.id === employee.managerId))
    throw new ValidationError("No manager is assigned.");
  const result = resultFor(
    stored.approvedAmount < claim.amount ? "partial" : "approve",
    stored.approvedAmount,
    stored.ruleIds,
    `${stored.summary.replace("Manager approval is required before payment.", "").trim()} Manager approved the stored amount.`,
  );
  payOnce(id, stored, true);
  db.results.set(id, { ...result, processedAt: new Date().toISOString() });
  claim.status = "paid";
  return result;
}

export function rejectClaim(id: string): ClaimResult {
  assertIdle();
  const claim = findClaim(id);
  const stored = db.results.get(id);
  if (claim.status === "manager_rejected" && stored) return stored;
  if (
    claim.status !== "needs_approval" ||
    stored?.decision !== "needs_approval" ||
    db.payments.some((p) => p.claimId === id)
  )
    throw new ConflictError("This claim is not waiting for manager approval.");
  const result = resultFor(
    "reject",
    0,
    stored.ruleIds,
    `${stored.summary.replace("Manager approval is required before payment.", "").trim()} Manager declined the claim; no payment was made.`,
  );
  db.results.set(id, { ...result, processedAt: new Date().toISOString() });
  claim.status = "manager_rejected";
  return result;
}

function checkResult(r: ClaimResult, requested: number): string | null {
  if (!r || typeof r !== "object") return "expected an object";
  if (!DECISIONS.includes(r.decision)) return "unknown decision";
  if (
    !Number.isFinite(r.approvedAmount) ||
    r.approvedAmount < 0 ||
    r.approvedAmount > requested ||
    Math.abs(r.approvedAmount * 100 - Math.round(r.approvedAmount * 100)) > 0.000001
  )
    return "invalid approved amount";
  if (["reject", "escalate"].includes(r.decision) ? r.approvedAmount !== 0 : r.approvedAmount <= 0)
    return "amount contradicts decision";
  if (["approve", "partial"].includes(r.decision) && r.approvedAmount > 500)
    return "manager approval required";
  if (!Array.isArray(r.ruleIds) || r.ruleIds.some((id) => !/^R(?:[1-9]|10)$/.test(id)))
    return "invalid policy rules";
  if (
    typeof r.summary !== "string" ||
    !r.summary.trim() ||
    typeof r.emailToEmployee !== "string" ||
    !r.emailToEmployee.trim()
  )
    return "missing explanation";
  return null;
}
