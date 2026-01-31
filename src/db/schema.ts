import { pgTable, text, varchar, boolean, timestamp, doublePrecision, pgEnum, index, integer, jsonb } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema, createSelectSchema } from "drizzle-zod"; // Add this
import { z } from "zod"; // Add this

// 1. Enums
export const roomTypeEnum = pgEnum('room_type', ['SINGLE', 'DOUBLE', 'TRIPLE', 'OTHER']);
export const enquiryStatusEnum = pgEnum('enquiry_status', ['NEW', 'CONTACTED', 'CLOSED']);
export const genderEnum = pgEnum('gender', ['MALE', 'FEMALE', 'UNISEX']);

// 2. PG Table
export const pgs = pgTable("pgs", {
  id: text("id").primaryKey(), 
  slug: text("slug").unique().notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  fullAddress: text("full_address"),
  images: text("images").array().notNull().default([]),
  imageNames: text("image_names").array().default([]).notNull(), // New: Image labels/descriptions (auto-generated if not provided)
  thumbnailImage: text("thumbnail_image"),
  amenities: text("amenities").array().default([]).notNull(), // Keep as text[] for compatibility
  rulesAndRegulations: text("rules_and_regulations"),
  checkInTime: varchar("check_in_time", { length: 5 }), // "14:00"
  checkOutTime: varchar("check_out_time", { length: 5 }), // "11:00"
  cancellationPolicy: text("cancellation_policy"),
  isFeatured: boolean("is_featured").default(false).notNull(),
  isPublished: boolean("is_published").default(false).notNull(), // Draft mode
  gender: genderEnum("gender").default('UNISEX').notNull(),
  managerName: text("manager_name").notNull(),
  phoneNumber: varchar("phone_number", { length: 15 }),
  whatsappNumber: varchar("whatsapp_number", { length: 15 }),
  email: varchar("email", { length: 255 }),
  website: varchar("website", { length: 500 }),
  facebook: varchar("facebook", { length: 500 }),
  instagram: varchar("instagram", { length: 500 }),
  address: text("address").notNull(),
  city: text("city").notNull(),
  locality: text("locality").notNull(),
  lat: doublePrecision("lat"),
  lng: doublePrecision("lng"),
  availableBeds: integer("available_beds").default(0),
  minStayDays: integer("min_stay_days").default(1),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  cityIdx: index("city_idx").on(table.city),
  genderIdx: index("gender_idx").on(table.gender),
  publishedIdx: index("published_idx").on(table.isPublished),
}));

// 3. Room Table
export const rooms = pgTable("rooms", {
  id: text("id").primaryKey(),
  pgId: text("pg_id").references(() => pgs.id, { onDelete: 'cascade' }).notNull(),
  roomNumber: text("room_number").notNull(),
  type: roomTypeEnum("type").default('SINGLE').notNull(),
  basePrice: doublePrecision("base_price").notNull(),
  deposit: doublePrecision("deposit"),
  noticePeriod: text("notice_period").default('1 Month'),
  roomImages: text("room_images").array().default([]),
  amenities: text("amenities").array().default([]), // AC, WiFi, Bathroom, etc
  capacity: integer("capacity").default(1),
  isAvailable: boolean("is_available").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pgIdIdx: index("rooms_pg_id_idx").on(table.pgId),
  availableIdx: index("rooms_available_idx").on(table.isAvailable),
}));

// 4. Bed Table
export const beds = pgTable("beds", {
  id: text("id").primaryKey(),
  roomId: text("room_id").references(() => rooms.id, { onDelete: 'cascade' }).notNull(),
  isOccupied: boolean("is_occupied").default(false).notNull(),
  bedNumber: text("bed_number"), 
}, (table) => ({
  roomIdIdx: index("beds_room_id_idx").on(table.roomId),
  occupiedIdx: index("beds_occupied_idx").on(table.isOccupied),
}));

// 5. Enquiry Table
export const enquiries = pgTable("enquiries", {
  id: text("id").primaryKey(),
  pgId: text("pg_id").references(() => pgs.id), // Made nullable for general inquiries
  name: text("name").notNull(),
  phone: varchar("phone", { length: 15 }).notNull(),
  message: text("message"),
  occupation: text("occupation"),
  roomType: text("room_type"), 
  moveInDate: timestamp("move_in_date"),
  status: enquiryStatusEnum("status").default('NEW').notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  spamCheckIdx: index("spam_check_idx").on(table.pgId, table.phone, table.createdAt),
}));

// 6. Safety Audits Table
export const safetyAudits = pgTable("safety_audits", {
  id: text("id").primaryKey(),
  pgId: text("pg_id").references(() => pgs.id, { onDelete: 'cascade' }).notNull(),
  category: text("category").notNull(), // e.g., "Electrical", "Fire Safety", "Structural"
  item: text("item").notNull(), // e.g., "Fire extinguisher installed"
  status: text("status").notNull(), // 'compliant', 'warning', 'critical'
  notes: text("notes"),
  lastChecked: timestamp("last_checked").defaultNow().notNull(),
  inspectedBy: text("inspected_by"), // Inspector name/ID
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pgIdIdx: index("safety_audits_pg_id_idx").on(table.pgId),
  statusIdx: index("safety_audits_status_idx").on(table.status),
}));

// 7. Guests Table
export const guests = pgTable("guests", {
  id: text("id").primaryKey(),
  pgId: text("pg_id").references(() => pgs.id, { onDelete: 'cascade' }).notNull(),
  roomId: text("room_id").references(() => rooms.id, { onDelete: 'cascade' }).notNull(),
  name: text("name").notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 15 }),
  checkInDate: timestamp("check_in_date").notNull(),
  checkOutDate: timestamp("check_out_date"),
  status: text("status").default('active').notNull(), // 'active', 'checked-out', 'upcoming'
  numberOfOccupants: integer("number_of_occupants").default(1),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  pgIdIdx: index("guests_pg_id_idx").on(table.pgId),
  roomIdIdx: index("guests_room_id_idx").on(table.roomId),
  statusIdx: index("guests_status_idx").on(table.status),
  checkInIdx: index("guests_check_in_idx").on(table.checkInDate),
}));

// 8. Define Relations
export const pgsRelations = relations(pgs, ({ many }) => ({
  rooms: many(rooms),
  enquiries: many(enquiries),
  safetyAudits: many(safetyAudits),
  guests: many(guests),
}));

export const roomsRelations = relations(rooms, ({ one, many }) => ({
  pg: one(pgs, { fields: [rooms.pgId], references: [pgs.id] }),
  beds: many(beds),
}));

export const bedsRelations = relations(beds, ({ one }) => ({
  room: one(rooms, { fields: [beds.roomId], references: [rooms.id] }),
}));

export const safetyAuditsRelations = relations(safetyAudits, ({ one }) => ({
  pg: one(pgs, { fields: [safetyAudits.pgId], references: [pgs.id] }),
}));

export const guestsRelations = relations(guests, ({ one }) => ({
  pg: one(pgs, { fields: [guests.pgId], references: [pgs.id] }),
  room: one(rooms, { fields: [guests.roomId], references: [rooms.id] }),
}));

// --- 7. ZOD SCHEMAS ---

/**
 * Validates the data BEFORE inserting into the database.
 * We use .extend or overrides to add custom validation like phone regex.
 */
export const insertEnquirySchema = createInsertSchema(enquiries, {
  // Use z.coerce to ensure strings from JSON are converted to Date objects
  moveInDate: z.coerce.date(),
  // Validate Indian phone numbers
  phone: z.string().regex(/^[6-9]\d{9}$/, "Invalid Indian phone number"),
  // If roomType is a string in DB but you want to restrict it to specific values:
  roomType: z.string().min(1, "Room type is required"),
  // Make occupation required
  occupation: z.string().min(1, "Occupation is required"),
  // pgId is now nullable for general inquiries
  pgId: z.string().nullable().optional(),
  // Convert null message to undefined
  message: z.string().nullable().transform(v => v ?? undefined).optional(),
}).extend({
  // Ensure ID is generated if not provided (though Drizzle usually handles this)
  id: z.string().optional(),
});

// 6. PG Drafts Table
export const pgDrafts = pgTable("pg_drafts", {
  id: text("id").primaryKey(),
  pgId: text("pg_id").references(() => pgs.id, { onDelete: 'cascade' }),
  userId: text("user_id").notNull(),
  title: text("title").notNull(),
  data: jsonb("data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  userIdIdx: index("user_id_idx").on(table.userId),
  pgIdIdx: index("pg_id_idx").on(table.pgId),
}));

// Schema for reading data (useful for API responses)
export const selectEnquirySchema = createSelectSchema(enquiries);

// Schemas for other tables
export const insertPgSchema = createInsertSchema(pgs);
export const selectPgSchema = createSelectSchema(pgs);

// Extended PG schema for form with better validation
export const pgFormSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3, 'PG name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  fullAddress: z.string().min(5, 'Full address is required'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  locality: z.string().min(2, 'Locality is required'),
  managerName: z.string().min(2, 'Manager name is required'),
  phoneNumber: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian phone number'),
  gender: z.enum(['MALE', 'FEMALE', 'UNISEX'], { message: 'Select a gender category' }),
  checkInTime: z.string().optional(),
  checkOutTime: z.string().optional(),
  rulesAndRegulations: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  amenities: z.array(z.string()).default([]).optional(),
  minStayDays: z.number().min(1, 'Minimum stay must be at least 1 day').default(1),
  isPublished: z.boolean().default(false),
});

export type PGFormData = z.infer<typeof pgFormSchema>;