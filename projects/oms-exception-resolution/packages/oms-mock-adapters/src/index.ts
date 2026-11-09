import type { ActionInput, PolicyReference, ResolutionCase, Workflow } from '@oms/shared-types';

export const CASE_ID = 'EX-2048';
export const ORDER_ID = 'PB-10245';
export const intakeOrders = [
  {orderId: ORDER_ID, caseId: CASE_ID, customer: 'Emma Carter', email: 'emma.carter@example.com', phone: '(415) 555-0199'},
  {orderId: 'PB-10246', caseId: 'EX-2049', customer: 'Nora Wilson', email: 'nora.wilson@example.com', phone: '(415) 555-0126'},
];
const isDemoOrder = (id: string) => intakeOrders.some(order => order.orderId === id);
export const demoIntake = {
  channel: 'Support phone call',
  email: 'emma.carter@example.com',
  phone: '(415) 555-0199',
  summary: 'Emma called support after the delivery window passed. Sarah Chen took the call, logged EX-2048 against the order, and handles the resolution.',
  slaHours: 4,
};
export const slots = [
  {id: 'sat-am', label: 'Nov 14 · 9:00 AM–12:00 PM', capacity: 2},
  {id: 'mon-pm', label: 'Nov 16 · 1:00–4:00 PM', capacity: 4},
  {id: 'wed-am', label: 'Nov 18 · 8:00–11:00 AM', capacity: 3},
];
export const seedCase = (): ResolutionCase => ({
  id: CASE_ID, orderId: ORDER_ID, customer: 'Emma Carter', brand: 'Pottery Barn', issue: 'Delivery delay',
  openedAt: '2026-11-07T20:12:00.000Z', status: 'Open', priority: 'High', assigned: 'Sarah Chen',
  exceptionDetails: 'The carrier canceled Emma Carter’s original appointment after the item missed outbound staging.',
  audit: [{ id: 'opened', at: '2026-11-07T20:12:00.000Z', actor: 'Sarah Chen', title: 'Exception case opened', detail: 'Sarah recorded the missed delivery during Emma’s support call.' }],
});
export type Policy = PolicyReference & { text: string };
export const policies: Policy[] = [
  {policyId:'DELIVERY-001', title:'Delivery rescheduling', text:'For missed delivery windows, offer a confirmed available carrier slot after the warehouse release date. Confirm the new appointment before notifying the customer.'},
  {policyId:'DELIVERY-002', title:'Delivery delay communication', text:'Acknowledge the missed appointment and communicate the confirmed next step. Explain the delay using verified fulfillment information.'},
  {policyId:'CREDIT-001', title:'Goodwill credits', text:'An agent can issue a goodwill credit up to $50. Credits from $51 to $150 require supervisor approval. The maximum credit is $150.'},
  {policyId:'REFUND-001', title:'Refund eligibility', text:'A captured and undelivered order is eligible for refund. Full refunds require supervisor approval.'},
  {policyId:'REPLACE-001', title:'Item replacements', text:'Check unreserved sellable stock before authorizing a replacement. Replacements require supervisor approval.'},
  {policyId:'APPROVAL-001', title:'Supervisor authorization', text:'Supervisor approval is required for full refunds, replacements, credits over $50, and requests for manager review.'},
];
export const oms = {
  getOrder: async (orderId: string) => isDemoOrder(orderId) ? {
    orderId, placed: 'Nov 2, 2026', item: 'Toscana Extendable Dining Table', sku: 'PB-TSC-84-NAT',
    quantity: 1, total: 1899, payment: 'Captured', refundEligible: true, channel: 'Online',
  } : null,
  getInventory: async (sku: string) => sku === 'PB-TSC-84-NAT' ? {
    sku, reserved: 1, sellable: 7, location: 'West distribution center', status: 'Reserved',
  } : null,
  getWarehouse: async (orderId: string) => isDemoOrder(orderId) ? {
    status: 'Fulfillment delayed', facility: 'Reno, NV', release: 'Nov 9, 2026',
    fact: 'Outbound staging moved by 3 days after the Reno distribution center missed its dispatch cutoff.',
  } : null,
  getDelivery: async (orderId: string) => isDemoOrder(orderId) ? {
    status: 'Appointment missed', original: 'Nov 7 · 9:00 AM–12:00 PM',
    fact: 'The carrier canceled the original appointment because the item missed outbound staging.', slots,
  } : null,
  getPolicies: async () => policies,
};
export async function getContext(orderId: string, execution?: Workflow['execution']) {
  const [order, warehouse, delivery] = await Promise.all([oms.getOrder(orderId), oms.getWarehouse(orderId), oms.getDelivery(orderId)]);
  const inventory = order ? await oms.getInventory(order.sku) : null;
  const booked = slots.find(slot => slot.id === execution?.slotId);
  return {
    order: order && {...order, payment: execution?.refunded ? 'Refunded' : order.payment, refundEligible: order.refundEligible && !execution?.refunded, goodwillCredit: execution?.credit},
    inventory: inventory && {...inventory, sellable: inventory.sellable - Number(!!execution?.replacementReserved)}, warehouse,
    delivery: delivery && {...delivery, status: booked ? 'Rescheduled' : delivery.status, appointment: booked?.label,
      slots: delivery.slots.map(slot => ({...slot, capacity: slot.capacity - Number(slot.id === booked?.id)}))},
  };
}
export type Workspace = ResolutionCase & { intake: typeof demoIntake; policyDetails: Policy[]; context: Awaited<ReturnType<typeof getContext>> };

// The feature transaction stores these deterministic mock receipts. The stable reference
// represents the idempotency key that a real OMS endpoint would store on its side.
export const mockOperations = {
  async execute(input: ActionInput, key: string): Promise<NonNullable<Workflow['execution']>> {
    const reference = 'OMS-' + key.slice(0, 8).toUpperCase();
    switch (input.action) {
      case 'RESCHEDULE_DELIVERY':
        return {reference, slotId: input.slotId, summary: 'Delivery confirmed for ' + slots.find(slot => slot.id === input.slotId)?.label};
      case 'GOODWILL_CREDIT': return {reference, summary: '$' + input.amount + ' goodwill credit issued', credit: input.amount};
      case 'REPLACE_ITEM': return {reference, summary: 'Replacement reserved and submitted to fulfillment', replacementReserved: true};
      case 'REFUND_ORDER': return {reference, summary: 'Full refund of $1,899 submitted', refunded: true};
      case 'ESCALATE': throw new Error('Manager review is a decision and has no OMS operation');
    }
  },
  async notify(caseId: string, workflowId: string, text: string) {
    return {reference: 'MSG-' + caseId + '-' + workflowId.slice(0, 8), text};
  },
};
