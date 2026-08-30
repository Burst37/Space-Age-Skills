"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { prefersReducedMotion } from "@/lib/motion";

const services = [
  {
    id: "bottle",
    image: "/venue/bottle-service.webp",
    eyebrow: "Bottle Service",
    heading: "The Parade Starts at Your Table",
    body:
      "Sparkler-lit processions, top-shelf spirits, and dedicated hosts who keep your section running all night. Packages scale from a single bottle to a full Gold Room buy-in.",
    features: [
      { icon: "◆", label: "Reserved Section" },
      { icon: "◆", label: "Dedicated Host" },
      { icon: "◆", label: "Sparkling + Spirits Menu" },
      { icon: "◆", label: "Sparkler Parade" },
      { icon: "◆", label: "Premium Mixers" },
      { icon: "◆", label: "Priority Entry" },
    ],
    cta: { label: "Reserve a Table", href: "#vip" },
    imagePos: "right" as const,
  },
  {
    id: "events",
    image: "/venue/crowd.webp",
    eyebrow: "Private Events",
    heading: "Your Night, Your Venue",
    body:
      "Birthday takeovers, corporate events, and full venue buyouts — every detail handled by our events team so you show up and celebrate. Sunday through Wednesday is yours.",
    features: [
      { icon: "◆", label: "Full Venue Buyout Available" },
      { icon: "◆", label: "Custom Décor & Theming" },
      { icon: "◆", label: "Dedicated Event Host" },
      { icon: "◆", label: "Custom Bottle Package" },
      { icon: "◆", label: "DJ + Sound Production" },
      { icon: "◆", label: "Late Night Kitchen Open" },
    ],
    cta: { label: "Inquire Now", href: "#vip" },
    imagePos: "left" as const,
  },
  {
    id: "vip-tables",
    image: "/venue/vip-room.webp",
    eyebrow: "VIP Tables",
    heading: "The Best Sightlines in the Room",
    body:
      "Reserved seating from two-tops to the full Gold Room, a host who anticipates everything, and a night that starts before you walk through the door.",
    features: [
      { icon: "◆", label: "Tables from 2 to 20 Guests" },
      { icon: "◆", label: "Personal Host All Night" },
      { icon: "◆", label: "Gold Room Available" },
      { icon: "◆", label: "Advance Booking Line" },
      { icon: "◆", label: "Minimum Spend Packages" },
      { icon: "◆", label: "Complimentary Mixers" },
    ],
    cta: { label: "Book a Table", href: "#vip" },
    imagePos: "right" as const,
  },
];

export default function Services() {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-svc-card]").forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });
      });

      // Subtle ken-burns: photo settles from a slight zoom as it scrolls in.
      gsap.utils.toArray<HTMLElement>("[data-svc-img]").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.14 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: {
              trigger: img,
              start: "top bottom",
              end: "bottom top",
              scrub: 1,
            },
          },
        );
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section id="services" ref={root} className="bg-black">
      {/* Section label — matches Dinely's small uppercase label above the cards */}
      <div className="mx-auto max-w-[1440px] border-t border-gold/12 px-5 pt-20 sm:px-10">
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-gold/70">Our Services</p>
      </div>

      {services.map((svc) => (
        <article
          key={svc.id}
          id={svc.id}
          data-svc-card
          className="mx-auto grid max-w-[1440px] grid-cols-1 border-b border-gold/10 lg:grid-cols-2"
        >
          {/* Image panel — real venue photo, Dinely alternates left/right */}
          <div
            className={`relative min-h-[360px] overflow-hidden bg-[#0d0a05] lg:min-h-[520px] ${
              svc.imagePos === "left" ? "lg:order-first" : "lg:order-last"
            }`}
          >
            <Image
              data-svc-img
              src={svc.image}
              alt={`${svc.eyebrow} at Private Nightclub`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover will-change-transform"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-black/20" />
            {/* Decorative oversized number, seated over the photo */}
            <span className="display absolute bottom-6 right-7 select-none text-[9rem] leading-none text-cream/85 mix-blend-overlay">
              {svc.id === "bottle" ? "01" : svc.id === "events" ? "02" : "03"}
            </span>
          </div>

          {/* Text panel — matches Dinely's service text side */}
          <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:py-20">
            <span className="mb-3 block text-[0.68rem] uppercase tracking-[0.2em] text-gold/80">
              {svc.eyebrow}
            </span>
            <h3 className="display text-[clamp(2rem,4.5vw,3.2rem)] leading-[0.9] tracking-[-0.02em] text-cream">
              {svc.heading}
            </h3>
            <p className="mt-5 max-w-[44ch] text-base leading-relaxed text-cream/58">
              {svc.body}
            </p>

            {/* Feature grid — mirrors Dinely's icon + label list */}
            <ul className="mt-8 grid grid-cols-2 gap-x-6 gap-y-3">
              {svc.features.map((f) => (
                <li
                  key={f.label}
                  className="flex items-center gap-2 text-[0.75rem] text-cream/65"
                >
                  <span className="text-[0.45rem] text-gold">{f.icon}</span>
                  {f.label}
                </li>
              ))}
            </ul>

            {/* Amber CTA — Dinely's filled gold button */}
            <div className="mt-10">
              <a
                href={svc.cta.href}
                className="inline-block rounded-full bg-gold px-8 py-4 text-[0.7rem] uppercase tracking-[0.16em] text-black transition-colors duration-300 hover:bg-champagne"
              >
                {svc.cta.label}
              </a>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
