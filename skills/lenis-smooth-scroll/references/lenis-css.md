# lenis.css (recommended stylesheet, v1.3.26)

Import `lenis/dist/lenis.css` or paste this verbatim. Each rule exists for a reason:

```css
html.lenis,
html.lenis body {
  height: auto;
}

.lenis:not(.lenis-autoToggle).lenis-stopped {
  overflow: clip;
}

.lenis [data-lenis-prevent],
.lenis [data-lenis-prevent-wheel],
.lenis [data-lenis-prevent-touch],
.lenis [data-lenis-prevent-vertical],
.lenis [data-lenis-prevent-horizontal] {
  overscroll-behavior: contain;
}

.lenis.lenis-smooth iframe {
  pointer-events: none;
}

.lenis.lenis-autoToggle {
  transition-property: overflow;
  transition-duration: 1ms;
  transition-behavior: allow-discrete;
}
```

| Rule | Why |
|---|---|
| `html.lenis, html.lenis body { height: auto }` | Removes `height:100%` traps that break scroll length |
| `.lenis:not(.lenis-autoToggle).lenis-stopped { overflow: clip }` | `lenis.stop()` locks scroll without layout shift |
| `[data-lenis-prevent*] { overscroll-behavior: contain }` | Nested scrollers don't chain into the page |
| `.lenis.lenis-smooth iframe { pointer-events: none }` | Iframes would swallow wheel events mid-glide |
| `.lenis.lenis-autoToggle { transition … allow-discrete }` | Lets `autoToggle` observe `overflow` changes (Safari > 17.3, Chrome > 116, Firefox > 128) |

State classes Lenis puts on the root: `lenis`, `lenis-autoToggle`, `lenis-stopped`, `lenis-locked`, `lenis-scrolling`, `lenis-smooth`. Use them for CSS hooks (e.g. hide a cursor while `.lenis-scrolling`).
