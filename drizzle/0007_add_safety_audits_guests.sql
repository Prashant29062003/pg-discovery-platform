-- Create safety_audits table
CREATE TABLE "safety_audits" (
	"id" text PRIMARY KEY NOT NULL,
	"pg_id" text NOT NULL,
	"category" text NOT NULL,
	"item" text NOT NULL,
	"status" text NOT NULL,
	"notes" text,
	"last_checked" timestamp DEFAULT now() NOT NULL,
	"inspected_by" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create guests table
CREATE TABLE "guests" (
	"id" text PRIMARY KEY NOT NULL,
	"pg_id" text NOT NULL,
	"room_id" text NOT NULL,
	"name" text NOT NULL,
	"email" varchar(255),
	"phone" varchar(15),
	"check_in_date" timestamp NOT NULL,
	"check_out_date" timestamp,
	"status" text DEFAULT 'active' NOT NULL,
	"number_of_occupants" integer DEFAULT 1,
	"notes" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);

-- Create indexes for safety_audits
CREATE INDEX "safety_audits_pg_id_idx" ON "safety_audits" ("pg_id");
CREATE INDEX "safety_audits_status_idx" ON "safety_audits" ("status");

-- Create indexes for guests
CREATE INDEX "guests_pg_id_idx" ON "guests" ("pg_id");
CREATE INDEX "guests_room_id_idx" ON "guests" ("room_id");
CREATE INDEX "guests_status_idx" ON "guests" ("status");
CREATE INDEX "guests_check_in_idx" ON "guests" ("check_in_date");

-- Add foreign key constraints
ALTER TABLE "safety_audits" ADD CONSTRAINT "safety_audits_pg_id_pgs_id_fk" FOREIGN KEY ("pg_id") REFERENCES "pgs"("id") ON DELETE cascade;
ALTER TABLE "guests" ADD CONSTRAINT "guests_pg_id_pgs_id_fk" FOREIGN KEY ("pg_id") REFERENCES "pgs"("id") ON DELETE cascade;
ALTER TABLE "guests" ADD CONSTRAINT "guests_room_id_rooms_id_fk" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE cascade;
