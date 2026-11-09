import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { afterAll, beforeAll, expect, it } from 'vitest';
import request from 'supertest';
import { actors } from '@oms/shared-types';
import type { Command } from '@oms/shared-schemas';
import { ORDER_ID } from '@oms/oms-mock-adapters';

let dir: string;
let bff: typeof import('../apps/bff/src/app.js')['app'];
let app: typeof import('../services/order-resolution-service/src/app.js')['app'];
let internalSecret: string;
const path = '/internal/cases/EX-2048';
beforeAll(async () => {
  dir = await mkdtemp(join(tmpdir(), 'oms-test-'));
  process.env.DEMO_DATA_DIR = dir;
  ({app: bff} = await import('../apps/bff/src/app.js'));
  ({app} = await import('../services/order-resolution-service/src/app.js'));
  internalSecret = (await import('@oms/server-kit')).env.internalSecret;
});
afterAll(async () => { if (dir) await rm(dir, {recursive: true, force: true}); });
it('issues demo sessions and rejects missing or invalid bearer tokens', async () => {
  await request(bff).get('/api/cases/EX-2048').expect(401);
  await request(bff).get('/api/cases/EX-2048').set('Authorization', 'Bearer invalid').expect(401);
  await request(bff).post('/api/session').send({role: 'invalid'}).expect(400);
  const {body} = await request(bff).post('/api/session').send({role: 'supervisor'}).expect(200);
  expect(body.actor).toEqual(actors.supervisor);
  expect(body.token.split('.')).toHaveLength(3);
});
it('deduplicates investigation results, enforces approval and serializes execution', async () => {
  const command = (body: Command, actor = actors.agent) => request(app).post(path + '/commands')
    .set('x-internal-secret', internalSecret).send({actor, command: body});
  await request(app).get(path).expect(401);
  await request(app).get('/internal/cases/unknown').set('x-internal-secret', internalSecret).expect(404);
  const {body: queued} = await command({type: 'investigate'}).expect(200);
  expect(queued.investigation.status).toBe('queued');
  const {outbox} = await import('../services/order-resolution-service/src/repositories/case.repository.js');
  expect(await outbox.pending()).toEqual([expect.objectContaining({topic: 'investigation.requested', correlationId: queued.investigation.id})]);
  const {graph} = await import('../services/ai-investigation-service/src/agents/investigation.graph.js');
  const {result} = await graph.invoke({orderId: ORDER_ID, issue: 'Delivery delay'});
  const event = {topic: 'investigation.completed', id: randomUUID(), caseId: 'EX-2048', correlationId: queued.investigation.id, at: new Date().toISOString(), data: result};
  for (let attempt = 0; attempt < 2; attempt++) {
    await request(app).post('/internal/events').set('x-internal-secret', internalSecret).send(event).expect(204);
  }
  await command({type: 'review'}).expect(200);
  const {body: review} = await command({type: 'select', input: {action: 'ESCALATE', reason: 'Need manager input on this case'}}).expect(200);
  const {body: reviewed} = await command({type: 'approve', workflowId: review.workflow.id, input: {
    decision: 'approved', note: 'Proceed with a resolution after reviewing the carrier delay',
  }}, actors.supervisor).expect(200);
  expect(reviewed.assigned).toBe(actors.agent.name);
  expect(reviewed.status).toBe('Open');
  expect(reviewed.workflow.status).toBe('escalated');
  await command({type: 'execute', workflowId: review.workflow.id}).expect(409);
  const {body: pending} = await command({type: 'select', input: {action: 'GOODWILL_CREDIT', amount: 75, reason: 'Missed appointment'}}).expect(200);
  const workflowId = pending.workflow.id;
  expect(pending.workflow.status).toBe('pending');
  await command({type: 'execute', workflowId}).expect(409);
  const approve = {type: 'approve', workflowId, input: {decision: 'approved', note: 'Verified delay'}} as const;
  await command(approve).expect(403);
  await command({...approve, workflowId: randomUUID()}, actors.supervisor).expect(409);
  await command(approve, actors.supervisor).expect(200);
  const [first, second] = await Promise.all([command({type: 'execute', workflowId}).expect(200), command({type: 'execute', workflowId}).expect(200)]);
  expect(first.body.workflow.execution).toEqual(second.body.workflow.execution);
  expect(second.body.audit.filter((entry: {title: string}) => entry.title === 'Resolution executed')).toHaveLength(1);
  expect(second.body.audit.filter((entry: {title: string}) => entry.title === 'AI investigation completed')).toHaveLength(1);
  await command({type: 'close'}).expect(409);
  expect((await outbox.pending()).filter(item => item.topic === 'resolution.completed')).toHaveLength(1);
});

it('registers a single case per demo order and enforces agent ownership', async () => {
  const register = (actor = actors.agent, notes = 'Customer reported a missed delivery.', email = 'nora.confirmed@example.com') => request(app)
    .post('/internal/cases').set('x-internal-secret', internalSecret).send({actor, input: {orderId: 'PB-10246', customerName: 'Nora W.', email, notes}});
  await register(actors.supervisor).expect(403);
  await register(actors.agent, 'Short').expect(400);
  await register(actors.agent, 'Customer reported a missed delivery.', 'invalid-email').expect(400);
  const results = await Promise.all([register(), register()]);
  expect(results.map(result => result.status).sort()).toEqual([200, 201]);
  expect(results.map(result => result.body.id)).toEqual(['EX-2049', 'EX-2049']);
  const {body: cases} = await request(app).get('/internal/cases').set('x-internal-secret', internalSecret).expect(200);
  expect(cases).toContainEqual(expect.objectContaining({id: 'EX-2049', assigned: actors.agent.name, customer: 'Nora W.', intake: expect.objectContaining({email: 'nora.confirmed@example.com'})}));
  await request(app).post('/internal/cases/EX-2049/commands').set('x-internal-secret', internalSecret)
    .send({actor: {...actors.agent, id: 'different', name: 'Another agent'}, command: {type: 'investigate'}}).expect(403);
});


it('lists seeded cases at different stages and persists an approval on a seeded case', async () => {
  const get = (path: string) => request(app).get(path).set('x-internal-secret', internalSecret);
  const queuePath = '/internal/cases';
  const {body: before} = await get(queuePath).expect(200);
  expect(before).toEqual(expect.arrayContaining([
    expect.objectContaining({id: 'EX-2050', orderId: 'PB-10247', status: 'Open'}),
    expect.objectContaining({id: 'EX-2051', workflow: expect.objectContaining({status: 'pending'})}),
    expect.objectContaining({id: 'EX-2052', status: 'Resolved'}),
    expect.objectContaining({id: 'EX-2053', status: 'Open'}),
    expect.objectContaining({id: 'EX-2054', investigation: expect.objectContaining({status: 'completed', reviewed: false})}),
    expect.objectContaining({id: 'EX-2055', workflow: expect.objectContaining({status: 'approved'})}),
    expect.objectContaining({id: 'EX-2056', status: 'Closed', response: expect.objectContaining({sentAt: expect.any(String)})}),
  ]));
  const {body: pending} = await get(queuePath + '/EX-2051').expect(200);
  await request(app).post(queuePath + '/EX-2051/commands').set('x-internal-secret', internalSecret).send({
    actor: actors.supervisor,
    command: {type: 'approve', workflowId: pending.workflow.id, input: {decision: 'approved', note: 'Confirmed missed delivery'}},
  }).expect(200);
  const {body: after} = await get(queuePath).expect(200);
  expect(after.filter((record: {id: string}) => record.id === 'EX-2051')).toEqual([
    expect.objectContaining({assigned: actors.agent.name, workflow: expect.objectContaining({status: 'approved'})}),
  ]);
  const {body: resolved} = await get(queuePath + '/EX-2052').expect(200);
  expect(resolved.context.delivery.status).toBe('Rescheduled');
});
