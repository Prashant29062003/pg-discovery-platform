"use client";

import React, { useEffect, useState, useMemo } from "react";
import { DataTable } from "@/components/ui/data-table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Edit2, Bed, Home, Search } from "lucide-react";
import { showToast } from "@/utils/toast";
import { ConfirmationDialog, useConfirmationDialog } from "@/components/ui/confirmation-dialog";

type Room = {
  id: string;
  roomNumber: string;
  type?: string;
  basePrice?: number;
  _count?: {
    beds: number;
  };
};

export default function RoomsManager({ pgId }: { pgId: string }) {
  const [rooms, setRooms] = useState<Room[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { isOpen, openDialog, closeDialog, config } = useConfirmationDialog();

  // Filter rooms based on search query
  const filteredRooms = useMemo(() => {
    if (!rooms) return [];
    if (!searchQuery.trim()) return rooms;

    const query = searchQuery.toLowerCase().trim();
    const filtered = rooms.filter(room => 
      room.roomNumber.toLowerCase().includes(query) ||
      (room.type && room.type.toLowerCase().includes(query)) ||
      (room.basePrice && room.basePrice.toString().includes(query)) ||
      (room._count?.beds && room._count.beds.toString().includes(query))
    );
    console.log('Filtered rooms:', filtered.length, 'from', rooms.length, 'with query:', query);
    return filtered;
  }, [rooms, searchQuery]);

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
      showToast.error('Failed to load rooms', 'Please try again');
    } finally {
      setLoading(false);
    }
  }

  async function handleAdd() {
    const roomNumber = prompt("Room number (e.g. 101)");
    if (!roomNumber) return;
    const type = prompt("Type (SINGLE/DOUBLE)") || "SINGLE";
    const basePrice = Number(prompt("Base price")) || 0;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/pgs/${pgId}/rooms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomNumber, type, basePrice }),
      });
      const json = await res.json();
      if (json?.success) {
        setRooms((prev) => (prev ? [json.data, ...prev] : [json.data]));
        showToast.success('Room added successfully', `Room ${roomNumber} has been created`);
      } else {
        showToast.error('Failed to add room', json?.message || 'Please try again');
      }
    } catch (e) {
      console.error(e);
      showToast.error('Failed to add room', 'Please try again');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(row: Room) {
    openDialog({
      title: 'Delete Room',
      description: `Are you sure you want to delete room "${row.roomNumber}"? This action cannot be undone and will permanently remove this room and all its beds.`,
      confirmText: 'Delete Room',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: async () => {
        setLoading(true);
        try {
          const res = await fetch(`/api/pgs/${pgId}/rooms/${row.id}`, { method: "DELETE" });
          const json = await res.json();
          if (json?.success) {
            setRooms((prev) => prev?.filter((r) => r.id !== row.id) ?? null);
            showToast.success('Room deleted successfully', `Room ${row.roomNumber} has been removed`);
            // Auto-close dialog after success
            setTimeout(() => {
              closeDialog();
            }, 500);
          } else {
            showToast.error('Failed to delete room', json?.message || 'Please try again');
          }
        } catch (e) {
          console.error(e);
          showToast.error('Failed to delete room', 'Please try again');
        } finally {
          setLoading(false);
        }
      }
    });
  }

  const getRoomTypeColor = (type?: string) => {
    const colors: Record<string, string> = {
      SINGLE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
      DOUBLE: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
      TRIPLE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
      OTHER: 'bg-zinc-100 text-zinc-800 dark:bg-zinc-900/30 dark:text-zinc-300'
    };
    return colors[type || 'OTHER'] || colors.OTHER;
  };

  const columns = [
    { 
      header: "Room #", 
      accessor: "roomNumber",
      cell: (row: Room) => (
        <div className="flex items-center gap-2">
          <Home className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{row.roomNumber}</span>
        </div>
      )
    },
    { 
      header: "Type", 
      accessor: "type",
      cell: (row: Room) => (
        <Badge variant="outline" className={getRoomTypeColor(row.type)}>
          {row.type || 'SINGLE'}
        </Badge>
      )
    },
    { 
      header: "Beds", 
      accessor: "_count.beds",
      cell: (row: Room) => (
        <div className="flex items-center gap-1">
          <Bed className="w-3 h-3 text-muted-foreground" />
          <span>{row._count?.beds || 0}</span>
        </div>
      )
    },
    { 
      header: "Base Price", 
      accessor: "basePrice",
      cell: (row: Room) => (
        <span className="font-medium">₹{row.basePrice || 0}</span>
      )
    },
    {
      header: "Actions",
      accessor: "id",
      cell: (row: Room) => (
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.location.href = `/admin/pgs/${pgId}/rooms/${row.id}`}
            className="h-8 w-8 p-0"
            title="Manage beds"
          >
            <Bed className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row)}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            disabled={loading}
            title="Delete room"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      )
    },
  ];

  return (
    <>
      <div className="space-y-4">
        <Card className="p-4 sm:p-6">
          {/* Header with Search */}
          <div className="flex flex-col gap-4 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Home className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Rooms Management</h2>
                {rooms && (
                  <Badge variant="outline" className="text-xs sm:text-sm">
                    {rooms.length} room{rooms.length !== 1 ? 's' : ''}
                    {searchQuery && ` (${filteredRooms.length} found)`}
                  </Badge>
                )}
              </div>
              <div className="flex gap-2">
                <Button 
                  onClick={handleAdd}
                  disabled={loading}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Plus className="w-4 h-4" />
                  {loading ? 'Adding...' : 'Add Room'}
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={fetchRooms}
                  disabled={loading}
                  className="gap-2 w-full sm:w-auto"
                >
                  <Edit2 className="w-4 h-4" />
                  Refresh
                </Button>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
              <Input
                type="text"
                placeholder="Search rooms by number, type, price, or bed count..."
                value={searchQuery}
                onChange={(e) => {
                  console.log('Search query:', e.target.value);
                  setSearchQuery(e.target.value);
                }}
                className="pl-10 h-10 w-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 p-0 text-muted-foreground hover:text-foreground z-10"
                >
                  ×
                </Button>
              )}
            </div>
          </div>

          {/* Mobile-friendly rooms list */}
          <div className="block lg:hidden">
            {filteredRooms && filteredRooms.length > 0 ? (
              <div className="space-y-3">
                {filteredRooms.map((room) => (
                  <div key={room.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Home className="w-4 h-4 text-muted-foreground" />
                        <span className="font-semibold text-lg">{room.roomNumber}</span>
                      </div>
                      <Badge variant="outline" className={getRoomTypeColor(room.type)}>
                        {room.type || 'SINGLE'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Bed className="w-3 h-3 text-muted-foreground" />
                        <span className="text-muted-foreground">Beds:</span>
                        <span className="font-medium">{room._count?.beds || 0}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">₹{room.basePrice || 0}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 pt-2 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.location.href = `/admin/pgs/${pgId}/rooms/${room.id}`}
                        className="flex-1 gap-2"
                      >
                        <Bed className="w-3 h-3" />
                        Manage Beds
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(room)}
                        className="flex-1 gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        disabled={loading}
                      >
                        <Trash2 className="w-3 h-3" />
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Home className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">
                  {searchQuery ? 'No rooms match your search' : 'No rooms found'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {searchQuery 
                    ? 'Try adjusting your search terms'
                    : 'Click "Add Room" to create your first room'
                  }
                </p>
              </div>
            )}
          </div>

          {/* Desktop table view */}
          <div className="hidden lg:block">
            <DataTable
              data={filteredRooms || []}
              columns={columns as any}
              isLoading={loading}
              onDelete={handleDelete as any}
              emptyMessage={searchQuery ? 'No rooms match your search' : 'No rooms found'}
            />
          </div>
        </Card>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isOpen}
        onClose={closeDialog}
        onConfirm={config.onConfirm}
        title={config.title}
        description={config.description}
        confirmText={config.confirmText}
        cancelText={config.cancelText}
        variant={config.variant}
        isLoading={loading}
      />
    </>
  );
}
