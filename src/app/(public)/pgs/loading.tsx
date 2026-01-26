import { PGGridSkeleton } from "@/components/visitor/cards/PGCardSkeleton";

export default function Loading() {
  return (
    <div className="space-y-8 p-8">
      <div className="space-y-2">
        <div className="h-10 w-48 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-lg" />
        <div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-900 animate-pulse rounded-lg" />
      </div>
      <PGGridSkeleton count={6} />
    </div>
  );
}