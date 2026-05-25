"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { images } from "@/lib/images";
import { siteConfig } from "@/config/site";

export function AuthFormLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex flex-col lg:min-h-[calc(100vh-4rem)] lg:flex-row">
      <div className="relative hidden min-h-[280px] lg:block lg:min-h-0 lg:w-[44%]">
        <Image
          src={images.auth.src}
          alt={images.auth.alt}
          fill
          priority
          className="object-cover"
          sizes="44vw"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-ocean-950/92 via-ocean-900/85 to-ocean-800/75" />
        <div className="relative z-10 flex h-full flex-col justify-center p-12 xl:p-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-ocean-300">
            Member Banking
          </p>
          <p className="mt-6 font-serif text-3xl font-semibold leading-tight text-white xl:text-4xl">
            Secure banking for the modern era
          </p>
          <p className="mt-4 max-w-md text-base leading-relaxed text-ocean-100">
            Open your account in minutes. Enjoy mobile banking, competitive rates,
            and dedicated support backed by enterprise-grade security.
          </p>
          <ul className="mt-8 space-y-3 text-sm text-ocean-100">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ocean-400" />
              FDIC insured deposits
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ocean-400" />
              24/7 digital banking access
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-ocean-400" />
              No hidden monthly fees
            </li>
          </ul>
        </div>
      </div>

      <div className="flex flex-1 flex-col justify-center bg-white px-4 py-10 sm:px-8 lg:px-14 lg:py-16 xl:px-20">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mx-auto w-full max-w-lg"
        >
          <p className="text-xs font-bold uppercase tracking-widest text-ocean-600">
            {siteConfig.name}
          </p>
          <h1 className="mt-3 font-serif text-3xl font-semibold text-ocean-950 sm:text-[2rem]">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-2 text-base text-slate-600">{subtitle}</p>
          )}
          <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-8">
            {children}
          </div>
          {footer && (
            <p className="mt-6 text-center text-sm text-slate-600">{footer}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
