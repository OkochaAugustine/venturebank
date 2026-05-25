"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PageHero } from "@/components/layout/PageHero";
import { ContentSection } from "@/components/layout/ContentSection";
import { MediaImage } from "@/components/ui/MediaImage";
import { siteConfig } from "@/config/site";
import { staggerContainer, staggerItem, viewportOnce } from "@/components/home/motion";

export function MarketingInnerPage({ hero, features = [], cta }) {
  return (
    <>
      <PageHero
        title={hero.title}
        subtitle={hero.subtitle}
        description={hero.description}
        image={hero.image}
      />

      {features.length > 0 && (
        <ContentSection
          eyebrow="What We Offer"
          title="Solutions built for you"
          description="Member-focused products with transparent pricing and dedicated support."
        >
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="grid gap-8 md:grid-cols-3"
          >
            {features.map((f) => (
              <motion.div
                key={f.title}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                className="rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-lg"
              >
                <h3 className="font-serif text-xl font-semibold text-ocean-950">
                  {f.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </ContentSection>
      )}

      {hero.image && features.length > 0 && (
        <section className="bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="overflow-hidden rounded-3xl shadow-xl">
              <MediaImage
                src={hero.image.src}
                alt={hero.image.alt}
                className="aspect-[21/9] min-h-[240px]"
                sizes="100vw"
              />
            </div>
          </div>
        </section>
      )}

      <ContentSection bg="ocean" className="text-center">
        <h2 className="font-serif text-3xl font-semibold text-white sm:text-4xl">
          {cta?.title || "Ready to get started?"}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-ocean-100">
          {cta?.description ||
            "Open your account online in minutes or speak with a member specialist today."}
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href={siteConfig.links.register}
            className="inline-flex rounded-full bg-white px-8 py-3.5 text-sm font-semibold text-ocean-900 shadow-lg hover:bg-ocean-50"
          >
            Open Account Today
          </Link>
          <Link
            href={siteConfig.links.login}
            className="inline-flex rounded-full border border-white/40 px-8 py-3.5 text-sm font-semibold text-white hover:bg-white/10"
          >
            Login to Banking
          </Link>
        </div>
      </ContentSection>
    </>
  );
}
