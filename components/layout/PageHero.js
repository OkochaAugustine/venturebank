"use client";

import { motion } from "framer-motion";
import { MediaImage } from "@/components/ui/MediaImage";
import { staggerContainer, staggerItem } from "@/components/home/motion";

export function PageHero({ title, subtitle, description, image }) {
  return (
    <section className="relative bg-ocean-950">
      <div className="relative min-h-[320px] sm:min-h-[380px]">
        <MediaImage
          src={image.src}
          alt={image.alt}
          priority
          overlay
          overlayClassName="from-ocean-950/92 via-ocean-950/70 to-ocean-950/50"
          className="absolute inset-0 min-h-full"
          sizes="100vw"
          zoomOnHover={false}
        />
        <div className="relative z-10 mx-auto flex min-h-[320px] max-w-7xl flex-col justify-center px-4 py-16 sm:min-h-[380px] sm:px-6 sm:py-20 lg:px-8">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            {subtitle && (
              <motion.p
                variants={staggerItem}
                className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean-300"
              >
                {subtitle}
              </motion.p>
            )}
            <motion.h1
              variants={staggerItem}
              className="mt-4 font-serif text-4xl font-semibold tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {title}
            </motion.h1>
            {description && (
              <motion.p
                variants={staggerItem}
                className="mt-5 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg"
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
