import { Router } from "express";
import { requireAuth } from "../../middleware/auth";
import { userController } from "./user.controller";

export const userRoutes = Router();

userRoutes.post("/", userController.register);
userRoutes.post("/login", userController.login);
userRoutes.get("/me", requireAuth, userController.me);
