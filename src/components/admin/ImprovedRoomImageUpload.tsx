/**
 * Professional Room Images Upload Component
 * Similar to ImprovedImagesSection but for room-specific images
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
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

interface ImageItem {
  url: string;
  id: string;
  name?: string;
  size?: number;
  type?: string;
  isPrimary?: boolean;
  uploadProgress?: number;
  isUploading?: boolean;
  error?: string;
}

interface ImprovedRoomImageUploadProps {
  roomId: string;
  pgId: string;
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

export function ImprovedRoomImageUpload({ 
  roomId,
  pgId,
  images, 
  onImagesChange, 
  maxImages = 10 
}: ImprovedRoomImageUploadProps) {
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  // Initialize image items from props
  useEffect(() => {
    const items: ImageItem[] = images.map((url, index) => ({
      id: `existing-${index}`,
      url,
      name: `Room Image ${index + 1}`,
      isPrimary: index === 0
    }));
    setImageItems(items);
  }, [images]);

  const validateFile = (file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Invalid file type. Only JPEG, PNG, and WebP are allowed.';
    }
    if (file.size > MAX_FILE_SIZE) {
      return 'File size must be less than 5MB.';
    }
    return null;
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('roomId', roomId);
    formData.append('pgId', pgId);

    const response = await fetch('/api/upload/room-image', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Upload failed');
    }

    const result = await response.json();
    if (!result.success) {
      throw new Error(result.message || 'Upload failed');
    }

    return result.data.url;
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const validFiles = fileArray.filter(file => {
      const error = validateFile(file);
      if (error) {
        toast.error(error);
        return false;
      }
      return true;
    });

    if (imageItems.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const newItems: ImageItem[] = [];
      
      for (let i = 0; i < validFiles.length; i++) {
        const file = validFiles[i];
        const tempId = `temp-${Date.now()}-${i}`;
        
        // Add temporary item
        const tempItem: ImageItem = {
          id: tempId,
          url: '',
          name: file.name,
          size: file.size,
          type: file.type,
          isUploading: true,
          uploadProgress: 0
        };
        
        setImageItems(prev => [...prev, tempItem]);
        
        try {
          // Update progress
          const progress = ((i + 1) / validFiles.length) * 100;
          setUploadProgress(progress);
          
          // Upload image
          const url = await uploadImage(file);
          
          // Replace temporary item with uploaded item
          const uploadedItem: ImageItem = {
            id: `uploaded-${Date.now()}-${i}`,
            url,
            name: file.name,
            size: file.size,
            type: file.type,
            isUploading: false,
            uploadProgress: 100
          };
          
          setImageItems(prev => 
            prev.map(item => item.id === tempId ? uploadedItem : item)
          );
          
          newItems.push(uploadedItem);
        } catch (error) {
          // Remove failed item
          setImageItems(prev => prev.filter(item => item.id !== tempId));
          toast.error(`Failed to upload ${file.name}`);
        }
      }

      // Update parent with new image URLs
      const updatedUrls = [...images, ...newItems.map(item => item.url)];
      onImagesChange(updatedUrls);
      
      toast.success(`Successfully uploaded ${newItems.length} image${newItems.length !== 1 ? 's' : ''}`);
    } catch (error) {
      toast.error('Upload failed');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  }, [imageItems.length]);

  const handleRemoveImage = async (imageId: string) => {
    const item = imageItems.find(img => img.id === imageId);
    if (!item) return;

    try {
      // Call delete API (only deletes file, not database)
      const response = await fetch(`/api/upload/room-image/delete?imageUrl=${encodeURIComponent(item.url)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.message || 'Delete failed');
      }

      // Update local state only (database will be updated on form submit)
      setImageItems(prev => prev.filter(img => img.id !== imageId));
      
      const updatedUrls = imageItems
        .filter(img => img.id !== imageId && img.url)
        .map(img => img.url);
      
      onImagesChange(updatedUrls);
      toast.success('Image removed successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('Failed to delete image. Please try again.');
    }
  };

  const handleSetPrimary = (imageId: string) => {
    const updatedItems = imageItems.map(item => ({
      ...item,
      isPrimary: item.id === imageId
    }));
    setImageItems(updatedItems);
    
    // Reorder URLs to put primary first
    const primaryItem = updatedItems.find(item => item.isPrimary);
    const otherItems = updatedItems.filter(item => !item.isPrimary);
    const reorderedUrls = primaryItem ? [primaryItem.url, ...otherItems.map(item => item.url)] : otherItems.map(item => item.url);
    
    onImagesChange(reorderedUrls);
    toast.success('Primary image updated');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Camera className="w-5 h-5" />
          Room Images
        </CardTitle>
        <CardDescription>
          Upload photos of this room. Maximum {maxImages} images.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Area */}
        {imageItems.length < maxImages ? (
          <div
            className={cn(
              "border-2 border-dashed rounded-lg p-6 text-center transition-all",
              isDragging ? "border-primary bg-primary/5" : "border-gray-300",
              isUploading && "opacity-50 cursor-not-allowed"
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <Upload className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {isUploading ? 'Uploading...' : 'Upload Room Images'}
                </h3>
                <p className="text-sm text-gray-500">or click to browse</p>
              </div>
              <input
                type="file"
                multiple
                accept={ALLOWED_TYPES.join(',')}
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
                id="room-images-upload"
                disabled={isUploading}
              />
              <Button
                type="button"
                variant="outline"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  document.getElementById('room-images-upload')?.click();
                }}
                disabled={isUploading}
              >
                <Upload className="w-4 h-4 mr-2" />
                {isUploading ? 'Uploading...' : 'Select Images'}
              </Button>
              <p className="text-xs text-gray-500">
                JPEG, PNG, WebP up to 5MB each
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 border-2 border-dashed border-gray-200 rounded-lg">
            <div className="space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Maximum Images Reached
                </h3>
                <p className="text-sm text-gray-500">
                  {imageItems.length} of {maxImages} images uploaded
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Upload Progress */}
        {isUploading && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Uploading images...</span>
              <span>{Math.round(uploadProgress)}%</span>
            </div>
            <Progress value={uploadProgress} className="w-full" />
          </div>
        )}

        {/* Images Grid */}
        {imageItems.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Room Gallery ({imageItems.length}/{maxImages})</h3>
              <Badge variant="secondary">
                {imageItems.filter(img => img.isPrimary).length > 0 ? 'Primary Set' : 'No Primary'}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {imageItems.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "relative group rounded-lg overflow-hidden border-2 transition-all",
                    item.isPrimary ? "border-primary ring-2 ring-primary/20" : "border-gray-200",
                    item.isUploading && "opacity-50"
                  )}
                >
                  {/* Image */}
                  <div className="aspect-square bg-gray-100">
                    {item.url ? (
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {item.isUploading ? (
                          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                        ) : (
                          <ImageOff className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Primary Badge */}
                  {item.isPrimary && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Primary
                      </Badge>
                    </div>
                  )}

                  {/* Upload Progress */}
                  {item.isUploading && item.uploadProgress !== undefined && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                      <Progress value={item.uploadProgress} className="w-full h-1" />
                    </div>
                  )}

                  {/* Actions */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    {item.url && !item.isPrimary && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleSetPrimary(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Star className="w-4 h-4" />
                      </Button>
                    )}
                    {item.url && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(item.url, '_blank')}
                        className="h-8 w-8 p-0"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleRemoveImage(item.id)}
                      disabled={item.isUploading}
                      className="h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Tips:</strong> The first image is automatically set as primary. 
                You can change the primary image by clicking the star icon on any image.
              </AlertDescription>
            </Alert>
          </div>
        )}

        {/* Empty State */}
        {imageItems.length === 0 && !isUploading && (
          <div className="text-center py-12">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No room images uploaded yet</p>
            <p className="text-sm text-gray-400">Add photos to showcase this room</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
