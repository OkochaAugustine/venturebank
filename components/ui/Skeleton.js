import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-[rgb(var(--muted))]",
        className
      )}
      {...props}
    />
  );
}
