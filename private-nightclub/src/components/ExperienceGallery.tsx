"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { experiences, type ExperienceCard } from "@/lib/site";
import { isTouchOrSmall, prefersReducedMotion } from "@/lib/motion";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

function TiltCard({ card, index }: { card: ExperienceCard; index: number }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [8, -8]), { stiffness: 150, damping: 18 });
  const ry = useSpring(useTransform(px, [0, 1], [-10, 10]), { stiffness: 150, damping: 18 });
  const glowX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(py, [0, 1], ["0%", "100%"]);
  const glow = useTransform(
    [glowX, glowY],
    ([x, y]) => `radial-gradient(420px circle at ${x} ${y}, rgba(201,162,77,0.18), transparent 60%)`,
  );

  const onMove = (e: React.MouseEvent) => {
    if (prefersReducedMotion() || isTouchOrSmall()) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };
  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.a
      ref={ref}
      href={card.href}
      onMouseMove={onMove}
      onMouseLeave={reset}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 900 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.6, delay: (index % 3) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative block aspect-[4/5] overflow-hidden border border-gold/15 bg-soft-black p-7 [transform-style:preserve-3d]"
    >
      {/* pointer-tracked glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <div className="relative flex h-full flex-col justify-between">
        <span className="display text-7xl text-gold/15">0{index + 1}</span>
        <div>
          <h3 className="display text-3xl text-cream">{card.title}</h3>
          <p className="mt-3 text-sm text-cream/55">{card.blurb}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-wide2 text-champagne">
            Explore
            <span className="transition-transform duration-300 group-hover:translate-x-1">{"↗"}</span>
          </span>
        </div>
      </div>
    </motion.a>
  );
}

/** Floating 3D-feeling card gallery (PATTERN-007/008), not a gimmicky sphere. */
export default function ExperienceGallery() {
  return (
    <section id="gallery" className="relative bg-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-edge">
        <SectionHeading
          eyebrow="The Experience"
          title={<>Every corner of the room</>}
          intro="Six ways to spend the night. Hover to feel it, click to step inside."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {experiences.map((card, i) => (
            <TiltCard key={card.key} card={card} index={i} />
          ))}
        </div>
        <Reveal delay={0.1} className="mt-10">
          <p className="text-sm text-cream/40">
            Looking for a full buyout or a private night? Reach the team through
            the <a href="#vip" className="text-champagne underline-offset-4 hover:underline">VIP desk</a>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
