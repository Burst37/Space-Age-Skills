# Framework adapters (lenis 1.3.x)

All packages ship in the single `lenis` npm package: `lenis`, `lenis/react`, `lenis/vue`, `lenis/nuxt`, `lenis/snap`. Always `import 'lenis/dist/lenis.css'`.

## React / Next.js — `lenis/react`

```jsx
'use client'                                   // Next.js App Router: must be a client component
import { ReactLenis, useLenis } from 'lenis/react'

export default function SmoothScroll({ children }) {
  useLenis((lenis) => { /* every scroll */ })  // (callback, deps?, priority?)
  return <ReactLenis root>{children}</ReactLenis>
}
```

Props: `options` (any Lenis option) and `root`:
- `root` (true) → instance on `<html>`, available to `useLenis` anywhere (even outside the tree).
- `root="asChild"` → renders wrapper elements for a custom scroll container while still exposing the instance globally.
- omitted → scoped to its own wrapper; children use `useLenis`.

Custom loop (shared with GSAP) — `autoRaf: false`, hold a ref, drive `lenisRef.current?.lenis?.raf(time * 1000)` from `gsap.ticker.add(update)` and remove it in the effect cleanup (full file: `../templates/react-gsap.tsx`). **The instance is created inside `ReactLenis`'s own effect and surfaced via state, so it is `undefined` during your first mount effect — read `lenisRef.current?.lenis` lazily on every tick, and attach listeners with `useLenis(cb)` (e.g. `useLenis(() => ScrollTrigger.update())`) rather than capturing `.lenis` once.** Also call `gsap.ticker.lagSmoothing(0)`. Note `ReactLenis` returns `null` when it has no children but still creates the instance (the README's `<ReactLenis root />` pattern).

Framer/Motion: `frame.update(update, true)` with `lenis.raf(data.timestamp)` (already ms); `cancelFrame(update)` on cleanup.

## Vue 3 — `lenis/vue`

```js
import LenisVue from 'lenis/vue'; app.use(LenisVue)   // registers <vue-lenis> globally
```
```vue
<script setup>
import { VueLenis, useLenis } from 'lenis/vue'
const lenis = useLenis((l) => { /* every scroll */ }, 0) // (callback, priority = 0)
</script>
<template><VueLenis root :options="{ autoRaf: true }" /></template>
```

GSAP: `ref` the component, in `watchEffect` attach `lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add(update)` (`raf(time*1000)`), `gsap.ticker.lagSmoothing(0)`, and `onInvalidate(() => gsap.ticker.remove(update))`. Use `options: { autoRaf: false }`.

## Nuxt

```ts
// nuxt.config.ts
export default defineNuxtConfig({ modules: ['lenis/nuxt'] })
```

## Snap — `lenis/snap`

See SKILL.md §8. Needs a Lenis instance: `new Snap(lenis, opts)`.

## Framer

A Framer component exists (https://lenis.framer.website/) — no code package.

## Pitfalls specific to frameworks

- Create **one** instance per page. React strict-mode double mount → always return cleanup (`destroy` / ticker remove).
- Route changes: `lenis.scrollTo(0, { immediate: true })` after navigation; consider `stopInertiaOnNavigate`.
- Server components can't hold it — keep the provider in a small client component.
- Don't read `window.scrollY` for scroll-linked effects; read `lenis.scroll`/`animatedScroll` (or `ScrollTrigger`) so effects follow the smoothed value.
