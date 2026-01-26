/**
 * Location and geolocation utilities for PG form
 */

/**
 * Extract coordinates from Google Maps URL
 * Supports multiple URL formats
 */
export function extractCoordinatesFromMapsUrl(url: string): { lat: number; lng: number } | null {
  try {
    // Format: https://maps.google.com/?q=12.9352,77.6245 or with @ symbol
    const coordPatterns = [
      /[?&]q=(-?\d+\.?\d*),(-?\d+\.?\d*)/,  // ?q=lat,lng
      /@(-?\d+\.?\d*),(-?\d+\.?\d*)/,       // @lat,lng
      /!1d(-?\d+\.?\d*).*!2d(-?\d+\.?\d*)/, // Google Maps API format
    ];

    for (const pattern of coordPatterns) {
      const match = url.match(pattern);
      if (match) {
        return {
          lat: parseFloat(match[1]),
          lng: parseFloat(match[2]),
        };
      }
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Reverse geocode coordinates to get address using OpenStreetMap Nominatim API
 */
export async function reverseGeocode(lat: number, lng: number): Promise<string | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    );
    if (!response.ok) return null;
    const data = await response.json();
    return data.address?.road || data.address?.suburb || data.address?.city || null;
  } catch {
    return null;
  }
}
