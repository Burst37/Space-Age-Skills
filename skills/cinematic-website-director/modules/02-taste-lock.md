# Module 02 — Taste Lock & Design Memory

## Mission
Prevent design drift across agents, sessions and pages. Drift is the main way a good
direction becomes a mediocre site.

Create `DESIGN_DNA.md` from `templates/DESIGN_DNA.md`.

## Lock categories
Brand adjectives and emotional target · layout grammar · grid and spacing scale ·
shape/radius language · surface and material language · color roles · icon, illustration
and photo language · typography class · motion personality · image treatment · CTA
treatment · navigation treatment · section rhythm · forbidden patterns.

Font specifics live in `TYPOGRAPHY_SYSTEM.md`; motion specifics in `MOTION_MAP.md`.
DNA holds the *class*, the artifacts hold the *values*.

## Decision ledger
Every consequential decision:
```yaml
decision:
  id: D-001
  choice:
  reason:            # brand or business reason, not "looks better"
  evidence:          # reference, test, constraint, or client statement
  status: proposed|approved|rejected|superseded
  supersedes:
```

## Authority tiers
- **PROJECT decisions** — mandatory for this build, override everything below.
- **OPERATOR preferences** — reusable across builds, overridden by project need.
- **INDUSTRY defaults** — weakest; a starting point, never a conclusion.

Never promote operator taste into a universal rule that harms a client's brand. The
Space Age house look is a default, not a mandate.

## Drift detector
Flag immediately when downstream implementation changes any of:

- font family or typography class
- radius family
- primary or CTA color
- density
- hero composition
- motion score
- image treatment
- CTA hierarchy
- spacing scale base

A drift flag requires **rollback or an explicit approved amendment**. Silent drift is a
defect and goes in the QA ledger at `high`.

## Amendment protocol
```yaml
amendment:
  id: A-001
  supersedes: D-004
  trigger:           # what forced the change
  reason:
  approved_by: user|director
  downstream_impact: []
```
