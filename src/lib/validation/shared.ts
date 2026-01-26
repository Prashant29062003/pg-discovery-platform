/**
 * Shared Validation Utilities
 * Common validation patterns and helpers used across modules
 */

import { z } from 'zod';

/**
 * Standard ID validation schema
 * Used for validating entity IDs across modules
 */
export const idSchema = z.string().min(1, 'ID is required').max(255);

/**
 * Indian phone number validation schema
 * Accepts 10-digit phone numbers starting with 6-9
 */
export const phoneSchema = z
  .string()
  .regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number')
  .optional()
  .or(z.literal(''));

/**
 * Email validation schema
 * Optional with email format validation
 */
export const emailSchema = z
  .string()
  .email('Invalid email address')
  .optional()
  .or(z.literal(''));

/**
 * Date string validation
 * Accepts ISO date strings
 */
export const dateStringSchema = z
  .string()
  .min(1, 'Date is required')
  .refine((val) => !isNaN(Date.parse(val)), 'Invalid date format');

/**
 * Optional date string for nullable dates
 */
export const optionalDateStringSchema = z
  .string()
  .optional()
  .or(z.literal(''))
  .refine(
    (val) => !val || !isNaN(Date.parse(val)),
    'Invalid date format'
  );

/**
 * Pagination schema
 * Used for list endpoints with limit and offset
 */
export const paginationSchema = z.object({
  limit: z.coerce.number().int().positive().default(10),
  offset: z.coerce.number().int().nonnegative().default(0),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/**
 * Standard response schema for API endpoints
 */
export const apiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string().optional(),
  data: z.unknown().optional(),
  error: z.string().optional(),
});

export type ApiResponse = z.infer<typeof apiResponseSchema>;

/**
 * Error response formatter
 * Standardizes error responses across APIs
 */
export function createErrorResponse(
  message: string,
  status: number = 400
): { error: string; status: number } {
  return {
    error: message,
    status,
  };
}

/**
 * Success response formatter
 * Standardizes success responses across APIs
 */
export function createSuccessResponse<T>(
  data: T,
  message?: string
): Omit<z.infer<typeof apiResponseSchema>, 'error'> {
  return {
    success: true,
    data,
    message,
  };
}

/**
 * Validation error formatter
 * Converts Zod validation errors to user-friendly format
 */
export function formatValidationErrors(error: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};

  error.issues.forEach((err) => {
    const path = err.path.join('.');
    formatted[path] = err.message;
  });

  return formatted;
}

/**
 * Safe JSON parse with validation
 * Returns null if parsing fails
 */
export function safeJsonParse<T>(
  json: string,
  schema?: z.ZodSchema<T>
): T | null {
  try {
    const parsed = JSON.parse(json);
    return schema ? schema.parse(parsed) : parsed;
  } catch {
    return null;
  }
}
