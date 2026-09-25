import type { NextFunction, Request, Response } from "express";

import { productsService } from "./service";
import {
  createProductBodySchema,
  listProductsQuerySchema,
  productIdParamSchema,
  updateProductBodySchema,
} from "./validation";

// #demo-error-handling — controllers forward every error with next(err)
// HTTP concerns only: parse + validate the request, call the service,
// shape the response. no business logic, no db/redis calls here. any
// thrown error (Zod, or an AppError from the service) is forwarded to
// next(err) — Express doesn't do that on its own for an async handler,
// so the try/catch here has to do it explicitly. the errorHandler
// middleware in lib/errors.ts, mounted once in server.ts, is what
// actually turns it into a response.

export const productsController = {
  async list(req: Request, res: Response, next: NextFunction) {
    try {
      const query = listProductsQuerySchema.parse(req.query);
      const products = await productsService.list(query);
      res.json(products);
    } catch (err) {
      next(err);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = productIdParamSchema.parse(req.params);
      const product = await productsService.getById(id);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const body = createProductBodySchema.parse(req.body);
      const product = await productsService.create(body);
      res.status(201).json(product);
    } catch (err) {
      next(err);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = productIdParamSchema.parse(req.params);
      const body = updateProductBodySchema.parse(req.body);
      const product = await productsService.update(id, body);
      res.json(product);
    } catch (err) {
      next(err);
    }
  },

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = productIdParamSchema.parse(req.params);
      await productsService.remove(id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
