"use client";

import { cn } from "@/lib/utils";

const inputStyles =
  "flex h-12 w-full rounded-lg border border-border bg-card px-4 text-[15px] text-foreground shadow-sm transition-all placeholder:text-muted-foreground hover:border-brand-500/30 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground dark:focus:ring-brand-400/25";

const labelStyles = "text-sm font-semibold text-foreground";

export function Input({ className, label, error, id, ...props }) {
  const inputId = id || props.name;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={inputId} className={labelStyles}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          inputStyles,
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      />
      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function Select({ className, label, error, id, children, ...props }) {
  const selectId = id || props.name;

  return (
    <div className="w-full space-y-2">
      {label && (
        <label htmlFor={selectId} className={labelStyles}>
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={cn(
          inputStyles,
          "appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 fill=%27none%27 viewBox=%270 0 20 20%27%3E%3Cpath stroke=%27%2364748b%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27 stroke-width=%271.5%27 d=%27m6 8 4 4 4-4%27/%3E%3C/svg%3E')] bg-[length:1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10",
          error && "border-red-400 focus:border-red-500 focus:ring-red-500/20",
          className
        )}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-sm font-medium text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export function Checkbox({ className, label, id, ...props }) {
  const checkboxId = id || props.name;

  return (
    <label
      htmlFor={checkboxId}
      className={cn("flex cursor-pointer items-start gap-3", className)}
    >
      <input
        id={checkboxId}
        type="checkbox"
        className="mt-1 h-4 w-4 rounded border-border text-brand-600 focus:ring-brand-500/30 dark:bg-card"
        {...props}
      />
      <span className="text-sm leading-relaxed text-muted-foreground">{label}</span>
    </label>
  );
}
