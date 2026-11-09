import type { RequestHandler } from 'express';
import { commandSchema, intakeSchema, roleSchema } from '@oms/shared-schemas';
import { signSession } from '../middleware/auth.js';
import { commandCase, createCase, getCase, listQueue } from '../services/workspace.service.js';

export const demoSession: RequestHandler = (req, res) => {
  res.json(signSession(roleSchema.parse(req.body?.role)));
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
