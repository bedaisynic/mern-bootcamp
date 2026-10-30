import { Request, Response, NextFunction } from 'express';
import { NotFoundError, ValidationError, ConflictError, NotImplementedError } from '../shared/errors.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Error:', err);

  if (err instanceof NotFoundError || err instanceof ValidationError || err instanceof ConflictError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  if (err instanceof NotImplementedError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal server error',
  });
};
