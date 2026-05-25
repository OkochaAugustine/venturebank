"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav, authLinks, isNavActive } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { ThemeToggle } from "./ThemeToggle";
import { TranslateWidget } from "./TranslateWidget";

export function AuthHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-border bg-card/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-700">
            <span className="font-bold text-white">V</span>
          </div>
          <span className="font-serif text-lg font-semibold text-foreground">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-brand-700 dark:hover:text-brand-300",
                isNavActive(pathname, item.href) && "text-brand-700 dark:text-brand-300"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <TranslateWidget compact />
          <ThemeToggle compact />
          <Link
            href={authLinks.login.href}
            className={cn(
              "hidden px-3 py-2 text-sm font-semibold sm:inline",
              pathname === authLinks.login.href
                ? "text-brand-700 dark:text-brand-300"
                : "text-muted-foreground hover:text-brand-700"
            )}
          >
            Login
          </Link>
          <Link
            href={authLinks.register.href}
            className="rounded-lg bg-brand-700 px-3 py-2 text-sm font-semibold text-white hover:bg-brand-800 sm:px-4"
          >
            Open Account
          </Link>
        </div>
      </div>
    </header>
  );
}
