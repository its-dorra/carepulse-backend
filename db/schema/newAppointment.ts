import { date, pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { doctors } from './doctors';

export const newAppointments = pgTable('new_appointments', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id, { onDelete: 'set null' }),
  doctorId: serial('doctor_id')
    .notNull()
    .references(() => doctors.id, { onDelete: 'cascade' }),
  reasonOfAppointment: text('reason_of_appointment').notNull(),
  additionalComments: text('additional_comments'),
  expectedDate: date('expected_date').notNull(),
  appointmentStatus: text('appointment_status', {
    enum: ['Pending', 'Scheduled', 'Cancelled'],
  })
    .notNull()
    .default('Pending'),
});
