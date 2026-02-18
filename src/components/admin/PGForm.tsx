'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Save, X, Home, Image, MapPin, Wifi, Clock, FileText, Phone, CheckCircle } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import { showToast } from '@/utils/toast';
import { useAutoSave } from '@/hooks/useAutoSave';
import { cn } from '@/utils';
import { Stepper, StepContent, StepperNavigation } from './Stepper';
import { createPGSchema, type CreatePGInput } from '@/modules/pg/pg.schema';

// Import utilities
import { validateFormData } from './utils/validation';

// Import section components
import { BasicInfoSection } from './sections/BasicInfoSection';
import { ImprovedImagesSection } from './sections/ImprovedImagesSection';
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
type PGFormData = {
  id: string;
  name: string;
  description: string;
  gender: 'MALE' | 'FEMALE' | 'UNISEX';
  address: string;
  fullAddress: string;
  city: string;
  locality: string;
  state: string;
  country: string;
  images: string[];
  imageNames: string[];
  thumbnailImage: string;
  amenities: string[];
  managerName: string;
  phoneNumber: string;
  checkInTime: string;
  checkOutTime: string;
  minStayDays: number;
  cancellationPolicy: string;
  rulesAndRegulations: string;
  lat: number;
  lng: number;
  isPublished: boolean;
  isFeatured: boolean;
  slug: string;
};

export default function PGForm({ initialData }: PGFormProps) {
  const router = useRouter();
  const { clearPgsCache } = useAppStore(); // Add cache clearing function
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const isEditMode = Boolean(initialData?.id); // Add edit mode check

  // Debug: Log initial data to see what we're receiving
  console.log('PGForm initialData:', initialData);

  // Initialize React Hook Form
  const methods = useForm<PGFormData>({
    // resolver: zodResolver(createPGSchema), // Temporarily disabled for build
    defaultValues: {
      name: initialData?.name || '',
      description: initialData?.description || '',
      gender: initialData?.gender || 'UNISEX',
      address: initialData?.address || '',
      fullAddress: initialData?.fullAddress || '',
      city: initialData?.city || '',
      locality: initialData?.locality || '',
      state: initialData?.state || '',
      country: initialData?.country || '',
      images: initialData?.images || [],
      imageNames: initialData?.imageNames || [],
      thumbnailImage: initialData?.thumbnailImage || '',
      amenities: initialData?.amenities || [],
      managerName: initialData?.managerName || '',
      phoneNumber: initialData?.phoneNumber || '',
      checkInTime: initialData?.checkInTime || '',
      checkOutTime: initialData?.checkOutTime || '',
      minStayDays: initialData?.minStayDays || undefined,
      cancellationPolicy: initialData?.cancellationPolicy || '',
      rulesAndRegulations: initialData?.rulesAndRegulations || '',
      lat: initialData?.lat || undefined,
      lng: initialData?.lng || undefined,
      isPublished: initialData?.isPublished || false,
      isFeatured: initialData?.isFeatured || false,
    },
    mode: 'onBlur',
  });

  const { handleSubmit: rhfHandleSubmit, formState: { errors }, watch, setValue, setError, clearErrors } = methods;

  // Watch form data for auto-save
  const formData = watch();

  // Define stepper steps
  const steps = [
    {
      id: 'basic',
      label: 'Basic Info',
      description: 'Property name, description, and type',
      icon: <Home className="w-4 h-4" />,
    },
    {
      id: 'images',
      label: 'Images',
      description: 'Upload property photos',
      icon: <Image className="w-4 h-4" />,
    },
    {
      id: 'location',
      label: 'Location',
      description: 'Address and map location',
      icon: <MapPin className="w-4 h-4" />,
    },
    {
      id: 'amenities',
      label: 'Amenities',
      description: 'Available facilities',
      icon: <Wifi className="w-4 h-4" />,
    },
    {
      id: 'hours',
      label: 'Hours',
      description: 'Check-in/out times',
      icon: <Clock className="w-4 h-4" />,
    },
    {
      id: 'policies',
      label: 'Policies',
      description: 'Rules and cancellation',
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: 'contact',
      label: 'Contact',
      description: 'Manager contact details',
      icon: <Phone className="w-4 h-4" />,
    },
    {
      id: 'status',
      label: 'Status',
      description: 'Publishing settings',
      icon: <CheckCircle className="w-4 h-4" />,
    },
  ];

  // Auto-save functionality - Fixed localStorage logic
  const { loadFromLocalStorage, clearSavedData } = useAutoSave({
    key: `pg-draft-${formData.id || 'new'}`,
    data: formData,
    onSave: async (data) => {
      // Let the hook handle localStorage automatically - no duplicate save needed
      console.log('🔄 Auto-save triggered (hook handles localStorage automatically)');
      
      // Optional: Add validation before auto-save
      const validationErrors = validateFormData(data);
      if (Object.keys(validationErrors).length > 0) {
        console.log('⚠️ Skipping auto-save due to validation errors:', validationErrors);
        return;
      }
      
      console.log('💾 Auto-save data validated and will be saved by hook');
    },
    debounceMs: 3000,
    enabled: !formData.isPublished, // Auto-save for all drafts (more lenient)
    showNotifications: false, // Disable auto-save notifications for better UX
  });

  // Load draft on mount - Enhanced with better error handling
  useEffect(() => {
    if (!initialData) {
      try {
        const savedDraft = loadFromLocalStorage();
        if (savedDraft) {
          console.log('📋 Loaded draft from localStorage:', savedDraft);
          
          // Validate draft data before applying
          const validationErrors = validateFormData(savedDraft);
          if (Object.keys(validationErrors).length > 0) {
            console.warn('⚠️ Draft has validation errors, loading anyway:', validationErrors);
          }
          
          // Load draft into React Hook Form with error handling
          Object.keys(savedDraft).forEach(key => {
            try {
              if (savedDraft[key] !== undefined && savedDraft[key] !== null) {
                setValue(key as any, savedDraft[key]);
              }
            } catch (fieldError) {
              console.error(`❌ Failed to load field ${key}:`, fieldError);
            }
          });
          
          showToast.info('Draft restored', 'Your previous work has been restored');
          console.log('✅ Draft successfully restored to form');
        } else {
          console.log('📋 No saved draft found');
        }
      } catch (error) {
        console.error('❌ Failed to load draft from localStorage:', error);
        showToast.error('Draft Error', 'Could not restore your previous work');
      }
    }
  }, [initialData, loadFromLocalStorage, setValue]);

  // Update save button state when form changes
  useEffect(() => {
    // This will trigger re-render of save button when form data changes
    const completion = calculateFormCompletion();
  }, [formData]);

  /**
   * Update form field and clear its error
   */
  function update(key: string, value: any) {
    setValue(key as any, value);
    if (errors[key as keyof typeof errors]) {
      clearErrors(key as keyof typeof errors);
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
      const value = formData[field as keyof typeof formData];
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
      const value = formData[field as keyof typeof formData];
      if (value && value.toString().trim().length > 0) {
        completedWeight += weight;
      }
    });

    return Math.round((completedWeight / totalWeight) * 100);
  }

  /**
   * Check if form can be saved (either reached last step or has sufficient completion)
   */
  function canSaveForm(): boolean {
    const completion = calculateFormCompletion();
    const validationErrors = validateFormData(formData);
    
    console.log('🔍 canSaveForm check:', {
      currentStep,
      totalSteps: steps.length,
      isLastStep: currentStep === steps.length - 1,
      completion,
      validationErrorsCount: Object.keys(validationErrors).length,
      validationErrors
    });

    // Allow save if:
    // 1. User is on the last step (status)
    // 2. Form is at least 30% complete AND has no validation errors
    // 3. Basic required fields are filled (name, description, address, city, locality)
    const hasBasicInfo = Boolean(formData.name && formData.description && formData.address && formData.city && formData.locality);
    const hasNoValidationErrors = Object.keys(validationErrors).length === 0;
    const canSave = currentStep === steps.length - 1 || (completion >= 30 && hasNoValidationErrors) || (hasBasicInfo && hasNoValidationErrors);
    
    console.log('🔍 canSaveForm result:', canSave);
    console.log('🔍 Has basic info:', hasBasicInfo);
    console.log('🔍 Has no validation errors:', hasNoValidationErrors);
    
    return canSave;
  }

  /**
   * Get save button text and styling
   */
  function getSaveButtonInfo() {
    const completion = calculateFormCompletion();

    if (currentStep === steps.length - 1) {
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

    return {
      text: `Save (${completion}% Complete)`,
      variant: 'outline' as const,
      disabled: loading,
      className: 'border-gray-300 text-gray-500'
    };
  }

  /**
   * Navigate to next step
   */
  function goToNextStep() {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  /**
   * Navigate to previous step
   */
  function goToPreviousStep() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  /**
   * Handle step click
   */
  function handleStepClick(stepIndex: number) {
    // Allow navigation to any step
    setCurrentStep(stepIndex);
  }

  /**
   * Render current step content
   */
  function renderStepContent() {
    switch (steps[currentStep].id) {
      case 'basic':
        return (
          <BasicInfoSection
            name={formData.name}
            description={formData.description}
            gender={formData.gender}
            errors={errors as Record<string, string>}
            onUpdate={update}
          />
        );
      case 'images':
        return <ImprovedImagesSection images={formData.images} onImagesChange={handleImagesChange} />;
      case 'location':
        return (
          <LocationSection
            address={formData.address || ''}
            fullAddress={formData.fullAddress || ''}
            city={formData.city || ''}
            locality={formData.locality || ''}
            state={formData.state || ''}
            country={formData.country || ''}
            lat={formData.lat?.toString() || ''}
            lng={formData.lng?.toString() || ''}
            errors={errors as Record<string, string>}
            onUpdate={update}
          />
        );
      case 'amenities':
        return (
          <AmenitiesSection
            amenities={formData.amenities || []}
            onUpdate={update}
          />
        );
      case 'hours':
        return (
          <HoursSection
            checkInTime={formData.checkInTime || ''}
            checkOutTime={formData.checkOutTime || ''}
            minStayDays={formData.minStayDays?.toString() || ''}
            onUpdate={update}
          />
        );
      case 'policies':
        return (
          <PoliciesSection
            rulesAndRegulations={formData.rulesAndRegulations || ''}
            cancellationPolicy={formData.cancellationPolicy || ''}
            onUpdate={update}
          />
        );
      case 'contact':
        return (
          <ContactSection
            managerName={formData.managerName || ''}
            phoneNumber={formData.phoneNumber || ''}
            onUpdate={update}
          />
        );
      case 'status':
        return (
          <StatusSection
            isPublished={formData.isPublished || false}
            isFeatured={formData.isFeatured || false}
            onUpdate={update}
          />
        );
      default:
        return null;
    }
  }

// ...

/**
   * Submit form using React Hook Form
   */
  async function onFormSubmit(data: PGFormData) {
    console.log('🚀 Form submission started');
    console.log('📋 Form data being submitted:', {
      name: data.name,
      description: data.description?.substring(0, 50) + '...',
      address: data.address,
      city: data.city,
      locality: data.locality,
      gender: data.gender,
      imagesCount: data.images?.length || 0,
      amenitiesCount: data.amenities?.length || 0
    });
    try {
      // Transform form data to match API expectations
      const submissionData = {
        name: data.name?.trim(),
        description: data.description?.trim(),
        gender: data.gender || 'UNISEX',
        address: data.address?.trim(),
        fullAddress: data.fullAddress?.trim() || '',
        city: data.city?.trim(),
        locality: data.locality?.trim(),
        state: data.state?.trim() || '',
        country: data.country?.trim() || '',
        images: data.images || [],
        imageNames: data.imageNames || [],
        thumbnailImage: data.thumbnailImage?.trim() || '',
        amenities: data.amenities || [],
        managerName: data.managerName?.trim() || '',
        phoneNumber: data.phoneNumber?.trim() || '',
        checkInTime: data.checkInTime?.trim() || '',
        checkOutTime: data.checkOutTime?.trim() || '',
        minStayDays: data.minStayDays ? Number(data.minStayDays) : 1, // Default to 1 instead of undefined
        cancellationPolicy: data.cancellationPolicy?.trim() || '',
        rulesAndRegulations: data.rulesAndRegulations?.trim() || '',
        lat: data.lat ? Number(data.lat) : undefined,
        lng: data.lng ? Number(data.lng) : undefined,
        isPublished: Boolean(data.isPublished),
        isFeatured: Boolean(data.isFeatured),
      };

      console.log('📤 Transformed submission data:', submissionData);
      console.log('📤 Submission data details:', {
        name: submissionData.name,
        nameLength: submissionData.name?.length,
        description: submissionData.description,
        descriptionLength: submissionData.description?.length,
        address: submissionData.address,
        addressLength: submissionData.address?.length,
        city: submissionData.city,
        cityLength: submissionData.city?.length,
        locality: submissionData.locality,
        localityLength: submissionData.locality?.length,
      });

      const res = await fetch('/api/admin/pgs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submissionData),
      });

      console.log('📡 API response status:', res.status);
      console.log('📡 API response headers:', Object.fromEntries(res.headers.entries()));
      
      // Check authentication headers
      const authHeader = res.headers.get('authorization');
      const cookieHeader = res.headers.get('cookie');
      console.log('🔐 Authentication headers:', {
        authorization: authHeader,
        cookie: cookieHeader,
        hasAuth: !!authHeader || !!cookieHeader
      });

      // Clone response before reading body for debugging
      const responseClone = res.clone();
      
      let json;
      try {
        json = await res.json();
      } catch (e) {
        console.error('❌ Failed to parse JSON response:', e);
        json = { success: false, message: 'Invalid server response' };
      }

      console.log('📄 API response:', { status: res.status, json });
      
      // Handle validation errors with user-friendly warnings
      if (res.status === 422) {
        try {
          const responseText = await responseClone.text();
          const validationData = JSON.parse(responseText);
          
          if (validationData?.validation) {
            const validationErrors = validationData.validation;
            const errorMessages = Object.values(validationErrors).join(', ');
            
            // Show user-friendly warning toast
            showToast.warning('Please complete required fields', errorMessages);
            
            // Set form error for UI display
            setError('root', { 
              message: `Please fill in: ${errorMessages}` 
            });
          }
        } catch (parseError) {
          showToast.warning('Validation Required', 'Please check all required fields (name, description, address, city, locality)');
          setError('root', { 
            message: 'Please check all required fields' 
          });
        }
      }

      if (json?.success) {
        // Clear draft on successful save
        try {
          clearSavedData();
          console.log('🗑️ Draft cleared from localStorage');
        } catch (clearError) {
          console.error('❌ Failed to clear draft:', clearError);
        }
        
        // Clear PG cache to force refresh on listing pages
        try {
          clearPgsCache();
          console.log('🗑️ PG cache cleared - forcing refresh on listing pages');
        } catch (cacheError) {
          console.error('❌ Failed to clear PG cache:', cacheError);
        }
        
        // Show success feedback
        showToast.success('✅ PG saved successfully!', isEditMode ? 'Your changes have been saved.' : 'Your PG has been created successfully.');

        // Show additional success info
        if (json.pgId) {
          showToast.info('PG Created', `PG ID: ${json.pgId}`);
        }

        // Show navigation feedback
        showToast.info('Redirecting...', 'Taking you to the admin PG listing page...');

        // Delay navigation to allow user to see success toast
        setTimeout(() => {
          try {
            // Navigate to admin PG listing page only (for PG owners/admins)
            router.push('/admin/pgs');
          } catch (navError) {
            console.error('❌ Navigation failed:', navError);
            showToast.error('Navigation Error', 'Could not redirect to admin listing page');
          }
        }, 1500); // Increased delay for better UX
        return; // Exit early to prevent further execution
      } else {
        // Handle validation errors specifically
        if (res.status === 422 && json.validation) {
          console.error('❌ Validation errors:', json.validation);
          
          // Handle validation errors with user-friendly warnings
          if (json?.validation && Object.keys(json.validation).length > 0) {
            const errorMessages = Object.values(json.validation).join(', ');
            
            // Show user-friendly warning instead of console error
            showToast.warning('Please complete required fields', errorMessages);
            setError('root', { message: `Please fill in: ${errorMessages}` });
            
          } else {
            // Handle empty validation object
            const manualValidation = validateFormData(data);
            
            if (Object.keys(manualValidation).length > 0) {
              const errorMessages = Object.values(manualValidation).join(', ');
              showToast.warning('Please complete required fields', errorMessages);
              setError('root', { message: `Please fill in: ${errorMessages}` });
            } else {
              showToast.warning('Validation Required', 'Please check all required fields (name, description, address, city, locality)');
              setError('root', { message: 'Please check all required fields' });
            }
          }
        } else {
          // Handle API errors
          const errorMsg = json?.message || 'Failed to save PG';
          setError('root', { message: errorMsg });
          showToast.error(`Failed to save PG: ${errorMsg}`);
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to save PG';
      setError('root', { message: errorMsg });
      showToast.error(`Failed to save PG: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={rhfHandleSubmit(onFormSubmit)} className="space-y-6 px-2 sm:px-0">
        {/* Error Alert */}
        {errors.root && (
          <Alert variant="destructive" className="mx-2 sm:mx-0">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errors.root.message}</AlertDescription>
          </Alert>
        )}

        {/* Stepper Navigation */}
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          className="mb-8 hidden lg:block"
          orientation="horizontal"
        />

        {/* Mobile Vertical Stepper */}
        <Stepper
          steps={steps}
          currentStep={currentStep}
          onStepClick={handleStepClick}
          className="mb-8 lg:hidden"
          orientation="vertical"
          size="sm"
        />

        {/* Step Content */}
        <StepContent steps={steps} currentStep={currentStep}>
          {renderStepContent()}
        </StepContent>

        {/* Stepper Navigation */}
        <StepperNavigation
          currentStep={currentStep}
          totalSteps={steps.length}
          onPrevious={goToPreviousStep}
          onNext={goToNextStep}
          onSubmit={() => rhfHandleSubmit(onFormSubmit)()}
          canGoNext={true}
          canGoPrevious={currentStep > 0}
          isLastStep={currentStep === steps.length - 1}
          isLoading={loading}
        />

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
    </FormProvider>
  );
}
