'use client';

import { useState } from 'react';
import NextImage from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ImageUpload } from '@/components/common/utils/ImageUpload';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { X } from 'lucide-react';
import { toast } from 'sonner';

interface RoomImageUploadProps {
  onImagesChange: (images: string[]) => void;
  currentImages?: string[];
}

export function RoomImageUpload({
  onImagesChange,
  currentImages = [],
}: RoomImageUploadProps) {
  const [roomImages, setRoomImages] = useState<string[]>(currentImages);

  const handleImageUpload = (url: string) => {
    const updated = [...roomImages, url];
    setRoomImages(updated);
    onImagesChange(updated);
  };

  const handleRemoveImage = (index: number) => {
    const updated = roomImages.filter((_, i) => i !== index);
    setRoomImages(updated);
    onImagesChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Room Images</CardTitle>
        <CardDescription>Upload multiple room photos</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Upload Section */}
        <ImageUpload
          label="Add Room Photo"
          imageType="roomImage"
          onImageUpload={handleImageUpload}
          description="Upload a photo of the room (600×400px recommended)"
        />

        {/* Gallery Preview */}
        {roomImages.length > 0 && (
          <div>
            <Label className="mb-3 block">
              Room Photos ({roomImages.length})
            </Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {roomImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative aspect-[3/2] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 group"
                >
                  <NextImage
                    src={img}
                    alt={`Room ${idx + 1}`}
                    fill
                    sizes="200px"
                    className="object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(idx)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition"
                    type="button"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
