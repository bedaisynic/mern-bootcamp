import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../shared/errors.js";
import * as statsService from "./stats.service.js";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const result = await statsService.getStats();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getRecent = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: Read the optional ?limit= query param (default 5). It must be a whole number from 1 to 10, otherwise throw a ValidationError (400). Pass it to the service.
    const num = req.query.limit;
    const count = num === undefined ? 5 : Number(num);

    if (!Number.isInteger(count) || count < 1 || count > 10) {
      throw new ValidationError("400");
    }

    const result = await statsService.getRecent(count);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
