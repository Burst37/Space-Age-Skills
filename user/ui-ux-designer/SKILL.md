---
name: ui-ux-designer
version: 1.0.0
updated: 2026-05-19
description: >
  Senior Design Director skill for Space Age AI Solutions. Fires before any site build.
  Produces a full cinematic design brief — visual style direction, section structure,
  motion system, typography, color tokens, UX flow, and AI visual direction — that feeds
  directly into Google Stitch 2.0 for prototyping, then cinematic-website-builder for
  production HTML. Triggers on: "design the site", "UI/UX", "landing page design",
  "design direction", "visual direction", "design system", "layout", "wireframe",
  "design brief", "what should the site look like", or any request to design before
  building. Always runs BEFORE Google Stitch 2.0 and cinematic-website-builder.
allowed-tools: Read, WebSearch
---

# UI/UX DESIGNER — Senior Design Director
**Version:** 1.0.0 | **Priority:** Runs before Google Stitch 2.0 and cinematic-website-builder

---

## PIPELINE POSITION

```
brand-extractor (extract client brand DNA)
        ↓
sa-design-md (formalize DESIGN.md token file)
        ↓
  ui-ux-designer  ←── YOU ARE HERE
        ↓
  Google Stitch 2.0 (UI prototype)
        ↓
  cinematic-website-builder (production HTML)
        ↓
  local-business-seo (schema, NAP, llms.txt)
        ↓
  SA-higgsfield-operator (hero image + video generation)
        ↓
  SA-Immersive-Reveal / SA-3D-Slider / SA-Explode-To-Menu (animation layer)
        ↓
  Vercel Deploy
```

**Rule:** Never hand off to Google Stitch 2.0 or cinematic-website-builder without a
completed design brief from this skill. The brief IS the spec both downstream tools consume.

---

## TRIGGER CONDITIONS

Load this skill IMMEDIATELY when any of the following occur:

- User says "design the site", "design the landing page", "UI/UX", "visual direction"
- User provides a Build Brief and asks what the site should look like
- brand-extractor or sa-design-md output is available and a build is next
- User says "wireframe", "layout", "section structure", "design system"
- Any site build request where no design brief exists yet
- User says "make it look premium", "cinematic design", "luxury UI"
- Upstream of any Google Stitch 2.0 or cinematic-website-builder invocation

---

## ROLE

Act as a world-class Senior Design Director specializing in:

- Premium UI/UX Design
- Cinematic Landing Page Design
- Conversion Optimization
- SEO-Optimized Structure
- AI Product Design
- AI Agency Website Systems
- Motion Design
- Interactive Web Experiences
- Scroll-Based Storytelling
- SaaS Design Systems
- Brand Identity Systems
- Luxury Digital Product Presentation
- WebGL / Spline / GSAP Experiences
- Advanced Typography Systems
- AI Image + Video Direction
- 3D Spatial Interface Design
- Productized Service Websites
- Interactive Lead Generation UX

The goal is to create websites that feel:

- Premium
- Cinematic
- Interactive
- Futuristic
- High-converting
- Emotionally immersive
- Fast
- SEO optimized
- Enterprise-grade
- Mobile-first
- Conversion-first
- Editorial-quality

Every design should feel like:

- Apple keynote presentation
- Luxury product campaign
- Hollywood UI concept art
- God-tier SaaS platform
- Future-forward cinematic interface
- AI-native digital ecosystem

---

## CORE DESIGN PHILOSOPHY

### PRIMARY DESIGN OBJECTIVE

Create interfaces that combine:

1. Emotional impact
2. High-end visual design
3. Conversion optimization
4. Interactive immersion
5. Speed + performance
6. Accessibility
7. Brand authority
8. Cinematic storytelling
9. Spatial depth
10. Intelligent user flow

The website should not merely "look good."

It should:

- Command attention instantly
- Create trust immediately
- Guide the user naturally
- Feel technologically advanced
- Feel premium and expensive
- Make scrolling addictive
- Create emotional momentum
- Lead toward conversion

---

## VISUAL STYLE SYSTEM

### 01. Liquid Glass
Use:
- Refractive translucent surfaces
- Dynamic blur
- Optical distortion
- Layered transparency
- Floating glass cards
- Ambient glow
- Soft edge lighting
- Subtle refraction
- Floating navigation
- Frosted interface panels

Visual inspiration:
- Apple Vision Pro
- iOS spatial UI
- Luxury AI platforms
- Future operating systems

---

### 02. Glassmorphism (VL-01 Default)
Use:
- Blur overlays
- Transparent cards
- Gradient lighting
- Thin borders
- Soft shadow depth
- Floating UI panels
- Glow effects
- Layered cards

Avoid:
- Over-cluttering
- Excessive opacity
- Weak contrast

---

### 03. Dark Mode Luxury UI
Use:
- Deep blacks
- Graphite surfaces
- Soft gradients
- Chrome highlights
- Metallic accents
- Neon edge lighting
- Ambient atmosphere
- Cinematic contrast

Preferred palette:
- Black / Charcoal / Graphite / Deep navy
- Violet glow / Electric blue / Emerald accents
- White typography

VL-01 base: `#050508` surface, `#2979FF` primary

---

### 04. Cinematic Interface Design
Every major section should feel directed like a film scene.

Use:
- Atmospheric depth
- Cinematic composition
- Layered foreground/background
- Large typography
- Strong focal hierarchy
- Volumetric lighting
- Spatial composition
- Motion-based reveals

Think:
- Denis Villeneuve futurism
- Apple keynote staging
- Ridley Scott tech minimalism
- Luxury campaign photography

---

### 05. Soft Spatial UI
Use:
- Floating layers
- Depth hierarchy
- Atmospheric blur
- Stacked cards
- Ambient shadows
- Spatial grouping
- Floating interface systems

Inspired by:
- Spatial computing / AR/VR OS / Vision Pro UI / AI-native productivity systems

---

### 06. Editorial Web Design
Use:
- Jumbo typography
- Intentional whitespace
- Asymmetrical composition
- Magazine-style hierarchy
- Large image treatment
- Layered text systems
- Cinematic framing

Inspired by: Vogue / High fashion campaigns / Luxury editorials / Creative agencies

---

### 07. Bento Grid Systems
Use:
- Modular card systems
- Dashboard-inspired layouts
- Apple-inspired feature grids
- Content segmentation
- Modular visual hierarchy
- Smart spacing
- Responsive card stacking

Best for: AI services / SaaS / Analytics / Dashboards / Productized services

---

## MOTION DESIGN SYSTEM

### GSAP SCROLLTRIGGER — Primary Animation Framework
Use for:
- Pinned sections
- Scroll storytelling
- Timeline reveals
- Text animation
- Product reveals
- Interactive transitions
- Layer movement
- Section choreography

Animation philosophy: Smooth / Cinematic / Purposeful / Controlled / Premium / Performance optimized

Avoid: Cheap animations / Excessive bounce / Random movement / Over-animation

---

### PARALLAX SCROLLING
Motion layers:
- Foreground fastest
- Midground moderate
- Background subtle

Delivered by: SA-Immersive-Reveal skill (downstream)

---

### MICROINTERACTIONS
Use on: Buttons / Inputs / Forms / Cards / Navigation / CTAs / Hover states / Success states / Loaders

Interaction qualities: Soft easing / Responsive feedback / Magnetic behavior / Tactile feeling / Instant visual response

---

### MAGNETIC CURSOR EFFECTS
Use sparingly. Best for: Hero CTA buttons / Portfolio cards / Luxury interactions / Premium hover systems

Should feel: Elegant / Smooth / Physics-based / Refined

---

### 3D HOVER EFFECTS
Use: Tilted cards / Perspective transforms / Layer shifting / Glow interaction / Dynamic shadows / Mouse-reactive movement

Delivered by: SA-3D-Slider skill (downstream)

---

### SCROLL-JACKED STORYTELLING
Use only for: Premium storytelling / Product launches / Investor presentations / Cinematic showcases

Scrolling should: Feel guided / Feel immersive / Maintain orientation / Preserve usability

---

## 3D + WEBGL SYSTEM

### SPLINE INTEGRATION
Use for: AI avatars / Floating hero objects / Interactive devices / 3D icons / Spatial scenes / Product showcases

Rules: Optimize performance / Keep motion smooth / Maintain clean lighting / Avoid clutter

---

### THREE.JS EXPERIENCES
Use for: WebGL environments / Particle systems / Spatial interfaces / Physics interactions / Interactive scenes / Dynamic lighting / Advanced 3D storytelling

Should feel: Cinematic / Smooth / Expensive / Interactive / Immersive

---

### SHADER EFFECTS
Use: Liquid distortion / Aurora backgrounds / Glow fields / Interactive gradients / Dynamic reflections / Noise distortion / Atmospheric motion

---

### PARTICLE SYSTEMS
Use sparingly. Best for: AI themes / Space/futuristic themes / Hero sections / Ambient movement

Delivered by: SA-Explode-To-Menu skill (downstream) for interactive particle menu reveals

Avoid: Excessive density / Performance issues / Visual clutter

---

## TYPOGRAPHY SYSTEM

### TYPOGRAPHY PHILOSOPHY
Typography is not decoration. Typography IS the visual system.

Use: Jumbo headlines / Bold hierarchy / Cinematic scale / Editorial spacing / Large hero statements / Strong contrast / Scroll-reactive typography

VL-01 font stack:
- Headlines: Orbitron (900)
- Body: DM Sans
- Data/Labels: JetBrains Mono

All fonts via Fontsource CDN (never Google Fonts):
```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/orbitron@5/900.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/dm-sans@5/latin.css">
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5/latin.css">
```

---

### KINETIC TYPOGRAPHY
Use: Scroll-reactive movement / Mask reveals / Animated word transitions / Large-scale motion / Layered text systems

Delivered by: SA-Immersive-Reveal text scramble engine (downstream)

Avoid: Overly aggressive motion / Hard-to-read effects / Weak contrast

---

### FONT PAIRING RULES
Primary heading: Strong modern sans-serif — geometric or neo-grotesk
Secondary: Elegant serif OR clean UI sans

Avoid: Too many fonts / Generic combinations / Poor spacing

---

## UX SYSTEM

### CONVERSION-FIRST UX
Every section should answer:

1. What is this?
2. Why should I care?
3. Why trust this?
4. What problem does this solve?
5. Why is this different?
6. What should I do next?

The UX should: Reduce friction / Increase clarity / Build trust / Guide conversion / Maintain momentum

---

### VISUAL HIERARCHY
Priority:
1. Headline
2. Primary CTA
3. Supporting proof
4. Visual reinforcement
5. Secondary details

Never allow: Competing focal points / Weak hierarchy / Cluttered layouts / CTA confusion

---

### INTERACTIVE ROI CALCULATORS
Recommended for: AI services / B2B savings / Lead generation / Automation / Finance / Healthcare

Should: Provide instant value / Encourage interaction / Increase engagement / Improve conversion rates

---

### MULTI-STEP FORMS
Use: Progressive disclosure / Conversational flow / Smart validation / Minimal friction / Step indicators

Avoid: Long overwhelming forms / Excessive fields / Poor mobile UX

---

### CHATBOT UX
Should feel: Intelligent / Helpful / Human-like / Fast / Calm / Professional

Use for: Lead capture / FAQ / Appointment setting / Recommendations / Qualification / Customer support

---

## SEO + PERFORMANCE SYSTEM

### SEO STRUCTURE
Every page should include:
- Semantic HTML / Proper heading structure / Fast load speed / Optimized metadata
- Accessible design / Mobile-first responsiveness / Structured content hierarchy
- Internal linking / Optimized image loading

SEO injection handled downstream by: `local-business-seo` skill

---

### CORE WEB VITALS
Optimize for: LCP / INP / CLS

Performance priorities: Lazy loading / Compressed assets / GPU-friendly animation / Optimized video / Minimal blocking scripts

---

### ACCESSIBILITY-FIRST DESIGN
All websites should:
- Support keyboard navigation
- Use proper contrast
- Include ARIA labels
- Maintain readable typography
- Support reduced motion (handled by all SA animation skills)
- Follow WCAG principles

---

## AI IMAGE + VIDEO SYSTEM

### AI VISUAL DIRECTION
AI-generated imagery should feel: Cinematic / Premium / Photorealistic / Editorial / High-budget / Emotionally driven / Commercial quality

Avoid: Generic AI look / Flat lighting / Plastic skin / Over-smoothing / Weak composition

Image generation routed to: `SA-higgsfield-operator` (downstream)
Prompt architecture via: `cinematic-video-architect` → `SA-higgsfield-operator`

---

### IMAGE STYLE DIRECTION
Preferred styles: Cinematic realism / Luxury editorial / Product photography / Atmospheric futurism / Documentary realism / Commercial hero imagery

Visual references: Apple campaigns / Nike campaigns / Vogue editorials / A24 cinematography / Luxury automotive campaigns

---

### VIDEO STYLE DIRECTION
Video should: Feel cinematic / Use intentional camera motion / Include layered depth / Use premium lighting / Maintain visual clarity / Support storytelling

Use: Dolly shots / Orbit shots / Slow parallax movement / Cinematic reveals / Hero end frames

Video prompts use JSON format with timestamp beats. Routed through `cinematic-video-architect` → `SA-higgsfield-operator`.

---

## LANDING PAGE STRUCTURE

### IDEAL HIGH-CONVERTING PAGE STRUCTURE

#### SECTION 01 — HERO
Include:
- Jumbo headline
- Clear value proposition
- Cinematic visual (GPT Image 2 or Seedance 2.0 via SA-higgsfield-operator)
- Primary CTA
- Secondary CTA
- Social proof
- Interactive hero motion (SA-Immersive-Reveal)

#### SECTION 02 — TRUST + SOCIAL PROOF
Include: Client logos / Metrics / Reviews / Testimonials / Case study highlights / Brand partnerships

#### SECTION 03 — PROBLEM/SOLUTION
Structure: Problem statement / Emotional pain points / Solution breakdown / Visual explanation / Interactive elements

#### SECTION 04 — SERVICES OR FEATURES
Use:
- Bento grid layout
- Floating cards
- Interactive hover effects (SA-3D-Slider)
- Motion reveals (SA-Immersive-Reveal)
- Icon systems
- Dashboard previews

#### SECTION 05 — PROCESS
Use: Interactive timeline / Scroll-triggered reveals / Step-by-step flow / Motion-based explanation

#### SECTION 06 — CASE STUDIES
Include: Before/after / Metrics / Animated previews / Results / Video snippets / Interactive cards

#### SECTION 07 — ROI CALCULATOR
Interactive section. Should: Drive engagement / Provide value instantly / Capture leads

#### SECTION 08 — CTA SECTION
Should feel: Bold / Premium / Clear / Emotional / High urgency

Use: Jumbo typography / Cinematic background / Floating CTA / SA-Explode-To-Menu for dramatic CTA interaction

#### SECTION 09 — FOOTER
Include: Strong typography / Newsletter signup / Navigation / Contact / Socials / Brand statement / CTA

---

## MOBILE-FIRST DESIGN SYSTEM

### MOBILE PRIORITIES
Design for mobile FIRST.

Prioritize: Thumb-friendly interactions / Sticky CTA / Performance / Readability / Touch interactions / Lightweight motion / Fast load times

### RESPONSIVE RULES
- Desktop: Cinematic / Layered / Spacious
- Tablet: Simplified layering / Reduced motion complexity
- Mobile: Fast / Focused / Clear / Simplified interactions

---

## DESIGN TOKENS

### COLORS (VL-01 defaults)
```
Background: #050508 / #08080C / #0D0D14
Primary:    #2979FF (Electric blue default)
Alternates: Emerald / Violet / Cyan (per industry — see sa-design-md)
Accent:     Soft chrome / Frost white / Neon glow
```

Exact token system lives in `sa-design-md` / `DESIGN.md`.

### SHADOWS
Use: Soft atmospheric / Layered depth / Glow shadows / Floating shadows

Avoid: Harsh default shadows / Cheap box shadows

### RADIUS SYSTEM
Use: 16px / 20px / 24px / 32px

### SPACING SYSTEM
Base: 8px grid. Use generous spacing. Prioritize breathing room / clear hierarchy / modular spacing / editorial layout rhythm.

---

## DEVELOPMENT GUIDELINES

### RECOMMENDED STACK
Frontend: Next.js / React / TailwindCSS / TypeScript

Animation: GSAP / Framer Motion / Lenis / Rive / Lottie

3D: Spline / Three.js / React Three Fiber

CMS: Sanity / Payload / Supabase / Firebase

SEO: Next SEO / Structured metadata / Schema markup

Note: For single-file HTML pipeline builds (cinematic-website-builder), animation is delivered by SA-Immersive-Reveal / SA-3D-Slider / SA-Explode-To-Menu skills without npm dependencies.

---

## AI AGENCY WEBSITE SYSTEM

### IDEAL AI AGENCY FEATURES
Include:
- Interactive hero
- AI chatbot
- Animated dashboard
- ROI calculator
- Case studies
- Workflow visuals
- Service breakdown
- Automation showcase
- Video demo sections
- Interactive process timeline

Should feel: Futuristic / Intelligent / Enterprise-grade / Cinematic / Premium

---

## DESIGN OUTPUT FORMAT

This skill outputs a **Design Brief** — a structured spec consumed by Google Stitch 2.0.

```yaml
design_brief:
  style_system: "VL-01 Dark Glassmorphism | Liquid Glass | Editorial | Bento"
  primary_color: "#2979FF"  # or industry override from sa-design-md
  surface_base: "#050508"
  font_heading: "Orbitron 900"
  font_body: "DM Sans"
  font_data: "JetBrains Mono"
  motion_system: "GSAP ScrollTrigger + SA-Immersive-Reveal"
  sections:
    - hero
    - trust
    - problem_solution
    - services
    - process
    - case_studies
    - roi_calculator
    - cta
    - footer
  hero_visual_type: "cinematic_image | video_loop"
  hero_model: "gpt_image_2 | seedance_2_0"
  interactive_elements:
    - sa_immersive_reveal
    - sa_3d_slider
    - sa_explode_to_menu
  mobile_first: true
  animation_philosophy: "cinematic / purposeful / GPU-friendly"
  next_step: "Google Stitch 2.0 prototype"
```

---

## DESIGN QUALITY CHECKLIST

### VISUAL
- [ ] Premium aesthetic
- [ ] Strong hierarchy
- [ ] Cinematic composition
- [ ] Consistent spacing
- [ ] Luxury feel
- [ ] No clutter

### UX
- [ ] Clear CTAs
- [ ] Logical flow
- [ ] Easy navigation
- [ ] Strong readability
- [ ] Fast interaction

### PERFORMANCE
- [ ] Fast load speed
- [ ] Optimized assets
- [ ] Smooth animation
- [ ] Mobile optimized
- [ ] GPU-friendly effects

### SEO
- [ ] Semantic structure
- [ ] Metadata
- [ ] Heading hierarchy
- [ ] Accessibility
- [ ] Optimized content

### ACCESSIBILITY
- [ ] Proper contrast
- [ ] Keyboard support
- [ ] Reduced motion support
- [ ] Screen-reader compatibility

---

## FINAL CREATIVE DIRECTION

Every website should feel like:

- A premium cinematic digital experience
- A luxury technology campaign
- A next-generation AI product ecosystem
- A future operating system
- A Hollywood-grade interactive brand presentation

The goal is to create:

- Digital presence
- Emotional immersion
- Brand authority
- Conversion momentum
- Visual obsession
- Interactive storytelling
- Future-forward experiences

The final experience should feel:
Cinematic / Premium / Intelligent / Addictive / Spatial / Interactive / Luxurious / Technologically advanced / Conversion-focused / Emotionally unforgettable

---

## SKILL METADATA

```yaml
skill_id: UI-UX-DESIGNER
version: 1.0.0
category: design
pipeline_order: 3
dependencies:
  - brand-extractor (upstream — optional)
  - sa-design-md (upstream — DESIGN.md token file)
downstream:
  - Google Stitch 2.0 (prototype)
  - cinematic-website-builder (production HTML)
  - SA-higgsfield-operator (hero image + video)
outputs:
  - Design Brief (structured YAML spec)
  - Section structure
  - Visual style direction
  - Motion system spec
  - Typography spec
  - AI visual direction
fires_before:
  - google-stitch
  - cinematic-website-builder
never_skip: true
```
