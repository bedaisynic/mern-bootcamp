import { readFileSync } from 'node:fs';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yaml';

const PORT = process.env.DOCS_PORT || 4001;

const spec = YAML.parse(readFileSync(new URL('./openapi.yaml', import.meta.url), 'utf8'));

const app = express();
app.use('/', swaggerUi.serve, swaggerUi.setup(spec, { customSiteTitle: 'Help Desk API Docs' }));

app.listen(PORT, () => {
  console.log(`API docs on http://localhost:${PORT}`);
});
