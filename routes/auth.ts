import { Router } from 'express';
import {
  login,
  loginAdmin,
  loginWithPhoneOtp,
  logout,
  signup,
} from '../controllers/auth';
import { validateDataWithZod } from '../middlewares/validateData';
import { userLoginSchema, userRegistrationSchema } from '../schemas/userSchema';
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 2,
});

const router = Router();

router.post('/login', validateDataWithZod(userLoginSchema), login);

router.post('/signup', validateDataWithZod(userRegistrationSchema), signup);

router.post('/login-admin', loginAdmin);

router.post('/verify-otp', loginWithPhoneOtp);

router.post('/logout', logout);

export default router;
