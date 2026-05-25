"use client";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-ocean-700 text-white shadow-md hover:bg-ocean-800 hover:shadow-lg focus-visible:ring-ocean-500",
  secondary:
    "border border-slate-200 bg-white text-slate-800 hover:bg-slate-50 focus-visible:ring-ocean-500",
  outline:
    "border-2 border-ocean-700 bg-transparent text-ocean-800 hover:bg-ocean-50 focus-visible:ring-ocean-500",
  ghost: "bg-transparent text-ocean-800 hover:bg-ocean-50",
  luxury:
    "bg-gradient-to-r from-luxury-gold/90 to-luxury-gold text-luxury-midnight font-semibold hover:opacity-90",
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
        "inline-flex items-center justify-center font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
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
