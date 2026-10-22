# 04 Build: screen by screen, clean room
Reads `recon.md`, `architecture.md`, `design/`. Updates `features.csv` (`clone` column), `replica/build-log.md`, `replica/clone-screens/`.

## Rules
- **Clean room**: every line written here from the map + specs. Never paste/adapt their HTML, CSS, JS, SVG, images; never load from their domain/CDN; no "view source and adapt".
- **Own words**: every label, button, empty state, email fresh. Same function = parity; same sentence = copying.
- **Tokens only**: no raw hex/px in components; missing value -> add a token.
- **Lean**: reuse primitives and existing helpers; no abstraction until a second use exists.

## Steps
1. **Shell**: routes for every screen (stubs OK), layout, tokens, primitives, seed data. Commit.
2. **Vertical slice**: core loop end to end before anything else. No backend yet -> fake data layer with the real function signatures, so swapping it changes no screen code.
3. **Each screen**, in `architecture.md` order:
   1. read its recon row (purpose, components, states, flows)
   2. reference screenshot for layout + hierarchy, not pixels
   3. build with primitives + data layer
   4. every state: empty, loading, filled, error, no permission, long content (60-char name), mobile
   5. semantic HTML, labelled inputs, keyboard reachable, visible focus, alt text
   6. `features.csv` rows -> `yes` / `partial` + note
   7. screenshot at reference viewport -> `replica/clone-screens/S07.png`
   8. commit `build: S07 booking page`
4. **Build log**: one line per screen: ID, date, done/partial, missing, what was harder. Bigger than it looked -> say so in log + chat. Never quietly ship half.

Stuck on behaviour -> go back to the original as a user (help article, public walkthrough, user's account). Never its code or network calls.

## Definition of done (per screen)
- [ ] all recon states + empty, error, loading
- [ ] works at 390px and 1440px
- [ ] flow completable keyboard-only
- [ ] zero console errors
- [ ] no copy borrowed from the original
- [ ] `features.csv` updated, screenshot saved

Output: screens done/total, must-haves done/total. Next: `05-backend` if data is fake, else `06-test`.
