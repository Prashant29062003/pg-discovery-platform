/**
 * Location handlers for geolocation and maps integration
 */
import { showToast } from '@/utils/toast';
import { extractCoordinatesFromMapsUrl, reverseGeocode, LocationDetails } from './location';

export interface LocationUpdateCallback {
  (key: 'lat' | 'lng' | 'address' | 'city' | 'locality' | 'fullAddress' | 'state' | 'country', value: string): void;
}

/**
 * Handle Google Maps link extraction
 */
export async function handleGoogleMapsLink(
  mapsLink: string,
  onUpdate: LocationUpdateCallback,
  onLoadingChange: (loading: boolean) => void
): Promise<void> {
  if (!mapsLink.trim()) {
    showToast.error('🗺️ Please paste a valid Google Maps link', 'The link field cannot be empty');
    return;
  }

  onLoadingChange(true);
  try {
    const coords = extractCoordinatesFromMapsUrl(mapsLink);
    if (!coords) {
      showToast.error('🗺️ Could not extract coordinates', 'Please ensure the link contains location data (e.g., https://maps.google.com/?q=latitude,longitude)');
      return;
    }

    onUpdate('lat', coords.lat.toString());
    onUpdate('lng', coords.lng.toString());

    try {
      const locationDetails: LocationDetails | null = await reverseGeocode(coords.lat, coords.lng);
      if (locationDetails) {
        // Update all location fields
        if (locationDetails.address) onUpdate('address', locationDetails.address);
        if (locationDetails.city) onUpdate('city', locationDetails.city);
        if (locationDetails.locality) onUpdate('locality', locationDetails.locality);
        if (locationDetails.fullAddress) onUpdate('fullAddress', locationDetails.fullAddress);
        if (locationDetails.state) onUpdate('state', locationDetails.state);
        if (locationDetails.country) onUpdate('country', locationDetails.country);
        
        const extractedFields = [];
        if (locationDetails.address) extractedFields.push('Street Address');
        if (locationDetails.city) extractedFields.push('City/District');
        if (locationDetails.locality) extractedFields.push('Locality/Area');
        if (locationDetails.fullAddress) extractedFields.push('Full Address');
        if (locationDetails.state) extractedFields.push('State');
        if (locationDetails.country) extractedFields.push('Country');
        
        showToast.success(
          '✅ Location extracted successfully!', 
          `Auto-filled: ${extractedFields.join(', ')} and Coordinates`
        );
      } else {
        showToast.warning(
          '⚠️ Coordinates extracted but address lookup failed', 
          'Please enter address details manually.'
        );
      }
    } catch (geoErr) {
      console.error('Reverse geocode error:', geoErr);
      // Still show success even if reverse geocoding fails
      showToast.warning(
        '⚠️ Coordinates extracted but address lookup failed', 
        'Please enter address details manually.'
      );
    }
  } catch (err: any) {
    console.error('Error processing maps link:', err);
    showToast.error('🗺️ Failed to process the maps link', 'Please check the URL and try again');
  } finally {
    onLoadingChange(false);
  }
}

/**
 * Handle current location detection
 */
export async function handleCurrentLocation(
  onUpdate: LocationUpdateCallback,
  onLoadingChange: (loading: boolean) => void
): Promise<void> {
  // Check if geolocation is available
  if (!navigator?.geolocation) {
    showToast.error('📍 Geolocation not supported', 'Geolocation is not supported in your browser');
    return;
  }

  onLoadingChange(true);
  try {
    const position = await new Promise<GeolocationCoordinates>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos.coords),
        (err) => reject(err),
        { timeout: 10000, enableHighAccuracy: true }
      );
    });

    onUpdate('lat', position.latitude.toString());
    onUpdate('lng', position.longitude.toString());

    const locationDetails: LocationDetails | null = await reverseGeocode(position.latitude, position.longitude);
    if (locationDetails) {
      // Debug: Log what we're about to set
      console.log('Setting location fields:', {
        address: locationDetails.address,
        city: locationDetails.city,
        locality: locationDetails.locality,
        state: locationDetails.state,
        country: locationDetails.country
      });
      
      // Update all location fields
      if (locationDetails.address) onUpdate('address', locationDetails.address);
      if (locationDetails.city) onUpdate('city', locationDetails.city);
      if (locationDetails.locality) onUpdate('locality', locationDetails.locality);
      if (locationDetails.fullAddress) onUpdate('fullAddress', locationDetails.fullAddress);
      if (locationDetails.state) onUpdate('state', locationDetails.state);
      if (locationDetails.country) onUpdate('country', locationDetails.country);
      
      const extractedFields = [];
      if (locationDetails.address) extractedFields.push('Street Address');
      if (locationDetails.city) extractedFields.push('City/District');
      if (locationDetails.locality) extractedFields.push('Locality/Area');
      if (locationDetails.fullAddress) extractedFields.push('Full Address');
      if (locationDetails.state) extractedFields.push('State');
      if (locationDetails.country) extractedFields.push('Country');
      
      showToast.success(
        '✅ Current location detected!', 
        `Auto-filled: ${extractedFields.join(', ')} and Coordinates`
      );
    } else {
      // Better fallback - don't set coordinates as address, leave it empty for manual input
      onUpdate('address', '');
      onUpdate('city', '');
      onUpdate('locality', '');
      onUpdate('fullAddress', '');
      onUpdate('state', '');
      onUpdate('country', '');
      
      showToast.warning(
        '⚠️ Location detected but address not found', 
        'Coordinates detected but address lookup failed. Please enter address manually.'
      );
    }
  } catch (err: any) {
    console.error('Geolocation error:', err);
    
    // Handle different error types
    if (err?.code === 1) {
      showToast.error('📍 Permission denied', 'Please enable location access in your browser settings');
    } else if (err?.code === 2) {
      showToast.error('📍 Location unavailable', 'Please check your connection and try again');
    } else if (err?.code === 3) {
      showToast.error('📍 Location request timed out', 'Please try again');
    } else if (err?.message) {
      showToast.error('📍 Location error', err.message);
    } else {
      showToast.error('📍 Location detection failed', 'Please enter your address manually');
    }
  } finally {
    onLoadingChange(false);
  }
}
