"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { nav, venue } from "@/lib/site";
import { springs } from "@/lib/motion";
import { track } from "@/lib/track";

/**
 * Top navigation. Background condenses once the hero scrolls away, detected
 * with an IntersectionObserver sentinel (no scroll listeners). Persistent
 * RESERVE VIP / GUESTLIST actions live here at every breakpoint.
 */
export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const sentinel = document.getElementById("top");
    if (!sentinel) return;
    const io = new IntersectionObserver(
      ([entry]) => setSolid(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    io.observe(sentinel);
    return () => io.disconnect();
  }, []);

  // Lock body scroll while the mobile sheet is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        solid
          ? "border-b border-gold/15 bg-black/80 backdrop-blur-xl"
          : "border-b border-transparent bg-gradient-to-b from-black/60 to-transparent"
      }`}
    >
      <nav className="relative mx-auto flex h-[68px] max-w-edge items-center px-5 sm:px-8">
        {/* Left: primary links */}
        <ul className="hidden items-center gap-6 lg:flex">
          {nav
            .filter((item) => item.href !== ("#top" as string))
            .map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-[0.74rem] uppercase tracking-wide2 text-cream/65 transition-colors hover:text-champagne"
                >
                  {item.label}
                </a>
              </li>
            ))}
        </ul>

        {/* Center: real gold logo badge */}
        <a
          href="#top"
          className="absolute left-1/2 flex -translate-x-1/2 items-center"
          aria-label={`${venue.fullName} home`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo.png"
            alt={venue.fullName}
            className="h-12 w-12 object-contain sm:h-[52px] sm:w-[52px]"
          />
        </a>

        {/* Right: actions */}
        <div className="ml-auto flex items-center gap-3">
          <a
            href="#vip"
            onClick={() => track({ type: "cta", label: "Reserve VIP (nav)" })}
            className="group hidden items-center gap-2 bg-gold px-4 py-2.5 text-[0.68rem] uppercase tracking-wide2 text-black transition-colors hover:bg-champagne md:inline-flex"
          >
            Reserve VIP
            <span className="transition-transform duration-300 group-hover:translate-x-1">{"→"}</span>
          </a>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="flex h-10 w-10 items-center justify-center text-cream lg:hidden"
          >
          <span className="relative block h-4 w-6">
            <span
              className={`absolute left-0 block h-px w-6 bg-current transition-all duration-300 ${
                open ? "top-2 rotate-45" : "top-0.5"
              }`}
            />
            <span
              className={`absolute left-0 top-2 block h-px w-6 bg-current transition-opacity duration-300 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-6 bg-current transition-all duration-300 ${
                open ? "top-2 -rotate-45" : "top-[14px]"
              }`}
            />
          </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={springs.smooth}
            className="atmosphere relative border-t border-gold/15 bg-black/95 px-6 py-8 lg:hidden"
          >
            <ul className="flex flex-col gap-5">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="display text-3xl text-cream/90"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
