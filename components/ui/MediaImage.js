"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export function MediaImage({
  src,
  alt,
  className,
  imageClassName,
  priority = false,
  overlay = false,
  overlayClassName,
  zoomOnHover = true,
  sizes = "(max-width: 768px) 100vw, 50vw",
  fallbackLabel = "VentureBank",
}) {
  const [error, setError] = useState(false);

  return (
    <div
      className={cn(
        "relative min-h-[120px] overflow-hidden bg-gradient-to-br from-ocean-100 to-ocean-200",
        className
      )}
    >
      {!error ? (
        <motion.div
          className="absolute inset-0 h-full w-full"
          whileHover={zoomOnHover ? { scale: 1.05 } : undefined}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes={sizes}
            className={cn("object-cover", imageClassName)}
            onError={() => setError(true)}
          />
        </motion.div>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-ocean-700 to-ocean-900">
          <span className="font-serif text-lg text-white/80">{fallbackLabel}</span>
        </div>
      )}
      {overlay && !error && (
        <div
          className={cn(
            "pointer-events-none absolute inset-0 z-[1] bg-gradient-to-t from-ocean-950/80 via-ocean-950/30 to-ocean-950/20",
            overlayClassName
          )}
        />
      )}
    </div>
  );
}
