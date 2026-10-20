// Mirrors server/src/types.ts and server/src/modules/claims/claims.types.ts

export type Decision = "approve" | "partial" | "reject" | "needs_approval" | "escalate";
export type ClaimStatus =
  "new" | "processing" | "processed" | "needs_approval" | "paid" | "manager_rejected";

export type Employee = {
  id: string;
  name: string;
  title: string;
  department: string;
  managerId: string | null;
  homeCity: string;
};

export type Claim = {
  id: string;
  employeeId: string;
  amount: number;
  expenseDate: string;
  submittedAt: string;
  note: string;
  receiptText: string;
  status: ClaimStatus;
};

export type ClaimResult = {
  decision: Decision;
  approvedAmount: number;
  ruleIds: string[];
  summary: string;
  emailToEmployee: string;
  processedAt?: string;
};

export type Payment = { id: string; claimId: string; amount: number; paidAt: string };

export type ClaimSummary = {
  id: string;
  employeeName: string;
  merchant: string;
  amount: number;
  submittedAt: string;
  status: ClaimStatus;
  decision: Decision | null;
};

export type ClaimDetail = {
  claim: Claim;
  employee: Employee | null;
  result: ClaimResult | null;
  payments: Payment[];
};

export type NewClaim = {
  employeeId: string;
  amount: number;
  expenseDate: string;
  note: string;
  receiptText: string;
};

export type ApprovalItem = ClaimDetail & { manager: Employee | null };
