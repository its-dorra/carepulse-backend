import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';

const queryClient = postgres(process.env.POSTGRES_URL!);
export const db = drizzle(queryClient);
