import { pgTable, text, uniqueIndex, varchar, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 256 }).unique().notNull(),
    phoneNumber: text('phoneNumber').unique().notNull(),
    fullName: text('fullName').notNull(),
    token: text('token'),
    role: text('role', { enum: ['user', 'admin'] })
      .notNull()
      .default('user'),
    phoneOtp: varchar('phoneOtp', { length: 6 }),
    pinCode: varchar('pinCode', { length: 6 }),
  },
  (users) => {
    return {
      phoneNumberIndex: uniqueIndex('phoneNumber_idx').on(users.phoneNumber),
    };
  }
);
