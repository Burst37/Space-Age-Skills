"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isTouchOrSmall, prefersReducedMotion } from "@/lib/motion";
import { splitSlides } from "@/lib/site";

const panelTone = [
  "from-[#1a1206] to-black",
  "from-[#16110a] to-black",
  "from-[#120f08] to-black",
  "from-[#1c1408] to-black",
];

/**
 * Split-screen luxury slides (PATTERN-003). Desktop pins the section and
 * scrubs through each state with the left headline and right panel moving as a
 * pair. Mobile renders the same content as stacked cards.
 */
export default function SplitShowcase() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"stack" | "pin">("stack");

  useEffect(() => {
    if (prefersReducedMotion() || isTouchOrSmall()) return;
    setMode("pin");

    const ctx = gsap.context(() => {
      const titles = gsap.utils.toArray<HTMLElement>("[data-title]");
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]");
      gsap.set([titles, panels], { autoAlpha: 0 });
      gsap.set([titles[0], panels[0]], { autoAlpha: 1 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: `+=${splitSlides.length * 90}%`,
          scrub: 1,
          pin: true,
        },
      });

      titles.forEach((_, i) => {
        if (i === 0) return;
        tl.to([titles[i - 1], panels[i - 1]], { autoAlpha: 0, duration: 0.35 })
          .fromTo(
            [titles[i], panels[i]],
            { autoAlpha: 0, yPercent: 6 },
            { autoAlpha: 1, yPercent: 0, duration: 0.45 },
            "<0.05",
          );
      });
    }, root);

    return () => ctx.revert();
  }, []);

  if (mode === "stack") {
    return (
      <section className="bg-black px-5 py-20 sm:px-8">
        <div className="mx-auto grid max-w-edge gap-6">
          {splitSlides.map((s, i) => (
            <article
              key={s.id}
              className={`atmosphere relative overflow-hidden border border-gold/15 bg-gradient-to-br ${panelTone[i]} p-8`}
            >
              <span className="text-[0.7rem] uppercase tracking-wide2 text-gold/80">{s.kicker}</span>
              <h3 className="display mt-3 text-5xl text-cream">{s.title}</h3>
              <p className="mt-4 max-w-md text-cream/60">{s.body}</p>
              <a
                href={s.cta.href}
                className="mt-6 inline-block border-b border-gold/50 pb-1 text-[0.72rem] uppercase tracking-wide2 text-champagne"
              >
                {s.cta.label}
              </a>
            </article>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section ref={root} className="relative bg-black">
      <div className="grid h-[100svh] grid-cols-1 lg:grid-cols-2">
        {/* Left: stacked headlines */}
        <div className="relative flex items-center px-8 lg:px-16">
          {splitSlides.map((s) => (
            <div key={s.id} data-title className="absolute max-w-lg pr-8">
              <span className="text-[0.72rem] uppercase tracking-wide2 text-gold/80">{s.kicker}</span>
              <h3 className="display mt-4 text-[12vw] leading-none text-cream lg:text-8xl">
                {s.title}
              </h3>
              <p className="mt-6 max-w-md text-cream/60">{s.body}</p>
              <a
                href={s.cta.href}
                className="mt-7 inline-block border-b border-gold/50 pb-1 text-[0.72rem] uppercase tracking-wide2 text-champagne transition-colors hover:text-cream"
              >
                {s.cta.label}
              </a>
            </div>
          ))}
        </div>

        {/* Right: stacked panels */}
        <div className="relative hidden overflow-hidden lg:block">
          {splitSlides.map((s, i) => (
            <div
              key={s.id}
              data-panel
              className={`atmosphere absolute inset-0 flex items-end bg-gradient-to-br ${panelTone[i]} p-12`}
            >
              <span className="display text-[10rem] leading-none text-gold/10">
                0{i + 1}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
