import { IsNull } from 'typeorm';
import { OutboxEvent, ProcessedEvent } from '@oms/server-kit/postgres';
import { Investigation, db } from '../config/database.js';
import { JsonStore } from '@oms/server-kit';
import type { FeatureEvent } from '@oms/shared-types';

type State = {outcomes: Record<string, FeatureEvent>; outbox: FeatureEvent[]};
const store = new JsonStore<State>('investigation', () => ({outcomes: {}, outbox: []}));
export async function hasResult(id: string) {
  if (!db) return Boolean((await store.read()).outcomes[id]);
  return db.getRepository(Investigation).existsBy({id});
}
export async function saveOutcome(sourceId: string, event: FeatureEvent) {
  if (!db) return store.update(state => {
    if (state.outcomes[event.correlationId]) return;
    state.outcomes[event.correlationId] = event;
    state.outbox.push(event);
  });
  await db.transaction(async tx => {
    await tx.query('SELECT pg_advisory_xact_lock(hashtext($1))', [event.correlationId]);
    if (await tx.existsBy(Investigation, {id: event.correlationId})) return;
    await tx.insert(Investigation, {id: event.correlationId, caseId: event.caseId, outcome: event});
    await tx.insert(ProcessedEvent, {id: sourceId});
    await tx.insert(OutboxEvent, {id: event.id, payload: event});
  });
}
export const outbox = {
  async pending() {
    if (!db) return (await store.read()).outbox;
    return (await db.getRepository(OutboxEvent).find({where: {publishedAt: IsNull()}, order: {createdAt: 'ASC'}, take: 25}))
      .map(row => row.payload);
  },
  async published(id: string) {
    if (!db) return store.update(state => { state.outbox = state.outbox.filter(event => event.id !== id); });
    await db.getRepository(OutboxEvent).update({id}, {publishedAt: new Date()});
  },
};
