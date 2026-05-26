"use client";

import { useState } from "react";
import {
  HiOutlineBell,
  HiOutlineCheck,
  HiOutlineFunnel,
  HiOutlineShieldCheck,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBanknotes,
} from "react-icons/hi2";
import { useNotifications } from "@/hooks/useNotifications";
import { formatDate, cn } from "@/lib/utils";

const FILTERS = [
  { id: "all", label: "All" },
  { id: "transaction", label: "Transactions" },
  { id: "security", label: "Security" },
  { id: "chat", label: "Messages" },
];

function typeIcon(type) {
  if (type === "security") return HiOutlineShieldCheck;
  if (type === "chat") return HiOutlineChatBubbleLeftRight;
  return HiOutlineBanknotes;
}

export function AlertCenter() {
  const { notifications, unreadCount, loading, markRead, markAllRead } = useNotifications(4000);
  const [filter, setFilter] = useState("all");

  const filtered = notifications.filter((n) => {
    if (filter === "all") return true;
    if (filter === "transaction") {
      return ["transaction", "deposit", "withdrawal", "transfer"].includes(n.type);
    }
    return n.type === filter;
  });

  return (
    <div className="space-y-6">
      <div className="surface-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-500/15 text-brand-700 dark:text-brand-300">
            <HiOutlineBell className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground sm:text-2xl">Alert center</h1>
            <p className="text-sm text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}` : "All caught up"}
            </p>
          </div>
        </div>
        {unreadCount > 0 && (
          <button
            type="button"
            onClick={() => markAllRead()}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-brand-700 hover:bg-muted dark:text-brand-300"
          >
            <HiOutlineCheck className="h-4 w-4" /> Mark all read
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors",
              filter === f.id
                ? "bg-brand-700 text-white dark:bg-brand-600"
                : "border border-border bg-card text-muted-foreground hover:bg-muted"
            )}
          >
            <HiOutlineFunnel className="h-3.5 w-3.5" />
            {f.label}
          </button>
        ))}
      </div>

      <div className="surface-card overflow-hidden">
        {loading ? (
          <div className="space-y-3 p-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-20 animate-pulse rounded-xl bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="p-12 text-center text-sm text-muted-foreground">
            No alerts in this category yet. Banking activity will appear here instantly.
          </p>
        ) : (
          <ul className="divide-y divide-border">
            {filtered.map((n) => {
              const Icon = typeIcon(n.type);
              return (
                <li key={n.id}>
                  <button
                    type="button"
                    onClick={() => !n.read && markRead([n.id])}
                    className={cn(
                      "flex w-full gap-4 px-4 py-4 text-left transition-colors hover:bg-muted/40 sm:px-6",
                      !n.read && "bg-brand-500/5"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                        n.priority === "high"
                          ? "bg-amber-500/15 text-amber-700 dark:text-amber-400"
                          : "bg-muted text-brand-700 dark:text-brand-300"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-foreground">{n.title}</p>
                        {!n.read && (
                          <span className="shrink-0 rounded-full bg-brand-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                            New
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{n.message}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        {formatDate(n.createdAt, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {n.metadata?.reference && (
                          <span className="ml-2 font-mono">· {n.metadata.reference}</span>
                        )}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
