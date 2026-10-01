"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { isTouchOrSmall, prefersReducedMotion } from "@/lib/motion";

const WORDS = ["Private.", "Exclusive.", "Unforgettable.", "St. Louis."];

/**
 * Pinned scroll-scrub typography over the ambience footage (PATTERN-004).
 * Desktop pins the scene and crossfades each word in place. Mobile and
 * reduced-motion fall back to a clean stacked sequence with no pinning.
 */
export default function ScrollStory() {
  const root = useRef<HTMLElement>(null);
  const [mode, setMode] = useState<"stack" | "pin">("stack");

  useEffect(() => {
    if (prefersReducedMotion() || isTouchOrSmall()) return;
    setMode("pin");

    const ctx = gsap.context(() => {
      const words = gsap.utils.toArray<HTMLElement>("[data-word]");
      gsap.set(words, { opacity: 0, yPercent: 8 });
      gsap.set(words[0], { opacity: 1, yPercent: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=320%",
          scrub: 1,
          pin: true,
        },
      });

      words.forEach((word, i) => {
        if (i === 0) return;
        tl.to(words[i - 1], { opacity: 0, yPercent: -8, duration: 0.4 })
          .fromTo(
            word,
            { opacity: 0, yPercent: 8 },
            { opacity: 1, yPercent: 0, duration: 0.5 },
            "<0.1",
          );
      });

      // Slow push-in on the backdrop across the whole pin.
      gsap.to(".story-bg", {
        scale: 1.18,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "+=320%",
          scrub: 1,
        },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={root}
      className="atmosphere relative overflow-hidden bg-black"
      aria-label="Private. Exclusive. Unforgettable. St. Louis."
    >
      <div className="absolute inset-0 overflow-hidden">
        <video
          className="story-bg h-full w-full object-cover opacity-40"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
          poster="/video/poster.svg"
        >
          <source src="/video/club-ambience.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {mode === "pin" ? (
        <div className="relative flex h-[100svh] items-center justify-center">
          {WORDS.map((w) => (
            <h2
              key={w}
              data-word
              className="display absolute px-6 text-center text-[16vw] text-cream md:text-[12rem]"
            >
              {w === "St. Louis." ? <span className="text-gold">{w}</span> : w}
            </h2>
          ))}
        </div>
      ) : (
        <div className="relative">
          {WORDS.map((w) => (
            <div key={w} className="flex min-h-[60svh] items-center justify-center px-6">
              <h2 className="display text-center text-[18vw] text-cream sm:text-[14vw]">
                {w === "St. Louis." ? <span className="text-gold">{w}</span> : w}
              </h2>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
