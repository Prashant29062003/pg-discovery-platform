// Helper to get default coordinates for major Indian cities
export const CITY_COORDINATES: Record<string, { lat: number; lng: number; name: string }> = {
  bangalore: {
    lat: 12.9716,
    lng: 77.5946,
    name: 'Bangalore',
  },
  pune: {
    lat: 18.5204,
    lng: 73.8567,
    name: 'Pune',
  },
  delhi: {
    lat: 28.7041,
    lng: 77.1025,
    name: 'Delhi',
  },
  gurgaon: {
    lat: 28.4595,
    lng: 77.0266,
    name: 'Gurgaon',
  },
  noida: {
    lat: 28.5821,
    lng: 77.3326,
    name: 'Noida',
  },
  mumbai: {
    lat: 19.076,
    lng: 72.8777,
    name: 'Mumbai',
  },
  hyderabad: {
    lat: 17.3850,
    lng: 78.4867,
    name: 'Hyderabad',
  },
  kolkata: {
    lat: 22.5726,
    lng: 88.3639,
    name: 'Kolkata',
  },
};

/**
 * Get default coordinates for a city
 */
export function getDefaultCoordinates(city: string): { lat: number; lng: number } | null {
  const normalized = city.toLowerCase();
  const coords = CITY_COORDINATES[normalized];
  return coords ? { lat: coords.lat, lng: coords.lng } : null;
}

/**
 * Format coordinates for Google Maps URL
 */
export function formatMapUrl(lat?: number, lng?: number): string {
  if (!lat || !lng) return '';
  return `https://www.google.com/maps?q=${lat},${lng}`;
}

/**
 * Generate Google Maps embed URL
 */
export function generateMapsEmbedUrl(lat?: number, lng?: number): string {
  if (!lat || !lng) return '';
  return `https://www.google.com/maps/embed/v1/place?key=***REMOVED***&q=${lat},${lng}`;
}
