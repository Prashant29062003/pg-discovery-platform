/**
 * PG (Property) Management Validation Schemas
 * Centralized schemas for PG CRUD operations
 */

import { z } from 'zod';

export const PG_GENDERS = ['MALE', 'FEMALE', 'UNISEX'] as const;
export type PGGender = typeof PG_GENDERS[number];

/**
 * Schema for creating/updating a PG property
 * Validates all required and optional fields for PG management
 */
export const createPGSchema = z.object({
  name: z.string().min(1, 'PG name is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  // Accept both full URLs (Cloudinary) and relative paths (local storage)
  images: z.array(
    z.string()
      .url('Image must be a valid URL')
      .or(z.string().regex(/^\/uploads\//, 'Image must be a valid URL or local path'))
  ).default([]),
  imageNames: z.array(z.string()).default([]), // Image labels/descriptions
  thumbnailImage: z.string().optional(), // Main thumbnail/preview image
  amenities: z.array(z.string()).default([]),
  gender: z.enum(PG_GENDERS).default('UNISEX'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  locality: z.string().min(2, 'Locality is required'),
  managerName: z.string().optional(),
  phoneNumber: z.string().transform(v => v?.trim() || '').refine(val => !val || /^[6-9]\d{9}$/.test(val), { message: 'Invalid Indian phone number' }).optional(),
  checkInTime: z.string().optional(), // HH:MM format
  checkOutTime: z.string().optional(), // HH:MM format
  minStayDays: z.coerce.number().int().min(1, 'Minimum 1 day required').optional(),
  cancellationPolicy: z.string().optional(),
  rulesAndRegulations: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
});

/**
 * Schema for updates - phoneNumber is optional and accepts any value
 */
export const updatePGSchema = createPGSchema.partial().extend({
  phoneNumber: z.string().optional(),
  imageNames: z.array(z.string()).optional(),
});

export type CreatePGInput = z.infer<typeof createPGSchema>;
export type UpdatePGInput = z.infer<typeof updatePGSchema>;

/**
 * Schema for deleting a PG
 */
export const deletePGSchema = z.object({
  pgId: z.string().min(1, 'PG ID is required'),
});

export type DeletePGInput = z.infer<typeof deletePGSchema>;
