// given

import { Router } from "express";
import { bookingController } from "./booking.controller";

export const bookingRoutes = Router();

bookingRoutes.post("/", bookingController.create);
bookingRoutes.get("/", bookingController.list);
bookingRoutes.get("/:id", bookingController.getById);
bookingRoutes.post("/:id/cancel", bookingController.cancel);
