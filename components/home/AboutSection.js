"use client";

import { motion } from "framer-motion";
import { aboutFeatures } from "@/lib/mock/homeData";
import { images } from "@/lib/images";
import { MediaImage } from "@/components/ui/MediaImage";
import { SectionHeader } from "./SectionHeader";
import { staggerContainer, staggerItem, viewportOnce } from "./motion";

export function AboutSection() {
  return (
    <section id="about" className="scroll-mt-24 bg-white py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center lg:gap-24">
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
            className="relative overflow-hidden rounded-3xl shadow-2xl"
          >
            <MediaImage
              src={images.about.src}
              alt={images.about.alt}
              className="aspect-[4/5] lg:aspect-[3/4]"
              sizes="(max-width: 1024px) 100vw, 50vw"
              overlay
              overlayClassName="from-ocean-950/30 via-transparent to-transparent"
            />
          </motion.div>

          <div>
            <SectionHeader
              eyebrow="Member-Focused Banking"
              title="Building Strength Together"
              description="VentureBank is a full-service financial institution built on supporting our members at every step of their financial journey — with personalized service and competitive rates."
              align="left"
            />

            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={viewportOnce}
              className="space-y-5"
            >
              {aboutFeatures.map((feature) => (
                <motion.div
                  key={feature.title}
                  variants={staggerItem}
                  whileHover={{ x: 6 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-2xl border border-slate-100 bg-slate-50/80 p-7 transition-shadow hover:shadow-md"
                >
                  <h3 className="font-serif text-lg font-semibold text-ocean-950">
                    {feature.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
