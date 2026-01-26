import NextImage from "next/image";
import { useState } from "react";
import { FALLBACK_URLS } from "@/constants/image-fallbacks";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  fallback?: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  [key: string]: any;
}

export function ImageWithFallback({
  src,
  alt,
  fallback = FALLBACK_URLS.generic,
  className,
  ...props
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <NextImage
      {...props}
      src={imageSrc}
      alt={alt}
      className={className}
      onError={() => setImageSrc(fallback)}
      onLoadingComplete={() => setIsLoading(false)}
    />
  );
}
