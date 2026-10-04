# Anti-Slop & Quality Gates

## 1. Generic AI tells — the visual signature

If a stranger can identify your build as AI-generated in three seconds, these are why:

**Composition**
- Centered hero + pill badge + two buttons + dashboard mockup
- Three equal feature cards, every time, as the answer to every content problem
- Identical section rhythm top to bottom
- Everything in a 1200px centered container with no full-bleed or asymmetric moment
- Bento grid with no reason for the cell sizes

**Color & surface**
- Purple→blue gradient at 135deg
- Glassmorphism on every surface
- Glow on everything
- Black + gold + serif as a stand-in for luxury
- Random gradients with no palette logic

**Typography**
- Inter / Poppins / Montserrat as the display face with no rationale
- Huge text substituting for hierarchy
- One size, one weight, one color for all secondary text
- Default browser leading on body copy

**Motion**
- Fade-up on every section
- Parallax with no spatial logic
- Animation on everything, signature on nothing

**Content**
- Stock icon spam
- Stock "diverse smiling team" photography
- Copy that names the category instead of the outcome
- Lorem ipsum at the wrong length

## 2. The ten questions

Ask these before delivery. A "no" is a defect, not a nitpick.

1. Cover the logo — can the brand still be identified?
2. Does typography do real visual work, or is it just legible?
3. Is there one clear primary visual rhythm?
4. Does each signature motion have a stated narrative purpose?
5. Does mobile feel **authored**, or merely functional?
6. Is the CTA path obvious to someone who did not build it?
7. Can a low-end device still use this site comfortably?
8. Are references transformed into principles rather than copied?
9. Is there **one** memorable moment, rather than ten competing effects?
10. Would removing half the effects improve the design? **If yes, remove them.**

## 3. Hard disqualifiers

Any single one blocks delivery regardless of judge scores:

- Body text below 4.5:1 contrast
- Horizontal overflow at 320px
- No visible keyboard focus indicator
- Content invisible when JS fails or under `prefers-reduced-motion`
- CLS above 0.1
- Tap targets under 44px on the primary conversion path
- Hover-only access to any necessary information
- Missing or auto-generated-nonsense alt text on meaningful images
- A form input with no associated label
- More than 4 font files
- The primary CTA is not the most prominent action in its viewport

`scripts/audit_build.py` checks the mechanically detectable subset of this list. The rest
require a human or judge pass — but they are equally disqualifying.

## 4. The distinctiveness test

Take a screenshot of the hero. Take screenshots of five competitor sites. Shuffle them.
Can you find yours in under two seconds?

If not, the problem is almost never a missing effect. It is usually: default typography,
a centered symmetric composition, or a palette with no committed point of view. Fix in
that order.
