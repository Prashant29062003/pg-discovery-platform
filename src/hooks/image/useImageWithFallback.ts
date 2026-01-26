import { useState, useCallback } from 'react';
import { FALLBACK_URLS } from '@/constants/image-fallbacks';

interface ImageConfig {
  src: string;
  fallbackType?: 'city' | 'neighbourhood' | 'generic';
  alt: string;
  onError?: (error: Error) => void;
  customFallback?: string; // Owner-provided fallback image
}

export function useImageWithFallback({
  src,
  fallbackType = 'generic',
  alt,
  onError,
  customFallback,
}: ImageConfig) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fallbackSrc = customFallback || FALLBACK_URLS[fallbackType];

  const handleError = useCallback(() => {
    console.warn(`Failed to load image: ${src}, using fallback`);
    setIsError(true);
    setImageSrc(fallbackSrc);
    
    if (onError) {
      onError(new Error(`Failed to load image: ${src}`));
    }
  }, [src, fallbackSrc, onError]);

  const handleLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  return {
    src: imageSrc,
    alt,
    isError,
    isLoading,
    handleError,
    handleLoad,
    fallbackSrc,
  };
}

export interface ImageWithFallbackProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackType?: 'city' | 'neighbourhood' | 'generic';
  customFallback?: string; // Owner-provided fallback
  showPlaceholder?: boolean;
}
