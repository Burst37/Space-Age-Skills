import type { Transition } from "framer-motion";

/** Spring tokens (from design-motion-principles). Use, do not reinvent. */
export const springs = {
  snappy: { type: "spring", stiffness: 400, damping: 30 },
  smooth: { type: "spring", duration: 0.45, bounce: 0 },
  cinematic: { type: "spring", duration: 0.9, bounce: 0.05 },
} satisfies Record<string, Transition>;

/** Custom bezier used for cinematic reveals. */
export const easeCinematic = [0.16, 1, 0.3, 1] as const;

/** True when the user has asked the OS to reduce motion. SSR-safe. */
export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** True for coarse pointers / small screens where heavy motion is disabled. */
export function isTouchOrSmall(): boolean {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(max-width: 768px)").matches ||
    window.matchMedia("(pointer: coarse)").matches
  );
}
