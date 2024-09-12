import type { RequestHandler } from 'express';
import { db } from '../db';
import { users as usersTable } from '../db/schema/users';
import { eq } from 'drizzle-orm';
import type { CustomError } from '../types/error';
import jwt from 'jsonwebtoken';
import {
  refreshTokenCookieOptions,
  accessTokenCookieOptions,
  phoneNumberCookieOptions,
} from '../constants/cookieSettings';
import twilio from 'twilio';
import { generatePin } from '../utils';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const login: RequestHandler = async (req, res, next) => {
  const { email, phoneNumber } = req.body;
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

    const isMatch = user.phoneNumber === phoneNumber;

    if (!isMatch) {
      throw error;
    }

    const pin = generatePin();

    await db.update(usersTable).set({ phoneOtp: pin });

    await client.messages.create({
      from: '+18103669612',
      to: phoneNumber,
      body: `Your verification pin is : ${pin}`,
    });

    res.cookie('phoneNumber', phoneNumber, phoneNumberCookieOptions);

    res.cookie('userId', user.id, refreshTokenCookieOptions);

    res.json({ message: 'Sent 6-digit pin' });
  } catch (err) {
    const error: CustomError = {
      message: (err as CustomError).message || 'Internal error',
      statusCode: (err as CustomError).statusCode || 500,
    };
    next(error);
  }
};

export const signup: RequestHandler = async (req, res, next) => {
  const { email, fullName, phoneNumber } = req.body;

  try {
    await db.insert(usersTable).values({ email, phoneNumber, fullName });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    const error: CustomError = {
      message: 'Internal error',
      statusCode: 500,
    };
    next(error);
  }
};

export const loginWithPhoneOtp: RequestHandler = async (req, res, next) => {
  const error: CustomError = {
    message: 'Invalid credential',
    statusCode: 401,
  };

  const { phoneNumber, userId } = req.cookies;
  try {
    if (!phoneNumber) {
      throw error;
    }

    const user = (
      await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.phoneNumber, phoneNumber))
    )?.[0];

    if (!user) throw error;

    const { otp } = req.body;

    const isMatch = user.phoneOtp == otp;

    if (!isMatch) throw error;

    await db.update(usersTable).set({ phoneOtp: null });

    res.clearCookie('phoneNumber', phoneNumberCookieOptions);

    const accessToken = jwt.sign(
      {
        userId,
      },
      process.env.ACCESS_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: '15s',
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.REFRESH_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: '45s',
      }
    );

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);

    res.json({ message: 'Logged in successfully' });
  } catch (err) {
    next(err);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  //   res.clearCookie('auth', cookieSettings);
  res.clearCookie('phoneNumber', phoneNumberCookieOptions);
  res.json({ message: 'Logged out successfully' });
};
