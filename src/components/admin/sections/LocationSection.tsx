/**
 * Location Tab Content Component
 */
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, ExternalLink } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { handleGoogleMapsLink, handleCurrentLocation } from '../utils/locationHandlers';

interface LocationSectionProps {
  address: string;
  fullAddress: string;
  city: string;
  locality: string;
  lat: string;
  lng: string;
  errors: Record<string, string>;
  onUpdate: (key: string, value: string) => void;
}

export function LocationSection({
  address,
  fullAddress,
  city,
  locality,
  lat,
  lng,
  errors,
  onUpdate,
}: LocationSectionProps) {
  const [locationLoading, setLocationLoading] = useState(false);

  const handleMapsLinkSubmit = async (mapsLink: string) => {
    await handleGoogleMapsLink(mapsLink, onUpdate, setLocationLoading);
  };

  const handleLocationDetection = async () => {
    await handleCurrentLocation(onUpdate, setLocationLoading);
  };

  return (
    <>
      {/* Quick Location Setup */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Quick Location Setup</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">Choose how to set your property location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Maps Link Option */}
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4 space-y-3">
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">From Google Maps Link</h4>
            <div className="flex gap-2">
              <Input
                id="mapsLink"
                type="url"
                placeholder="Paste Google Maps link (e.g., https://maps.google.com/?q=12.9352,77.6245)"
                className="flex-1 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
              />
              <Button
                type="button"
                onClick={async () => {
                  const mapsLink = (
                    document.getElementById('mapsLink') as HTMLInputElement
                  )?.value;
                  await handleMapsLinkSubmit(mapsLink);
                  if (document.getElementById('mapsLink')) {
                    (document.getElementById('mapsLink') as HTMLInputElement).value = '';
                  }
                }}
                disabled={locationLoading}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <MapPin className="h-4 w-4 mr-2" />
                {locationLoading ? 'Processing...' : 'Extract'}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              💡 Right-click on location in Google Maps → "What's here?" → Copy the link
            </p>
          </div>

          {/* Current Location Option */}
          <div className="border border-zinc-200 dark:border-zinc-700 rounded-lg p-4">
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
              Use Current Location
            </h4>
            <Button
              type="button"
              onClick={handleLocationDetection}
              disabled={locationLoading}
              variant="outline"
              className="w-full border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <MapPin className="h-4 w-4 mr-2" />
              {locationLoading ? 'Detecting...' : '📍 Use My Current Location'}
            </Button>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
              Share your device location to auto-fill coordinates and address
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Location Details */}
      <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader>
          <CardTitle className="text-zinc-900 dark:text-zinc-100">Location Details</CardTitle>
          <CardDescription className="text-zinc-600 dark:text-zinc-400">Address and coordinates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Street Address */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Street Address *
            </label>
            <Input
              value={address}
              onChange={(e) => onUpdate('address', e.target.value)}
              placeholder="e.g., 123 Main Street"
              className={`bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 ${
                errors.address ? 'border-red-500 dark:border-red-500' : ''
              }`}
            />
            {errors.address && (
              <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.address}</p>
            )}
          </div>

          {/* Full Address */}
          <div>
            <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
              Full Address
            </label>
            <Textarea
              value={fullAddress}
              onChange={(e) => onUpdate('fullAddress', e.target.value)}
              placeholder="Complete address with building details"
              rows={3}
              className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
            />
          </div>

          {/* City and Locality */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                City *
              </label>
              <Input
                value={city}
                onChange={(e) => onUpdate('city', e.target.value)}
                placeholder="e.g., Bangalore"
                className={`bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 ${
                  errors.city ? 'border-red-500 dark:border-red-500' : ''
                }`}
              />
              {errors.city && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Locality/Area *
              </label>
              <Input
                value={locality}
                onChange={(e) => onUpdate('locality', e.target.value)}
                placeholder="e.g., Indiranagar"
                className={`bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700 ${
                  errors.locality ? 'border-red-500 dark:border-red-500' : ''
                }`}
              />
              {errors.locality && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-1">{errors.locality}</p>
              )}
            </div>
          </div>

          {/* Coordinates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Latitude
              </label>
              <Input
                type="number"
                step="0.000001"
                value={lat}
                onChange={(e) => onUpdate('lat', e.target.value)}
                placeholder="e.g., 12.9352"
                className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For map integration</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-1">
                Longitude
              </label>
              <Input
                type="number"
                step="0.000001"
                value={lng}
                onChange={(e) => onUpdate('lng', e.target.value)}
                placeholder="e.g., 77.6245"
                className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border-zinc-200 dark:border-zinc-700"
              />
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">For map integration</p>
            </div>
          </div>

          {/* Google Maps Link Button */}
          {lat && lng && (
            <div className="pt-2">
              <a
                href={`https://www.google.com/maps/search/${lat},${lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button
                  type="button"
                  variant="outline"
                  className="border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 gap-2"
                >
                  <MapPin className="h-4 w-4" />
                  Open in Google Maps
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </a>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2">
                ✅ Coordinates saved. Click to verify location on Google Maps.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
