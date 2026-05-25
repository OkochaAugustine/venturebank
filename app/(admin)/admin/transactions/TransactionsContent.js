"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";

export function TransactionsContent() {
  const [txns, setTxns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/transactions", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setTxns(d.transactions || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-slate-200" />;

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Member</th>
            <th className="px-4 py-3 text-left font-semibold">Description</th>
            <th className="px-4 py-3 text-left font-semibold">Amount</th>
            <th className="px-4 py-3 text-left font-semibold">Date</th>
          </tr>
        </thead>
        <tbody>
          {txns.map((t) => (
            <tr key={t.id} className="border-t border-slate-100">
              <td className="px-4 py-3">{t.user?.name}</td>
              <td className="px-4 py-3">{t.description}</td>
              <td className="px-4 py-3 font-semibold">{formatCurrency(t.amount)}</td>
              <td className="px-4 py-3 text-slate-500">{formatDate(t.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {!txns.length && <p className="p-8 text-center text-slate-500">No transactions recorded.</p>}
    </div>
  );
}
