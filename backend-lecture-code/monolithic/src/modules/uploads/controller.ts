import type { NextFunction, Request, Response } from "express";

import { uploadsService } from "./service";
import { presignBodySchema } from "./validation";

export const uploadsController = {
  // #demo-s3 — POST /uploads/presign
  async presign(req: Request, res: Response, next: NextFunction) {
    try {
      const body = presignBodySchema.parse(req.body);
      const result = await uploadsService.presign(body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },
};
