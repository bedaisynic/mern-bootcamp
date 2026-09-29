// given

import { Router } from "express";
import { notificationController } from "./notification.controller";

// Public, reachable through the gateway (with a token).
export const notificationRoutes = Router();
notificationRoutes.get("/", notificationController.listMine);

// Internal: only other services call these.
export const internalNotificationRoutes = Router();
internalNotificationRoutes.post("/emails", notificationController.send);
