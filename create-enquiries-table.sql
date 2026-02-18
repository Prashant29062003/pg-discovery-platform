-- Check if enquiries table exists and create it if not
CREATE TABLE IF NOT EXISTS enquiries (
    id TEXT PRIMARY KEY NOT NULL,
    pg_id TEXT NOT NULL,
    name TEXT NOT NULL,
    phone VARCHAR(15) NOT NULL,
    message TEXT,
    occupation TEXT,
    room_type TEXT,
    move_in_date TIMESTAMP,
    status TEXT DEFAULT 'NEW' NOT NULL,
    created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- Create index for spam prevention
CREATE INDEX IF NOT EXISTS spam_check_idx ON enquiries USING btree (pg_id, phone, created_at);

-- Add foreign key constraint if not exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'enquiries_pg_id_pgs_id_fk' 
        AND table_name = 'enquiries'
    ) THEN
        ALTER TABLE enquiries ADD CONSTRAINT enquiries_pg_id_pgs_id_fk 
        FOREIGN KEY (pg_id) REFERENCES pgs(id);
    END IF;
END $$;
