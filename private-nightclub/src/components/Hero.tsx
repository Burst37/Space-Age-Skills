"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";
import { venue } from "@/lib/site";

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

    // Slow-zoom hold on the final frame once the narrative finishes.
    const onEnded = () => {
      if (!v || reduce) return;
      gsap.to(v, { scale: 1.12, duration: 8, ease: "none" });
    };
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

      // Intro settle on the video itself.
      gsap.fromTo(
        ".hero-media",
        { scale: 1.14 },
        { scale: 1, duration: 2.4, ease: "power2.out" },
      );

      // Scroll parallax: drift the media and deepen the overlay as you leave.
      gsap.to(".hero-parallax", {
        yPercent: 18,
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
          muted
          playsInline
          preload="metadata"
          poster="/video/poster.svg"
        >
          <source src="/video/hero.mp4" type="video/mp4" />
        </video>
      </div>

      {/* Contrast + atmosphere veils */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/35 to-black/55" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-black/40" />
      <div className="hero-veil pointer-events-none absolute inset-0 bg-black/60 opacity-0" />

      {/* Copy */}
      <div className="relative z-10 mx-auto flex h-full max-w-edge flex-col justify-end px-5 pb-28 sm:px-8 sm:pb-24 md:justify-center md:pb-16">
        <p className="hero-rise mb-5 text-[0.7rem] uppercase tracking-brand text-gold/90">
          {venue.city} {String.fromCharCode(183)} Est. After Dark
        </p>
        <h1 className="hero-rise display max-w-4xl text-[15vw] leading-[0.86] text-cream sm:text-[11vw] md:text-[8.5rem] lg:text-[9.5rem]">
          Private
          <span className="block text-gold">Nightclub</span>
        </h1>
        <p className="hero-rise mt-6 max-w-md text-lg font-light text-cream/70">
          {venue.tagline}. Bottle service, reserved tables, and the only room in
          the city that feels like this.
        </p>
        <div className="hero-rise mt-9 flex flex-wrap items-center gap-4">
          <a
            href="#vip"
            className="bg-gold px-8 py-4 text-[0.72rem] uppercase tracking-wide2 text-black transition-colors duration-300 hover:bg-champagne"
          >
            Reserve VIP
          </a>
          <a
            href="#guestlist"
            className="border border-gold/50 px-8 py-4 text-[0.72rem] uppercase tracking-wide2 text-champagne transition-colors duration-300 hover:border-gold hover:text-cream"
          >
            Join Guestlist
          </a>
        </div>
      </div>
    </section>
  );
}
