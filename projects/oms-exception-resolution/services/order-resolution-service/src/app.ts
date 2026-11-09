import { appFor, errorHandler } from '@oms/server-kit';
import { router } from './routes/resolution.routes.js';
export const app = appFor('order-resolution');
app.use('/internal', router);
app.use(errorHandler);
