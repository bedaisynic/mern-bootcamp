import { Router } from "express";

import { aiController } from "./controller";

export const aiRouter = Router();

// #demo-secrets-manager (see DEMOS.md)
aiRouter.post("/ask", aiController.ask);
