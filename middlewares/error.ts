import type { ErrorRequestHandler } from 'express';

export const error: ErrorRequestHandler = (error, req, res, next) => {
  console.log(error);
  const { message, statusCode, errorDetails } = error;
  res.status(statusCode).json({ message, errorDetails });
};
