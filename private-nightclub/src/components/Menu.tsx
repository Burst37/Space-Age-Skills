"use client";

import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  foodNote,
  bottleNote,
  foodSelectItems,
  drinkSelectItems,
  type MenuSelectItem,
} from "@/lib/site";
import { track } from "@/lib/track";
import SectionHeading from "./ui/SectionHeading";
import Reveal from "./ui/Reveal";

type TabKey = "food" | "bottle";

const tabs: {
  key: TabKey;
  label: string;
  note: string;
  items: MenuSelectItem[];
}[] = [
  { key: "food", label: "Late Night Kitchen", note: foodNote, items: foodSelectItems },
  { key: "bottle", label: "Bottle Service", note: bottleNote, items: drinkSelectItems },
];

/** Real, standard bottle specs. Most spirits are 40% ABV / 750ml; overrides
 *  below are the genuine label figures. Used only for the Bottle tab. */
const BOTTLE_ABV: Record<string, string> = {
  "Makers Mark": "45%",
  "Woodford Reserve": "45.2%",
  "Deep Eddy's Lime": "35%",
  "Deep Eddy's Lemon": "35%",
  "Luc Belaire Rare Luxe": "12.5%",
  "Luc Belaire Brut Gold": "12.5%",
  "Luc Belaire Bleu": "12.5%",
  "Luc Belaire Luxe Rose": "12.5%",
};
function bottleSpecs(item: MenuSelectItem): { k: string; v: string }[] {
  return [
    { k: "Size", v: "750ml" },
    { k: "ABV", v: BOTTLE_ABV[item.name] ?? "40%" },
  ];
}

/** The full menu as a clickable priced list, grouped by category. Each row maps
 *  back to its index in the flat items array so picking opens the same detail. */
function MenuList({
  items,
  onPick,
}: {
  items: MenuSelectItem[];
  onPick: (idx: number) => void;
}) {
  const groups: { cat: string; rows: { item: MenuSelectItem; idx: number }[] }[] = [];
  items.forEach((item, idx) => {
    let g = groups.find((x) => x.cat === item.category);
    if (!g) {
      g = { cat: item.category, rows: [] };
      groups.push(g);
    }
    g.rows.push({ item, idx });
  });

  return (
    <div className="columns-1 gap-12 md:columns-2 [&>*]:break-inside-avoid">
      {groups.map((g) => (
        <div key={g.cat} className="mb-9">
          <h4 className="mb-4 border-b border-gold/20 pb-2 text-sm uppercase tracking-wide2 text-gold">
            {g.cat}
          </h4>
          <ul className="space-y-2.5">
            {g.rows.map(({ item, idx }) => (
              <li key={item.img}>
                {/* Skeuomorphic liquid-glass pill — same gold language as the
                    Reserve button, rounded into a capsule with a glass rim and
                    top highlight. Fills with gold on hover. */}
                <button
                  onClick={() => onPick(idx)}
                  className="group flex min-h-[3rem] w-full items-center justify-between gap-3 rounded-full border border-gold/25 bg-white/[0.04] px-5 py-2.5 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-md transition-all duration-300 hover:border-gold/70 hover:bg-gold/10 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.12),0_10px_26px_-10px_rgba(201,162,77,0.55)]"
                >
                  <span className="text-sm text-cream/90 transition-colors group-hover:text-champagne">
                    {item.name}
                  </span>
                  <span className="shrink-0 text-sm font-medium text-champagne">
                    ${item.price}
                  </span>
                </button>
              </li>
            ))}
          </ul>
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
    <section id="menu" className="atmosphere relative lux-bg px-5 py-24 sm:px-8 lg:py-32">
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
                className={`rounded-full px-6 py-3 text-[0.7rem] uppercase tracking-wide2 transition-colors ${
                  tab === t.key
                    ? "bg-gold text-black shadow-[0_8px_24px_-10px_rgba(201,162,77,0.7)]"
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
          amount={0.05}
          className="mt-8 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4"
        >
          {items.map((it, i) => (
            <button
              key={it.img}
              onClick={() => {
                setSelected(i);
                track({ type: "menu", item: it.name, category: it.category, tab });
              }}
              aria-label={`View ${it.name}`}
              className="group relative block aspect-square w-full overflow-hidden rounded-3xl border border-gold/15 bg-soft-black transition-all duration-300 ease-out hover:-translate-y-1 hover:border-gold/55 hover:shadow-[0_18px_50px_-12px_rgba(201,162,77,0.45)]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={it.img}
                alt={it.name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
              {/* Name + price reveal on hover */}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/90 via-black/25 to-transparent p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="text-left">
                  <span className="block text-[0.7rem] uppercase tracking-wide2 text-cream">
                    {it.name}
                  </span>
                  <span className="text-[0.66rem] text-champagne">${it.price}</span>
                </span>
              </div>
            </button>
          ))}
        </Reveal>

        {/* The full menu — tap any line to open it large */}
        <Reveal delay={0.05} amount={0.05} className="mt-16">
          <div className="atmosphere relative border border-gold/15 bg-soft-black p-8 sm:p-12">
            <div className="mb-8 flex items-baseline justify-between gap-4">
              <h3 className="display text-3xl text-cream sm:text-4xl">
                {tab === "food" ? "Late Night Food Menu" : "Bottle Service Menu"}
              </h3>
              <span className="text-[0.62rem] uppercase tracking-wide2 text-gold/60">
                Tap any item
              </span>
            </div>
            <MenuList
              items={items}
              onPick={(idx) => {
                setSelected(idx);
                track({ type: "menu", item: items[idx].name, category: items[idx].category, tab });
              }}
            />
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

            {/* Push-pull: name scrolls in from the right (moving left), image
                scrolls in from the left (moving right) — opposite directions,
                both enlarging. Image rests on the right ~1/3, full height. */}
            <div
              className="grid h-full grid-cols-1 md:grid-cols-[1.7fr_1fr]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* LEFT — details */}
              <div className="order-2 flex flex-col justify-center overflow-hidden px-5 py-10 sm:px-10 md:order-1 md:py-16 md:pl-14 md:pr-10">
                <AnimatePresence mode="wait">
                  <motion.div key={detail.name} className="overflow-hidden">
                    <span className="text-[0.7rem] uppercase tracking-brand text-gold/80">
                      {detail.category}
                    </span>
                    {/* Name scrolls in to the LEFT + enlarges */}
                    <motion.h3
                      initial={{ x: 340, scale: 0.55, opacity: 0 }}
                      animate={{ x: 0, scale: 1, opacity: 1 }}
                      transition={{ duration: 2, ease: [0.65, 0, 0.35, 1] }}
                      className="display mt-2 whitespace-nowrap text-[clamp(2.6rem,7vw,5.5rem)] leading-[0.95] text-cream"
                    >
                      {detail.name}
                    </motion.h3>

                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      {detail.note && (
                        <p className="mt-4 max-w-md text-base leading-relaxed text-cream/60">
                          {detail.note}
                        </p>
                      )}

                      {/* Spec / macros chips */}
                      <div className="mt-6 flex flex-wrap gap-2.5">
                        <span className="border border-gold/20 px-3 py-1.5 text-[0.62rem] uppercase tracking-wide2 text-cream/60">
                          {detail.category}
                        </span>
                        <span className="border border-gold/20 px-3 py-1.5 text-[0.62rem] uppercase tracking-wide2 text-champagne">
                          ${detail.price}
                        </span>
                        {(detail.macros ?? (tab === "bottle" ? bottleSpecs(detail) : [])).map((m) => (
                          <span
                            key={m.k}
                            className="border border-gold/20 px-3 py-1.5 text-[0.62rem] uppercase tracking-wide2 text-cream/60"
                          >
                            {m.k} {m.v}
                          </span>
                        ))}
                      </div>

                      {/* Purchase buttons */}
                      <div className="mt-8 flex flex-wrap gap-3">
                        <a
                          href="#vip"
                          onClick={() => {
                            track({ type: "cta", label: `Order: ${detail.name}` });
                            close();
                          }}
                          className="rounded-full bg-gold px-7 py-3.5 text-[0.7rem] uppercase tracking-wide2 text-black shadow-[0_8px_24px_-10px_rgba(201,162,77,0.7)] transition-colors hover:bg-champagne"
                        >
                          {tab === "bottle" ? "Add to Bottle Service" : "Order at Your Table"}
                        </a>
                        <a
                          href="#vip"
                          onClick={() => {
                            track({ type: "cta", label: "Reserve (from menu)" });
                            close();
                          }}
                          className="rounded-full border border-gold/40 px-7 py-3.5 text-[0.7rem] uppercase tracking-wide2 text-champagne transition-colors hover:border-gold hover:text-cream"
                        >
                          Reserve a Table
                        </a>
                      </div>
                    </motion.div>
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

              {/* RIGHT — image scrolls in to the RIGHT + enlarges, full height */}
              <div className="relative order-1 h-[38vh] overflow-hidden md:order-2 md:h-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={detail.img}
                    src={detail.img}
                    alt={detail.name}
                    initial={{ x: -300, scale: 0.65, opacity: 0 }}
                    animate={{ x: 0, scale: 1, opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.3, ease: [0.65, 0, 0.35, 1] }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
