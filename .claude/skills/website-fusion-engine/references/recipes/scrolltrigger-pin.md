# Recipe: ScrollTrigger pin + scrub + reveal

## Pinned scrub section (e.g. horizontal gallery)

```js
const panels = gsap.utils.toArray('.panel');
const mm = gsap.matchMedia();

mm.add('(min-width: 768px)', () => {              // pin only on desktop — pin breaks mobile
  const tween = gsap.to('.track', {
    x: () => -(document.querySelector('.track').scrollWidth - innerWidth),
    ease: 'none',
  });
  ScrollTrigger.create({
    trigger: '.gallery', start: 'top top',
    end: () => '+=' + (document.querySelector('.track').scrollWidth - innerWidth),
    pin: true, scrub: 1, animation: tween, invalidateOnRefresh: true,
  });
});
```

## Scroll reveal (initial state in CSS to avoid flash)

```css
.reveal { opacity: 0; transform: translateY(80px); }
@media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; } }
```

```js
if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
  gsap.utils.toArray('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'top 45%', toggleActions: 'play none none reverse' },
    });
  });
}
```

Rules: `invalidateOnRefresh: true` for responsive pins · `ScrollTrigger.refresh()` after fonts/images load · kill all triggers on unmount · always set hidden state in CSS so SSR doesn't flash content.
