-- Add contact fields to pgs table
ALTER TABLE pgs 
ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(15),
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS website VARCHAR(500),
ADD COLUMN IF NOT EXISTS facebook VARCHAR(500),
ADD COLUMN IF NOT EXISTS instagram VARCHAR(500);

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_pgs_whatsapp_number ON pgs(whatsapp_number);
CREATE INDEX IF NOT EXISTS idx_pgs_email ON pgs(email);
