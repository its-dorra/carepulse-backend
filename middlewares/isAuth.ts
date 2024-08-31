import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import type { CustomError } from '../types/error';
import type { CustomRequest } from '../types/customRequest';

export const isAuth: RequestHandler = (req: CustomRequest, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader?.startsWith('Bearer')) {
    const error: CustomError = {
      message: 'Unauthorized',
      statusCode: 401,
    };
    throw error;
  }

  const token = authHeader.split(' ')[1];

  const isValid = jwt.verify(token, process.env.ACCESS_SECRET!) as JwtPayload;

  if (!isValid) {
    const error: CustomError = {
      message: 'Invalid token',
      statusCode: 403,
    };
    throw error;
  }

  const { userId } = jwt.decode(token) as JwtPayload;

  req.userId = userId;
  next();
};
