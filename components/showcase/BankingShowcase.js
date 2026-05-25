"use client";

import { motion } from "framer-motion";
import { BankingShowcaseCard } from "./BankingShowcaseCard";
import { ShowcaseAmbient } from "./ShowcaseAmbient";
import { viewportOnce } from "@/components/home/motion";

export function BankingShowcase({ features, title, subtitle }) {
  return (
    <section className="relative overflow-hidden bg-ocean-950 py-20 sm:py-28 lg:py-32">
      <ShowcaseAmbient />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="mb-14 text-center lg:mb-16"
        >
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-ocean-300">
            {subtitle || "VentureBank Solutions"}
          </p>
          <h2 className="mt-4 font-serif text-3xl font-semibold text-white sm:text-4xl lg:text-5xl">
            {title || "Products & Services"}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base text-ocean-200/90 sm:text-lg">
            Institutional-grade banking designed for clarity, growth, and
            long-term member success.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {features.map((feature, index) => (
            <BankingShowcaseCard
              key={feature.title}
              feature={feature}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
