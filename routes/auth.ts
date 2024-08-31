import { Router } from 'express';
import { login } from '../controllers/auth';
import { validateDataWithZod } from '../middlewares/validateData';
import { userLoginSchema } from '../schemas/userSchema';

const router = Router();

router.post('/login', validateDataWithZod(userLoginSchema), login);

export default router;
