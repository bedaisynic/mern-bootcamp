import { Request, Response } from "express";
import { catalogService } from "./catalog.service";

export const catalogController = {
  async list(req: Request, res: Response) {
    const category =
      typeof req.query.category === "string" ? req.query.category : undefined;

    res.json(await catalogService.listProducts(category));
  },

  async getBySku(req: Request<{ sku: string }>, res: Response) {
    res.json(await catalogService.getProduct(req.params.sku));
  },

  async create(req: Request, res: Response) {
    res.status(201).json(await catalogService.createProduct(req.body ?? {}));
  },
};
