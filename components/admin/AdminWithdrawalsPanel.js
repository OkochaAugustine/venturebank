"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { formatCurrency, formatDate } from "@/lib/utils";

export function AdminWithdrawalsPanel() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [securityCode, setSecurityCode] = useState("");
  const [activeId, setActiveId] = useState(null);
  const [msg, setMsg] = useState("");

  function load() {
    setLoading(true);
    fetch("/api/admin/withdrawals", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setRequests(d.requests || []))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
  }, []);

  async function approve(id) {
    setMsg("");
    const res = await fetch("/api/admin/withdrawals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ requestId: id, action: "approve", securityCode }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error || "Failed");
      return;
    }
    setMsg(`Approved — new balance ${formatCurrency(json.newBalance)}`);
    setActiveId(null);
    setSecurityCode("");
    load();
  }

  async function reject(id) {
    await fetch("/api/admin/withdrawals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ requestId: id, action: "reject" }),
    });
    load();
  }

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />;

  return (
    <div className="space-y-4">
      {msg && <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40">{msg}</p>}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {requests.length === 0 ? (
          <p className="p-8 text-center text-slate-500">No withdrawal requests.</p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {requests.map((r) => (
              <li key={r.id} className="p-4 sm:p-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{r.userName}</p>
                    <p className="text-sm text-slate-500">{r.email}</p>
                    <p className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(r.amount)}</p>
                    <p className="font-mono text-xs text-slate-400">{r.reference}</p>
                    <p className="mt-1 text-xs text-slate-500">{formatDate(r.createdAt)}</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:min-w-[240px]">
                    {activeId === r.id ? (
                      <>
                        <Input
                          label="Security code (member provided)"
                          value={securityCode}
                          onChange={(e) => setSecurityCode(e.target.value)}
                          placeholder="Enter code from member"
                        />
                        <div className="flex gap-2">
                          <Button variant="primary" className="flex-1" onClick={() => approve(r.id)}>
                            Approve & debit
                          </Button>
                          <Button variant="outline" onClick={() => setActiveId(null)}>
                            Cancel
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <Button variant="primary" onClick={() => setActiveId(r.id)}>
                          Approve
                        </Button>
                        <Button variant="outline" onClick={() => reject(r.id)}>
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
