"use client";

import React from 'react';
import Image from 'next/image';
import { useImageWithFallback } from '@/hooks/image/useImageWithFallback';

export interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallbackType?: 'city' | 'neighbourhood' | 'generic';
  customFallback?: string; // Owner-provided fallback image
  className?: string;
  onError?: (error: Error) => void;
  // For regular img tag
  width?: number;
  height?: number;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  // For Next/Image
  useNextImage?: boolean;
  priority?: boolean;
  sizes?: string;
}

/**
 * Image component with automatic fallback handling
 * Supports both <img> and Next.js <Image> components
 * Owners can provide custom fallback images via customFallback prop
 */
export const ImageWithFallback = React.forwardRef<
  HTMLImageElement,
  ImageWithFallbackProps
>(
  (
    {
      src,
      alt,
      fallbackType = 'generic',
      customFallback,
      className,
      onError,
      width,
      height,
      objectFit = 'cover',
      useNextImage = false,
      priority = false,
      sizes,
      ...props
    },
    ref
  ) => {
    const { src: imageSrc, isError, isLoading, handleError, handleLoad } =
      useImageWithFallback({
        src,
        fallbackType,
        alt,
        onError,
        customFallback,
      });

    if (useNextImage && width && height) {
      return (
        <Image
          ref={ref as React.Ref<HTMLImageElement>}
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          sizes={sizes}
          onError={(e) => {
            handleError();
          }}
          onLoad={handleLoad}
          className={className}
          {...(props as any)}
        />
      );
    }

    return (
      <img
        ref={ref}
        src={imageSrc}
        alt={alt}
        className={className}
        onError={(e) => {
          handleError();
        }}
        onLoad={handleLoad}
        style={{
          objectFit: objectFit as any,
          ...((props as any).style || {}),
        }}
        {...props}
      />
    );
  }
);

ImageWithFallback.displayName = 'ImageWithFallback';
