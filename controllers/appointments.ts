import type { RequestHandler } from 'express';
import { db } from '../db';
import { newAppointments } from '../db/schema/newAppointment';
import { users as usersTable } from '../db/schema/users';
import { eq, sql } from 'drizzle-orm';
import { doctors as doctorsTable } from '../db/schema/doctors';
import { appointmentsCount as appointmentsCountTable } from '../db/schema/appointmentsCount';
import type { CustomError } from '../types/error';

export const appointments: RequestHandler = async (req, res, next) => {
  const { page, perPage } = req.body;

  const [appointments, totalAppointmentCount] = await Promise.all([
    db
      .select({
        doctor: {
          id: doctorsTable.id,
          doctorName: doctorsTable.doctorName,
          doctorPath: doctorsTable.imgPath,
        },
        reasonOfAppointment: newAppointments.reasonOfAppointment,
        id: newAppointments.id,
        status: newAppointments.appointmentStatus,
        date: newAppointments.expectedDate,
        fullName: usersTable.fullName,
        expectedDate: newAppointments.expectedDate,
      })
      .from(newAppointments)
      .innerJoin(usersTable, eq(usersTable.id, newAppointments.userId))
      .innerJoin(doctorsTable, eq(doctorsTable.id, newAppointments.doctorId))
      .orderBy(newAppointments.expectedDate)
      .limit(perPage)
      .offset((page - 1) * perPage),
    db
      .select({
        totalCount: sql<number>`cast(sum(${appointmentsCountTable.count}) as int)`,
      })
      .from(appointmentsCountTable)
      .then((res) => res?.[0]),
  ]);

  res.json({ appointments, totalAppointmentCount });
};

export const appointmentsCount: RequestHandler = async (req, res, next) => {
  try {
    const statusCount = await db.select().from(appointmentsCountTable);
    res.json({ statusCount });
  } catch (err) {
    const error: CustomError = {
      message: (err as any).message || 'Internal error',
      statusCode: 500,
    };
    next(error);
  }
};

export const scheduleAppointment: RequestHandler = async (req, res, next) => {
  const { id, doctorId, reasonOfAppointment, expectedDate } = req.body;
  try {
    await db
      .update(newAppointments)
      .set({
        appointmentStatus: 'Scheduled',
        doctorId,
        reasonOfAppointment,
        expectedDate,
      })
      .where(eq(newAppointments.id, id));

    res.json({ message: 'Appointment scheduled successfully' });
  } catch (err) {
    const error: CustomError = {
      message: 'Failed to schedule the appointment',
      statusCode: 400,
    };
    next(error);
  }
};

export const cancelAppointment: RequestHandler = async (req, res, next) => {
  const { id, reasonForCancellation } = req.body;

  console.log(reasonForCancellation);

  try {
    await db
      .update(newAppointments)
      .set({ appointmentStatus: 'Cancelled' })
      .where(eq(newAppointments.id, id));

    res.json({ message: 'Appointment cancelled successfully' });
  } catch (err) {
    console.error(err);
    const error: CustomError = {
      message: (err as any).message || 'Failed to cancel the appointment',
      statusCode: 400,
    };
    next(error);
  }
};

export const doctors: RequestHandler = async (req, res, next) => {
  try {
    const doctors = await db
      .select({
        id: doctorsTable.id,
        doctorName: doctorsTable.doctorName,
        doctorPath: doctorsTable.imgPath,
      })
      .from(doctorsTable);

    res.json({ doctors });
  } catch (err) {
    const error: CustomError = {
      message: 'Internal error',
      statusCode: 500,
    };
    next(error);
  }
};
