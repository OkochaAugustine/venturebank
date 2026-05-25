"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  HiOutlineCheckCircle,
  HiOutlineGift,
  HiOutlineShieldCheck,
} from "react-icons/hi2";
import { promoContent } from "@/lib/mock/homeData";
import { images } from "@/lib/images";
import { MediaImage } from "@/components/ui/MediaImage";
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from "./motion";

const promoHighlights = [
  "Direct deposit within 60 days required",
  "Available for new checking members only",
  "Bonus credited within 14 business days",
];

export function PromoSection() {
  return (
    <section className="overflow-hidden bg-ocean-950 py-20 sm:py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            className="order-2 lg:order-1"
          >
            <motion.span
              variants={staggerItem}
              className="inline-block rounded-full border border-ocean-400/40 bg-ocean-800/50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-ocean-200"
            >
              {promoContent.badge}
            </motion.span>
            <motion.h2
              variants={fadeInUp}
              className="mt-8 font-serif text-3xl font-semibold leading-tight text-white sm:text-4xl lg:text-[2.75rem]"
            >
              {promoContent.title}
            </motion.h2>
            <motion.p
              variants={staggerItem}
              className="mt-6 text-base leading-relaxed text-ocean-100/90 sm:text-lg"
            >
              {promoContent.subtitle}
            </motion.p>
            <motion.ul variants={staggerContainer} className="mt-10 space-y-4">
              {promoContent.bullets.map((bullet) => (
                <motion.li
                  key={bullet}
                  variants={staggerItem}
                  className="flex items-center gap-3 text-ocean-50"
                >
                  <HiOutlineCheckCircle className="h-6 w-6 shrink-0 text-ocean-400" />
                  <span>{bullet}</span>
                </motion.li>
              ))}
            </motion.ul>
            <motion.div variants={staggerItem}>
              <Link
                href={promoContent.cta.href}
                className="mt-12 inline-flex rounded-full bg-white px-10 py-4 text-sm font-semibold tracking-wide text-ocean-900 shadow-xl transition-all duration-300 hover:bg-ocean-50 hover:shadow-2xl"
              >
                {promoContent.cta.label}
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 lg:order-2"
          >
            <div className="relative overflow-hidden rounded-3xl shadow-2xl">
              <MediaImage
                src={images.promo.src}
                alt={images.promo.alt}
                className="aspect-[4/5] min-h-[360px] sm:aspect-[5/4] sm:min-h-[400px]"
                sizes="(max-width: 1024px) 100vw, 50vw"
                overlay
                overlayClassName="from-ocean-950/50 via-ocean-950/20 to-transparent"
              />

              <div className="absolute inset-0 z-10 flex flex-col justify-between p-6 sm:p-8">
                <div className="flex items-start justify-between">
                  <div className="rounded-2xl bg-white/10 p-3 backdrop-blur-md">
                    <HiOutlineGift className="h-8 w-8 text-luxury-gold" />
                  </div>
                  <span className="rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                    Limited Offer
                  </span>
                </div>

                <div className="rounded-2xl border border-white/15 bg-ocean-950/75 p-6 backdrop-blur-xl sm:p-8">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean-300">
                    New Member Welcome Bonus
                  </p>
                  <p className="mt-2 font-serif text-5xl font-semibold text-white sm:text-6xl">
                    $200
                  </p>
                  <p className="mt-2 text-sm text-ocean-200">
                    Cash bonus when you open a VentureBank Checking account
                    and meet simple qualifying activities.*
                  </p>

                  <div className="relative mt-5 h-24 overflow-hidden rounded-xl">
                    <Image
                      src={images.promoCard.src}
                      alt={images.promoCard.alt}
                      fill
                      className="object-cover"
                      sizes="400px"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/80 to-transparent" />
                    <div className="relative flex h-full items-center px-4">
                      <p className="text-sm font-medium text-white">
                        Premium debit card · Mobile banking · Zero monthly fees
                      </p>
                    </div>
                  </div>

                  <ul className="mt-5 space-y-2 border-t border-white/10 pt-5">
                    {promoHighlights.map((line) => (
                      <li
                        key={line}
                        className="flex items-start gap-2 text-xs text-ocean-200"
                      >
                        <HiOutlineShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-ocean-400" />
                        {line}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/register"
                    className="mt-6 flex w-full items-center justify-center rounded-xl bg-white py-3.5 text-sm font-semibold text-ocean-900 transition-colors hover:bg-ocean-50"
                  >
                    Claim Your $200 Bonus
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <p className="mt-10 text-center text-xs text-ocean-400">
          *Terms apply. See account agreement for eligibility, timing, and tax
          reporting. Federally insured by NCUA.
        </p>
      </div>
    </section>
  );
}
