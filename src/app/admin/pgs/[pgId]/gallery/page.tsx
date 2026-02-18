'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { ArrowLeft, AlertCircle, Plus } from 'lucide-react';
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
  AlertCircle as AlertCircleIcon,
  CheckCircle,
  Loader2,
  ImageOff
} from 'lucide-react';
import { cn } from '@/utils';
import { toast } from 'sonner';
import { PropertyNavTabs } from '@/components/admin/PropertyNavTabs';
import { DeleteConfirmationDialog, useDeleteConfirmationDialog } from '@/components/ui/delete-confirmation-dialog';
import { Input } from '@/components/ui/input';
import Image from 'next/image';

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

interface PG {
  id: string;
  name: string;
  images?: string[];
}

export default function GalleryPage() {
  const params = useParams();
  const pgId = params.pgId as string;

  const [pg, setPg] = useState<PG | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imageItems, setImageItems] = useState<ImageItem[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const maxImages = 20;
  
  const deleteDialog = useDeleteConfirmationDialog();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pgRes = await fetch(`/api/pgs/${pgId}`);
        if (!pgRes.ok) throw new Error('Failed to fetch PG');
        const pgData = await pgRes.json();
        setPg(pgData);
        
        // Initialize image items from PG data
        if (pgData.images) {
          const items: ImageItem[] = pgData.images.map((url: string, index: number) => ({
            url,
            id: `img-${Date.now()}-${index}`,
            isThumbnail: index === 0,
          }));
          setImageItems(items);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [pgId]);

  // Update image name
  const updateImageName = (index: number, newName: string) => {
    const newItems = [...imageItems];
    newItems[index] = {
      ...newItems[index],
      name: newName || `Property Image ${index + 1}`
    };
    setImageItems(newItems);
  };

  // Update parent when image items change
  const updateParent = useCallback(async (items: ImageItem[]) => {
    const urls = items.filter(item => !item.error && item.url).map(item => item.url);
    
    // Update database
    try {
      const response = await fetch(`/api/pgs/${pgId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          images: urls
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update database');
      }
    } catch (error) {
      toast.error('Failed to save images to database');
    }
  }, [pgId]);

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

      // Upload files one by one
      let successfulUploads = 0;
      let failedUploads = 0;

      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i];
        const tempId = newItems[i].id;
        
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('pgId', pgId);

          const response = await fetch('/api/upload/property-image', {
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

          // Update the item with the uploaded URL
          setImageItems(prev => 
            prev.map(item => 
              item.id === tempId 
                ? { ...item, url: result.data.url, isUploading: false, uploadProgress: 100 }
                : item
            )
          );

          successfulUploads++;
        } catch (error) {
          // Mark the item as failed
          setImageItems(prev => 
            prev.map(item => 
              item.id === tempId 
                ? { ...item, error: error instanceof Error ? error.message : 'Upload failed', isUploading: false }
                : item
            )
          );
          failedUploads++;
        }

        // Update progress
        const progress = ((i + 1) / fileArray.length) * 100;
        setUploadProgress(progress);
      }

      // Update parent with final state
      const finalItems = imageItems.filter(item => !item.error && item.url);
      await updateParent(finalItems);

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
  }, [imageItems.length, maxImages, updateParent, pgId]);

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
  const setAsThumbnail = async (index: number) => {
    const newItems = [...imageItems];
    const [thumbnail] = newItems.splice(index, 1);
    newItems.unshift(thumbnail);
    
    // Update thumbnail flags
    newItems.forEach((item, i) => {
      item.isThumbnail = i === 0;
    });

    setImageItems(newItems);
    await updateParent(newItems);
    toast.success('Thumbnail updated');
  };

  // Remove image with confirmation
  const removeImage = (index: number) => {
    const imageToDelete = imageItems[index];
    const imageName = imageToDelete.name || `Property Image ${index + 1}`;
    
    deleteDialog.openDialog({
      itemName: imageName,
      itemType: 'image',
      mode: 'simple', // Use simple mode for images (no typing required)
      description: `Are you sure you want to delete this image? This will remove it from your property gallery.`,
      showWarningIcon: true,
      confirmText: 'Delete Image',
      cancelText: 'Cancel',
      onConfirm: async () => {
        setIsDeleting(true);
        
        try {
          const newItems = imageItems.filter((_, i) => i !== index);
          
          // Update thumbnail flags
          newItems.forEach((item, i) => {
            item.isThumbnail = i === 0;
          });

          setImageItems(newItems);
          await updateParent(newItems);
          
          toast.success('Image removed successfully');
          deleteDialog.closeDialog();
        } catch (error) {
          toast.error('Failed to remove image');
        } finally {
          setIsDeleting(false);
        }
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="space-y-4 text-center">
          <div className="inline-block w-8 h-8 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin" />
          <p className="text-zinc-500 dark:text-zinc-400">Loading gallery...</p>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        </div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">PG not found</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        </div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Error loading gallery</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 px-4 sm:px-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
        <div className="space-y-1">
          <Link href="/admin/pgs">
            <Button variant="ghost" size="sm" className="gap-2 -ml-2 text-zinc-500 hover:text-orange-600 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Back to Properties
            </Button>
          </Link>
          <div className="flex items-center gap-3 mt-2">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              {pg.name}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 text-xs font-semibold border border-purple-200 dark:border-purple-800/50">
              Gallery
            </span>
          </div>
          <p className="text-zinc-500 dark:text-zinc-400">
            Manage property images and photo gallery.
          </p>
        </div>
      </div>

      {/* PROPERTY NAV TABS */}
      <PropertyNavTabs pgId={pgId} pgName={pg?.name || 'Property'} />

      {/* CONTENT AREA - Exact PG Form UI */}
      <div className="space-y-6">
        {/* Upload Area - Identical to PG Form */}
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

        {/* Images Grid - Identical to PG Form */}
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
                        <Image
                          src={item.url}
                          alt={item.name || `Property image ${index + 1}`}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : item.isUploading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                          <Loader2 className="w-8 h-8 animate-spin text-zinc-400" />
                        </div>
                      ) : item.error ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-50 dark:bg-red-950/20">
                          <AlertCircleIcon className="w-8 h-8 text-red-500" />
                        </div>
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800">
                          <ImageOff className="w-8 h-8 text-zinc-400" />
                        </div>
                      )}
                      
                      {/* Upload Progress */}
                      {item.isUploading && item.uploadProgress !== undefined && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
                          <Progress value={item.uploadProgress} className="w-full h-1" />
                        </div>
                      )}
                    </div>
                    
                    {/* Thumbnail Badge */}
                    {item.isThumbnail && (
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-blue-600 text-white">
                          <Star className="w-3 h-3 mr-1" />
                          Thumbnail
                        </Badge>
                      </div>
                    )}
                    
                    {/* Actions */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2 rounded-t-lg">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => window.open(item.url, '_blank')}
                        className="h-8 w-8 p-0"
                        disabled={!item.url}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {!item.isThumbnail && item.url && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => setAsThumbnail(index)}
                          className="h-8 w-8 p-0"
                        >
                          <Star className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => removeImage(index)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    {/* Drag Handle */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-white/90 dark:bg-zinc-800/90 rounded p-1">
                        <Move className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
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
                          placeholder={`Property Image ${index + 1}`}
                          className="flex-1 h-8 text-sm"
                          onBlur={() => updateParent(imageItems)}
                        />
                      </div>
                      
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Photo {index + 1} of {imageItems.length}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Tips */}
              <Alert className="mt-4">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertDescription>
                  <strong>Tips:</strong> Drag and drop images to reorder. The first image is automatically set as the thumbnail. 
                  Click the star icon to set a different image as thumbnail.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        {...deleteDialog.config}
        isLoading={isDeleting}
      />
    </div>
  );
}
