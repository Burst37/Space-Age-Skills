# 03 Design: rebuild the design system as tokens
Reads recon components + `replica/screens/`. Writes `replica/design/tokens.json` (template `templates/tokens.json`), `tokens.css`, Tailwind theme, `components.md`.
Rebuild the **system** (roles, scale, spacing), not the look. Open icons, open fonts, own words. Never their font files, icons or images.

## 1. Measure, do not guess (from screenshots, colour picker)
- **Colour roles**: bg, surface, border, border-input, text, text-muted, accent, on-accent, danger, success, warning. Real grey count (usually 5-7).
- **Type**: sizes, line heights, weights; snap to a scale (12,14,16,20,28,40). Font category, not file.
- **Spacing**: 4 or 8 base; write the scale. **Radius/shadow/motion**: 2-3 each.
- **Layout**: max width, grid, breakpoints, sidebar width, header height.

## 2. Tokens
Fill `tokens.json`; keep role names (stage 9 changes values only). Generate `tokens.css` custom props, map into Tailwind (`bg-surface text-muted`, never raw hex). Add `pairs` for every text/bg combo (3rd item `large` or `ui` for 3:1 rules).
```bash
python3 $S/scripts/contrast.py replica/design/tokens.json   # exit 1 on any AA fail
```
AA floor: 4.5:1 body, 3:1 large text, input borders, focus rings. Fix in tokens, not per component.

## 3. Component specs (`components.md`, one block each)
```
Button
  variants  primary, secondary, ghost, danger
  sizes     sm 32, md 40, lg 48
  states    default, hover, active, focus-visible (2px accent ring), disabled, loading
  tokens    bg accent, text on-accent, radius md, font sm/600
  a11y      real <button>, visible focus, loading keeps label for SR
  used on   S02, S07, S09
```
Every state recon saw + focus, disabled, loading, error, empty. Keyboard + SR behaviour is part of the spec.

## 4. Primitives
Build once in isolation (`/design` route or Storybook) before any screen. Accessible base if available (Radix, shadcn/ui, React Aria). Screenshot it.

## Done when
- [ ] `contrast.py` exit 0 (paste output)
- [ ] every recon component has a spec + built primitive
- [ ] next: `04-build`
