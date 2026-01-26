/**
 * Safety Audit Management Validation Schemas
 * Centralized schemas for safety audit CRUD operations
 */

import { z } from 'zod';

export const AUDIT_CATEGORIES = ['Fire Safety', 'Electrical', 'Structural', 'Health', 'Security'] as const;
export const AUDIT_STATUSES = ['compliant', 'warning', 'critical'] as const;

export type AuditCategory = typeof AUDIT_CATEGORIES[number];
export type AuditStatus = typeof AUDIT_STATUSES[number];

/**
 * Schema for creating a safety audit record
 * Validates all required and optional fields for audit creation
 */
export const createSafetyAuditSchema = z.object({
  pgId: z.string().min(1, 'Property ID is required'),
  category: z.enum(AUDIT_CATEGORIES, { message: 'Invalid audit category' }),
  item: z.string().min(2, 'Item description is required'),
  status: z.enum(AUDIT_STATUSES, { message: 'Invalid audit status' }),
  notes: z.string().optional().or(z.literal('')),
  inspectedBy: z.string().optional().or(z.literal('')),
});

export type CreateSafetyAuditInput = z.infer<typeof createSafetyAuditSchema>;

/**
 * Schema for updating audit status
 */
export const updateAuditStatusSchema = z.object({
  auditId: z.string().min(1, 'Audit ID is required'),
  pgId: z.string().min(1, 'Property ID is required'),
  status: z.enum(AUDIT_STATUSES),
  notes: z.string().optional().or(z.literal('')),
});

export type UpdateAuditStatusInput = z.infer<typeof updateAuditStatusSchema>;

/**
 * Schema for deleting an audit
 */
export const deleteSafetyAuditSchema = z.object({
  auditId: z.string().min(1, 'Audit ID is required'),
  pgId: z.string().min(1, 'Property ID is required'),
});

export type DeleteSafetyAuditInput = z.infer<typeof deleteSafetyAuditSchema>;
