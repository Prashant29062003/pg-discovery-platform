-- Fix the specific PG record with coordinate address
UPDATE pgs 
SET address = COALESCE(
  CASE 
    WHEN address ~ '^\d+\.\d+,\s*\d+\.\d+$' THEN '' -- Clear coordinate addresses
    ELSE address 
  END, ''
)
WHERE id = 'pg_1769870886163_xgdvqpdyu';

-- Update full_address based on existing data
UPDATE pgs 
SET full_address = COALESCE(
  CASE 
    WHEN address IS NOT NULL AND address != '' AND city IS NOT NULL AND city != '' AND locality IS NOT NULL AND locality != ''
    THEN address || ', ' || city || ', ' || locality
    WHEN address IS NOT NULL AND address != '' AND city IS NOT NULL AND city != ''
    THEN address || ', ' || city
    WHEN address IS NOT NULL AND address != ''
    THEN address
    ELSE ''
  END,
  ''
)
WHERE id = 'pg_1769870886163_xgdvqpdyu';
