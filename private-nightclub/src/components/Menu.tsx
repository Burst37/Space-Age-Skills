"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  foodMenu,
  bottleMenu,
  foodNote,
  bottleNote,
  foodImages,
  drinkImages,
  type MenuGroup,
} from "@/lib/site";
import { springs } from "@/lib/motion";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

type TabKey = "food" | "bottle";

const tabs: { key: TabKey; label: string; note: string; images: string[]; menu: MenuGroup[]; alt: string }[] = [
  { key: "food", label: "Late Night Kitchen", note: foodNote, images: foodImages, menu: foodMenu, alt: "Late night dish at Private Nightclub" },
  { key: "bottle", label: "Bottle Service", note: bottleNote, images: drinkImages, menu: bottleMenu, alt: "Premium bottle service at Private Nightclub" },
];

function PriceList({ groups }: { groups: MenuGroup[] }) {
  return (
    <div className="columns-1 gap-10 md:columns-2 [&>*]:break-inside-avoid">
      {groups.map((g) => (
        <div key={g.title} className="mb-9">
          <h4 className="mb-4 border-b border-gold/20 pb-2 text-sm uppercase tracking-wide2 text-gold">
            {g.title}
          </h4>
          <ul className="space-y-2.5">
            {g.rows.map((r) => (
              <li key={r.name} className="flex items-baseline gap-3 text-sm">
                <span className="text-cream/85">{r.name}</span>
                <span className="mx-1 flex-1 translate-y-[-3px] border-b border-dotted border-cream/15" />
                <span className="text-champagne">{r.price}</span>
              </li>
            ))}
          </ul>
          {g.note && <p className="mt-3 text-xs leading-relaxed text-cream/40">{g.note}</p>}
        </div>
      ))}
    </div>
  );
}

export default function Menu() {
  const [tab, setTab] = useState<TabKey>("food");
  const [lightbox, setLightbox] = useState<number | null>(null);
  const active = tabs.find((t) => t.key === tab)!;
  const images = active.images;

  const close = useCallback(() => setLightbox(null), []);
  const step = useCallback(
    (dir: number) => setLightbox((i) => (i === null ? i : (i + dir + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (lightbox === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [lightbox, close, step]);

  return (
    <section id="menu" className="relative bg-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-edge">
        <SectionHeading
          eyebrow="The Menu"
          title={<>Food and bottle service</>}
          intro="A champagne-forward bottle list and a late-night kitchen, shot in the room. Tap any image to view it full size."
        />

        {/* Tabs */}
        <Reveal delay={0.05}>
          <div className="mt-10 flex gap-3" role="tablist" aria-label="Menu sections">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => setTab(t.key)}
                className={`px-6 py-3 text-[0.7rem] uppercase tracking-wide2 transition-colors ${
                  tab === t.key
                    ? "bg-gold text-black"
                    : "border border-gold/30 text-champagne hover:border-gold/60"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </Reveal>

        <p className="mt-5 text-sm text-gold/80">{active.note}</p>

        {/* Gallery (masonry preserves the full self-labeled cards) */}
        <Reveal
          delay={0.1}
          className="mt-8 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4"
        >
          {images.map((src, i) => (
            <button
              key={src}
              onClick={() => setLightbox(i)}
              aria-label={`View ${active.alt} ${i + 1}`}
              className="group block w-full overflow-hidden border border-gold/12 bg-soft-black transition-colors hover:border-gold/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={src}
                alt={`${active.alt} ${i + 1}`}
                loading="lazy"
                decoding="async"
                className="w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          ))}
        </Reveal>

        {/* Priced menu */}
        <Reveal delay={0.05} className="mt-16">
          <div className="atmosphere relative border border-gold/15 bg-soft-black p-8 sm:p-12">
            <h3 className="display mb-8 text-3xl text-cream sm:text-4xl">
              {tab === "food" ? "Late Night Food Menu" : "Bottle Service Menu"}
            </h3>
            <PriceList groups={active.menu} />
          </div>
        </Reveal>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/95 p-4 backdrop-blur-sm"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 flex h-11 w-11 items-center justify-center border border-gold/30 text-2xl text-champagne hover:border-gold"
            >
              ×
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); step(-1); }}
              aria-label="Previous"
              className="absolute left-3 flex h-12 w-12 items-center justify-center text-3xl text-champagne/70 hover:text-champagne sm:left-8"
            >
              ‹
            </button>
            <motion.img
              key={images[lightbox]}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={springs.smooth}
              src={images[lightbox]}
              alt={`${active.alt} ${lightbox + 1}`}
              className="max-h-[88vh] max-w-[92vw] object-contain shadow-lift"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={(e) => { e.stopPropagation(); step(1); }}
              aria-label="Next"
              className="absolute right-3 flex h-12 w-12 items-center justify-center text-3xl text-champagne/70 hover:text-champagne sm:right-8"
            >
              ›
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
