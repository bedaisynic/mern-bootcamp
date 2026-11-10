import { app } from './app.js';
import { db } from './config/database.js';
import { startEvents } from '@oms/kafka';
import { env, log } from '@oms/server-kit';
import { outbox } from './repositories/case.repository.js';
import { receiveInvestigation } from './services/resolution.service.js';
await db?.initialize();
await startEvents({service: 'order-resolution', destination: env.ai, topics: ['investigation.completed', 'investigation.failed'], receive: receiveInvestigation, outbox});
app.listen(Number(process.env.PORT ?? 4101), process.env.HOST ?? '127.0.0.1', () => log.info('Resolution service listening'));
