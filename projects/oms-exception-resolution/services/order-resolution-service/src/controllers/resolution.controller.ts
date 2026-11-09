import type { RequestHandler } from 'express';
import { actorSchema, commandSchema, eventSchema, intakeSchema } from '@oms/shared-schemas';
import { applyCommand, queue, receiveInvestigation, registerCall, workspace } from '../services/resolution.service.js';

export const getWorkspace: RequestHandler<{id: string}> = async (req, res) => {
  res.json(await workspace(req.params.id));
};
export const postCommand: RequestHandler<{id: string}> = async (req, res) => {
  res.json(await applyCommand(req.params.id, actorSchema.parse(req.body.actor), commandSchema.parse(req.body.command)));
};
export const postEvent: RequestHandler = async (req, res) => {
  await receiveInvestigation(eventSchema.parse(req.body));
  res.sendStatus(204);
};

export const getQueue: RequestHandler = async (_req, res) => {
  res.json(await queue());
};
export const postRegistration: RequestHandler = async (req, res) => {
  const result = await registerCall(actorSchema.parse(req.body.actor), intakeSchema.parse(req.body.input));
  res.status(result.created ? 201 : 200).json(result);
};
