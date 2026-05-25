"use client";

import { Skeleton } from "@/components/ui/Skeleton";

export function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      <Skeleton className="h-32 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl" />
        <Skeleton className="h-36 rounded-2xl sm:col-span-2 lg:col-span-1" />
      </div>
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
