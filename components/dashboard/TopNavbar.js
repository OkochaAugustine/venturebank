"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineArrowRightOnRectangle,
  HiOutlineBars3,
  HiOutlineChevronDown,
  HiOutlineCog6Tooth,
  HiOutlineQuestionMarkCircle,
} from "react-icons/hi2";
import { ThemeToggleNav } from "@/components/layout/ThemeToggleNav";
import { TranslateWidget } from "@/components/layout/TranslateWidget";
import { NotificationBell } from "@/components/dashboard/NotificationBell";

export function TopNavbar({ onMenuClick, user }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-card px-4 py-3 shadow-sm sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 lg:hidden dark:border-slate-600 dark:text-slate-300"
            aria-label="Menu"
          >
            <HiOutlineBars3 className="h-5 w-5" />
          </button>
          <div className="lg:hidden">
            <p className="text-xs text-slate-500 dark:text-slate-400">Dashboard</p>
            <p className="text-sm font-semibold text-slate-900 dark:text-white">
              Welcome, {user?.name?.split(" ")[0] || "Member"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <TranslateWidget compact />
          </div>
          <ThemeToggleNav />
          <NotificationBell />

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 rounded-lg border border-slate-200 py-1.5 pl-1.5 pr-2 dark:border-slate-600"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                {user?.initials || "VB"}
              </div>
              <HiOutlineChevronDown className="hidden h-4 w-4 text-slate-500 sm:block" />
            </button>
            {menuOpen && (
              <>
                <button type="button" className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} aria-label="Close" />
                <div className="absolute right-0 z-50 mt-2 w-64 rounded-xl border border-slate-200 bg-white py-2 shadow-xl dark:border-slate-600 dark:bg-slate-800">
                  <div className="border-b border-slate-100 px-4 py-3 dark:border-slate-700">
                    <p className="font-semibold text-slate-900 dark:text-white">{user?.name}</p>
                    <p className="truncate text-xs text-slate-500">{user?.email}</p>
                  </div>
                  <Link href="/dashboard/settings" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700" onClick={() => setMenuOpen(false)}>
                    <HiOutlineCog6Tooth className="h-4 w-4" /> Profile Settings
                  </Link>
                  <Link href="/dashboard/support" className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-700" onClick={() => setMenuOpen(false)}>
                    <HiOutlineQuestionMarkCircle className="h-4 w-4" /> Help & Support
                  </Link>
                  <button type="button" onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                    <HiOutlineArrowRightOnRectangle className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
