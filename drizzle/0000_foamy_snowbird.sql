CREATE TABLE IF NOT EXISTS "doctors" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctorName" text NOT NULL,
	"imgPath" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "newAppointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"doctorId" serial NOT NULL,
	"reasonOfAppointment" text NOT NULL,
	"additionalComments" text NOT NULL,
	"expectedDate" date NOT NULL,
	"appointmentStatus" text DEFAULT 'Pending' NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "personalInfos" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" uuid NOT NULL,
	"dateOfBirth" date NOT NULL,
	"gender" text NOT NULL,
	"address" text NOT NULL,
	"occupation" text NOT NULL,
	"emergencyName" text NOT NULL,
	"emergencyPhoneNumber" text NOT NULL,
	"doctorId" serial NOT NULL,
	"insuranceProvider" text,
	"insurancePolicyNumber" text,
	"allergies" text,
	"currentMedications" text,
	"familyMedicalHistory" text,
	"pastMedicalHistory" text,
	"identificationType" text NOT NULL,
	"identificationNumber" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(256) NOT NULL,
	"phoneNumber" text NOT NULL,
	"fullName" text NOT NULL,
	"token" text,
	"role" text DEFAULT 'user' NOT NULL,
	"pinCode" varchar(6)
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newAppointments" ADD CONSTRAINT "newAppointments_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "newAppointments" ADD CONSTRAINT "newAppointments_doctorId_doctors_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."doctors"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personalInfos" ADD CONSTRAINT "personalInfos_userId_users_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "personalInfos" ADD CONSTRAINT "personalInfos_doctorId_doctors_id_fk" FOREIGN KEY ("doctorId") REFERENCES "public"."doctors"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "email_idx" ON "users" USING btree ("email");