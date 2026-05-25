"use client";

import { motion } from "framer-motion";
import { HiOutlineArrowTrendingUp, HiOutlineShieldCheck } from "react-icons/hi2";
import { formatCurrency } from "@/lib/utils";

export function HeroFloatingCards() {
  return (
    <div className="relative hidden h-full min-h-[420px] lg:block">
      <motion.div
        initial={{ opacity: 0, y: 40, x: 20 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="absolute right-0 top-8 w-[280px] rounded-2xl border border-white/20 bg-white/10 p-5 shadow-2xl backdrop-blur-xl"
      >
        <p className="text-xs font-medium uppercase tracking-widest text-ocean-200">
          Total Balance
        </p>
        <p className="mt-2 font-mono text-3xl font-bold text-white">
          {formatCurrency(24560.78)}
        </p>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-emerald-400">
          <HiOutlineArrowTrendingUp className="h-4 w-4" />
          +12.4% this month
        </p>
        <div className="mt-4 flex gap-1">
          {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
            <motion.div
              key={i}
              className="flex-1 rounded-sm bg-gradient-to-t from-brand-500/80 to-brand-300/60"
              initial={{ height: 0 }}
              animate={{ height: `${h}%` }}
              transition={{ delay: 0.8 + i * 0.06, duration: 0.5 }}
              style={{ maxHeight: 48 }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30, x: -20 }}
        animate={{ opacity: 1, y: [0, -12, 0], x: 0 }}
        transition={{
          opacity: { delay: 0.7, duration: 0.8 },
          y: { delay: 1.2, duration: 4, repeat: Infinity, ease: "easeInOut" },
          x: { delay: 0.7, duration: 0.8 },
        }}
        className="absolute bottom-16 left-0 w-[240px] rounded-2xl border border-white/15 bg-ocean-900/60 p-4 backdrop-blur-xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
            <HiOutlineShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Secured</p>
            <p className="text-xs text-ocean-200">256-bit encryption</p>
          </div>
        </div>
      </motion.div>

      <motion.div
        className="absolute right-12 top-1/2 h-32 w-32 rounded-full bg-brand-500/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 6, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-8 right-1/3 h-24 w-24 rounded-full bg-luxury-gold/15 blur-2xl"
        animate={{ scale: [1.1, 1, 1.1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity, delay: 1 }}
      />
    </div>
  );
}
