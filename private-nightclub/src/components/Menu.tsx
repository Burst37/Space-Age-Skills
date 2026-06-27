"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  foodMenu,
  bottleMenu,
  foodNote,
  bottleNote,
  foodSelectItems,
  drinkSelectItems,
  type MenuGroup,
  type MenuSelectItem,
} from "@/lib/site";
import { springs } from "@/lib/motion";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

type TabKey = "food" | "bottle";

const tabs: {
  key: TabKey;
  label: string;
  note: string;
  items: MenuSelectItem[];
  menu: MenuGroup[];
}[] = [
  { key: "food", label: "Late Night Kitchen", note: foodNote, items: foodSelectItems, menu: foodMenu },
  { key: "bottle", label: "Bottle Service", note: bottleNote, items: drinkSelectItems, menu: bottleMenu },
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
  const [selected, setSelected] = useState<number | null>(null);
  const active = tabs.find((t) => t.key === tab)!;
  const items = active.items;

  const close = useCallback(() => setSelected(null), []);
  const step = useCallback(
    (dir: number) =>
      setSelected((i) => (i === null ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  useEffect(() => {
    if (selected === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight" || e.key === "ArrowDown") step(1);
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") step(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [selected, close, step]);

  const detail = selected !== null ? items[selected] : null;

  return (
    <section id="menu" className="relative bg-black px-5 py-24 sm:px-8 lg:py-32">
      <div className="mx-auto max-w-edge">
        <SectionHeading
          eyebrow="The Menu"
          title={<>Food and bottle service</>}
          intro="Every item shot in the room. Tap a card to open it full-screen with the details."
        />

        {/* Tabs */}
        <Reveal delay={0.05}>
          <div className="mt-10 flex gap-3" role="tablist" aria-label="Menu sections">
            {tabs.map((t) => (
              <button
                key={t.key}
                role="tab"
                aria-selected={tab === t.key}
                onClick={() => {
                  setTab(t.key);
                  setSelected(null);
                }}
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

        {/* Bento court — the cards rest here; tap one to open the split view */}
        <Reveal
          delay={0.1}
          className="mt-8 columns-2 gap-3 sm:gap-4 md:columns-3 lg:columns-4 [&>*]:mb-3 sm:[&>*]:mb-4"
        >
          {items.map((it, i) => (
            <button
              key={it.img}
              onClick={() => setSelected(i)}
              aria-label={`View ${it.name}`}
              className="group block w-full overflow-hidden border border-gold/12 bg-soft-black transition-colors hover:border-gold/40"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.img}
                alt={it.name}
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

      {/* Split-screen detail — opens when a bento card is chosen */}
      <AnimatePresence>
        {detail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[70] bg-black/96 backdrop-blur-sm"
            onClick={close}
          >
            <button
              onClick={close}
              aria-label="Close"
              className="absolute right-5 top-5 z-10 flex h-11 w-11 items-center justify-center border border-gold/30 text-2xl text-champagne hover:border-gold"
            >
              ×
            </button>

            <div
              className="mx-auto grid h-full max-w-6xl grid-cols-1 items-center gap-6 px-5 py-16 md:grid-cols-2 md:gap-12 md:px-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Left: the chosen card, large */}
              <div className="relative flex h-[42vh] items-center justify-center md:h-[78vh]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={detail.img}
                    src={detail.img}
                    alt={detail.name}
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={springs.smooth}
                    className="max-h-full max-w-full object-contain shadow-lift"
                  />
                </AnimatePresence>
              </div>

              {/* Right: the details */}
              <div className="flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={detail.name}
                    initial={{ opacity: 0, y: 18 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.4 }}
                  >
                    <span className="text-[0.7rem] uppercase tracking-brand text-gold/80">
                      {detail.category}
                    </span>
                    <h3 className="display mt-3 text-[clamp(2.4rem,5vw,4rem)] leading-[0.95] text-cream">
                      {detail.name}
                    </h3>
                    {detail.note && (
                      <p className="mt-4 max-w-sm text-base text-cream/55">{detail.note}</p>
                    )}
                    <div className="mt-7 flex items-baseline gap-3">
                      <span className="text-[0.66rem] uppercase tracking-wide2 text-cream/40">
                        {tab === "food" ? "Price" : "Bottle"}
                      </span>
                      <span className="display text-2xl text-champagne">${detail.price}</span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Step controls */}
                <div className="mt-10 flex items-center gap-4">
                  <button
                    onClick={() => step(-1)}
                    aria-label="Previous item"
                    className="flex h-11 w-11 items-center justify-center border border-gold/30 text-xl text-champagne transition-colors hover:border-gold hover:text-cream"
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => step(1)}
                    aria-label="Next item"
                    className="flex h-11 w-11 items-center justify-center border border-gold/30 text-xl text-champagne transition-colors hover:border-gold hover:text-cream"
                  >
                    ›
                  </button>
                  <span className="ml-2 text-xs uppercase tracking-wide2 text-cream/40">
                    {String(selected! + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
