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
import { personalInfo } from '../db/schema/personalInfo';

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
      await db
        .select({
          id: usersTable.id,
          personalInfoId: personalInfo.id,
          phoneNumber: usersTable.phoneNumber,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .leftJoin(personalInfo, eq(usersTable.id, personalInfo.userId))
    )?.[0];

    if (!user) {
      throw error;
    }

    const isMatch = user.phoneNumber === phoneNumber;

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
    res.cookie(
      'status',
      user.personalInfoId ? 'registered' : 'notRegistered',
      refreshTokenCookieOptions
    );
    res.cookie('userId', user.id, refreshTokenCookieOptions);
    res.cookie('role', 'user', refreshTokenCookieOptions);

    res.status(200).json({
      status: user.personalInfoId ? 'registered' : 'notRegistered',
      message: 'Logged in successfully',
    });
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

    res
      .status(201)
      .json({ message: 'User created successfully and 6 pin-digit was sent' });
  } catch (err) {
    const error: CustomError = {
      message: (err as CustomError).message || 'Internal error',
      statusCode: (err as CustomError).statusCode || 500,
    };
    next(error);
  }
};

export const user: RequestHandler = async (req, res, next) => {
  const { userId, role, refreshToken } = req.cookies;

  if (!userId || !role || !refreshToken)
    return res.status(401).json({ user: null });

  const user = await db
    .select({
      userId: usersTable.id,
      fullName: usersTable.fullName,
      phoneNumber: usersTable.phoneNumber,
      email: usersTable.email,
      status: personalInfo.id,
      imgPath: usersTable.imageUrl,
    })
    .from(usersTable)
    .leftJoin(personalInfo, eq(usersTable.id, personalInfo.userId))
    .where(eq(usersTable.id, userId))
    .then((res) => res?.[0]);

  return res.json({
    user: {
      role,
      ...user,
      status: user.status ? 'registered' : 'notRegistered',
    },
  });
};

export const personalInformation: RequestHandler = async (req, res, next) => {
  const { userId } = req.cookies;
  const {
    dateOfBirth,
    gender,
    address,
    occupation,
    emergencyName,
    emergencyPhoneNumber,
    doctorId,
    insuranceProvider,
    insuranceNumber,
    allergies,
    currentMedications,
    familyMedHistory,
    pastMedHistory,
    identificationType,
    identificationNumber,
  } = req.body;

  try {
    await db.insert(personalInfo).values({
      doctorId,
      userId,
      address,
      dateOfBirth,
      emergencyName,
      emergencyPhoneNumber,
      gender,
      identificationType,
      occupation,
      identificationNumber,
      currentMedications,
      pastMedHistory,
      familyMedHistory,
      allergies,
      insuranceProvider,
      insurancePolicyNumber: insuranceNumber,
    });

    res.cookie('status', 'registered', refreshTokenCookieOptions);

    res.status(200).json({
      message:
        'Inserted personal information data in the database successfully',
    });
  } catch (err: any) {
    const error: CustomError = {
      message:
        'Something went wrong when inserting your information in the database , please try again',
      statusCode: 400,
    };
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  res.clearCookie('accessToken', accessTokenCookieOptions);
  res.clearCookie('refreshToken', refreshTokenCookieOptions);
  res.clearCookie('status', refreshTokenCookieOptions);
  res.clearCookie('userId', refreshTokenCookieOptions);
  res.clearCookie('role', refreshTokenCookieOptions);
  res.clearCookie('phoneNumber', phoneNumberCookieOptions);
  res.json({ message: 'Logged out successfully' });
};
