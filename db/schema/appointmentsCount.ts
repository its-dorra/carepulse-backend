import { integer, pgTable, text } from 'drizzle-orm/pg-core';

export const appointmentsCount = pgTable('appointments_count', {
  status: text('status', {
    enum: ['Pending', 'Scheduled', 'Cancelled'],
  })
    .primaryKey()
    .notNull(),
  count: integer('count').notNull(),
});
