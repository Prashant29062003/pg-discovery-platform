import { z } from 'zod';

export const pgSchema = z.object({
  // Basic Information
  name: z.string().min(1, 'Property name is required').max(100, 'Property name must be less than 100 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000, 'Description must be less than 2000 characters'),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX']).refine((val) => val !== undefined, {
    message: 'Please select a gender type',
  }),

  // Location
  address: z.string().min(1, 'Street address is required').max(500, 'Address must be less than 500 characters'),
  fullAddress: z.string().optional(),
  city: z.string().min(1, 'City is required').max(100, 'City must be less than 100 characters'),
  locality: z.string().min(1, 'Locality is required').max(100, 'Locality must be less than 100 characters'),
  state: z.string().optional(),
  country: z.string().optional(),
  lat: z.string().optional(),
  lng: z.string().optional(),

  // Images
  images: z.array(z.string().url('Invalid image URL')).optional().default([]),
  thumbnailImage: z.string().url('Invalid thumbnail URL').optional().or(z.literal('')),

  // Amenities
  amenities: z.array(z.string()).optional().default([]),

  // Hours
  checkInTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
  checkOutTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
  minStayDays: z.string().optional(),

  // Contact
  managerName: z.string().min(1, 'Manager name is required').max(100, 'Manager name must be less than 100 characters'),
  phoneNumber: z.string().regex(/^[+]?[\d\s\-\(\)]+$/, 'Invalid phone number').optional(),

  // Policies
  rulesAndRegulations: z.string().optional(),
  cancellationPolicy: z.string().optional(),

  // Status
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),

  // Metadata
  id: z.string().optional(),
  slug: z.string().optional(),
});

export type PGFormData = z.infer<typeof pgSchema>;

// Validation schemas for individual steps
export const basicInfoSchema = pgSchema.pick({
  name: true,
  description: true,
  gender: true,
});

export const locationSchema = pgSchema.pick({
  address: true,
  city: true,
  locality: true,
  lat: true,
  lng: true,
  fullAddress: true,
});

export const contactSchema = pgSchema.pick({
  managerName: true,
  phoneNumber: true,
});

export const hoursSchema = pgSchema.pick({
  checkInTime: true,
  checkOutTime: true,
  minStayDays: true,
});

export const policiesSchema = pgSchema.pick({
  rulesAndRegulations: true,
  cancellationPolicy: true,
});

export const statusSchema = pgSchema.pick({
  isPublished: true,
  isFeatured: true,
});

export const imagesSchema = pgSchema.pick({
  images: true,
  thumbnailImage: true,
});
