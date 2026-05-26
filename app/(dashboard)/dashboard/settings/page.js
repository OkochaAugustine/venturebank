"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { HiOutlineMoon, HiOutlineSun, HiOutlineComputerDesktop } from "react-icons/hi2";
import { PinResetSection } from "@/components/dashboard/PinResetSection";
import { ProfileSettingsForm } from "@/components/dashboard/ProfileSettingsForm";
import { cn } from "@/lib/utils";

const themeOptions = [
  { value: "light", label: "Light", icon: HiOutlineSun },
  { value: "dark", label: "Dark", icon: HiOutlineMoon },
  { value: "system", label: "System", icon: HiOutlineComputerDesktop },
];

export default function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <div className="dashboard-page w-full max-w-3xl space-y-6">
      <div className="surface-card p-5 sm:p-6">
        <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Appearance, PIN, and security preferences
        </p>
      </div>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="font-semibold text-foreground">Appearance</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Theme is saved automatically and applies across all pages
        </p>
        {mounted && (
          <div className="mt-4 grid grid-cols-3 gap-3">
            {themeOptions.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all",
                  theme === value
                    ? "border-brand-500 bg-brand-500/10 text-brand-700 dark:text-brand-300"
                    : "border-border bg-muted/50 text-muted-foreground hover:border-brand-500/40"
                )}
              >
                <Icon className="h-6 w-6" />
                <span className="text-sm font-semibold">{label}</span>
              </button>
            ))}
          </div>
        )}
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="font-semibold text-foreground">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Updates trigger email and in-app security alerts
        </p>
        <ProfileSettingsForm />
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="font-semibold text-foreground">PIN recovery & reset</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Change your banking PIN using your account password and current PIN.
        </p>
        <PinResetSection />
      </section>

      <section className="surface-card p-5 sm:p-6">
        <h2 className="font-semibold text-foreground">Session security</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Sessions use HTTP-only cookies and JWT. PIN verification is required on every login.
        </p>
      </section>
    </div>
  );
}
