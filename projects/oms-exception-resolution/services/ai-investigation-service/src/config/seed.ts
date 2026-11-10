import { db } from './database.js';
import { seedPolicies } from '../services/rag.service.js';

if (!db) throw new Error('Policy indexing requires PostgreSQL');
await db.initialize();
try {
  await seedPolicies();
  console.log('Policy chunks indexed.');
} finally {
  await db.destroy();
}
