"use client";

import { useState } from "react";
import { HiOutlineArrowUpTray, HiOutlinePhone, HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useDashboardContext } from "@/context/DashboardContext";
import {
  TransactionSecurityModal,
  buildAmountSummary,
} from "@/components/banking/TransactionSecurityModal";
import { formatCurrency } from "@/lib/utils";

export function WithdrawForm() {
  const { data, refresh } = useDashboardContext();
  const accounts = data?.accounts || [];
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const selectedId = accountId || accounts[0]?.id || "";
  const selectedAccount = accounts.find((a) => a.id === selectedId);

  function openConfirm(e) {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    if (selectedAccount && selectedAccount.balance < amt) {
      setError("Insufficient available balance");
      return;
    }
    setModalOpen(true);
  }

  async function executeWithdraw({ pin }) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/banking/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          accountId: selectedId,
          amount: parseFloat(amount),
          description: note,
          pin,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Withdrawal failed");
      setResult(json);
      setAmount("");
      setNote("");
      refresh();
    } finally {
      setSubmitting(false);
    }
  }

  if (!accounts.length) {
    return (
      <div className="surface-card p-6">
        <p className="text-sm text-muted-foreground">No accounts available.</p>
      </div>
    );
  }

  const summary = buildAmountSummary(
    [{ label: "From account", value: selectedAccount?.name || "—" }],
    parseFloat(amount) || 0
  );

  return (
    <>
      <div className="surface-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-700">
            <HiOutlineArrowUpTray className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Withdraw funds</h2>
            <p className="text-xs text-muted-foreground">Security code approval required</p>
          </div>
        </div>

        {!result ? (
          <form onSubmit={openConfirm} className="space-y-4">
            <Select label="From account" value={selectedId} onChange={(e) => setAccountId(e.target.value)}>
              {accounts.map((acc) => (
                <option key={acc.id} value={acc.id}>
                  {acc.name} — {formatCurrency(acc.balance)}
                </option>
              ))}
            </Select>
            <Input label="Amount (USD)" type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <Input label="Purpose" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" variant="primary" className="w-full" disabled={!amount}>
              Review withdrawal request
            </Button>
          </form>
        ) : (
          <div className="space-y-4 rounded-xl border border-brand-200 bg-brand-50/50 p-5 dark:border-brand-900 dark:bg-brand-950/30">
            <p className="font-semibold text-foreground">Withdrawal request received</p>
            <p className="text-sm text-muted-foreground">Reference: <span className="font-mono">{result.reference}</span></p>
            <p className="text-sm leading-relaxed text-foreground">{result.message}</p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <a href="tel:18008368873" className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-700 px-4 py-2.5 text-sm font-semibold text-white">
                <HiOutlinePhone className="h-5 w-5" /> 1-800-VENTURE
              </a>
              <Link href="/dashboard/support" className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold">
                <HiOutlineChatBubbleLeftRight className="h-5 w-5" /> Live chat
              </Link>
            </div>
          </div>
        )}
      </div>

      <TransactionSecurityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={executeWithdraw}
        title="Verify withdrawal"
        summary={summary}
        confirmLabel="Submit request"
        loading={submitting}
      />
    </>
  );
}
