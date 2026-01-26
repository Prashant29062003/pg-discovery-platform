import { relations } from "drizzle-orm/relations";
import { rooms, beds, pgs, enquiries, guests, safetyAudits } from "./schema";

export const bedsRelations = relations(beds, ({one, many}) => ({
	room: one(rooms, {
		fields: [beds.roomId],
		references: [rooms.id]
	}),
	guests: many(guests),
}));

export const roomsRelations = relations(rooms, ({one, many}) => ({
	beds: many(beds),
	pg: one(pgs, {
		fields: [rooms.pgId],
		references: [pgs.id]
	}),
}));

export const enquiriesRelations = relations(enquiries, ({one}) => ({
	pg: one(pgs, {
		fields: [enquiries.pgId],
		references: [pgs.id]
	}),
}));

export const guestsRelations = relations(guests, ({one}) => ({
	bed: one(beds, {
		fields: [guests.bedId],
		references: [beds.id]
	}),
}));

export const safetyAuditsRelations = relations(safetyAudits, ({one}) => ({
	pg: one(pgs, {
		fields: [safetyAudits.pgId],
		references: [pgs.id]
	}),
}));

export const pgsRelations = relations(pgs, ({many}) => ({
	enquiries: many(enquiries),
	rooms: many(rooms),
	safetyAudits: many(safetyAudits),
}));