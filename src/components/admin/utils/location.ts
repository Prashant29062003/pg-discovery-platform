/**
 * Location and geolocation utilities for PG form
 */

export interface LocationDetails {
  address: string;
  city: string;
  locality: string;
  fullAddress?: string;
  // Enhanced location details
  state?: string;
  postcode?: string;
  country?: string;
  building?: string;
  houseNumber?: string;
  road?: string;
  suburb?: string;
  neighbourhood?: string;
  district?: string;
  county?: string;
  // Administrative levels
  stateDistrict?: string;
  region?: string;
  // Additional details
  quarter?: string;
  residential?: string;
  commercial?: string;
  industrial?: string;
}

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
 * Reverse geocode coordinates to get detailed address using OpenStreetMap Nominatim API
 * Extracts comprehensive address components including building, road, administrative areas, etc.
 */
export async function reverseGeocode(lat: number, lng: number): Promise<LocationDetails | null> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&zoom=18`
    );
    if (!response.ok) return null;
    const data = await response.json();
    
    // Debug: Log the raw response
    console.log('Geocoding API Response:', data);
    
    const address = data.address || {};
    const displayName = data.display_name || '';
    
    // Debug: Log address components
    console.log('Address components:', {
      city: address.city,
      town: address.town,
      village: address.village,
      county: address.county,
      suburb: address.suburb,
      neighbourhood: address.neighbourhood,
      district: address.district,
      state: address.state,
      country: address.country,
      road: address.road,
      house_number: address.house_number
    });
    
    // Extract comprehensive address components
    const houseNumber = address.house_number || address.building || '';
    const road = address.road || address.street || address.pedestrian || '';
    const building = address.building || address.amenity || address.shop || address.tourism || '';
    const suburb = address.suburb || address.neighbourhood || address.district || '';
    const neighbourhood = address.neighbourhood || address.suburb || '';
    const district = address.district || address.suburb || address.borough || '';
    
    // Fix: Better city detection for Indian locations
    // Priority: city > town > county > village (but village should be locality, not city)
    const directCity = address.city || address.town || '';
    const city = directCity || address.county || '';
    const village = address.village || ''; // This should be locality, not city
    
    // For Indian locations, sometimes the city is in county or other fields
    const state = address.state || address.province || address.region || '';
    const postcode = address.postcode || address.post_code || '';
    const country = address.country || address.country_code || '';
    const county = address.county || '';
    const stateDistrict = address.state_district || '';
    const region = address.region || '';
    const quarter = address.quarter || '';
    
    // Debug: Log what we found for city
    console.log('City detection:', {
      directCity: address.city,
      town: address.town,
      county: address.county,
      village: address.village,
      finalCity: city
    });
    
    // Area type classification
    const residential = address.residential || '';
    const commercial = address.commercial || '';
    const industrial = address.industrial || '';
    
    // Build address components with fallbacks
    const streetAddress = [houseNumber, road].filter(Boolean).join(' ') || 
                         [building, road].filter(Boolean).join(' ') || 
                         road || building || '';
    
    // Fix: Properly assign locality vs city
    // Locality should be: suburb > neighbourhood > district > village > quarter
    const localityArea = suburb || neighbourhood || district || village || quarter || '';
    const cityArea = city || ''; // This should be Ambala Cantt, not Jandli
    
    // Debug: Log final assignments
    console.log('Final assignments:', {
      streetAddress,
      cityArea,
      localityArea,
      state,
      country,
      note: village ? `${village} is being used as locality, not city` : ''
    });
    
    // Build comprehensive full address
    const addressParts = [
      houseNumber,
      building,
      road,
      localityArea, // Use localityArea instead of suburb/neighbourhood directly
      cityArea,
      state,
      postcode,
      country
    ].filter(Boolean);
    
    const fullAddress = displayName || addressParts.join(', ').replace(/,\s*,/g, ',').replace(/,\s*$/, '');
    
    return {
      address: streetAddress,
      city: cityArea, // This should be Ambala, not Jandli
      locality: localityArea, // This should be Jandli
      fullAddress: fullAddress.trim(),
      // Enhanced details
      state,
      postcode,
      country,
      building,
      houseNumber,
      road,
      suburb,
      neighbourhood,
      district,
      county,
      stateDistrict,
      region,
      quarter,
      residential,
      commercial,
      industrial
    };
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
}
