# Recipe: Lenis smooth scroll (+ GSAP sync)

```bash
npm i lenis gsap
```

```js
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
let lenis;
if (!reduce) {
  lenis = new Lenis({ duration: 1.1, easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)) });
  lenis.on('scroll', ScrollTrigger.update);              // keep ScrollTrigger in sync
  gsap.ticker.add((time) => lenis.raf(time * 1000));     // one RAF loop, not two
  gsap.ticker.lagSmoothing(0);
}
```

Cleanup on SPA route unmount:

```js
lenis?.destroy();
gsap.ticker.remove(updateFn);
ScrollTrigger.getAll().forEach((t) => t.kill());
```

Notes: reduced-motion → skip Lenis entirely (native scroll). Never run Lenis + Locomotive together. `lenis.raf` must be the only RAF driving it.
