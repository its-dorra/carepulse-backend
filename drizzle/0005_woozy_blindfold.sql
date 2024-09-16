ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "phoneNumber" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "fullName" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "imageUrl" SET DATA TYPE text;