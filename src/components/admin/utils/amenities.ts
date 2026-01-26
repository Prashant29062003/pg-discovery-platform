/**
 * Common amenities list for PG properties
 */
export const COMMON_AMENITIES = [
  'WiFi',
  'Parking',
  'Gym',
  'Laundry',
  'Hot Water',
  'Kitchen Access',
  'AC',
  'TV',
  'Cooler',
  'Meals Included',
  'Study Desk',
  'Attached Bathroom',
  'Common Lounge',
  'Security Camera',
  'Generator',
  'Solar Panel',
] as const;

export type Amenity = (typeof COMMON_AMENITIES)[number];

/**
 * Toggle amenity in the list
 */
export function toggleAmenity(amenities: string[], amenity: string): string[] {
  return amenities.includes(amenity)
    ? amenities.filter((a) => a !== amenity)
    : [...amenities, amenity];
}
