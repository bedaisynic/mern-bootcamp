import type { RequestHandler } from 'express';
import { actorSchema, addressVerificationSchema, commandSchema, eventSchema, intakeSchema, orderLookupSchema } from '@oms/shared-schemas';
import { searchIntakeOrders, verifyIntakeOrder } from '../services/intake-order.service.js';
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

export const searchOrders: RequestHandler = async (req, res) => {
  res.json(await searchIntakeOrders(orderLookupSchema.parse(req.query.q)));
};
export const verifyOrderAddress: RequestHandler<{id: string}> = async (req, res) => {
  res.json(await verifyIntakeOrder(req.params.id, addressVerificationSchema.parse(req.body)));
};
