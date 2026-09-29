// given

import { createServiceApp } from "../../lib/service-app";
import { bookingRepository } from "./booking.repository";
import { bookingRoutes } from "./booking.routes";
import { ServiceName, setServiceUrls } from "./config";

export function createBookingsApp(urls: Partial<Record<ServiceName, string>> = {}) {
  bookingRepository.reset();
  setServiceUrls(urls);
  return createServiceApp("bookings", (app) => {
    app.use("/bookings", bookingRoutes);
  });
}
