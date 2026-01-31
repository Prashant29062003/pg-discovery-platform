"use client";

import React, { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { 
  Edit, Trash2, AlertCircle, Eye, MapPin, Zap, 
  Search, Plus, BedDouble, Users, Filter, Home, DoorOpen 
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { cn } from "@/utils";
import { useAppStore } from "@/store/useAppStore";
import { ConfirmationDialog, useConfirmationDialog } from '@/components/ui/confirmation-dialog';

type PG = {
  id: string;
  name: string;
  slug?: string;
  city?: string;
  locality?: string;
  isFeatured?: boolean;
  isPublished?: boolean;
  thumbnailImage?: string;
  description?: string;
  gender?: string;
  availableBeds?: number;
  images?: string[];
};

export default function AdminPgsManager() {
  const [data, setData] = useState<PG[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'featured' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const { isOpen, openDialog, closeDialog, config } = useConfirmationDialog();

  // Zustand store
  const cachedPgs = useAppStore((state) => state.pgs);
  const pgsLastFetch = useAppStore((state) => state.pgsLastFetch);
  const setPgs = useAppStore((state) => state.setPgs);
  const isCachedDataValid = useAppStore((state) => state.isCachedDataValid);
  const getPgsFromCache = useAppStore((state) => state.getPgsFromCache);

  useEffect(() => {
    // Check if we have valid cached data first
    const cachedData = getPgsFromCache();
    if (cachedData && cachedData.length > 0) {
      console.log('[AdminPgsManager] Loading from cache - skipping API call');
      setData(cachedData);
      setLoading(false);
      return;
    }

    // Cache is invalid or empty, fetch from API
    console.log('[AdminPgsManager] Cache invalid, fetching from API...');
    fetchData();
  }, []); // Only run once on mount

  async function fetchData() {
    setLoading(true);
    setError(null);
    try {
      console.log('[AdminPgsManager] Fetching PGs from API...');
      const res = await fetch("/api/pgs");
      const json = await res.json();
      if (json?.success) {
        const pgsData = json.data || [];
        console.log(`[AdminPgsManager] Received ${pgsData.length} PGs from API`);
        
        // Use first image from images array for thumbnail (most recent upload)
        const enrichedData = pgsData.map((pg: any) => ({
          ...pg,
          // Priority: first actual image > thumbnailImage from DB > undefined
          thumbnailImage: (pg.images && pg.images[0] && pg.images[0] !== '') ? pg.images[0] : (pg.thumbnailImage || undefined),
        }));
        
        setData(enrichedData);
        setPgs(enrichedData); // Store in Zustand with timestamp
        console.log('[AdminPgsManager] Data cached in Zustand');
      } else {
        setError("Failed to load PGs");
        console.error('[AdminPgsManager] API returned success=false');
      }
    } catch (e) {
      setError("Error loading PGs");
      console.error('[AdminPgsManager] API error:', e);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    openDialog({
      title: 'Delete Property',
      description: `Are you sure you want to delete "${name}"? This action cannot be undone and will permanently remove this property along with all its rooms and beds.`,
      confirmText: 'Delete Property',
      cancelText: 'Cancel',
      variant: 'destructive',
      onConfirm: async () => {
        setIsDeleting(true);
        try {
          const res = await fetch(`/api/pgs/${id}`, { method: "DELETE" });
          const json = await res.json();
          if (json?.success) {
            setData((prev) => prev?.filter((p) => p.id !== id) ?? null);
          } else {
            throw new Error(json?.message || 'Failed to delete property');
          }
        } catch (e) {
          console.error('Error deleting PG:', e);
          // You could use a toast notification here if available
          alert("Failed to delete property: " + (e instanceof Error ? e.message : 'Unknown error'));
        } finally {
          setIsDeleting(false);
        }
      }
    });
  }

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((pg) => {
      if (filter === 'featured' && !pg.isFeatured) return false;
      if (filter === 'published' && !pg.isPublished) return false;
      if (filter === 'draft' && pg.isPublished) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return pg.name?.toLowerCase().includes(query) || pg.city?.toLowerCase().includes(query);
      }
      return true;
    });
  }, [data, filter, searchQuery]);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-lg font-semibold">Something went wrong</h3>
        <Button onClick={fetchData} variant="outline">Try Again</Button>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8 max-w-7xl mx-auto pb-10">
        
        {/* Consolidated Header - Removed Redundancy */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-zinc-200 dark:border-zinc-800 pb-6">
          <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Properties</h1>
              <p className="text-zinc-500 dark:text-zinc-400 mt-1">Manage your listings, track availability, and update details.</p>
          </div>
          <Link href="/admin/pgs/new">
              <Button size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700 text-white shadow-md transition-all">
                  <Plus className="w-5 h-5" /> Add Property
              </Button>
          </Link>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex p-1 bg-zinc-100 dark:bg-zinc-800/50 rounded-lg w-full md:w-auto">
            {['all', 'published', 'draft', 'featured'].map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab as any)}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-md transition-all capitalize flex-1 md:flex-none",
                  filter === tab 
                    ? "bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50 shadow-sm" 
                    : "text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200"
                )}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <Input 
              placeholder="Search properties..." 
              className="pl-10 h-10 bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Content Grid */}
        {loading ? (
          <PGLoadingSkeleton />
        ) : filteredData.length === 0 ? (
          <EmptyState filter={filter} hasSearch={!!searchQuery} resetFilters={() => { setFilter('all'); setSearchQuery(''); }} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredData.map((pg) => (
              <PGCard key={pg.id} pg={pg} onDelete={handleDelete} />
            ))}
          </div>
        )}
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
        isLoading={isDeleting}
      />
    </>
  );
}

// Structured Property Card
function PGCard({ pg, onDelete }: { pg: PG; onDelete: (id: string, name: string) => void }) {
  return (
    <Card className="group flex flex-col h-full w-full overflow-hidden border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all duration-300 bg-white dark:bg-zinc-950">
      
      {/* 1. Image Header with Overlay Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-zinc-100 dark:bg-zinc-900">
        {pg.thumbnailImage ? (
          <Image 
            src={pg.thumbnailImage} 
            alt={pg.name} 
            fill 
            className="object-cover transition-transform duration-700 group-hover:scale-105" 
            priority={false}
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-zinc-300"><Home className="w-10 h-10" /></div>
        )}
        
        <div className="absolute inset-x-0 top-0 p-3 flex justify-between items-start">
            <Badge className={cn("backdrop-blur-md border-0 font-medium px-2.5 py-1", pg.isPublished ? "bg-emerald-500/90 text-white" : "bg-zinc-600/90 text-white")}>
                {pg.isPublished ? 'Published' : 'Draft'}
            </Badge>

            {pg.isFeatured && (
               <div className="w-8 h-8 rounded-full bg-yellow-400 text-yellow-900 flex items-center justify-center shadow-lg"><Zap className="w-4 h-4 fill-current" /></div>
            )}
        </div>
      </div>

      {/* 2. Structured Body */}
      <div className="flex flex-col flex-1 p-4 sm:p-5 gap-3 sm:gap-4">
        <div>
            <h3 className="font-semibold text-base sm:text-lg leading-tight text-zinc-900 dark:text-zinc-50 line-clamp-1 group-hover:text-orange-600 transition-colors">{pg.name}</h3>
            <div className="flex items-center gap-1.5 text-zinc-500 text-xs sm:text-sm mt-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{pg.locality && `${pg.locality}, `}{pg.city || 'Location Pending'}</span>
            </div>
        </div>

        {/* Info Grid for scannability */}
        <div className="grid grid-cols-2 gap-2 sm:gap-3">
           <div className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
               <Users className="w-4 h-4 text-blue-500" />
               <div className="flex flex-col">
                   <span className="text-[10px] uppercase text-zinc-400 font-bold">Type</span>
                   <span className="text-xs font-medium capitalize">{pg.gender?.toLowerCase() || 'Unisex'}</span>
               </div>
           </div>
           
           <div className="flex items-center gap-2 px-2 sm:px-3 py-2 rounded-lg bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/50">
               <BedDouble className={cn("w-4 h-4", (pg.availableBeds || 0) > 0 ? "text-emerald-500" : "text-red-500")} />
               <div className="flex flex-col">
                   <span className="text-[10px] uppercase text-zinc-400 font-bold">Beds</span>
                   <span className="text-xs font-medium">{pg.availableBeds || 'Full'}</span>
               </div>
           </div>
        </div>
      </div>

      {/* 3. Action Footer */}
      <div className="p-3 bg-zinc-50/50 dark:bg-zinc-900/50 border-t border-zinc-100 dark:border-zinc-800 flex items-center gap-2">
            <Link href={`/admin/pgs/${pg.id}/preview`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full h-8 sm:h-9 text-xs gap-2 hover:text-orange-600 transition-colors">
                    <Eye className="w-3.5 h-3.5" /> Preview
                </Button>
            </Link>
            
            <Link href={`/admin/pgs/${pg.id}/rooms`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-zinc-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20" title="Manage Rooms">
                    <DoorOpen className="w-4 h-4" />
                </Button>
            </Link>

            <Link href={`/admin/pgs/${pg.id}/edit`}>
                <Button variant="ghost" size="icon" className="h-8 w-8 sm:h-9 sm:w-9 text-zinc-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20">
                    <Edit className="w-4 h-4" />
                </Button>
            </Link>

            <Button variant="ghost" size="icon" onClick={() => onDelete(pg.id, pg.name)} className="h-8 w-8 sm:h-9 sm:w-9 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                <Trash2 className="w-4 h-4" />
            </Button>
      </div>
    </Card>
  );
}

// Helper components remain largely the same but with padding/spacing tweaks for the new layout
function EmptyState({ filter, hasSearch, resetFilters }: { filter: string, hasSearch: boolean, resetFilters: () => void }) {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-zinc-50/50 dark:bg-zinc-900/20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl">
            <Filter className="w-10 h-10 text-zinc-300 mb-4" />
            <h3 className="text-xl font-semibold">{hasSearch ? 'No matches found' : 'No properties found'}</h3>
            <p className="text-zinc-500 text-sm mb-6">Try adjusting your filters or search terms.</p>
            <Button variant="outline" onClick={resetFilters}>Clear All Filters</Button>
        </div>
    );
}

function PGLoadingSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
                    <div className="aspect-video bg-zinc-100 dark:bg-zinc-900 animate-pulse" />
                    <div className="p-5 space-y-4">
                        <div className="h-6 w-3/4 bg-zinc-100 dark:bg-zinc-900 rounded animate-pulse" />
                        <div className="grid grid-cols-2 gap-3"><div className="h-10 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" /><div className="h-10 bg-zinc-100 dark:bg-zinc-900 rounded-lg animate-pulse" /></div>
                    </div>
                </div>
            ))}
        </div>
    );
}