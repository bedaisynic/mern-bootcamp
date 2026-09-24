// YOUR TASK — HTTP concerns only, same shape as workshops/controller.ts:
// parse + validate with a Zod schema from validation.ts, call one
// registrationsService method, send the response, all inside the
// try/catch that's already here (it's what turns a thrown NotFoundError /
// ConflictError / ZodError into the right status code — don't remove it).

import type { Request, Response } from "express";

import { sendErrorResponse } from "../lib/errors";
import { registrationsService } from "./service";
import {
  listRegistrationsQuerySchema,
  registrationIdParamSchema,
  createRegistrationBodySchema,
  cancelRegistrationBodySchema
} from "./validation";
// TODO: import the schemas you wrote in validation.ts

export const registrationsController = {
  async list(req: Request, res: Response) {
    try {
      // TODO:
      //   - parse req.query with listRegistrationsQuerySchema
      //   - call registrationsService.list({ workshopId })
      //   - res.json(...) the result

      const query = listRegistrationsQuerySchema.parse(req.query);
      const row = await registrationsService.list(query);
      res.json(row);
    } catch (err) {
      sendErrorResponse(err, res);
    }
  },

  async getById(req: Request, res: Response) {
    try {
      // TODO:
      //   - parse req.params with registrationIdParamSchema
      //   - call registrationsService.getById(id)
      //   - res.json(...) the result
      const { id } = registrationIdParamSchema.parse(req.params);
      const row = await registrationsService.getById(id);

      res.json(row);
    } catch (err) {
      sendErrorResponse(err, res);
    }
  },

  async create(req: Request, res: Response) {
    try {
      // TODO:
      //   - parse req.body with createRegistrationBodySchema
      //   - call registrationsService.create(body)
      //   - res.status(201).json(...) the result
      const body = createRegistrationBodySchema.parse(req.body);
      const row = await registrationsService.create(body);

      res.status(201).json(row);
    } catch (err) {
      sendErrorResponse(err, res);
    }
  },

  async cancel(req: Request, res: Response) {
    try {
      // TODO:
      //   - parse req.params with registrationIdParamSchema
      //   - parse req.body with cancelRegistrationBodySchema (this is what
      //     rejects a PATCH that isn't { status: "cancelled" } before your
      //     service even runs)
      //   - call registrationsService.cancel(id)
      //   - res.json(...) the result
      console.log("!!!!!!req.params", req.params);
      const { id } = registrationIdParamSchema.parse(req.params);

      cancelRegistrationBodySchema.parse(req.body);

      const result = await registrationsService.cancel(id);

      res.json(result);

    } catch (err) {
      sendErrorResponse(err, res);
    }
  },
};
