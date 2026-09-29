// given

import { createServiceApp } from "../../lib/service-app";
import { paymentRepository } from "./payment.repository";
import { internalPaymentRoutes, paymentRoutes } from "./payment.routes";
import { paymentService } from "./payment.service";

export function createPaymentsApp() {
  paymentRepository.reset();
  paymentService.setSlow(0);
  return createServiceApp("payments", (app) => {
    app.use("/payments", paymentRoutes);
    app.use("/internal/payments", internalPaymentRoutes);
  });
}
