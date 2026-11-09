import type { Workspace } from '@oms/oms-mock-adapters';

export const queuePath = '/exceptions';
export const intakePath = queuePath + '/new';
export const casePath = (id: string, view?: string) => queuePath + '/' + encodeURIComponent(id) + (view ? '/' + view : '');

export function nextStep(data: Workspace): {label: string; view?: string} {
  if (data.status === 'Closed') return {label: 'Review case history', view: 'timeline'};
  if (data.status === 'Resolved') return {label: data.response?.sentAt ? 'Close case' : 'Review customer response', view: 'response'};
  const action = data.workflow?.status;
  if (action === 'escalated') return {label: 'Manager reviewed · select a resolution', view: 'actions'};
  if (action === 'pending') return {label: 'Awaiting supervisor approval', view: 'approval'};
  if (action === 'approved' || action === 'ready') return {label: 'Execute resolution', view: 'actions'};
  if (action === 'failed') return {label: 'Retry resolution execution', view: 'actions'};
  if (data.investigation?.reviewed) return {label: 'Select and validate an action', view: 'actions'};
  if (data.investigation?.status === 'completed') return {label: 'Review AI recommendations', view: 'investigation'};
  if (data.investigation?.status === 'queued') return {label: 'Investigation in progress', view: 'investigation'};
  if (data.investigation?.status === 'failed') return {label: 'Retry investigation', view: 'investigation'};
  return {label: 'Start AI investigation'};
}

export function responseTarget(data: Workspace) {
  const deadline = Date.parse(data.openedAt) + data.intake.slaHours * 60 * 60 * 1000;
  const responseAt = data.response?.sentAt;
  return {
    overdue: (responseAt ? Date.parse(responseAt) : Date.now()) > deadline,
    label: new Intl.DateTimeFormat('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'America/Los_Angeles', timeZoneName: 'short',
    }).format(deadline),
  };
}
