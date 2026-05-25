"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineFingerPrint } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthFormLayout } from "./AuthFormLayout";

export function PinVerifyForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [recoverOpen, setRecoverOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [newPin, setNewPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [recoverMsg, setRecoverMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/pin/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Incorrect PIN");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormLayout
      title="Enter your PIN"
      subtitle="Verify your identity to access online banking"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Banking PIN"
          type="password"
          inputMode="numeric"
          maxLength={6}
          autoComplete="off"
          required
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="••••"
        />

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          <HiOutlineFingerPrint className="mr-2 h-5 w-5" />
          {loading ? "Verifying..." : "Unlock dashboard"}
        </Button>

        <button
          type="button"
          className="w-full text-center text-sm font-semibold text-ocean-700 hover:underline"
          onClick={() => setRecoverOpen((o) => !o)}
        >
          {recoverOpen ? "Hide PIN recovery" : "Forgot PIN? Recover with password"}
        </button>
      </form>

      {recoverOpen && (
        <form
          className="mt-6 space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4"
          onSubmit={async (e) => {
            e.preventDefault();
            setError("");
            setRecoverMsg("");
            setLoading(true);
            try {
              const res = await fetch("/api/auth/pin/recover", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ password, newPin, confirmPin }),
              });
              const data = await res.json();
              if (!res.ok) {
                setError(data.error || "Recovery failed");
                return;
              }
              setRecoverMsg(data.message || "PIN updated");
              router.push("/dashboard");
              router.refresh();
            } catch {
              setError("Network error");
            } finally {
              setLoading(false);
            }
          }}
        >
          <Input label="Account password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          <Input label="New PIN" type="password" inputMode="numeric" maxLength={6} required value={newPin} onChange={(e) => setNewPin(e.target.value.replace(/\D/g, "").slice(0, 6))} />
          <Input label="Confirm PIN" type="password" inputMode="numeric" maxLength={6} required value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))} />
          {recoverMsg && <p className="text-sm text-emerald-600">{recoverMsg}</p>}
          <Button type="submit" variant="outline" className="w-full" disabled={loading}>
            Reset PIN
          </Button>
        </form>
      )}
    </AuthFormLayout>
  );
}
