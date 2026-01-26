/**
 * Form validation utilities and schema for PG form
 */
import { z } from 'zod';

export const pgFormValidationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  locality: z.string().min(1, 'Locality is required'),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX']).optional(),
  managerName: z.string().optional(),
  phoneNumber: z.string().optional(),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  minStayDays: z.string().or(z.number()).optional(),
  cancellationPolicy: z.string().optional(),
  rulesAndRegulations: z.string().optional(),
  lat: z.string().or(z.number()).optional(),
  lng: z.string().or(z.number()).optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.string()).optional(),
  fullAddress: z.string().optional(),
  isPublished: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export type PGFormValidationData = z.infer<typeof pgFormValidationSchema>;

/**
 * Validate form data and return errors
 */
export function validateFormData(data: any): Record<string, string> {
  const newErrors: Record<string, string> = {};

  const trimmedName = data.name?.trim() || '';
  const trimmedDesc = data.description?.trim() || '';
  const trimmedAddr = data.address?.trim() || '';
  const trimmedCity = data.city?.trim() || '';
  const trimmedLocality = data.locality?.trim() || '';

  if (!trimmedName) {
    newErrors.name = 'Name is required';
  } else if (trimmedName.length < 2) {
    newErrors.name = 'Name must be at least 2 characters';
  }

  if (!trimmedDesc) {
    newErrors.description = 'Description is required';
  } else if (trimmedDesc.length < 20) {
    newErrors.description = 'Description must be at least 20 characters';
  }

  if (!trimmedAddr) {
    newErrors.address = 'Address is required';
  }

  if (!trimmedCity) {
    newErrors.city = 'City is required';
  }

  if (!trimmedLocality) {
    newErrors.locality = 'Locality is required';
  }

  return newErrors;
}
