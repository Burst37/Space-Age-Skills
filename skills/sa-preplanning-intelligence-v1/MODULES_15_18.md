# SA Pre-Planning Intelligence v1 — Modules 15–18
## Gap-Fill Addendum from SAVO v2 Analysis

These 4 modules extend the core 14-module system. Add to Phase 0 (Modules 15, 18) and Phase 1 (Module 15) and Phase 2 (Module 17) run order.

---

### MODULE 15 — COMPETITIVE INTELLIGENCE & URL RESEARCH (G-15)
**Runs:** Phase 1, after Content Strategy, before SEO Intent Mapping
**Gap:** Module 10 covers analytics data but no structured competitive research from live URLs

**Research Protocol:**
```
COMPETITOR_INTEL:
  client_current_site:
    url: ""
    brand_tokens_extracted:
      primary_colors: []
      secondary_colors: []
      typography: []
      voice: []
      tagline: ""
      services: []
      proof_elements: []
      cta_patterns: []
    weak_points: []
    redesign_opportunities: []
  
  competitor_urls: []      # 3-5 direct competitors
  reference_urls: []       # 3-5 aspirational references
  
  for each url:
    positioning: ""
    offers: []
    pricing_signals: ""
    cta_style: ""
    design_style: [VL-01 | Liquid Glass | Brutalism | Premium Min | Cinematic]
    content_strength: []
    weaknesses: []
  
  market_gaps: []
  recommended_positioning: ""
  differentiation_strategy: ""
```

**Research Enrichment Tool:** Firecrawl or WebFetch for live URL extraction

**Output → SAVO Competitor Intelligence module:**
Validated competitive landscape replaces assumption-based competitor analysis in SAVO.

---

### MODULE 16 — AESTHETIC ROUTE PRE-SELECTION (G-16)
**Runs:** Phase 0, after Brief Intake, before any SAVO activation
**Gap:** SAVO produces creative direction but without an upfront aesthetic route commitment, designs risk defaulting to generic or mismatched styles

**Route Selection Protocol:**
```
AESTHETIC_ROUTE:
  selected: [VL_01_Dark_Glassmorphism | Liquid_Glass_Iridescent | Industrial_Brutalism | Premium_Minimalism | Cinematic_Editorial]
  
  route_selection_criteria:
    VL_01_Dark_Glassmorphism:
      use_for: [Space Age, dashboards, dark cinematic SaaS, premium AI systems]
      background: '#050508'
      accent: '#FF6B00'
      secondary_accent: lime green
      fonts: [Orbitron headers, DM Sans body, JetBrains Mono data]
    
    Liquid_Glass_Iridescent:
      use_for: [eyewear, luxury tech, fashion commerce]
      materials: [frosted glass, refraction, iridescent gradients]
    
    Industrial_Brutalism:
      use_for: [tactical tools, devtools, record exec, street tech]
      rules: [no radius, no soft shadows, mono labels, hard grid]
    
    Premium_Minimalism:
      use_for: [SaaS, B2B, trust-first local businesses]
      rules: [sparse layout, restrained motion, strong typography]
    
    Cinematic_Editorial:
      use_for: [artist campaigns, music, fashion, nightclub, brand launches]
      rules: [oversized typography, asymmetric composition, photo/video-forward]
  
  justification: ""      # why this route for this client
  exception_zones: []    # specific pages that deviate (e.g., checkout is Premium_Minimalism)
  
  font_rule:
    source: Fontsource only      # NEVER Google Fonts, NEVER Bunny Fonts
    chosen_heading: ""
    chosen_body: ""
    chosen_mono: ""              # for code/data elements
  
  color_contract:
    accent_1: ""                 # primary — ONE accent only
    accent_2: ""                 # secondary — must be intentional, not default
    background: ""
    surface: ""
    text_primary: ""
    text_secondary: ""
```

**Lock Rule:** Aesthetic route is fixed at pre-planning. SAVO and SA Visual Intelligence operate within this constraint, not the other way around.

---

### MODULE 17 — AI-SLOP PREVENTION PROTOCOL (G-17)
**Runs:** Phase 2 (Design Constraints), before Pattern Genome activation
**Gap:** No explicit anti-pattern audit in pre-planning; slop typically caught after implementation

**Slop Detection Pre-Audit (score each 0-10, total 0-60, above 30 = redesign required):**
```
SLOP_AUDIT:
  typography_score:
    deductions:
      - Using Inter without justification: -3
      - Weak heading/body hierarchy: -2
      - More than 3 font weights on one page: -2
      - Generic system font stack: -3
    
  layout_score:
    deductions:
      - Centered hero as default (not intentional): -3
      - Three equal cards as primary grid: -3
      - Repeated zigzag sections: -2
      - No asymmetry or visual tension: -2
    
  color_score:
    deductions:
      - AI purple gradient (#6366f1 family without justification): -3
      - Inconsistent accent usage: -2
      - Pure black (#000000) backgrounds: -2
      - More than 2 accent colors without design token justification: -3
    
  motion_score:
    deductions:
      - Bounce easing everywhere: -2
      - Missing prefers-reduced-motion: -4  # CRITICAL
      - Pointless decorative loops: -2
      - All elements animate on load: -2
    
  copy_score:
    deductions:
      - Use of "elevate", "unleash", "seamless", "next-gen", "revolutionary": -1 each
      - Em dashes in UI copy: -2
      - Hero subcopy > 20 words: -2
      - Fake statistics without source: -3
    
  imagery_score:
    deductions:
      - Fake product screenshots: -3
      - Generic gradient blobs as decoration: -2
      - Unrelated stock photography: -2
      - Missing real proof elements: -3
  
  total_slop_score: 0    # calculate
  slop_grade: [clean | caution | requires_redesign]
  
  mandatory_fixes: []    # any scoring that hits a CRITICAL flag must be fixed before handoff
```

**Pre-Design Slop Prevention Rules (enforce before first wireframe):**
```
prevention_rules:
  - one_accent_color: true          # locked, not negotiable
  - no_em_dashes_in_ui: true
  - fontsource_only: true           # no Google Fonts, no Bunny Fonts
  - no_inter_default: true
  - hero_headline_max_two_lines_desktop: true
  - subcopy_max_20_words: true
  - cta_visible_without_scroll: true
  - no_three_equal_card_default: true
  - no_fake_statistics: true
  - no_duplicate_cta_intent: true
  - reduced_motion_required: true
```

---

### MODULE 18 — AGENT ORCHESTRATION STRATEGY (G-18)
**Runs:** Phase 0, after Technical Architecture Pre-Decision (Module 13)
**Gap:** No pre-decision on which AI agents handle which phases; leads to inconsistent implementation across Claude Code, Codex, Cursor, Antigravity

**Agent Assignment Protocol:**
```
AGENT_ORCHESTRATION:
  primary_harness: [Claude Code | Codex CLI | Cursor | Antigravity | OpenCode]
  
  phase_assignments:
    pre_planning:      Claude Code          # this system
    creative_direction: Claude Code         # SAVO + SA Visual Intelligence
    design_system:     [Cursor | Claude Code]  # component library generation
    implementation:    [Codex CLI | Cursor | Antigravity]  # bulk file editing
    review_qa:         Claude Code          # adversarial review + code-review skill
    deployment:        [Claude Code | Codex CLI]
  
  multi_agent_rules:
    context_handoff_format: YAML build spec  # from SA Engineering OS
    review_gate_required_before_merge: true
    no_agent_skips_test_run: true
    karpathy_guardrails: active_all_phases
  
  subagent_strategy:                # for parallel work
    spec_reviewer: separate_agent
    implementer: separate_agent
    code_quality_reviewer: separate_agent
    subagent_handoff_format: "spec document with acceptance criteria"
  
  tool_routing:
    web_research: [WebFetch | WebSearch | Firecrawl]
    file_editing: [Edit | Write | NotebookEdit]
    code_execution: [Bash]
    github_ops: [mcp__github__*]
    knowledge_base: [obsidian-vault-os]
    design_exports: [Figma MCP | Framer]
```

**Harness Config Output:**
```
HARNESS_CONFIGS_TO_GENERATE:
  claude_code: CLAUDE.md        # from spaceage-os-v2/configs/master-claude.md template
  codex: AGENTS.md              # from spaceage-os-v2/configs/codex-agents.md template
  cursor: .cursorrules           # from spaceage-os-v2/configs/cursor-rules.md template
  antigravity: rules file        # from spaceage-os-v2/configs/antigravity-rules.md template
```

---

## UPDATED STACK LOAD ORDER (v1.1 with Modules 15-18)

```
PHASE 0: PROJECT INTAKE
  → MODULE 1:  Client Brief Intake
  → MODULE 13: Technical Architecture Pre-Decision
  → MODULE 16: Aesthetic Route Pre-Selection        ← NEW
  → MODULE 18: Agent Orchestration Strategy          ← NEW
  → MODULE 7:  Internationalization/Localization Planning
  → MODULE 14: Mobile-First Constraint Matrix

PHASE 1: CONTENT + INTENT
  → MODULE 2:  Content Strategy Integration
  → MODULE 15: Competitive Intelligence & URL Research  ← NEW
  → MODULE 3:  SEO Intent Mapping
  → MODULE 10: Real User Behavioral Data Integration

PHASE 2: DESIGN CONSTRAINTS
  → MODULE 5:  Accessibility-First Pre-Planning
  → MODULE 4:  Performance Budget Planning
  → MODULE 9:  Animation Performance Profiling
  → MODULE 17: AI-Slop Prevention Protocol           ← NEW
  → MODULE 8:  Design System Governance

PHASE 3: EXPERIENCE ARCHITECTURE
  → MODULE 11: Emotional Journey Mapping
  → MODULE 12: Micro-Interaction Planning Framework
  → MODULE 6:  A/B Testing Framework

PHASE 4: HANDOFF TO SAVO
  → Consolidated Pre-Planning Brief → SAVO activation
  → SAVO output → SA Visual Intelligence Engine v6
  → SA Visual Intelligence output → Framer Super Design
```

## FULL GAP TABLE (18 Modules)

| # | Module | Severity | Source |
|---|--------|----------|--------|
| G-01 | Client Brief Intake | CRITICAL | Original analysis |
| G-02 | Content Strategy | CRITICAL | Original analysis |
| G-03 | SEO Intent Mapping | HIGH | Original analysis |
| G-04 | Performance Budget | HIGH | Original analysis |
| G-05 | Accessibility-First | HIGH | Original analysis |
| G-06 | A/B Testing | MEDIUM | Original analysis |
| G-07 | i18n/l10n Planning | MEDIUM | Original analysis |
| G-08 | Design System Governance | HIGH | Original analysis |
| G-09 | Animation Performance | HIGH | Original analysis |
| G-10 | Real User Behavioral Data | MEDIUM | Original analysis |
| G-11 | Emotional Journey Mapping | MEDIUM | Original analysis |
| G-12 | Micro-Interaction Planning | MEDIUM | Original analysis |
| G-13 | Technical Architecture | HIGH | Original analysis |
| G-14 | Mobile-First Matrix | HIGH | Original analysis |
| G-15 | Competitive URL Research | HIGH | SAVO v2 Research Knowledge OS + Firecrawl |
| G-16 | Aesthetic Route Pre-Selection | HIGH | SAVO v2 Design Taste OS |
| G-17 | AI-Slop Prevention Protocol | MEDIUM | SAVO v2 Design Taste OS slop detection |
| G-18 | Agent Orchestration Strategy | MEDIUM | Paperclip + Superpowers subagent methodology |

## SKILL METADATA UPDATE

```yaml
skill_id: sa-preplanning-intelligence-v1
version: 1.1.0
tier: Tier-0 Pre-Flight
modules: 18
quality_gates: 6
new_in_v1_1:
  - G-15: Competitive Intelligence from SAVO v2 Research Knowledge OS
  - G-16: Aesthetic Route Pre-Selection from SAVO v2 Design Taste OS
  - G-17: AI-Slop Prevention from SAVO v2 Design Taste OS slop score
  - G-18: Agent Orchestration from Paperclip + Superpowers methodology
last_updated: 2026-07-17
```
