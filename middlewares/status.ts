import type { RequestHandler } from 'express';
import type { CustomError } from '../types/error';

export const status = (status: 'registered' | 'notRegistered') => {
  const middleware: RequestHandler = (req, res, next) => {
    const { status: userStatus } = req.cookies;
    if (status === userStatus) return next();

    const error: CustomError = {
      message:
        status === 'registered'
          ? 'You are already filled your personal information'
          : 'You have to fill your personal information',
      statusCode: 400,
    };
    return next(error);
  };

  return middleware;
};
