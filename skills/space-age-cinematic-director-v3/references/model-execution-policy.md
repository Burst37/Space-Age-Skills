# Model Execution Policy — v4.0

The master shot design is model-agnostic. Compilation is model-specific.

## Complexity ladder
Level 1: subject motion only.
Level 2: one camera move + subject motion.
Level 3: camera + subject + environment.
Level 4: staged/sequenced camera choreography.
Level 5: multi-phase/transition-heavy shot.
Use the lowest level that expresses the beat.

## Runway
Current guidance favors direct, simple motion language and iteration. For I2V, the source image already defines composition/style; prompt motion, timing, direction and camera behavior. Prefer positive phrasing. Start with essential motion, then add one variable at a time.

## Veo
Supports richer cinematography prompting and current controls such as reference ingredients, camera controls, first/last frames, extension and motion controls. Use detailed shot choreography when warranted. Separate dialogue/audio when relevant.

## Gemini Omni
Can respond to higher-level intent and conversational camera edits. Do not over-specify when the model can infer ordinary world details; be explicit about non-negotiable cinematography and continuity.

## Seedance / MiniMax / Kling / Grok / other engines
Use current documented controls when known. Otherwise compile semantic physical instructions and keep platform flags separate. Never invent unsupported flags.

## I2V invariant rule
For I2V, do not waste prompt budget re-describing a correct source image. Focus on what changes over time. State invariants only when the engine benefits from them or drift risk is high.

## Iteration protocol
Pass 1 tests the core motion.
Pass 2 fixes one failure class.
Pass 3 adds secondary motion/finish.
Never change camera, subject action, lighting and style simultaneously when diagnosing a failure.
