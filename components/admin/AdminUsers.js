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

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
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
      {!users.length && (
        <p className="p-8 text-center text-slate-500">No registered users yet.</p>
      )}
    </div>
  );
}
