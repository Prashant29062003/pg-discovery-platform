'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { pgFormSchema, type PGFormData } from '@/db/schema';
import { updatePGDetails, getPGDetails } from '@/modules/pg/pg-details.actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ImageUpload } from '@/components/common/utils/ImageUpload';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const AMENITIES_LIST = [
  'WiFi', 'AC', 'Hot Water', 'Food Included', 'Washing Machine',
  'Laundry Service', 'Gym', 'Study Room', 'Common Hall', 'Parking'
];

interface PGDetailsFormProps {
  pgId: string;
}

export function PGDetailsForm({ pgId }: PGDetailsFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [thumbnailImage, setThumbnailImage] = useState<string>('');
  const [galleryImages, setGalleryImages] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<any>({
    resolver: zodResolver(pgFormSchema),
    defaultValues: {
      gender: 'UNISEX',
      minStayDays: 1,
      isPublished: false,
      amenities: [],
    },
  });

  const isPublished = watch('isPublished');

  // Load PG details on mount
  useEffect(() => {
    async function loadPG() {
      try {
        const pg = await getPGDetails(pgId);
        if (pg) {
          setValue('name', pg.name);
          setValue('description', pg.description || '');
          setValue('fullAddress', pg.fullAddress || '');
          setValue('address', pg.address);
          setValue('city', pg.city);
          setValue('locality', pg.locality);
          setValue('managerName', pg.managerName || '');
          setValue('phoneNumber', pg.phoneNumber || '');
          setValue('gender', pg.gender);
          setValue('checkInTime', pg.checkInTime || '');
          setValue('checkOutTime', pg.checkOutTime || '');
          setValue('rulesAndRegulations', pg.rulesAndRegulations || '');
          setValue('cancellationPolicy', pg.cancellationPolicy || '');
          setValue('minStayDays', pg.minStayDays || 1);
          setValue('isPublished', pg.isPublished || false);
          
          // Load images if they exist
          if (pg.thumbnailImage) {
            setThumbnailImage(pg.thumbnailImage);
          }
          if (Array.isArray(pg.images) && pg.images.length > 0) {
            setGalleryImages(pg.images);
          }
          
          if (Array.isArray(pg.amenities)) {
            setSelectedAmenities(pg.amenities);
          }
        }
      } catch (error) {
        toast.error('Failed to load PG details');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    loadPG();
  }, [pgId, setValue]);

  async function onSubmit(data: any) {
    setIsSubmitting(true);
    try {
      await updatePGDetails(pgId, {
        ...data,
        amenities: selectedAmenities,
        thumbnailImage,
        images: galleryImages,
      });
      toast.success('PG details updated successfully');
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update PG details');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-6 h-6 animate-spin" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>PG name, address, and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Name */}
          <div>
            <Label htmlFor="name">PG Name *</Label>
            <Input
              id="name"
              {...register('name')}
              placeholder="e.g., Cozy PG Delhi"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{(errors.name as any)?.message}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Describe your PG (amenities, vibe, location benefits)"
              className={`h-24 ${errors.description ? 'border-red-500' : ''}`}
            />
            {errors.description && <p className="text-red-500 text-sm mt-1">{(errors.description as any)?.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Full Address */}
            <div>
              <Label htmlFor="fullAddress">Full Address</Label>
              <Input
                id="fullAddress"
                {...register('fullAddress')}
                placeholder="123 Main Street, Sector 5..."
              />
            </div>

            {/* City */}
            <div>
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                {...register('city')}
                placeholder="Delhi"
                className={errors.city ? 'border-red-500' : ''}
              />
              {errors.city && <p className="text-red-500 text-sm mt-1">{(errors.city as any)?.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Locality */}
            <div>
              <Label htmlFor="locality">Locality *</Label>
              <Input
                id="locality"
                {...register('locality')}
                placeholder="Indirapuram"
                className={errors.locality ? 'border-red-500' : ''}
              />
              {errors.locality && <p className="text-red-500 text-sm mt-1">{(errors.locality as any)?.message}</p>}
            </div>

            {/* Gender Category */}
            <div>
              <Label htmlFor="gender">Gender Category *</Label>
              <Select defaultValue="UNISEX" onValueChange={(value) => setValue('gender', value as any)}>
                <SelectTrigger id="gender">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male Only</SelectItem>
                  <SelectItem value="FEMALE">Female Only</SelectItem>
                  <SelectItem value="UNISEX">Co-ed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
          <CardDescription>Upload thumbnail and gallery images</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload
            label="Thumbnail Image (Featured)"
            imageType="pgHero"
            onImageUpload={setThumbnailImage}
            currentImage={thumbnailImage}
            description="This image will be displayed as the main hero on the detail page"
          />
        </CardContent>
      </Card>

      {/* Manager Information */}
      <Card>
        <CardHeader>
          <CardTitle>Manager Information</CardTitle>
          <CardDescription>Contact details for bookings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Manager Name */}
            <div>
              <Label htmlFor="managerName">Manager Name *</Label>
              <Input
                id="managerName"
                {...register('managerName')}
                placeholder="Rajesh Kumar"
                className={errors.managerName ? 'border-red-500' : ''}
              />
              {errors.managerName && <p className="text-red-500 text-sm mt-1">{(errors.managerName as any)?.message}</p>}
            </div>

            {/* Phone Number */}
            <div>
              <Label htmlFor="phoneNumber">Phone Number *</Label>
              <Input
                id="phoneNumber"
                {...register('phoneNumber')}
                placeholder="9876543210"
                className={errors.phoneNumber ? 'border-red-500' : ''}
              />
              {errors.phoneNumber && <p className="text-red-500 text-sm mt-1">{(errors.phoneNumber as any)?.message}</p>}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Check-in/out & Policies */}
      <Card>
        <CardHeader>
          <CardTitle>Check-in/out & Policies</CardTitle>
          <CardDescription>Timing and house rules</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Check-in Time */}
            <div>
              <Label htmlFor="checkInTime">Check-in Time</Label>
              <Input
                id="checkInTime"
                type="time"
                {...register('checkInTime')}
              />
            </div>

            {/* Check-out Time */}
            <div>
              <Label htmlFor="checkOutTime">Check-out Time</Label>
              <Input
                id="checkOutTime"
                type="time"
                {...register('checkOutTime')}
              />
            </div>
          </div>

          {/* Minimum Stay */}
          <div>
            <Label htmlFor="minStayDays">Minimum Stay (Days)</Label>
            <Input
              id="minStayDays"
              type="number"
              min="1"
              {...register('minStayDays', { valueAsNumber: true })}
            />
          </div>

          {/* Rules & Regulations */}
          <div>
            <Label htmlFor="rulesAndRegulations">Rules & Regulations</Label>
            <Textarea
              id="rulesAndRegulations"
              {...register('rulesAndRegulations')}
              placeholder="e.g., No visitors after 10 PM, No alcohol, Quiet hours 10 PM - 8 AM"
              className="h-20"
            />
          </div>

          {/* Cancellation Policy */}
          <div>
            <Label htmlFor="cancellationPolicy">Cancellation Policy</Label>
            <Textarea
              id="cancellationPolicy"
              {...register('cancellationPolicy')}
              placeholder="e.g., Free cancellation up to 7 days before check-in"
              className="h-20"
            />
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
          <CardDescription>Select available amenities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {AMENITIES_LIST.map((amenity) => (
              <div key={amenity} className="flex items-center space-x-2">
                <Checkbox
                  id={amenity}
                  checked={selectedAmenities.includes(amenity)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedAmenities([...selectedAmenities, amenity]);
                    } else {
                      setSelectedAmenities(selectedAmenities.filter(a => a !== amenity));
                    }
                  }}
                />
                <Label htmlFor={amenity} className="cursor-pointer">{amenity}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Publish Status */}
      <Card>
        <CardHeader>
          <CardTitle>Publish Status</CardTitle>
          <CardDescription>Make your PG visible to visitors</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-3">
            <Checkbox
              id="isPublished"
              checked={isPublished}
              onCheckedChange={(checked) => setValue('isPublished', checked as boolean)}
            />
            <Label htmlFor="isPublished" className="cursor-pointer">
              Publish this PG (visible to visitors)
            </Label>
          </div>
          {isPublished && (
            <Alert className="mt-4 bg-green-50 border-green-200">
              <AlertDescription className="text-green-800">
                ✓ Your PG is visible to all visitors
              </AlertDescription>
            </Alert>
          )}
          {!isPublished && (
            <Alert className="mt-4 bg-yellow-50 border-yellow-200">
              <AlertDescription className="text-yellow-800">
                📝 Your PG is in draft mode (not visible to visitors)
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
          {isSubmitting ? 'Saving...' : 'Save PG Details'}
        </Button>
      </div>
    </form>
  );
}
