import { readFileSync } from 'node:fs';
import swaggerUi from 'swagger-ui-express';
import { appFor, errorHandler, projectRoot } from '@oms/server-kit';
import { router } from './routes/workspace.routes.js';

export const app = appFor('bff');
const spec = JSON.parse(readFileSync(new URL('docs/openapi.json', projectRoot), 'utf8'));
app.get('/api/openapi.json', (_req, res) => res.json(spec));
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(spec));
app.use('/api', router);
app.use(errorHandler);
