"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import { HiOutlineArrowRight } from "react-icons/hi2";
import { cn } from "@/lib/utils";

const gradients = [
  "from-ocean-600 via-ocean-800 to-ocean-950",
  "from-slate-700 via-ocean-900 to-ocean-950",
  "from-brand-700 via-ocean-800 to-ocean-950",
  "from-indigo-800 via-ocean-900 to-ocean-950",
  "from-teal-700 via-ocean-800 to-slate-900",
  "from-ocean-700 via-slate-800 to-ocean-950",
];

export function BankingShowcaseCard({ feature, index }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 200, damping: 20 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 200, damping: 20 });

  function handleMove(e) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  }

  function handleLeave() {
    x.set(0);
    y.set(0);
  }

  const gradient = gradients[index % gradients.length];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ delay: index * 0.08, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      className="h-full"
    >
      <Link
        href={feature.href || "/contact"}
        className={cn(
          "group relative flex h-full min-h-[340px] flex-col overflow-hidden rounded-3xl border border-white/10 shadow-2xl transition-shadow duration-500 hover:shadow-[0_20px_60px_-15px_rgba(14,165,233,0.35)]",
          "bg-gradient-to-br",
          gradient
        )}
      >
        <motion.div
          className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 blur-2xl"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 5 + index, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-12 -left-12 h-48 w-48 rounded-full bg-brand-400/20 blur-3xl"
          animate={{ rotate: 360 }}
          transition={{ duration: 20 + index * 2, repeat: Infinity, ease: "linear" }}
        />

        {feature.image && (
          <div className="relative h-44 overflow-hidden">
            <Image
              src={feature.image}
              alt={feature.title}
              fill
              className="object-cover opacity-70 transition-all duration-700 group-hover:scale-110 group-hover:opacity-90"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ocean-950 via-ocean-950/40 to-transparent" />
          </div>
        )}

        <div className="relative flex flex-1 flex-col p-7">
          <motion.span
            className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-lg font-bold text-white backdrop-blur-md"
            whileHover={{ scale: 1.1, rotate: 5 }}
          >
            {String(index + 1).padStart(2, "0")}
          </motion.span>
          <h3 className="font-serif text-2xl font-semibold text-white">
            {feature.title}
          </h3>
          <p className="mt-3 flex-1 text-sm leading-relaxed text-ocean-100/90">
            {feature.description}
          </p>
          <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white/90 transition-colors group-hover:text-white">
            Explore solution
            <HiOutlineArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        </div>

        <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/10 group-hover:ring-white/25" />
      </Link>
    </motion.div>
  );
}
