import {
  date,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { users } from './users';
import { doctors } from './doctors';

export const personalInfo = pgTable('personal_infos', {
  id: serial('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => users.id),
  dateOfBirth: date('date_of_birth').notNull(),
  gender: text('gender', { enum: ['Male', 'Female'] }).notNull(),
  address: text('address').notNull(),
  occupation: text('occupation').notNull(),
  emergencyName: text('emergency_name').notNull(),
  emergencyPhoneNumber: text('emergency_phone_number').notNull(),
  doctorId: serial('doctor_id')
    .notNull()
    .references(() => doctors.id),
  insuranceProvider: text('insurance_provider'),
  insurancePolicyNumber: text('insurance_policy_number'),
  allergies: text('allergies'),
  currentMedications: text('current_medications'),
  familyMedHistory: text('family_medical_history'),
  pastMedHistory: text('past_medical_history'),
  identificationType: text('identification_type', {
    enum: ['Birth certificate', 'Driving license', 'Passport', 'National ID'],
  }).notNull(),
  identificationNumber: text('identification_number'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});
