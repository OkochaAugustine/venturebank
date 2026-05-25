"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { TranslateWidget } from "@/components/layout/TranslateWidget";

export function AdminAuthShell({ title, subtitle, children, footer }) {
  return (
    <div className="surface-page flex min-h-screen flex-col bg-gradient-to-br from-slate-100 via-blue-50/30 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <header className="flex items-center justify-between border-b border-border bg-card/80 px-4 py-4 backdrop-blur sm:px-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
            V
          </span>
          <span className="font-serif text-lg font-semibold text-foreground">
            {siteConfig.name}
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <TranslateWidget compact />
          <ThemeToggle compact />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="mb-6 text-center sm:mb-8">
            <p className="text-xs font-bold uppercase tracking-widest text-blue-600">Admin Console</p>
            <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">{title}</h1>
            {subtitle && (
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
            )}
          </div>
          <div className="surface-card p-5 shadow-lg sm:p-8">
            {children}
          </div>
          {footer && <div className="mt-6 text-center text-sm text-slate-500">{footer}</div>}
        </motion.div>
      </main>
    </div>
  );
}
