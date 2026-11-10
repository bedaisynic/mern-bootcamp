import { EntitySchema } from 'typeorm';
import { postgresDataSource } from '@oms/server-kit/postgres';
import type { ResolutionCase } from '@oms/shared-types';
import { ResolutionBaseline1794009600000 } from './baseline.migration.js';

export const CaseSnapshot = new EntitySchema<{id: string; snapshot: ResolutionCase; revision: number}>({
  name: 'ResolutionCase', tableName: 'ResolutionCase',
  columns: {
    id: {type: 'text', primary: true},
    snapshot: {type: 'jsonb'},
    revision: {type: 'integer', default: 0},
  },
});

export const db = postgresDataSource('resolution', [CaseSnapshot], [ResolutionBaseline1794009600000]);
