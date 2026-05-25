"use client";

import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatCurrency } from "@/lib/utils";
import { useDashboardContext } from "@/context/DashboardContext";
import { EmptyState } from "./EmptyState";
import { HiOutlineChartBar } from "react-icons/hi2";

function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-2 text-xs font-medium text-slate-500">{label}</p>
      {payload.map((entry) => (
        <p
          key={entry.dataKey}
          className="text-sm font-semibold"
          style={{ color: entry.color }}
        >
          {entry.name}: {formatter ? formatter(entry.value) : entry.value}
        </p>
      ))}
    </div>
  );
}

export function AnalyticsCharts() {
  const { data, loading } = useDashboardContext();
  const balanceHistory = data?.balanceHistory || [];
  const spendingByCategory = data?.spendingByCategory || [];
  const hasData = data?.hasActivity && (data?.transactions?.length > 0 || data?.totalBalance > 0);

  if (loading) {
    return <div className="h-80 animate-pulse rounded-2xl bg-slate-200" />;
  }

  if (!hasData) {
    return (
      <section id="analytics" className="space-y-4">
        <h2 className="text-lg font-semibold text-ocean-950">Analytics</h2>
        <EmptyState
          icon={HiOutlineChartBar}
          title="Analytics unlock with activity"
          description="Charts populate once you have deposits or transactions. New accounts start at $0 with no sample data."
        />
      </section>
    );
  }

  return (
    <section id="analytics" className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-ocean-950">Analytics</h2>
          <p className="text-sm text-slate-500">
            Portfolio performance & spending insights
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-3 lg:p-6"
        >
          <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold text-ocean-950">Balance overview</h3>
              <p className="text-xs text-slate-500">12-month portfolio trend</p>
            </div>
            <div className="flex gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-brand-500" />
                <span className="text-slate-500">Balance</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-slate-500">Income</span>
              </span>
            </div>
          </div>

          <div className="h-[280px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={balanceHistory}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="balanceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="incomeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.06)"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000000).toFixed(1)}M`}
                  width={48}
                />
                <Tooltip
                  content={(props) => (
                    <ChartTooltip
                      {...props}
                      formatter={(v) => formatCurrency(v)}
                    />
                  )}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  name="Balance"
                  stroke="#0ea5e9"
                  strokeWidth={2}
                  fill="url(#balanceGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="income"
                  name="Income"
                  stroke="#10b981"
                  strokeWidth={2}
                  fill="url(#incomeGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="col-span-1 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2 lg:p-6"
        >
          <div className="mb-6">
            <h3 className="font-semibold text-ocean-950">Spending by category</h3>
            <p className="text-xs text-slate-500">Current month breakdown</p>
          </div>

          <div className="h-[280px] w-full sm:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={spendingByCategory}
                layout="vertical"
                margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(0,0,0,0.06)"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11 }}
                  tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
                />
                <YAxis
                  type="category"
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#94a3b8", fontSize: 11 }}
                  width={90}
                />
                <Tooltip
                  content={(props) => (
                    <ChartTooltip
                      {...props}
                      formatter={(v) => formatCurrency(v)}
                    />
                  )}
                />
                <Bar dataKey="amount" radius={[0, 6, 6, 0]} barSize={18}>
                  {spendingByCategory.map((entry) => (
                    <Cell key={entry.category} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
