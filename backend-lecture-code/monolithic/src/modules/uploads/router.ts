import { Router } from "express";

import { uploadsController } from "./controller";

export const uploadsRouter = Router();

// #demo-s3 (see DEMOS.md)
uploadsRouter.post("/presign", uploadsController.presign);
