import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { doctors } from './schema/doctors';
import { users } from './schema/users';
import { personalInfo } from './schema/personalInfo';
import { newAppointments } from './schema/newAppointment';
import { appointmentsCount } from './schema/appointmentsCount';

const queryClient = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(queryClient, {
  schema: { users, doctors, personalInfo, newAppointments, appointmentsCount },
});
