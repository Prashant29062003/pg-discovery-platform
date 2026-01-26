import { z } from "zod";

export const EnquiryCreateSchema = z.object({
  // pgId can be null for general inquiries not tied to a specific property
  pgId: z.string().min(1).nullable().optional(),
  name: z.string().min(2, "Name is too short").max(100),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid phone"),
  email: z.string().email().optional(),
  occupation: z.string().min(1), 
  roomType: z.string().min(1),
  moveInDate: z.coerce.date(), 
  message: z.string().max(1000).optional(),
});

export type EnquiryCreateInput = z.infer<typeof EnquiryCreateSchema>;