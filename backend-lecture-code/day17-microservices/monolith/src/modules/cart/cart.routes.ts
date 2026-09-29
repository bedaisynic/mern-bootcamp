import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { cartController } from "./cart.controller";

export const cartRoutes = Router();
cartRoutes.use(requireAuth);

cartRoutes.get("/", cartController.get);
cartRoutes.post("/items", cartController.addItem);
cartRoutes.delete("/items/:sku", cartController.removeItem);
cartRoutes.delete("/", cartController.clear);
