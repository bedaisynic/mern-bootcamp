// given

import type { Request, Response } from "express";
import { requireUserId } from "../../lib/user";
import { notificationService } from "./notification.service";

export const notificationController = {
  async send(req: Request, res: Response) {
    const { userId, subject, body } = req.body ?? {};
    res.status(201).json(await notificationService.send(userId, subject, body));
  },

  async listMine(req: Request, res: Response) {
    res.json(await notificationService.listForUser(requireUserId(req)));
  },
};
