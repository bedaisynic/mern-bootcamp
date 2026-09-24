import { Router } from "express";

import * as activityController from "./controller";

export const activityRouter = Router();

activityRouter.get("/offset", activityController.pageByOffset);
activityRouter.get("/cursor", activityController.pageByCursor);
activityRouter.get("/count", activityController.count);
