DROP INDEX "owner_idx";--> statement-breakpoint
ALTER TABLE "enquiries" ALTER COLUMN "pg_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "pgs" DROP COLUMN "owner_id";