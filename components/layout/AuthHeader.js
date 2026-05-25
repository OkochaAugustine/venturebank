"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { mainNav, authLinks, isNavActive } from "@/config/navigation";
import { siteConfig } from "@/config/site";

export function AuthHeader() {
  const pathname = usePathname();

  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ocean-700">
            <span className="font-bold text-white">V</span>
          </div>
          <span className="font-serif text-lg font-semibold text-ocean-950">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {mainNav.slice(0, 4).map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "px-3 py-2 text-sm font-medium text-slate-600 hover:text-ocean-800",
                isNavActive(pathname, item.href) && "text-ocean-800"
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href={authLinks.login.href}
            className={cn(
              "px-3 py-2 text-sm font-semibold",
              pathname === authLinks.login.href
                ? "text-ocean-800"
                : "text-slate-600 hover:text-ocean-800"
            )}
          >
            Login
          </Link>
          <Link
            href={authLinks.register.href}
            className="rounded-lg bg-ocean-700 px-4 py-2 text-sm font-semibold text-white hover:bg-ocean-800"
          >
            Open Account
          </Link>
        </div>
      </div>
    </header>
  );
}
