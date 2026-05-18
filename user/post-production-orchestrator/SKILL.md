---
name: post-production-orchestrator
version: "1.0"
last_updated: "2026-05"
authority: Space Age AI Solutions — PROPRIETARY SKILL — Not on GitHub
trigger_phrases:
  - orchestrate post
  - full post production
  - music video pipeline
  - content pipeline
  - production pipeline
  - post pipeline
  - assemble all tools
  - coordinate production
  - director mode
  - full production run
status: CUSTOM_PROPRIETARY
---

# SKILL: Post-Production Orchestrator
**PROPRIETARY — Space Age AI Solutions Director-Level Workflow Brain**

This skill does not exist anywhere on GitHub. It is the master conductor that
coordinates Blender → DaVinci Resolve → CapCut → Photoshop → Splice → Higgsfield
into a single production pipeline per project type.

---

## WHAT THIS SKILL DOES

When triggered, this skill:
1. Identifies the project type from context
2. Maps the correct tool chain
3. Loads the relevant subordinate skills in sequence
4. Executes in parallel where possible
5. Generates a production brief with file handoff map
6. Tracks deliverable status across all tools

---

## PROJECT TYPE ROUTING TABLE

| Project Type | Tool Chain | Sequence |
|---|---|---|
| **Music Video** | Higgsfield → Blender → Resolve → CapCut → Splice | Shoot → VFX → Edit → Social → Audio |
| **Social Media Ad** | Splice → Higgsfield → CapCut → Photoshop | Audio → Video → Edit → Thumbnail |
| **Artist EPK** | Photoshop → Canva (Adobe) → Resolve → Splice | Photos → Design → Video → Audio |
| **Product Launch** | Blender → Photoshop → Shopify → CapCut | 3D → Composite → List → Social |
| **Audiobook** | Splice → Resolve | Beds → Mix/Export |
| **Brand Video** | Higgsfield → Resolve → Photoshop → CapCut | Generate → Grade → Title → Social cut |
| **Apparel Mockup** | Blender → Photoshop → Shopify | 3D → Composite → List |

---

## ACTIVE PROJECT STATUS TRACKER

When initiated, Claude generates and maintains a brief:

```
PROJECT: [name]
INITIATED: [date]
STATUS: In Progress

PHASE 1 — PRE-PRODUCTION
[ ] Splice MCP: Sound sourcing complete
[ ] Higgsfield: Shot list submitted
[ ] Blender: Scene builds complete
[ ] Photoshop: Assets ready

PHASE 2 — PRODUCTION
[ ] Higgsfield generations: [n]/[total]
[ ] Blender renders: queued / rendering / complete
[ ] Splice downloads: [kit name] — ready

PHASE 3 — POST
[ ] Resolve: Timeline assembled
[ ] Resolve: Color grade complete
[ ] Photoshop: Titles/overlays ready
[ ] CapCut: Social cuts exported

PHASE 4 — DELIVERY
[ ] Master file: [path]
[ ] Social variants: 9:16 / 1:1 / 16:9
[ ] Thumbnail: Photoshop export
[ ] Audio: Mixed and mastered

BLOCKING ISSUES: none / [describe]
NEXT ACTION: [what Claude needs to do next]
```

---

## MUSIC VIDEO PIPELINE (FULL EXECUTION)

Triggered by: "run full MV pipeline for [project]"

**Step 1 — Audio Sourcing (Splice)**
```
Load: splice-sound-architect
Task: Source all sound design elements for intro/transition/bed
Output: download URLs → /project/audio/
```

**Step 2 — 3D Scene Builds (Blender)**
```
Load: blender-3d-director
Task: Build any 3D environments or VFX elements from shot list
Output: PNG sequence or video → /project/blender/renders/
```

**Step 3 — AI Video Generation (Higgsfield MCP)**
```
Load: cinematic-prompt-director
Task: Generate shot list prompts → execute in Higgsfield
Platform routing: Seedance 2.0 (default) → Kling 3.0 (camera moves) → Veo 3.1 (rare: long-form/audio sync only)
All via Higgsfield MCP
Output: MP4 files → /project/higgsfield/
```

**Step 4 — Assembly + Grade (DaVinci Resolve)**
```
Load: davinci-resolve-director
Task: Import all clips → assemble timeline → color grade → audio mix
Apply: Signature Look [1/2/3/4] from grade bible
Output: ProRes 4K master → /project/resolve/master.mov
```

**Step 5 — Titles + Graphics (Photoshop)**
```
Load: photoshop-creative-director
Task: Title cards, lower thirds, artist branding overlays
Export: PNG sequence with alpha → /project/photoshop/titles/
```

**Step 6 — Social Cuts (CapCut)**
```
Load: capcut-video-director
Task: 30-60 sec teaser (9:16) + 60 sec YouTube cut
Add: Subtitle file, music bed (from Splice)
Output: MP4 per platform → /project/social/
```

---

## BRAND CONTENT PIPELINE (Client Work)

Triggered by: "run brand content pipeline for [client]"

**Step 1 — Brand Extract (brand-extractor skill)**
**Step 2 — Sound sourcing (Splice) — brand-appropriate**
**Step 3 — Video generation (Higgsfield) — brand visuals**
**Step 4 — Quick cut (CapCut) — social-ready**
**Step 5 — Thumbnail (Photoshop) — platform-optimized**
**Step 6 — Post report — deliverable manifest**

---

## FILE NAMING CONVENTION (Enforced Across All Tools)

```
/[ClientSlug]/[ProjectCode]/
  /01-assets/          ← Splice downloads, stock images
  /02-blender/         ← 3D renders and scenes
  /03-higgsfield/      ← AI-generated video clips
  /04-resolve/         ← Edit projects and exports
  /05-photoshop/       ← Composites, titles, thumbnails
  /06-capcut/          ← Social cuts (import CapCut drafts here)
  /07-delivery/        ← Final deliverables only

File naming: [ProjectCode]_[Tool]_[Version]_[Description].[ext]
Example: TEKTOOK_Resolve_v2_ColorGraded_Master.mov
Example: ChosenLegend_Photoshop_v1_TitleCard_Intro.png
```

---

## PARALLEL EXECUTION MAP

These can run simultaneously (no dependency):

```
PARALLEL TRACK A: Blender (3D builds)
PARALLEL TRACK B: Splice (sound sourcing)
PARALLEL TRACK C: Higgsfield (AI generation)

↓ MERGE POINT: DaVinci Resolve (assembly)

PARALLEL TRACK D: Photoshop (titles/thumbnails)
PARALLEL TRACK E: CapCut (social cuts)

↓ FINAL MERGE: /07-delivery
```

---

## QUALITY GATES — MASTER CHECKLIST

Before marking any project complete:

**Audio**
- [ ] All stems mixed, no clipping
- [ ] Dialogue intelligible above music
- [ ] Audio fingerprint tested (no copyright flags)

**Video**
- [ ] Color space verified end-to-end
- [ ] No offline clips in Resolve timeline
- [ ] Frame rate consistent throughout

**Delivery**
- [ ] Master: ProRes / DNxHD
- [ ] Web: H.264 or H.265 per platform
- [ ] Thumbnail: platform-spec PNG
- [ ] Caption file: .SRT included

**Brand**
- [ ] Logo present where required
- [ ] Font stack correct (Orbitron for SA brand)
- [ ] Color palette matches brief

---

## NEVER DO

- ❌ Start post without confirming audio is cleared/licensed
- ❌ Run CapCut social cuts from a DaVinci sequence that hasn't been graded
- ❌ Deliver before running through master quality gate checklist
- ❌ Mix file naming conventions across tools
- ❌ Skip the parallel execution map — time is the constraint
