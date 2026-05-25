"use client";

import { useDashboardContext } from "@/context/DashboardContext";
import { OceanDashboard } from "./ocean/OceanDashboard";
import { DashboardLoading } from "./DashboardLoading";
export function DashboardOverview({ userName = "Member" }) {
  const { data, loading, error, refresh } = useDashboardContext();
  const fullName = userName || "Member";
  const accounts = data?.accounts || [];
  const primary = accounts[0];
  const total = data?.totalBalance ?? 0;

  if (loading) return <DashboardLoading />;

  return (
    <div className="space-y-4">
      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-amber-900/50 dark:bg-amber-950/40">
          <p className="text-sm font-medium text-amber-900 dark:text-amber-200">{error}</p>
          <button
            type="button"
            onClick={refresh}
            className="mt-2 text-sm font-semibold text-blue-600 hover:underline"
          >
            Retry connection
          </button>
        </div>
      )}
      <OceanDashboard userName={fullName} />
    </div>
  );
}
