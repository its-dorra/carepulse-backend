export const cookieSettings = {
  maxAge: 24 * 60 * 60 * 1000,
  secure: process.env.BUN_ENV === 'production',
  httpOnly: true,
};
