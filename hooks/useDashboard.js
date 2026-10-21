"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ACCOUNT_LIMIT } from "@/config/dashboard";

const EMPTY_STATS = {
  totalBalance: 0,
  accountCount: 0,
  transactionCount: 0,
  monthlySpend: 0,
  monthlyDeposits: 0,
  monthlyExpenses: 0,
  totalVolume: 0,
  accountLimit: ACCOUNT_LIMIT,
  totalDeposits: 0,
  pendingCount: 0,
  pendingAmount: 0,
};

async function parseJsonResponse(res) {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(
      res.status >= 500
        ? "Server error. Check MongoDB in .env.local and restart the dev server."
        : "Invalid response from server"
    );
  }
}

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const inFlightRef = useRef(false);
  const requestIdRef = useRef(0);

  const fetchDashboard = useCallback(async ({ silent = false } = {}) => {
    if (inFlightRef.current) return;

    const requestId = ++requestIdRef.current;
    inFlightRef.current = true;
    if (!silent) setLoading(true);

    try {
      setError(null);
      const res = await fetch("/api/dashboard", {
        credentials: "include",
        cache: "no-store",
      });
      const json = await parseJsonResponse(res);

      if (requestId !== requestIdRef.current) return;

      if (!res.ok) {
        setError(json.error || "Failed to load dashboard");
        setData((current) => {
          if (current) return current;
          return {
            accounts: json.accounts || [],
            transactions: json.transactions || [],
            totalBalance: json.totalBalance ?? 0,
            stats: json.stats || EMPTY_STATS,
            balanceHistory: json.balanceHistory || [],
            spendingByCategory: json.spendingByCategory || [],
            hasActivity: false,
          };
        });
        return;
      }

      setData(json);
    } catch (e) {
      if (requestId !== requestIdRef.current) return;

      setError(e.message);
      setData((current) => current || {
        accounts: [],
        transactions: [],
        totalBalance: 0,
        stats: EMPTY_STATS,
        balanceHistory: [],
        spendingByCategory: [],
        hasActivity: false,
      });
    } finally {
      if (requestId === requestIdRef.current) {
        inFlightRef.current = false;
        if (!silent) setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    fetchDashboard();

    const handleFocus = () => {
      fetchDashboard({ silent: true });
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchDashboard({ silent: true });
      }
    };

    const intervalId = window.setInterval(() => {
      fetchDashboard({ silent: true });
    }, 30000);

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [fetchDashboard]);

  return { data, loading, error, refresh: fetchDashboard };
}
