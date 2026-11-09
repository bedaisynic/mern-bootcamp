import { afterEach, expect, it, vi } from 'vitest';
import { env } from '@oms/server-kit';
import { getContext, ORDER_ID, policies } from '@oms/oms-mock-adapters';
import { analyze, manualReview } from '../services/ai-investigation-service/src/agents/investigation.nodes.js';

const {create} = vi.hoisted(() => ({create: vi.fn()}));
vi.mock('../services/ai-investigation-service/src/integrations/openai.js', () => ({
  model: () => 'test-model',
  openai: () => ({chat: {completions: {create}}}),
}));
const mode = env.aiMode;
afterEach(() => {
  env.aiMode = mode;
  create.mockReset();
});
it('runs the case-bound tool, preserves real evidence and drops fabricated policy references', async () => {
  env.aiMode = 'live';
  create.mockResolvedValueOnce({choices: [{message: {role: 'assistant', tool_calls: [
    {id: 'call-1', type: 'function', function: {name: 'get_warehouse', arguments: '{}'}},
  ]}}]}).mockResolvedValueOnce({choices: [{message: {content: JSON.stringify({
    cause: 'warehouse_delay', actions: ['RESCHEDULE_DELIVERY', 'GOODWILL_CREDIT'],
    policyIds: ['DELIVERY-001', 'FAKE-POLICY'],
  })}}]});
  const state = {...await getContext(ORDER_ID), orderId: ORDER_ID, issue: 'Delivery delay', policies, result: manualReview};
  const output = await analyze(state);
  expect(create.mock.calls[1][0].messages).toContainEqual(expect.objectContaining({
    role: 'tool', tool_call_id: 'call-1', content: expect.stringContaining('Reno'),
  }));
  expect(output.evidence[0].description).toBe(state.warehouse?.fact);
  expect(output.policyReferences.map(ref => ref.policyId)).toEqual(['DELIVERY-001']);
  expect(output.recommendedActions.map(item => item.action)).toEqual(['RESCHEDULE_DELIVERY']);
});
