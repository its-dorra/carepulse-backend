import { date, pgTable, serial, text, uuid } from 'drizzle-orm/pg-core';
import { users } from './users';
import { doctors } from './doctors';

export const newAppointments = pgTable('newAppointments', {
  id: serial('id').primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'set null' }),
  doctorId: serial('doctorId')
    .notNull()
    .references(() => doctors.id, { onDelete: 'cascade' }),
  reasonOfAppointment: text('reasonOfAppointment').notNull(),
  additionalComments: text('additionalComments').notNull(),
  expectedDate: date('expectedDate').notNull(),
  appointmentStatus: text('appointmentStatus', {
    enum: ['Pending', 'Scheduled', 'Cancelled'],
  })
    .notNull()
    .default('Pending'),
});
