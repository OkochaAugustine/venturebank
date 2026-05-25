"use client";

import { useCallback, useEffect, useState } from "react";
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

  const fetchDashboard = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/dashboard", { credentials: "include" });
      const json = await parseJsonResponse(res);

      if (!res.ok) {
        setError(json.error || "Failed to load dashboard");
        setData({
          accounts: json.accounts || [],
          transactions: json.transactions || [],
          totalBalance: json.totalBalance ?? 0,
          stats: json.stats || EMPTY_STATS,
          balanceHistory: json.balanceHistory || [],
          spendingByCategory: json.spendingByCategory || [],
          hasActivity: false,
        });
        return;
      }

      setData(json);
    } catch (e) {
      setError(e.message);
      setData({
        accounts: [],
        transactions: [],
        totalBalance: 0,
        stats: EMPTY_STATS,
        balanceHistory: [],
        spendingByCategory: [],
        hasActivity: false,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  return { data, loading, error, refresh: fetchDashboard };
}
