import { migrateDatabase } from '@oms/server-kit/postgres';
import { db } from './database.js';

await migrateDatabase(db, 'resolution');
