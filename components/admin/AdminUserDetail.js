"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import { formatCurrency, formatDate } from "@/lib/utils";
import { TRANSACTION_TYPES } from "@/lib/constants";

export function AdminUserDetail({ userId }) {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [accountId, setAccountId] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState(TRANSACTION_TYPES.DEPOSIT);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/admin/users/${userId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.accounts?.[0]) setAccountId(d.accounts[0].id);
      })
      .finally(() => setLoading(false));
  }, [userId]);

  function load() {
    setLoading(true);
    fetch(`/api/admin/users/${userId}`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        setData(d);
        if (d.accounts?.[0]) setAccountId(d.accounts[0].id);
      })
      .finally(() => setLoading(false));
  }

  async function postTransaction(e) {
    e.preventDefault();
    setMsg("");
    const res = await fetch(`/api/admin/users/${userId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ accountId, amount: parseFloat(amount), description, type }),
    });
    const json = await res.json();
    if (!res.ok) {
      setMsg(json.error || "Failed");
      return;
    }
    setMsg(`Success — new balance ${formatCurrency(json.account.balance)}`);
    setAmount("");
    load();
  }

  if (loading) return <div className="h-64 animate-pulse rounded-xl bg-slate-200" />;
  if (!data?.user) return <p>User not found</p>;

  const { user, accounts, transactions } = data;

  return (
    <div className="space-y-8">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold text-ocean-950">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-sm text-slate-500">{user.email}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {accounts.map((a) => (
          <div key={a.id} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="font-medium text-slate-800">{a.name}</p>
            <p className="text-2xl font-bold text-ocean-950">{formatCurrency(a.balance)}</p>
            <p className="font-mono text-xs text-slate-400">{a.accountNumber}</p>
          </div>
        ))}
      </div>

      <form onSubmit={postTransaction} className="max-w-md space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="font-semibold text-ocean-950">Adjust balance</h3>
        <Select label="Account" value={accountId} onChange={(e) => setAccountId(e.target.value)}>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </Select>
        <Select label="Type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value={TRANSACTION_TYPES.DEPOSIT}>Deposit</option>
          <option value={TRANSACTION_TYPES.WITHDRAWAL}>Withdrawal</option>
        </Select>
        <Input label="Amount" type="number" min="0.01" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <Input label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        {msg && <p className="text-sm text-emerald-700">{msg}</p>}
        <Button type="submit" variant="primary">Apply & update dashboard</Button>
      </form>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        <h3 className="border-b border-slate-100 px-4 py-3 font-semibold">Recent transactions</h3>
        {transactions.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">No transactions for this user.</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {transactions.slice(0, 20).map((t) => (
              <li key={t.id} className="flex justify-between px-4 py-3 text-sm">
                <span>{t.description}</span>
                <span className="font-semibold">{formatCurrency(Math.abs(t.amount))}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <Button variant="outline" onClick={() => router.push("/admin/users")}>
        Back to users
      </Button>
    </div>
  );
}
