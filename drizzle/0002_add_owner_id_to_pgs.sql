ALTER TABLE "pgs" ADD COLUMN "owner_id" text DEFAULT 'system' NOT NULL;--> statement-breakpoint
CREATE INDEX "owner_idx" ON "pgs" USING btree ("owner_id");