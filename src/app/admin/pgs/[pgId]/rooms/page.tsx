'use client';

import React from 'react';
import { PropertyNavTabs } from "@/components/admin/PropertyNavTabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Plus, RefreshCw, DoorOpen, BedDouble, Users, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { RoomForm } from "@/components/admin/forms/RoomForm";
import BedManager from "@/components/admin/BedManager";
import { showToast } from "@/utils/toast";
import { useAppStore } from "@/store/useAppStore";
import { usePropertyData } from '@/hooks/usePropertyData';
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
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
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

          <div className="flex items-center justify-between gap-4">
            <Link href={`/admin/pgs/${pgId}/rooms/new`}>
              <Button 
                size="lg" 
                className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-md hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
                Add New Room
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg"
              className="gap-2"
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
          {Array.isArray(rooms) && rooms.map((room) => {
            return (
              <RoomListItem key={room.id} room={room} pgId={pgId} />
            );
          })}
        </div>
      )}

      {/* 3. OPTIONAL: QUICK STATS FOOTER (Theme Fixed) */}
      {!rooms || rooms.length > 0 && (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-zinc-100/50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800">
          <div className="p-2 rounded-lg bg-white dark:bg-zinc-800 shadow-sm">
            <DoorOpen className="w-5 h-5 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
              Total Rooms: {!rooms || rooms.length}
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