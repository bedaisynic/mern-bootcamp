import { Request, Response } from "express";
import { recommendationService } from "./recommendation.service";

export const recommendationController = {
  async get(req: Request, res: Response) {
    const ms = Math.min(Number(req.query.ms) || 5000, 30000);
    res.json({ tookMs: ms, recommendations: await recommendationService.recommend(ms) });
  },
};
