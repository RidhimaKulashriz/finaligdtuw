import { Request, Response, NextFunction } from 'express';

export const notFound = (_req: Request, res: Response, next: NextFunction): void => {
  res.status(404);
  const error = new Error(`Not found - ${_req.originalUrl}`);
  next(error);
};

export const errorHandler = (err: Error, _req: Request, res: Response, _next: NextFunction): void => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export const validationError = (errors: any[]) => {
  return {
    message: 'Validation failed',
    errors: errors.map((error: any) => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    })),
  };
};
