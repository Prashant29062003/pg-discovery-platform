/**
 * Common amenities list for PG properties
 * These match the database seed values for consistency
 */
export const COMMON_AMENITIES = [
  'High-Speed WiFi',
  'Parking Available',
  'Gym',
  'Laundry Service',
  'Hot Water',
  'Kitchen Access',
  'AC Rooms',
  'TV',
  'Cooler',
  'Meals Included',
  'Study Desk',
  'Attached Bathroom',
  'Common Room',
  '24/7 Security with CCTV',
  'Power Backup (24/7)',
  'Fully Functional Lift',
];

export type Amenity = typeof COMMON_AMENITIES[number];

/**
 * Toggle amenity in the list
 */
export function toggleAmenity(amenities: string[], amenity: string): string[] {
  return amenities.includes(amenity)
    ? amenities.filter((a) => a !== amenity)
    : [...amenities, amenity];
}

/**
 * Check if an amenity is a common amenity
 */
export function isCommonAmenity(amenity: string): boolean {
  return COMMON_AMENITIES.includes(amenity);
}

/**
 * Filter out common amenities from a list
 */
export function filterCustomAmenities(amenities: string[]): string[] {
  return amenities.filter(a => !isCommonAmenity(a));
}
