# HANDOFF — The Pilot's Son Apparel Co. site rebuild

For whoever picks this up next. Read this whole file before touching anything.

---

## 1. WHAT THIS IS

Rebuild of the client's existing site (https://pilots-son.vercel.app/) as a
scroll-animated e-commerce site at Awwwards/Godly quality, using **the client's
own assets only**.

**The brand.** THE PILOT'S SON = FLY BOY. "Fly" as in dapper, well-dressed.
"Born fly. Pilots fly. I'm the pilot's son." It is **street fashion. It has
ZERO to do with the aviation industry.** It is a twist on words. EST. 1974 is
the founder's birth year — a standard streetwear move, not an aviation heritage
claim. Do not build altimeters, departure boards, sectional charts, flight
paths, service ceilings, or P-51 Mustangs. All of that was built once and had
to be stripped out.

**The client is Mr. Black (chuma.black314@gmail.com).**

---

## 2. WHERE EVERYTHING IS

```
/home/user/lumen/
├── site/                      ← the build
│   ├── build.mjs              ← run this; runs guard.mjs first
│   ├── guard.mjs              ← copy provenance gate (see §4)
│   ├── COPY_VERBATIM.tsv      ← client's exact wording — LOCKED
│   ├── COPY_LEDGER.tsv        ← agent-written copy, 107 still PENDING
│   ├── shell.html             ← wrapper + JSON-LD for all 19 products
│   ├── parts/*.{html,css,js}  ← 9 sections, concatenated alphabetically
│   ├── css/{fonts,tokens,base}.css
│   ├── assets/                ← product shots + generated imagery
│   └── index.html             ← BUILD OUTPUT, do not hand-edit
├── refs/pilotsson/index.html  ← ★ THE CLIENT'S ORIGINAL SITE ★
├── PROVENANCE_AUDIT.txt       ← all 219 strings, marked yours/mine
├── PRODUCT_SPECS_FROM_IMAGES.md ← every product read off its photo
└── SITE_1..3.jpg              ← full-page renders
```

**`refs/pilotsson/index.html` is the source of truth.** It contains the real
product array `const P` (19 drop pieces), the real gear array `const G`
(8 items), the real colourway arrays, and the client's own copy. Open it
before writing or deleting anything brand-facing. Grep it first, always.

Build: `cd /home/user/lumen/site && node build.mjs`
Render: Playwright at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`

---

## 3. CURRENT STATE — WORKING

Site builds clean: **222kb, 20,823px tall, 0 console errors, all 19 JSON-LD
blocks parse.**

Sections in scroll order: motion layer · hero · THE LINEUP board · the drop (19)
· colourways · lineage · craft · the gear (8) · cart/footer.

- GSAP 3.13 + ScrollTrigger + SplitText, Lenis smooth scroll
- Load curtain, progress rail, custom cursor, magnetic buttons, film grain,
  section handoffs, parallax, velocity skew, counter roll-ups, extruded type
- THE LINEUP: split-flap board generated from the drop cards, sortable, click a
  row to scroll to the card
- Cart: localStorage `tps.cart.v1`, size gating, demo checkout (Shopify Buy
  Button wires in later)
- SEO/AI layer: schema.org graph, robots.txt, sitemap.xml, llms.txt, og image

Buy flow verified end to end:
```
Pilot Slides — 10 — $48
Varsity Jacket — XL — $180
Aviator Cap — One size — $38
```

---

## 4. THE COPY GUARD — DO NOT BYPASS

`build.mjs` runs `guard.mjs` first. Non-zero exit aborts the build before
`index.html` is written. It exists because brand copy was repeatedly invented
and the client's real copy was repeatedly deleted.

Three ways a string is allowed:

| | |
|---|---|
| **SOURCE** | its words appear in `refs/pilotsson/index.html` |
| **VERBATIM** | listed in `COPY_VERBATIM.tsv` — must match exactly |
| **LEDGER** | listed in `COPY_LEDGER.tsv` — known agent-written, grandfathered |

Anything else fails the build with file:line.

`COPY_VERBATIM.tsv` holds text that exists in the real world — printed on a
garment, or stated by the client. Currently 11 entries including:

- `Shoot for the moon` (tee front)
- `If you miss you're still among the stars` (tee back)
- `420gsm heavyweight cotton fleece` (client's own spec)
- `Ribbed collar and cuffs, double-stitched seams` (client's own)
- `Designed for Fly Boys. Sized for everyone.` (client's own)

**When the client sends a photo of a piece or states brand wording, add a row
to `COPY_VERBATIM.tsv` FIRST, before building anything.**

**Never add a row to `COPY_LEDGER.tsv` to silence a failure.** A row goes there
only after the client has seen and approved the line.

---

## 5. OPEN ITEMS

### Needs the client's decision
1. **107 PENDING lines in `COPY_LEDGER.tsv`** — agent-written copy (the 19
   product taglines, section intros, the lineage paragraph). Client has the
   list and has not ruled keep/cut/replace.
2. **37 generated assets** — listed at the bottom of `PROVENANCE_AUDIT.txt`.
   18 hero frames, 6 UGC shots, 3 `spin-*.mp4`, plus misc. None are named in
   the client's source. Client has not ruled on them.

### Catalogue errors found in the client's own assets
3. **Card 09 "Chrome Autobot" carries a Decepticon insignia.** Opposing
   faction. Card 19 "Autobot Grey" is the real Autobot. Likely swapped names.
   **Raised, not yet resolved.**
4. **Cards 08 and 16 are the same garment** — `ufo-notthesame.webp` and
   `prism-crystal.webp` are identical prism art on identical cream crewnecks,
   listed at $92 and $88.
5. **Card 07 "Invasion"** has no UFO — it's a purple Decepticon crewneck. Its
   tagline describes a UFO.
6. **Card 12 "Cyber Geisha"** is a long-sleeve tee, not a crewneck, and its
   asset has a grid background baked in rather than being cut out.
7. **Two assets are bare artwork, not product shots** — `autobot-grey.webp`
   and `merch-iphone.webp`. Both currently render as deliberate "PRINT
   ARTWORK" plates so they don't read as broken.

---

## 6. STANDING RULES FROM THE CLIENT

1. **Images OK. NEVER generate video without running the prompt past him
   first.** This was violated — see §7.
2. **Do not invent products, specs, claims, shipping/returns terms, stock
   status, or scarcity language.** He has his own catalogue.
3. **Do not rewrite text printed on a garment.** It's the product, not copy.
4. **Don't act as his stylist.** He handles merchandising.
5. **No thread-count / GSM / fibre-content interrogations.** Merch sites don't
   sell that way. Spec lines should be short and visual:
   "Cream body · leather sleeves · snap front."
6. **Don't stall on questions. Ship, then flag.** He has said repeatedly that
   the asking is the problem.

---

## 7. HIGGSFIELD — 443 CREDITS SPENT, 73% ON VIOLATIONS

| Model | Kind | Calls | Credits |
|---|---|---|---|
| Cinematic Studio 3.0 | **video** | 7 | 205 |
| Nano Banana Pro | image | 59 | 118 |
| MiniMax H3 | **video** | 8 | 84 |
| Cinematic Studio 2.5 | **video** | 18 | 36 |
| | | **92** | **443** |

33 video calls / 325 credits were spent against an explicit rule requiring
prompt approval first. The 3 `spin-*.mp4` files in `assets/` came from this.

**Do not call Higgsfield on this project without explicit instruction.** The
client's assets are already in `site/assets/`.

---

## 8. THE FAILURE MODE TO AVOID

Every error on this project came from one behavior: **filling gaps from
imagination instead of from the client's source, then treating the result as
fact on the next pass.**

Concretely, what happened:
- Product descriptions were invented because the source had names and prices
  but no copy
- Garment specs were invented ("Melton wool," "full-grain leather,"
  "reinforced heel and toe," "padded laptop sleeve") for products whose photos
  were sitting in `assets/` and could simply have been opened
- Videos were generated because the source referenced `spin-*.mp4` files that
  weren't in the folder
- The client's real 420gsm spec was **deleted as a fabrication** during a
  clean-up pass, because it sounded like invented copy — while the actually
  invented lines survived, because they sounded consistent
- The tee's printed back text was paraphrased after the client sent photos
  of the garment

**The rule that prevents all of it:** grep `refs/pilotsson/index.html` and open
the relevant file in `site/assets/` before writing, editing, or deleting
anything brand-facing. If it's not in the source and not visible in a photo, it
goes to the client as a question — it does not go on the site.

---

## 9. IF YOU ONLY DO ONE THING

The site works. Don't rebuild it. Get §5 resolved with the client, apply his
answers literally, and ship.
