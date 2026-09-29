import { Request, Response } from "express";
import { orderService } from "./order.service";

export const orderController = {
  async checkout(req: Request, res: Response) {
    res.status(201).json(await orderService.checkout(res.locals.userId));
  },

  async list(req: Request, res: Response) {
    res.json(await orderService.listOrders(res.locals.userId));
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    res.json(await orderService.getOrderDetail(Number(req.params.id), res.locals.userId));
  },
};
