import sharp from 'sharp';

export interface ImageDimensions {
  width: number;
  height: number;
  name: string;
}

// Define image sizes for different use cases
export const IMAGE_SIZES = {
  // PG thumbnail for listing cards - 400x300 (16:9)
  pgThumbnail: { width: 400, height: 300, name: 'thumbnail' },
  // PG detail hero image - 1200x675 (16:9)
  pgHero: { width: 1200, height: 675, name: 'hero' },
  // Room images - 600x400 (3:2)
  roomImage: { width: 600, height: 400, name: 'room' },
  // Neighbor/Popular place profile - 300x300 (1:1 square)
  squareProfile: { width: 300, height: 300, name: 'profile' },
  // Gallery/Detail images - 1200x800 (3:2)
  galleryImage: { width: 1200, height: 800, name: 'gallery' },
} as const;

/**
 * Resize image to specific dimensions with 'cover' strategy
 * (crops to fit, maintaining aspect ratio)
 */
export async function resizeImage(
  buffer: Buffer,
  dimensions: ImageDimensions
): Promise<Buffer> {
  return sharp(buffer)
    .resize(dimensions.width, dimensions.height, {
      fit: 'cover', // Crop to fit exactly
      position: 'center', // Center the crop
    })
    .toFormat('webp', { quality: 80 })
    .toBuffer();
}

/**
 * Process image for PG thumbnail (400x300)
 */
export async function optimizePGThumbnail(buffer: Buffer): Promise<Buffer> {
  return resizeImage(buffer, IMAGE_SIZES.pgThumbnail);
}

/**
 * Process image for PG hero section (1200x675)
 */
export async function optimizePGHero(buffer: Buffer): Promise<Buffer> {
  return resizeImage(buffer, IMAGE_SIZES.pgHero);
}

/**
 * Process image for room gallery (600x400)
 */
export async function optimizeRoomImage(buffer: Buffer): Promise<Buffer> {
  return resizeImage(buffer, IMAGE_SIZES.roomImage);
}

/**
 * Process image for square profile (300x300)
 */
export async function optimizeSquareProfile(buffer: Buffer): Promise<Buffer> {
  return resizeImage(buffer, IMAGE_SIZES.squareProfile);
}

/**
 * Process image for gallery display (1200x800)
 */
export async function optimizeGalleryImage(buffer: Buffer): Promise<Buffer> {
  return resizeImage(buffer, IMAGE_SIZES.galleryImage);
}

/**
 * Generate filename with timestamp and size prefix
 */
export function generateImageFilename(
  type: keyof typeof IMAGE_SIZES,
  originalName?: string
): string {
  const timestamp = Date.now();
  const sizePrefix = IMAGE_SIZES[type].name;
  const sanitized = originalName?.split('.')[0]?.slice(0, 20) || 'image';
  return `${sizePrefix}_${timestamp}_${sanitized}.webp`;
}

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSizeInMB: number = 10
): { valid: boolean; error?: string } {
  const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
  
  if (!validMimes.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid image format. Allowed: JPEG, PNG, WebP, GIF',
    };
  }

  const maxBytes = maxSizeInMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return {
      valid: false,
      error: `Image size must be less than ${maxSizeInMB}MB`,
    };
  }

  return { valid: true };
}
