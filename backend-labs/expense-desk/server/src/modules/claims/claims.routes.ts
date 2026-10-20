import { Router } from "express";
import * as controller from "./claims.controller";

export const claimsRouter = Router();

claimsRouter.get("/", controller.list);
claimsRouter.post("/", controller.create);
claimsRouter.get("/approvals", controller.approvals);
claimsRouter.post("/:id/approve", controller.approve);
claimsRouter.post("/:id/reject", controller.reject);
claimsRouter.get("/:id", controller.get);
claimsRouter.post("/:id/process", controller.process);
