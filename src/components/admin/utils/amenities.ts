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
