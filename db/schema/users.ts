import { pgTable, text, uniqueIndex, varchar, uuid } from 'drizzle-orm/pg-core';

export const users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    email: varchar('email', { length: 256 }).notNull(),
    password: text('password').notNull(),
  },
  (users) => {
    return {
      emailIndex: uniqueIndex('email_idx').on(users.email),
    };
  }
);
