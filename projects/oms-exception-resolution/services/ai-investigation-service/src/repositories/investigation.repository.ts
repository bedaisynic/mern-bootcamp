import { PrismaClient, Prisma } from '../generated/index.js';
import { JsonStore, env } from '@oms/server-kit';
import type { FeatureEvent } from '@oms/shared-types';

type State = {outcomes: Record<string, FeatureEvent>; outbox: FeatureEvent[]};
const store = new JsonStore<State>('investigation', () => ({outcomes: {}, outbox: []}));
const db = env.database ? new PrismaClient() : undefined;
export async function hasResult(id: string) {
  if (!db) return Boolean((await store.read()).outcomes[id]);
  return Boolean(await db.investigation.findUnique({where: {id}, select: {id: true}}));
}
export async function saveOutcome(sourceId: string, event: FeatureEvent) {
  if (!db) return store.update(state => {
    if (state.outcomes[event.correlationId]) return;
    state.outcomes[event.correlationId] = event;
    state.outbox.push(event);
  });
  await db.$transaction(async tx => {
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${event.correlationId}))`;
    if (await tx.investigation.findUnique({where: {id: event.correlationId}})) return;
    const payload = event as Prisma.InputJsonValue;
    await tx.investigation.create({data: {id: event.correlationId, caseId: event.caseId, outcome: payload}});
    await tx.processedEvent.create({data: {id: sourceId}});
    await tx.outboxEvent.create({data: {id: event.id, payload}});
  });
}
export const outbox = {
  async pending() {
    if (!db) return (await store.read()).outbox;
    return (await db.outboxEvent.findMany({where: {publishedAt: null}, orderBy: {createdAt: 'asc'}, take: 25}))
      .map(row => row.payload as FeatureEvent);
  },
  async published(id: string) {
    if (!db) return store.update(state => { state.outbox = state.outbox.filter(event => event.id !== id); });
    await db.outboxEvent.update({where: {id}, data: {publishedAt: new Date()}});
  },
};
