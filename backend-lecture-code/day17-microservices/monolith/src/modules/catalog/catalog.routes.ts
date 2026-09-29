import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { catalogController } from "./catalog.controller";

export const catalogRoutes = Router();

catalogRoutes.get("/", catalogController.list);
catalogRoutes.get("/:sku", catalogController.getBySku);
catalogRoutes.post("/", requireAuth, catalogController.create);
