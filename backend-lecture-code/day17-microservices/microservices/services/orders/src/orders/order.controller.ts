import { Request, Response } from "express";
import { Ctx } from "../clients/http";
import { HttpError } from "../errors";
import { orderService } from "./order.service";

// The gateway already verified the token and put the caller's id in
// x-user-id, so there's no auth middleware here, just a header to read.
function ctxOf(req: Request): Ctx {
  const userId = Number(req.header("x-user-id"));
  if (!userId) throw new HttpError(401, "missing x-user-id: call this through the gateway");
  return { userId, requestId: req.header("x-request-id") ?? "" };
}

export const orderController = {
  async checkout(req: Request, res: Response) {
    res.status(201).json(await orderService.checkout(ctxOf(req)));
  },

  async list(req: Request, res: Response) {
    res.json(await orderService.listOrders(ctxOf(req).userId));
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    res.json(await orderService.getOrder(Number(req.params.id), ctxOf(req).userId));
  },
};
