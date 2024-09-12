import { Router } from 'express';
import { login, loginWithPhoneOtp, logout, signup } from '../controllers/auth';
import { validateDataWithZod } from '../middlewares/validateData';
import { userLoginSchema, userRegistrationSchema } from '../schemas/userSchema';

const router = Router();

router.post('/login', validateDataWithZod(userLoginSchema), login);

router.post('/signup', validateDataWithZod(userRegistrationSchema), signup);

router.post('/verifyOtp', loginWithPhoneOtp);

router.post('/logout', logout);

export default router;
