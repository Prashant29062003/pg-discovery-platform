/**
 * Amenities Tab Content Component
 */
import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X } from 'lucide-react';
import { COMMON_AMENITIES, toggleAmenity, filterCustomAmenities } from '../utils/amenities';
import { cn } from '@/utils';

interface AmenitiesSectionProps {
  amenities: string[];
  onUpdate: (key: string, value: string[]) => void;
}

export function AmenitiesSection({ amenities, onUpdate }: AmenitiesSectionProps) {
  const [customAmenity, setCustomAmenity] = useState('');

  // Combine common amenities with custom ones for the checklist
  const allAmenities = [...COMMON_AMENITIES, ...filterCustomAmenities(amenities)];

  const addCustomAmenity = () => {
    if (customAmenity.trim() && !amenities.includes(customAmenity.trim())) {
      const updatedAmenities = [...amenities, customAmenity.trim()];
      onUpdate('amenities', updatedAmenities);
      setCustomAmenity('');
    }
  };

  const removeAmenity = (amenityToRemove: string) => {
    const updatedAmenities = amenities.filter(a => a !== amenityToRemove);
    onUpdate('amenities', updatedAmenities);
  };

  const handleToggleAmenity = (amenity: string) => {
    const updatedAmenities = toggleAmenity(amenities, amenity);
    onUpdate('amenities', updatedAmenities);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomAmenity();
    }
  };

  return (
    <Card className="border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
      <CardHeader>
        <CardTitle className="text-zinc-900 dark:text-zinc-100">Amenities & Facilities</CardTitle>
        <CardDescription className="text-zinc-600 dark:text-zinc-400">Select all available amenities or add custom ones</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* All Amenities Grid (Common + Custom) */}
        <div>
          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
            All Amenities 
            {amenities.filter(a => !COMMON_AMENITIES.includes(a)).length > 0 && (
              <span className="ml-2 text-xs bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full">
                +{amenities.filter(a => !COMMON_AMENITIES.includes(a)).length} custom
              </span>
            )}
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {allAmenities.map((amenity: string) => (
              <label
                key={amenity}
                className={cn(
                  "flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-colors",
                  COMMON_AMENITIES.includes(amenity) 
                    ? "border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800"
                    : "border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-950/30 hover:bg-orange-100 dark:hover:bg-orange-900/50"
                )}
              >
                <input
                  type="checkbox"
                  checked={amenities.includes(amenity)}
                  onChange={() => handleToggleAmenity(amenity)}
                  className="h-4 w-4 rounded"
                />
                <span className="text-sm text-zinc-900 dark:text-zinc-100">
                  {amenity}
                  {!COMMON_AMENITIES.includes(amenity) && (
                    <span className="ml-1 text-xs text-orange-600 dark:text-orange-400">✨</span>
                  )}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Custom Amenities */}
        <div>
          <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">Custom Amenities</h4>
          <div className="space-y-3">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-orange-500/20 to-purple-500/20 rounded-lg blur-sm"></div>
              <div className="relative flex gap-2 p-1 bg-white dark:bg-zinc-800 border-2 border-dashed border-zinc-300 dark:border-zinc-600 rounded-lg hover:border-orange-400 dark:hover:border-orange-500 transition-colors">
                <Input
                  placeholder="Add custom amenity (e.g., Rooftop Garden, Game Room, Library, etc.)"
                  value={customAmenity}
                  onChange={(e) => setCustomAmenity(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="flex-1 border-0 bg-transparent focus:ring-0 focus:outline-none text-zinc-900 dark:text-zinc-100 placeholder-zinc-500 dark:placeholder-zinc-400"
                />
                <Button 
                  onClick={addCustomAmenity}
                  disabled={!customAmenity.trim() || amenities.includes(customAmenity.trim())}
                  size="sm"
                  variant={customAmenity.trim() && !amenities.includes(customAmenity.trim()) ? "default" : "outline"}
                  className="bg-orange-600 hover:bg-orange-700 text-white border-orange-600 hover:border-orange-700 disabled:border-zinc-300 disabled:bg-zinc-100 disabled:text-zinc-500 dark:disabled:border-zinc-600 dark:disabled:bg-zinc-700 dark:disabled:text-zinc-400"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            
            {/* Popular Custom Suggestions */}
            <div className="text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-50 dark:bg-zinc-800/50 p-3 rounded-md border border-zinc-200 dark:border-zinc-700">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">💡 Popular suggestions:</span> 
              <span className="ml-2 text-zinc-600 dark:text-zinc-400">Rooftop Garden • Game Room • Library • Music Room • Prayer Room • BBQ Area • Swimming Pool • Spa • Yoga Room</span>
            </div>
          </div>
        </div>

        {/* Selected Amenities */}
        {amenities.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mb-3">
              Selected Amenities ({amenities.length}):
            </h4>
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity: string) => (
                <Badge
                  key={amenity}
                  variant="secondary"
                  className="bg-zinc-200 dark:bg-zinc-700 text-zinc-900 dark:text-zinc-100 pr-1"
                >
                  {amenity}
                  <button
                    onClick={() => removeAmenity(amenity)}
                    className="ml-1 hover:text-red-600 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {amenities.length === 0 && (
          <div className="text-center py-8 text-zinc-500 dark:text-zinc-400">
            <p className="text-sm">No amenities selected yet</p>
            <p className="text-xs mt-1">Select from common amenities or add custom ones</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
