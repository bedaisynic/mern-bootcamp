import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { orderController } from "./order.controller";

export const orderRoutes = Router();
orderRoutes.use(requireAuth);

orderRoutes.post("/", orderController.checkout);
orderRoutes.get("/", orderController.list);
orderRoutes.get("/:id", orderController.getById);
