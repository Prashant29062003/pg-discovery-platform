import * as React from "react"
import { cn } from "@/utils"

const EmptyState = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full min-h-[200px] w-full flex-col items-center justify-center rounded-lg border border-dashed border-zinc-200 bg-zinc-50 py-12 dark:border-zinc-800 dark:bg-zinc-900/50",
      className
    )}
    {...props}
  />
))
EmptyState.displayName = "EmptyState"

const EmptyStateIcon = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 dark:bg-zinc-800 dark:text-zinc-600",
      className
    )}
    {...props}
  />
))
EmptyStateIcon.displayName = "EmptyStateIcon"

const EmptyStateTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "mb-1 text-lg font-semibold text-zinc-900 dark:text-zinc-50",
      className
    )}
    {...props}
  />
))
EmptyStateTitle.displayName = "EmptyStateTitle"

const EmptyStateDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(
      "mb-6 text-sm text-zinc-600 dark:text-zinc-400",
      className
    )}
    {...props}
  />
))
EmptyStateDescription.displayName = "EmptyStateDescription"

const EmptyStateAction = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex gap-2", className)}
    {...props}
  />
))
EmptyStateAction.displayName = "EmptyStateAction"

export {
  EmptyState,
  EmptyStateIcon,
  EmptyStateTitle,
  EmptyStateDescription,
  EmptyStateAction,
}
