'use client';

import React from 'react';
import { PropertyNavTabs } from "@/components/admin/PropertyNavTabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, RefreshCw, DoorOpen, BedDouble, Users, Edit, Trash2, Eye, Search, Filter, X } from "lucide-react";
import Link from "next/link";
import { showToast } from "@/utils/toast";
import { 
  EmptyState, EmptyStateIcon, EmptyStateTitle, 
  EmptyStateDescription, EmptyStateAction 
} from '@/components/ui/empty-state';
import { cn } from '@/utils';
import RoomListItem from '@/components/visitor/dashboard/RoomListItem';
import { AdminBreadcrumbs } from '@/components/admin/layout/AdminBreadcrumbs';

interface RoomsPageProps {
  params: Promise<{
    pgId: string;
  }>;
}

export default function RoomsPage({ params: paramsPromise }: RoomsPageProps) {
  const [pgId, setPgId] = React.useState<string>('');
  const [initialized, setInitialized] = React.useState(false);
  const [rooms, setRooms] = React.useState<any[]>([]);
  const [pg, setPg] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([]);
  const [selectedFloor, setSelectedFloor] = React.useState<string>('all');
  const [showFilters, setShowFilters] = React.useState(false);

  // Helper functions for floor filtering
  const getFloorFromRoomNumber = (roomNumber: string): number => {
    const match = roomNumber.match(/^(\d+)/);
    if (match) {
      const num = parseInt(match[1]);
      const floor = Math.floor(num / 100);
      console.log('🐛 DEBUG: Room', roomNumber, '→ Floor', floor, '(num:', num, 'num/100:', num / 100, 'Math.floor:', floor);
      return floor || 1; // Floor 1: 100-199, Floor 2: 200-299, etc.
    }
    console.log('🐛 DEBUG: No match for room number', roomNumber, '→ Default Floor 1');
    return 1; // Default to floor 1
  };

  const getFloorRange = (floor: number): string => {
    const start = floor * 100;
    const end = start + 99;
    return `${start}-${end}`;
  };

  const getAvailableFloors = (): string[] => {
    const floors = new Set<number>();
    rooms.forEach(room => {
      if (room.roomNumber) {
        floors.add(getFloorFromRoomNumber(room.roomNumber));
      }
    });
    return Array.from(floors).sort((a, b) => a - b).map(f => f.toString());
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedFloor('all');
    setSearchSuggestions([]);
  };

  const hasActiveFilters = searchQuery.trim() || selectedFloor !== 'all';

  // Direct fetch function bypassing cache
  const fetchRoomsDirect = async () => {
    if (!pgId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      showToast.info('Loading rooms...', 'Fetching latest room inventory');
      
      const response = await fetch(`/api/pgs/${pgId}/rooms`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Handle different response formats
      let roomsData = [];
      if (Array.isArray(data)) {
        roomsData = data;
      } else if (data && Array.isArray(data.rooms)) {
        roomsData = data.rooms;
      } else if (data && Array.isArray(data.data)) {
        roomsData = data.data;
      } else {
        console.warn('Unexpected data format:', data);
        roomsData = [];
        showToast.warning('Unexpected data format', 'Received non-standard response format. Showing empty rooms list.');
      }
      
      setRooms(roomsData);
      showToast.success('Rooms loaded successfully', `Found ${roomsData.length} room${roomsData.length !== 1 ? 's' : ''}`);
    } catch (err: any) {
      const errorMessage = `Failed to fetch rooms: ${err?.message || 'Unknown error'}`;
      setError(errorMessage);
      showToast.error('Failed to load rooms', 'Please check your connection and try again');
      console.error('❌ Room fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch PG data
  const fetchPgData = async () => {
    if (!pgId) return;
    
    try {
      const response = await fetch(`/api/pgs/${pgId}`);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to load property details`);
      }
      
      const data = await response.json();
      setPg(data);
      
      if (data?.name) {
        showToast.brand('Property loaded', `Now managing: ${data.name}`);
      }
    } catch (err: any) {
      const errorMessage = `Failed to fetch property data: ${err?.message || 'Unknown error'}`;
      showToast.error('Property not found', 'Unable to load property details. Please check the property ID.');
      console.error('❌ PG data fetch error:', err);
    }
  };

  React.useEffect(() => {
    (async () => {
      const resolvedParams = await paramsPromise;
      setPgId(resolvedParams.pgId);
      setInitialized(true);
    })();
  }, [paramsPromise]);

  React.useEffect(() => {
    if (initialized && pgId) {
      fetchPgData();
      fetchRoomsDirect();
    }
  }, [initialized, pgId]);

  if (!initialized || !pgId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-orange-600 rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin h-12 w-12 border-b-2 border-orange-600 rounded-full mx-auto mb-4"></div>
          <p className="text-zinc-600 dark:text-zinc-400">Loading rooms...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
        </div>
        <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">Error loading rooms</h3>
        <p className="text-zinc-600 dark:text-zinc-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-10 px-4 sm:px-6">
      
        {/* 1. HEADER SECTION (Theme Fixed) */}
      <div className="space-y-4">
        {/* Mobile Breadcrumbs - Only visible on mobile where navbar breadcrumbs are hidden */}
        <div className="md:hidden">
          <AdminBreadcrumbs />
        </div>
        
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          {/* Left Side - Title and Description */}
          <div className="space-y-1">
            <div className="flex items-center gap-3 mt-2">
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                {pg?.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 text-xs font-semibold border border-orange-200 dark:border-orange-800/50">
                Inventory
              </span>
            </div>
            <p className="text-zinc-500 dark:text-zinc-400">
              Manage room distribution, pricing, and specific bed configurations.
            </p>
          </div>

          {/* Right Side - Actions and Filters */}
          <div className="flex flex-col gap-4 lg:items-end">
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Link href={`/admin/pgs/${pgId}/rooms/new`}>
                <Button 
                  size="lg" 
                  className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all w-full sm:w-auto"
                >
                  <Plus className="w-5 h-5" />
                  Add New Room
                </Button>
              </Link>
              
              <Button 
                variant="outline" 
                size="lg"
                className="gap-2 w-full sm:w-auto"
                onClick={() => {
                  showToast.info('Refreshing rooms...', 'Updating room inventory with latest data');
                  fetchRoomsDirect();
                }}
                disabled={loading}
              >
                <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {/* Professional Filter Section */}
            <div className="bg-white dark:bg-zinc-800 rounded-xl border border-zinc-200 dark:border-zinc-700 p-4 shadow-sm">
              {/* Filter Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">Filters</span>
                </div>
                {hasActiveFilters && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="h-6 px-2 text-xs text-zinc-500 hover:text-zinc-700"
                  >
                    <X className="w-3 h-3 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              
              {/* Search Input */}
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground z-10" />
                <Input
                  type="text"
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    setSearchQuery(query);
                    
                    // Generate search suggestions
                    if (query.trim()) {
                      const suggestions = rooms
                        .filter(room => 
                          room.roomNumber?.toLowerCase().includes(query.toLowerCase()) ||
                          room.type?.toLowerCase().includes(query.toLowerCase()) ||
                          room.basePrice?.toString().includes(query) ||
                          (room._count?.beds && room._count.beds.toString().includes(query))
                        )
                        .map(room => room.roomNumber)
                        .slice(0, 5);
                      setSearchSuggestions(suggestions);
                    } else {
                      setSearchSuggestions([]);
                    }
                  }}
                  className="pl-10 h-9 w-full border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-sm"
                />
                {searchQuery && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-5 w-5 p-0 text-muted-foreground hover:text-foreground z-10"
                  >
                    ×
                  </Button>
                )}
                {searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-600 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto mt-1">
                    <div className="p-2">
                      <div className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1">Suggestions</div>
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setSearchQuery(suggestion);
                            setSearchSuggestions([]);
                          }}
                          className="w-full text-left px-2 py-1 hover:bg-zinc-100 dark:hover:bg-zinc-700 text-sm text-zinc-700 dark:text-zinc-300 rounded"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              {/* Floor Filter */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-zinc-600 dark:text-zinc-400">Floor</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => setSelectedFloor('all')}
                    className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                      selectedFloor === 'all'
                        ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                        : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                    }`}
                  >
                    All Floors
                  </button>
                  {getAvailableFloors().map((floor) => (
                    <button
                      key={floor}
                      onClick={() => setSelectedFloor(floor)}
                      className={`px-3 py-2 text-xs font-medium rounded-lg border transition-colors ${
                        selectedFloor === floor
                          ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 dark:border-orange-700 text-orange-700 dark:text-orange-300'
                          : 'bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-700'
                      }`}
                    >
                      Floor {floor}
                      <span className="block text-xs opacity-75 mt-0.5">
                        {getFloorRange(parseInt(floor))}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 1.5. PROPERTY NAV TABS */}
      <PropertyNavTabs pgId={pgId} pgName={pg?.name || 'Property'} />

      {/* 2. CONTENT AREA (Theme Fixed) */}
      {!rooms || rooms.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 bg-zinc-50/50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl animate-in fade-in zoom-in-95 duration-500">
          <EmptyState>
            <div className="bg-white dark:bg-zinc-800 p-4 rounded-full shadow-sm mb-4 ring-1 ring-zinc-900/5">
              <DoorOpen className="h-8 w-8 text-zinc-400" />
            </div>
            <EmptyStateTitle className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
              No rooms found
            </EmptyStateTitle>
            <EmptyStateDescription className="text-zinc-500 dark:text-zinc-400 max-w-sm mx-auto mb-6">
              You haven't added any rooms to this property yet. Add your first room to manage beds and occupancy.
            </EmptyStateDescription>
            <EmptyStateAction>
              <Link href={`/admin/pgs/${pgId}/rooms/new`}>
                <Button className="gap-2 bg-zinc-900 dark:bg-zinc-50 text-white dark:text-zinc-900 hover:opacity-90 transition-opacity">
                  <Plus className="w-4 h-4" /> Create First Room
                </Button>
              </Link>
            </EmptyStateAction>
          </EmptyState>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(rooms) && rooms
            // Sort rooms by room number first
            .sort((a, b) => {
              const roomA = a.roomNumber || '';
              const roomB = b.roomNumber || '';
              
              // Extract all numbers from room numbers for better sorting
              const numsA = roomA.match(/\d+/g) || [];
              const numsB = roomB.match(/\d+/g) || [];
              
              // Compare first number (floor), then second number (room)
              for (let i = 0; i < Math.max(numsA.length, numsB.length); i++) {
                const numA = parseInt(numsA[i] || '0');
                const numB = parseInt(numsB[i] || '0');
                if (numA !== numB) {
                  return numA - numB;
                }
              }
              
              // If all numbers are equal, compare as strings
              return roomA.localeCompare(roomB);
            })
            .filter(room => {
              // Filter by search query
              if (searchQuery.trim()) {
                const query = searchQuery.toLowerCase().trim();
                const matchesSearch = (
                  room.roomNumber?.toLowerCase().includes(query) ||
                  room.type?.toLowerCase().includes(query) ||
                  room.basePrice?.toString().includes(query) ||
                  (room._count?.beds && room._count.beds.toString().includes(query))
                );
                if (!matchesSearch) return false;
              }
              
              // Filter by floor
              if (selectedFloor !== 'all' && room.roomNumber) {
                const roomFloor = getFloorFromRoomNumber(room.roomNumber).toString();
                console.log('🐛 DEBUG: Filtering room', room.roomNumber, '→ Floor', roomFloor, 'vs Selected', selectedFloor, 'Match:', roomFloor === selectedFloor);
                if (roomFloor !== selectedFloor) return false;
              }
              
              return true;
            })
            .map((room) => {
              return (
                <RoomListItem key={room.id} room={room} pgId={pgId} />
              );
            })}
        </div>
      )}

      {/* 3. OPTIONAL: QUICK STATS FOOTER (Theme Fixed) */}
      {rooms && rooms.length > 0 && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
            <DoorOpen className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Total Rooms: {rooms.length}
            </p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Navigate to individual rooms to manage bed availability.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}