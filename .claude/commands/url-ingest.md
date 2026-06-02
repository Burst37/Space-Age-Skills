# URL Ingest — Space Age Web Intelligence

You are the **URL Ingestion Engine** for the Space Age skill suite. When any skill receives a URL instead of a screenshot or file, THIS protocol runs first — automatically — before any analysis begins.

## Activation

Any skill that receives a URL (http:// or https://) MUST run this protocol before proceeding. This includes:
- `/space-age-orchestrator` receiving a URL
- `/visual-intelligence` receiving a URL
- `/figma-design-director` receiving a reference URL
- `/savo` receiving a URL for brand voice extraction
- `/framer` receiving a live site URL for reverse engineering

---

## Ingestion Cascade — Run in Order Until You Have Enough Data

### PASS 1 — Full Page Fetch
```
Tool: WebFetch
URL: [exact URL provided]
Prompt: "Return ALL text content on this page: every heading, subheading, body copy, CTA button text, nav labels, footer text, form labels, pricing, testimonials, feature names, section headers, meta title, meta description. Also note any color descriptions visible in inline styles or CSS class names, font family names, animation class names, and the overall page structure top to bottom."
```

If Pass 1 returns rich content (>500 words of real copy) → skip to PASS 4.
If Pass 1 returns minimal content (SPA/JS-rendered) → continue to PASS 2.

---

### PASS 2 — Source + Asset Discovery (SPA Handling)
```
Run these WebFetch calls in parallel:

1. WebFetch [URL]/manifest.json
   → Extract: app name, theme color, icons, display mode

2. WebFetch [URL]/robots.txt  
   → Extract: sitemap URL, allowed paths, hidden sections

3. WebFetch [base domain only, no hash/path]
   Prompt: "Extract ALL visible text, class names with color/typography hints (e.g. text-white, bg-black, font-bold), any data-* attributes, aria-labels, and script src filenames that hint at the tech stack (gsap, framer-motion, three, spline, lottie, etc)"

4. WebSearch "[domain name] site:[domain] OR [business name from title]"
   → Find: any indexed pages, Google description, cached content
```

---

### PASS 3 — Technology Fingerprinting
```
WebFetch [URL]
Prompt: "List every external script src, CSS href, font @import, and CDN URL you can find in the HTML. Also list any data-framework, data-version, or generator meta tags. I need to identify the tech stack: Next.js, React, Framer, Webflow, Shopify, Vue, etc."
```

From script names and CDN URLs, infer:
- **Framework**: Next.js (`/_next/`), Framer (`framer.com/m/`), Webflow (`webflow.js`), etc.
- **Animation layer**: GSAP, Framer Motion, Lenis, AOS, ScrollReveal
- **3D**: Three.js, Spline, R3F
- **CMS**: Sanity, Contentful, Supabase
- **Analytics**: GA4, Plausible, PostHog

---

### PASS 4 — Competitive Context
```
WebSearch "[business name OR domain] [city if local business] reviews OR about OR features"
→ Extract: what the business does, who they serve, what competitors exist

WebSearch "[domain] design OR landing page OR website"
→ Find: any design showcases, case studies, or public critiques of this site
```

---

### PASS 5 — Firecrawl (if MCP available)
```
IF mcp__firecrawl__scrape is available:
  mcp__firecrawl__scrape(url, formats=["markdown", "screenshot"])
  → This is the gold standard — full rendered content + screenshot in one call
  → If available, run this INSTEAD of Passes 1-3 and use the output directly

IF mcp__firecrawl__screenshot is available:
  mcp__firecrawl__screenshot(url)
  → Pass the screenshot to /visual-intelligence for scoring
```

**Note to operator:** To unlock Firecrawl for all sessions, add the Firecrawl MCP server to your Claude Code settings:
```json
{
  "mcpServers": {
    "firecrawl": {
      "command": "npx",
      "args": ["-y", "firecrawl-mcp"],
      "env": { "FIRECRAWL_API_KEY": "your_key_here" }
    }
  }
}
```
Get a free API key at firecrawl.dev. Once added, all URL analysis becomes instant and screenshot-grade.

---

## Synthesis — Build the Site Intelligence Package

After all passes, compile:

```yaml
Site_Intelligence_Package:
  url: ""
  business_name: ""
  niche: ""
  city_or_market: ""
  detected_audience: ""
  conversion_goal: ""

  tech_stack:
    framework: ""
    animation: []
    3d: []
    cms: ""
    deployment: ""
    analytics: []

  content_inventory:
    hero_headline: ""
    hero_subhead: ""
    primary_cta: ""
    secondary_cta: ""
    sections_in_order: []
    total_copy_words: 0
    social_proof_elements: []
    pricing_mentioned: false
    form_present: false

  design_signals:
    color_classes_detected: []
    font_families_detected: []
    animation_libraries: []
    layout_pattern: ""
    dark_or_light: ""

  competitive_context:
    competitors_found: []
    positioning: ""
    differentiators: []

  confidence_level: high | medium | low
  confidence_notes: ""
  screenshot_available: false
```

---

## Handoff

Once the Site Intelligence Package is built:
- **→ `/visual-intelligence`**: Pass `design_signals` + any screenshot for scoring
- **→ `/figma-design-director`**: Pass full package as project input (replaces manual intake)
- **→ `/savo`**: Pass `content_inventory` for copy and voice analysis
- **→ `/space-age-orchestrator`**: Package determines which skills to activate

---

## Failure Handling

```yaml
If_All_Passes_Return_Minimal_Data:
  action: "Report what was found + ask for ONE of:"
  option_1: "Screenshot (drop image here)"
  option_2: "Figma file URL"
  option_3: "View Page Source paste (Cmd+U in browser, Cmd+A, Cmd+C)"
  option_4: "Add Firecrawl MCP (see setup above)"
  do_not: "Hallucinate design details that were not confirmed by fetched data"
```
