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

export const personalInfo = pgTable('personalInfos', {
  id: serial('id').primaryKey(),
  userId: uuid('userId')
    .notNull()
    .references(() => users.id),
  dateOfBirth: date('dateOfBirth').notNull(),
  gender: text('gender', { enum: ['Male', 'Female'] }).notNull(),
  address: text('address').notNull(),
  occupation: text('occupation').notNull(),
  emergencyName: text('emergencyName').notNull(),
  emergencyPhoneNumber: text('emergencyPhoneNumber').notNull(),
  doctorId: serial('doctorId')
    .notNull()
    .references(() => doctors.id),
  insuranceProvider: text('insuranceProvider'),
  insurancePolicyNumber: text('insurancePolicyNumber'),
  allergies: text('allergies'),
  currentMedications: text('currentMedications'),
  familyMedHistory: text('familyMedicalHistory'),
  pastMedHistory: text('pastMedicalHistory'),
  identificationType: text('identificationType', {
    enum: ['Birth certificate', 'Driving license', 'Passport', 'National ID'],
  }).notNull(),
  identificationNumber: text('identificationNumber'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
});
