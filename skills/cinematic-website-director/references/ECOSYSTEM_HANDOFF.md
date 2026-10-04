# Ecosystem Handoff — Space Age Skill Wiring

This director is the **strategy and quality layer**. It routes into and out of the rest of
the Space Age stack rather than reimplementing it.

## Inbound — where work arrives from

| Source | Payload | What this skill does |
|---|---|---|
| `lead-to-brief` / n8n / scraped lead row | `build_brief` | **T0**. Skip the design loop. DNA-lite → build → 3-judge crucible. |
| `brand-extractor` | Brand Token Package (colors, type, tone, spacing) | Seed `DESIGN_DNA` directly; those tokens outrank defaults. |
| `ui-ux-designer` | Handoff Package (direction, moodboard letter, archetype) | Direction is **locked** — skip Phase C, go to Taste Lock. |
| `google-stitch` | Build Brief + layout variants | Treat as one candidate direction; still run typography and motion phases. |
| `page-upgrade` | Audit + gap analysis of an existing site | Constrains DNA to what can change; log immovable constraints. |
| `spaceage-savo-creative-director-os` | Creative strategy | Feeds Phase B; do not re-derive. |

**Rule:** if direction arrives already locked, do not re-open it. Re-litigating an
approved direction is drift, not diligence.

## Outbound — where work goes next

| Target | When | Pass |
|---|---|---|
| `cinematic-website-builder` | Every build using catalog effects | `MOTION_MAP`, `DESIGN_DNA`, `TYPOGRAPHY_SYSTEM`, effect numbers |
| `local-business-seo` | Every local/SMB build | Business NAP, service area, schema requirements |
| `shopify-cinematic-builder` | Shopify storefronts | Full artifact set + theme constraints |
| `outreach-copywriter` | Lead-gen pipeline after build | Site URL + hero claim |
| `higgsfield-video-studio` / `banana-pro-director-30` / `adobe-creative-suite` | Media generation | Art direction, aspect ratios, treatment from DNA |
| `sa-figma-framer-spline` | Design-system or Figma deliverable | Typography + color tokens |
| `design-motion-principles` | Motion audit before crucible | Motion map + built page |
| `gsap-core` / `gsap-scrolltrigger` / `gsap-timeline` | Implementation reference | — |

## Always-on Space Age layers

- `karpathy-guidelines` — think before coding, simplicity first, surgical changes. Applies
  to every line this skill produces.
- `icm-workspace-architect` — any build with more than 2 sequential stages gets a staged
  workspace, not an ad-hoc folder.
- `sa-obsidian-vault-ops` — read session memory at start, write completed work and pending
  tasks at end.
- `animation-vocabulary` — when the client describes a motion effect without knowing its
  name, resolve the term before designing it.

## Handoff packet shape

When passing to any downstream skill:
```yaml
handoff:
  from: cinematic-website-director
  tier: T0|T1|T2|T3
  artifacts: [DESIGN_DNA.md, TYPOGRAPHY_SYSTEM.md, MOTION_MAP.md, BUILD_CONTRACT.md]
  locked_decisions: []     # what the receiver may NOT change
  open_decisions: []       # what the receiver is expected to decide
  effects: []              # cinematic-website-builder module numbers
  constraints: []          # brand, legal, performance, stack
  next_action:
```

`locked_decisions` is the important field. A downstream skill that changes a locked
decision has caused drift — module 02's detector should catch it, and the QA ledger
records it at `high`.
