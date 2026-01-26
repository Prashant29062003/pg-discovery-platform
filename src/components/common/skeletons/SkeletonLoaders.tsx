'use client';

/**
 * Reusable Skeleton Components with Tailwind Shimmer Effect
 * Used for loading states to prevent layout shift
 */

// Base shimmer animation
const shimmerCSS = `
  @keyframes shimmer {
    0% {
      background-position: -1000px 0;
    }
    100% {
      background-position: 1000px 0;
    }
  }

  .animate-shimmer {
    animation: shimmer 2s infinite;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.2) 20%,
      rgba(255, 255, 255, 0.5) 60%,
      rgba(255, 255, 255, 0)
    );
    background-size: 1000px 100%;
    background-color: #f3f4f6;
  }
`;

/**
 * PG Card Skeleton - Matches exact dimensions of PGCard
 * Height: 300px (to prevent shift when card loads)
 */
export function PGCardSkeleton() {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      {/* Image skeleton */}
      <div className="w-full h-48 bg-gray-200 animate-shimmer" />
      
      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-200 rounded animate-shimmer w-3/4" />
        
        {/* Description skeleton (2 lines) */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-full" />
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-5/6" />
        </div>
        
        {/* Footer skeleton (city + amenities count) */}
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/3" />
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/4" />
        </div>
      </div>
    </div>
  );
}

/**
 * PG Grid Skeleton - Multiple cards
 */
export function PGGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <PGCardSkeleton key={i} />
      ))}
    </div>
  );
}

/**
 * PG Details Page Skeleton
 * Full-width detail view with image, title, description
 */
export function PGDetailSkeleton() {
  return (
    <div className="space-y-6">
      {/* Hero image skeleton */}
      <div className="w-full h-96 bg-gray-200 rounded-lg animate-shimmer" />
      
      {/* Title skeleton */}
      <div>
        <div className="h-8 bg-gray-200 rounded animate-shimmer w-1/2 mb-2" />
        <div className="h-6 bg-gray-200 rounded animate-shimmer w-1/3" />
      </div>
      
      {/* Description skeleton (5 lines) */}
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-4 bg-gray-200 rounded animate-shimmer ${i === 4 ? 'w-3/4' : 'w-full'}`}
          />
        ))}
      </div>
      
      {/* Details grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-2/3" />
            <div className="h-6 bg-gray-200 rounded animate-shimmer w-full" />
          </div>
        ))}
      </div>
      
      {/* Amenities skeleton */}
      <div>
        <div className="h-6 bg-gray-200 rounded animate-shimmer w-1/4 mb-3" />
        <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-gray-200 rounded animate-shimmer"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/**
 * Room List Skeleton
 */
export function RoomListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-4 flex justify-between items-center"
        >
          {/* Room info skeleton */}
          <div className="flex-1 space-y-2">
            <div className="h-5 bg-gray-200 rounded animate-shimmer w-1/3" />
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/2" />
          </div>
          
          {/* Action buttons skeleton */}
          <div className="flex gap-2">
            <div className="h-10 w-20 bg-gray-200 rounded animate-shimmer" />
            <div className="h-10 w-20 bg-gray-200 rounded animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Bed List Skeleton
 */
export function BedListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="bg-white rounded-lg p-3 flex justify-between items-center"
        >
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/4" />
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/4" />
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/4" />
        </div>
      ))}
    </div>
  );
}

/**
 * Admin Dashboard Skeleton
 * Shows cards for PGs, Rooms, Beds, Enquiries
 */
export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 space-y-2 shadow-sm"
          >
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/2" />
            <div className="h-8 bg-gray-200 rounded animate-shimmer w-full" />
          </div>
        ))}
      </div>
      
      {/* Main content skeleton */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-shimmer w-1/4 mb-4" />
        <RoomListSkeleton count={5} />
      </div>
    </div>
  );
}

/**
 * Table Row Skeleton - for admin tables
 */
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-6 py-4 whitespace-nowrap">
          <div className="h-4 bg-gray-200 rounded animate-shimmer w-full" />
        </td>
      ))}
    </tr>
  );
}

/**
 * Inject shimmer CSS into document
 * Call this once in your root layout
 */
export function ShimmerStyles() {
  return (
    <style>{shimmerCSS}</style>
  );
}
