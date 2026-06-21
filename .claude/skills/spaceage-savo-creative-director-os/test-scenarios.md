# SAVO Test Scenarios

Use these tests before claiming SAVO is production-ready.

## Test 01 — Healthcare Trust-First Site

```yaml
input:
  industry: home healthcare
  audience: adult children searching for care for parents
  conversion_goal: book consultation
expected:
  - trust_requirement: critical
  - motion_level: low_to_medium
  - hero: calm fullscreen human-care video or warm trust-first hero
  - proof appears within first two sections
  - CTA: Book Care Consultation / Call Now
  - rejects aggressive scroll scrubbing and nightclub-style motion
```

## Test 02 — AI Agency Innovation + Trust Site

```yaml
input:
  industry: AI automation agency
  audience: local business owners
  conversion_goal: book discovery call
expected:
  - creative_route: VL-01 dark glass or cinematic SaaS
  - motion_level: high but purposeful
  - dashboard expansion or pinned process allowed
  - case studies/proof dashboard required
  - Vapi or calendar booking CTA
  - rejects generic SaaS blobs and fake AI stats
```

## Test 03 — Restaurant Experience Site

```yaml
input:
  industry: sports bar / restaurant
  audience: local diners and event crowd
  conversion_goal: reserve / order / visit
expected:
  - priority: experience_first
  - hero: food or atmosphere video
  - layout: menu card expansions, review strip, event/gallery sequence
  - motion: medium/high atmospheric parallax allowed
  - mobile CTA: call, directions, order, reserve
  - rejects dashboard UI
```

## Test 04 — Music Artist Attention Site

```yaml
input:
  industry: music artist
  audience: fans, promoters, labels
  conversion_goal: stream / watch / book
expected:
  - priority: maximum_attention
  - full-screen video hero
  - jumbo artist typography
  - cinematic editorial layout
  - pinned storytelling or horizontal media allowed
  - motion: cinematic
  - rejects corporate layout
```

## Test 05 — Corporate Law Authority Site

```yaml
input:
  industry: corporate law
  audience: businesses seeking legal representation
  conversion_goal: consultation
expected:
  - priority: authority_first
  - motion: low
  - layout: editorial authority, case/result blocks, attorney credibility
  - proof: credentials and outcomes
  - rejects playful animation and experimental navigation
```

## Test 06 — Visual Reference Overload

```yaml
input:
  references: 20 mixed Awwwards/Godly/Dribbble sites
expected:
  - clusters sources by aesthetic route
  - selects one primary route and one secondary influence
  - rejects conflicting patterns
  - does not mash all effects together
```

## Test 07 — Low-Confidence Short-Form Reference

```yaml
input:
  reference: YouTube short with unknown transcript/details
expected:
  - confidence: low
  - creates provisional trend candidate only
  - does not claim exact workflow extraction
  - queues for manual/visual inspection
```

## Test 08 — Builder Handoff Readiness

```yaml
input:
  SAVO output for Next.js + GSAP build
expected:
  - includes components, file paths, states, responsive behavior
  - includes GSAP import/registration/cleanup/reduced motion requirements
  - includes npm verification commands
  - no vague "make it premium" instructions without implementation detail
```

## Test 09 — Pretty but Useless Failure

```yaml
input:
  beautiful mockup with no CTA or proof
expected:
  - rejects output
  - flags conversion failure
  - adds CTA hierarchy, proof sequence, objection handling, mobile path
```

## Test 10 — Mobile Conversion Critical

```yaml
input:
  local home service business
  primary_action: call now
expected:
  - sticky mobile call CTA
  - simplified hero
  - reviews and service area visible early
  - horizontal scrolling either removed or converted to stacked/swiper fallback
```

