"use client";

import { useState } from "react";
import Link from "next/link";
import { HiOutlineBell, HiOutlineCheck } from "react-icons/hi2";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDate, cn } from "@/lib/utils";

export function NotificationBell() {
  const { notifications, unreadCount, markRead, markAllRead } =
    useNotifications(5000);

  const [open, setOpen] = useState(false);

  return (
    <div className="relative z-[9999]">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-card text-foreground transition-colors hover:bg-muted"
        aria-label="Notifications"
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
          {/* Overlay */}
          <button
            type="button"
            className="fixed inset-0 z-[998] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-label="Close notifications"
          />

          {/* TRUE CENTER CONTAINER */}
          <div
            className="
              fixed inset-0 z-[999]
              flex items-center justify-center
              px-4
            "
          >
            {/* Modal Card */}
            <div
              className="
                w-full max-w-[380px]
                overflow-hidden rounded-2xl
                border border-border
                bg-card shadow-2xl
              "
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border px-4 py-3">
                <p className="font-semibold text-foreground">Alerts</p>

                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={() => markAllRead()}
                    className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline"
                  >
                    <HiOutlineCheck className="h-4 w-4" />
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notifications */}
              <ul className="max-h-[65vh] overflow-y-auto">
                {notifications.length === 0 ? (
                  <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                    No alerts yet
                  </li>
                ) : (
                  notifications.slice(0, 15).map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => {
                          if (!n.read) {
                            markRead([n.id]);
                          }
                        }}
                        className={cn(
                          "w-full border-b border-border px-4 py-3 text-left transition-colors hover:bg-muted/50",
                          !n.read && "bg-brand-500/5"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-semibold text-foreground">
                            {n.title}
                          </p>

                          {!n.read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-brand-500" />
                          )}
                        </div>

                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {n.message}
                        </p>

                        <p className="mt-2 text-[10px] text-muted-foreground">
                          {formatDate(n.createdAt, {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </button>
                    </li>
                  ))
                )}
              </ul>

              {/* Footer */}
              <div className="border-t border-border p-3">
                <Link
                  href="/dashboard/alerts"
                  onClick={() => setOpen(false)}
                  className="block text-center text-sm font-semibold text-brand-600 transition hover:underline"
                >
                  View alert center
                </Link>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}