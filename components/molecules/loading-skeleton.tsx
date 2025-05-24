import { Skeleton } from "@/components/ui/skeleton"

export function HabitCardSkeleton() {
  return (
    <div className="p-4 border rounded-lg bg-card">
      <Skeleton className="h-5 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-4" />
      <div className="flex justify-between">
        <Skeleton className="h-8 w-8 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full" />
      </div>
    </div>
  )
}

export function HabitColumnSkeleton() {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className="h-8 w-32 mb-2" />
      <HabitCardSkeleton />
      <HabitCardSkeleton />
      <HabitCardSkeleton />
    </div>
  )
}

export function DailyBoardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      <Skeleton className="h-32 w-full mb-6" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <HabitColumnSkeleton />
        <HabitColumnSkeleton />
        <HabitColumnSkeleton />
        <HabitColumnSkeleton />
      </div>
    </div>
  )
}
