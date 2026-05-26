"use client";

import { useState } from "react";
import { HiOutlineArrowDownTray, HiOutlineShieldCheck } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { useDashboardContext } from "@/context/DashboardContext";
import {
  TransactionSecurityModal,
  buildAmountSummary,
} from "@/components/banking/TransactionSecurityModal";
import { formatCurrency } from "@/lib/utils";

const METHODS = [
  { value: "wire", label: "Wire transfer" },
  { value: "ach", label: "ACH" },
  { value: "mobile_check", label: "Mobile check deposit" },
];

export function DepositForm() {
  const { data, refresh } = useDashboardContext();
  const accounts = data?.accounts || [];
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("wire");
  const [note, setNote] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

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
    setModalOpen(true);
  }

  async function executeDeposit({ pin, securityAnswer }) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/banking/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          accountId: selectedId,
          amount: parseFloat(amount),
          method,
          description: note,
          pin,
          securityAnswer,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Deposit failed");
      setSuccess(json);
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
        <p className="text-sm text-muted-foreground">No accounts available. Contact support.</p>
      </div>
    );
  }

  const summary = buildAmountSummary(
    [
      { label: "To account", value: selectedAccount?.name || "—" },
      { label: "Method", value: METHODS.find((m) => m.value === method)?.label || method },
    ],
    parseFloat(amount) || 0
  );

  return (
    <>
      <div className="surface-card p-6">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-700">
            <HiOutlineArrowDownTray className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Deposit funds</h2>
            <p className="text-xs text-muted-foreground">Pending until VentureBank confirms receipt</p>
          </div>
        </div>

        <form onSubmit={openConfirm} className="space-y-4">
          <Select label="Credit to account" value={selectedId} onChange={(e) => setAccountId(e.target.value)}>
            {accounts.map((acc) => (
              <option key={acc.id} value={acc.id}>
                {acc.name} — {formatCurrency(acc.balance)}
              </option>
            ))}
          </Select>
          <Select label="Deposit method" value={method} onChange={(e) => setMethod(e.target.value)}>
            {METHODS.map((m) => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </Select>
          <Input label="Amount (USD)" type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Input label="Reference / memo" value={note} onChange={(e) => setNote(e.target.value)} placeholder="Optional" />
          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm dark:border-amber-900 dark:bg-amber-950/40">
              <p className="font-semibold text-amber-900 dark:text-amber-200">Deposit request submitted</p>
              <p className="mt-1 text-amber-800 dark:text-amber-300">Ref: {success.reference}</p>
              <p className="mt-2 text-amber-700 dark:text-amber-400">{success.message}</p>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
            <HiOutlineShieldCheck className="h-5 w-5 text-brand-600" />
            <p className="text-xs text-muted-foreground">Admin approval required before balance updates</p>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={!amount || submitting}>
            Review & submit deposit
          </Button>
        </form>
      </div>

      <TransactionSecurityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={executeDeposit}
        title="Confirm deposit request"
        summary={summary}
        confirmLabel="Submit deposit"
        loading={submitting}
      />
    </>
  );
}
