import { log } from '@oms/server-kit';
import { app } from './app.js';
app.listen(Number(process.env.PORT ?? 4100), process.env.HOST ?? '127.0.0.1', () => log.info('BFF listening'));
