import { Router } from "express";
import { orderController } from "./order.controller";

export const orderRoutes = Router();

orderRoutes.post("/", orderController.checkout);
orderRoutes.get("/", orderController.list);
orderRoutes.get("/:id", orderController.getById);
