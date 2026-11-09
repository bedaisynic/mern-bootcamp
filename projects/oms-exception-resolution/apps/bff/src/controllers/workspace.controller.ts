import type { RequestHandler } from 'express';
import { addressVerificationSchema, commandSchema, intakeSchema, orderLookupSchema, roleSchema } from '@oms/shared-schemas';
import { HttpError } from '@oms/server-kit';
import { publicAuthConfig, signSession } from '../middleware/auth.js';
import { commandCase, createCase, findOrders, getCase, listQueue, verifyOrder } from '../services/workspace.service.js';

export const demoSession: RequestHandler = (req, res) => {
  res.set('Cache-Control', 'no-store').json(signSession(roleSchema.parse(req.body?.role)));
};
export const workspace: RequestHandler<{id: string}> = async (req, res) => {
  res.json(await getCase(req.params.id));
};
export const runCommand: RequestHandler<{id: string}> = async (req, res) => {
  res.json(await commandCase(req.params.id, res.locals.actor, commandSchema.parse(req.body)));
};

export const exceptionQueue: RequestHandler = async (_req, res) => {
  res.json(await listQueue());
};
export const registerCall: RequestHandler = async (req, res) => {
  const result = await createCase(res.locals.actor, intakeSchema.parse(req.body));
  res.status(result.created ? 201 : 200).json(result);
};

export const requireAgent: RequestHandler = (_req, res, next) => {
  if (res.locals.actor.role !== 'agent') throw new HttpError(403, 'Only an agent can register a call');
  next();
};
export const orderSearch: RequestHandler = async (req, res) => {
  res.json(await findOrders(orderLookupSchema.parse(req.query.q)));
};
export const addressCheck: RequestHandler<{id: string}> = async (req, res) => {
  res.json(await verifyOrder(req.params.id, addressVerificationSchema.parse(req.body)));
};

export const authConfig: RequestHandler = (_req, res) => {
  res.set('Cache-Control', 'no-store').json(publicAuthConfig);
};
export const authenticatedSession: RequestHandler = (_req, res) => {
  res.set('Cache-Control', 'no-store').json({actor: res.locals.actor});
};
