import { IsNull } from 'typeorm';
import { OutboxEvent, ProcessedEvent } from '@oms/server-kit/postgres';
import { CaseSnapshot, db } from '../config/database.js';
import { HttpError, JsonStore } from '@oms/server-kit';
import { CASE_ID, seedCase, seedCases } from '@oms/oms-mock-adapters';
import type { FeatureEvent, ResolutionCase } from '@oms/shared-types';

type State = { record: ResolutionCase; registrations?: Record<string, ResolutionCase>; outbox: FeatureEvent[]; processed: string[] };
type Change = (record: ResolutionCase, emit: (event: FeatureEvent) => void) => Promise<void> | void;
const store = new JsonStore<State>('resolution', () => ({record: seedCase(), outbox: [], processed: []}));
const seedById = new Map(seedCases().map(record => [record.id, record]));

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
function databaseCase(id: string, snapshot?: ResolutionCase) {
  return requireCase(snapshot ?? structuredClone(seedById.get(id)));
}
export async function readCase(id: string): Promise<ResolutionCase> {
  if (!db) return fileCase(await store.read(), id);
  const result = await db.getRepository(CaseSnapshot).findOneBy({id});
  return databaseCase(id, result?.snapshot);
}
export async function listCases() {
  const records = new Map(seedCases().map(record => [record.id, record]));
  if (!db) {
    const state = await store.read();
    for (const record of [state.record, ...Object.values(state.registrations ?? {})]) records.set(record.id, record);
  } else {
    for (const row of await db.getRepository(CaseSnapshot).find()) records.set(row.id, databaseCase(row.id, row.snapshot));
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
  const inserted = await db.createQueryBuilder().insert().into(CaseSnapshot)
    .values({id: record.id, snapshot: record}).orIgnore().returning('id').execute();
  return {record: await readCase(record.id), created: inserted.raw.length === 1};
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
  return db.transaction(async tx => {
    // The per-case lock covers read/validate/write. The outbox commits with the state.
    await tx.query("SET LOCAL statement_timeout = '35s'");
    await tx.query('SELECT pg_advisory_xact_lock(hashtext($1))', [id]);
    const cases = tx.getRepository(CaseSnapshot);
    const existing = await cases.findOneBy({id});
    const record = databaseCase(id, existing?.snapshot);
    if (eventId && await tx.existsBy(ProcessedEvent, {id: eventId})) return record;
    const events: FeatureEvent[] = [];
    await change(record, event => events.push(event));
    if (existing) {
      await cases.update({id}, {snapshot: record, revision: () => '"revision" + 1'});
    } else {
      await cases.insert({id, snapshot: record});
    }
    if (events.length) await tx.insert(OutboxEvent, events.map(event => ({id: event.id, payload: event})));
    if (eventId) await tx.insert(ProcessedEvent, {id: eventId});
    return record;
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
