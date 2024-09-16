import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const doctors = pgTable('doctors', {
  id: serial('id').primaryKey(),
  doctorName: text('doctor_name').notNull(),
  imgPath: text('img_path').notNull(),
});
