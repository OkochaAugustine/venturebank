"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency, formatDate } from "@/lib/utils";

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setUsers(d.users || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="animate-pulse h-64 rounded-xl bg-slate-200" />;

  if (!users.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 sm:p-8 text-center">
        <p className="text-slate-500">No registered users yet.</p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table view */}
      <div className="hidden md:block overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 font-semibold text-slate-600">Member</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Balance</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Txns</th>
              <th className="px-4 py-3 font-semibold text-slate-600">Joined</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-slate-100 hover:bg-slate-50">
                <td className="px-4 py-3">
                  <p className="font-medium text-slate-800">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-slate-500">{u.email}</p>
                </td>
                <td className="px-4 py-3 font-semibold">{formatCurrency(u.balance)}</td>
                <td className="px-4 py-3">{u.transactionCount}</td>
                <td className="px-4 py-3 text-slate-500">{formatDate(u.createdAt)}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/users/${u.id}`} className="font-semibold text-ocean-700 hover:underline">
                    Manage
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card view */}
      <div className="md:hidden space-y-3">
        {users.map((u) => (
          <div key={u.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-slate-800 truncate">{u.firstName} {u.lastName}</p>
                <p className="text-xs text-slate-500 truncate">{u.email}</p>
              </div>
              <Link 
                href={`/admin/users/${u.id}`} 
                className="whitespace-nowrap flex-shrink-0 text-xs font-semibold text-ocean-700 hover:underline"
              >
                Manage
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Balance</p>
                <p className="mt-1 font-semibold text-slate-800">{formatCurrency(u.balance)}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Txns</p>
                <p className="mt-1 font-semibold text-slate-800">{u.transactionCount}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase">Joined</p>
                <p className="mt-1 text-xs text-slate-600">{formatDate(u.createdAt)}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
