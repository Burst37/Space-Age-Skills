"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { stats, testimonials } from "@/lib/site";
import Reveal from "./ui/Reveal";

/**
 * Social proof: scroll-triggered counters (PATTERN-006) and a quote wall.
 * Counters animate once on enter and snap to final values under reduced motion.
 */
export default function SocialProof() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const nums = gsap.utils.toArray<HTMLElement>("[data-count]");

    if (prefersReducedMotion()) {
      nums.forEach((el) => {
        const final = Number(el.dataset.count);
        const dec = Number(el.dataset.decimals ?? 0);
        el.textContent = final.toFixed(dec);
      });
      return;
    }

    const ctx = gsap.context(() => {
      nums.forEach((el) => {
        const final = Number(el.dataset.count);
        const dec = Number(el.dataset.decimals ?? 0);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: final,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%", once: true },
          onUpdate: () => {
            el.textContent = obj.v.toFixed(dec);
          },
        });
      });
    }, root);

    return () => {
      ctx.revert();
      ScrollTrigger.refresh();
    };
  }, []);

  return (
    <section ref={root} className="relative bg-soft-black px-5 py-24 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-edge">
        <div className="grid grid-cols-2 gap-8 border-y border-gold/12 py-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="display text-5xl text-gold sm:text-6xl">
                <span data-count={s.value} data-decimals={s.decimals ?? 0}>
                  0
                </span>
                {s.suffix}
              </div>
              <p className="mt-3 text-xs uppercase tracking-wide2 text-cream/45">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid gap-5 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.07}>
              <figure className="atmosphere relative h-full border border-gold/15 bg-black/40 p-8">
                <span className="display text-6xl leading-none text-gold/20">{"“"}</span>
                <blockquote className="mt-2 text-cream/80">{t.quote}</blockquote>
                <figcaption className="mt-6 text-sm">
                  <span className="block text-cream">{t.name}</span>
                  <span className="text-gold/70">{t.role}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
