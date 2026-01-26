/**
 * Image Naming & Management Utility
 * Ensures predictable, readable file naming conventions
 */

export type ImageContext = 'pg' | 'room' | 'bed' | 'user' | 'amenity';
export type ImageCategory = 'thumbnail' | 'hero' | 'img01' | 'img02' | 'img03' | 'img04' | 'img05' | 'img06' | 'img07' | 'img08' | 'img09' | 'profile';

/**
 * Generate predictable image filename
 * 
 * Format: {context}-{shortId}-{category}-{timestamp}.jpg
 * Example: pg-gnble001-thumb-1705693200.jpg
 * 
 * @param context - Entity type (pg, room, bed, user)
 * @param contextId - Full entity ID or readable short ID
 * @param category - Image type (thumbnail, hero, img01, etc.)
 * @returns Formatted filename string
 */
export function generateImageFilename(
  context: ImageContext,
  contextId: string,
  category: ImageCategory
): string {
  const timestamp = Math.floor(Date.now() / 1000);
  
  // Extract first 8 chars if ID is longer (for readability)
  const shortId = contextId.length > 8 ? contextId.substring(0, 8) : contextId;
  
  return `${context}-${shortId}-${category}-${timestamp}.jpg`;
}

/**
 * Parse filename back to components
 * Useful for managing/organizing images
 */
export function parseImageFilename(filename: string) {
  const pattern = /^([a-z]+)-([a-z0-9]+)-([a-z0-9]+)-(\d+)\.jpg$/i;
  const match = filename.match(pattern);
  
  if (!match) {
    return null;
  }
  
  return {
    context: match[1] as ImageContext,
    contextId: match[2],
    category: match[3] as ImageCategory,
    timestamp: parseInt(match[4]),
    uploadedAt: new Date(parseInt(match[4]) * 1000),
  };
}

/**
 * Get folder path for storing images
 */
export function getImageFolderPath(context: ImageContext, contextId: string, subcategory?: string): string {
  const basePath = '/uploads';
  
  switch (context) {
    case 'pg':
      return subcategory ? `${basePath}/pgs/${contextId}/${subcategory}` : `${basePath}/pgs/${contextId}`;
    case 'room':
      return `${basePath}/rooms/${contextId}`;
    case 'bed':
      return `${basePath}/beds/${contextId}`;
    case 'user':
      return `${basePath}/users/${contextId}`;
    case 'amenity':
      return `${basePath}/amenities`;
    default:
      return basePath;
  }
}

/**
 * Determine recommended subcategory based on image category
 */
export function getImageSubcategory(category: ImageCategory): string | undefined {
  switch (category) {
    case 'thumbnail':
    case 'hero':
      return category;
    case 'img01':
    case 'img02':
    case 'img03':
    case 'img04':
    case 'img05':
    case 'img06':
    case 'img07':
    case 'img08':
    case 'img09':
      return 'gallery';
    case 'profile':
      return 'profile';
    default:
      return undefined;
  }
}

/**
 * Image dimension specifications
 */
export const IMAGE_SPECS = {
  pgThumbnail: {
    width: 400,
    height: 300,
    ratio: '4:3',
    maxSize: 2 * 1024 * 1024, // 2MB
    category: 'thumbnail' as ImageCategory,
  },
  pgHero: {
    width: 1200,
    height: 675,
    ratio: '16:9',
    maxSize: 3 * 1024 * 1024, // 3MB
    category: 'hero' as ImageCategory,
  },
  roomImage: {
    width: 600,
    height: 400,
    ratio: '3:2',
    maxSize: 2 * 1024 * 1024, // 2MB
    category: 'img01' as ImageCategory, // Can be img01-09
  },
  bedImage: {
    width: 600,
    height: 400,
    ratio: '3:2',
    maxSize: 2 * 1024 * 1024, // 2MB
    category: 'img01' as ImageCategory,
  },
  profileImage: {
    width: 300,
    height: 300,
    ratio: '1:1',
    maxSize: 1 * 1024 * 1024, // 1MB
    category: 'profile' as ImageCategory,
  },
  galleryImage: {
    width: 1200,
    height: 800,
    ratio: '3:2',
    maxSize: 3 * 1024 * 1024, // 3MB
    category: 'img01' as ImageCategory, // Multiple images
  },
  amenityIcon: {
    width: 500,
    height: 500,
    ratio: '1:1',
    maxSize: 500 * 1024, // 500KB
    category: 'icon' as ImageCategory,
  },
} as const;

/**
 * Validate image file
 */
export function validateImageFile(
  file: File,
  maxSize: number = 5 * 1024 * 1024
): { valid: boolean; error?: string } {
  const allowedMimes = ['image/jpeg', 'image/png', 'image/webp'];
  
  if (!allowedMimes.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid format. Allowed: JPG, PNG, WebP. Got: ${file.type}`,
    };
  }
  
  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Max: ${Math.round(maxSize / 1024 / 1024)}MB. Got: ${Math.round(file.size / 1024 / 1024)}MB`,
    };
  }
  
  return { valid: true };
}

/**
 * Create readable ID for PG
 * Example: "g-noble-001" from pgId
 * 
 * @param pgName - PG name (e.g., "The Elite Venue")
 * @param city - City name (e.g., "Gurugram")
 * @param sequence - Sequence number (e.g., 1, 2, 3)
 */
export function generateReadablePGId(pgName: string, city: string, sequence: number): string {
  // Get first letter of city
  const cityPrefix = city.toLowerCase().charAt(0);
  
  // Get first 4 chars of name or shorter
  const namePrefix = pgName
    .toLowerCase()
    .split(' ')[0]
    .substring(0, 4)
    .replace(/[^a-z0-9]/g, '');
  
  // Format: g-noble-001
  return `${cityPrefix}-${namePrefix}-${String(sequence).padStart(3, '0')}`;
}

/**
 * Create readable Room ID
 * Example: "r-gnble001-101" from pg and room number
 */
export function generateReadableRoomId(pgId: string, roomNumber: string): string {
  // Format: r-{pgId}-{roomNumber}
  return `r-${pgId}-${roomNumber}`;
}

/**
 * Create readable Bed ID
 * Example: "b-gnble001101-A" from room and bed letter
 */
export function generateReadableBedId(roomId: string, bedLetter: string): string {
  // Format: b-{roomId}-{bedLetter}
  return `b-${roomId}-${bedLetter}`;
}

/**
 * Usage Example:
 * 
 * // Generate filename
 * const filename = generateImageFilename('pg', 'gnble001', 'thumbnail');
 * // Returns: "pg-gnble001-thumbnail-1705693200.jpg"
 * 
 * // Parse filename
 * const parsed = parseImageFilename(filename);
 * // Returns: {
 * //   context: 'pg',
 * //   contextId: 'gnble001',
 * //   category: 'thumbnail',
 * //   timestamp: 1705693200,
 * //   uploadedAt: Date
 * // }
 * 
 * // Get folder path
 * const path = getImageFolderPath('pg', 'gnble001', 'thumbnail');
 * // Returns: "/uploads/pgs/gnble001/thumbnail"
 * 
 * // Validate file
 * const validation = validateImageFile(file, IMAGE_SPECS.pgThumbnail.maxSize);
 * 
 * // Generate readable IDs
 * const pgId = generateReadablePGId('The Elite Venue', 'Gurugram', 1);
 * // Returns: "g-elite-001"
 */
