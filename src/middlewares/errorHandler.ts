import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  status?: number;
  code?: string;
  isOperational?: boolean;
}

export const createError = (message: string, status = 400): AppError => {
  const err = new Error(message) as AppError;
  err.status = status;
  err.isOperational = true;
  return err;
}

export const errorHandler = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error: AppError;

  if (!(err instanceof Error)) {
    error = new Error("Unexpected error occurred") as AppError;
  } else {
    error = err as AppError;
  }
  const status = error.status || 500;

  if (process.env.NODE_ENV !== "production") {
    console.error(error);
  }

  res.status(status).json({
    success: false,
    message: status >= 500 ? "Internal Server Error" : error.message,
    ...(process.env.NODE_ENV !== "production" && { stack: error.stack }),
  });
};