// given

import type { Request, Response } from "express";
import { seatService } from "./seat.service";

export const seatController = {
  async getSeatMap(req: Request<{ showtimeId: string }>, res: Response) {
    res.json(await seatService.getSeatMap(Number(req.params.showtimeId)));
  },

  async hold(req: Request, res: Response) {
    const hold = await seatService.hold(req.body?.showtimeId, req.body?.seats);
    res.status(201).json({ holdId: hold.id });
  },

  async release(req: Request<{ id: string }>, res: Response) {
    await seatService.release(Number(req.params.id));
    res.status(204).end();
  },
};
