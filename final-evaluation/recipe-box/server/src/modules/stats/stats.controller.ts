import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../../shared/errors.js";
import * as statsService from "./stats.service.js";

export const getStats = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const stats = await statsService.getStats();
    res.json(stats);
  } catch (error) {
    next(error);
  }
};

export const getFeatured = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    // TODO: Read the optional ?count= query param (default 3). It must be a whole number from 1 to 10, otherwise throw a ValidationError (400). Pass it to the service.
    const rawCount = req.query.count;

    const count = rawCount === undefined ? 3 : Number(rawCount);

    if (
      (rawCount !== undefined && typeof rawCount !== "string") ||
      !Number.isInteger(count) ||
      count < 1 ||
      count > 10
    ) {
      throw new ValidationError("Count must be a whole number from 1 to 10");
    }

    const featured = await statsService.getFeatured(count);
    res.json(featured);
  } catch (error) {
    next(error);
  }
};
