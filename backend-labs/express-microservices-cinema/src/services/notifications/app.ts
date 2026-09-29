// given

import { createServiceApp } from "../../lib/service-app";
import { notificationRepository } from "./notification.repository";
import { internalNotificationRoutes, notificationRoutes } from "./notification.routes";

export function createNotificationsApp() {
  notificationRepository.reset();
  return createServiceApp("notifications", (app) => {
    app.use("/notifications", notificationRoutes);
    app.use("/internal/notifications", internalNotificationRoutes);
  });
}
