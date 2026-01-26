/**
 * Images Tab Content Component
 * Separates thumbnail and gallery images with proper classification
 */
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { Image as ImageIcon, Camera, Images } from 'lucide-react';

interface ImagesSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
}

export function ImagesSection({ images, onImagesChange }: ImagesSectionProps) {
  const [thumbnailImage, setThumbnailImage] = useState<string>(images?.[0] || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(images?.slice(1) || []);

  // Sync local state with parent
  useEffect(() => {
    setThumbnailImage(images?.[0] || '');
    setGalleryImages(images?.slice(1) || []);
  }, [images]);

  // Handle thumbnail change
  const handleThumbnailChange = (urls: string[]) => {
    const url = urls[0] || '';
    setThumbnailImage(url);
    const allImages = url ? [url, ...galleryImages] : galleryImages;
    onImagesChange(allImages);
  };

  // Handle gallery images change
  const handleGalleryImagesChange = (urls: string[]) => {
    setGalleryImages(urls);
    const allImages = thumbnailImage ? [thumbnailImage, ...urls] : urls;
    onImagesChange(allImages);
  };

  return (
    <div className="space-y-6">
      {/* Thumbnail Image */}
      <Card className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <CardTitle className="text-zinc-900 dark:text-zinc-100">Thumbnail Image</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Main image shown on listing cards
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {thumbnailImage && (
            <div className="relative group">
              <img
                src={thumbnailImage}
                alt="Thumbnail preview"
                className="w-full h-48 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-amber-600 dark:bg-amber-500 text-white">Thumbnail</Badge>
              </div>
            </div>
          )}
          <ImageUpload
            onImagesChange={handleThumbnailChange}
            existingImages={thumbnailImage ? [thumbnailImage] : []}
            maxImages={1}
            label="Thumbnail Image"
            description="Upload the main image for your PG (shown on cards and listings)"
            imageType="pgThumbnail"
          />
        </CardContent>
      </Card>

      {/* Gallery Images */}
      <Card className="border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Images className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <CardTitle className="text-zinc-900 dark:text-zinc-100">Gallery Images</CardTitle>
              <CardDescription className="text-zinc-600 dark:text-zinc-400">
                Additional photos for detailed property view ({galleryImages.length}/5)
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {galleryImages.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {galleryImages.map((image, index) => (
                <div key={`gallery-${index}`} className="relative group">
                  <img
                    src={image}
                    alt={`Gallery image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg border border-zinc-200 dark:border-zinc-700 group-hover:border-blue-400 dark:group-hover:border-blue-500 transition-colors"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-blue-600 dark:bg-blue-500 text-white text-xs">
                      {index + 1}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
          <ImageUpload
            onImagesChange={handleGalleryImagesChange}
            existingImages={galleryImages}
            maxImages={5}
            label="Gallery Images"
            description="Upload up to 5 additional photos showing different areas of your PG"
            imageType="galleryImage"
          />
        </CardContent>
      </Card>

      {/* Image Summary */}
      <Card className="border border-zinc-200 dark:border-zinc-700 bg-gradient-to-r from-zinc-50 to-zinc-100 dark:from-zinc-800 dark:to-zinc-700">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <ImageIcon className="w-5 h-5 text-zinc-600 dark:text-zinc-300 mt-1 flex-shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                Image Upload Summary
              </p>
              <ul className="text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-amber-600 dark:bg-amber-400 rounded-full" />
                  <span>
                    Thumbnail: <span className="font-medium text-zinc-900 dark:text-zinc-100">{thumbnailImage ? '✓ Set' : '✗ Not set'}</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full" />
                  <span>
                    Gallery Images: <span className="font-medium text-zinc-900 dark:text-zinc-100">{galleryImages.length}/5</span>
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                  <span>
                    Total Images: <span className="font-medium text-zinc-900 dark:text-zinc-100">{images.length}</span>
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
