import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { notificationController } from "./notification.controller";

export const notificationRoutes = Router();

notificationRoutes.get("/", requireAuth, notificationController.list);
notificationRoutes.post("/debug/crash", notificationController.crash); // DEMO
