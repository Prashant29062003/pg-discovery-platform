/**
 * Room and Bed Management Validation Schemas
 * Centralized schemas for room and bed CRUD operations
 */

import { z } from 'zod';

export const ROOM_TYPES = ['SINGLE', 'DOUBLE', 'TRIPLE', 'OTHER'] as const;
export type RoomType = typeof ROOM_TYPES[number];

/**
 * Schema for creating a room in a PG
 */
export const createRoomSchema = z.object({
  pgId: z.string().min(1, 'PG ID is required'),
  roomNumber: z.string().min(1, 'Room number is required'),
  type: z.enum(ROOM_TYPES).default('SINGLE'),
  basePrice: z.number().positive('Base price must be positive'),
  deposit: z.number().positive().optional(),
  noticePeriod: z.string().default('1 Month'),
});

/**
 * Schema for updating a room
 */
export const updateRoomSchema = createRoomSchema.partial().extend({
  pgId: z.string().min(1).optional(),
});

export type CreateRoomInput = z.infer<typeof createRoomSchema>;
export type UpdateRoomInput = z.infer<typeof updateRoomSchema>;

/**
 * Schema for deleting a room
 */
export const deleteRoomSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  pgId: z.string().min(1, 'PG ID is required'),
});

export type DeleteRoomInput = z.infer<typeof deleteRoomSchema>;

/**
 * Schema for creating a bed in a room
 */
export const createBedSchema = z.object({
  roomId: z.string().min(1, 'Room ID is required'),
  bedNumber: z.string().min(1, 'Bed number is required'),
  isOccupied: z.boolean().default(false),
});

/**
 * Schema for updating a bed
 */
export const updateBedSchema = createBedSchema.partial().extend({
  roomId: z.string().min(1).optional(),
});

export type CreateBedInput = z.infer<typeof createBedSchema>;
export type UpdateBedInput = z.infer<typeof updateBedSchema>;

/**
 * Schema for deleting a bed
 */
export const deleteBedSchema = z.object({
  bedId: z.string().min(1, 'Bed ID is required'),
  roomId: z.string().min(1, 'Room ID is required'),
  pgId: z.string().min(1, 'PG ID is required'),
});

export type DeleteBedInput = z.infer<typeof deleteBedSchema>;
