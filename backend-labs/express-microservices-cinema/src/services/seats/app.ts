// given

import { createServiceApp } from "../../lib/service-app";
import { seatRepository } from "./seat.repository";
import { internalSeatRoutes, seatRoutes } from "./seat.routes";

export function createSeatsApp() {
  seatRepository.reset();
  return createServiceApp("seats", (app) => {
    app.use("/seats", seatRoutes);
    app.use("/internal/seats", internalSeatRoutes);
  });
}
