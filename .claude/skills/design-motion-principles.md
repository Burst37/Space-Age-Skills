---

## name: design-motion-principles description: "SA-enhanced motion and interaction design expert. Two modes: CREATE (build interactive components with purposeful motion) or AUDIT (review existing animations and catch AI-slop motion patterns). Covers Emil Kowalski restraint-first, Jakub Krehel production-polish, and Jhey Tompkins creative-experimentation philosophies. Adds Space Age extensions: VL-01 Dark Glassmorphism motion layer, cinematic scroll choreography, physics-based cursor interactions, and GSAP/ScrollTrigger/Motion integration for cinematic-website-builder handoff. Trigger on: any request involving animation, transition, hover state, micro-interaction, motion audit, or 'make it feel alive'."

# Design Motion Principles — SA-Enhanced Edition

## SCOPE

Web and app UI motion: HTML/CSS, React, Framer Motion / Motion, GSAP \+ ScrollTrigger, iOS/Android transitions. Space Age extension adds: VL-01 glassmorphism motion layer, cinematic site scroll choreography, cursor physics, and direct handoff to `cinematic-website-builder` (Modules 1–30).

---

## STEP 0: DETECT MODE (DO THIS FIRST)

| Signal | Mode |
| :---- | :---- |
| "build", "create", "add animation", "animate this", "implement", "make it feel…" | **CREATE** |
| "audit", "review", "evaluate", "check", "feedback on", "is this motion good" | **AUDIT** |
| Ambiguous | Ask: Create or Audit? |

---

## THE THREE DESIGNERS

- **Emil Kowalski** (Linear, ex-Vercel) — Restraint, speed, purposeful motion. Best for productivity tools.  
- **Jakub Krehel** (jakub.kr) — Subtle production polish. Best for shipped consumer apps.  
- **Jhey Tompkins** (@jh3yy) — Playful experimentation, CSS innovation. Best for creative sites and portfolios.

Each answers a different question:

- **Emil** — *"Should this animate at all?"*  
- **Jakub** — *"Is this subtle and polished enough for production?"*  
- **Jhey** — *"What could this become?"*

### Context → Designer Weighting

| Project Type | Primary | Secondary | Selective |
| :---- | :---- | :---- | :---- |
| Productivity tool (Linear, Raycast) | Emil | Jakub | Jhey (onboarding only) |
| Kids app / Educational | Jakub | Jhey | Emil (high-freq game) |
| Creative portfolio | Jakub | Jhey | Emil (high-freq interactions) |
| Marketing / landing page | Jakub | Jhey | Emil (forms, nav) |
| SaaS dashboard | Emil | Jakub | Jhey (empty states) |
| Mobile app | Jakub | Emil | Jhey (delighters) |
| E-commerce | Jakub | Emil | Jhey (product showcase) |
| **Space Age cinematic site** | **Jakub** | **Jhey** | **Emil (data/forms)** |
| **VL-01 glassmorphism dashboard** | **Emil** | **Jakub** | **Jhey (LED indicators)** |

---

## CORE PRINCIPLES (BOTH MODES)

### The Frequency Gate

Before any animation, ask how often users trigger it:

| Frequency | Recommendation |
| :---- | :---- |
| Rare (monthly) | Expressive motion welcome |
| Occasional (daily) | Subtle, fast motion |
| Frequent (100s/day) | No animation or instant transition |
| Keyboard-initiated | **Never animate** |

### Duration Guidelines

| Context | Duration |
| :---- | :---- |
| Productivity UI (Emil) | Under 300ms, 180ms ideal |
| Production polish (Jakub) | 200–500ms |
| Creative/playful (Jhey) | Whatever serves the effect |
| **Space Age cinematic reveals** | **600–900ms with spring** |
| **VL-01 micro-interactions** | **150–250ms** |

### The Golden Rule

"The best animation is that which goes unnoticed." Exception: Space Age cinematic sites where motion IS the brand experience.

### Accessibility is NOT Optional

Every animation must handle `prefers-reduced-motion`. No exceptions. Wrap GSAP contexts in `if (reduce) return;`. Use `useReducedMotion()` from Motion.

---

## SPACE AGE MOTION EXTENSIONS

### Extension A: VL-01 Glassmorphism Motion Layer

Applied to all Space Age dashboards, portals, and admin UIs.

**LED Dome Pulse (status indicators):**

@keyframes ledPulse {

  0%, 100% { box-shadow: 0 0 6px 2px var(--accent), inset 0 1px 0 rgba(255,255,255,0.12); }

  50% { box-shadow: 0 0 14px 6px var(--accent), inset 0 1px 0 rgba(255,255,255,0.18); }

}

.led-dome { animation: ledPulse 2.4s ease-in-out infinite; }

**Glass panel entrance (motion/react):**

\<motion.div

  initial={{ opacity: 0, backdropFilter: "blur(0px)", y: 20 }}

  animate={{ opacity: 1, backdropFilter: "blur(40px)", y: 0 }}

  transition={{ type: "spring", duration: 0.7, bounce: 0 }}

  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}

/\>

**Specular shimmer on hover:**

.glass-card::before {

  content: '';

  position: absolute;

  inset: 0;

  background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 100%);

  transform: translateX(-100%);

  transition: transform 0.6s ease;

}

.glass-card:hover::before { transform: translateX(100%); }

### Extension B: Cinematic Scroll Choreography

For `cinematic-website-builder` integration. Maps directly to Modules 1–30.

**Macro → Dolly → Orbit scroll sequence:**

// GSAP timeline — hero enters with macro wide pull, then dolly in

const tl \= gsap.timeline({

  scrollTrigger: {

    trigger: ".hero-section",

    start: "top top",

    end: "+=200%",

    scrub: 1.5,

    pin: true

  }

});

tl.fromTo(".hero-bg", { scale: 1.15 }, { scale: 1, ease: "none" })

  .fromTo(".hero-copy", { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: "power2.out" }, 0.2)

  .fromTo(".hero-sub", { opacity: 0 }, { opacity: 1 }, 0.5);

**Parallax depth stack:**

gsap.utils.toArray("\[data-parallax\]").forEach(el \=\> {

  const depth \= el.dataset.parallax || 0.2;

  gsap.to(el, {

    yPercent: \-100 \* depth,

    ease: "none",

    scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true }

  });

});

### Extension C: Physics-Based Cursor Interactions

For premium landing pages and cinematic sites with Module 10 cursor system.

**Magnetic button (motion/react — NEVER useState):**

"use client";

import { useRef } from "react";

import { motion, useMotionValue, useTransform, useSpring } from "motion/react";

export function MagneticButton({ children }) {

  const ref \= useRef(null);

  const x \= useMotionValue(0);

  const y \= useMotionValue(0);

  const springX \= useSpring(x, { stiffness: 150, damping: 15 });

  const springY \= useSpring(y, { stiffness: 150, damping: 15 });

  const handleMouseMove \= (e) \=\> {

    const rect \= ref.current.getBoundingClientRect();

    const cx \= rect.left \+ rect.width / 2;

    const cy \= rect.top \+ rect.height / 2;

    x.set((e.clientX \- cx) \* 0.4);

    y.set((e.clientY \- cy) \* 0.4);

  };

  return (

    \<motion.button

      ref={ref}

      onMouseMove={handleMouseMove}

      onMouseLeave={() \=\> { x.set(0); y.set(0); }}

      style={{ x: springX, y: springY }}

    \>

      {children}

    \</motion.button\>

  );

}

### Extension D: Text Reveal Techniques

Cinematic text reveals for hero headlines.

**Word-by-word stagger:**

const words \= headline.split(" ");

return (

  \<motion.h1\>

    {words.map((word, i) \=\> (

      \<motion.span

        key={i}

        style={{ display: "inline-block", overflow: "hidden" }}

        initial={{ clipPath: "inset(100% 0 0 0)" }}

        animate={{ clipPath: "inset(0% 0 0 0)" }}

        transition={{ duration: 0.6, delay: i \* 0.08, ease: \[0.16, 1, 0.3, 1\] }}

      \>

        {word}\&nbsp;

      \</motion.span\>

    ))}

  \</motion.h1\>

);

**Scramble decode (Orbitron headers for Space Age dashboard):**

const chars \= "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function scrambleTo(el, finalText, duration \= 800\) {

  let frame \= 0;

  const totalFrames \= duration / 16;

  const interval \= setInterval(() \=\> {

    el.textContent \= finalText.split("").map((char, i) \=\> {

      if (i \< Math.floor((frame / totalFrames) \* finalText.length)) return char;

      return chars\[Math.floor(Math.random() \* chars.length)\];

    }).join("");

    if (frame++ \>= totalFrames) { el.textContent \= finalText; clearInterval(interval); }

  }, 16);

}

---

## MOTION RECIPES QUICK REFERENCE

### Standard Enter (Jakub-grade production)

initial={{ opacity: 0, translateY: "calc(-100% \- 4px)", filter: "blur(4px)" }}

animate={{ opacity: 1, translateY: 0, filter: "blur(0px)" }}

transition={{ type: "spring", duration: 0.45, bounce: 0 }}

### Subtle Exit (never compete with what's entering)

exit={{ translateY: "-12px", opacity: 0, filter: "blur(4px)" }}

transition={{ duration: 0.2 }}

### Scroll Reveal Stagger (Motion, no GSAP needed)

\<motion.li

  initial={{ opacity: 0, y: 24 }}

  whileInView={{ opacity: 1, y: 0 }}

  viewport={{ once: true, amount: 0.3 }}

  transition={{ duration: 0.6, delay: i \* 0.06, ease: \[0.16, 1, 0.3, 1\] }}

/\>

### Spring Config Tokens

const springs \= {

  snappy:    { type: "spring", stiffness: 400, damping: 30 },  // UI feedback

  smooth:    { type: "spring", duration: 0.45, bounce: 0 },    // enters/exits

  elastic:   { type: "spring", stiffness: 100, damping: 10 },  // playful/kids

  cinematic: { type: "spring", duration: 0.9, bounce: 0.05 },  // Space Age reveals

};

### Easing Tokens

:root {

  \--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);

  \--ease-in-expo: cubic-bezier(0.7, 0, 0.84, 0);

  \--ease-spring: linear(0, 0.004, 0.016 /\* ... use generator \*/);

}

---

## GSAP CANONICAL SKELETONS

### Sticky Stack

"use client";

import { useRef, useEffect } from "react";

import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function StickyStack({ cards }) {

  const ref \= useRef(null);

  const reduce \= useReducedMotion();

  useEffect(() \=\> {

    if (reduce || \!ref.current) return;

    const ctx \= gsap.context(() \=\> {

      const cardEls \= gsap.utils.toArray(".stack-card");

      cardEls.forEach((card, i) \=\> {

        if (i \=== cardEls.length \- 1\) return;

        ScrollTrigger.create({

          trigger: card, start: "top top",

          endTrigger: cardEls\[cardEls.length \- 1\], end: "top top",

          pin: true, pinSpacing: false,

        });

        gsap.to(card, {

          scale: 0.92, opacity: 0.55, ease: "none",

          scrollTrigger: {

            trigger: cardEls\[i \+ 1\], start: "top bottom", end: "top top", scrub: true,

          },

        });

      });

    }, ref);

    return () \=\> ctx.revert();

  }, \[reduce\]);

  return (

    \<div ref={ref} className="relative"\>

      {cards.map((card, i) \=\> (

        \<div key={i} className="stack-card sticky top-0 min-h-\[100dvh\] flex items-center justify-center"\>

          {card}

        \</div\>

      ))}

    \</div\>

  );

}

### Horizontal Pan

"use client";

import { useRef, useEffect } from "react";

import { gsap } from "gsap";

import { ScrollTrigger } from "gsap/ScrollTrigger";

import { useReducedMotion } from "motion/react";

gsap.registerPlugin(ScrollTrigger);

export function HorizontalPan({ children }) {

  const wrap \= useRef(null);

  const track \= useRef(null);

  const reduce \= useReducedMotion();

  useEffect(() \=\> {

    if (reduce || \!wrap.current || \!track.current) return;

    const ctx \= gsap.context(() \=\> {

      const distance \= track.current.scrollWidth \- window.innerWidth;

      gsap.to(track.current, {

        x: \-distance, ease: "none",

        scrollTrigger: {

          trigger: wrap.current, start: "top top",

          end: () \=\> \`+=${distance}\`,

          pin: true, scrub: 1, invalidateOnRefresh: true,

        },

      });

    }, wrap);

    return () \=\> ctx.revert();

  }, \[reduce\]);

  return (

    \<section ref={wrap} className="relative overflow-hidden"\>

      \<div ref={track} className="flex h-\[100dvh\] items-center"\>{children}\</div\>

    \</section\>

  );

}

---

## FORBIDDEN PATTERNS

- **`window.addEventListener("scroll", ...)`** — BANNED. Use `useScroll()`, ScrollTrigger, IntersectionObserver, or CSS `animation-timeline`.  
- **`useState` for mouse position or scroll progress** — BANNED. Use `useMotionValue` \+ `useTransform`.  
- **`requestAnimationFrame` loops touching React state** — BANNED.  
- **GSAP without `ctx.revert()` cleanup** — BANNED. Always return cleanup.  
- **Mixing GSAP and Motion in the same component tree** — BANNED.  
- **Animation without `prefers-reduced-motion` guard when MOTION \> 3** — BANNED.  
- **Animating `top`, `left`, `width`, `height`** — BANNED. Only `transform` and `opacity`.

---

## ANTI-SLOP MOTION PATTERNS (AUDIT FLAGS)

When auditing, flag these as AI-slop:

1. **Bounce overuse** — Everything bounces. Professional apps don't bounce.  
2. **Uniform stagger** — All items delay by exactly 100ms. Use `i * 0.06`.  
3. **Linear easing everywhere** — Dead, robotic. Use springs or custom bezier.  
4. **Exit \= reverse of enter** — Lazy. Exits should be subtler and faster.  
5. **Hover scale 1.05 on everything** — Indiscriminate. Only interactive affordances.  
6. **3s+ infinite rotation/pulse on non-status elements** — Attention hijack.  
7. **Page-load stagger on 20+ items** — Forces user to wait. Cap at 8 items.  
8. **Animate on keyboard nav** — Accessibility violation. No exceptions.  
9. **Missing reduced-motion media query** — Vestibular disorder risk.  
10. **GSAP without cleanup** — Memory leak.

---

## HANDOFF TO CINEMATIC-WEBSITE-BUILDER

When motion scope exceeds UI components and enters full-page scroll choreography:

**Module mapping:**

- Module 1–3 (Scroll Reveals) → This skill CREATE mode  
- Module 4–7 (Parallax, Pinning) → GSAP Canonical Skeletons above  
- Module 8–10 (Cursor Physics) → Extension C above  
- Module 11–15 (Text Animations) → Extension D above  
- Module 16–20 (Section Transitions) → Cinematic Scroll Choreography above  
- Module 21–30 (Ambient / Environment) → Hand off to `cinematic-website-builder`

**Handoff signal:** When the user asks for "full-page animation architecture" or references Space Age cinematic sites, output the motion strategy brief and pass to `cinematic-website-builder` with module annotations.

---

## ACCESSIBILITY MANDATE

/\* All animations must have this block \*/

@media (prefers-reduced-motion: reduce) {

  \*, \*::before, \*::after {

    animation-duration: 0.01ms \!important;

    animation-iteration-count: 1 \!important;

    transition-duration: 0.01ms \!important;

    scroll-behavior: auto \!important;

  }

}

// Motion/React pattern

const reduce \= useReducedMotion();

const variants \= {

  hidden: reduce ? false : { opacity: 0, y: 24 },

  visible: { opacity: 1, y: 0 }

};

---

## OUTPUT FORMAT — AUDIT MODE

Audit output \= branded HTML report with:

1. **Summary scorecard** — per-designer rating (Emil / Jakub / Jhey / SA standard)  
2. **Per-finding cards** with looping live demos  
3. **Severity levels** — Critical (a11y), High (slop), Medium (refinement), Low (preference)  
4. **Fix code snippets** — drop-in replacements  
5. **SA-specific flags** — VL-01 violations, cinematic site standard gaps

