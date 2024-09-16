export const accessTokenDuration = 10 * 1000;

export const refreshTokenDuration = 60 * 1000;

export const accessTokenCookieOptions = {
  maxAge: accessTokenDuration,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
};

export const refreshTokenCookieOptions = {
  maxAge: refreshTokenDuration,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
};

export const phoneNumberCookieOptions = {
  maxAge: 2 * 60 * 1000,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
};
