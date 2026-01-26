'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
// Use API routes instead of direct module calls
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { ImageUpload } from '@/components/admin/ImageUpload';
import { toast } from 'sonner';

const pgFormSchema = z.object({
  name: z.string().min(1, 'PG name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  locality: z.string().min(2, 'Locality is required'),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX']).default('UNISEX').optional(),
  managerName: z.string().optional(),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number').optional().or(z.literal('')),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  minStayDays: z.number().int().min(1, 'Minimum 1 day required').optional(),
  cancellationPolicy: z.string().optional(),
  rulesAndRegulations: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  images: z.array(z.string()).default([]).optional(),
  amenities: z.array(z.string()).default([]).optional(),
});

type PGFormData = z.infer<typeof pgFormSchema>;

interface PGFormProps {
  pgId?: string;
  initialData?: Partial<PGFormData>;
}

export function PGForm({ pgId, initialData }: PGFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Separate thumbnail and gallery images
  const [thumbnailImage, setThumbnailImage] = useState<string>(initialData?.images?.[0] || '');
  const [galleryImages, setGalleryImages] = useState<string[]>(initialData?.images?.slice(1) || []);
  const [galleryImageNames, setGalleryImageNames] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(initialData?.amenities || []);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    setFocus,
    setError,
    formState: { errors },
  } = useForm<PGFormData>({
    resolver: zodResolver(pgFormSchema),
    defaultValues: initialData || {
      gender: 'UNISEX',
      images: [],
    },
  });

  // Handle thumbnail image change
  const handleThumbnailChange = (urls: string[]) => {
    const url = urls[0] || '';
    setThumbnailImage(url);
    // Update form with thumbnail as first image + gallery images
    const allImages = url ? [url, ...galleryImages] : galleryImages;
    setValue('images', allImages);
  };

  // Handle gallery images change
  const handleGalleryImagesChange = (urls: string[]) => {
    setGalleryImages(urls);
    // Update form with thumbnail as first image + gallery images
    const allImages = thumbnailImage ? [thumbnailImage, ...urls] : urls;
    setValue('images', allImages);
  };

  // Handle gallery image names change
  const handleGalleryImageNamesChange = (names: string[]) => {
    setGalleryImageNames(names);
  };

  async function onSubmit(data: PGFormData) {
    setIsSubmitting(true);
    try {
      const method = pgId ? 'PUT' : 'POST';
      const url = pgId ? `/api/admin/pgs/${pgId}` : '/api/admin/pgs';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        // Include thumbnail image and gallery names
        body: JSON.stringify({ 
          ...data, 
          amenities: selectedAmenities,
          thumbnailImage, 
          imageNames: ['', ...galleryImageNames] // First name is for thumbnail (empty), rest for gallery
        }),
      });
      const json = await res.json();

      if (!json?.success && json?.validation) {
        // server returned validation errors { field: message }
        const keys = Object.keys(json.validation || {});
        for (const k of keys) {
          // @ts-ignore
          setError?.(k as any, { type: 'server', message: json.validation[k] });
        }
        if (keys.length > 0) setFocus(keys[0] as any);
        return;
      }

      if (json?.success) {
        toast.success(pgId ? 'PG updated successfully' : 'PG created successfully');
        if (!pgId && json.pgId) {
          router.push(`/admin/pgs/${json.pgId}/rooms`);
          return;
        }
        router.push('/admin/pgs');
      } else {
        toast.error(json?.message || 'Failed to save PG');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save PG');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card className="p-6 max-w-2xl">
      <h2 className="text-2xl font-bold mb-6">
        {pgId ? 'Edit PG' : 'Create New PG'}
      </h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name">PG Name *</Label>
          <Input
            id="name"
            {...register('name')}
            placeholder="e.g., Cozy Commons PG"
            className={errors.name ? 'border-red-500' : ''}
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Description */}
        <div>
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            {...register('description')}
            placeholder="Describe your PG, amenities, and what makes it special..."
            rows={4}
            className={errors.description ? 'border-red-500' : ''}
          />
          {errors.description && (
            <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
          )}
        </div>

        {/* Image Upload - Thumbnail */}
        <div className="border rounded-lg p-6 bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-blue-900 dark:text-blue-100 mb-1">Preview Image</h3>
            <p className="text-sm text-blue-800 dark:text-blue-300">This image will be shown on property cards in listings</p>
          </div>
          <ImageUpload
            onImagesChange={handleThumbnailChange}
            existingImages={thumbnailImage ? [thumbnailImage] : []}
            maxImages={1}
            label="Upload Thumbnail"
            description="Square or landscape format recommended. This is the main preview image for your listing."
            imageType="pgThumbnail"
            pgName={watch('name') || 'Property'}
          />
        </div>

        {/* Image Upload - Gallery */}
        <div className="border rounded-lg p-6 bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <div className="mb-4">
            <h3 className="font-bold text-lg text-emerald-900 dark:text-emerald-100 mb-1">Gallery Images</h3>
            <p className="text-sm text-emerald-800 dark:text-emerald-300">Additional photos showcasing rooms, amenities, and common areas</p>
          </div>
          <ImageUpload
            onImagesChange={handleGalleryImagesChange}
            onImageNamesChange={handleGalleryImageNamesChange}
            existingImages={galleryImages}
            existingImageNames={galleryImageNames}
            maxImages={6}
            label="Gallery Images"
            description="Add 2-6 photos to showcase your property (optional, but recommended)"
            imageType="galleryImage"
            pgName={watch('name') || 'Property'}
          />
        </div>

        {/* Gender */}
        <div>
          <Label htmlFor="gender">Gender Type *</Label>
          <Select defaultValue={watch('gender')}>
            <SelectTrigger id="gender">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MALE">Male Only</SelectItem>
              <SelectItem value="FEMALE">Female Only</SelectItem>
              <SelectItem value="UNISEX">Unisex</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Address */}
        <div>
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            {...register('address')}
            placeholder="Full address"
            className={errors.address ? 'border-red-500' : ''}
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
          )}
        </div>

        {/* City and Locality */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              {...register('city')}
              placeholder="e.g., Bangalore"
              className={errors.city ? 'border-red-500' : ''}
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
            )}
          </div>
          <div>
            <Label htmlFor="locality">Locality *</Label>
            <Input
              id="locality"
              {...register('locality')}
              placeholder="e.g., Indiranagar"
              className={errors.locality ? 'border-red-500' : ''}
            />
            {errors.locality && (
              <p className="text-red-500 text-sm mt-1">{errors.locality.message}</p>
            )}
          </div>
        </div>

        {/* Manager Details */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="managerName">Manager Name</Label>
            <Input
              id="managerName"
              {...register('managerName')}
              placeholder="Name"
            />
          </div>
          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              {...register('phoneNumber')}
              placeholder="10-digit Indian number"
              className={errors.phoneNumber ? 'border-red-500' : ''}
            />
            {errors.phoneNumber && (
              <p className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</p>
            )}
          </div>
        </div>

        {/* Check-in / Check-out Times */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="checkInTime">Check-in Time (HH:MM)</Label>
            <Input
              id="checkInTime"
              type="time"
              {...register('checkInTime')}
              placeholder="e.g., 14:00"
            />
          </div>
          <div>
            <Label htmlFor="checkOutTime">Check-out Time (HH:MM)</Label>
            <Input
              id="checkOutTime"
              type="time"
              {...register('checkOutTime')}
              placeholder="e.g., 11:00"
            />
          </div>
        </div>

        {/* Minimum Stay Days */}
        <div>
          <Label htmlFor="minStayDays">Minimum Stay (Days)</Label>
          <Input
            id="minStayDays"
            type="number"
            {...register('minStayDays', { valueAsNumber: true })}
            placeholder="e.g., 1"
            className={errors.minStayDays ? 'border-red-500' : ''}
            min="1"
          />
          {errors.minStayDays && (
            <p className="text-red-500 text-sm mt-1">{errors.minStayDays.message}</p>
          )}
        </div>

        {/* Cancellation Policy */}
        <div>
          <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
          <Textarea
            id="cancellationPolicy"
            {...register('cancellationPolicy')}
            placeholder="Describe your cancellation terms (e.g., No refund for last-minute cancellations, 7 days notice required...)"
            rows={3}
          />
        </div>

        {/* Rules and Regulations */}
        <div>
          <Label htmlFor="rulesAndRegulations">Rules & Regulations</Label>
          <Textarea
            id="rulesAndRegulations"
            {...register('rulesAndRegulations')}
            placeholder="Describe house rules (e.g., No guests after 10 PM, Quiet hours 11 PM - 8 AM, etc.)"
            rows={3}
          />
        </div>

        {/* Location Coordinates */}
        <div>
          <Label>Location on Map (Optional)</Label>
          <p className="text-xs text-zinc-500 mb-3">Enter coordinates for Google Maps display</p>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="lat" className="text-sm">Latitude</Label>
              <Input
                id="lat"
                type="number"
                {...register('lat', { valueAsNumber: true })}
                placeholder="e.g., 12.9716"
                step="0.0001"
              />
            </div>
            <div>
              <Label htmlFor="lng" className="text-sm">Longitude</Label>
              <Input
                id="lng"
                type="number"
                {...register('lng', { valueAsNumber: true })}
                placeholder="e.g., 77.5946"
                step="0.0001"
              />
            </div>
          </div>
        </div>

        {/* Amenities Selection */}
        <div>
          <Label>Amenities</Label>
          <p className="text-xs text-zinc-500 mb-3">Select or add amenities offered at your property</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              'WiFi',
              'Air Conditioning',
              'Hot Water',
              'Laundry',
              'Parking',
              'Common Area',
              'Kitchen',
              'Gym',
              'Elevator',
              'Security',
              'Backup Power',
              'TV',
            ].map((amenity) => (
              <button
                key={amenity}
                type="button"
                onClick={() => {
                  setSelectedAmenities((prev) =>
                    prev.includes(amenity)
                      ? prev.filter((a) => a !== amenity)
                      : [...prev, amenity]
                  );
                  setValue('amenities', selectedAmenities.includes(amenity) 
                    ? selectedAmenities.filter((a) => a !== amenity)
                    : [...selectedAmenities, amenity]
                  );
                }}
                className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                  selectedAmenities.includes(amenity)
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'border-zinc-300 text-zinc-700 hover:border-blue-400 dark:border-zinc-600 dark:text-zinc-300'
                }`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="flex gap-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : pgId ? 'Update PG' : 'Create PG'}
          </Button>
        </div>
      </form>
    </Card>
  );
}
