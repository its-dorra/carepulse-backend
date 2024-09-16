import type { RequestHandler } from 'express';
import type { CustomError } from '../types/error';

export const roleBased = (roles: string) => {
  const middleware: RequestHandler = (req, res, next) => {
    const { role } = req.cookies;
    if (roles === role) return next();

    const error: CustomError = {
      message: 'You are not authorized',
      statusCode: 401,
    };
    return next(error);
  };

  return middleware;
};
