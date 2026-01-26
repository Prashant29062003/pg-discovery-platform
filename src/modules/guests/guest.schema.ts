/**
 * Guest Management Validation Schemas
 * Centralized schemas for guest CRUD operations
 */

import { z } from 'zod';

export const GUEST_STATUSES = ['active', 'checked-out', 'upcoming'] as const;
export type GuestStatus = typeof GUEST_STATUSES[number];

/**
 * Schema for creating a guest record
 * Validates all required and optional fields for guest creation
 */
export const createGuestSchema = z.object({
  pgId: z.string().min(1, 'Property ID is required'),
  roomId: z.string().min(1, 'Room ID is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Invalid phone number').optional().or(z.literal('')),
  checkInDate: z.string().min(1, 'Check-in date is required'),
  checkOutDate: z.string().optional().or(z.literal('')),
  status: z.enum(GUEST_STATUSES).default('active'),
  numberOfOccupants: z.number().int().min(1, 'At least 1 occupant required').default(1),
  notes: z.string().optional().or(z.literal('')),
});

export type CreateGuestInput = z.infer<typeof createGuestSchema>;

/**
 * Schema for updating guest status
 */
export const updateGuestStatusSchema = z.object({
  guestId: z.string().min(1, 'Guest ID is required'),
  pgId: z.string().min(1, 'Property ID is required'),
  status: z.enum(GUEST_STATUSES),
});

export type UpdateGuestStatusInput = z.infer<typeof updateGuestStatusSchema>;

/**
 * Schema for deleting a guest
 */
export const deleteGuestSchema = z.object({
  guestId: z.string().min(1, 'Guest ID is required'),
  pgId: z.string().min(1, 'Property ID is required'),
});

export type DeleteGuestInput = z.infer<typeof deleteGuestSchema>;
