ALTER TABLE "newAppointments" RENAME TO "new_appointments";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME TO "personal_infos";--> statement-breakpoint
ALTER TABLE "new_appointments" DROP CONSTRAINT "newAppointments_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "new_appointments" DROP CONSTRAINT "newAppointments_doctor_id_doctors_id_fk";
--> statement-breakpoint
ALTER TABLE "personal_infos" DROP CONSTRAINT "personalInfos_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "personal_infos" DROP CONSTRAINT "personalInfos_doctor_id_doctors_id_fk";
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "new_appointments" ADD CONSTRAINT "new_appointments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "new_appointments" ADD CONSTRAINT "new_appointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personal_infos" ADD CONSTRAINT "personal_infos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personal_infos" ADD CONSTRAINT "personal_infos_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
