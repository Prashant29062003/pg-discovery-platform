/**
 * Room Type Utilities
 * Automatically determines room type based on bed count
 */

export type RoomType = 'SINGLE' | 'DOUBLE' | 'TRIPLE' | 'OTHER';

/**
 * Determines room type based on the number of beds
 * @param bedCount - Number of beds in the room
 * @returns Room type string
 */
export function getRoomTypeByBedCount(bedCount: number): RoomType {
  if (bedCount <= 0) return 'OTHER';
  if (bedCount === 1) return 'SINGLE';
  if (bedCount === 2) return 'DOUBLE';
  if (bedCount === 3) return 'TRIPLE';
  return 'OTHER';
}

/**
 * Gets the display name for room type
 * @param roomType - Room type enum value
 * @returns Human readable room type name
 */
export function getRoomTypeDisplayName(roomType: RoomType): string {
  const typeNames = {
    'SINGLE': 'Single Occupancy',
    'DOUBLE': 'Double Occupancy', 
    'TRIPLE': 'Triple Occupancy',
    'OTHER': 'Multi-Occupancy'
  };
  return typeNames[roomType] || 'Unknown';
}

/**
 * Gets the capacity based on room type
 * @param roomType - Room type enum value
 * @returns Maximum occupancy for the room type
 */
export function getRoomCapacity(roomType: RoomType): number {
  const capacities = {
    'SINGLE': 1,
    'DOUBLE': 2,
    'TRIPLE': 3,
    'OTHER': 4 // Default for multi-occupancy
  };
  return capacities[roomType] || 1;
}

/**
 * Validates if a room type matches the bed count
 * @param roomType - Current room type
 * @param bedCount - Number of beds
 * @returns Boolean indicating if the type matches the count
 */
export function isRoomTypeValidForBedCount(roomType: RoomType, bedCount: number): boolean {
  const expectedType = getRoomTypeByBedCount(bedCount);
  return roomType === expectedType;
}

/**
 * Suggests room type updates based on current bed count
 * @param currentType - Current room type
 * @param bedCount - Current number of beds
 * @returns Object with suggestion and whether update is needed
 */
export function suggestRoomTypeUpdate(currentType: RoomType, bedCount: number): {
  suggestedType: RoomType;
  needsUpdate: boolean;
  message: string;
} {
  const suggestedType = getRoomTypeByBedCount(bedCount);
  const needsUpdate = currentType !== suggestedType;
  
  return {
    suggestedType,
    needsUpdate,
    message: needsUpdate 
      ? `Room type should be "${getRoomTypeDisplayName(suggestedType)}" based on ${bedCount} bed(s)`
      : `Room type "${getRoomTypeDisplayName(currentType)}" matches ${bedCount} bed(s)`
  };
}
