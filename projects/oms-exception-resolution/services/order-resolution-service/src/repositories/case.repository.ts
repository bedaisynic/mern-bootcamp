import { PrismaClient, Prisma } from '../generated/index.js';
import { HttpError, JsonStore, env } from '@oms/server-kit';
import { CASE_ID, seedCase, seedCases } from '@oms/oms-mock-adapters';
import type { FeatureEvent, ResolutionCase } from '@oms/shared-types';

type State = { record: ResolutionCase; registrations?: Record<string, ResolutionCase>; outbox: FeatureEvent[]; processed: string[] };
type Change = (record: ResolutionCase, emit: (event: FeatureEvent) => void) => Promise<void> | void;
const store = new JsonStore<State>('resolution', () => ({record: seedCase(), outbox: [], processed: []}));
const db = env.database ? new PrismaClient() : undefined;
const seedById = new Map(seedCases().map(record => [record.id, record]));
const json = (value: unknown) => value as Prisma.InputJsonValue;

function requireCase(record: ResolutionCase | undefined) {
  if (!record) throw new HttpError(404, 'Exception case was not found');
  return record;
}
function fileCase(state: State, id: string) {
  if (id === CASE_ID) return state.record;
  const registrations = state.registrations;
  const stored = registrations && Object.hasOwn(registrations, id) ? registrations[id] : undefined;
  return requireCase(stored ?? structuredClone(seedById.get(id)));
}
function databaseCase(id: string, snapshot?: Prisma.JsonValue) {
  return requireCase((snapshot as ResolutionCase | undefined) ?? structuredClone(seedById.get(id)));
}
export async function readCase(id: string): Promise<ResolutionCase> {
  if (!db) return fileCase(await store.read(), id);
  const result = await db.resolutionCase.findUnique({where: {id}});
  return databaseCase(id, result?.snapshot);
}
export async function listCases() {
  const records = new Map(seedCases().map(record => [record.id, record]));
  if (!db) {
    const state = await store.read();
    for (const record of [state.record, ...Object.values(state.registrations ?? {})]) records.set(record.id, record);
  } else {
    for (const row of await db.resolutionCase.findMany()) records.set(row.id, databaseCase(row.id, row.snapshot));
  }
  return [...records.values()];
}
export async function registerCase(record: ResolutionCase) {
  if (seedById.has(record.id)) return {record: await readCase(record.id), created: false};
  if (!db) return store.update(state => {
    const registrations = state.registrations ??= {};
    const existing = registrations[record.id];
    if (existing) return {record: existing, created: false};
    registrations[record.id] = record;
    return {record, created: true};
  });
  const {count} = await db.resolutionCase.createMany({
    data: [{id: record.id, snapshot: json(record)}], skipDuplicates: true,
  });
  return {record: await readCase(record.id), created: count === 1};
}
export async function changeCase(id: string, change: Change, eventId?: string): Promise<ResolutionCase> {
  if (!db) return store.update(async state => {
    const record = fileCase(state, id);
    if (eventId && state.processed.includes(eventId)) return record;
    await change(record, event => state.outbox.push(event));
    if (id !== CASE_ID) (state.registrations ??= {})[id] = record;
    if (eventId) state.processed.push(eventId);
    return record;
  });
  return db.$transaction(async tx => {
    // The per-case lock covers read/validate/write and prevents competing actions
    // from operating on the same snapshot. The outbox is committed with the state.
    await tx.$executeRaw`SELECT pg_advisory_xact_lock(hashtext(${id}))`;
    const existing = await tx.resolutionCase.findUnique({where: {id}});
    const record = databaseCase(id, existing?.snapshot);
    if (eventId && await tx.processedEvent.findUnique({where: {id: eventId}})) return record;
    const events: FeatureEvent[] = [];
    await change(record, event => events.push(event));
    await tx.resolutionCase.upsert({
      where: {id}, create: {id, snapshot: json(record)},
      update: {snapshot: json(record), revision: {increment: 1}},
    });
    if (events.length) await tx.outboxEvent.createMany({data: events.map(event => ({id: event.id, payload: json(event)}))});
    if (eventId) await tx.processedEvent.create({data: {id: eventId}});
    return record;
  }, {timeout: 35_000});
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
