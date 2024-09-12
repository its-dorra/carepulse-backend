import { pgTable, serial, text } from 'drizzle-orm/pg-core';

export const doctors = pgTable('doctors', {
  id: serial('id').primaryKey(),
  doctorName: text('doctorName').notNull(),
  imgPath: text('imgPath').notNull(),
});
