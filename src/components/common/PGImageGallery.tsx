'use client';

import Image from 'next/image';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { DEFAULT_IMAGES, isCloudinaryUrl } from '@/lib/cloudinary';

interface PGImageGalleryProps {
  images: string[] | null | undefined;
  pgName: string;
  variant?: 'hero' | 'card' | 'thumbnail';
  className?: string;
}

/**
 * Professional image gallery component for PG listings
 * Shows uploaded Cloudinary images or defaults to fallback images
 */
export function PGImageGallery({
  images,
  pgName,
  variant = 'hero',
  className = '',
}: PGImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  // Use provided images or fall back to default
  const displayImages = images && images.length > 0 ? images : [DEFAULT_IMAGES.pgThumbnail];
  const currentImage = displayImages[currentImageIndex];

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1));
  };

  // Get dimensions based on variant
  const dimensions = {
    hero: { width: 1200, height: 675 },
    card: { width: 400, height: 300 },
    thumbnail: { width: 300, height: 200 },
  };

  const { width, height } = dimensions[variant];

  return (
    <>
      {/* Main Image Container */}
      <div className={`relative bg-zinc-100 dark:bg-zinc-800 overflow-hidden ${className}`}>
        {/* Image */}
        <div className="relative w-full h-full group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={currentImage}
            alt={`${pgName} - Image ${currentImageIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 cursor-pointer"
            onClick={() => setShowLightbox(true)}
          />

          {/* Overlay gradient on hero */}
          {variant === 'hero' && (
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          )}

          {/* Image Counter Badge */}
          {displayImages.length > 1 && (
            <div className="absolute top-4 right-4 bg-black/60 text-white text-sm font-medium px-3 py-1 rounded-full backdrop-blur-sm">
              {currentImageIndex + 1} / {displayImages.length}
            </div>
          )}

          {/* Navigation Arrows */}
          {displayImages.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-all opacity-0 group-hover:opacity-100 hover:scale-110"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* Thumbnail Strip (for 3+ images) */}
        {displayImages.length > 1 && variant === 'hero' && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 px-4">
            {displayImages.slice(0, 5).map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all hover:scale-110 ${
                  index === currentImageIndex
                    ? 'border-white ring-2 ring-orange-500'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
            {displayImages.length > 5 && (
              <div className="w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center text-white text-xs font-medium">
                +{displayImages.length - 5}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 backdrop-blur-sm">
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Close lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Main Image */}
          <div className="relative w-full h-full max-w-5xl max-h-[85vh] flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={currentImage}
              alt={`${pgName} - ${currentImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation */}
            {displayImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevious}
                  className="absolute left-4 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-4 p-3 bg-white/20 hover:bg-white/30 text-white rounded-full transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Counter */}
          <div className="absolute bottom-4 text-white text-center">
            <p className="text-sm">
              {currentImageIndex + 1} / {displayImages.length}
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Simple thumbnail image component with fallback
 * Used for smaller image displays (cards, listings)
 */
export function PGImageThumbnail({
  src,
  alt,
  className = '',
}: {
  src?: string | null;
  alt: string;
  className?: string;
}) {
  const imageSrc = src || DEFAULT_IMAGES.pgThumbnail;

  return (
    <div className={`relative bg-zinc-100 dark:bg-zinc-800 overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={imageSrc}
        alt={alt}
        className="w-full h-full object-cover"
        loading="lazy"
      />
    </div>
  );
}
