"use client";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-brand-700 text-white shadow-md hover:bg-brand-800 hover:shadow-lg focus-visible:ring-brand-500 dark:bg-brand-600 dark:hover:bg-brand-500",
  secondary:
    "border border-border bg-card text-foreground hover:bg-muted focus-visible:ring-brand-500",
  outline:
    "border-2 border-brand-700 bg-transparent text-brand-800 hover:bg-brand-500/10 focus-visible:ring-brand-500 dark:border-brand-500 dark:text-brand-300 dark:hover:bg-brand-500/15",
  ghost:
    "bg-transparent text-brand-800 hover:bg-muted focus-visible:ring-brand-500 dark:text-brand-300",
  luxury:
    "bg-gradient-to-r from-luxury-gold/90 to-luxury-gold font-semibold text-luxury-midnight hover:opacity-90",
};

const sizes = {
  sm: "h-9 px-4 text-sm rounded-lg",
  md: "h-11 px-6 text-sm rounded-lg",
  lg: "h-12 px-8 text-[15px] rounded-lg",
  icon: "h-10 w-10 rounded-lg",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
