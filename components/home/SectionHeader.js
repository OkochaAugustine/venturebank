"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { fadeInUp, staggerContainer, staggerItem, viewportOnce } from "./motion";

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}) {
  const isCenter = align === "center";

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      className={cn(
        "mb-14 lg:mb-16",
        isCenter ? "mx-auto max-w-3xl text-center" : "max-w-2xl",
        className
      )}
    >
      {eyebrow && (
        <motion.p
          variants={staggerItem}
          className={cn(
            "text-xs font-semibold uppercase tracking-[0.2em] sm:text-[13px]",
            light ? "text-ocean-200" : "text-ocean-600"
          )}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        variants={fadeInUp}
        className={cn(
          "mt-4 font-serif text-3xl font-semibold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-[1.15]",
          light ? "text-white" : "text-ocean-950"
        )}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          variants={staggerItem}
          className={cn(
            "mt-5 text-base leading-relaxed sm:text-lg",
            light ? "text-ocean-100/90" : "text-slate-600"
          )}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}
