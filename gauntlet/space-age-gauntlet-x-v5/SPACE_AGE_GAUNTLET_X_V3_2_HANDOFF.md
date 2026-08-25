# SPACE AGE GAUNTLET X V3.2 — MULTIMODAL HANDOFF

This project upgrades V3 with a **Reference Lab**.

## New capability
Users can upload screenshots and short website screen recordings. The system analyzes them into a structured Reference DNA object and injects that object into the Gauntlet compiler.

## Critical principle
Do not clone reference expression literally. Extract and transfer:
- motion grammar
- scroll mechanics
- pacing
- layout principles
- interaction patterns
- typography principles
- spatial rhythm
- implementation techniques

Then reinterpret them through the user's own:
- brand
- typography
- palette
- imagery
- content
- components
- layout system

## New files
- `app/api/reference/analyze/route.ts`
- `lib/reference/types.ts`
- `lib/reference/prompt.ts`
- `lib/reference/prompt.mjs`
- `lib/reference/media.mjs`
- `lib/reference/analyzer.mjs`
- `scripts/analyze-reference.mjs`

## Video strategy
1. One video + Gemini key → direct video understanding.
2. Otherwise → FFmpeg keyframe extraction → image-sequence analysis with OpenAI/xAI/Gemini.

## Reference DNA contract
The JSON includes:
- visual.layout
- visual.typography
- visual.colorAndSurface
- visual.imagery
- visual.spacingAndRhythm
- motion.scrollModel
- motion.primitives[]
- motion.choreography
- interaction.*
- implementation.likelyTechniques
- implementation.gsapMapping
- implementation.cssMapping
- implementation.responsiveBehavior
- transformation.adopt
- transformation.transformIntoOwnStyle
- transformation.doNotCopy
- confidence

## Next highest-value extension
Make the runner use Reference DNA during **post-build visual judging**:
- render candidate website
- capture screenshots / optionally record scroll run
- compare candidate evidence to Reference DNA
- score technique fidelity separately from originality
- send the largest mismatch back to the builder
- repeat without allowing literal cloning

Preserve Builder ≠ Critic ≠ Judge and all V3 safety boundaries.
