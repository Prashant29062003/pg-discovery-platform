-- Add thumbnail_image column to pgs table
ALTER TABLE "pgs" ADD COLUMN "thumbnail_image" text;

-- Update thumbnail_image with first image from images array if not empty
UPDATE "pgs" 
SET "thumbnail_image" = (images[1]) 
WHERE images IS NOT NULL AND array_length(images, 1) > 0 AND images[1] != '';
