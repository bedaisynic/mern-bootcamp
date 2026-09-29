// given

import { Router } from "express";
import { paymentController } from "./payment.controller";

// Public, reachable through the gateway: a demo knob only.
export const paymentRoutes = Router();
paymentRoutes.post("/debug/slow", paymentController.setSlow);

// Internal: only other services call these.
export const internalPaymentRoutes = Router();
internalPaymentRoutes.post("/charges", paymentController.charge);
internalPaymentRoutes.post("/:id/refund", paymentController.refund);
