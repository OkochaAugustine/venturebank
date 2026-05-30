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

  const load = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/admin/withdrawals", {
        credentials: "include",
      });

      const data = await res.json();
      setRequests(Array.isArray(data?.requests) ? data.requests : []);
    } catch (err) {
      setRequests([]);
      setMsg("Failed to load withdrawals");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id) => {
    try {
      setMsg("");

      const res = await fetch("/api/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          requestId: id,
          action: "approve",
          securityCode,
        }),
      });

      const json = await res.json();

      if (!res.ok) {
        setMsg(json?.error || "Failed to approve request");
        return;
      }

      setMsg(
        `Approved — new balance ${formatCurrency(json?.newBalance || 0)}`
      );

      setActiveId(null);
      setSecurityCode("");
      load();
    } catch (err) {
      setMsg("Network error");
    }
  };

  const reject = async (id) => {
    try {
      await fetch("/api/admin/withdrawals", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          requestId: id,
          action: "reject",
        }),
      });

      load();
    } catch (err) {
      setMsg("Failed to reject request");
    }
  };

  if (loading) {
    return (
      <div className="h-64 animate-pulse rounded-xl bg-slate-200 dark:bg-slate-700" />
    );
  }

  return (
    <div className="w-full max-w-full space-y-4 overflow-x-hidden">
      {msg && (
        <p className="rounded-lg bg-emerald-50 px-4 py-2 text-sm text-emerald-800 dark:bg-emerald-950/40">
          {msg}
        </p>
      )}

      <div className="w-full rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        {requests.length === 0 ? (
          <p className="p-6 sm:p-8 text-center text-slate-500">
            No withdrawal requests.
          </p>
        ) : (
          <ul className="divide-y divide-slate-100 dark:divide-slate-700">
            {requests.map((r) => (
              <li
                key={r?.id || Math.random()}
                className="flex flex-col gap-3 p-4 sm:p-5"
              >
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-between">
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-semibold text-slate-900 dark:text-white">
                      {r?.userName || "Unknown User"}
                    </p>

                    <p className="truncate text-xs sm:text-sm text-slate-500">
                      {r?.email || "No email"}
                    </p>

                    <p className="mt-2 text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {formatCurrency(r?.amount || 0)}
                    </p>

                    <p className="font-mono text-xs text-slate-400 truncate">
                      {r?.reference || "N/A"}
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      {formatDate(r?.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
                  {activeId === r?.id ? (
                    <>
                      <Input
                        label="Security code (member provided)"
                        value={securityCode}
                        onChange={(e) => setSecurityCode(e.target.value)}
                        placeholder="Enter code"
                      />

                      <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                        <Button
                          variant="primary"
                          className="flex-1"
                          onClick={() => approve(r?.id)}
                        >
                          Approve & debit
                        </Button>

                        <Button
                          variant="outline"
                          className="flex-1"
                          onClick={() => setActiveId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="primary"
                        className="flex-1 sm:flex-none"
                        onClick={() => setActiveId(r?.id)}
                      >
                        Approve
                      </Button>

                      <Button
                        variant="outline"
                        className="flex-1 sm:flex-none"
                        onClick={() => reject(r?.id)}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}