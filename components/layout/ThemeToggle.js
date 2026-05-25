"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { cn } from "@/lib/utils";

export function ThemeToggle({ compact = false, className }) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-lg bg-muted",
          compact ? "h-9 w-9" : "h-10 w-10",
          className
        )}
        aria-hidden
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "flex items-center justify-center rounded-lg border border-border bg-card text-foreground shadow-sm transition-all duration-200 hover:border-brand-500/40 hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30",
        compact ? "h-9 w-9" : "h-10 w-10",
        className
      )}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDark ? (
        <HiOutlineSun className="h-5 w-5 text-amber-400" />
      ) : (
        <HiOutlineMoon className="h-5 w-5 text-brand-600" />
      )}
    </button>
  );
}
