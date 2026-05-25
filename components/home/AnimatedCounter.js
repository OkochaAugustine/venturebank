"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, motion } from "framer-motion";

function parseValue(value) {
  const str = String(value);
  const match = str.match(/^([^0-9]*)([0-9.]+)(.*)$/);
  if (!match) return { prefix: "", num: 0, suffix: str };
  return {
    prefix: match[1],
    num: parseFloat(match[2]),
    suffix: match[3],
  };
}

export function AnimatedCounter({ value, duration = 2, className }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { prefix, num, suffix } = parseValue(value);
  const [display, setDisplay] = useState(0);
  const isDecimal = String(num).includes(".");

  useEffect(() => {
    if (!inView) return;

    let start = 0;
    const startTime = performance.now();

    const tick = (now) => {
      const progress = Math.min((now - startTime) / (duration * 1000), 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(num * eased);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [inView, num, duration]);

  const formatted = isDecimal
    ? display.toFixed(1)
    : Math.floor(display).toLocaleString();

  return (
    <motion.span
      ref={ref}
      className={className}
      initial={{ opacity: 0, y: 8 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {prefix}
      {formatted}
      {suffix}
    </motion.span>
  );
}
