import { Request, Response } from "express";
import { notificationService } from "./notification.service";

export const notificationController = {
  async list(req: Request, res: Response) {
    res.json(await notificationService.listForUser(res.locals.userId));
  },

  crash(req: Request, res: Response) {
    notificationService.scheduleCrash();
    res.json({ message: "notifications module crashing in 100ms" });
  },
};
