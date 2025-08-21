import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props}
    />
  )
}

// Specialized skeleton components for common patterns
function HouseguestCardSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <div className="flex flex-col items-center space-y-3">
        <Skeleton className="h-20 w-20 rounded-full" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-3 w-full" />
        <div className="flex justify-between">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  )
}

function LeaderboardRowSkeleton() {
  return (
    <div className="flex items-center space-x-4 p-4 bg-white rounded-lg border">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-3 w-16" />
      </div>
      <div className="text-right space-y-2">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  )
}

function WeekPanelSkeleton() {
  return (
    <div className="bg-white rounded-lg border p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-24" />
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-28" />
          <div className="flex space-x-2">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-16" />
          </div>
        </div>
      </div>
    </div>
  )
}

export { Skeleton, HouseguestCardSkeleton, LeaderboardRowSkeleton, WeekPanelSkeleton }
