---
name: react-reveal-core
description: React Reveal skill — declarative scroll-triggered animation components for React. Wraps elements in Fade, Zoom, Slide, Rotate, Flip, Bounce, Roll, LightSpeed, and effect components. Use when building scroll animations in React with a component-first API. For complex GSAP-powered React animation, use gsap-react.
license: MIT
---

# React Reveal Core

## When to Use This Skill

Apply when building React applications that need scroll-triggered entrance animations with a clean JSX component API. React Reveal wraps any child in an animation that fires when the element enters the viewport. For scrubbed scroll-linked animations or complex GSAP timelines in React, use the `gsap-react` skill.

## Installation

```bash
npm install react-reveal
```

## Basic Usage

Wrap any element in a reveal component:

```jsx
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import Slide from 'react-reveal/Slide';

export default function Page() {
  return (
    <>
      <Fade bottom>
        <h1>Fades in from below</h1>
      </Fade>

      <Zoom>
        <img src="/hero.jpg" alt="hero" />
      </Zoom>

      <Slide left>
        <p>Slides in from the left</p>
      </Slide>
    </>
  );
}
```

## Available Components

| Component | Effect |
|-----------|--------|
| `Fade` | Fade in/out; use directional props for combined translate |
| `Zoom` | Scale from 0 to 1 (or reverse) |
| `Slide` | Translate from a direction |
| `Rotate` | Rotate in |
| `Flip` | 3D flip on X or Y axis |
| `Bounce` | Bounce entrance |
| `Roll` | Roll in from a side |
| `LightSpeed` | Horizontal sweep with skew |
| `Shake`, `Pulse`, `Wobble`, `Swing`, `Spin`, `Flash`, `Tada`, `Rubber`, `HeadShake`, `Jump` | Attention seekers |

All components are imported individually:

```jsx
import Fade from 'react-reveal/Fade';
import Bounce from 'react-reveal/Bounce';
import LightSpeed from 'react-reveal/LightSpeed';
```

## Directional Props

| Prop | Description |
|------|-------------|
| `top` | Enter from / exit toward top |
| `bottom` | Enter from / exit toward bottom |
| `left` | Enter from / exit toward left |
| `right` | Enter from / exit toward right |

```jsx
<Slide left><div>From left</div></Slide>
<Slide right><div>From right</div></Slide>
<Fade top distance="30px"><h2>From top</h2></Fade>
```

## Common Props (All Components)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `in` | Boolean | — | Manually control visibility (for non-scroll trigger) |
| `spy` | Any | — | Re-trigger animation when value changes |
| `when` | Boolean | — | Conditional reveal (only animate when `true`) |
| `delay` | Number | `0` | Delay in ms before animation starts |
| `duration` | Number | `1000` | Animation duration in ms |
| `distance` | String | `'50px'` | Distance for directional effects |
| `fraction` | Number | `0` | 0–1: required visibility fraction before trigger |
| `count` | Number | `1` | Number of times to play |
| `forever` | Boolean | `false` | Loop animation indefinitely |
| `appear` | Boolean | `false` | Animate on initial render (even if already visible) |
| `cascade` | Boolean | `false` | Stagger each direct child separately |
| `left` / `right` / `top` / `bottom` | Boolean | `false` | Direction for Slide, Fade, Roll, etc. |
| `big` | Boolean | `false` | Use the "big" variant (more distance) |
| `opposite` | Boolean | `false` | Reverse the animation when leaving viewport |
| `mirror` | Boolean | `false` | Play animation in reverse when scrolling back |
| `collapse` | Boolean | `false` | Allow container height to collapse while hidden |
| `mountOnEnter` | Boolean | `false` | Don't render until first enter |
| `unmountOnExit` | Boolean | `false` | Unmount when hidden |
| `onReveal` | Function | — | Callback when animation fires |

## Cascade (Staggered Children)

`cascade` staggers each direct child of the wrapper:

```jsx
<Fade bottom cascade>
  <ul>
    <li>First</li>
    <li>Second</li>
    <li>Third</li>
  </ul>
</Fade>

// Or cascade individual items:
<div>
  {items.map((item, i) => (
    <Fade key={i} bottom delay={i * 100}>
      <Card>{item}</Card>
    </Fade>
  ))}
</div>
```

## Global Configuration

Set defaults for all reveal components using `react-reveal/globals`:

```javascript
// In your app entry point (e.g. _app.tsx or layout.tsx)
import { config } from 'react-reveal';

config.defaults = {
  duration: 700,
  delay: 0,
  distance: '20px',
  cascade: false,
};

config.ssrFadeout = true; // Fade out during SSR to avoid flash
```

## Next.js / SSR

React Reveal includes built-in SSR support. For App Router, mark components as client components:

```tsx
// components/reveal-wrapper.tsx
'use client';
import Fade from 'react-reveal/Fade';

export function RevealFade({ children, ...props }: any) {
  return <Fade bottom {...props}>{children}</Fade>;
}
```

Enable SSR fadeout to prevent flashing before hydration:

```javascript
import { config } from 'react-reveal';
config.ssrFadeout = true; // elements start invisible server-side
```

## Trigger on State Change (spy prop)

Re-trigger the animation when data changes (e.g. tab switch, filter, carousel):

```jsx
const [activeTab, setActiveTab] = useState(0);

<Fade key={activeTab}>
  <TabContent tab={activeTab} />
</Fade>

// Or using spy:
<Zoom spy={activeTab}>
  <TabContent tab={activeTab} />
</Zoom>
```

## Mirror and Opposite

```jsx
// Re-animate when scrolling back up (exit + re-enter)
<Slide bottom mirror>
  <Section>Animated on enter and re-enter</Section>
</Slide>

// Reverse direction on exit
<Fade left opposite>
  <Section>Fades left in, fades right out</Section>
</Fade>
```

## Custom CSS Effect

Use the base `Reveal` component with custom CSS class names:

```jsx
import Reveal from 'react-reveal/Reveal';

<Reveal effect="fadeInUp" effectOut="fadeOutDown">
  <div>Custom Animate.css class</div>
</Reveal>
```

## Accessibility

React Reveal does not guard against `prefers-reduced-motion`. Wrap with a check:

```jsx
'use client';
import { useEffect, useState } from 'react';
import Fade from 'react-reveal/Fade';

export function AccessibleReveal({ children, ...props }) {
  const [reducedMotion, setReducedMotion] = useState(true);
  useEffect(() => {
    setReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  return reducedMotion ? <>{children}</> : <Fade {...props}>{children}</Fade>;
}
```

## Best Practices

- ✅ Import components individually (`import Fade from 'react-reveal/Fade'`) to avoid bundling all effects.
- ✅ Use `key` prop to re-trigger animation on data changes instead of `spy` for cleaner React patterns.
- ✅ Set `config.ssrFadeout = true` in Next.js to avoid hydration flash.
- ✅ Use `mountOnEnter` + `unmountOnExit` for heavy components that should not render off-screen.
- ✅ Wrap in an `AccessibleReveal` component to guard against `prefers-reduced-motion`.

## Do Not

- ❌ Nest multiple reveal components on the same element — only the outermost fires correctly.
- ❌ Use `forever: true` on many elements — continuous loops drain battery on mobile.
- ❌ Mix `mirror` and `opposite` on the same component — they conflict.
- ❌ Forget `'use client'` directive in Next.js App Router — React Reveal uses browser APIs.
