// #demo-error-handling (see DEMOS.md)
// shared error types + centralized error-handling middleware.
//
// every kind of failure gets its own small class that already knows its
// own HTTP status code and machine-readable code — a missing product is a
// NotFoundError, which is always 404. a failure is signaled by THROWING
// one of these — almost always from the service layer — not by returning
// null/false and checking for it everywhere.

import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
    public readonly code: string,
  ) {
    super(message);
    this.name = new.target.name;
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, "CONFLICT");
  }
}

export class InvalidStatusTransitionError extends AppError {
  constructor(message: string) {
    super(message, 409, "INVALID_STATUS_TRANSITION");
  }
}

// mounted once, last, after every route (see server.ts). express recognizes
// this as an error handler specifically because it takes FOUR params
// (err, req, res, next) instead of three — when anything throws (and gets
// forwarded via next(err)), express skips every remaining route and jumps
// straight here, no matter which controller or service caused it.
export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Zod validates the SHAPE of a request — this isn't an AppError since
  // it's never thrown deliberately from a service, but it still needs a
  // clean 400 instead of falling through to the generic 500 below.
  if (err instanceof ZodError) {
    res.status(400).json({
      error: {
        code: "VALIDATION_ERROR",
        message: err.issues
          .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
          .join("; "),
      },
    });
    return;
  }
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ error: { code: err.code, message: err.message } });
    return;
  }
  console.error(err);
  res.status(500).json({ error: { code: "INTERNAL_ERROR", message: "Something went wrong" } });
};
