"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatCurrency, formatDate, cn } from "@/lib/utils";

export function TransactionsContent() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  function load() {
    setLoading(true);
    fetch("/api/admin/transactions", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setTxns(d.transactions || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function approveDeposit(id) {
    const res = await fetch(`/api/admin/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "approve_deposit" }),
    });
    const json = await res.json();
    setMsg(res.ok ? "Deposit approved" : json.error);
    load();
  }

  async function reverseTxn(id) {
    if (!confirm("Reverse this transaction?")) return;
    const res = await fetch(`/api/admin/transactions/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ action: "reverse" }),
    });
    const json = await res.json();
    setMsg(res.ok ? `Reversed: ${json.reversalReference}` : json.error);
    load();
  }

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />;

  return (
    <div className="space-y-4">
      {msg && <p className="rounded-lg bg-blue-50 px-4 py-2 text-sm text-blue-800 dark:bg-blue-950/40">{msg}</p>}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-slate-50 dark:bg-slate-900/50">
            <tr>
              <th className="px-4 py-3 text-left font-semibold">Member</th>
              <th className="px-4 py-3 text-left font-semibold">Description</th>
              <th className="px-4 py-3 text-left font-semibold">Type</th>
              <th className="px-4 py-3 text-left font-semibold">Status</th>
              <th className="px-4 py-3 text-left font-semibold">Amount</th>
              <th className="px-4 py-3 text-left font-semibold">Date</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {txns.map((t) => (
              <tr key={t.id} className="border-t border-slate-100 dark:border-slate-700">
                <td className="px-4 py-3">
                  <p className="font-medium">{t.user?.name}</p>
                  <p className="text-xs text-slate-500">{t.user?.email}</p>
                </td>
                <td className="px-4 py-3">
                  <p>{t.description}</p>
                  <p className="font-mono text-xs text-slate-400">{t.reference}</p>
                </td>
                <td className="px-4 py-3 capitalize">{t.type}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                      t.status === "completed" && "bg-emerald-100 text-emerald-800",
                      t.status === "pending" && "bg-amber-100 text-amber-800",
                      t.status === "reversed" && "bg-slate-200 text-slate-700"
                    )}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-semibold tabular-nums">{formatCurrency(t.amount)}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(t.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <div className="flex justify-end gap-1">
                    {t.status === "pending" && t.type === "deposit" && (
                      <Button type="button" variant="primary" size="sm" onClick={() => approveDeposit(t.id)}>
                        Approve
                      </Button>
                    )}
                    {t.status === "completed" && (
                      <Button type="button" variant="outline" size="sm" onClick={() => reverseTxn(t.id)}>
                        Reverse
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!txns.length && <p className="p-8 text-center text-slate-500">No transactions recorded.</p>}
      </div>
    </div>
  );
}
