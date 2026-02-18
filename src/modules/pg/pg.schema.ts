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
  images: z.array(z.string()).default([]),
  imageNames: z.array(z.string()).default([]), 
  thumbnailImage: z.string().optional(), 
  amenities: z.array(z.string()).default([]),
  gender: z.enum(PG_GENDERS).default('UNISEX'),
  address: z.string().min(5, 'Address is required'),
  fullAddress: z.string().optional(), 
  city: z.string().min(2, 'City is required'),
  locality: z.string().min(2, 'Locality is required'),
  state: z.string().optional(),
  country: z.string().optional(),
  managerName: z.string().optional(),
  phoneNumber: z.string().optional(),
  checkInTime: z.string().optional(),  
  checkOutTime: z.string().optional(), 
  minStayDays: z.coerce.number().int().min(1, 'Minimum 1 day required').optional(),
  cancellationPolicy: z.string().optional(),
  rulesAndRegulations: z.string().optional(),
  lat: z.coerce.number().optional(),
  lng: z.coerce.number().optional(),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
  slug: z.string().optional(),
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
