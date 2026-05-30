"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { AdminNotificationBell } from "./AdminNotificationBell";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Transactions", href: "/admin/transactions" },
  { label: "Withdrawals", href: "/admin/withdrawals" },
  { label: "Support chat", href: "/admin/chat" },
];

export function AdminShell({ children, user }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-950 md:flex-row">
      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900 md:hidden">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {sidebarOpen ? (
            <HiOutlineXMark className="h-6 w-6" />
          ) : (
            <HiOutlineBars3 className="h-6 w-6" />
          )}
        </button>
        <Link href="/admin" className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
          {siteConfig.name}
        </Link>
        <div className="w-10" />
      </div>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-950/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen w-64 border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 md:static md:h-auto",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          "transition-transform duration-300 md:translate-x-0 flex flex-col"
        )}
      >
        <div className="hidden border-b border-slate-200 p-5 dark:border-slate-700 md:block">
          <Link href="/admin" className="font-serif text-lg font-semibold text-slate-900 dark:text-white">
            {siteConfig.name} Admin
          </Link>
          <p className="text-xs text-slate-500">Operations console</p>
        </div>
        <nav className="space-y-1 p-3">
          {adminNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
                  ? "bg-blue-700 text-white"
                  : "text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto border-t border-slate-200 p-4 dark:border-slate-700">
          <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">
            {user?.firstName} {user?.lastName}
          </p>
          <button type="button" onClick={logout} className="mt-2 text-sm text-red-600 hover:underline">
            Sign out
          </button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="hidden items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900 md:flex">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Administration</h1>
          <AdminNotificationBell />
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
