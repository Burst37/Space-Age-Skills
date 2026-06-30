# Recipe: fullscreen overlay menu (clip-path reveal + staggered links)

```css
.menu {
  position: fixed; inset: 0; z-index: 100;
  clip-path: inset(0 0 100% 0);                 /* hidden: collapsed from bottom */
  transition: clip-path .7s cubic-bezier(.76,0,.24,1);
  visibility: hidden;
}
.menu[data-open="true"] { clip-path: inset(0 0 0 0); visibility: visible; }

.menu a { transform: translateY(120%); transition: transform .6s cubic-bezier(.22,1,.36,1); display:block; overflow:hidden; }
.menu[data-open="true"] a { transform: translateY(0); }
.menu[data-open="true"] a:nth-child(1){ transition-delay:.15s }
.menu[data-open="true"] a:nth-child(2){ transition-delay:.22s }
.menu[data-open="true"] a:nth-child(3){ transition-delay:.29s }

@media (prefers-reduced-motion: reduce) {
  .menu, .menu a { transition: opacity .2s; clip-path: none; transform: none; }
  .menu { opacity:0 } .menu[data-open="true"]{ opacity:1 }
}
```

```js
const btn = document.querySelector('.menu-toggle');
const menu = document.querySelector('.menu');
btn.addEventListener('click', () => {
  const open = menu.dataset.open === 'true';
  menu.dataset.open = String(!open);
  btn.setAttribute('aria-expanded', String(!open));
  document.body.style.overflow = open ? '' : 'hidden';     // lock scroll while open
});
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') menu.dataset.open = 'false'; });
```

A11y: `aria-expanded` on toggle · `Esc` closes · trap focus inside while open · restore focus to toggle on close · lock body scroll.
