import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { paymentController } from "./payment.controller";

export const paymentRoutes = Router();

paymentRoutes.get("/:id", requireAuth, paymentController.getById);
