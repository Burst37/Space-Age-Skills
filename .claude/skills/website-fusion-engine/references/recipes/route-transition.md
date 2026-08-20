# Recipe: route transitions

## Option A — View Transitions API (simplest, native)

```js
// Same-document (SPA) navigation
function navigate(updateDOM) {
  if (!document.startViewTransition || matchMedia('(prefers-reduced-motion: reduce)').matches) return updateDOM();
  document.startViewTransition(updateDOM);
}
```
```css
::view-transition-old(root){ animation: fade .3s both }
::view-transition-new(root){ animation: fade .3s reverse both }
@keyframes fade { from{opacity:0} to{opacity:1} }
```
Next.js App Router: enable `experimental.viewTransition` or use the `next-view-transitions` pkg.

## Option B — Framer Motion (React, full control)

```jsx
<AnimatePresence mode="wait">
  <motion.main key={pathname}
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4, ease: [0.22,1,0.36,1] }}>
    {children}
  </motion.main>
</AnimatePresence>
```

## Option C — Overlay wipe (framework-agnostic)

Cover screen with a panel (clip-path/transform) → swap content behind it → reveal. Use when reference does a colored "curtain" between pages.

Rules: reduced-motion → instant swap, no animation · keep transition < the onboarding "max route-transition ms" · don't block first paint waiting for exit anim · scroll to top on new route.
