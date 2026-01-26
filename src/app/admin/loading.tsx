/**
 * Loading skeleton for /admin dashboard
 * Shows skeleton cards while admin data loads
 */

export default function Loading() {
  return (
    <div className="space-y-6 p-6">
      {/* Page header skeleton */}
      <div>
        <div className="h-10 bg-gray-200 rounded animate-shimmer w-1/4 mb-2" />
        <div className="h-5 bg-gray-200 rounded animate-shimmer w-1/3" />
      </div>

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

      {/* Main content table skeleton */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 space-y-3">
          <div className="h-6 bg-gray-200 rounded animate-shimmer w-1/4 mb-4" />
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex justify-between items-center py-3 border-b border-gray-100"
            >
              <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/3" />
              <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/4" />
              <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/4" />
              <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
