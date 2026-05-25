"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HiOutlineShieldCheck, HiOutlineLockClosed } from "react-icons/hi2";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthFormLayout } from "./AuthFormLayout";

export function PinSetupForm() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/pin/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ pin, confirmPin }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not create PIN");
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
      title="Create your banking PIN"
      subtitle="Required security step — protects access to your accounts"
    >
      <div className="mb-6 flex items-center gap-4 rounded-xl border border-ocean-100 bg-ocean-50/60 p-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ocean-600 text-white">
          <HiOutlineShieldCheck className="h-6 w-6" />
        </div>
        <p className="text-sm text-slate-600">
          Choose a 4–6 digit PIN. You will enter it every time you sign in, before your dashboard loads.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="New PIN"
          type="password"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={6}
          autoComplete="off"
          required
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="••••"
        />
        <Input
          label="Confirm PIN"
          type="password"
          inputMode="numeric"
          maxLength={6}
          required
          value={confirmPin}
          onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
          placeholder="••••"
        />

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button type="submit" variant="primary" size="lg" className="w-full" disabled={loading}>
          <HiOutlineLockClosed className="mr-2 h-5 w-5" />
          {loading ? "Securing account..." : "Activate PIN & continue"}
        </Button>
      </form>
    </AuthFormLayout>
  );
}
