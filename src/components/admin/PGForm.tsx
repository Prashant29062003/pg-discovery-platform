'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save, X } from 'lucide-react';
import { showToast } from '@/utils/toast';
import { useAutoSave } from '@/hooks/useAutoSave';
import { cn } from '@/utils';

// Import utilities
import { validateFormData } from './utils/validation';

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
export function PGForm({ initialData }: PGFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basic');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

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

  // Auto-save functionality
  const { loadFromLocalStorage, clearSavedData } = useAutoSave({
    key: `pg-draft-${form.id || 'new'}`,
    data: form,
    onSave: async (data) => {
      try {
        const response = await fetch('/api/admin/pgs/draft', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pgId: data.id,
            data,
            title: data.name || 'Untitled PG',
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to save draft');
        }
      } catch (error) {
        throw error;
      }
    },
    debounceMs: 3000,
    enabled: !form.isPublished, // Only auto-save for drafts
  });

  // Load draft on mount
  useEffect(() => {
    if (!initialData) {
      const savedDraft = loadFromLocalStorage();
      if (savedDraft) {
        setForm(savedDraft);
        showToast.info('Draft restored', 'Your previous work has been restored');
      }
    }
  }, [initialData, loadFromLocalStorage]);

  // Update save button state when form changes
  useEffect(() => {
    // This will trigger re-render of save button when form data changes
    const completion = calculateFormCompletion();
  }, [form]);

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
   * Handle images change
   */
  function handleImagesChange(newImages: string[]) {
    update('images', newImages);
  }

  /**
   * Get missing fields for completion
   */
  function getMissingFields(): { field: string; label: string; weight: number }[] {
    const allFields = [
      // Basic Info (40% weight)
      { field: 'name', label: 'Property Name', weight: 10 },
      { field: 'description', label: 'Description', weight: 10 },
      { field: 'gender', label: 'Gender Type', weight: 5 },
      { field: 'address', label: 'Street Address', weight: 10 },
      { field: 'city', label: 'City', weight: 5 },
      
      // Location (20% weight)
      { field: 'locality', label: 'Locality/Area', weight: 5 },
      { field: 'lat', label: 'Location Coordinates', weight: 5 },
      { field: 'lng', label: 'Location Coordinates', weight: 5 },
      { field: 'fullAddress', label: 'Full Address', weight: 5 },
      
      // Contact (20% weight)
      { field: 'managerName', label: 'Manager Name', weight: 10 },
      { field: 'phoneNumber', label: 'Phone Number', weight: 10 },
      
      // Hours (10% weight)
      { field: 'checkInTime', label: 'Check-in Time', weight: 5 },
      { field: 'checkOutTime', label: 'Check-out Time', weight: 5 },
      
      // Policies (10% weight)
      { field: 'rulesAndRegulations', label: 'Rules & Regulations', weight: 5 },
      { field: 'cancellationPolicy', label: 'Cancellation Policy', weight: 5 },
    ];

    return allFields.filter(({ field }) => {
      const value = form[field];
      return !value || value.toString().trim().length === 0;
    });
  }
  function calculateFormCompletion(): number {
    // Include more fields for gradual percentage updates
    const allFields = [
      // Basic Info (40% weight)
      { field: 'name', weight: 10 },
      { field: 'description', weight: 10 },
      { field: 'gender', weight: 5 },
      { field: 'address', weight: 10 },
      { field: 'city', weight: 5 },
      
      // Location (20% weight)
      { field: 'locality', weight: 5 },
      { field: 'lat', weight: 5 },
      { field: 'lng', weight: 5 },
      { field: 'fullAddress', weight: 5 },
      
      // Contact (20% weight)
      { field: 'managerName', weight: 10 },
      { field: 'phoneNumber', weight: 10 },
      
      // Hours (10% weight)
      { field: 'checkInTime', weight: 5 },
      { field: 'checkOutTime', weight: 5 },
      
      // Policies (10% weight)
      { field: 'rulesAndRegulations', weight: 5 },
      { field: 'cancellationPolicy', weight: 5 },
    ];

    let totalWeight = 0;
    let completedWeight = 0;

    allFields.forEach(({ field, weight }) => {
      totalWeight += weight;
      const value = form[field];
      if (value && value.toString().trim().length > 0) {
        completedWeight += weight;
      }
    });

    return Math.round((completedWeight / totalWeight) * 100);
  }

  /**
   * Check if form can be saved (either reached last tab or has sufficient completion)
   */
  function canSaveForm(): boolean {
    const completion = calculateFormCompletion();
    const tabs = ['basic', 'images', 'location', 'amenities', 'hours', 'policies', 'contact', 'status'];
    const currentTabIndex = tabs.indexOf(activeTab);
    
    // Allow save if:
    // 1. User is on the last tab (status)
    // 2. Form is at least 50% complete
    // 3. All required fields are filled
    return currentTabIndex === tabs.length - 1 || completion >= 50 || Object.keys(validateFormData(form)).length === 0;
  }

  /**
   * Get save button text and styling
   */
  function getSaveButtonInfo() {
    const completion = calculateFormCompletion();
    const tabs = ['basic', 'images', 'location', 'amenities', 'hours', 'policies', 'contact', 'status'];
    const currentTabIndex = tabs.indexOf(activeTab);
    
    if (currentTabIndex === tabs.length - 1) {
      return {
        text: 'Save Property',
        variant: 'default' as const,
        disabled: loading,
        className: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    }
    
    if (completion >= 50) {
      return {
        text: `Save (${completion}% Complete)`,
        variant: 'default' as const,
        disabled: loading,
        className: 'bg-green-600 hover:bg-green-700 text-white'
      };
    }
    
    if (Object.keys(validateFormData(form)).length === 0) {
      return {
        text: 'Save (Required Fields Complete)',
        variant: 'default' as const,
        disabled: loading,
        className: 'bg-blue-600 hover:bg-blue-700 text-white'
      };
    }
    
    return {
      text: `Complete Form (${completion}%)`,
      variant: 'outline' as const,
      disabled: true,
      className: 'border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100'
    };
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

      // Check if response is actually JSON first
      const responseText = await res.clone().text();

      let json;
      try {
        json = await res.json();
      } catch (e) {
        json = { success: false, message: 'Invalid server response' };
      }
      

      if (json?.success) {
        
        // Clear draft on successful save
        clearSavedData();
        showToast.success('PG saved successfully!');
        
        // Show additional success info
        if (json.pgId) {
          showToast.info('PG Created', `PG ID: ${json.pgId}`);
        }
        
        // Delay navigation to allow user to see success toast
        setTimeout(() => {
          router.push('/admin/pgs');
        }, 500);
        return; // Exit early to prevent further execution
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
      <Tabs defaultValue="basic" className="w-full" onValueChange={setActiveTab}>
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

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
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
          disabled={loading || !canSaveForm()}
          variant={getSaveButtonInfo().variant}
          className={cn(
            "w-full sm:w-auto ml-0 sm:ml-auto h-12 sm:h-10 text-sm sm:text-base",
            getSaveButtonInfo().className
          )}
        >
          <Save className="h-4 w-4 mr-2" />
          {loading ? 'Saving...' : getSaveButtonInfo().text}
        </Button>
        {/* Progress Indicator */}
        {!canSaveForm() && (
          <div className="w-full sm:w-auto ml-0 sm:ml-auto mt-2 space-y-2">
            <div className="text-xs text-zinc-500 dark:text-zinc-400">
              💡 {getSaveButtonInfo().text.replace('Save ', '')}
            </div>
            
            {/* Missing Fields Indicator */}
            {calculateFormCompletion() < 100 && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
                  <div className="text-xs">
                    <p className="font-medium text-amber-800 dark:text-amber-200 mb-2">
                      {calculateFormCompletion() >= 95 
                        ? `Almost Complete! (${getMissingFields().length} field remaining)`
                        : `Missing Fields (${getMissingFields().length} remaining):`
                      }
                    </p>
                    <div className="space-y-1">
                      {getMissingFields().slice(0, 5).map((missing, index) => (
                        <div key={missing.field} className="flex items-center justify-between text-amber-700 dark:text-amber-300">
                          <span className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-amber-500 rounded-full"></span>
                            {missing.label}
                          </span>
                          <span className="text-xs text-amber-600 dark:text-amber-400">
                            +{missing.weight}%
                          </span>
                        </div>
                      ))}
                      {getMissingFields().length > 5 && (
                        <div className="text-xs text-amber-600 dark:text-amber-400 italic">
                          ...and {getMissingFields().length - 5} more fields
                        </div>
                      )}
                    </div>
                    <div className="mt-2 pt-2 border-t border-amber-200 dark:border-amber-800">
                      <p className="text-xs text-amber-600 dark:text-amber-400">
                        {calculateFormCompletion() >= 95 
                          ? `Just ${getMissingFields()[0]?.label || 'one more field'} to reach 100%!`
                          : 'Complete these fields to reach 100% and enable full saving.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  );
}
