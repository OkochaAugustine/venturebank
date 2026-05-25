"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageHero";
import { ContentSection } from "@/components/layout/ContentSection";
import { BankingShowcase } from "@/components/showcase/BankingShowcase";
import { siteConfig } from "@/config/site";
import { viewportOnce } from "@/components/home/motion";

export function OceanStylePage({ hero, sections = [], features = [], cta }) {
  return (
    <>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        image={hero.image}
      />

      {sections.map((section) => (
        <ContentSection
          key={section.title}
          eyebrow="VentureBank"
          title={section.title}
          description={section.body}
          align="left"
          className="max-w-4xl"
        />
      ))}

      {features.length > 0 && (
        <BankingShowcase
          features={features}
          title="How Can We Help You Today?"
          subtitle="Our Services"
        />
      )}

      <section className="relative overflow-hidden bg-ocean-800 py-16 text-center sm:py-20">
        <motion.div
          className="pointer-events-none absolute inset-0 bg-gradient-to-r from-brand-600/20 via-transparent to-luxury-gold/10"
          animate={{ opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <div className="relative mx-auto max-w-3xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="font-serif text-3xl font-semibold text-white sm:text-4xl"
          >
            {cta?.title || "Ready to get started?"}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={viewportOnce}
            className="mt-4 text-lg text-ocean-100"
          >
            {cta?.description}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            className="mt-10 flex flex-col justify-center gap-4 sm:flex-row"
          >
            <Link
              href={siteConfig.links.register}
              className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-sm font-semibold text-ocean-900 shadow-lg hover:bg-ocean-50"
            >
              Open Account Today
            </Link>
            <Link
              href={siteConfig.links.login}
              className="inline-flex items-center justify-center rounded-lg border-2 border-white/60 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
            >
              Login to Banking
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
