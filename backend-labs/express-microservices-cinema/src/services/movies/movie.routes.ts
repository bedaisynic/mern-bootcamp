// REFERENCE — fully implemented.

import { Router } from "express";
import { movieController } from "./movie.controller";

export const showtimeRoutes = Router();

showtimeRoutes.get("/", movieController.list);
showtimeRoutes.get("/:id", movieController.getById);
