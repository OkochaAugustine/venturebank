"use client";

import { motion } from "framer-motion";
import { trustStats, infoCards } from "@/lib/mock/homeData";
import { images } from "@/lib/images";
import { MediaImage } from "@/components/ui/MediaImage";
import { staggerContainer, staggerItem, viewportOnce } from "./motion";

export function TrustStats() {
  return (
    <section className="section-light relative">
      <div className="relative h-48 overflow-hidden sm:h-56 lg:h-64">
        <MediaImage
          src={images.trustBanner.src}
          alt={images.trustBanner.alt}
          overlay
          overlayClassName="bg-ocean-950/70"
          zoomOnHover={false}
          sizes="100vw"
          className="h-full w-full"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <p className="max-w-2xl px-6 text-center font-serif text-xl text-white/95 sm:text-2xl">
            Trusted by members worldwide with institutional-grade security
          </p>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid w-full grid-cols-2 gap-4 py-10 sm:gap-8 sm:py-14 lg:gap-16 lg:py-20"
        >
          {trustStats.map((stat) => (
            <motion.div
              key={stat.label}
              variants={staggerItem}
              className="text-center"
            >
              <p className="font-serif text-4xl font-semibold text-ocean-800 sm:text-5xl lg:text-6xl">
                {stat.value}
              </p>
              <p className="mt-3 text-sm font-medium uppercase tracking-widest text-slate-500">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid w-full grid-cols-1 gap-4 border-t border-border pb-12 sm:grid-cols-3 sm:gap-5 sm:pb-20 lg:pb-24"
        >
          {infoCards.map((card) => (
            <motion.div
              key={card.id}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.3 }}
              className="surface-card w-full p-6 text-center transition-shadow hover:shadow-lg sm:p-8"
            >
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-ocean-600">
                {card.title}
              </p>
              <p className="mt-4 font-serif text-xl font-semibold text-ocean-950 sm:text-2xl">
                {card.value}
              </p>
              <p className="mt-3 text-sm text-slate-500">{card.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
