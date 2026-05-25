"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/home/SectionHeader";
import { viewportOnce } from "@/components/home/motion";

export function ContentSection({
  eyebrow,
  title,
  description,
  children,
  className,
  bg = "white",
  id,
  align = "center",
}) {
  const bgClass =
    bg === "slate" ? "bg-slate-50" : bg === "ocean" ? "bg-ocean-950" : "bg-white";

  return (
    <section id={id} className={cn("py-16 sm:py-20 lg:py-24", bgClass, className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {(title || eyebrow) && (
          <SectionHeader
            eyebrow={eyebrow}
            title={title}
            description={description}
            align={align}
            light={bg === "ocean"}
          />
        )}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
}
