import { Request, Response } from "express";
import { paymentService } from "./payment.service";

export const paymentController = {
  async getById(req: Request<{ id: string }>, res: Response) {
    res.json(await paymentService.getPayment(Number(req.params.id), res.locals.userId));
  },
};
