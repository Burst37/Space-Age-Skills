# SAVO Templates

## 1. Fast SAVO Run Template

```yaml
savo_fast_run:
  project_read:
    business:
    industry:
    audience:
    offer:
    conversion_goal:
    assumption_notes:
  brand_dna:
    clarity_score:
    authority_score:
    innovation_score:
    luxury_score:
    trust_requirement:
    emotion_score:
    visual_risk_tolerance:
    motion_tolerance:
  creative_route:
    attention_strategy:
    story_strategy:
    trust_strategy:
    conversion_strategy:
    visual_style:
    motion_level:
    rejected_effects:
  blueprint:
    hero:
    section_sequence:
    proof_path:
    CTA_path:
    mobile_path:
  handoff:
    builder_target:
    key_components:
    motion_specs:
    QA_gates:
```

## 2. Full Discovery Report Template

```yaml
savo_discovery_report:
  source_inventory:
    client_owned:
      - source:
        confidence:
        extracted_value:
    competitors:
      - name:
        url:
        positioning:
        visual_style:
        CTA_strategy:
        proof_strategy:
        weakness:
    inspiration:
      - source:
        technique:
        extract:
        reject:
  brand_snapshot:
    name:
    category:
    tone:
    offer:
    current_message:
    audience:
    current_CTA:
    trust_assets:
    gaps:
  market_gap:
    generic_competitor_patterns:
    elite_patterns:
    separation_opportunity:
```

## 3. Brand DNA Scoring Sheet

```yaml
brand_dna_scorecard:
  clarity:
    score_0_10:
    evidence:
    fix:
  authority:
    score_0_10:
    evidence:
    fix:
  innovation:
    score_0_10:
    evidence:
    fix:
  luxury:
    score_0_10:
    evidence:
    fix:
  trust_requirement:
    score_0_10:
    evidence:
    fix:
  emotion:
    score_0_10:
    evidence:
    fix:
  visual_risk_tolerance:
    score_0_10:
    evidence:
    fix:
  motion_tolerance:
    score_0_10:
    evidence:
    fix:
  final_route:
```

## 4. Figma / Stitch Prompt Template

```markdown
You are designing a Figma/Stitch blueprint for [BUSINESS].

## Project Read
- Industry: [INDUSTRY]
- Audience: [AUDIENCE]
- Offer: [OFFER]
- Primary CTA: [CTA]
- Trust requirement: [LOW/MEDIUM/HIGH/CRITICAL]
- Creative route: [ROUTE]

## Mandatory Foundations
Use jumbo typography, fullscreen video-first hero logic, premium spacing, strong hierarchy, cinematic composition, and a memorable first impression.

## Strategic Direction
The page must capture attention through [ATTENTION STRATEGY], tell the story through [STORY ROUTE], build trust with [PROOF STRATEGY], and convert through [CONVERSION PATH].

## Visual System
- Color: [TOKENS]
- Typography: [TYPE SYSTEM]
- Layout: [LAYOUT GENE]
- Material: [MATERIAL ROUTE]
- Imagery/video: [ASSET STYLE]

## Required Sections
1. Hero — fullscreen/video-first, clear headline, visible CTA, first trust cue.
2. Problem or context — show why the visitor should care.
3. Offer/process — explain what the business does and how it works.
4. Proof — testimonials, results, case studies, reviews, certifications, or authority markers.
5. Objections/FAQ — remove friction.
6. Final CTA — repeat action with low friction.

## Mobile Rules
Stack sections cleanly. Keep CTA visible. Simplify motion. Avoid horizontal-only experiences.

## Avoid
No generic centered hero with three cards. No fake stats. No AI-purple gradient. No decorative motion without conversion purpose. No cluttered hero.
```

## 5. Universal Build Handoff Template

```yaml
universal_build_handoff:
  objective:
  target_builder:
  stack:
    framework:
    styling:
    motion:
    deployment:
  files_to_create_or_modify:
  design_tokens:
    colors:
    typography:
    spacing:
    radius:
    shadow:
    surfaces:
  components:
    - name: Header
      purpose:
      states:
      accessibility:
    - name: HeroVideoSection
      purpose:
      content:
      media_strategy:
      CTA:
      fallback:
    - name: ProofStrip
      purpose:
    - name: StorySection
      purpose:
    - name: OfferGrid
      purpose:
    - name: ConversionSection
      purpose:
  motion_specs:
    library:
    scroll_triggers:
    component_transitions:
    reduced_motion:
    cleanup:
  responsive_specs:
    breakpoints:
    mobile_reflow:
    sticky_CTA:
  accessibility_specs:
    focus_states:
    keyboard_controls:
    contrast:
    video_alt_or_controls:
  performance_specs:
    LCP:
    video_optimization:
    image_optimization:
    lazy_loading:
  SEO_specs:
    metadata:
    schema:
    headings:
  analytics:
    events:
  acceptance_criteria:
    - hero communicates offer within 5 seconds
    - CTA visible without scroll on desktop and mobile
    - proof path exists before high-friction CTA
    - reduced motion works
    - mobile layout is not broken
    - no fake proof or placeholder metrics
  verification_commands:
    - npm run lint
    - npm run typecheck
    - npm run build
```

## 6. Pattern Genome Template

```yaml
pattern_genome:
  gene_id:
  name:
  category: attention | story | layout | motion | material | trust | conversion
  source_inspiration:
  strategic_purpose:
  use_when:
  avoid_when:
  implementation_path:
  component_states:
  motion_logic:
  mobile_fallback:
  accessibility_rule:
  performance_rule:
  failure_conditions:
```

## 7. QA Report Template

```yaml
savo_QA_report:
  strategic_QA:
    pass:
    issues:
  brand_DNA_QA:
    pass:
    issues:
  visual_QA:
    pass:
    issues:
  motion_QA:
    pass:
    issues:
  trust_QA:
    pass:
    issues:
  conversion_QA:
    pass:
    issues:
  accessibility_QA:
    pass:
    issues:
  performance_QA:
    pass:
    issues:
  builder_readiness_QA:
    pass:
    issues:
  final_decision:
    status: approved | revise | reject
    required_fixes:
```
