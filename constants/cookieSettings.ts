import type { CookieOptions } from 'express';

export const accessTokenDuration = 5 * 60 * 1000;

export const refreshTokenDuration = 24 * 60 * 60 * 1000;

export const accessTokenCookieOptions: CookieOptions = {
  maxAge: accessTokenDuration,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict',
};

export const refreshTokenCookieOptions: CookieOptions = {
  maxAge: refreshTokenDuration,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict',
};

export const phoneNumberCookieOptions: CookieOptions = {
  maxAge: 2 * 60 * 1000,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
  sameSite: 'strict',
};
