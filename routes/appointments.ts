import { Router } from 'express';
import { roleBased } from '../middlewares/roleBase';
import { validateDataWithZod } from '../middlewares/validateData';
import { z } from 'zod';
import {
  appointments,
  appointmentsCount,
  cancelAppointment,
  doctors,
  scheduleAppointment,
} from '../controllers/appointments';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

// post instead of get because of bun issue with express

router.post(
  '/appointments',
  //   isAuth,
  //   roleBased('admin'),
  validateDataWithZod(
    z.object({
      perPage: z.number().min(1).default(5),
      page: z.number().min(1).default(1),
    })
  ),
  appointments
);

router.post('/schedule-appointment', scheduleAppointment);

router.post('/cancel-appointment', cancelAppointment);

router.get('/doctors', doctors);

router.get(
  '/appointments-count',
  //   isAuth,
  //   roleBased('admin'),
  appointmentsCount
);

export default router;
