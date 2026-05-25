"use client";

import { motion } from "framer-motion";
import { rates } from "@/lib/mock/homeData";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";
import { MediaImage } from "@/components/ui/MediaImage";
import { SectionHeader } from "./SectionHeader";
import { staggerContainer, staggerItem, viewportOnce } from "./motion";

export function RatesSection() {
  return (
    <section id="rates" className="scroll-mt-24 bg-slate-50 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-16 overflow-hidden rounded-3xl shadow-xl">
          <MediaImage
            src={images.rates.src}
            alt={images.rates.alt}
            className="aspect-[21/7] min-h-[200px] sm:min-h-[260px]"
            overlay
            overlayClassName="from-ocean-950/90 via-ocean-950/50 to-transparent"
            sizes="(max-width: 1280px) 100vw, 1280px"
            zoomOnHover
          />
          <div className="pointer-events-none absolute inset-0 z-10 flex items-end p-8 sm:p-12">
            <p className="max-w-lg font-serif text-2xl text-white sm:text-3xl">
              Rates designed to help your wealth compound with confidence
            </p>
          </div>
        </div>

        <SectionHeader
          eyebrow="VentureBank Rates"
          title="VentureBank Member Care"
          description="Discover competitive rates designed to help your money grow faster"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {rates.map((rate) => (
            <motion.article
              key={rate.id}
              variants={staggerItem}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-white p-8 shadow-sm transition-shadow duration-300 hover:shadow-xl",
                rate.featured
                  ? "border-ocean-300 ring-1 ring-ocean-100"
                  : "border-slate-200/80"
              )}
            >
              {rate.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-ocean-700 px-4 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
                  Featured
                </span>
              )}
              <p className="font-serif text-5xl font-semibold text-ocean-700">
                {rate.rate}
              </p>
              <p className="mt-1 text-sm font-medium text-slate-400">
                {rate.type}
              </p>
              <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.15em] text-ocean-600">
                {rate.label}
              </p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                {rate.title}
              </p>
              <span className="mt-6 inline-block w-fit rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {rate.category}
              </span>
            </motion.article>
          ))}
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          className="mt-12 text-center text-xs leading-relaxed text-slate-500"
        >
          *Annual Percentage Yield. Rates subject to change. Terms and conditions
          apply.
        </motion.p>
      </div>
    </section>
  );
}
