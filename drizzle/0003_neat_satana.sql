CREATE INDEX "beds_room_id_idx" ON "beds" USING btree ("room_id");--> statement-breakpoint
CREATE INDEX "beds_occupied_idx" ON "beds" USING btree ("is_occupied");--> statement-breakpoint
CREATE INDEX "rooms_pg_id_idx" ON "rooms" USING btree ("pg_id");--> statement-breakpoint
CREATE INDEX "rooms_available_idx" ON "rooms" USING btree ("is_available");