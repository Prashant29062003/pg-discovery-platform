/**
 * Library Utilities and Services
 * Central place for all utility functions and services
 */

// Auth
export { getClerkClient, requireOwnerAccess, getUserRole } from './auth';

// Validators (exclude CITIES to avoid conflicts with config/CITIES)
export {
  GENDER_TYPES,
  ROOM_TYPES,
  BED_TYPES,
  ENQUIRY_GENDER_PREF,
  pgValidationSchema,
  roomValidationSchema,
  bedValidationSchema,
  enquiryValidationSchema,
  formatValidationErrors,
} from './validators/index';

// Data and Services
export * from './data-service';

// Image utilities - naming (primary)
export type { ImageContext, ImageCategory } from './image-naming';
export {
  generateImageFilename,
  parseImageFilename,
  getImageFolderPath,
  getImageSubcategory,
  IMAGE_SPECS,
  validateImageFile,
  generateReadablePGId,
  generateReadableRoomId,
  generateReadableBedId,
} from './image-naming';

// Image utils (optimization functions)
export type { ImageDimensions } from './image-utils';
export {
  IMAGE_SIZES,
  resizeImage,
  optimizePGThumbnail,
  optimizePGHero,
  optimizeRoomImage,
  optimizeSquareProfile,
  optimizeGalleryImage,
} from './image-utils';



