import type { RequestHandler } from 'express';
import { eventSchema } from '@oms/shared-schemas';
import { receiveRequest } from '../services/investigation.service.js';
import { draftInput, draftResponse } from '../services/response-drafting.service.js';

export const postEvent: RequestHandler = async (req, res) => {
  await receiveRequest(eventSchema.parse(req.body));
  res.sendStatus(204);
};
export const postDraft: RequestHandler = async (req, res) => {
  res.json(await draftResponse(draftInput.parse(req.body)));
};
