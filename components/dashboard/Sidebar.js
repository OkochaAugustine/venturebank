"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineXMark, HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { dashboardNavSections } from "@/config/dashboard";
import { TranslateWidget } from "@/components/layout/TranslateWidget";

export function Sidebar({ open, onClose, user }) {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  const navContent = (
    <>
      <div className="border-b border-slate-200 px-5 py-5 dark:border-slate-700">
        <Link href="/" className="flex items-center gap-3" onClick={onClose}>
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
            <span className="font-bold text-white">V</span>
          </div>
          <div>
            <p className="font-serif text-lg font-semibold text-blue-800 dark:text-blue-300">
              {siteConfig.name}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Online Banking</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 space-y-6 overflow-y-auto px-3 py-5">
        {dashboardNavSections.map((section) => (
          <div key={section.title}>
            <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {section.title}
            </p>
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-blue-50 hover:text-blue-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    )}
                  >
                    <Icon className="h-5 w-5 shrink-0" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-slate-200 p-4 dark:border-slate-700">
        <TranslateWidget compact className="w-full [&_button]:w-full [&_button]:justify-center" />
        <button
          type="button"
          onClick={logout}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 py-2.5 text-sm font-medium text-slate-600 hover:bg-red-50 hover:text-red-600 dark:border-slate-600 dark:text-slate-300"
        >
          <HiOutlineArrowRightOnRectangle className="h-5 w-5" />
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:flex">
        {navContent}
      </aside>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/40 lg:hidden"
              onClick={onClose}
            />
            <motion.aside
              initial={{ x: -260 }}
              animate={{ x: 0 }}
              exit={{ x: -260 }}
              className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:hidden"
            >
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-4 rounded-lg p-2 text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                <HiOutlineXMark className="h-5 w-5" />
              </button>
              {navContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
