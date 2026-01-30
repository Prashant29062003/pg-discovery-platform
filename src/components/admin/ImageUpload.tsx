'use client';

import { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';
import { CLOUDINARY_CONFIG, isCloudinaryClientConfigured, DEFAULT_IMAGES } from '@/lib/cloudinary';

interface ImageUploadProps {
  onImagesChange: (urls: string[]) => void;
  onImageNamesChange?: (names: string[]) => void;
  existingImages?: string[];
  existingImageNames?: string[];
  maxImages?: number;
  label?: string;
  description?: string;
  imageType?: 'pgThumbnail' | 'pgHero' | 'roomImage' | 'squareProfile' | 'galleryImage';
  pgName?: string;
}

export function ImageUpload({
  onImagesChange,
  onImageNamesChange,
  existingImages = [],
  existingImageNames = [],
  maxImages = 6,
  label = 'PG Images',
  description = 'Add photos of your PG to attract more guests',
  imageType = 'galleryImage',
  pgName = 'Property',
}: ImageUploadProps) {
  // Accept all valid image URLs (Cloudinary, fallbacks, or absolute URLs)
  const validImages = existingImages.filter(url => {
    if (!url) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  });

  const [images, setImages] = useState<string[]>(validImages);
  const [imageNames, setImageNames] = useState<string[]>(existingImageNames.slice(0, validImages.length));
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Generate automatic image name with PG name as prefix
  const generateImageName = (index: number): string => {
    const imageTypes: { [key: string]: string } = {
      pgThumbnail: 'Thumbnail',
      pgHero: 'Hero/Banner',
      roomImage: 'Room',
      squareProfile: 'Profile',
      galleryImage: 'Gallery',
    };
    const typeLabel = imageTypes[imageType] || 'Image';
    return `${pgName} - ${typeLabel} ${index + 1}`;
  };

  // Update image name
  const updateImageName = (index: number, name: string) => {
    const newNames = [...imageNames];
    newNames[index] = name || generateImageName(index);
    setImageNames(newNames);
    onImageNamesChange?.(newNames);
  };

  const cloudinaryConfigured = isCloudinaryClientConfigured();

  const handleImageUpload = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;

      // Check Cloudinary configuration
      if (!cloudinaryConfigured) {
        const fallbackUrl = DEFAULT_IMAGES.pgThumbnail;
        setError('⚠️ Cloudinary not configured. Using placeholder image.');
        toast.warning('Using placeholder image. Configure Cloudinary for real uploads.');
        
        const newImages = [...images, fallbackUrl];
        const newNames = [...imageNames, generateImageName(images.length)];
        setImages(newImages);
        setImageNames(newNames);
        onImagesChange(newImages);
        onImageNamesChange?.(newNames);
        return;
      }

      // Check if we can add more images
      const newImagesCount = Array.from(files).length;
      if (images.length + newImagesCount > maxImages) {
        setError(`Maximum ${maxImages} images allowed`);
        toast.error(`You can upload maximum ${maxImages} images`);
        return;
      }

      setUploading(true);
      setError(null);

      const uploadedUrls: string[] = [];
      const failedFiles: string[] = [];

      try {
        for (const file of Array.from(files)) {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            failedFiles.push(`${file.name} is not a valid image file`);
            continue;
          }

          // Validate file size (max 10MB)
          if (file.size > 10 * 1024 * 1024) {
            failedFiles.push(`${file.name} is too large (max 10MB)`);
            continue;
          }

          try {
            // Upload to backend API (compresses + uploads to Cloudinary)
            const formData = new FormData();
            formData.append('file', file);

            const response = await fetch(
              `/api/upload?imageType=${imageType}`,
              {
                method: 'POST',
                body: formData,
              }
            );

            if (!response.ok) {
              const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
              
              // Use fallback if Cloudinary not configured
              if (response.status === 503 && errorData.fallbackUrl) {
                uploadedUrls.push(errorData.fallbackUrl);
                toast.warning(`${file.name} using fallback image`);
              } else {
                throw new Error(errorData.error || 'Upload failed');
              }
            } else {
              const data = await response.json();
              if (data.url) {
                uploadedUrls.push(data.url);
                toast.success(`✅ ${file.name} uploaded to Cloudinary`);
              } else {
                failedFiles.push(`${file.name} upload returned no URL`);
              }
            }
          } catch (err) {
            const message = err instanceof Error ? err.message : `${file.name} upload failed`;
            failedFiles.push(message);
          }
        }

        if (uploadedUrls.length > 0) {
          const newImages = [...images, ...uploadedUrls];
          const newNames = [...imageNames];
          
          for (let i = 0; i < uploadedUrls.length; i++) {
            newNames.push(generateImageName(images.length + i));
          }
          
          setImages(newImages);
          setImageNames(newNames);
          onImagesChange(newImages);
          onImageNamesChange?.(newNames);
        }

        if (failedFiles.length > 0) {
          const errorMessage = failedFiles.join(', ');
          setError(errorMessage);
          if (uploadedUrls.length === 0) {
            toast.error(errorMessage);
          } else {
            toast.warning(`Some files failed: ${errorMessage}`);
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed';
        setError(message);
        toast.error(message);
      } finally {
        setUploading(false);
      }
    },
    [images, maxImages, onImagesChange, imageType, cloudinaryConfigured]
  );

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleImageUpload(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newNames = imageNames.filter((_, i) => i !== index);
    setImages(newImages);
    setImageNames(newNames);
    onImagesChange(newImages);
    onImageNamesChange?.(newNames);
    toast.success('Image removed');
  };

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">{label}</Label>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">{description}</p>
      </div>

      {!cloudinaryConfigured && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            ⚠️ Cloudinary client configuration incomplete. Set NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME and NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET. Using placeholder images as fallback.
          </AlertDescription>
        </Alert>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Upload Area */}
      {images.length < maxImages && (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 transition-all ${
            dragActive
              ? 'border-orange-500 bg-orange-50 dark:bg-orange-950/20'
              : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-400 dark:hover:border-zinc-500'
          } cursor-pointer`}
        >
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) => handleImageUpload(e.target.files)}
            disabled={uploading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          <div className="flex flex-col items-center justify-center gap-3">
            {uploading ? (
              <>
                <Loader2 className="h-10 w-10 text-orange-600 animate-spin" />
                <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                  Uploading images...
                </p>
              </>
            ) : (
              <>
                <Upload className="h-10 w-10 text-zinc-400" />
                <div className="text-center">
                  <p className="text-sm font-medium text-zinc-900 dark:text-white">
                    Drag images here or click to browse
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    {images.length}/{maxImages} images • JPG, PNG up to 5MB each
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Image Gallery */}
      {images.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Uploaded Images ({images.length}/{maxImages})
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {images.map((image, index) => (
              <div
                key={index}
                className={`relative group rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 aspect-video`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`PG Image ${index + 1}`}
                  className="w-full h-full object-cover"
                  onError={() => {
                    // Handle image load errors silently
                    console.warn(`Failed to load image at index ${index}`);
                  }}
                />

                {/* Overlay with remove button */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => removeImage(index)}
                    type="button"
                    className="p-2 bg-red-600 hover:bg-red-700 rounded-full text-white transition-colors"
                    title="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Image counter badge */}
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded">
                  {index + 1}
                </div>
              </div>
            ))}
          </div>

          {/* Image Name Inputs */}
          <div className="space-y-2 mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-700">
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Image Labels (Optional - will auto-generate if left empty)
            </p>
            <div className="grid grid-cols-1 gap-2">
              {images.map((_, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <span className="text-xs font-medium text-zinc-500 w-6 text-right">{index + 1}.</span>
                  <input
                    type="text"
                    placeholder={generateImageName(index)}
                    value={imageNames[index] || ''}
                    onChange={(e) => updateImageName(index, e.target.value)}
                    className="flex-1 px-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty state message */}
      {images.length === 0 && !uploading && (
        <Card className="p-6 border-dashed bg-zinc-50 dark:bg-zinc-900/30 border-zinc-300 dark:border-zinc-700">
          <div className="flex items-center justify-center gap-3 text-center">
            <ImageIcon className="h-5 w-5 text-zinc-400" />
            <p className="text-sm text-zinc-600 dark:text-zinc-400">
              No images added yet. Upload to get started.
            </p>
          </div>
        </Card>
      )}

      {/* Info text */}
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        💡 <strong>Tip:</strong> Upload a minimum of 3 high-quality images for better guest engagement.
        First image will be used as thumbnail on listing cards.
      </p>
    </div>
  );
}
