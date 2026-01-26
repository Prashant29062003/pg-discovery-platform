/**
 * Admin & Visitor Data Validation Schemas
 * Zod v4 compatible – Next.js production safe
 */

import { z } from 'zod';

/* -------------------------------------------------------------------------- */
/*                               ENUM DEFINITIONS                              */
/* -------------------------------------------------------------------------- */

export const CITIES = ['Gurugram', 'Noida', 'Bangalore', 'Pune'] as const;
export const GENDER_TYPES = ['MALE', 'FEMALE', 'UNISEX'] as const;
export const ROOM_TYPES = ['SINGLE', 'DOUBLE', 'TRIPLE', 'OTHER'] as const;
export const BED_TYPES = ['SINGLE', 'DOUBLE', 'QUEEN'] as const;
export const ENQUIRY_GENDER_PREF = ['MALE', 'FEMALE', 'ANY'] as const;

export type City = typeof CITIES[number];
export type GenderType = typeof GENDER_TYPES[number];
export type RoomType = typeof ROOM_TYPES[number];
export type BedType = typeof BED_TYPES[number];

/* -------------------------------------------------------------------------- */
/*                              PG VALIDATION SCHEMA                           */
/* -------------------------------------------------------------------------- */

export const pgValidationSchema = z.object({
  pgName: z
    .string()
    .min(3, 'PG name must be at least 3 characters')
    .max(100, 'PG name must not exceed 100 characters')
    .regex(/^[a-zA-Z0-9\s'-]+$/, 'Invalid characters in PG name'),

  description: z
    .string()
    .min(20, 'Description must be at least 20 characters')
    .max(500, 'Description must not exceed 500 characters'),

  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address must not exceed 200 characters'),

  city: z.enum(CITIES, {
    message: 'Select a valid city',
  }),

  locality: z
    .string()
    .min(2, 'Locality must be at least 2 characters')
    .max(50, 'Locality must not exceed 50 characters'),

  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),

  emailAddress: z.string().email('Invalid email address'),

  managerName: z
    .string()
    .min(2, 'Manager name too short')
    .max(50, 'Manager name too long'),

  rentAmount: z
    .coerce.number()
    .min(5000, 'Minimum rent is ₹5,000')
    .max(500000, 'Maximum rent is ₹5,00,000'),

  securityDeposit: z
    .coerce.number()
    .min(5000, 'Minimum deposit is ₹5,000')
    .max(500000, 'Maximum deposit is ₹5,00,000'),

  maxOccupancy: z
    .coerce.number()
    .int()
    .min(1)
    .max(50),

  genderType: z.enum(GENDER_TYPES, {
    message: 'Select a valid gender type',
  }),

  minStayDays: z
    .coerce.number()
    .int()
    .min(1)
    .max(365),

  checkInTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),

  checkOutTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, 'Invalid time format (HH:MM)'),

  amenities: z
    .array(z.string())
    .min(3, 'Select at least 3 amenities')
    .max(15, 'Maximum 15 amenities allowed'),

  rulesAndRegulations: z
    .string()
    .min(20)
    .max(1000),

  cancellationPolicy: z
    .string()
    .min(20)
    .max(1000),

  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export type PGFormData = z.infer<typeof pgValidationSchema>;

/* -------------------------------------------------------------------------- */
/*                              ROOM VALIDATION                                */
/* -------------------------------------------------------------------------- */

export const roomValidationSchema = z.object({
  roomNumber: z
    .string()
    .toUpperCase()
    .min(1)
    .max(10)
    .regex(/^[0-9A-Z\-]+$/, 'Invalid room number'),

  roomType: z.enum(ROOM_TYPES, {
    message: 'Select a valid room type',
  }),

  capacity: z
    .coerce.number()
    .int()
    .min(1)
    .max(10),

  rentAmount: z
    .coerce.number()
    .min(5000)
    .max(500000),

  isAvailable: z.boolean().default(true),
});

export type RoomFormData = z.infer<typeof roomValidationSchema>;

/* -------------------------------------------------------------------------- */
/*                               BED VALIDATION                                */
/* -------------------------------------------------------------------------- */

export const bedValidationSchema = z.object({
  bedLetter: z
    .string()
    .regex(/^[A-Z]$/, 'Bed letter must be A–Z'),

  bedType: z.enum(BED_TYPES, {
    message: 'Select a valid bed type',
  }),

  rentAmount: z
    .coerce.number()
    .min(5000)
    .max(500000),

  isAvailable: z.boolean().default(true),
});

export type BedFormData = z.infer<typeof bedValidationSchema>;

/* -------------------------------------------------------------------------- */
/*                             ENQUIRY VALIDATION                              */
/* -------------------------------------------------------------------------- */

export const enquiryValidationSchema = z.object({
  visitorName: z
    .string()
    .min(2)
    .max(50),

  emailAddress: z.string().email(),

  phoneNumber: z
    .string()
    .regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),

  message: z
    .string()
    .min(10)
    .max(500),

  preferredCheckInDate: z
    .string()
    .refine((date) => {
      const selected = new Date(date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, 'Check-in date cannot be in the past'),

  budget: z
    .coerce.number()
    .min(5000)
    .max(500000)
    .optional(),

  genderPreference: z
    .enum(ENQUIRY_GENDER_PREF)
    .optional(),
});

export type EnquiryFormData = z.infer<typeof enquiryValidationSchema>;

/* -------------------------------------------------------------------------- */
/*                             AMENITY VALIDATION                              */
/* -------------------------------------------------------------------------- */

export const amenityValidationSchema = z.object({
  amenityName: z
    .string()
    .min(2)
    .max(50),

  amenityIcon: z
    .string()
    .url('Invalid icon URL'),

  description: z
    .string()
    .max(200)
    .optional(),
});

export type AmenityFormData = z.infer<typeof amenityValidationSchema>;

/* -------------------------------------------------------------------------- */
/*                          VALIDATION ERROR FORMATTER                         */
/* -------------------------------------------------------------------------- */

export function formatValidationErrors(
  error: z.ZodError
): Record<string, string> {
  const formatted: Record<string, string> = {};

  error.issues.forEach((issue) => {
    const key = issue.path.join('.');
    formatted[key] = issue.message;
  });

  return formatted;
}


/* -------------------------------------------------------------------------- */
/*                         PREDEFINED AMENITY OPTIONS                          */
/* -------------------------------------------------------------------------- */

export const AMENITY_OPTIONS = [
  { id: 'HIGH_SPEED_WIFI', name: 'High-Speed WiFi', icon: '📡' },
  { id: 'AIR_CONDITIONING', name: 'Air Conditioning', icon: '❄️' },
  { id: 'LAUNDRY_SERVICE', name: 'Laundry Service', icon: '🧺' },
  { id: '24_7_SECURITY', name: '24/7 Security', icon: '🔒' },
  { id: 'COMMON_AREA', name: 'Common Area', icon: '🛋️' },
  { id: 'HOT_WATER', name: 'Hot Water 24/7', icon: '🚿' },
  { id: 'PARKING', name: 'Parking Available', icon: '🅿️' },
  { id: 'GYM', name: 'Gym Facility', icon: '💪' },
  { id: 'POWER_BACKUP', name: 'Power Backup', icon: '⚡' },
  { id: 'TV_CABLE', name: 'TV & Cable', icon: '📺' },
  { id: 'KITCHEN_ACCESS', name: 'Kitchen Access', icon: '🍳' },
  { id: 'STUDY_AREA', name: 'Study Area', icon: '📚' },
] as const;


/**
 * Usage Example:
 * 
 * import { pgValidationSchema, formatValidationErrors } from '@/lib/validation-schemas';
 * 
 * // Validate PG data
 * const result = pgValidationSchema.safeParse(formData);
 * 
 * if (!result.success) {
 *   const errors = formatValidationErrors(result.error);
 *   console.log(errors);
 *   // { pgName: 'PG name must be at least 3 characters', ... }
 * } else {
 *   const validData = result.data;
 *   // Proceed with saving
 * }
 */
