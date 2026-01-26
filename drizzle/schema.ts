import { pgTable, foreignKey, text, boolean, index, varchar, timestamp, doublePrecision, unique, pgEnum } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"

export const enquiryStatus = pgEnum("enquiry_status", ['NEW', 'CONTACTED', 'CLOSED'])
export const gender = pgEnum("gender", ['MALE', 'FEMALE', 'UNISEX'])
export const roomType = pgEnum("room_type", ['SINGLE', 'DOUBLE', 'TRIPLE', 'OTHER'])


export const beds = pgTable("beds", {
	id: text().primaryKey().notNull(),
	roomId: text("room_id").notNull(),
	isOccupied: boolean("is_occupied").default(false).notNull(),
	bedNumber: text("bed_number"),
}, (table) => [
	foreignKey({
			columns: [table.roomId],
			foreignColumns: [rooms.id],
			name: "beds_room_id_rooms_id_fk"
		}).onDelete("cascade"),
]);

export const enquiries = pgTable("enquiries", {
	id: text().primaryKey().notNull(),
	pgId: text("pg_id").notNull(),
	name: text().notNull(),
	phone: varchar({ length: 15 }).notNull(),
	message: text(),
	occupation: text(),
	roomType: text("room_type"),
	moveInDate: timestamp("move_in_date", { mode: 'string' }),
	status: enquiryStatus().default('NEW').notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	index("spam_check_idx").using("btree", table.pgId.asc().nullsLast().op("text_ops"), table.phone.asc().nullsLast().op("text_ops"), table.createdAt.asc().nullsLast().op("text_ops")),
	foreignKey({
			columns: [table.pgId],
			foreignColumns: [pgs.id],
			name: "enquiries_pg_id_pgs_id_fk"
		}),
]);

export const rooms = pgTable("rooms", {
	id: text().primaryKey().notNull(),
	pgId: text("pg_id").notNull(),
	roomNumber: text("room_number").notNull(),
	type: roomType().default('SINGLE').notNull(),
	basePrice: doublePrecision("base_price").notNull(),
	deposit: doublePrecision(),
	noticePeriod: text("notice_period").default('1 Month'),
}, (table) => [
	foreignKey({
			columns: [table.pgId],
			foreignColumns: [pgs.id],
			name: "rooms_pg_id_pgs_id_fk"
		}).onDelete("cascade"),
]);

export const pgs = pgTable("pgs", {
	id: text().primaryKey().notNull(),
	slug: text().notNull(),
	name: text().notNull(),
	description: text().notNull(),
	images: text().array().default([""]).notNull(),
	thumbnailImage: text("thumbnail_image"),
	amenities: text().array().notNull(),
	isFeatured: boolean("is_featured").default(false).notNull(),
	address: text().notNull(),
	city: text().notNull(),
	locality: text().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow().notNull(),
	gender: gender().default('UNISEX').notNull(),
	managerName: text("manager_name"),
	phoneNumber: varchar("phone_number", { length: 15 }),
	lat: doublePrecision(),
	lng: doublePrecision(),
}, (table) => [
	index("city_idx").using("btree", table.city.asc().nullsLast().op("text_ops")),
	index("gender_idx").using("btree", table.gender.asc().nullsLast().op("enum_ops")),
	unique("pgs_slug_unique").on(table.slug),
]);
