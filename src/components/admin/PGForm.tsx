'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save, X } from 'lucide-react';
import { showToast } from '@/utils/toast';

// Import utilities
import { validateFormData } from './utils/validation';
import { toggleAmenity } from './utils/amenities';

// Import section components
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ImagesSection } from './sections/ImagesSection';
import { LocationSection } from './sections/LocationSection';
import { AmenitiesSection } from './sections/AmenitiesSection';
import { HoursSection } from './sections/HoursSection';
import { PoliciesSection } from './sections/PoliciesSection';
import { ContactSection } from './sections/ContactSection';
import { StatusSection } from './sections/StatusSection';

type PGData = Record<string, any>;

interface PGFormProps {
  initialData?: PGData;
}

/**
 * Main PGForm Component - Refactored for modularity
 * Orchestrates form state and delegates rendering to section components
 * 
 * Features:
 * - Modular tab-based form sections
 * - Utility functions for validation, location handling, and amenities
 * - Clean separation of concerns
 * - Easy to maintain and extend
 */
export default function PGForm({ initialData }: PGFormProps) {
  const router = useRouter();

  // Initialize form state
  const [form, setForm] = useState<PGData>({
    id: initialData?.id || undefined,
    name: initialData?.name || '',
    description: initialData?.description || '',
    gender: initialData?.gender || 'UNISEX',
    address: initialData?.address || '',
    fullAddress: initialData?.fullAddress || '',
    city: initialData?.city || '',
    locality: initialData?.locality || '',
    lat: initialData?.lat || '',
    lng: initialData?.lng || '',
    images: initialData?.images || [],
    thumbnailImage: initialData?.thumbnailImage || '',
    amenities: initialData?.amenities || [],
    checkInTime: initialData?.checkInTime || '14:00',
    checkOutTime: initialData?.checkOutTime || '11:00',
    minStayDays: initialData?.minStayDays || '1',
    managerName: initialData?.managerName || '',
    phoneNumber: initialData?.phoneNumber || '',
    rulesAndRegulations: initialData?.rulesAndRegulations || '',
    cancellationPolicy: initialData?.cancellationPolicy || '',
    isPublished: initialData?.isPublished || false,
    isFeatured: initialData?.isFeatured || false,
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  /**
   * Update form field and clear its error
   */
  function update<K extends keyof PGData>(key: K, value: PGData[K]) {
    setForm((s) => ({ ...s, [key]: value }));
    if (errors[key]) {
      setErrors((e) => ({ ...e, [key]: '' }));
    }
  }

  /**
   * Handle amenity toggle
   */
  function handleToggleAmenity(amenity: string) {
    setForm((s) => ({
      ...s,
      amenities: toggleAmenity(s.amenities, amenity),
    }));
  }

  /**
   * Handle images change
   */
  function handleImagesChange(newImages: string[]) {
    update('images', newImages);
  }

  /**
   * Submit form
   */
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate form
    const formErrors = validateFormData(form);
    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
      showToast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const method = form.id ? 'PUT' : 'POST';
      const url = form.id ? `/api/admin/pgs/${form.id}` : '/api/admin/pgs';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const json = await res.json();

      // Handle server-side validation errors
      if (!json?.success && json?.validation) {
        setErrors(json.validation as Record<string, string>);
        const keys = Object.keys(json.validation || {});
        if (keys.length > 0) {
          const el = document.querySelector(`[name="${keys[0]}"]`) as HTMLElement | null;
          if (el && typeof el.focus === 'function') el.focus();
        }
        showToast.error('Validation failed. Please fix the highlighted fields');
        return;
      }

      if (json?.success) {
        showToast.success('PG saved successfully!');
        // Delay navigation to allow user to see success toast
        setTimeout(() => {
          router.push('/admin/pgs');
        }, 500);
      } else {
        const errorMsg = json?.message || 'Failed to save PG';
        setErrors({ submit: errorMsg });
        showToast.error(`Failed to save PG: ${errorMsg}`);
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save PG';
      setErrors({ submit: errorMsg });
      showToast.error(`Failed to save PG: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 px-2 sm:px-0">
      {/* Error Alert */}
      {errors.submit && (
        <Alert variant="destructive" className="mx-2 sm:mx-0">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errors.submit}</AlertDescription>
        </Alert>
      )}

      {/* Tabs Navigation - Single row for all screens */}
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4 sm:grid-cols-6 lg:grid-cols-8 bg-muted/50 p-1 rounded-lg">
          <TabsTrigger value="basic" className="text-xs sm:text-sm">Basic</TabsTrigger>
          <TabsTrigger value="images" className="text-xs sm:text-sm">Images</TabsTrigger>
          <TabsTrigger value="location" className="text-xs sm:text-sm">Location</TabsTrigger>
          <TabsTrigger value="amenities" className="text-xs sm:text-sm">Amenities</TabsTrigger>
          <TabsTrigger value="hours" className="text-xs sm:text-sm">Hours</TabsTrigger>
          <TabsTrigger value="policies" className="text-xs sm:text-sm">Policies</TabsTrigger>
          <TabsTrigger value="contact" className="text-xs sm:text-sm">Contact</TabsTrigger>
          <TabsTrigger value="status" className="text-xs sm:text-sm">Status</TabsTrigger>
        </TabsList>

        {/* BASIC INFORMATION TAB */}
        <TabsContent value="basic" className="space-y-4 mt-6">
          <BasicInfoSection
            name={form.name}
            description={form.description}
            gender={form.gender}
            errors={errors}
            onUpdate={update}
          />
        </TabsContent>

        {/* IMAGES TAB */}
        <TabsContent value="images" className="space-y-4 mt-6">
          <ImagesSection images={form.images} onImagesChange={handleImagesChange} />
        </TabsContent>

        {/* LOCATION TAB */}
        <TabsContent value="location" className="space-y-4 mt-6">
          <LocationSection
            address={form.address}
            fullAddress={form.fullAddress}
            city={form.city}
            locality={form.locality}
            lat={form.lat}
            lng={form.lng}
            errors={errors}
            onUpdate={update}
          />
        </TabsContent>

        {/* AMENITIES TAB */}
        <TabsContent value="amenities" className="space-y-4 mt-6">
          <AmenitiesSection
            amenities={form.amenities}
            onUpdate={update}
            toggleAmenity={handleToggleAmenity}
          />
        </TabsContent>

        {/* HOURS TAB */}
        <TabsContent value="hours" className="space-y-4 mt-6">
          <HoursSection
            checkInTime={form.checkInTime}
            checkOutTime={form.checkOutTime}
            minStayDays={form.minStayDays}
            onUpdate={update}
          />
        </TabsContent>

        {/* POLICIES TAB */}
        <TabsContent value="policies" className="space-y-4 mt-6">
          <PoliciesSection
            rulesAndRegulations={form.rulesAndRegulations}
            cancellationPolicy={form.cancellationPolicy}
            onUpdate={update}
          />
        </TabsContent>

        {/* CONTACT TAB */}
        <TabsContent value="contact" className="space-y-4 mt-6">
          <ContactSection
            managerName={form.managerName}
            phoneNumber={form.phoneNumber}
            onUpdate={update}
          />
        </TabsContent>

        {/* STATUS TAB */}
        <TabsContent value="status" className="space-y-4 mt-6">
          <StatusSection
            isPublished={form.isPublished}
            isFeatured={form.isFeatured}
            onUpdate={update}
          />
        </TabsContent>
      </Tabs>

      {/* ACTION BUTTONS */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sticky bottom-0 bg-white dark:bg-zinc-950 p-4 sm:p-6 border-t border-zinc-200 dark:border-zinc-800 rounded-b-lg -mx-2 sm:mx-0">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={loading}
          className="w-full sm:w-auto border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 h-12 sm:h-10 text-sm sm:text-base"
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto ml-0 sm:ml-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white h-12 sm:h-10 text-sm sm:text-base"
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : 'Save Property'}
        </Button>
      </div>
    </form>
  );
}
