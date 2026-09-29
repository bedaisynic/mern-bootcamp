import { Router } from "express";
import { recommendationController } from "./recommendation.controller";

export const recommendationRoutes = Router();

recommendationRoutes.get("/", recommendationController.get);
