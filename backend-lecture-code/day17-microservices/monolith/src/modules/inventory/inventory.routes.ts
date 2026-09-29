import { Router } from "express";
import { inventoryController } from "./inventory.controller";

export const inventoryRoutes = Router();

inventoryRoutes.get("/", inventoryController.list);
inventoryRoutes.get("/:sku", inventoryController.getBySku);
