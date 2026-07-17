# Space Age Pre-Planning Intelligence v1
## The Missing Layer — Gap-Filled Pre-Planning Skill

**Position in Stack:** Runs BEFORE SAVO. Feeds SAVO → SA Visual Intelligence Engine → Framer Super Design.

**Purpose:** Fill the 14 structural gaps identified in the current Space Age pre-planning stack through deep research and synthesis of top-tier AI-assisted web design workflows.

---

## GAP ANALYSIS REPORT

### Current Stack Coverage
| Layer | Covers |
|-------|--------|
| SAVO | Brand DNA, Competitor Intel, Visitor Psychology, Attention, Story, Layout, Motion, Material, Trust, Conversion |
| SA Visual Intelligence v6 | Visual Reference → Design/Motion/Interaction DNA, Pattern Genomes, Build Handoffs |
| Karpathy Guidelines | Think Before Coding, Simplicity First, Surgical Changes, Goal-Driven Execution |
| Caveman Skill | Token reduction in prompts |

### 14 Confirmed Gaps

| # | Gap | Severity | Where It Breaks |
|---|-----|----------|-----------------|
| G-01 | Client Brief Intake System | CRITICAL | No structured project intake → SAVO starts with assumptions |
| G-02 | Content Strategy Integration | CRITICAL | Visual-first design without words = layout that fights copy |
| G-03 | SEO Intent Mapping (Pre-Design) | HIGH | Page structure set after layout = retrofitted SEO that underperforms |
| G-04 | Performance Budget Planning | HIGH | Animations approved without frame budget → jank in production |
| G-05 | Accessibility-First Pre-Planning | HIGH | WCAG targets set post-design = costly retrofits |
| G-06 | A/B Testing Framework | MEDIUM | CRO opportunities identified but no test methodology planned |
| G-07 | Internationalization/Localization | MEDIUM | English-only layout breaks in German/Arabic/CJK markets |
| G-08 | Design System Governance | HIGH | Pattern Genomes have no versioning/token sync strategy |
| G-09 | Animation Performance Profiling | HIGH | Motion DNA defined without compositor/GPU budget |
| G-10 | Real User Behavioral Data Integration | MEDIUM | Visitor Psychology is theoretical with no real data ingestion |
| G-11 | Emotional Journey Mapping | MEDIUM | Attention + Story engines miss the full emotional arc |
| G-12 | Micro-Interaction Planning Framework | MEDIUM | Hover/scroll covered; state-machine micro-interactions missing |
| G-13 | Technical Architecture Pre-Decision | HIGH | Design built without SSR/CSR/CMS/API constraints defined |
| G-14 | Mobile-First Constraint Matrix | HIGH | Mobile-critical noted in SAVO but not systematically enforced |

---

## THE 14-MODULE PRE-PLANNING INTELLIGENCE SYSTEM

---

### MODULE 1 — CLIENT BRIEF INTAKE SYSTEM (G-01)
**Runs:** Session start, before any SAVO activation

**Required Inputs:**
```
PROJECT_BRIEF:
  client_name: ""
  industry: ""
  project_type: [new_site | redesign | landing_page | microsystem | ecommerce]
  primary_goal: [lead_gen | ecommerce | brand_awareness | SaaS_signup | portfolio | community]
  success_metrics: []          # e.g., "15% conversion rate", "2min avg session"
  timeline_weeks: 0
  budget_tier: [bootstrap | growth | premium | enterprise]
  existing_assets:
    brand_guide: [yes | no | partial]
    logo_files: [yes | no]
    copy_written: [yes | no | partial]
    photography: [yes | no | stock_ok]
    existing_site_url: ""
  technical_constraints:
    cms_required: [none | webflow | framer | wordpress | custom]
    auth_required: [yes | no]
    ecommerce_required: [yes | no]
    third_party_integrations: []   # CRM, analytics, chat, payments
    hosting_preference: []
  stakeholders:
    decision_maker: ""
    technical_contact: ""
    content_owner: ""
  revision_rounds: 2
```

**Output → SAVO Handoff:**
```
BRIEF_SUMMARY:
  core_mission: ""        # one sentence
  must_haves: []          # non-negotiable requirements
  nice_to_haves: []       # scope-controlled
  out_of_scope: []        # explicitly excluded
  complexity_score: 1-10  # feeds timeline estimate
```

**Complexity Scoring:**
- +1 each: auth system, ecommerce, CMS, multi-language, custom animations
- +2 each: real-time features, AI integration, 10+ pages, API integrations
- Score 1-4 = standard, 5-7 = complex, 8-10 = enterprise

---

### MODULE 2 — CONTENT STRATEGY INTEGRATION (G-02)
**Runs:** After Brief Intake, feeds Layout Intelligence in SAVO

**Content Audit Protocol:**
```
CONTENT_INVENTORY:
  pages: []
  for each page:
    primary_headline: ""       # H1 — must be written BEFORE layout
    subheadline: ""
    body_copy_length: [short | medium | long]   # affects section height
    cta_text: ""
    supporting_content: [testimonials | stats | logos | video | gallery]
    content_owner_deadline: ""
```

**Content-First Design Rules:**
1. No layout decisions until H1/H2 are written — headline length determines hero width
2. Body copy length class (S/M/L) set before column count decisions
3. CTA copy must be finalized before button size/placement in layout
4. Testimonial count confirmed before social proof section scoped
5. Image aspect ratios locked before responsive breakpoints set

**Information Architecture:**
```
IA_MAP:
  primary_nav: []         # max 6 items
  footer_nav: []
  breadcrumb_strategy: [yes | no | conditional]
  search_required: [yes | no]
  sitemap_depth: 1-4      # max crawl depth
  internal_linking_plan: ""
```

**Editorial Voice Extraction:**
```
VOICE_PROFILE:
  tone: [authoritative | conversational | technical | inspirational | playful]
  reading_level: [grade_6 | grade_8 | grade_12 | professional]
  sentence_length: [short(<12w) | medium(12-20w) | long(20+w)]
  active_voice_ratio: ""   # target %
  forbidden_phrases: []    # brand-specific
  power_words: []          # brand-specific
```

---

### MODULE 3 — SEO INTENT MAPPING (G-03)
**Runs:** After IA Map, before Layout Intelligence

**Intent Classification per Page:**
```
SEO_INTENT_MAP:
  for each page:
    primary_keyword: ""
    intent_type: [informational | navigational | commercial | transactional]
    serp_feature_target: [featured_snippet | FAQ | local_pack | image | video | none]
    heading_hierarchy:
      H1: ""      # includes primary keyword
      H2s: []     # semantic variations
      H3s: []     # supporting topics
    schema_markup: [Article | FAQ | Product | LocalBusiness | Service | Review | none]
    internal_links_from: []
    internal_links_to: []
    target_word_count: 0
    meta_title: ""     # <60 chars
    meta_description: ""  # <160 chars
```

**Core Web Vitals Pre-Targets:**
```
CWV_TARGETS:
  LCP_target_ms: 2500      # Largest Contentful Paint
  CLS_target: 0.1          # Cumulative Layout Shift
  INP_target_ms: 200       # Interaction to Next Paint
  TTFB_target_ms: 600      # Time to First Byte
  hero_image_format: [webp | avif]
  hero_image_max_kb: 200
  font_loading_strategy: [preload | display:swap | variable]
  critical_css_inline: true
```

**SEO → Layout Integration Rules:**
1. H1 positioning: within first visible viewport (no hero below-fold)
2. Image alt text schema planned before asset sourcing
3. FAQ sections placed in LD+JSON compatible markup
4. Breadcrumb component required if sitemap_depth > 2
5. Canonical URL strategy set before page count finalized

---

### MODULE 4 — PERFORMANCE BUDGET PLANNING (G-04)
**Runs:** Before Motion Intelligence + Framer Super Design activation

**Performance Budget:**
```
PERF_BUDGET:
  total_page_weight_kb: 1500    # target per page
  breakdown:
    html_kb: 50
    css_kb: 100
    js_kb: 400          # total including frameworks
    images_kb: 700
    fonts_kb: 150
    video_kb: 0         # use streaming if needed
    third_party_kb: 100
  
  animation_budget:
    target_fps: 60
    frame_budget_ms: 16.67      # 1000/60
    js_animation_max_ms: 4      # max JS work per frame
    css_animation_preferred: true
    compositor_properties_only: [transform, opacity]   # GPU-safe
    will_change_max_elements: 5  # GPU layer budget
  
  loading_strategy:
    above_fold_critical_css: true
    lazy_load_threshold_px: 200
    image_lazy_load: true
    video_lazy_load: true
    font_subsetting: true
```

**Animation Frame Budget Rules (feeds Framer Super Design):**
1. Parallax: use `transform: translateY()` only — never `top`/`margin`
2. Scroll triggers: `IntersectionObserver` not scroll event listeners
3. Spring animations: `useSpring` damping ≥ 20 to avoid infinite bounce
4. Stagger: max 8 items at 60ms intervals (total < 500ms)
5. Page transitions: max 400ms, prefer `opacity` + `transform` only
6. GPU escalation: mark elements with `will-change: transform` ONLY if animating continuously; remove after animation ends

---

### MODULE 5 — ACCESSIBILITY-FIRST PRE-PLANNING (G-05)
**Runs:** Before design system decisions, parallel to Content Strategy

**WCAG Compliance Targets:**
```
A11Y_PLAN:
  wcag_level: [A | AA | AAA]    # AA is legal minimum in most jurisdictions
  
  color_accessibility:
    text_contrast_min: 4.5      # AA normal text
    large_text_contrast_min: 3.0  # AA 18pt+ or 14pt bold
    ui_component_contrast_min: 3.0
    focus_indicator_contrast_min: 3.0
    color_not_sole_differentiator: true
  
  typography_accessibility:
    min_body_size_px: 16
    line_height_min: 1.5
    letter_spacing_adjustable: true   # user can override
    font_stack_fallbacks: []
  
  motion_accessibility:
    reduced_motion_fallbacks: true    # @prefers-reduced-motion for all animations
    auto_play_video: false
    animation_pause_mechanism: true
    vestibular_safe_parallax: true    # max 10px parallax for reduced-motion users
  
  keyboard_navigation:
    focus_order_matches_visual: true
    skip_links: [to_main | to_nav]
    modal_focus_trap: true
    dropdown_keyboard_accessible: true
  
  screen_reader:
    landmark_regions: [header | main | nav | footer | aside]
    aria_live_regions: []     # list dynamic content areas
    alt_text_strategy: [descriptive | decorative | functional]
    form_label_strategy: [visible | aria-label | aria-labelledby]
  
  forms:
    error_identification: [inline | summary | both]
    success_confirmation: [visual | announce]
    autocomplete_attributes: true
```

**Accessibility → Design Handoff:**
```
A11Y_DESIGN_TOKENS:
  focus_ring_color: ""
  focus_ring_width: "3px"
  focus_ring_offset: "2px"
  skip_link_style: ""
  error_color: ""        # must pass contrast on white AND brand bg
  success_color: ""
  warning_color: ""
  info_color: ""
```

---

### MODULE 6 — A/B TESTING FRAMEWORK (G-06)
**Runs:** After CRO Analysis in SAVO

**Test Hypothesis Generator:**
```
AB_TESTING_PLAN:
  for each CRO_opportunity from SAVO:
    hypothesis: "Changing [X] for [audience] will [increase/decrease] [metric] because [reason]"
    variant_scope: [copy | color | layout | cta | social_proof | pricing | form]
    primary_metric: ""
    secondary_metrics: []
    minimum_detectable_effect: ""   # e.g., "5% lift in CTR"
    required_sample_size: 0         # calculate from current traffic
    test_duration_days: 0
    statistical_significance_target: 0.95
    
  testing_sequence:                  # prioritized order
    - high_impact_low_effort_first
    - one_test_per_page_at_a_time
    - no_overlapping_audiences
  
  tooling:
    ab_platform: [google_optimize | optimizely | VWO | custom | native_framer]
    tracking_method: [gtm | segment | custom]
    heatmap_tool: [hotjar | fullstory | microsoft_clarity]
```

**Pre-Design Test Candidates (always check these first):**
1. Hero headline — highest impact, lowest effort
2. CTA button copy — "Get Started" vs "Start Free Trial" vs "See It In Action"
3. Social proof placement — above fold vs below CTA vs sticky bar
4. Form length — full vs progressive vs one-field
5. Pricing display — monthly vs annual default, feature highlight order

---

### MODULE 7 — INTERNATIONALIZATION/LOCALIZATION PLANNING (G-07)
**Runs:** After Brief Intake, flags for Layout Intelligence

**i18n Assessment:**
```
I18N_PLAN:
  target_locales: []           # e.g., ["en-US", "de-DE", "ar-SA", "ja-JP"]
  launch_locale: "en-US"
  future_locale_plan: true/false
  
  text_expansion_factors:
    German: 1.35               # German averages 35% longer than English
    French: 1.25
    Spanish: 1.20
    Portuguese: 1.15
    Russian: 1.10
    CJK: 0.80                  # Chinese/Japanese/Korean often shorter
    Arabic: 0.90
  
  layout_implications:
    button_width: "auto"       # never fixed-width buttons
    nav_overflow_strategy: ""  # what happens when German nav overflows
    truncation_max_lines: 3    # max text truncation before ellipsis
  
  rtl_support:
    required: true/false
    logical_properties: true   # use margin-inline, padding-block not L/R
    icon_flip_list: []         # icons that mirror in RTL
    text_direction_attribute: true
  
  cultural_considerations:
    color_meaning_check: true  # red = danger/luck varies by market
    imagery_guidelines: ""     # local vs stock, model diversity
    date_format: ""            # DD/MM/YYYY vs MM/DD/YYYY vs YYYY-MM-DD
    number_format: ""          # 1,000.00 vs 1.000,00
    currency_display: ""
  
  font_internationalization:
    cjk_font_stack: []
    arabic_font_stack: []
    devanagari_font_stack: []
    variable_font_fallback: true
```

---

### MODULE 8 — DESIGN SYSTEM GOVERNANCE (G-08)
**Runs:** Before Pattern Genome activation in SA Visual Intelligence v6

**Token Architecture:**
```
DESIGN_SYSTEM_GOVERNANCE:
  token_tier:
    primitive_tokens: []     # raw values: color-blue-500, spacing-4, radius-md
    semantic_tokens: []      # purpose-mapped: color-surface-primary, spacing-section
    component_tokens: []     # scoped: button-padding-x, card-border-radius
  
  token_sync_strategy:
    source_of_truth: [figma_variables | style_dictionary | tokens_studio | css_custom_properties]
    output_targets: []       # CSS, JS, iOS, Android
    versioning: semver       # MAJOR.MINOR.PATCH
    breaking_change_protocol: "deprecate → warn → remove (min 2 versions)"
  
  component_ownership:
    atomic_components: []    # Button, Input, Tag, Avatar — owned by design system team
    molecular_components: [] # Card, Form, Modal — shared ownership
    organism_components: [] # Hero, Nav, Footer — page team ownership
  
  multi_brand_theming:
    required: true/false
    brand_count: 0
    theme_switching: [css_variables | data_attribute | separate_stylesheet]
  
  component_documentation:
    required_per_component: [usage_guide | do_dont | accessibility_notes | props_table]
    storybook_required: true/false
  
  pattern_genome_versioning:
    genome_version_field: true    # every Pattern Genome gets a version
    genome_changelog: true
    deprecated_genome_handling: "sunset after 90 days"
```

---

### MODULE 9 — ANIMATION PERFORMANCE PROFILING (G-09)
**Runs:** After Motion DNA extraction, before Framer implementation

**Animation Inventory + Profiling:**
```
ANIMATION_PERFORMANCE_PLAN:
  for each animation from Motion DNA:
    name: ""
    trigger: [scroll | hover | load | click | state_change]
    compositor_safe: true/false    # uses only transform/opacity?
    will_change_needed: true/false
    gpu_layer_cost: [low | medium | high]
    reduced_motion_fallback: ""    # what happens with prefers-reduced-motion
    mobile_performance_tier: [A | B | C]   # A=run as-is, B=reduce, C=disable
  
  frame_budget_allocation:
    total_budget_ms: 16.67
    layout_ms: 3.0            # recalc/reflow budget
    paint_ms: 2.0             # painting budget
    composite_ms: 2.0
    js_ms: 4.0
    idle_ms: 5.67             # buffer
  
  animation_profiling_checklist:
    - [ ] No layout-triggering properties (width/height/top/left/margin)
    - [ ] IntersectionObserver used for scroll triggers (not scroll events)
    - [ ] AnimationFrame used for any JS-driven motion
    - [ ] GSAP ScrollTrigger pin/scrub performance tested on low-end Android
    - [ ] Framer Motion useReducedMotion() wrapped on all decorative animations
    - [ ] will-change removed after animation completes (not left permanently)
    - [ ] Composite layer count < 30 per page
    - [ ] No paint storms on scroll (Chrome DevTools Layers panel verified)
  
  device_tier_animation_matrix:
    tier_A_high_end:   "Full motion — all animations enabled"
    tier_B_mid_range:  "Scroll animations + hover — no parallax"
    tier_C_low_end:    "Fade in only — no scroll triggers, no parallax"
    detection_method: "navigator.hardwareConcurrency < 4 || navigator.deviceMemory < 2"
```

---

### MODULE 10 — REAL USER BEHAVIORAL DATA INTEGRATION (G-10)
**Runs:** Before Visitor Psychology in SAVO (enriches it with real data)

**Data Ingestion Protocol:**
```
BEHAVIORAL_DATA_INTAKE:
  existing_analytics:
    platform: [GA4 | mixpanel | amplitude | adobe | none]
    data_available:
      - top_landing_pages: []
      - top_exit_pages: []
      - avg_session_duration: 0
      - bounce_rate: 0
      - device_split: { desktop: 0, mobile: 0, tablet: 0 }
      - geo_split: {}
      - conversion_funnel: []
      - top_converting_pages: []
  
  heatmap_data:
    platform: [hotjar | fullstory | clarity | mouseflow | none]
    insights_available:
      - rage_click_zones: []      # high-frustration areas
      - dead_click_zones: []      # elements users think are clickable
      - scroll_depth_map: {}      # % of users reaching each section
      - attention_heatmap_top3: []  # highest attention areas
  
  session_recordings:
    common_confusion_patterns: []
    mobile_specific_issues: []
    form_abandonment_points: []
  
  user_research:
    interviews_available: true/false
    surveys_available: true/false
    usability_tests_available: true/false
    key_user_quotes: []
  
  data_synthesis_output:
    validated_pain_points: []      # confirmed by data, not assumed
    high_value_user_paths: []      # most common successful journeys
    friction_removal_priorities: []  # ordered by data impact
```

**Data → SAVO Enrichment:**
Behavioral data overrides theoretical Visitor Psychology assumptions.
Rule: Real data > research-based assumption > intuition.

---

### MODULE 11 — EMOTIONAL JOURNEY MAPPING (G-11)
**Runs:** After Visitor Psychology, before Story Engine in SAVO

**Full Emotional Arc (Pre-Awareness → Post-Conversion):**
```
EMOTIONAL_JOURNEY_MAP:
  stages:
    1_pre_awareness:
      emotional_state: ""          # What's the user feeling before they find the site?
      trigger: ""                  # What drove them to search?
      expectation: ""              # What do they hope to find?
    
    2_first_impression:            # 0-3 seconds on landing
      emotional_target: ""        # e.g., "impressed, safe, relevant"
      risk_emotion: ""             # e.g., "confused, skeptical, distracted"
      design_response: ""          # e.g., "bold hero statement + credibility logos"
    
    3_exploration:                 # 3-60 seconds — scrolling, clicking
      emotional_target: ""
      curiosity_trigger: ""        # what keeps them scrolling?
      trust_builders: []           # what reduces skepticism mid-scroll?
    
    4_consideration:               # 60+ seconds — reading details
      emotional_target: ""
      objection_list: []           # common reasons they'd leave
      objection_responses: {}      # what design/copy addresses each
    
    5_decision_point:              # at CTA
      emotional_target: ""         # e.g., "confident, ready, low-risk feeling"
      friction_reducers: []        # guarantee, no-card-required, social proof
      urgency_mechanism: ""        # scarcity, deadline, bonuses — if authentic only
    
    6_post_conversion:
      emotional_target: ""         # e.g., "validated, welcomed, excited"
      confirmation_design: ""      # thank you page, email, onboarding flow
      next_action_planted: ""      # what's the next behavior to encourage?
  
  emotional_consistency_check:
    - Does visual tone match emotional target at each stage?
    - Does copy escalation follow emotional arc?
    - Are trust-builders placed at peak skepticism moments?
    - Is conversion moment designed for confidence (not anxiety)?
```

---

### MODULE 12 — MICRO-INTERACTION PLANNING FRAMEWORK (G-12)
**Runs:** After Interaction DNA extraction, before Framer implementation

**Micro-Interaction State Machine:**
```
MICRO_INTERACTION_SPEC:
  for each interactive element:
    element: ""
    states: [idle | hover | active | focus | disabled | loading | error | success]
    state_transitions:
      idle → hover:
        trigger: "mouseenter / :focus-visible"
        duration_ms: 150
        easing: "ease-out"
        properties_changed: [color, background, scale, shadow]
      hover → active:
        trigger: "mousedown / keydown:Enter"
        duration_ms: 80
        easing: "ease-in"
        properties_changed: [scale, shadow]
      any → loading:
        duration_ms: 0            # instant
        indicator: [spinner | skeleton | progress_bar | pulse]
        timeout_ms: 10000         # max wait before error state
      loading → error:
        indicator: [inline_message | toast | modal]
        recovery_action: [retry | contact | fallback]
      loading → success:
        celebration_level: [none | subtle | moderate | delight]
        duration_ms: 300
        auto_dismiss_ms: 2000
  
  latency_standards:
    perceived_instant: 100        # <100ms feels immediate
    perceived_responsive: 300     # <300ms feels fast
    perceived_slow: 1000          # <1000ms needs loading indicator
    perceived_broken: 3000        # >3000ms needs progress + abort option
  
  animation_tokens_for_microinteractions:
    duration_instant: "80ms"
    duration_fast: "150ms"
    duration_medium: "250ms"
    duration_slow: "400ms"
    easing_enter: "cubic-bezier(0, 0, 0.2, 1)"     # Material ease-out
    easing_exit: "cubic-bezier(0.4, 0, 1, 1)"      # Material ease-in
    easing_standard: "cubic-bezier(0.4, 0, 0.2, 1)" # Material standard
    easing_spring: "spring(1, 80, 12, 0)"           # Framer spring
  
  delight_moments:
    - Form submission success
    - Feature unlock / upgrade
    - Milestone reached (onboarding step completed)
    - First-time action celebration
    # Rule: max 2 delight moments per session to preserve impact
```

---

### MODULE 13 — TECHNICAL ARCHITECTURE PRE-DECISION (G-13)
**Runs:** After Brief Intake, before any design decisions

**Architecture Decision Record:**
```
TECHNICAL_ARCHITECTURE:
  rendering_strategy:
    decision: [SSG | SSR | CSR | ISR | hybrid]
    rationale: ""
    implications_for_design:
      SSG: "No personalization at page level; use client-side for dynamic"
      SSR: "Full personalization; design for loading states on hydration"
      CSR: "SEO requires SSR shell; plan skeleton screens"
      ISR: "Stale-while-revalidate; design assumes possible 60s stale data"
  
  cms_selection:
    platform: [framer_cms | webflow_cms | contentful | sanity | wordpress | none]
    content_model_complexity: [simple | moderate | complex]
    editor_experience_priority: [high | medium | low]  # affects component structure
    api_delivery: [graphql | rest | none]
  
  authentication:
    required: true/false
    provider: [auth0 | clerk | supabase_auth | nextauth | custom | none]
    design_implications:
      - Protected route loading states needed
      - Avatar/profile UI components needed
      - Logout confirmation modal needed
      - Session expiry toast needed
  
  third_party_integrations:
    for each integration:
      name: ""
      category: [analytics | crm | payments | chat | email | cdn | monitoring]
      performance_impact_kb: 0
      privacy_impact: [minimal | moderate | significant]  # affects cookie consent
      loading_strategy: [sync | async | deferred | on_demand]
  
  performance_architecture:
    cdn_strategy: [cloudflare | fastly | cloudfront | vercel_edge | none]
    image_optimization: [next_image | cloudinary | imgix | manual | none]
    font_strategy: [variable | subset | system | none]
    bundle_strategy: [route_splitting | component_lazy | manual_chunks]
  
  cookie_consent_required: true/false
  gdpr_applicable: true/false
  ccpa_applicable: true/false
```

---

### MODULE 14 — MOBILE-FIRST CONSTRAINT MATRIX (G-14)
**Runs:** Before Layout Intelligence in SAVO

**Mobile Constraint Specification:**
```
MOBILE_FIRST_MATRIX:
  primary_breakpoints:
    mobile: "375px"        # iPhone SE baseline
    mobile_lg: "430px"     # iPhone 15 Pro Max
    tablet: "768px"
    desktop: "1280px"
    wide: "1536px"
  
  touch_target_standards:
    minimum_size_px: 44     # WCAG 2.5.5 / Apple HIG
    preferred_size_px: 48
    minimum_spacing_px: 8   # between adjacent targets
    thumb_friendly_zones:   # for primary actions
      - bottom_40pct_screen  # natural thumb reach
      - avoid_top_corners    # hardest to reach
  
  gesture_planning:
    supported: [tap | double_tap | long_press | swipe_h | swipe_v | pinch | pull_to_refresh]
    conflicts_to_avoid:
      - horizontal_scroll inside page with browser back swipe
      - vertical scroll inside modal with page scroll
      - swipe carousel interfering with scroll
    conflict_resolution_strategy: ""
  
  mobile_performance_delta:
    mobile_target_lcp_ms: 3000    # more lenient than desktop 2500ms
    mobile_js_budget_kb: 200      # stricter than desktop
    mobile_image_quality: 75      # WebP quality for mobile
    connection_assumption: "4G"   # design for this floor
    offline_strategy: [none | service_worker_cache | pwa]
  
  viewport_considerations:
    safe_area_insets: true        # iPhone notch/dynamic island
    virtual_keyboard_push: true   # layout responds when keyboard opens
    orientation_support: [portrait_only | landscape_ok | adaptive]
    minimum_zoom_text: "16px"     # prevents iOS auto-zoom on input focus
  
  mobile_navigation_pattern:
    pattern: [hamburger | bottom_tab | full_screen | combo]
    hamburger_rationale: ""
    bottom_tab_items_max: 5
    gesture_nav_conflict_check: true
```

---

## PRE-PLANNING ORCHESTRATION PROTOCOL

**Master Run Order (enforced):**

```
PHASE 0: PROJECT INTAKE
  → MODULE 1: Client Brief Intake
  → MODULE 13: Technical Architecture Pre-Decision
  → MODULE 7: Internationalization/Localization Planning
  → MODULE 14: Mobile-First Constraint Matrix

PHASE 1: CONTENT + INTENT
  → MODULE 2: Content Strategy Integration
  → MODULE 3: SEO Intent Mapping
  → MODULE 10: Real User Behavioral Data Integration

PHASE 2: DESIGN CONSTRAINTS
  → MODULE 5: Accessibility-First Pre-Planning
  → MODULE 4: Performance Budget Planning
  → MODULE 9: Animation Performance Profiling
  → MODULE 8: Design System Governance

PHASE 3: EXPERIENCE ARCHITECTURE
  → MODULE 11: Emotional Journey Mapping
  → MODULE 12: Micro-Interaction Planning Framework
  → MODULE 6: A/B Testing Framework

PHASE 4: HANDOFF TO SAVO
  → Consolidated Pre-Planning Brief → SAVO activation
  → SAVO output → SA Visual Intelligence Engine v6
  → SA Visual Intelligence output → Framer Super Design
```

**Consolidated Pre-Planning Brief Template:**
```
PRE_PLANNING_BRIEF:
  project: {from Module 1}
  content_strategy: {from Module 2}
  seo_targets: {from Module 3}
  perf_budget: {from Module 4}
  a11y_plan: {from Module 5}
  ab_framework: {from Module 6}
  i18n_plan: {from Module 7}
  design_system_rules: {from Module 8}
  animation_budget: {from Module 9}
  behavioral_insights: {from Module 10}
  emotional_arc: {from Module 11}
  micro_interaction_spec: {from Module 12}
  tech_architecture: {from Module 13}
  mobile_constraints: {from Module 14}
  
  → feeds_into: SAVO
  → enriches: Visitor Psychology (Module 10 data)
  → constrains: Motion Intelligence (Modules 4 + 9)
  → governs: Pattern Genome Database (Module 8)
  → validates: Attention Engine (Module 11)
```

---

## QUALITY GATES — PRE-PLANNING

Before passing to SAVO, all of the following must be answered:

### Gate 1: Clarity Gate
- [ ] Primary goal stated in one sentence with a measurable metric
- [ ] Out-of-scope items explicitly listed
- [ ] Technical constraints documented
- [ ] Content status known (written/needed/stock ok)

### Gate 2: Performance Gate
- [ ] LCP target set
- [ ] Total page weight budget set
- [ ] Animation compositor budget confirmed
- [ ] Mobile performance tier defined

### Gate 3: Accessibility Gate
- [ ] WCAG level committed (AA minimum)
- [ ] Color contrast targets documented
- [ ] Reduced motion strategy specified
- [ ] Focus management plan exists

### Gate 4: Content Gate
- [ ] H1 written for every page
- [ ] CTA copy finalized
- [ ] Image aspect ratios locked
- [ ] Copy length class (S/M/L) per section confirmed

### Gate 5: Architecture Gate
- [ ] Rendering strategy decided (SSG/SSR/CSR)
- [ ] CMS platform confirmed
- [ ] Auth requirements documented
- [ ] Third-party integration list finalized

### Gate 6: Mobile Gate
- [ ] Primary breakpoints confirmed
- [ ] Touch target sizes committed
- [ ] Mobile navigation pattern chosen
- [ ] Virtual keyboard impact assessed

---

## INTEGRATION WITH EXISTING SPACE AGE STACK

```
FULL STACK LOAD ORDER:

1. SA Pre-Planning Intelligence v1   ← THIS FILE (runs first)
   ↓ Produces: Pre-Planning Brief
   
2. SAVO Creative Director OS         ← Receives Pre-Planning Brief
   ↓ Produces: Creative Direction Package
   
3. SA Visual Intelligence Engine v6  ← Receives reference URLs + Creative Direction
   ↓ Produces: Design DNA + Motion DNA + Pattern Genomes + Build Handoffs
   
4. Framer Super Design Skill         ← Receives Build Handoffs + Animation Budget
   ↓ Produces: Production-ready Framer components + code overrides
   
5. Karpathy Guidelines               ← Active throughout development phase
   ↓ Governs: All implementation decisions
   
6. Caveman Skill                     ← Active in all LLM prompting contexts
   ↓ Governs: Token efficiency in all prompts
```

**Cross-Stack Constraint Flow:**
- Module 4 (Performance Budget) constrains Module 9 (Animation Profiling) which constrains Framer Super Design motion intensity
- Module 5 (Accessibility) constrains color tokens in Design DNA which constrains Material Intelligence in SAVO
- Module 2 (Content Strategy) constrains Layout Intelligence in SAVO — content-first, not layout-first
- Module 14 (Mobile Matrix) constrains Layout Intelligence breakpoints and Pattern Genome responsive rules
- Module 10 (Behavioral Data) enriches Visitor Psychology in SAVO with validated real data

---

## QUICK-RUN MODE (Time-Constrained Projects)

When `complexity_score < 4` and `timeline_weeks < 4`:

**Required modules only (skip the rest):**
- Module 1: Client Brief (always)
- Module 3: SEO Intent (5 min, fill H1s only)
- Module 4: Performance Budget (use defaults above)
- Module 5: Accessibility (WCAG AA + reduced motion only)
- Module 14: Mobile-First Constraints (use standard breakpoints)

**Skip for quick-run:** Modules 6, 7, 8, 10, 11, 12, 13
**Note in Pre-Planning Brief:** which modules were skipped + why

---

## SKILL METADATA

```yaml
skill_id: sa-preplanning-intelligence-v1
version: 1.0.0
tier: Tier-0 Pre-Flight
position_in_stack: FIRST — before all other Space Age skills
feeds_into: [savo, sa-visual-intelligence-v6, framer-super-design]
modules: 14
quality_gates: 6
gap_sources:
  - deep_research_synthesis
  - wcag_2_1_2_2_guidelines
  - core_web_vitals_google_2024
  - nielsen_norman_ux_research
  - material_design_motion_spec
  - apple_hig_guidelines
  - web_content_accessibility_guidelines
  - google_search_central_seo_best_practices
last_updated: 2026-07-15
author: Space Age Skills System
```