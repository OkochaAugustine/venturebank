"use client";

import { motion } from "framer-motion";
import {
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
} from "react-icons/hi2";
import { contactBlocks } from "@/lib/mock/homeData";
import { images } from "@/lib/images";
import { MediaImage } from "@/components/ui/MediaImage";
import { staggerContainer, staggerItem, viewportOnce } from "./motion";

const contactIcons = [
  HiOutlineClock,
  HiOutlinePhone,
  HiOutlineEnvelope,
  HiOutlineMapPin,
];

export function ContactSection() {
  return (
    <section id="contact" className="scroll-mt-24 bg-white pb-20 sm:pb-24 lg:pb-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative mb-16 overflow-hidden rounded-3xl shadow-xl">
          <MediaImage
            src={images.contact.src}
            alt={images.contact.alt}
            className="aspect-[21/8] min-h-[220px]"
            overlay
            overlayClassName="from-ocean-950/85 via-ocean-950/40 to-ocean-950/20"
            sizes="100vw"
            zoomOnHover
          />
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center px-6 py-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ocean-200">
              Get in Touch
            </p>
            <h2 className="mt-4 font-serif text-3xl font-semibold text-white sm:text-4xl">
              We&apos;re Here for You
            </h2>
            <p className="mt-4 max-w-xl text-base text-ocean-100/90 sm:text-lg">
              Visit a branch, call our team, or reach out online — wherever you
              are in the world.
            </p>
          </div>
        </div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contactBlocks.map((block, i) => {
            const Icon = contactIcons[i];
            return (
              <motion.div
                key={block.title}
                variants={staggerItem}
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="rounded-2xl border border-slate-100 bg-white p-8 text-center shadow-sm transition-shadow hover:shadow-lg"
              >
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-ocean-50 text-ocean-700">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-serif text-lg font-semibold text-ocean-950">
                  {block.title}
                </h3>
                <div className="mt-4 space-y-1.5">
                  {block.lines.map((line) => (
                    <p key={line} className="text-sm text-slate-600">
                      {line}
                    </p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
