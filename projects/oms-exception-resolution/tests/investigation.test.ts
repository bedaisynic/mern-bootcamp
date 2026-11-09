import { describe, expect, it } from 'vitest';
import { investigationSchema } from '@oms/shared-schemas';
import { ORDER_ID, policies } from '@oms/oms-mock-adapters';
import { graph } from '../services/ai-investigation-service/src/agents/investigation.graph.js';
import { toolsFor } from '../services/ai-investigation-service/src/tools/oms.tools.js';
import { validateAction } from '../services/order-resolution-service/src/services/validation.service.js';

describe('investigation grounding', () => {
  it('returns validated evidence and seeded policy references', async () => {
    const {result} = await graph.invoke({orderId: ORDER_ID, issue: 'Delivery delay'});
    expect(investigationSchema.parse(result)).toEqual(result);
    expect(result.rootCause).toBe('Warehouse fulfillment delay');
    expect(result.evidence[0].description).toContain('3 days');
    expect(result.recommendedActions[0].action).toBe('RESCHEDULE_DELIVERY');
    expect(result.policyReferences.every(reference => policies.some(policy => policy.policyId === reference.policyId && policy.title === reference.title))).toBe(true);
  });
  it('routes missing evidence to manual review', async () => {
    const {result} = await graph.invoke({orderId: 'unknown', issue: 'Delivery delay'});
    expect(result.recommendedActions.map(item => item.action)).toEqual(['ESCALATE']);
    expect(result.evidence).toEqual([]);
  });
  it('binds read-only tools to the case order', async () => {
    const [order, inventory, warehouse, delivery] = toolsFor(ORDER_ID);
    expect(await order.invoke({})).toMatchObject({orderId: ORDER_ID});
    expect(await inventory.invoke({})).toMatchObject({reserved: 1});
    expect(await warehouse.invoke({})).toMatchObject({status: 'Fulfillment delayed'});
    expect(await delivery.invoke({})).toMatchObject({status: 'Appointment missed'});
  });
});
describe('deterministic business rules', () => {
  it.each([[50, false], [51, true], [150, true]])('validates a $%s credit', async (amount, needsApproval) => {
    expect(await validateAction(ORDER_ID, {action: 'GOODWILL_CREDIT', amount, reason: 'Missed appointment'})).toMatchObject({needsApproval});
  });
  it('rejects invalid carrier capacity and credits over the maximum', async () => {
    await expect(validateAction(ORDER_ID, {action: 'RESCHEDULE_DELIVERY', slotId: 'invalid', reason: 'Missed appointment'})).rejects.toThrow('no longer available');
    await expect(validateAction(ORDER_ID, {action: 'GOODWILL_CREDIT', amount: 151, reason: 'Missed appointment'})).rejects.toThrow('between $1 and $150');
  });
});

it('projects the same simulated reschedule receipt into the appointment and available capacity', async () => {
  const {getContext, mockOperations} = await import('@oms/oms-mock-adapters');
  const input = {action: 'RESCHEDULE_DELIVERY', slotId: 'sat-am', reason: 'Missed appointment'} as const;
  const receipt = await mockOperations.execute(input, 'abcdefgh-demo-key');
  expect(await mockOperations.execute(input, 'abcdefgh-demo-key')).toEqual(receipt);
  const initial = await getContext(ORDER_ID);
  const updated = await getContext(ORDER_ID, receipt);
  expect(updated.delivery?.status).toBe('Rescheduled');
  expect(updated.delivery?.appointment).toBe(initial.delivery?.slots[0].label);
  expect(updated.delivery?.slots[0].capacity).toBe(initial.delivery!.slots[0].capacity - 1);
});
