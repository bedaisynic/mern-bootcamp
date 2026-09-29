import { Request, Response } from "express";
import { cartService } from "./cart.service";

export const cartController = {
  async get(req: Request, res: Response) {
    res.json({ items: await cartService.getItems(res.locals.userId) });
  },

  async addItem(req: Request, res: Response) {
    const items = await cartService.addItem(res.locals.userId, req.body?.sku, req.body?.quantity);
    res.status(201).json({ items });
  },

  async removeItem(req: Request<{ sku: string }>, res: Response) {
    res.json({ items: await cartService.removeItem(res.locals.userId, req.params.sku) });
  },

  async clear(req: Request, res: Response) {
    await cartService.clear(res.locals.userId);
    res.status(204).end();
  },
};
