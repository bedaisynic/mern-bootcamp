import { app } from './app.js';
import { db } from './config/database.js';
import { startEvents } from '@oms/kafka';
import { env, log } from '@oms/server-kit';
import { outbox } from './repositories/investigation.repository.js';
import { receiveRequest } from './services/investigation.service.js';

if (env.aiMode === 'live' && (!env.database || !process.env.OPENAI_API_KEY)) {
  throw new Error('AI_MODE=live requires STORAGE_MODE=postgres and OPENAI_API_KEY');
}
await db?.initialize();
await startEvents({service: 'ai-investigation', destination: env.resolution, topics: ['investigation.requested'], receive: receiveRequest, outbox});
app.listen(Number(process.env.PORT ?? 4102), process.env.HOST ?? '127.0.0.1', () => log.info('Investigation service listening'));
