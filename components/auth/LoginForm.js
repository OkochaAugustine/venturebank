"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Input, Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthFormLayout } from "./AuthFormLayout";
import { siteConfig } from "@/config/site";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || siteConfig.links.dashboard;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      const dest =
        data.user?.role === "admin"
          ? "/admin"
          : callbackUrl.startsWith("/admin")
            ? "/dashboard"
            : callbackUrl;
      router.push(dest);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormLayout
      title="Login to Banking"
      subtitle="Secure access to your VentureBank accounts"
      footer={
        <>
          New to VentureBank?{" "}
          <Link
            href={siteConfig.links.register}
            className="font-semibold text-ocean-700 hover:underline"
          >
            Open an account today
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email address"
          type="email"
          name="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
        />
        <div>
          <Input
            label="Password"
            type="password"
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
          />
          <div className="mt-2 text-right">
            <Link
              href="/contact"
              className="text-sm font-medium text-ocean-700 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
        </div>

        <Checkbox
          name="remember"
          checked={remember}
          onChange={(e) => setRemember(e.target.checked)}
          label="Remember this device for 30 days"
        />

        {error && (
          <div
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full rounded-lg"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Sign In Securely"}
        </Button>

        <div className="rounded-lg border border-ocean-100 bg-ocean-50/50 px-4 py-3 text-center text-sm text-slate-600">
          Routing # <strong className="text-ocean-900">251480576</strong> ·
          Support <strong className="text-ocean-900">1-800-VENTURE</strong>
        </div>
      </form>
    </AuthFormLayout>
  );
}
