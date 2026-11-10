import { DataSource, EntitySchema, type DataSourceOptions } from 'typeorm';
import type { FeatureEvent } from '@oms/shared-types';
import { env } from './index.js';

type ServiceSchema = 'resolution' | 'investigation';
type PostgresOptions = Extract<DataSourceOptions, {type: 'postgres'}>;

export const OutboxEvent = new EntitySchema<{
  id: string; payload: FeatureEvent; createdAt: Date; publishedAt: Date | null;
}>({
  name: 'OutboxEvent', tableName: 'OutboxEvent',
  columns: {
    id: {type: 'text', primary: true},
    payload: {type: 'jsonb'},
    createdAt: {type: 'timestamp', precision: 3, default: () => 'CURRENT_TIMESTAMP'},
    publishedAt: {type: 'timestamp', precision: 3, nullable: true},
  },
  indices: [{name: 'OutboxEvent_publishedAt_createdAt_idx', columns: ['publishedAt', 'createdAt']}],
});

export const ProcessedEvent = new EntitySchema<{id: string; processedAt: Date}>({
  name: 'ProcessedEvent', tableName: 'ProcessedEvent',
  columns: {
    id: {type: 'text', primary: true},
    processedAt: {type: 'timestamp', precision: 3, default: () => 'CURRENT_TIMESTAMP'},
  },
});

export function postgresDataSource(schema: ServiceSchema, entities: EntitySchema[], migrations: PostgresOptions['migrations']) {
  if (!env.database) return undefined;
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('STORAGE_MODE=postgres requires DATABASE_URL');
  return new DataSource({
    type: 'postgres', url, schema, entities: [OutboxEvent, ProcessedEvent, ...entities], migrations,
    migrationsTableName: 'typeorm_migrations', synchronize: false, installExtensions: false,
  });
}

export async function migrateDatabase(db: DataSource | undefined, schema: ServiceSchema) {
  if (!db) throw new Error('Migrations require STORAGE_MODE=postgres and DATABASE_URL');
  await db.initialize();
  try {
    await db.query('CREATE SCHEMA IF NOT EXISTS "' + schema + '"');
    await db.runMigrations();
  } finally {
    await db.destroy();
  }
}
