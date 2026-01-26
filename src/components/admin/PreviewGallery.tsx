'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Home } from 'lucide-react';

interface PreviewGalleryProps {
  images: string[];
  imageNames?: string[];
  pgName: string;
}

export function PreviewGallery({ images, imageNames = [], pgName }: PreviewGalleryProps) {
  const [failedImages, setFailedImages] = useState<Set<number>>(new Set());

  const handleImageError = (index: number) => {
    setFailedImages(prev => new Set(prev).add(index));
  };

  if (!images || images.length === 0) {
    return (
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-900 border border-zinc-200 dark:border-zinc-800 h-[300px] md:h-[500px] flex flex-col items-center justify-center text-zinc-500 dark:text-zinc-400">
        <div className="text-center space-y-3">
          <div className="p-4 rounded-full bg-white/50 dark:bg-zinc-700/50 w-fit mx-auto">
            <Home className="w-12 h-12 text-blue-500 dark:text-blue-400" />
          </div>
          <div>
            <p className="font-semibold text-lg text-zinc-700 dark:text-zinc-300">No Images Yet</p>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">Add photos to showcase your property</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main large image */}
      {!failedImages.has(0) && (
        <div className="relative rounded-3xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 h-[300px] md:h-[500px]">
          <Image
            src={images[0]}
            alt={pgName}
            fill
            className="object-cover"
            priority
            onError={() => handleImageError(0)}
          />
        </div>
      )}

      {/* Gallery grid for remaining images */}
      {images.length > 1 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.slice(1).map((image, idx) => {
            const imageIndex = idx + 1;
            const isFailedImage = failedImages.has(imageIndex);

            return (
              <div
                key={idx}
                className={`relative rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 aspect-square hover:shadow-lg transition-shadow cursor-pointer group ${
                  isFailedImage ? 'flex items-center justify-center' : ''
                }`}
              >
                {!isFailedImage && (
                  <Image
                    src={image}
                    alt={`${pgName} - ${imageNames[imageIndex] || `Image ${imageIndex}`}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                    onError={() => handleImageError(imageIndex)}
                  />
                )}
                {isFailedImage && (
                  <div className="w-full h-full flex flex-col items-center justify-center text-zinc-400 bg-zinc-100 dark:bg-zinc-800">
                    <span className="text-xs">Image unavailable</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
