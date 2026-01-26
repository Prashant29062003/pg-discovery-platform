/**
 * Location handlers for geolocation and maps integration
 */
import { toast } from 'sonner';
import { extractCoordinatesFromMapsUrl, reverseGeocode } from './location';

export interface LocationUpdateCallback {
  (key: 'lat' | 'lng' | 'address', value: string): void;
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
    toast.error('🗺️ Please paste a valid Google Maps link');
    return;
  }

  onLoadingChange(true);
  try {
    const coords = extractCoordinatesFromMapsUrl(mapsLink);
    if (!coords) {
      toast.error('🗺️ Could not extract coordinates. Please ensure the link contains location data (e.g., https://maps.google.com/?q=latitude,longitude)');
      return;
    }

    onUpdate('lat', coords.lat.toString());
    onUpdate('lng', coords.lng.toString());

    try {
      const address = await reverseGeocode(coords.lat, coords.lng);
      if (address) {
        onUpdate('address', address);
        toast.success('✅ Location extracted successfully!');
      } else {
        toast.success('✅ Coordinates extracted! Please fill the address field manually.');
      }
    } catch (geoErr) {
      console.error('Reverse geocode error:', geoErr);
      // Still show success even if reverse geocoding fails
      toast.success('✅ Coordinates extracted! Please fill the address field manually.');
    }
  } catch (err: any) {
    console.error('Error processing maps link:', err);
    toast.error('🗺️ Failed to process the maps link. Please check the URL and try again.');
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
    toast.error('Geolocation is not supported in your browser');
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

    const address = await reverseGeocode(position.latitude, position.longitude);
    if (address) {
      onUpdate('address', address);
      toast.success('Current location detected successfully!');
    } else {
      onUpdate('address', `${position.latitude.toFixed(4)}, ${position.longitude.toFixed(4)}`);
      toast.success('Location detected! Please refine the address.');
    }
  } catch (err: any) {
    console.error('Geolocation error:', err);
    
    // Handle different error types
    if (err?.code === 1) {
      toast.error('📍 Permission denied. Please enable location access in your browser settings.');
    } else if (err?.code === 2) {
      toast.error('📍 Unable to retrieve your location. Please check your connection and try again.');
    } else if (err?.code === 3) {
      toast.error('📍 Location request timed out. Please try again.');
    } else if (err?.message) {
      toast.error(`📍 Location error: ${err.message}`);
    } else {
      toast.error('📍 Failed to detect current location. Please enter your address manually.');
    }
  } finally {
    onLoadingChange(false);
  }
}
