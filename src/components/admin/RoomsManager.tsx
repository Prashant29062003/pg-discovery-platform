"use client";

import React, { useEffect, useState } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";

type Room = {
  id: string;
  roomNumber: string;
  type?: string;
  basePrice?: number;
};

export default function RoomsManager({ pgId }: { pgId: string }) {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchRooms();
  }, []);

  async function fetchRooms() {
    setLoading(true);
    try {
      const res = await fetch(`/api/pgs/${pgId}/rooms`);
      const json = await res.json();
      if (json?.success) setRooms(json.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    const roomNumber = prompt("Room number (e.g. 101)");
    if (!roomNumber) return;
    const type = prompt("Type (SINGLE/DOUBLE)") || "SINGLE";
    const basePrice = Number(prompt("Base price")) || 0;
    try {
      const res = await fetch(`/api/pgs/${pgId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumber, type, basePrice }),
      });
      const json = await res.json();
      if (json?.success) {
        setRooms((prev) => (prev ? [json.data, ...prev] : [json.data]));
      } else alert(json?.message || "Failed to add room");
    } catch (e) {
      console.error(e);
      alert("Failed to add room");
    }
  }

  async function handleDelete(row: Room) {
    if (!confirm(`Delete room ${row.roomNumber}?`)) return;
    try {
      const res = await fetch(`/api/pgs/${pgId}/rooms/${row.id}`, { method: "DELETE" });
      const json = await res.json();
      if (json?.success) setRooms((prev) => prev?.filter((r) => r.id !== row.id) ?? null);
      else alert(json?.message || "Failed to delete room");
    } catch (e) {
      console.error(e);
      alert("Failed to delete room");
    }
  }

  const columns = [
    { header: "Room #", accessor: "roomNumber" },
    { header: "Type", accessor: "type" },
    { header: "Base Price", accessor: "basePrice" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Rooms</h2>
        <div className="flex gap-2">
          <Button onClick={handleAdd}>Add Room</Button>
          <Button variant="ghost" onClick={fetchRooms}>Refresh</Button>
        </div>
      </div>

      <DataTable
        data={rooms || []}
        columns={columns as any}
        isLoading={loading}
        onDelete={handleDelete as any}
        emptyMessage="No rooms found"
      />
    </div>
  );
}
