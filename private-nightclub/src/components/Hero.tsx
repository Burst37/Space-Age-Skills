"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

/**
 * Fullscreen cinematic hero. The 21:9 video fills the viewport (object-cover
 * keeps the crop), a layered gradient guarantees text contrast, and the copy
 * fades in on load. When the 10s narrative ends we hold the final packed-club
 * frame and apply a slow zoom. All motion is GSAP, guarded for reduced motion.
 */
export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    const reduce = prefersReducedMotion();

    // Video loops continuously (see attribute below) — no end-frame zoom.
    const onEnded = () => {};
    v?.addEventListener("ended", onEnded);

    if (reduce) return; // content is already visible via CSS

    const ctx = gsap.context(() => {
      // Load-in stagger of the hero copy and actions.
      gsap.set(".hero-rise", { opacity: 0, y: 30 });
      gsap.to(".hero-rise", {
        opacity: 1,
        y: 0,
        duration: 1.1,
        ease: "power4.out",
        stagger: 0.12,
        delay: 0.35,
      });

      // Very subtle intro settle — no heavy zoom (keep the room visible).
      gsap.fromTo(
        ".hero-media",
        { scale: 1.04 },
        { scale: 1, duration: 1.8, ease: "power2.out" },
      );

      // Scroll parallax: gentle drift as you leave (small, no zoom).
      gsap.to(".hero-parallax", {
        yPercent: 8,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
      gsap.to(".hero-veil", {
        opacity: 1,
        ease: "none",
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, root);

    return () => {
      v?.removeEventListener("ended", onEnded);
      ctx.revert();
    };
  }, []);

  return (
    <section id="top" ref={root} className="relative h-[100svh] w-full overflow-hidden bg-black">
      {/* Media layer */}
      <div className="hero-parallax absolute inset-0">
        <video
          ref={video}
          className="hero-media h-full w-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/video/poster.svg"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Contrast + atmosphere veils */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/25" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/15" />
      <div className="hero-veil pointer-events-none absolute inset-0 bg-black/60 opacity-0" />

      {/* Copy: giant OUTLINED gold type — see-through, fills the WHOLE viewport
          top-to-bottom (ref). Anton is condensed so NIGHTCLUB spans the full
          width while the glyphs stay tall enough to reach both edges. */}
      <div className="relative z-10 flex h-full w-full flex-col justify-center px-[1.5vw]">
        <h1 className="hero-rise font-condensed uppercase text-center leading-[0.8] tracking-[0.005em]">
          <span className="block text-outline-gold text-[clamp(3.5rem,22vw,26rem)]">
            Private
          </span>
          <span className="block text-outline-gold text-[clamp(3.5rem,22vw,26rem)]">
            Nightclub
          </span>
        </h1>
      </div>
    </section>
  );
}
