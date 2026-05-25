"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { SectionHeader } from "./SectionHeader";
import { viewportOnce } from "./motion";

/** Compact CTA band — full showcase is BankingShowcase on homepage */
export function ServicesSection() {
  return (
    <section className="relative overflow-hidden bg-ocean-800 py-14 sm:py-16">
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-brand-600/20 via-transparent to-luxury-gold/10"
        animate={{ opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <div className="relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="VentureBank"
          title="Everything you need in one place"
          description="Accounts, lending, investments, and retirement — unified in a single member platform."
          light
        />
        <Link
          href="/services"
          className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-ocean-900 shadow-lg hover:bg-ocean-50"
        >
          View all banking services
        </Link>
      </div>
    </section>
  );
}
