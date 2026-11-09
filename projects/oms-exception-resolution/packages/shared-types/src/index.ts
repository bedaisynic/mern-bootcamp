export const ACTIONS = ['RESCHEDULE_DELIVERY', 'GOODWILL_CREDIT', 'REPLACE_ITEM', 'REFUND_ORDER', 'ESCALATE'] as const;
export type Action = typeof ACTIONS[number];
export const actionLabels: Record<Action, string> = {
  RESCHEDULE_DELIVERY: 'Reschedule delivery', GOODWILL_CREDIT: 'Goodwill credit',
  REPLACE_ITEM: 'Replace item', REFUND_ORDER: 'Refund order', ESCALATE: 'Request manager review',
};
export const ROLES = ['agent', 'supervisor'] as const;
export type Actor = { id: string; name: string; role: typeof ROLES[number] };
export const actors: Record<Actor['role'], Actor> = {
  agent: {id: 'sarah', name: 'Sarah Chen', role: 'agent'},
  supervisor: {id: 'marcus', name: 'Marcus Lee', role: 'supervisor'},
};
export type IntakeOrderMatch = {orderId: string; customer: string; item: string; placed: string; deliveryStatus: string};
export type VerifiedIntakeOrder = IntakeOrderMatch & {email: string; address: string; caseId?: string};
export type ActionInput = { action: Action; slotId?: string; amount?: number; reason: string };
export type PolicyReference = { policyId: string; title: string };
export type Evidence = { source: string; description: string };
export type InvestigationResult = {
  rootCause: string;
  evidence: Evidence[];
  recommendedActions: {action: Action; reason: string}[];
  policyReferences: PolicyReference[];
};
export type Investigation = {
  id: string;
  status: 'queued' | 'completed' | 'failed';
  result?: InvestigationResult;
  error?: string;
  reviewed?: boolean;
};
export type Workflow = {
  id: string;
  selection: ActionInput;
  checks: string[];
  status: 'ready' | 'pending' | 'approved' | 'rejected' | 'executed' | 'failed' | 'escalated';
  approval?: { by: string; decision: 'approved' | 'rejected'; note: string };
  execution?: { reference: string; summary: string; slotId?: string; refunded?: boolean; credit?: number; replacementReserved?: boolean };
  error?: string;
};
export type AuditEntry = { id: string; at: string; actor: string; title: string; detail?: string };
export type ResolutionCase = {
  id: string; orderId: string; customer: string; brand: string; issue: string; openedAt: string;
  status: 'Open' | 'Resolved' | 'Closed'; priority: 'High'; assigned: string; exceptionDetails: string;
  contactEmail?: string;
  investigation?: Investigation; workflow?: Workflow;
  response?: { text: string; sentAt?: string; reference?: string };
  audit: AuditEntry[];
};
export const TOPICS = ['investigation.requested', 'investigation.completed', 'investigation.failed', 'resolution.approved', 'resolution.completed', 'resolution.failed'] as const;
export type Topic = typeof TOPICS[number];
export type FeatureEvent = {
  id: string; caseId: string; correlationId: string; at: string;
} & (
  | { topic: 'investigation.requested'; data: { orderId: string; issue: string } }
  | { topic: 'investigation.completed'; data: InvestigationResult }
  | { topic: 'investigation.failed'; data: { error: string } }
  | { topic: 'resolution.approved'; data: { workflowId: string } }
  | { topic: 'resolution.completed'; data: { workflowId: string; reference: string } }
  | { topic: 'resolution.failed'; data: { workflowId: string; error: string } }
);
