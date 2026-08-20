"use client";

import { useRef, type ReactNode } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { isTouchOrSmall, prefersReducedMotion } from "@/lib/motion";

type Props = {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "solid" | "outline" | "ghost";
  className?: string;
  ariaLabel?: string;
};

const base =
  "group relative inline-flex items-center justify-center gap-2 px-7 py-3.5 text-[0.72rem] font-medium uppercase tracking-wide2 transition-colors duration-300 will-change-transform";

const variants = {
  solid: "bg-gold text-black hover:bg-champagne",
  outline: "border border-gold/60 text-champagne hover:border-gold hover:text-cream",
  ghost: "text-cream/80 hover:text-champagne",
} as const;

/**
 * Magnetic CTA using motion values + spring (never useState for pointer).
 * Falls back to a plain button under reduced motion or on touch devices.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = "solid",
  className = "",
  ariaLabel,
}: Props) {
  const ref = useRef<HTMLAnchorElement & HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 150, damping: 15 });
  const sy = useSpring(y, { stiffness: 150, damping: 15 });

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion() || isTouchOrSmall()) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - rect.left - rect.width / 2) * 0.35);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.35);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const cls = `${base} ${variants[variant]} ${className}`;
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
    </>
  );

  if (href) {
    return (
      <motion.a
        ref={ref}
        href={href}
        aria-label={ariaLabel}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={{ x: sx, y: sy }}
        className={cls}
      >
        {inner}
      </motion.a>
    );
  }
  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      className={cls}
    >
      {inner}
    </motion.button>
  );
}
