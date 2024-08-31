import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './db/schema/*.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRESS_URL!,
  },
});
