export const accessTokenCookieOptions = {
  maxAge: 15 * 1000,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
};

export const refreshTokenCookieOptions = {
  maxAge: 45 * 1000,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
};

export const phoneNumberCookieOptions = {
  maxAge: 2 * 60 * 1000,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
};
