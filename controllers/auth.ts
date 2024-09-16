import type { RequestHandler } from 'express';
import { db } from '../db';
import { users as usersTable } from '../db/schema/users';
import { eq, or } from 'drizzle-orm';
import type { CustomError } from '../types/error';
import jwt from 'jsonwebtoken';
import {
  refreshTokenCookieOptions,
  accessTokenCookieOptions,
  phoneNumberCookieOptions,
  accessTokenDuration,
  refreshTokenDuration,
} from '../constants/cookieSettings';
import twilio from 'twilio';
import { generatePin } from '../utils';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export const loginAdmin: RequestHandler = async (req, res, next) => {
  const { pinCode } = req.body;

  const error: CustomError = {
    message: 'Invalid credential',
    statusCode: 401,
  };

  try {
    const user = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.role, 'admin'))
      .then((users) => users?.[0]);

    if (!user) throw error;

    const isMatch = await Bun.password.verify(pinCode, user.pinCode!);

    if (!isMatch) throw error;

    const accessToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.ACCESS_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: accessTokenDuration,
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.REFRESH_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: refreshTokenDuration,
      }
    );

    await db
      .update(usersTable)
      .set({ token: refreshToken })
      .where(eq(usersTable.id, user.id));

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
    res.cookie('role', 'admin', refreshTokenCookieOptions);
    res.cookie('userId', user.id, refreshTokenCookieOptions);

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (err) {
    const error: CustomError = {
      message: (err as CustomError).message || 'Internal Error',
      statusCode: (err as CustomError).statusCode || 500,
    };
    next(error);
  }
};

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

    await db
      .update(usersTable)
      .set({ phoneOtp: pin })
      .where(eq(usersTable.id, user.id));

    // await client.messages.create({
    //   from: '+18103669612',
    //   to: phoneNumber,
    //   body: `Your verification pin is : ${pin}`,
    // });

    res.cookie('phoneNumber', phoneNumber, phoneNumberCookieOptions);

    res.cookie('userId', user.id, phoneNumberCookieOptions);

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
    const existingUser = await db
      .select()
      .from(usersTable)
      .where(
        or(eq(usersTable.email, email), eq(usersTable.phoneNumber, phoneNumber))
      )
      .then((users) => users[0]);

    if (existingUser) {
      const error: CustomError = {
        message: 'User already exists',
        statusCode: 409,
      };

      throw error;
    }

    await db.insert(usersTable).values({ email, phoneNumber, fullName });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    const error: CustomError = {
      message: (err as CustomError).message || 'Internal error',
      statusCode: (err as CustomError).statusCode || 500,
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

    res.clearCookie('phoneNumber', phoneNumberCookieOptions);
    res.clearCookie('userId', phoneNumberCookieOptions);

    const accessToken = jwt.sign(
      {
        userId,
      },
      process.env.ACCESS_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: accessTokenDuration,
      }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id,
      },
      process.env.REFRESH_SECRET!,
      {
        algorithm: 'HS256',
        expiresIn: refreshTokenDuration,
      }
    );

    await db
      .update(usersTable)
      .set({ phoneOtp: null, token: refreshToken })
      .where(eq(usersTable.id, user.id));

    res.cookie('accessToken', accessToken, accessTokenCookieOptions);
    res.cookie('refreshToken', refreshToken, refreshTokenCookieOptions);
    res.cookie('userId', userId, refreshTokenCookieOptions);
    res.cookie('role', 'user', refreshTokenCookieOptions);

    res.status(200).json({ message: 'Logged in successfully' });
  } catch (err) {
    next(err);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  res.clearCookie('accessToken', accessTokenCookieOptions);
  res.clearCookie('refreshToken', refreshTokenCookieOptions);
  res.clearCookie('role', refreshTokenCookieOptions);
  res.clearCookie('phoneNumber', phoneNumberCookieOptions);
  res.json({ message: 'Logged out successfully' });
};
