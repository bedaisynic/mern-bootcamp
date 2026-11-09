import { randomUUID } from 'node:crypto';
import { env, HttpError, internalRequest, log } from '@oms/server-kit';
import { CASE_ID, demoIntake, getContext, intakeOrders, mockOperations, oms } from '@oms/oms-mock-adapters';
import type { Command, IntakeInput } from '@oms/shared-schemas';
import { actionLabels, type Actor, type FeatureEvent, type ResolutionCase } from '@oms/shared-types';
import { readCase, changeCase, listCases, registerCase } from '../repositories/case.repository.js';
import { validateAction } from './validation.service.js';

function audit(record: ResolutionCase, actor: string, title: string, detail?: string) {
  record.audit.push({id: randomUUID(), at: new Date().toISOString(), actor, title, detail});
}
function requireState(condition: unknown, message: string): asserts condition {
  if (!condition) throw new HttpError(409, message);
}
function envelope(caseId: string, correlationId: string) {
  return {id: randomUUID(), caseId, correlationId, at: new Date().toISOString()};
}
async function toWorkspace(record: ResolutionCase) {
  const citations = new Set(record.investigation?.result?.policyReferences.map(policy => policy.policyId));
  const policyDetails = citations.size ? (await oms.getPolicies()).filter(policy => citations.has(policy.policyId)) : [];
  const contact = intakeOrders.find(order => order.orderId === record.orderId);
  const intake = record.id === CASE_ID || !contact ? demoIntake : {
    ...demoIntake, email: record.contactEmail ?? contact.email, phone: contact.phone, summary: record.exceptionDetails,
  };
  return {...record, intake, policyDetails, context: await getContext(record.orderId, record.workflow?.execution)};
}
export async function workspace(id: string) {
  return toWorkspace(await readCase(id));
}
export async function queue() {
  const records = (await listCases()).sort((a, b) => b.openedAt.localeCompare(a.openedAt));
  return Promise.all(records.map(toWorkspace));
}
export async function registerCall(actor: Actor, input: IntakeInput) {
  if (actor.role !== 'agent') throw new HttpError(403, 'Only the agent taking the call can register it');
  const order = intakeOrders.find(candidate => candidate.orderId === input.orderId);
  if (!order) throw new HttpError(404, 'Demo order was not found');
  const openedAt = new Date().toISOString();
  const result = await registerCase({
    id: order.caseId, orderId: order.orderId, customer: input.customerName, contactEmail: input.email, brand: 'Pottery Barn', issue: 'Delivery delay',
    openedAt, status: 'Open', priority: 'High', assigned: actor.name, exceptionDetails: input.notes,
    audit: [{id: 'opened', at: openedAt, actor: actor.name, title: 'Exception case opened', detail: input.notes}],
  });
  return {id: result.record.id, created: result.created};
}
export async function applyCommand(id: string, actor: Actor, command: Command) {
  const requiredRole = command.type === 'approve' ? 'supervisor' : 'agent';
  if (actor.role !== requiredRole) throw new HttpError(403, 'This step requires the ' + requiredRole + ' role');
  await changeCase(id, async (record, emit) => {
    if (actor.role === 'agent' && actor.name !== record.assigned) throw new HttpError(403, 'Only the handling agent can continue this case');
    const workflow = record.workflow;
    const investigation = record.investigation;
    if (command.type === 'execute' && workflow?.id === command.workflowId && workflow.status === 'executed') return;
    if (command.type === 'close' && record.status === 'Closed') return;
    if (command.type === 'send' && record.response?.sentAt) return;
    requireState(record.status !== 'Closed', 'This case is closed');
    switch (command.type) {
      case 'investigate': {
        requireState(record.status === 'Open' && !workflow, 'Investigation is no longer available');
        if (investigation && investigation.status !== 'failed') return;
        const investigationId = randomUUID();
        record.investigation = {id: investigationId, status: 'queued'};
        audit(record, actor.name, 'AI investigation started');
        emit({...envelope(id, investigationId), topic: 'investigation.requested', data: {orderId: record.orderId, issue: record.issue}});
        break;
      }
      case 'review':
        requireState(investigation?.status === 'completed', 'Complete an investigation first');
        if (investigation.reviewed) return;
        investigation.reviewed = true;
        audit(record, actor.name, 'Recommendations reviewed');
        break;
      case 'select': {
        requireState(record.status === 'Open' && investigation?.reviewed, 'Review the investigation before selecting an action');
        requireState(!workflow || ['rejected', 'ready', 'escalated'].includes(workflow.status), 'The active action cannot be replaced');
        const {checks, needsApproval} = await validateAction(record.orderId, command.input);
        record.workflow = {id: randomUUID(), selection: command.input, checks, status: needsApproval ? 'pending' : 'ready'};
        audit(record, actor.name, 'Resolution action selected', actionLabels[command.input.action]);
        audit(record, 'Resolution service', 'Business validation completed', checks.join(' · '));
        if (needsApproval) audit(record, actor.name, 'Supervisor approval requested', command.input.reason);
        break;
      }
      case 'approve': {
        requireState(workflow?.status === 'pending' && workflow.id === command.workflowId, 'This approval request is no longer pending');
        workflow.approval = {by: actor.name, ...command.input};
        const accepted = command.input.decision === 'approved';
        workflow.status = accepted && workflow.selection.action === 'ESCALATE' ? 'escalated' : command.input.decision;
        audit(record, actor.name, accepted ? 'Supervisor approval granted' : 'Supervisor approval declined', command.input.note);
        if (accepted) emit({...envelope(id, workflow.id), topic: 'resolution.approved', data: {workflowId: workflow.id}});
        if (workflow.status === 'escalated') audit(record, actor.name, 'Manager review completed', 'The original agent continues handling the case.');
        break;
      }
      case 'execute': {
        requireState(workflow && workflow.id === command.workflowId && ['ready', 'approved', 'failed'].includes(workflow.status), 'Validate the current action and obtain any required approval first');
        const {needsApproval} = await validateAction(record.orderId, workflow.selection);
        requireState(!needsApproval || workflow.approval?.decision === 'approved', 'Supervisor approval is required');
        try {
          workflow.execution = await mockOperations.execute(workflow.selection, workflow.id);
          workflow.status = 'executed';
          workflow.error = undefined;
          record.status = 'Resolved';
          audit(record, actor.name, 'Resolution executed', workflow.execution.summary);
          emit({...envelope(id, workflow.id), topic: 'resolution.completed', data: {workflowId: workflow.id, reference: workflow.execution.reference}});
        } catch (error) {
          log.error({err: error, caseId: id, workflowId: workflow.id}, 'OMS execution failed');
          workflow.status = 'failed';
          workflow.error = 'OMS execution did not return a receipt. Retry this action with the same reference.';
          audit(record, 'Resolution service', 'Resolution execution failed', workflow.error);
          emit({...envelope(id, workflow.id), topic: 'resolution.failed', data: {workflowId: workflow.id, error: workflow.error}});
        }
        break;
      }
      case 'draft': {
        requireState(record.status === 'Resolved' && workflow?.execution, 'Execute the resolution before drafting a response');
        if (record.response) return;
        record.response = await internalRequest(env.ai + '/internal/draft', {
          customer: record.customer, issue: record.issue, summary: workflow.execution.summary, reference: workflow.execution.reference,
        });
        audit(record, actor.name, 'Customer response drafted');
        break;
      }
      case 'send': {
        requireState(record.status === 'Resolved' && record.response && workflow, 'Generate a response before sending');
        const receipt = await mockOperations.notify(id, workflow.id, command.input.text);
        record.response = {...receipt, sentAt: new Date().toISOString()};
        audit(record, actor.name, 'Customer notified', receipt.reference);
        break;
      }
      case 'close':
        requireState(record.status === 'Resolved' && record.response?.sentAt, 'Notify the customer before closing');
        record.status = 'Closed';
        audit(record, actor.name, 'Exception case closed');
        break;
    }
  });
  return workspace(id);
}
export async function receiveInvestigation(event: FeatureEvent) {
  if (event.topic !== 'investigation.completed' && event.topic !== 'investigation.failed') return;
  await changeCase(event.caseId, record => {
    const current = record.investigation;
    if (current?.id !== event.correlationId || current.status !== 'queued') return;
    if (event.topic === 'investigation.completed') {
      record.investigation = {...current, status: 'completed', result: event.data};
      audit(record, 'AI investigation', 'AI investigation completed', event.data.rootCause);
    } else {
      record.investigation = {...current, status: 'failed', error: event.data.error};
      audit(record, 'AI investigation', 'AI investigation failed', event.data.error);
    }
  }, event.id);
}
