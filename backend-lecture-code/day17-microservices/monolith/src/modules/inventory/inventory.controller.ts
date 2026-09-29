import { Request, Response } from "express";
import { inventoryService } from "./inventory.service";

export const inventoryController = {
  async list(req: Request, res: Response) {
    res.json(await inventoryService.listStock());
  },

  async getBySku(req: Request<{ sku: string }>, res: Response) {
    res.json(await inventoryService.getStock(req.params.sku));
  },
};
