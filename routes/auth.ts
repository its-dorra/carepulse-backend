import { Router } from 'express';
import {
  login,
  loginAdmin,
  logout,
  signup,
  user,
  personalInformation,
} from '../controllers/auth';
import { validateDataWithZod } from '../middlewares/validateData';
import { userLoginSchema, userRegistrationSchema } from '../schemas/userSchema';
import { rateLimit } from 'express-rate-limit';
import { isAuth } from '../middlewares/isAuth';
import { roleBased } from '../middlewares/roleBase';
import { status } from '../middlewares/status';

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000,
  limit: 2,
});

const router = Router();

router.post('/login', validateDataWithZod(userLoginSchema), login);

router.post('/signup', validateDataWithZod(userRegistrationSchema), signup);

router.get('/user', user);

router.post('/login-admin', loginAdmin);

router.post(
  '/patient-info',
  isAuth,
  roleBased('user'),
  status('notRegistered'),
  personalInformation
);

router.post('/logout', logout);

export default router;
