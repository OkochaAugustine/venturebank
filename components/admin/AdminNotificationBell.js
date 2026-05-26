"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineBell, HiOutlineCheck } from "react-icons/hi2";
import { useAdminNotifications } from "@/hooks/useAdminNotifications";
import { formatDate, cn } from "@/lib/utils";

export function AdminNotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useAdminNotifications(8000);
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800"
        aria-label="Admin alerts"
      >
        <HiOutlineBell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <button type="button" className="fixed inset-0 z-[60]" onClick={() => setOpen(false)} aria-label="Close" />
          <div className="absolute right-0 z-[70] mt-2 w-[min(380px,calc(100vw-2rem))] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-600 dark:bg-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-slate-700">
              <p className="font-semibold">Operations alerts</p>
              {unreadCount > 0 && (
                <button type="button" onClick={() => markAllRead()} className="text-xs font-semibold text-blue-600">
                  Mark all read
                </button>
              )}
            </div>
            <ul className="max-h-[min(400px,60vh)] overflow-y-auto">
              {notifications.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-slate-500">No alerts</li>
              ) : (
                notifications.slice(0, 12).map((n) => (
                  <li key={n.id}>
                    <button
                      type="button"
                      onClick={() => !n.read && markRead([n.id])}
                      className={cn(
                        "w-full border-b border-slate-50 px-4 py-3 text-left dark:border-slate-700",
                        !n.read && "bg-blue-50/50 dark:bg-blue-950/20"
                      )}
                    >
                      <p className="text-sm font-semibold">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-slate-500">{n.message}</p>
                      <p className="mt-1 text-[10px] text-slate-400">
                        {formatDate(n.createdAt, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="border-t p-3">
              <Link href="/admin/transactions" onClick={() => setOpen(false)} className="block text-center text-sm font-semibold text-blue-600">
                Manage transactions
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
