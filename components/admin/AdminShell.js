"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";
import { AdminNotificationBell } from "./AdminNotificationBell";

const adminNav = [
  { label: "Overview", href: "/admin" },
  { label: "Users", href: "/admin/users" },
  { label: "Transactions", href: "/admin/transactions" },
  { label: "Withdrawals", href: "/admin/withdrawals" },
  { label: "Support chat", href: "/admin/chat" },
];

export function AdminShell({ children, user }) {
  const pathname = usePathname();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950">
      <aside className="flex w-64 shrink-0 flex-col border-r border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900">
        <div className="border-b border-slate-200 p-5 dark:border-slate-700">
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
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Administration</h1>
          <AdminNotificationBell />
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6">{children}</main>
      </div>
    </div>
  );
}
