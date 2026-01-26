import { relations } from "drizzle-orm/relations";
import { rooms, beds, pgs, enquiries } from "./schema";

export const bedsRelations = relations(beds, ({one}) => ({
	room: one(rooms, {
		fields: [beds.roomId],
		references: [rooms.id]
	}),
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

export const pgsRelations = relations(pgs, ({many}) => ({
	enquiries: many(enquiries),
	rooms: many(rooms),
}));