// given

import { Router } from "express";
import { seatController } from "./seat.controller";

// Public, reachable through the gateway.
export const seatRoutes = Router();
seatRoutes.get("/:showtimeId", seatController.getSeatMap);

// Internal: only other services call these. The gateway has no route for them.
export const internalSeatRoutes = Router();
internalSeatRoutes.post("/holds", seatController.hold);
internalSeatRoutes.delete("/holds/:id", seatController.release);
