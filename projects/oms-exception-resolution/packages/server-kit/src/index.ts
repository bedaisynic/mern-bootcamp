import express, { type Express, type ErrorRequestHandler, type RequestHandler } from 'express';
import { randomUUID, timingSafeEqual } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import { config } from 'dotenv';
import pino from 'pino';
import { ZodError } from 'zod';

export const projectRoot = new URL('../../../', import.meta.url);
config({path: new URL('.env', projectRoot), quiet: true});
export const log = pino({level: process.env.LOG_LEVEL ?? 'info'});
export const env = {
  resolution: process.env.RESOLUTION_URL ?? 'http://127.0.0.1:4101',
  ai: process.env.AI_URL ?? 'http://127.0.0.1:4102',
  bff: process.env.BFF_URL ?? 'http://127.0.0.1:4100',
  aiMode: process.env.AI_MODE ?? 'mock',
  kafka: process.env.EVENT_MODE === 'kafka',
  database: process.env.STORAGE_MODE === 'postgres',
  demoAuth: process.env.DEMO_AUTH !== 'false',
  internalSecret: process.env.INTERNAL_SECRET ?? 'local-training-internal-secret',
  jwtSecret: process.env.JWT_SECRET ?? 'local-training-jwt-secret',
};
export class HttpError extends Error {
  constructor(public readonly status: number, message: string) { super(message); }
}
export function appFor(service: string): Express {
  const app = express();
  app.disable('x-powered-by');
  app.use(express.json({limit: '32kb'}));
  app.get('/health', (_req, res) => res.json({service, status: 'ok'}));
  return app;
}
export const errorHandler: ErrorRequestHandler = (error, req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({error: error.issues[0]?.message ?? 'Invalid request', issues: error.issues});
  } else if (error instanceof HttpError) {
    res.status(error.status).json({error: error.message});
  } else {
    log.error({err: error, method: req.method, path: req.path}, 'Request failed');
    res.status(500).json({error: 'The request could not be completed. Try again.'});
  }
};
export const internalOnly: RequestHandler = (req, _res, next) => {
  const expected = Buffer.from(env.internalSecret);
  const actual = Buffer.from(req.get('x-internal-secret') ?? '');
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    throw new HttpError(401, 'Internal authentication required');
  }
  next();
};
export async function internalRequest<T>(url: string, body?: unknown): Promise<T> {
  const response = await fetch(url, {
    method: body === undefined ? 'GET' : 'POST',
    signal: AbortSignal.timeout(30_000),
    headers: {'x-internal-secret': env.internalSecret, 'content-type': 'application/json'},
    body: body === undefined ? undefined : JSON.stringify(body),
  }).catch(() => { throw new HttpError(503, 'A workspace service is temporarily unavailable'); });
  if (response.status === 204) return undefined as T;
  const data = await response.json();
  if (!response.ok) throw new HttpError(response.status, data.error ?? 'Service request failed');
  return data;
}
export class JsonStore<T> {
  private queue = Promise.resolve();
  private readonly path: string;
  constructor(name: string, private readonly initial: () => T) {
    this.path = fileURLToPath(new URL(name + '.json', process.env.DEMO_DATA_DIR
      ? new URL('file://' + process.env.DEMO_DATA_DIR.replace(/\/$/, '') + '/')
      : new URL('.demo/', projectRoot)));
  }
  async read(): Promise<T> {
    try { return JSON.parse(await readFile(this.path, 'utf8')) as T; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      return this.initial();
    }
  }
  update<R>(change: (data: T) => Promise<R> | R): Promise<R> {
    const operation = this.queue.then(async () => {
      const state = await this.read();
      const result = await change(state);
      await mkdir(dirname(this.path), {recursive: true});
      const temporary = this.path + '.' + randomUUID();
      await writeFile(temporary, JSON.stringify(state, null, 2));
      await rename(temporary, this.path);
      return result;
    });
    this.queue = operation.then(() => undefined, () => undefined);
    return operation;
  }
}
