ALTER TABLE "doctors" RENAME COLUMN "doctorName" TO "doctor_name";--> statement-breakpoint
ALTER TABLE "doctors" RENAME COLUMN "imgPath" TO "img_path";--> statement-breakpoint
ALTER TABLE "newAppointments" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "newAppointments" RENAME COLUMN "doctorId" TO "doctor_id";--> statement-breakpoint
ALTER TABLE "newAppointments" RENAME COLUMN "reasonOfAppointment" TO "reason_of_appointment";--> statement-breakpoint
ALTER TABLE "newAppointments" RENAME COLUMN "additionalComments" TO "additional_comments";--> statement-breakpoint
ALTER TABLE "newAppointments" RENAME COLUMN "expectedDate" TO "expected_date";--> statement-breakpoint
ALTER TABLE "newAppointments" RENAME COLUMN "appointmentStatus" TO "appointment_status";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "userId" TO "user_id";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "dateOfBirth" TO "date_of_birth";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "emergencyName" TO "emergency_name";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "emergencyPhoneNumber" TO "emergency_phone_number";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "doctorId" TO "doctor_id";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "insuranceProvider" TO "insurance_provider";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "insurancePolicyNumber" TO "insurance_policy_number";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "currentMedications" TO "current_medications";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "familyMedicalHistory" TO "family_medical_history";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "pastMedicalHistory" TO "past_medical_history";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "identificationType" TO "identification_type";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "identificationNumber" TO "identification_number";--> statement-breakpoint
ALTER TABLE "personalInfos" RENAME COLUMN "createdAt" TO "created_at";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "phoneNumber" TO "phone_number";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "fullName" TO "full_name";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "phoneOtp" TO "phone_otp";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "pinCode" TO "pin_code";--> statement-breakpoint
ALTER TABLE "users" RENAME COLUMN "imageUrl" TO "image_url";--> statement-breakpoint
ALTER TABLE "users" DROP CONSTRAINT "users_phoneNumber_unique";--> statement-breakpoint
ALTER TABLE "newAppointments" DROP CONSTRAINT "newAppointments_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "newAppointments" DROP CONSTRAINT "newAppointments_doctorId_doctors_id_fk";
--> statement-breakpoint
ALTER TABLE "personalInfos" DROP CONSTRAINT "personalInfos_userId_users_id_fk";
--> statement-breakpoint
ALTER TABLE "personalInfos" DROP CONSTRAINT "personalInfos_doctorId_doctors_id_fk";
--> statement-breakpoint
DROP INDEX IF EXISTS "phoneNumber_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newAppointments" ADD CONSTRAINT "newAppointments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newAppointments" ADD CONSTRAINT "newAppointments_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personalInfos" ADD CONSTRAINT "personalInfos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personalInfos" ADD CONSTRAINT "personalInfos_doctor_id_doctors_id_fk" FOREIGN KEY ("doctor_id") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "phoneNumber_idx" ON "users" USING btree ("phone_number");--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_phone_number_unique" UNIQUE("phone_number");