"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { easeCinematic } from "@/lib/motion";

/**
 * Standalone Framer leaf for in-view reveals (PATTERN-001). Kept out of any
 * GSAP component tree. Respects reduced motion via the global CSS guard plus
 * Framer's own viewport handling.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 26,
  className = "",
  as = "div",
  amount = 0.15,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "span" | "section";
  amount?: number;
}) {
  const MotionTag = motion[as];
  return (
    <MotionTag
      data-reveal
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.7, delay, ease: easeCinematic }}
    >
      {children}
    </MotionTag>
  );
}
