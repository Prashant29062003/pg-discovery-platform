"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ImageWithFallback } from '@/components/common/utils/ImageWithFallback';
import { Upload, AlertCircle } from 'lucide-react';
import { CITIES, NEIGHBOURHOODS } from '@/config';

interface ImageOverrideManagerProps {
  pgId?: string;
  onImageUpload?: (entityType: 'city' | 'neighbourhood', entityId: string, imageUrl: string) => void;
}

/**
 * Component for owners to manage and override default images for cities and neighbourhoods
 * This allows owners to use their own images instead of the default Unsplash ones
 */
export function ImageOverrideManager({ pgId, onImageUpload }: ImageOverrideManagerProps) {
  const [uploadingCity, setUploadingCity] = useState<string | null>(null);
  const [uploadingNeighbourhood, setUploadingNeighbourhood] = useState<string | null>(null);
  const [cityOverrides, setCityOverrides] = useState<Record<string, string>>({});
  const [neighbourhoodOverrides, setNeighbourhoodOverrides] = useState<Record<string, string>>({});

  const handleCityImageUpload = (cityId: string, file: File) => {
    setUploadingCity(cityId);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setCityOverrides(prev => ({
        ...prev,
        [cityId]: imageUrl
      }));
      onImageUpload?.('city', cityId, imageUrl);
      setUploadingCity(null);
    };
    reader.readAsDataURL(file);
  };

  const handleNeighbourhoodImageUpload = (neighbourhoodName: string, file: File) => {
    setUploadingNeighbourhood(neighbourhoodName);
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;
      setNeighbourhoodOverrides(prev => ({
        ...prev,
        [neighbourhoodName]: imageUrl
      }));
      onImageUpload?.('neighbourhood', neighbourhoodName, imageUrl);
      setUploadingNeighbourhood(null);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-8">
      {/* Info Banner */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex gap-3">
        <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
        <div>
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Custom Images</h3>
          <p className="text-sm text-blue-700 dark:text-blue-400">
            Upload your own images to override the default city and neighbourhood images. Images failing to load will automatically fallback to a placeholder.
          </p>
        </div>
      </div>

      {/* Cities Section */}
      <Card>
        <CardHeader>
          <CardTitle>City Images</CardTitle>
          <CardDescription>Manage images for featured cities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {CITIES.map((city) => (
              <div key={city.id} className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                {/* Current Image Preview */}
                <div className="relative h-40 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                  <ImageWithFallback
                    src={cityOverrides[city.id] || city.image}
                    alt={city.name}
                    fallbackType="city"
                    customFallback={city.fallbackImage}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-3">{city.name}</h3>
                  
                  {/* Upload Input */}
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleCityImageUpload(city.id, file);
                      }}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={uploadingCity === city.id}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingCity === city.id ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </label>

                  {cityOverrides[city.id] && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Custom image set</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Neighbourhoods Section */}
      <Card>
        <CardHeader>
          <CardTitle>Neighbourhood Images</CardTitle>
          <CardDescription>Manage images for featured neighbourhoods</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {NEIGHBOURHOODS.map((neighbourhood) => (
              <div key={neighbourhood.name} className="border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden">
                {/* Current Image Preview */}
                <div className="relative h-40 bg-zinc-100 dark:bg-zinc-900 overflow-hidden">
                  <ImageWithFallback
                    src={neighbourhoodOverrides[neighbourhood.name] || neighbourhood.image}
                    alt={neighbourhood.name}
                    fallbackType="neighbourhood"
                    customFallback={neighbourhood.fallbackImage}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-900 dark:text-white mb-1">{neighbourhood.name}</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-3">{neighbourhood.city}</p>
                  
                  {/* Upload Input */}
                  <label className="block">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleNeighbourhoodImageUpload(neighbourhood.name, file);
                      }}
                      className="hidden"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      disabled={uploadingNeighbourhood === neighbourhood.name}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      {uploadingNeighbourhood === neighbourhood.name ? 'Uploading...' : 'Upload Image'}
                    </Button>
                  </label>

                  {neighbourhoodOverrides[neighbourhood.name] && (
                    <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Custom image set</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Fallback Info */}
      <Card className="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle className="text-amber-900 dark:text-amber-300">Automatic Fallback System</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
            <li>✓ If an image fails to load, a beautiful SVG placeholder is automatically displayed</li>
            <li>✓ No broken image icons or blank spaces</li>
            <li>✓ Maintains visual consistency across all sections</li>
            <li>✓ Customize with your own images anytime</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
