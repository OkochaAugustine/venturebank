"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useAdminNotifications(pollMs = 8000) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const lastFetchRef = useRef(null);

  const fetchNotifications = useCallback(async (initial = false) => {
    try {
      const since =
        !initial && lastFetchRef.current
          ? `?since=${encodeURIComponent(lastFetchRef.current)}&limit=20`
          : "?limit=50";
      const res = await fetch(`/api/admin/notifications${since}`, { credentials: "include" });
      const json = await res.json();
      if (!res.ok) return;

      const isIncremental = since.includes("since=");
      if (isIncremental && json.notifications?.length) {
        setNotifications((prev) => {
          const ids = new Set(prev.map((n) => n.id));
          const added = json.notifications.filter((n) => !ids.has(n.id));
          return added.length ? [...added, ...prev] : prev;
        });
      } else if (!isIncremental) {
        setNotifications(json.notifications || []);
      }

      setUnreadCount(json.unreadCount ?? 0);
      lastFetchRef.current = new Date().toISOString();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!pollMs) {
      setLoading(false);
      return;
    }
    fetchNotifications(true);
    const id = setInterval(() => fetchNotifications(false), pollMs);
    return () => clearInterval(id);
  }, [fetchNotifications, pollMs]);

  async function markRead(ids) {
    const res = await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ notificationIds: ids }),
    });
    const json = await res.json();
    if (res.ok) {
      setNotifications((prev) =>
        prev.map((n) => (ids.includes(n.id) ? { ...n, read: true } : n))
      );
      setUnreadCount(json.unreadCount ?? 0);
    }
  }

  async function markAllRead() {
    const res = await fetch("/api/admin/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ markAllRead: true }),
    });
    const json = await res.json();
    if (res.ok) {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    }
  }

  return { notifications, unreadCount, loading, markRead, markAllRead, refresh: () => fetchNotifications(true) };
}
