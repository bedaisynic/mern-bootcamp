import { EntitySchema } from 'typeorm';
import { postgresDataSource } from '@oms/server-kit/postgres';
import type { FeatureEvent } from '@oms/shared-types';
import { InvestigationBaseline1794009600000 } from './baseline.migration.js';

export const Investigation = new EntitySchema<{id: string; caseId: string; outcome: FeatureEvent}>({
  name: 'Investigation', tableName: 'Investigation',
  columns: {
    id: {type: 'text', primary: true},
    caseId: {type: 'text'},
    outcome: {type: 'jsonb'},
  },
});

export const PolicyDocument = new EntitySchema<{id: string; title: string; text: string}>({
  name: 'PolicyDocument', tableName: 'PolicyDocument',
  columns: {
    id: {type: 'text', primary: true},
    title: {type: 'text'},
    text: {type: 'text'},
  },
});

export const db = postgresDataSource('investigation', [Investigation, PolicyDocument], [InvestigationBaseline1794009600000]);
