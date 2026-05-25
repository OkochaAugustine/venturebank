"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config/site";

const LOADER_MS = 3800;

export function AppLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      setProgress(Math.min(100, (elapsed / LOADER_MS) * 100));
    }, 50);
    const t = setTimeout(() => setLoading(false), LOADER_MS);
    return () => {
      clearTimeout(t);
      clearInterval(tick);
    };
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950"
          >
            <motion.div
              className="pointer-events-none absolute inset-0 opacity-40"
              animate={{ backgroundPosition: ["0% 0%", "100% 100%"] }}
              transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
              style={{
                backgroundImage:
                  "radial-gradient(circle at 20% 30%, rgba(59,130,246,0.4), transparent 50%), radial-gradient(circle at 80% 70%, rgba(6,182,212,0.3), transparent 45%)",
                backgroundSize: "200% 200%",
              }}
            />

            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute h-1 w-1 rounded-full bg-white/30"
                style={{
                  left: `${10 + (i * 7) % 80}%`,
                  top: `${15 + (i * 11) % 70}%`,
                }}
                animate={{ y: [0, -30, 0], opacity: [0.2, 0.8, 0.2] }}
                transition={{ duration: 3 + (i % 3), repeat: Infinity, delay: i * 0.2 }}
              />
            ))}

            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative z-10"
            >
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/10 shadow-2xl ring-2 ring-white/25 backdrop-blur-xl">
                <span className="font-serif text-4xl font-bold text-white">V</span>
              </div>
              <motion.div
                className="absolute -inset-6 rounded-[2rem] border border-blue-400/40"
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              <motion.div
                className="absolute -inset-10 rounded-[2.5rem] border border-cyan-400/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 mt-10 font-serif text-3xl font-semibold tracking-tight text-white sm:text-4xl"
            >
              {siteConfig.name}
            </motion.p>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="relative z-10 mt-2 text-sm text-blue-200/90"
            >
              Private banking · Secured connection
            </motion.p>

            <div className="relative z-10 mt-10 h-1.5 w-56 overflow-hidden rounded-full bg-white/10 sm:w-72">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500"
                style={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
            <p className="relative z-10 mt-3 text-xs text-blue-300/70">Initializing secure session…</p>
          </motion.div>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
