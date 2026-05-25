"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { testimonials } from "@/lib/mock/homeData";
import { images } from "@/lib/images";
import { SectionHeader } from "./SectionHeader";
import { staggerContainer, staggerItem, viewportOnce } from "./motion";

export function TestimonialsSection() {
  return (
    <section className="bg-slate-50 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Hear From Our Customers"
          description="Real stories from members who trust VentureBank with their financial future"
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="grid gap-8 md:grid-cols-3"
        >
          {testimonials.map((item, i) => (
            <motion.blockquote
              key={item.name}
              variants={staggerItem}
              whileHover={{ y: -8 }}
              transition={{ duration: 0.35 }}
              className="flex flex-col rounded-2xl border border-slate-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-xl"
            >
              <HiOutlineChatBubbleLeftRight className="h-8 w-8 text-ocean-400/80" />
              <p className="mt-6 flex-1 font-serif text-lg leading-relaxed text-slate-700">
                &ldquo;{item.quote}&rdquo;
              </p>
              <footer className="mt-8 flex items-center gap-4 border-t border-slate-100 pt-8">
                <div className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-ocean-100">
                  <Image
                    src={images.testimonials[i].src}
                    alt={images.testimonials[i].alt}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
                <div>
                  <p className="font-semibold text-ocean-950">{item.name}</p>
                  <p className="text-sm text-slate-500">{item.role}</p>
                </div>
              </footer>
            </motion.blockquote>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
