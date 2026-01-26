// Service for managing image overrides at the database level
// This allows owners to override default images for cities and neighbourhoods

export interface ImageOverride {
  id: string;
  type: 'city' | 'neighbourhood'; // Type of entity
  entityId: string; // city id or neighbourhood name
  imageUrl: string; // Owner-provided image URL
  uploadedAt: Date;
  pgId?: string; // Optional: specific PG that uploaded it
}

export interface CityImageOverride {
  cityId: string;
  imageUrl: string;
}

export interface NeighbourhoodImageOverride {
  neighbourhoodName: string;
  city: string;
  imageUrl: string;
}

/**
 * Get image URL with owner override fallback
 * Priority: Owner Override > Original URL > Fallback
 */
export function getImageUrl(
  originalUrl: string,
  fallbackUrl: string,
  overrideUrl?: string
): string {
  return overrideUrl || originalUrl || fallbackUrl;
}

/**
 * Check if image is a fallback (SVG data URL)
 */
export function isFallbackImage(imageUrl: string): boolean {
  return imageUrl.startsWith('data:image/svg+xml');
}

/**
 * Get image error message
 */
export function getImageErrorMessage(
  entityType: 'city' | 'neighbourhood',
  entityName: string
): string {
  return `Failed to load ${entityType} image for ${entityName}. Using fallback.`;
}

/**
 * Validate image URL
 */
export async function validateImageUrl(url: string): Promise<boolean> {
  // Skip validation for data URLs (fallback images)
  if (url.startsWith('data:')) {
    return true;
  }

  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    console.warn(`Failed to validate image URL: ${url}`);
    return false;
  }
}
