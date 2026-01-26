'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import NextImage from 'next/image';
import { Loader2, X, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface ImageUploadProps {
  label: string;
  imageType: 'pgThumbnail' | 'pgHero' | 'roomImage' | 'squareProfile' | 'galleryImage';
  onImageUpload: (url: string) => void;
  currentImage?: string;
  description?: string;
  multiple?: boolean;
}

export function ImageUpload({
  label,
  imageType,
  onImageUpload,
  currentImage,
  description,
  multiple = false,
}: ImageUploadProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [preview, setPreview] = useState<string | undefined>(currentImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`/api/upload?type=${imageType}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const data = await response.json();
      onImageUpload(data.url);
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to upload image'
      );
      setPreview(currentImage);
    } finally {
      setIsLoading(false);
    }
  };

  const getDimensions = () => {
    const sizes: Record<string, string> = {
      pgThumbnail: '400×300px (16:9)',
      pgHero: '1200×675px (16:9)',
      roomImage: '600×400px (3:2)',
      squareProfile: '300×300px (1:1)',
      galleryImage: '1200×800px (3:2)',
    };
    return sizes[imageType];
  };

  return (
    <div className="space-y-2">
      <div>
        <Label htmlFor={`upload-${imageType}`}>{label}</Label>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        <p className="text-xs text-zinc-500 mt-1">
          Recommended size: {getDimensions()}
        </p>
      </div>

      {preview ? (
        <div className="relative w-full rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <div className="relative aspect-[4/3] md:aspect-[16/9]">
            <NextImage
              src={preview}
              alt="Preview"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 500px"
            />
          </div>
          <button
            onClick={() => {
              setPreview(undefined);
              if (fileInputRef.current) fileInputRef.current.value = '';
              onImageUpload('');
            }}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-zinc-400" />
          <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
            Click to upload image
          </p>
          <p className="text-xs text-zinc-500">PNG, JPG, WebP up to 10MB</p>
        </div>
      )}

      <Input
        ref={fileInputRef}
        id={`upload-${imageType}`}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        onChange={handleFileSelect}
        disabled={isLoading}
        className="hidden"
      />

      {!preview && (
        <Button
          onClick={() => fileInputRef.current?.click()}
          disabled={isLoading}
          variant="outline"
          className="w-full"
          type="button"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Choose Image
            </>
          )}
        </Button>
      )}
    </div>
  );
}
