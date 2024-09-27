import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { RequestHandler } from 'express';
import type { CustomError } from '../types/error';
import type { CustomRequest } from '../types/customRequest';
import { db } from '../db';
import { users as usersTable } from '../db/schema/users';
import { and, eq } from 'drizzle-orm';
import {
  accessTokenCookieOptions,
  accessTokenDuration,
} from '../constants/cookieSettings';

export const isAuth: RequestHandler = async (req, res, next) => {
  const { accessToken, refreshToken, userId } = req.cookies;

  try {
    const isVerifiedAccessToken =
      accessToken && jwt.verify(accessToken, process.env.ACCESS_SECRET!);

    if (isVerifiedAccessToken) {
      return next();
    }
    const isVerifiedRefreshToken =
      refreshToken && jwt.verify(refreshToken, process.env.REFRESH_SECRET!);

    if (!isVerifiedRefreshToken) {
      throw { message: 'Invalid token', statusCode: 403 };
    }

    const tokenInDB = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .then((res) => res?.[0]);

    if (!tokenInDB || tokenInDB.token !== refreshToken) {
      throw { message: 'Unauthorized', statusCode: 401 };
    }

    const updatedAccessToken = jwt.sign(
      {
        userId,
      },
      process.env.ACCESS_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: accessTokenDuration,
      }
    );

    res.cookie('accessToken', updatedAccessToken, accessTokenCookieOptions);

    next();
  } catch (err) {
    const error = {
      message: (err as any).message || 'Internal Error',
      statusCode: (err as any).statusCode || 500,
    };
    next(error);
  }
};
