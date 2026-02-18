'use client';

import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle,
  Loader2 
} from 'lucide-react';
import { showToast } from '@/utils/toast';
import { cn } from '@/utils';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILES = 20; // More images for property gallery
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

const propertyImageUploadSchema = z.object({
  images: z.array(z.instanceof(File)).max(MAX_FILES, `Maximum ${MAX_FILES} images allowed`),
});

type PropertyImageUploadFormData = z.infer<typeof propertyImageUploadSchema>;

interface PropertyImageUploadProps {
  pgId: string;
  existingImages?: Array<{
    id: string;
    url: string;
    name: string;
  }>;
  onImagesChange?: (images: Array<{ id: string; url: string; name: string }>) => void;
  className?: string;
}

export function PropertyImageUpload({ 
  pgId, 
  existingImages = [], 
  onImagesChange,
  className 
}: PropertyImageUploadProps) {
  const [previewImages, setPreviewImages] = useState<Array<{
    file?: File;
    url: string;
    name: string;
    id: string;
    uploading?: boolean;
    error?: string;
  }>>(existingImages.map(img => ({ ...img, url: img.url, name: img.name, id: img.id })));
  
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgressLocal] = useState(0);
  const [uploadingImages, setUploadingImages] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<PropertyImageUploadFormData>({
    resolver: zodResolver(propertyImageUploadSchema),
    defaultValues: {
      images: [],
    },
  });

  const validateFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, and WebP are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB.';
    }
    return null;
  }, []);

  const createPreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleFileSelect = useCallback(async (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = previewImages.length + newFiles.length;

    if (totalFiles > MAX_FILES) {
      showToast.error('Too many files', `Maximum ${MAX_FILES} images allowed`);
      return;
    }

    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    }

    if (errors.length > 0) {
      showToast.error('File validation errors', errors.join('\n'));
    }

    if (validFiles.length === 0) return;

    // Create previews
    const newPreviews = await Promise.all(
      validFiles.map(async (file) => {
        const url = await createPreview(file);
        return {
          file,
          url,
          name: file.name,
          id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          uploading: false,
        };
      })
    );

    setPreviewImages(prev => [...prev, ...newPreviews]);
    setValue('images', [...(watch('images') || []), ...validFiles]);
    
    if (onImagesChange) {
      onImagesChange([
        ...existingImages,
        ...newPreviews.map(p => ({ id: p.id, url: p.url, name: p.name }))
      ]);
    }
  }, [previewImages, validateFile, createPreview, setValue, watch, onImagesChange, existingImages]);

  const uploadImage = useCallback(async (image: typeof previewImages[0]) => {
    if (!image.file) return;

    try {
      setUploadingImages(true);
      setUploadProgressLocal(0);

      const formData = new FormData();
      formData.append('file', image.file);
      formData.append('pgId', pgId);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgressLocal((prev: number) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      const response = await fetch('/api/upload/property-image', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgressLocal(100);

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      
      if (result.success) {
        // Update preview
        setPreviewImages(prev => 
          prev.map(img => 
            img.id === image.id 
              ? { ...img, uploading: false, url: result.data.url, id: result.data.id }
              : img
          )
        );

        showToast.success('Property image uploaded successfully', image.name);
      } else {
        throw new Error(result.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      showToast.error('Upload failed', `${image.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      setPreviewImages(prev => 
        prev.map(img => 
          img.id === image.id 
            ? { ...img, uploading: false, error: 'Upload failed' }
            : img
        )
      );
    } finally {
      setUploadingImages(false);
      setUploadProgressLocal(0);
    }
  }, [pgId]);

  const removeImage = useCallback((imageId: string) => {
    setPreviewImages(prev => prev.filter(img => img.id !== imageId));
    setValue('images', (watch('images') || []).filter((_, index) => {
      const currentPreviews = previewImages.slice(0, index);
      return !currentPreviews.some(p => p.id === imageId);
    }));
    
    if (onImagesChange) {
      onImagesChange(previewImages.filter(img => img.id !== imageId).map(p => ({ 
        id: p.id, 
        url: p.url, 
        name: p.name 
      })));
    }
  }, [previewImages, setValue, watch, onImagesChange]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files);
    }
  }, [handleFileSelect]);

  return (
    <Card className={cn('w-full', className)}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ImageIcon className="w-5 h-5" />
          Property Images
          <Badge variant="outline" className="ml-auto">
            {previewImages.length}/{MAX_FILES}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Upload Area */}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-muted-foreground/50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
          <p className="text-sm font-medium mb-1">
            Drop images here or click to browse
          </p>
          <p className="text-xs text-muted-foreground mb-3">
            JPEG, PNG, WebP up to 5MB each (max {MAX_FILES} images)
          </p>
          <Input
            type="file"
            multiple
            accept={ALLOWED_TYPES.join(',')}
            className="hidden"
            id="property-images"
            {...register('images', {
              onChange: (e) => handleFileSelect(e.target.files),
            })}
          />
          <Label htmlFor="property-images">
            <Button type="button" variant="outline" className="cursor-pointer">
              Select Images
            </Button>
          </Label>
          {errors.images && (
            <p className="text-xs text-destructive mt-2">{errors.images.message}</p>
          )}
        </div>

        {/* Upload Progress */}
        {uploadingImages && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading images...</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Image Previews */}
        {previewImages.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-muted">
                  <img
                    src={image.url}
                    alt={image.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Status Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  {image.uploading ? (
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  ) : image.error ? (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  ) : !image.id.startsWith('temp-') ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => uploadImage(image)}
                      disabled={uploadingImages}
                      className="h-8 px-3"
                    >
                      Upload
                    </Button>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(image.id)}
                  disabled={image.uploading}
                >
                  <X className="w-3 h-3" />
                </Button>

                {/* Image Name */}
                <p className="text-xs text-muted-foreground mt-1 truncate">
                  {image.name}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Instructions */}
        <div className="text-xs text-muted-foreground space-y-1">
          <p>• Drag and drop images or click to browse</p>
          <p>• Images will be uploaded to cloud storage</p>
          <p>• First image will be set as the property's primary image</p>
          <p>• Maximum {MAX_FILES} images allowed for property gallery</p>
        </div>
      </CardContent>
    </Card>
  );
}
