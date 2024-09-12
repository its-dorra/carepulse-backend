DROP INDEX IF EXISTS "email_idx";--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "phoneNumber_idx" ON "users" USING btree ("phoneNumber");