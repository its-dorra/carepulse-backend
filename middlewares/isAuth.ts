import type { RequestHandler } from 'express';
import type { CustomError } from '../types/error';

const isAuth: RequestHandler = (req, res, next) => {
  const authHeader = req.get('Authorization');

  if (!authHeader?.startsWith('Bearer')) {
    const error: CustomError = {
      message: 'Unauthorized',
      statusCode: 401,
    };
    throw error;
  }

  const token = authHeader.split(' ')[1];
};
