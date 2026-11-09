import { appFor, errorHandler } from '@oms/server-kit';
import { router } from './routes/investigation.routes.js';
export const app = appFor('ai-investigation');
app.use('/internal', router);
app.use(errorHandler);
