"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const stats = [
  { value: "1.2k+", label: "Guests on a sold-out night" },
  { value: "18", label: "VIP tables and sections" },
  { value: "52", label: "Live sets per year" },
];

export default function Intro() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-intro-fade]", {
        opacity: 0,
        y: 40,
        duration: 1,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: root.current,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="about" ref={root} className="relative overflow-hidden bg-black">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 lg:grid-cols-2">

        {/* Left — headline, body, stats (mirrors Dinely's left panel) */}
        <div className="flex flex-col justify-center px-5 py-20 sm:px-10 lg:py-36 lg:pr-20">
          <span
            data-intro-fade
            className="mb-4 block text-[0.68rem] uppercase tracking-[0.2em] text-gold/80"
          >
            The Experience
          </span>
          <h2
            data-intro-fade
            className="display text-[clamp(2.6rem,6.5vw,5rem)] leading-[0.88] tracking-[-0.025em] text-cream"
          >
            Provide Unforgettable
            <span className="gold-text block">Nights, Every Weekend</span>
          </h2>
          <p
            data-intro-fade
            className="mt-7 max-w-[42ch] text-base leading-relaxed text-cream/58"
          >
            From the moment the valet takes your keys to the last bottle parade
            of the night, Private is built for one thing — an experience you
            will not find anywhere else in St. Louis.
          </p>

          {/* Stats row — direct lift from Dinely's service hero counters */}
          <div
            data-intro-fade
            className="mt-12 grid grid-cols-3 gap-6 border-t border-gold/15 pt-10"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="display text-[2.4rem] leading-none text-gold">{s.value}</p>
                <p className="mt-2 text-[0.63rem] uppercase leading-snug tracking-[0.15em] text-cream/45">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right — atmospheric dark panel (swap for real photo when available) */}
        <div
          data-intro-fade
          className="relative hidden min-h-[540px] overflow-hidden lg:block"
        >
          {/* Dark gradient atmosphere matching Dinely's right-side photo panel */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a1206] via-[#0d0a05] to-black" />
          <div className="absolute inset-0 bg-[url('/video/poster.svg')] bg-cover bg-center opacity-25" />
          {/* Giant ambient "P" monogram, same treatment as Dinely's decorative typography */}
          <span className="display absolute bottom-10 right-8 select-none text-[18rem] leading-none text-gold/[0.04]">
            P
          </span>
        </div>
      </div>
    </section>
  );
}
