DROP INDEX "spam_check_idx";--> statement-breakpoint
DROP INDEX "city_idx";--> statement-breakpoint
DROP INDEX "gender_idx";--> statement-breakpoint
ALTER TABLE "pgs" ALTER COLUMN "images" SET DEFAULT '{}';--> statement-breakpoint
ALTER TABLE "pgs" ALTER COLUMN "amenities" SET DEFAULT '{}';--> statement-breakpoint
-- All columns and indexes already exist in database, skipping duplicates
-- CREATE INDEX "published_idx" ON "pgs" USING btree ("is_published");--> statement-breakpoint
-- CREATE INDEX "spam_check_idx" ON "enquiries" USING btree ("pg_id","phone","created_at");--> statement-breakpoint
-- CREATE INDEX "city_idx" ON "pgs" USING btree ("city");--> statement-breakpoint
-- CREATE INDEX "gender_idx" ON "pgs" USING btree ("gender");