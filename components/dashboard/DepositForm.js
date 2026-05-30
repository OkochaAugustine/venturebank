"use client";

import { useState } from "react";
import { HiOutlineArrowDownTray, HiOutlineShieldCheck, HiOutlineXMark } from "react-icons/hi2";
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
  const [instructionOpen, setInstructionOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);

  const selectedId = accountId || accounts[0]?.id || "";
  const selectedAccount = accounts.find((a) => a.id === selectedId);

  function openInstructions(e) {
    e.preventDefault();
    setError("");
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      setError("Enter a valid amount");
      return;
    }
    setInstructionOpen(true);
  }

  async function submitDepositRequest({ pin }) {
    setSubmitting(true);
    try {
      const res = await fetch("/api/banking/deposit-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          accountId: selectedId,
          amount: Number(amount),
          method,
          description: note,
          pin,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Deposit request failed");
      setSuccess({
        title: `Thank you ${json.firstName || "there"}!`,
        message: `Your deposit will be updated after confirmation. We’ll notify you as soon as it is reviewed.`,
        reference: json.reference,
      });
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
            <p className="text-xs text-muted-foreground">
              Use your wallet or banking details below to send funds to VentureBank.
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-3xl border border-emerald-200/70 bg-emerald-50/80 p-4 text-sm text-emerald-900 shadow-sm">
          <p className="font-semibold">Deposit instructions</p>
          <p className="mt-2 text-slate-700">
            Choose the amount and method, then continue to view the exact wallet and bank details for your transfer.
          </p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-emerald-700">Crypto wallet</p>
              <div className="mt-4 space-y-4 text-sm text-slate-700">
                <div className="rounded-3xl bg-emerald-50 p-4">
                  <p className="font-semibold text-slate-900">Bitcoin (BTC)</p>
                  <p className="mt-2 font-mono text-xs text-slate-500">1Ventur3BankCryptoWalletXYZ12345</p>
                </div>
                <div className="rounded-3xl bg-emerald-50 p-4">
                  <p className="font-semibold text-slate-900">Ethereum (ETH)</p>
                  <p className="mt-2 font-mono text-xs text-slate-500">0xVentur3BankCryptoWalletABC67890</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
              <p className="text-xs uppercase tracking-[0.12em] text-emerald-700">Bank deposit</p>
              <div className="mt-4 space-y-3 text-sm text-slate-700">
                <div className="rounded-3xl bg-emerald-50 p-4">
                  <p className="font-semibold text-slate-900">Bank</p>
                  <p className="mt-2 text-slate-600">VentureBank Financial</p>
                </div>
                <div className="rounded-3xl bg-emerald-50 p-4">
                  <p className="font-semibold text-slate-900">Account number</p>
                  <p className="mt-2 font-mono text-xs text-slate-500">1234567890</p>
                </div>
                <div className="rounded-3xl bg-emerald-50 p-4">
                  <p className="font-semibold text-slate-900">Routing number</p>
                  <p className="mt-2 font-mono text-xs text-slate-500">987654321</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={openInstructions} className="space-y-4">
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
            <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5 shadow-sm">
              <p className="font-semibold text-emerald-900">{success.title}</p>
              <p className="mt-2 text-slate-700">{success.message}</p>
              <p className="mt-3 text-xs text-slate-500">Reference: {success.reference}</p>
            </div>
          )}
          <div className="flex items-center gap-2 rounded-lg border border-border bg-muted/50 px-3 py-2.5">
            <HiOutlineShieldCheck className="h-5 w-5 text-brand-600" />
            <p className="text-xs text-muted-foreground">Balance updates after VentureBank confirms and posts your deposit.</p>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={!amount || submitting}>
            Continue to deposit details
          </Button>
        </form>
      </div>

      {instructionOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-950/90 px-3 py-4 backdrop-blur-sm sm:px-4 sm:py-6">
          <div className="flex h-full max-h-screen w-full max-w-4xl flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-950 text-white shadow-2xl sm:max-h-[90vh]">
            <div className="flex flex-shrink-0 items-start justify-between border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
              <div className="min-w-0 flex-1 pr-4">
                <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Your deposit destination</p>
                <h3 className="mt-2 text-xl font-semibold sm:text-3xl">Send funds to VentureBank</h3>
              </div>
              <button
                type="button"
                onClick={() => setInstructionOpen(false)}
                className="ml-2 inline-flex flex-shrink-0 items-center rounded-full border border-white/10 bg-white/5 px-3 py-2 text-xs sm:px-4 sm:text-sm text-white transition hover:bg-white/10"
              >
                <HiOutlineXMark className="h-4 w-4" />
                <span className="ml-1 sm:ml-2">Close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 px-4 py-6 sm:space-y-6 sm:px-10 sm:py-8">
              <div className="rounded-[2rem] bg-slate-900/90 p-4 shadow-lg ring-1 ring-white/10 sm:p-6">
                <div className="flex flex-col gap-3 sm:gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-[0.18em] text-emerald-300">Amount</p>
                    <p className="mt-2 text-2xl font-semibold text-white sm:text-3xl">{formatCurrency(parseFloat(amount) || 0)}</p>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400">{METHODS.find((m) => m.value === method)?.label || "Deposit"}</p>
                  </div>
                  <div className="rounded-3xl bg-slate-800/90 p-3 text-xs sm:p-4 sm:text-sm text-slate-300 shadow-inner flex-shrink-0">
                    <p className="font-semibold text-emerald-200">Destination account</p>
                    <p className="mt-2">{selectedAccount?.name || "Your selected account"}</p>
                    <p className="mt-1 text-xs text-slate-400">This will be credited once your deposit is confirmed.</p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
                <div className="rounded-[1.75rem] border border-emerald-500/20 bg-slate-900/90 p-4 shadow-sm sm:p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Crypto wallet</p>
                  <div className="mt-4 space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-300">
                    <div className="rounded-3xl bg-slate-950/70 p-3 sm:p-4">
                      <p className="font-semibold text-white">Bitcoin (BTC)</p>
                      <p className="mt-2 font-mono text-xs text-slate-400 break-all">1Ventur3BankCryptoWalletXYZ12345</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/70 p-3 sm:p-4">
                      <p className="font-semibold text-white">Ethereum (ETH)</p>
                      <p className="mt-2 font-mono text-xs text-slate-400 break-all">0xVentur3BankCryptoWalletABC67890</p>
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.75rem] border border-emerald-500/20 bg-slate-900/90 p-4 shadow-sm sm:p-6">
                  <p className="text-xs uppercase tracking-[0.2em] text-emerald-300">Bank deposit</p>
                  <div className="mt-4 space-y-3 sm:space-y-4 text-xs sm:text-sm text-slate-300">
                    <div className="rounded-3xl bg-slate-950/70 p-3 sm:p-4">
                      <p className="font-semibold text-white">Bank</p>
                      <p className="mt-2 text-slate-400">VentureBank Financial</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/70 p-3 sm:p-4">
                      <p className="font-semibold text-white">Account number</p>
                      <p className="mt-2 font-mono text-xs text-slate-400">1234567890</p>
                    </div>
                    <div className="rounded-3xl bg-slate-950/70 p-3 sm:p-4">
                      <p className="font-semibold text-white">Routing number</p>
                      <p className="mt-2 font-mono text-xs text-slate-400">987654321</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-white/10 bg-slate-900/90 p-4 text-xs sm:text-sm sm:p-6 text-slate-300 shadow-inner">
                <p className="text-emerald-200">Next step</p>
                <p className="mt-3 leading-7">
                  Copy the details above and send your deposit. Then continue to confirm the request so we can review and update your balance.
                </p>
              </div>
            </div>

            <div className="flex-shrink-0 border-t border-white/10 px-4 py-3 sm:px-6 sm:py-4">
              <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-slate-300 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-white">Continue when ready</p>
                  <p className="hidden sm:block">One more secure step ensures your deposit request is logged and reviewed by VentureBank.</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full order-2 sm:order-1 sm:w-auto"
                  onClick={() => setInstructionOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  className="w-full order-1 sm:order-2 sm:w-auto"
                  onClick={() => {
                    setInstructionOpen(false);
                    setModalOpen(true);
                  }}
                >
                  Continue
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      <TransactionSecurityModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={submitDepositRequest}
        title="Confirm deposit request"
        summary={summary}
        confirmLabel="Submit deposit"
        loading={submitting}
      />
    </>
  );
}
