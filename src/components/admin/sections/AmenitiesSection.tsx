/**
 * Amenities Tab Content Component
 */
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { COMMON_AMENITIES } from '../utils/amenities';

interface AmenitiesSectionProps {
  amenities: string[];
  onUpdate: (key: string, value: string[]) => void;
  toggleAmenity: (amenity: string) => void;
}

export function AmenitiesSection({ amenities, toggleAmenity }: AmenitiesSectionProps) {
  return (
    <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Amenities & Facilities</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">Select all available amenities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Amenities Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {COMMON_AMENITIES.map((amenity) => (
            <label
              key={amenity}
              className="flex items-center gap-2 p-2 border border-zinc-200 dark:border-zinc-700 rounded-md cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              <input
                type="checkbox"
                checked={amenities.includes(amenity)}
                onChange={() => toggleAmenity(amenity)}
                className="h-4 w-4 rounded"
              />
              <span className="text-sm text-zinc-900 dark:text-zinc-100">{amenity}</span>
            </label>
          ))}
        </div>

        {/* Selected Amenities */}
        {amenities.length > 0 && (
          <div className="mt-4">
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-2">
              Selected ({amenities.length}):
            </p>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity: string) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100"
                >
                  {amenity}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
