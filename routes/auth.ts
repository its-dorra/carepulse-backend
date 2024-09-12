import { Router } from 'express';
import { login, loginWithPhoneOtp, logout, signup } from '../controllers/auth';
import { validateDataWithZod } from '../middlewares/validateData';
import { userLoginSchema, userRegistrationSchema } from '../schemas/userSchema';
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 2,
});

const router = Router();

router.post('/login', limiter, validateDataWithZod(userLoginSchema), login);

router.post(
  '/signup',
  limiter,
  validateDataWithZod(userRegistrationSchema),
  signup
);

router.post('/verifyOtp', loginWithPhoneOtp);

router.post('/logout', logout);

export default router;
