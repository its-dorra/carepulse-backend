import { Router } from 'express';
import { roleBased } from '../middlewares/roleBase';
import { validateDataWithZod } from '../middlewares/validateData';
import { z } from 'zod';
import {
  appointments,
  appointmentsCount,
  cancelAppointment,
  doctors,
  getLastAppointment,
  newAppointment,
  scheduleAppointment,
} from '../controllers/appointments';
import { isAuth } from '../middlewares/isAuth';

const router = Router();

// post instead of get because of bun issue with express
router.post(
  '/get-appointments',
  isAuth,
  roleBased('admin'),
  validateDataWithZod(
    z.object({
      perPage: z.coerce.number().min(1).default(5),
      page: z.coerce.number().min(1).default(1),
    })
  ),
  appointments
);

router.post(
  '/schedule-appointment',
  isAuth,
  roleBased('admin'),
  validateDataWithZod(
    z.object({
      id: z.number(),
      doctorId: z.string(),
      reasonOfAppointment: z.string().min(1),
      expectedDate: z.string(),
    })
  ),
  scheduleAppointment
);

router.post(
  '/cancel-appointment',
  isAuth,
  roleBased('admin'),
  cancelAppointment
);

router.post(
  '/new-appointment',
  isAuth,
  roleBased('user'),
  //   status('registered'),
  //   validateDataWithZod(
  //     z.object({
  //       doctorId: z.coerce.number(),
  //       reasonOfAppointment: z.string().min(1),
  //       additionalComments: z.string().optional(),
  //       expectedDate: z.date().min(new Date(Date.now())),
  //     })
  //   ),
  newAppointment
);

router.post(
  '/last-appointment',
  isAuth,
  roleBased('user'),
  // status('registered'),
  getLastAppointment
);

router.get('/get-doctors', isAuth, doctors);

router.get(
  '/appointments-count',
  isAuth,
  roleBased('admin'),
  appointmentsCount
);

export default router;
