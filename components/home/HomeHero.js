"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  HiOutlineShieldCheck,
  HiOutlineGlobeAlt,
  HiOutlineSparkles,
} from "react-icons/hi2";
import { heroContent } from "@/lib/mock/homeData";
import { images } from "@/lib/images";
import { AnimatedCounter } from "./AnimatedCounter";
import { HeroParticles } from "./HeroParticles";
import { fadeInUp, staggerContainer, staggerItem } from "./motion";

const heroStats = [
  { value: "50K+", label: "Members worldwide" },
  { value: "$2.5B+", label: "Assets under care" },
  { value: "99.9%", label: "Platform uptime" },
];

const trustPills = [
  { icon: HiOutlineShieldCheck, label: "FDIC Insured" },
  { icon: HiOutlineGlobeAlt, label: "Global Access" },
  { icon: HiOutlineSparkles, label: "Award-Winning Service" },
];

export function HomeHero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.2]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[88vh] overflow-hidden bg-ocean-950 lg:min-h-[90vh]"
    >
      <motion.div
        style={{ y: imageY, scale: imageScale }}
        className="absolute inset-0 origin-center"
      >
        <Image
          src={images.hero.src}
          alt={images.hero.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ocean-950/96 via-ocean-950/85 to-ocean-900/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/80 via-transparent to-ocean-900/30" />
        <motion.div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_40%,rgba(14,165,233,0.25),transparent_55%)]"
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 7, repeat: Infinity }}
        />
      </motion.div>

      <HeroParticles />

      <motion.div
        className="pointer-events-none absolute -left-40 top-1/4 h-[420px] w-[420px] rounded-full bg-brand-500/20 blur-[120px]"
        animate={{ scale: [1, 1.2, 1], x: [0, 30, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
      <motion.div
        className="pointer-events-none absolute right-0 top-1/3 h-80 w-80 rounded-full bg-luxury-gold/15 blur-[100px]"
        animate={{ rotate: 360 }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
      />

      {/* Floating fintech UI cards — visual storytelling (no balance widget) */}
      <motion.div
        className="pointer-events-none absolute right-[8%] top-[22%] z-[5] hidden w-52 rounded-2xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl lg:block"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-ocean-200">Global transfers</p>
        <p className="mt-2 font-serif text-2xl font-semibold text-white">200+</p>
        <p className="text-xs text-ocean-100">Countries · Real-time rails</p>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute right-[18%] bottom-[28%] z-[5] hidden w-48 rounded-2xl border border-emerald-400/30 bg-emerald-500/10 p-4 shadow-xl backdrop-blur-lg lg:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      >
        <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">Security</p>
        <p className="mt-1 text-sm font-semibold text-white">256-bit encryption</p>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/20">
          <motion.div
            className="h-full bg-emerald-400"
            animate={{ width: ["30%", "100%", "30%"] }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        </div>
      </motion.div>
      <motion.div
        className="pointer-events-none absolute left-[6%] bottom-[32%] z-[5] hidden w-44 rounded-xl border border-white/15 bg-gradient-to-br from-ocean-600/40 to-cyan-500/20 p-3 backdrop-blur-md md:block"
        animate={{ x: [0, 8, 0] }}
        transition={{ duration: 7, repeat: Infinity }}
      >
        <p className="text-xs font-medium text-white">VentureBank Private</p>
        <p className="text-[10px] text-ocean-100">Wealth · Business · Retirement</p>
      </motion.div>

      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-18 lg:px-8 lg:py-22"
      >
        <div className="grid items-center gap-14 lg:grid-cols-[1.15fr_0.85fr] lg:gap-16">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={staggerItem}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-ocean-100 backdrop-blur-md">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                International Private Banking
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="mt-8 font-serif text-4xl font-semibold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.25rem]"
            >
              <motion.span
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              >
                {heroContent.title}
              </motion.span>
              <motion.span
                className="mt-3 block bg-gradient-to-r from-white via-sky-100 to-luxury-gold bg-clip-text text-transparent"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.55, duration: 0.9 }}
              >
                {heroContent.subtitle}
              </motion.span>
            </motion.h1>

            <motion.p
              variants={staggerItem}
              className="mt-6 max-w-xl text-base leading-relaxed text-slate-300 sm:text-lg"
            >
              {heroContent.description}
            </motion.p>

            <motion.div
              variants={staggerItem}
              className="mt-10 flex flex-col gap-4 sm:flex-row"
            >
              <Link
                href={heroContent.primaryCta.href}
                className="inline-flex items-center justify-center rounded-full bg-white px-9 py-4 text-sm font-semibold text-ocean-900 shadow-xl transition-all hover:scale-[1.02] hover:shadow-2xl"
              >
                {heroContent.primaryCta.label}
              </Link>
              <Link
                href={heroContent.secondaryCta.href}
                className="inline-flex items-center justify-center rounded-full border border-white/35 bg-white/10 px-9 py-4 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/15"
              >
                {heroContent.secondaryCta.label}
              </Link>
            </motion.div>

            <motion.div
              variants={staggerItem}
              className="mt-12 grid grid-cols-3 gap-4 border-t border-white/10 pt-10 sm:gap-8"
            >
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <p className="font-serif text-2xl font-semibold text-white sm:text-3xl">
                    <AnimatedCounter value={stat.value} />
                  </p>
                  <p className="mt-1 text-xs text-ocean-200 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="relative hidden lg:block"
          >
            <div className="relative aspect-square max-w-md justify-self-end">
              <motion.div
                className="absolute inset-0 rounded-full border border-white/10"
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute inset-8 rounded-full border border-brand-400/30"
                animate={{ rotate: -360 }}
                transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-16 overflow-hidden rounded-3xl border border-white/15 shadow-2xl">
                <Image
                  src={images.trustBanner.src}
                  alt="Financial excellence"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ocean-950/90 via-ocean-950/20 to-transparent" />
              </div>
              <motion.div
                className="absolute -bottom-4 left-1/2 w-[90%] -translate-x-1/2 rounded-2xl border border-white/15 bg-ocean-950/80 p-5 backdrop-blur-xl"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.9 }}
              >
                <p className="text-center text-sm font-medium text-ocean-100">
                  Trusted by members in 40+ countries for wealth, growth, and
                  everyday banking excellence.
                </p>
                <div className="mt-4 flex flex-wrap justify-center gap-2">
                  {trustPills.map(({ icon: Icon, label }) => (
                    <span
                      key={label}
                      className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white"
                    >
                      <Icon className="h-3.5 w-3.5 text-brand-300" />
                      {label}
                    </span>
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
