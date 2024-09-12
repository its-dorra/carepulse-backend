import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import type { CustomError } from '../types/error';
import type { CustomRequest } from '../types/customRequest';
import { db } from '../db';
import { users as usersTable } from '../db/schema/users';
import { and, eq } from 'drizzle-orm';
import { accessTokenCookieOptions } from '../constants/cookieSettings';

// export const isAuth: RequestHandler = (req: CustomRequest, res, next) => {
//   const authHeader = req.get('Authorization');

//   if (!authHeader?.startsWith('Bearer')) {
//     const error: CustomError = {
//       message: 'Unauthorized',
//       statusCode: 401,
//     };
//     throw error;
//   }

//   const token = authHeader.split(' ')[1];

//   const isValid = jwt.verify(token, process.env.ACCESS_SECRET!) as JwtPayload;

//   if (!isValid) {
//     const error: CustomError = {
//       message: 'Invalid token',
//       statusCode: 403,
//     };
//     throw error;
//   }

//   const { userId } = jwt.decode(token) as JwtPayload;

//   req.userId = userId;
//   next();
// };

export const isAuth: RequestHandler = async (req: CustomRequest, res, next) => {
  const auth = req.cookies.auth;

  if (!auth) {
    const error: CustomError = {
      message: 'Unauthorized',
      statusCode: 401,
    };
    throw error;
  }

  const { token, id } = JSON.parse(auth);

  const isValid = jwt.verify(token, process.env.REFRESH_SECRET!) as JwtPayload;

  if (!isValid) {
    const error: CustomError = {
      message: 'Invalid token',
      statusCode: 403,
    };
    throw error;
  }

  const tokenInDB = (
    await db
      .select()
      .from(usersTable)
      .where(and(eq(usersTable.token, token), eq(usersTable.id, id)))
  )?.[0];

  if (!tokenInDB) {
    const error: CustomError = {
      message: 'Unauthorized',
      statusCode: 401,
    };
    throw error;
  }

  const accessToken = jwt.sign(req.userId!, process.env.ACCESS_SECRET!, {
    expiresIn: '10s',
    algorithm: 'HS256',
  });

  res.cookie('accessToken', accessToken, accessTokenCookieOptions);

  next();
};
