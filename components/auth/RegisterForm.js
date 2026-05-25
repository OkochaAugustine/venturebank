"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Input, Select, Checkbox } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AuthFormLayout } from "./AuthFormLayout";
import { siteConfig } from "@/config/site";

export function RegisterForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    accountType: "checking",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field) {
    return (e) => {
      const value =
        e.target.type === "checkbox" ? e.target.checked : e.target.value;
      setForm((f) => ({ ...f, [field]: value }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.agreeTerms) {
      setError("Please accept the Terms of Service to continue");
      return;
    }
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (form.password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      router.push(siteConfig.links.dashboard);
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthFormLayout
      title="Open Account Today"
      subtitle="Complete the form below to become a VentureBank member"
      footer={
        <>
          Already a member?{" "}
          <Link
            href={siteConfig.links.login}
            className="font-semibold text-ocean-700 hover:underline"
          >
            Login to Banking
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Legal first name"
            name="firstName"
            required
            autoComplete="given-name"
            value={form.firstName}
            onChange={update("firstName")}
            placeholder="Alexander"
          />
          <Input
            label="Legal last name"
            name="lastName"
            required
            autoComplete="family-name"
            value={form.lastName}
            onChange={update("lastName")}
            placeholder="Sterling"
          />
        </div>

        <Input
          label="Email address"
          type="email"
          name="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={update("email")}
          placeholder="you@email.com"
        />

        <Input
          label="Mobile phone"
          type="tel"
          name="phone"
          autoComplete="tel"
          value={form.phone}
          onChange={update("phone")}
          placeholder="(555) 000-0000"
        />

        <Select
          label="Account type"
          name="accountType"
          value={form.accountType}
          onChange={update("accountType")}
        >
          <option value="checking">Premium Checking</option>
          <option value="savings">High-Yield Savings</option>
          <option value="both">Checking + Savings bundle</option>
        </Select>

        <div className="grid gap-5 sm:grid-cols-2">
          <Input
            label="Create password"
            type="password"
            name="password"
            required
            autoComplete="new-password"
            value={form.password}
            onChange={update("password")}
            placeholder="Min. 8 characters"
          />
          <Input
            label="Confirm password"
            type="password"
            name="confirmPassword"
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            placeholder="Re-enter password"
          />
        </div>

        <Checkbox
          name="agreeTerms"
          checked={form.agreeTerms}
          onChange={update("agreeTerms")}
          label="I agree to the Terms of Service, Privacy Policy, and E-Sign Disclosure."
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
          {loading ? "Creating your account..." : "Create Account"}
        </Button>

        <p className="text-center text-xs leading-relaxed text-slate-500">
          Your information is encrypted with 256-bit SSL. We never share your
          data with third parties without consent.
        </p>
      </form>
    </AuthFormLayout>
  );
}
