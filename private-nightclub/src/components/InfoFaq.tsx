"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { faqs, venue } from "@/lib/site";
import { springs } from "@/lib/motion";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

const quickInfo = [
  { label: "Dress Code", value: "Upscale. No athletic wear, no baggy fits, clean footwear." },
  { label: "Parking", value: "Valet at the door from 10 PM. Garage one block north." },
  { label: "Hours", value: "Thu - Sat, 10 PM to 3 AM. Private events otherwise." },
  { label: "Entry", value: "21+ with valid ID. Tables and members enter first." },
];

/** Dress code, parking, hours, and an FAQ accordion. None of it buried. */
export default function InfoFaq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="info" className="relative bg-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto grid max-w-edge gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading eyebrow="Before You Come" title={<>Know before you go</>} />
          <div className="mt-10 grid gap-px overflow-hidden border border-gold/12 bg-gold/12 sm:grid-cols-2">
            {quickInfo.map((q) => (
              <div key={q.label} className="bg-soft-black p-6">
                <div className="text-[0.66rem] uppercase tracking-wide2 text-gold/70">{q.label}</div>
                <p className="mt-2 text-sm text-cream/65">{q.value}</p>
              </div>
            ))}
          </div>
          <Reveal delay={0.1} className="mt-6">
            <p className="text-sm text-cream/45">
              Questions we did not cover? Ask the concierge in the corner, or call{" "}
              <a href={`tel:${venue.phone}`} className="text-champagne hover:underline">
                {venue.phone}
              </a>
              .
            </p>
          </Reveal>
        </div>

        <div>
          <h3 className="display mb-6 text-3xl text-cream">Frequently asked</h3>
          <div className="divide-y divide-gold/12 border-y border-gold/12">
            {faqs.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={f.q}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  >
                    <span className="text-base text-cream/90">{f.q}</span>
                    <span
                      className={`flex-none text-gold transition-transform duration-300 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={springs.smooth}
                        className="overflow-hidden"
                      >
                        <p className="pb-5 pr-8 text-sm leading-relaxed text-cream/55">{f.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
