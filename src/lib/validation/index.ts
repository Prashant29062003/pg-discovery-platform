/**
 * Validation Module Index
 * Central export point for all validation utilities
 */

// Shared validation utilities
export {
  idSchema,
  phoneSchema,
  emailSchema,
  dateStringSchema,
  optionalDateStringSchema,
  paginationSchema,
  apiResponseSchema,
  createErrorResponse,
  createSuccessResponse,
  formatValidationErrors,
  safeJsonParse,
  type PaginationInput,
  type ApiResponse,
} from './shared';

// Module-specific schemas should be imported from their respective modules:
// - Guests: import from '@/modules/guests/guest.schema'
// - Safety Audits: import from '@/modules/safety/safety.schema'
// - PG Management: import from '@/modules/pg/pg.schema'
// - Rooms & Beds: import from '@/modules/pg/room.schema'
// - Enquiries: import from '@/modules/enquiries/enquiry.schema'

// Legacy validators (for backward compatibility during migration)
export * from '../validators/index';
