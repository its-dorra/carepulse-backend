import type { RequestHandler } from 'express';
import { db } from '../db';
import { users as usersTable } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import type { CustomError } from '../types/error';
import jwt from 'jsonwebtoken';
import { cookieSettings } from '../constants/cookieSettings';

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  const error: CustomError = {
    message: 'Invalid credential',
    statusCode: 401,
  };

  try {
    const user = (
      await db.select().from(usersTable).where(eq(usersTable.email, email))
    )?.[0];

    if (!user) {
      throw error;
    }

    const isMatch = await Bun.password.verify(password, user.password);

    if (!isMatch) {
      throw error;
    }

    const accessToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.ACCESS_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: '10s',
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.REFRESH_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: '1d',
      }
    );

    res.cookie('token', refreshToken, cookieSettings);

    res.json({ message: 'Logged in successfully', token: accessToken });
  } catch (err) {
    const error: CustomError = {
      message: (err as CustomError).message || 'Internal error',
      statusCode: (err as CustomError).statusCode || 500,
    };
    next(error);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const hashedPassword = await Bun.password.hash(password);

    await db.insert(usersTable).values({ email, password: hashedPassword });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    const error: CustomError = {
      message: 'Internal error',
      statusCode: 500,
    };
    next(error);
  }
};
