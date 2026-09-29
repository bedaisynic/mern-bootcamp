// REFERENCE — fully implemented. HTTP in, HTTP out: read the request, call
// one service method, send the result. No rules, no data access.

import type { Request, Response } from "express";
import { movieService } from "./movie.service";

export const movieController = {
  async list(_req: Request, res: Response) {
    res.json(await movieService.listShowtimes());
  },

  async getById(req: Request<{ id: string }>, res: Response) {
    res.json(await movieService.getShowtime(Number(req.params.id)));
  },
};
