"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineBars3, HiOutlineXMark } from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { mainNav, authLinks, isNavActive } from "@/config/navigation";
import { siteConfig } from "@/config/site";
import { ThemeToggleNav } from "./ThemeToggleNav";
import { TranslateWidget } from "./TranslateWidget";

const navItemMotion = {
  initial: { opacity: 0, y: -4 },
  animate: { opacity: 1, y: 0 },
};

export function MarketingNavbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "sticky top-0 z-40 border-b border-border bg-card transition-shadow duration-300",
        scrolled ? "shadow-md backdrop-blur-md bg-card/95" : "shadow-sm"
      )}
    >
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-2 px-4 sm:h-[76px] sm:px-6 lg:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 2 }}
            className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-800 shadow-md sm:h-11 sm:w-11"
          >
            <span className="text-base font-bold text-white">V</span>
          </motion.div>
          <span className="font-serif text-lg font-semibold tracking-tight text-foreground transition-colors group-hover:text-brand-600 sm:text-xl">
            {siteConfig.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main">
          {mainNav.map((item, i) => {
            const active = isNavActive(pathname, item.href);
            return (
              <motion.div key={item.href} {...navItemMotion} transition={{ delay: i * 0.04 }}>
                <Link
                  href={item.href}
                  className={cn(
                    "relative whitespace-nowrap rounded-lg px-3 py-2 text-[13px] font-medium transition-colors xl:text-[14px]",
                    active
                      ? "text-brand-700 dark:text-brand-300"
                      : "text-muted-foreground hover:bg-muted hover:text-brand-700"
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-3 right-3 h-0.5 rounded-full bg-blue-600"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </nav>

        <div className="hidden shrink-0 items-center gap-2 md:flex lg:gap-3">
          <TranslateWidget compact />
          <ThemeToggleNav />
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link
              href={authLinks.login.href}
              className="whitespace-nowrap rounded-lg px-3 py-2.5 text-[14px] font-semibold text-blue-800 transition-colors hover:bg-blue-50 dark:text-blue-300 dark:hover:bg-slate-800"
            >
              {authLinks.login.label}
            </Link>
          </motion.div>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href={authLinks.register.href}
              className="whitespace-nowrap rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2.5 text-[14px] font-semibold text-white shadow-md shadow-blue-600/25 transition-shadow hover:shadow-lg hover:shadow-blue-600/30"
            >
              {authLinks.register.label}
            </Link>
          </motion.div>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <TranslateWidget compact />
          <ThemeToggleNav />
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-800 dark:border-slate-600 dark:text-slate-200"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <HiOutlineXMark className="h-6 w-6" /> : <HiOutlineBars3 className="h-6 w-6" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900 lg:hidden"
          >
            <nav className="max-h-[70vh] overflow-y-auto px-4 py-4" aria-label="Mobile">
              {mainNav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-4 py-3.5 text-[15px] font-medium",
                      isNavActive(pathname, item.href)
                        ? "bg-blue-50 text-blue-800 dark:bg-blue-950/50"
                        : "text-slate-800 hover:bg-slate-50 dark:text-slate-200"
                    )}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <div className="mt-4 space-y-2 border-t border-slate-100 pt-4 dark:border-slate-700">
                <Link
                  href={authLinks.login.href}
                  className="block rounded-lg border border-blue-200 py-3.5 text-center text-[15px] font-semibold text-blue-800 dark:border-blue-800"
                >
                  {authLinks.login.label}
                </Link>
                <Link
                  href={authLinks.register.href}
                  className="block rounded-lg bg-blue-600 py-3.5 text-center text-[15px] font-semibold text-white"
                >
                  {authLinks.register.label}
                </Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
