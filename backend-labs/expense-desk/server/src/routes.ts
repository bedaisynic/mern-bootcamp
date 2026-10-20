import { Router } from "express";
import { claimsRouter } from "./modules/claims/claims.routes";
import { employeesRouter } from "./modules/employees/employees.routes";
import { resetClaims } from "./modules/claims/claims.service";

export const apiRouter = Router();

apiRouter.use("/claims", claimsRouter);
apiRouter.use("/employees", employeesRouter);

// Put every claim back to "new", drop all results and payments
apiRouter.post("/admin/reset", (_req, res) => {
  resetClaims();
  res.status(204).end();
});
