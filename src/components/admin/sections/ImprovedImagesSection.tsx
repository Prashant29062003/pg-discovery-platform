/**
 * Professional Images Section Component
 * Enhanced with drag-and-drop reordering, image optimization, and better UX
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { 
  Image as ImageIcon, 
  Camera, 
  Images, 
  Upload, 
  X, 
  Move, 
  Star,
  Eye,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  ImageOff
} from 'lucide-react';
import { cn } from '@/utils';
import { toast } from 'sonner';
import { DeleteConfirmationDialog, useDeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';

interface ImageItem {
  url: string;
  id: string;
  name?: string;
  size?: number;
  type?: string;
  isThumbnail?: boolean;
  uploadProgress?: number;
  isUploading?: boolean;
  error?: string;
}

interface ImprovedImagesSectionProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImprovedImagesSection({ 
  images, 
  onImagesChange, 
  maxImages = 6 
}: ImprovedImagesSectionProps) {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const deleteDialog = useDeleteConfirmationDialog();

  // Initialize image items from props
  useEffect(() => {
    const items: ImageItem[] = images.map((url, index) => ({
      url,
      id: `img-${Date.now()}-${index}`,
      isThumbnail: index === 0,
    }));
    setImageItems(items);
  }, [images]);

  // Update image name
  const updateImageName = (index: number, newName: string) => {
    const newItems = [...imageItems];
    newItems[index] = {
      ...newItems[index],
      name: newName || `Image ${index + 1}`
    };
    setImageItems(newItems);
  };

  // Update parent when image items change
  const updateParent = useCallback((items: ImageItem[]) => {
    // Use setTimeout to defer the update until after render
    setTimeout(() => {
      const urls = items.filter(item => !item.error && item.url).map(item => item.url);
      onImagesChange(urls);
    }, 0);
  }, [onImagesChange]);

  // Handle file upload
  const handleFileUpload = useCallback(async (files: FileList | File[]) => {
    const fileArray = Array.from(files).slice(0, maxImages - imageItems.length);
    
    if (fileArray.length === 0) {
      toast.error('No valid files selected');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newItems: ImageItem[] = fileArray.map((file, index) => ({
        id: `upload-${Date.now()}-${index}`,
        url: '',
        name: file.name,
        size: file.size,
        type: file.type,
        isUploading: true,
        uploadProgress: 0,
      }));

      setImageItems(prev => [...prev, ...newItems]);

      // Upload each file to Cloudinary
      const uploadPromises = fileArray.map(async (file, index) => {
        const item = newItems[index];
        
        try {
          // Validate file
          if (!file.type.startsWith('image/')) {
            throw new Error('File must be an image');
          }
          
          if (file.size > 10 * 1024 * 1024) { // 10MB limit
            throw new Error('File size must be less than 10MB');
          }

          // Create FormData for upload
          const formData = new FormData();
          formData.append('file', file);
          formData.append('imageType', 'pgGallery'); // Use gallery type for PG images

          // Upload to Cloudinary via API
          const response = await fetch('/api/upload?imageType=pgGallery', {
            method: 'POST',
            body: formData,
          });

          const result = await response.json();

          if (!response.ok) {
            // Handle server errors professionally
            if (response.status === 503) {
              throw new Error('Image upload service is temporarily unavailable. Please try again later.');
            } else if (response.status === 401) {
              throw new Error('You are not authorized to upload images. Please log in again.');
            } else {
              throw new Error(result.error || 'Failed to upload image. Please try again.');
            }
          }

          if (!result.success) {
            throw new Error(result.error || 'Upload failed. Please check your image and try again.');
          }

          // Update progress for this item
          setImageItems(prev => 
            prev.map(item => 
              item.id === item.id 
                ? { ...item, uploadProgress: 100 }
                : item
            )
          );

          return {
            ...item,
            url: result.url,
            isUploading: false,
            uploadProgress: 100,
          };

        } catch (error) {
          console.error('Upload error for file:', file.name, error);
          
          // Update item with error
          setImageItems(prev => 
            prev.map(item => 
              item.id === item.id 
                ? { 
                    ...item, 
                    error: error instanceof Error ? error.message : 'Upload failed',
                    isUploading: false 
                  }
                : item
            )
          );

          return {
            ...item,
            error: error instanceof Error ? error.message : 'Upload failed',
            isUploading: false,
          };
        }
      });

      // Wait for all uploads to complete
      const uploadedItems = await Promise.all(uploadPromises);

      // Update image items with results
      setImageItems(prev => {
        const updated = prev.map(item => {
          const uploadedItem = uploadedItems.find(u => u.id === item.id);
          return uploadedItem || item;
        });
        updateParent(updated);
        return updated;
      });

      // Count successful uploads
      const successfulUploads = uploadedItems.filter(item => !item.error).length;
      const failedUploads = uploadedItems.filter(item => item.error).length;

      if (successfulUploads > 0) {
        toast.success(`${successfulUploads} image(s) uploaded successfully`);
      }
      
      if (failedUploads > 0) {
        toast.error(`${failedUploads} image(s) failed to upload`);
      }

    } catch (error) {
      console.error('Batch upload error:', error);
      toast.error(error instanceof Error ? error.message : 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [imageItems.length, maxImages, updateParent]);

  // Handle drag and drop
  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverItem(index);
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      setDragOverItem(null);
      return;
    }

    const draggedImage = imageItems[draggedItem];
    const newItems = [...imageItems];
    newItems.splice(draggedItem, 1);
    newItems.splice(dropIndex, 0, draggedImage);

    setImageItems(newItems);
    updateParent(newItems);
    setDraggedItem(null);
    setDragOverItem(null);
  };

  // Set as thumbnail
  const setAsThumbnail = (index: number) => {
    const newItems = [...imageItems];
    const [thumbnail] = newItems.splice(index, 1);
    newItems.unshift(thumbnail);
    
    // Update thumbnail flags
    newItems.forEach((item, i) => {
      item.isThumbnail = i === 0;
    });

    setImageItems(newItems);
    updateParent(newItems);
    toast.success('Thumbnail updated');
  };

  // Remove image with confirmation
  const removeImage = (index: number) => {
    const imageToDelete = imageItems[index];
    const imageName = imageToDelete.name || `Image ${index + 1}`;
    
    deleteDialog.openDialog({
      itemName: imageName,
      itemType: 'image',
      mode: 'simple', // Use simple mode for images (no typing required)
      description: `Are you sure you want to delete this image? This will remove it from your property gallery.`,
      showWarningIcon: true,
      confirmText: 'Delete Image',
      cancelText: 'Cancel',
      onConfirm: () => {
        setIsDeleting(true);
        
        const newItems = imageItems.filter((_, i) => i !== index);
        
        // Update thumbnail flags
        newItems.forEach((item, i) => {
          item.isThumbnail = i === 0;
        });

        setImageItems(newItems);
        updateParent(newItems);
        
        setTimeout(() => {
          setIsDeleting(false);
          toast.success('Image removed successfully');
          deleteDialog.closeDialog();
        }, 500);
      }
    });
  };

  // Handle drag and drop files
  const handleDropFiles = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    handleFileUpload(files);
  };

  const handleDragOverFiles = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-zinc-300 dark:border-zinc-600 bg-zinc-50/50 dark:bg-zinc-800/50">
        <CardContent className="pt-6">
          <div
            className="text-center space-y-4"
            onDrop={handleDropFiles}
            onDragOver={handleDragOverFiles}
          >
            <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Upload Property Images
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-1">
                Drag and drop images here, or click to browse
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                onClick={() => {
                  const input = document.createElement('input');
                  input.type = 'file';
                  input.multiple = true;
                  input.accept = 'image/*';
                  input.onchange = (e) => {
                    const files = (e.target as HTMLInputElement).files;
                    if (files) handleFileUpload(files);
                  };
                  input.click();
                }}
                disabled={isUploading || imageItems.length >= maxImages}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Choose Images
                  </>
                )}
              </Button>
            </div>

            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              PNG, JPG, GIF up to 10MB each. Maximum {maxImages} images.
            </div>

            {/* Upload Progress */}
            {isUploading && (
              <div className="space-y-2">
                <Progress value={uploadProgress} className="w-full" />
                <p className="text-sm text-zinc-600 dark:text-zinc-400">
                  Uploading... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Images Grid */}
      {imageItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Images className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <div>
                  <CardTitle>Property Images</CardTitle>
                  <CardDescription>
                    {imageItems.length}/{maxImages} images uploaded
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline">
                {imageItems.filter(img => img.isThumbnail).length} thumbnail
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {imageItems.map((item, index) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative group rounded-lg border transition-all duration-200",
                    draggedItem === index && "opacity-50",
                    dragOverItem === index && "ring-2 ring-blue-500",
                    item.error 
                      ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/20" 
                      : "border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                  )}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                >
                  {/* Image */}
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    {item.url ? (
                      <img
                        src={item.url}
                        alt={item.name || `Property image ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    ) : item.isUploading ? (
                      <div className="w-full h-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
                      </div>
                    ) : item.error ? (
                      <div className="w-full h-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center">
                        <ImageOff className="w-8 h-8 text-red-400" />
                      </div>
                    ) : null}

                    {/* Thumbnail Badge */}
                    {item.isThumbnail && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-amber-600 hover:bg-amber-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Thumbnail
                        </Badge>
                      </div>
                    )}

                    {/* Upload Progress */}
                    {item.isUploading && item.uploadProgress !== undefined && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/50">
                        <Progress value={item.uploadProgress} className="h-1" />
                      </div>
                    )}

                    {/* Hover Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 rounded-t-lg">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(item.url, '_blank')}
                        disabled={!item.url}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!item.isThumbnail && (
                        <Button
                          type="button"
                          size="sm"
                          variant="secondary"
                          onClick={() => setAsThumbnail(index)}
                          disabled={!item.url}
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Image Info */}
                  <div className="p-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Move className="w-4 h-4 text-zinc-400" />
                      <Input
                        type="text"
                        value={item.name || ''}
                        onChange={(e) => updateImageName(index, e.target.value)}
                        placeholder={`Image ${index + 1}`}
                        className="flex-1 h-8 text-sm"
                        onBlur={() => updateParent(imageItems)}
                      />
                    </div>
                    
                    {item.size && (
                      <p className="text-xs text-zinc-500">
                        {(item.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    )}

                    {item.error && (
                      <Alert variant="destructive" className="mt-2">
                        <AlertCircle className="w-4 h-4" />
                        <AlertDescription className="text-xs">
                          {item.error}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions */}
            <Alert className="mt-4">
              <Move className="w-4 h-4" />
              <AlertDescription>
                <strong>Tip:</strong> Drag and drop images to reorder. The first image is used as the thumbnail for property listings.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {imageItems.length === 0 && (
        <Card className="border-zinc-200 dark:border-zinc-700">
          <CardContent className="pt-6">
            <div className="text-center space-y-3">
              <div className="mx-auto w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center">
                <ImageIcon className="w-6 h-6 text-zinc-400" />
              </div>
              <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">
                  No images uploaded yet
                </h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Add images to showcase your property
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        {...deleteDialog.config}
        isLoading={isDeleting}
      />
    </div>
  );
}
