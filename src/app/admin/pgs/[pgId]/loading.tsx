/**
 * Loading skeleton for admin PG details page
 * Shows skeleton while details load
 */

export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-shimmer w-1/2" />
        <div className="h-4 bg-gray-200 rounded animate-shimmer w-1/3" />
      </div>

      {/* Details grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-lg p-4 space-y-2 shadow-sm"
          >
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-2/3" />
            <div className="h-6 bg-gray-200 rounded animate-shimmer w-full" />
          </div>
        ))}
      </div>

      {/* Content section skeleton */}
      <div className="bg-white rounded-lg p-6 space-y-4">
        <div className="h-6 bg-gray-200 rounded animate-shimmer w-1/4 mb-4" />
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-4 bg-gray-200 rounded animate-shimmer ${i === 4 ? 'w-3/4' : 'w-full'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
