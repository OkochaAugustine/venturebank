"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  HiOutlineDevicePhoneMobile,
  HiOutlineLockClosed,
  HiOutlineChartBar,
} from "react-icons/hi2";
import { SectionHeader } from "./SectionHeader";
import { viewportOnce } from "./motion";

const items = [
  {
    icon: HiOutlineDevicePhoneMobile,
    title: "Digital-first banking",
    description:
      "Manage accounts, move money, and deposit checks from any device with our award-winning mobile experience.",
  },
  {
    icon: HiOutlineLockClosed,
    title: "Security you can trust",
    description:
      "Multi-factor authentication, real-time fraud alerts, and 256-bit encryption protect every session.",
  },
  {
    icon: HiOutlineChartBar,
    title: "Insights that matter",
    description:
      "Personalized spending analytics and savings goals help you make smarter financial decisions.",
  },
];

export function HomeExperience() {
  return (
    <section className="section-light relative overflow-hidden py-20 sm:py-24 lg:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(14,165,233,0.06),transparent_60%)]" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Member Experience"
          title="Banking designed for how you live"
          description="Every touchpoint reflects our commitment to clarity, speed, and personal service."
        />
        <div className="grid gap-8 md:grid-cols-3">
          {items.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={viewportOnce}
              transition={{ delay: i * 0.1, duration: 0.55 }}
              whileHover={{ y: -8 }}
              className="surface-card bg-gradient-to-b from-muted/80 to-card p-8 transition-shadow hover:shadow-xl"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/15 text-brand-700 dark:text-brand-300">
                <item.icon className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-serif text-xl font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={viewportOnce}
          className="mt-14 text-center"
        >
          <Link
            href="/services"
            className="inline-flex rounded-lg bg-ocean-700 px-8 py-3.5 text-sm font-semibold text-white hover:bg-ocean-800"
          >
            Explore all services
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
