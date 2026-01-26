import { Skeleton } from "@/components/ui/skeleton";

export default function PGCardSkeleton() {
  return (
    <div className="rounded-[2.5rem] border border-zinc-200 dark:border-zinc-800 p-4 space-y-5 bg-white dark:bg-zinc-900/50">
      {/* Image Area */}
      <Skeleton className="h-[240px] w-full rounded-[2rem]" />
      
      {/* Content Area */}
      <div className="space-y-3 px-2">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-24" /> {/* Locality */}
          <Skeleton className="h-6 w-16 rounded-full" /> {/* Price Badge */}
        </div>
        <Skeleton className="h-8 w-3/4" /> {/* Title */}
        
        <div className="flex gap-2 pt-2">
          <Skeleton className="h-4 w-4 rounded-full" /> {/* Icon */}
          <Skeleton className="h-4 w-32" /> {/* Meta text */}
        </div>
      </div>
    </div>
  );
}

export function PGGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: count }).map((_, i) => (
        <PGCardSkeleton key={i} />
      ))}
    </div>
  );
}