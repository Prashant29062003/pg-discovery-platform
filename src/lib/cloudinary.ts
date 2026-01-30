/**
 * Cloudinary Configuration and Utilities
 * 
 * Environment Variables Required:
 * - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME: Your Cloudinary account cloud name
 * - CLOUDINARY_API_KEY: Your Cloudinary API key
 * - CLOUDINARY_API_SECRET: Your Cloudinary API secret
 * 
 * Get these from: https://cloudinary.com/console
 */

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  apiKey: process.env.CLOUDINARY_API_KEY || '',
  apiSecret: process.env.CLOUDINARY_API_SECRET || '',
};

// Validate Cloudinary is configured
export const isCloudinaryConfigured = () => {
  return !!CLOUDINARY_CONFIG.cloudName && !!CLOUDINARY_CONFIG.apiKey && !!CLOUDINARY_CONFIG.apiSecret;
};

// Client-side check - only checks public variables
export const isCloudinaryClientConfigured = () => {
  return !!CLOUDINARY_CONFIG.cloudName && !!CLOUDINARY_UPLOAD_PRESET;
};

/**
 * Cloudinary Upload Preset URL for client-side uploads
 * Generate an unsigned preset in Cloudinary dashboard for more security
 */
export const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '';

/**
 * Generate optimized Cloudinary URL with transformations
 * @param publicId - The public ID from Cloudinary
 * @param options - Transformation options
 */
export function getCloudinaryUrl(
  publicId: string,
  options?: {
    width?: number;
    height?: number;
    quality?: 'auto' | 'low' | 'medium' | 'high';
    format?: 'auto' | 'webp' | 'jpg' | 'png';
  }
): string {
  if (!CLOUDINARY_CONFIG.cloudName) {
    return ''; // Return empty if not configured
  }

  const width = options?.width ? `w_${options.width}` : '';
  const height = options?.height ? `h_${options.height}` : '';
  const quality = options?.quality ? `q_${options.quality}` : 'q_auto';
  const format = options?.format ? `f_${options.format}` : 'f_auto';

  const transformations = [width, height, quality, format]
    .filter(Boolean)
    .join(',');

  const suffix = transformations ? `/c_fill/${transformations}` : '';

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload${suffix}/${publicId}`;
}

/**
 * Cloudinary image presets for different use cases
 */
export const CLOUDINARY_PRESETS = {
  pgThumbnail: {
    width: 400,
    height: 300,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  pgHero: {
    width: 1200,
    height: 675,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  pgGallery: {
    width: 1200,
    height: 800,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  roomImage: {
    width: 600,
    height: 400,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
  squareProfile: {
    width: 300,
    height: 300,
    quality: 'auto' as const,
    format: 'auto' as const,
  },
};

/**
 * Default placeholder/fallback images
 */
export const DEFAULT_IMAGES = {
  pgThumbnail: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400&h=300&fit=crop&q=80',
  pgHero: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=675&fit=crop&q=80',
  pgGallery: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop&q=80',
  roomImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&q=80',
  pgInterior: 'https://images.unsplash.com/photo-1540932239986-a128078a6a7b?w=800&q=80',
  pgCommon: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
};

/**
 * Validate if URL is from Cloudinary
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}

/**
 * Extract public ID from Cloudinary URL
 */
export function extractPublicIdFromUrl(url: string): string | null {
  try {
    const match = url.match(/\/([^/?]+)(?:\?|$)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}
