// given

import type { Request, Response } from "express";
import { paymentService } from "./payment.service";

export const paymentController = {
  async charge(req: Request, res: Response) {
    const { bookingId, userId, amount } = req.body ?? {};
    res.status(201).json(await paymentService.charge(bookingId, userId, amount));
  },

  async refund(req: Request<{ id: string }>, res: Response) {
    res.json(await paymentService.refund(Number(req.params.id)));
  },

  setSlow(req: Request, res: Response) {
    res.json({ slowMs: paymentService.setSlow(Number(req.body?.ms) || 0) });
  },
};
