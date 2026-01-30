import { z } from 'zod';

// Room number validation schema
export const roomNumberSchema = z.string()
  .min(1, 'Room number is required')
  .max(10, 'Room number must be less than 10 characters')
  .regex(/^[A-Za-z0-9\-]+$/, 'Room number can only contain letters, numbers, and hyphens')
  .transform(val => val.toUpperCase().trim());

// Bed number validation schema  
export const bedNumberSchema = z.string()
  .min(1, 'Bed number is required')
  .max(20, 'Bed number must be less than 20 characters')
  .regex(/^[A-Za-z0-9\-]+$/, 'Bed number can only contain letters, numbers, and hyphens')
  .transform(val => val.trim());

// Validation functions
export async function validateRoomNumber(pgId: string, roomNumber: string, excludeRoomId?: string) {
  try {
    const response = await fetch(`/api/validate/room-number?pgId=${pgId}&roomNumber=${encodeURIComponent(roomNumber)}${excludeRoomId ? `&excludeRoomId=${excludeRoomId}` : ''}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating room number:', error);
    return { valid: false, error: 'Validation failed' };
  }
}

export async function validateBedNumber(roomId: string, bedNumber: string, excludeBedId?: string) {
  try {
    const response = await fetch(`/api/validate/bed-number?roomId=${roomId}&bedNumber=${encodeURIComponent(bedNumber)}${excludeBedId ? `&excludeBedId=${excludeBedId}` : ''}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error validating bed number:', error);
    return { valid: false, error: 'Validation failed' };
  }
}

// Real-time validation hook return type
export interface ValidationResult {
  isValid: boolean;
  message: string;
  isLoading?: boolean;
}
