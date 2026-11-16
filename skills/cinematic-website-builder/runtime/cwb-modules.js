/* ==========================================================================
   CWB MODULES v3 — JS blocks. Requires cwb-runtime.js.
   Each block is self-contained between `@module` / `@end` markers.
   scripts/assemble.mjs copies ONLY the blocks a page uses; by hand, copy
   the block(s) you need. Header fields:
     id · name (the data-cwb value) · plugins (GSAP files to load) · cost
     (motion-budget points, see SKILL.md §Motion budget)
   Conventions every block follows:
     - Reads live conditions from api.cond {motion, reduce, fine, desktop, mobile}
     - Never hard-codes color; styling lives in cwb-modules.css via tokens
     - Registers listeners via api.on / loops via api.loop (auto-cleanup)
   ========================================================================== */

/* @module reveal | id: 00 | plugins: ScrollTrigger | cost: 2 */
CWB.define('reveal', {
  init: function (el, api) {
    if (api.cond.reduce) return;
    var items = api.$$('[data-reveal]');
    if (!items.length) return;
    ScrollTrigger.batch(items, {
      start: 'top 88%', once: true,
      onEnter: function (batch) {
        gsap.to(batch, { opacity: 1, y: 0, duration: 0.8, ease: 'expo.out', stagger: 0.08, overwrite: true });
      }
    });
  }
});
/* @end reveal */

/* @module text-fill | id: 01 | plugins: ScrollTrigger SplitText | cost: 3 */
CWB.define('text-fill', {
  init: function (el, api) {
    if (api.cond.reduce) return;
    if (!window.SplitText) {
      gsap.fromTo(el, { opacity: 0.2 }, { opacity: 1, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: true } });
      return;
    }
    var split = SplitText.create(el, { type: 'words', aria: 'auto' });
    gsap.fromTo(split.words, { opacity: 0.16 }, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: el, start: 'top 85%', end: 'bottom 45%', scrub: true }
    });
    return function () { split.revert(); };
  }
});
/* @end text-fill */

/* @module sticky-narrative | id: 02 | plugins: ScrollTrigger | cost: 8 */
CWB.define('sticky-narrative', {
  init: function (el, api) {
    var steps = api.$$('.sn__step');
    var frames = api.$$('.sn__frame');
    function activate(i) {
      steps.forEach(function (s, k) { s.classList.toggle('is-active', k === i); });
      frames.forEach(function (f, k) { f.classList.toggle('is-active', k === i); });
    }
    steps.forEach(function (step, i) {
      ScrollTrigger.create({
        trigger: step, start: 'top 60%', end: 'bottom 60%',
        onToggle: function (self) { if (self.isActive) activate(i); }
      });
    });
    activate(0);
  }
});
/* @end sticky-narrative */

/* @module parallax | id: 03 | plugins: ScrollTrigger | cost: 5 */
CWB.define('parallax', {
  init: function (el, api) {
    if (api.cond.reduce) return;
    var amp = api.cond.desktop ? 1 : 0.3;
    api.$$('[data-depth]').forEach(function (layer) {
      var depth = parseFloat(layer.getAttribute('data-depth')) || 0;
      if (!depth) return;
      gsap.fromTo(layer, { yPercent: depth * 12 * amp }, {
        yPercent: -depth * 12 * amp, ease: 'none',
        scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
      });
    });
  }
});
/* @end parallax */

/* @module horizontal-pan | id: 04 | plugins: ScrollTrigger | cost: 10 */
CWB.define('horizontal-pan', {
  init: function (el, api) {
    /* Phones + reduced motion keep the native swipe/scroll-snap row (CSS default). */
    /* Native row = a scrollable region: keyboard users need it focusable (axe scrollable-region-focusable).
       Markup ships tabindex="0"; the pinned (transform) mode is not scrollable, so drop it there. */
    var track = api.$('.hpan__track');
    if (!api.cond.desktop || api.cond.reduce) { if (track) track.setAttribute('tabindex', '0'); return; }
    track.removeAttribute('tabindex');
    api.onDispose(function () { track.setAttribute('tabindex', '0'); });
    el.classList.add('is-pinned');
    function dist() { return Math.max(0, track.scrollWidth - el.clientWidth); }
    var tween = gsap.to(track, {
      x: function () { return -dist(); }, ease: 'none',
      scrollTrigger: {
        trigger: el, start: 'top top', end: function () { return '+=' + dist(); },
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true
      }
    });
    /* Reveals for elements that move horizontally must use containerAnimation. */
    api.$$('[data-hreveal]').forEach(function (item) {
      gsap.from(item, { opacity: 0, y: 40, duration: 0.7, ease: 'expo.out',
        scrollTrigger: { trigger: item, containerAnimation: tween, start: 'left 85%', toggleActions: 'play none none reverse' } });
    });
    /* Keyboard: focusing a panel scrolls the page to the progress that shows it. */
    api.on(track, 'focusin', function (e) {
      var panel = e.target.closest('.hpan__panel');
      var st = tween.scrollTrigger;
      if (!panel || !st || !dist()) return;
      var p = Math.min(1, panel.offsetLeft / dist());
      window.scrollTo(0, st.start + p * (st.end - st.start));
    });
    return function () { el.classList.remove('is-pinned'); };
  }
});
/* @end horizontal-pan */

/* @module card-stack | id: 05 | plugins: ScrollTrigger | cost: 4 */
CWB.define('card-stack', {
  init: function (el, api) {
    var cards = api.$$('.stack__card');
    cards.forEach(function (c, i) { c.style.setProperty('--i', i); });
    if (api.cond.reduce) return;
    cards.forEach(function (card, i) {
      var next = cards[i + 1];
      if (!next) return;
      gsap.to(card, { scale: 0.92 + i * 0.01, ease: 'none',
        scrollTrigger: { trigger: next, start: 'top bottom', end: 'top 20%', scrub: true } });
    });
  }
});
/* @end card-stack */

/* @module svg-draw | id: 06 | plugins: ScrollTrigger DrawSVGPlugin | cost: 3 */
CWB.define('svg-draw', {
  init: function (el, api) {
    if (api.cond.reduce) return;
    var paths = api.$$('[data-draw]');
    var st = { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: 1 };
    if (window.DrawSVGPlugin) {
      gsap.fromTo(paths, { drawSVG: '0%' }, { drawSVG: '100%', ease: 'none', stagger: 0.1, scrollTrigger: st });
    } else {
      paths.forEach(function (p) {
        var len = p.getTotalLength();
        gsap.fromTo(p, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: st });
      });
    }
  }
});
/* @end svg-draw */

/* @module curtain | id: 07 | plugins: ScrollTrigger | cost: 5 */
CWB.define('curtain', {
  init: function (el, api) {
    /* Never use on the first-viewport hero: it hides the LCP element. */
    if (api.cond.reduce) return;
    el.classList.add('is-armed');
    var tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 75%', end: 'top 10%', scrub: 1 } });
    tl.fromTo(api.$('.curtain__panel--l'), { xPercent: 0 }, { xPercent: -101, ease: 'power2.inOut' })
      .fromTo(api.$('.curtain__panel--r'), { xPercent: 0 }, { xPercent: 101, ease: 'power2.inOut' }, '<')
      .fromTo(api.$('.curtain__content'), { scale: 0.94 }, { scale: 1, ease: 'power2.out' }, '<');
    return function () { el.classList.remove('is-armed'); };
  }
});
/* @end curtain */

/* @module split-scroll | id: 08 | plugins: ScrollTrigger | cost: 8 */
CWB.define('split-scroll', {
  init: function (el, api) {
    if (!api.cond.desktop || api.cond.reduce) return;
    el.classList.add('is-pinned');
    var a = api.$('.split__col--a'), b = api.$('.split__col--b');
    function travel(col) { return Math.max(0, col.scrollHeight - el.clientHeight); }
    var tl = gsap.timeline({
      scrollTrigger: { trigger: el, start: 'top top', end: function () { return '+=' + travel(a); },
        pin: true, scrub: 1, anticipatePin: 1, invalidateOnRefresh: true }
    });
    tl.fromTo(a, { y: 0 }, { y: function () { return -travel(a); }, ease: 'none' })
      .fromTo(b, { y: function () { return -travel(b); } }, { y: 0, ease: 'none' }, 0);
    return function () { el.classList.remove('is-pinned'); };
  }
});
/* @end split-scroll */

/* @module color-shift | id: 09 | plugins: ScrollTrigger | cost: 3 */
CWB.define('color-shift', {
  init: function (el, api) {
    /* Colors interpolate in CSS via registered @property — any color space works. */
    var scenes = api.$$('[data-scene-bg]');
    function apply(s) {
      el.style.setProperty('--scene-bg', s.getAttribute('data-scene-bg'));
      el.style.setProperty('--scene-fg', s.getAttribute('data-scene-fg') || 'var(--c-fg)');
    }
    scenes.forEach(function (s) {
      ScrollTrigger.create({ trigger: s, start: 'top 55%', end: 'bottom 55%',
        onToggle: function (self) { if (self.isActive) apply(s); } });
    });
    if (scenes[0]) apply(scenes[0]);
  }
});
/* @end color-shift */

/* @module cursor | id: 10 | plugins: — | cost: 5 */
CWB.define('cursor', {
  init: function (el, api) {
    if (!api.cond.fine || api.cond.reduce) return;
    var root = document.documentElement;
    var dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cwb-cursor__dot'; ring.className = 'cwb-cursor__ring';
    ring.innerHTML = '<span class="cwb-cursor__label"></span>';
    [dot, ring].forEach(function (n) { n.setAttribute('aria-hidden', 'true'); document.body.appendChild(n); });
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, x: -100, y: -100 });
    root.classList.add('cwb-cursor');
    var dx = gsap.quickTo(dot, 'x', { duration: 0.08 }), dy = gsap.quickTo(dot, 'y', { duration: 0.08 });
    var rx = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' }), ry = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    var label = ring.firstChild;
    api.on(window, 'pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      root.classList.remove('cwb-cursor--out');
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
    });
    api.on(document, 'pointerover', function (e) {
      var t = e.target.closest('a, button, [role="button"], label, summary, [data-cursor]');
      ring.classList.toggle('is-hover', !!t);
      label.textContent = (t && t.getAttribute('data-cursor')) || '';
      ring.classList.toggle('has-label', !!label.textContent);
    });
    api.on(document, 'mouseleave', function () { root.classList.add('cwb-cursor--out'); });
    api.on(window, 'pointerdown', function () { ring.classList.add('is-down'); });
    api.on(window, 'pointerup', function () { ring.classList.remove('is-down'); });
    return function () { dot.remove(); ring.remove(); root.classList.remove('cwb-cursor', 'cwb-cursor--out'); };
  }
});
/* @end cursor */

/* @module magnetic | id: 10b | plugins: — | cost: 1 */
CWB.define('magnetic', {
  init: function (el, api) {
    if (!api.cond.fine || api.cond.reduce) return;
    var k = api.data('strength', 0.3), rect;
    var xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' });
    var yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' });
    api.on(el, 'pointerenter', function () { gsap.set(el, { x: 0, y: 0 }); rect = el.getBoundingClientRect(); });
    api.on(el, 'pointermove', function (e) {
      if (!rect) return;
      xTo((e.clientX - (rect.left + rect.width / 2)) * k);
      yTo((e.clientY - (rect.top + rect.height / 2)) * k);
    });
    api.on(el, 'pointerleave', function () { rect = null; gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)', overwrite: true }); });
  }
});
/* @end magnetic */

/* @module accordion-gallery | id: 11 | plugins: — | cost: 3 */
CWB.define('accordion-gallery', {
  init: function (el, api) {
    var items = api.$$('.accg__item');
    function open(target) {
      items.forEach(function (it) { it.setAttribute('aria-expanded', String(it === target)); });
    }
    items.forEach(function (it) {
      api.on(it, 'click', function () { open(it.getAttribute('aria-expanded') === 'true' ? null : it); }, false);
      if (api.cond.fine) api.on(it, 'pointerenter', function () { open(it); });
    });
    if (!items.some(function (i) { return i.getAttribute('aria-expanded') === 'true'; })) open(items[0]);
  }
});
/* @end accordion-gallery */

/* @module compare | id: 12 | plugins: — | cost: 2 */
CWB.define('compare', {
  init: function (el, api) {
    var range = api.$('.compare__range');
    function set() { el.style.setProperty('--pos', range.value + '%'); }
    api.on(range, 'input', set);
    set();
  }
});
/* @end compare */

/* @module image-trail | id: 13 | plugins: — | cost: 5 */
CWB.define('image-trail', {
  init: function (el, api) {
    if (!api.cond.fine || api.cond.reduce) return;
    var srcs = String(api.data('images', '')).split(',').map(function (s) { return s.trim(); }).filter(Boolean);
    if (!srcs.length) return;
    var POOL = Math.min(10, Math.max(6, srcs.length)), gap = api.data('gap', 90);
    var pool = [], i = 0, last = null;
    for (var n = 0; n < POOL; n++) {
      var img = new Image(); img.alt = ''; img.decoding = 'async';
      img.className = 'trail__img'; img.setAttribute('aria-hidden', 'true');
      img.src = srcs[n % srcs.length]; el.appendChild(img); pool.push(img);
    }
    api.on(el, 'pointermove', function (e) {
      var r = el.getBoundingClientRect(), x = e.clientX - r.left, y = e.clientY - r.top;
      if (last && Math.hypot(x - last.x, y - last.y) < gap) return;
      last = { x: x, y: y };
      var img = pool[i++ % POOL];
      el.appendChild(img); /* bring to top */
      gsap.killTweensOf(img);
      gsap.timeline()
        .set(img, { x: x, y: y, xPercent: -50, yPercent: -50, rotate: gsap.utils.random(-8, 8), scale: 0.7, opacity: 0 })
        .to(img, { opacity: 1, scale: 1, duration: 0.35, ease: 'expo.out' })
        .to(img, { opacity: 0, scale: 0.85, duration: 0.6, ease: 'power2.in' }, '+=0.45');
    });
    return function () { pool.forEach(function (p) { p.remove(); }); };
  }
});
/* @end image-trail */

/* @module flip-card | id: 14 | plugins: — | cost: 2 */
CWB.define('flip-card', {
  init: function (el, api) {
    var front = api.$('.flip__front'), back = api.$('.flip__back');
    var toggles = api.$$('.flip__toggle');
    function set(flipped, moveFocus) {
      el.classList.toggle('is-flipped', flipped);
      front.inert = flipped; back.inert = !flipped;
      toggles.forEach(function (t) { t.setAttribute('aria-expanded', String(flipped)); });
      if (moveFocus) { var f = (flipped ? back : front).querySelector('.flip__toggle'); if (f) f.focus(); }
    }
    toggles.forEach(function (t) {
      api.on(t, 'click', function () { set(!el.classList.contains('is-flipped'), true); }, false);
    });
    if (api.cond.fine && el.hasAttribute('data-hover')) {
      api.on(el, 'pointerenter', function () { set(true, false); });
      api.on(el, 'pointerleave', function () { set(false, false); });
    }
    set(false, false);
  }
});
/* @end flip-card */

/* @module repel-grid | id: 15 | plugins: — | cost: 4 */
CWB.define('repel-grid', {
  init: function (el, api) {
    if (!api.cond.fine || api.cond.reduce) return;
    var radius = api.data('radius', 140), force = api.data('force', 28);
    var tiles = api.$$('.repel__tile').map(function (t) {
      return { el: t, x: gsap.quickTo(t, 'x', { duration: 0.45, ease: 'power3' }), y: gsap.quickTo(t, 'y', { duration: 0.45, ease: 'power3' }) };
    });
    function measure() {
      tiles.forEach(function (t) { t.cx = t.el.offsetLeft + t.el.offsetWidth / 2; t.cy = t.el.offsetTop + t.el.offsetHeight / 2; });
    }
    measure();
    api.on(window, 'resize', measure);
    api.on(el, 'pointermove', function (e) {
      var r = el.getBoundingClientRect(), px = e.clientX - r.left, py = e.clientY - r.top;
      tiles.forEach(function (t) {
        var dx = t.cx - px, dy = t.cy - py, d = Math.hypot(dx, dy) || 1;
        var f = d < radius ? (1 - d / radius) * force : 0;
        t.x(dx / d * f); t.y(dy / d * f);
      });
    });
    api.on(el, 'pointerleave', function () {
      gsap.to(tiles.map(function (t) { return t.el; }), { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.5)', stagger: 0.01, overwrite: true });
    });
  }
});
/* @end repel-grid */

/* @module spotlight | id: 16 | plugins: — | cost: 2 */
CWB.define('spotlight', {
  init: function (el, api) {
    if (!api.cond.fine) return;
    var cards = api.$$('.spot__card'), rects = [];
    api.on(el, 'pointerenter', function () { rects = cards.map(function (c) { return c.getBoundingClientRect(); }); });
    api.on(el, 'pointermove', function (e) {
      cards.forEach(function (c, i) {
        var r = rects[i] || c.getBoundingClientRect();
        c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        c.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });
    api.on(el, 'pointerleave', function () {
      cards.forEach(function (c) { c.style.removeProperty('--mx'); c.style.removeProperty('--my'); });
    });
    api.on(window, 'scroll', function () { rects = []; });
  }
});
/* @end spotlight */

/* @module drag-canvas | id: 17 | plugins: Draggable InertiaPlugin | cost: 6 */
CWB.define('drag-canvas', {
  init: function (el, api) {
    if (!window.Draggable) return;
    var plane = api.$('.canvas__plane');
    gsap.set(plane, { x: (el.clientWidth - plane.scrollWidth) / 2, y: (el.clientHeight - plane.scrollHeight) / 2 });
    var d = Draggable.create(plane, {
      type: api.cond.fine ? 'x,y' : 'x', bounds: el, edgeResistance: 0.85,
      inertia: !!window.InertiaPlugin && !api.cond.reduce,
      allowNativeTouchScrolling: !api.cond.fine,
      onPress: function () { el.classList.add('is-dragging'); },
      onRelease: function () { el.classList.remove('is-dragging'); }
    })[0];
    var STEP = 160;
    api.on(el, 'keydown', function (e) {
      var map = { ArrowLeft: [STEP, 0], ArrowRight: [-STEP, 0], ArrowUp: [0, STEP], ArrowDown: [0, -STEP] };
      var m = map[e.key]; if (!m) return;
      e.preventDefault(); d.update(true);
      gsap.to(plane, { x: gsap.utils.clamp(d.minX, d.maxX, d.x + m[0]), y: gsap.utils.clamp(d.minY, d.maxY, d.y + m[1]),
        duration: api.cond.reduce ? 0 : 0.45, ease: 'power3.out', onUpdate: function () { d.update(); } });
    }, false);
    return function () { d.kill(); };
  }
});
/* @end drag-canvas */

/* @module morph-expand | id: 18 | plugins: — | cost: 4 */
CWB.define('morph-expand', {
  init: function (el, api) {
    var NAME = 'cwb-morph';
    var vt = !!document.startViewTransition && !api.cond.reduce;
    function openFrom(card) {
      var dlg = document.getElementById(card.getAttribute('data-morph-target'));
      if (!dlg) return;
      dlg._cwbCard = card;
      if (!vt) { dlg.showModal(); return; }
      card.style.viewTransitionName = NAME; /* one element owns the name at a time */
      document.startViewTransition(function () {
        card.style.viewTransitionName = '';
        dlg.showModal();
        dlg.style.viewTransitionName = NAME;
      }).finished.finally(function () { dlg.style.viewTransitionName = ''; });
    }
    function close(dlg) {
      var card = dlg._cwbCard;
      if (!vt || !card) { dlg.close(); if (card) card.focus(); return; }
      dlg.style.viewTransitionName = NAME;
      document.startViewTransition(function () {
        dlg.style.viewTransitionName = '';
        dlg.close();
        card.style.viewTransitionName = NAME;
      }).finished.finally(function () { card.style.viewTransitionName = ''; card.focus(); });
    }
    api.$$('[data-morph-target]').forEach(function (card) {
      api.on(card, 'click', function () { openFrom(card); }, false);
    });
    api.$$('dialog').forEach(function (dlg) {
      api.on(dlg, 'cancel', function (e) { e.preventDefault(); close(dlg); }, false);
      api.$$('.morph__close').forEach(function (b) {
        if (dlg.contains(b)) api.on(b, 'click', function (e) { e.stopPropagation(); close(dlg); }, false);
      });
    });
  }
});
/* @end morph-expand */

/* @module burst | id: 19 | plugins: — | cost: 2 */
CWB.define('burst', {
  init: function (el, api) {
    if (api.cond.reduce) return;
    var layer = document.querySelector('.cwb-burst-layer');
    if (!layer) { layer = document.createElement('div'); layer.className = 'cwb-burst-layer'; layer.setAttribute('aria-hidden', 'true'); document.body.appendChild(layer); }
    api.on(el, 'click', function (e) {
      if (layer.childElementCount > 60) return;
      var x = e.clientX, y = e.clientY;
      if (!x && !y) { var r = el.getBoundingClientRect(); x = r.left + r.width / 2; y = r.top + r.height / 2; }
      var N = 16;
      for (var i = 0; i < N; i++) {
        var p = document.createElement('i');
        p.className = 'cwb-burst-p cwb-burst-p--' + (i % 3);
        layer.appendChild(p);
        var a = (Math.PI * 2 * i) / N + gsap.utils.random(-0.2, 0.2), d = gsap.utils.random(50, 130);
        gsap.fromTo(p, { x: x, y: y, scale: gsap.utils.random(0.6, 1.2), opacity: 1 },
          { x: x + Math.cos(a) * d, y: y + Math.sin(a) * d + 20, scale: 0, opacity: 0, duration: gsap.utils.random(0.6, 0.95),
            ease: 'expo.out', onComplete: p.remove.bind(p) });
      }
    });
  }
});
/* @end burst */

/* @module counter | id: 20 | plugins: ScrollTrigger | cost: 2 */
CWB.define('counter', {
  init: function (el, api) {
    /* The real value is in the HTML (SEO + no-JS). Visual layer is aria-hidden. */
    var final = el.getAttribute('data-final') || el.textContent.trim();
    el.setAttribute('data-final', final);
    if (api.cond.reduce) { el.textContent = final; return; }
    var to = parseFloat(final.replace(/[^0-9.]/g, '')) || 0;
    var decimals = (final.split('.')[1] || '').replace(/\D/g, '').length;
    var m = final.match(/^([^0-9]*)[0-9.,]+(.*)$/) || ['', '', ''];
    var prefix = m[1], suffix = m[2];
    el.innerHTML = '<span class="sr-only">' + final + '</span><span class="counter__vis" aria-hidden="true"></span>';
    var vis = el.lastChild;
    var trigger = { trigger: el, start: 'top 85%', once: true };

    if (el.getAttribute('data-style') === 'odometer') {
      vis.innerHTML = final.split('').map(function (ch) {
        if (!/\d/.test(ch)) return '<span class="odo__sym">' + ch + '</span>';
        var cells = ''; for (var k = 0; k < 20; k++) cells += '<span>' + (k % 10) + '</span>';
        return '<span class="odo__col" data-d="' + ch + '"><span class="odo__reel">' + cells + '</span></span>';
      }).join('');
      var reels = Array.prototype.slice.call(vis.querySelectorAll('.odo__reel'));
      gsap.fromTo(reels, { yPercent: 0 }, {
        yPercent: function (i, t) { return -((10 + Number(t.parentNode.getAttribute('data-d'))) / 20) * 100; },
        duration: 1.8, ease: 'expo.out', stagger: { each: 0.08, from: 'end' }, scrollTrigger: trigger
      });
    } else {
      var fmt = new Intl.NumberFormat(document.documentElement.lang || 'en', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
      var o = { v: 0 };
      vis.style.minWidth = final.length + 'ch';
      vis.textContent = prefix + fmt.format(0) + suffix;
      gsap.to(o, { v: to, duration: 1.8, ease: 'expo.out', scrollTrigger: trigger,
        onUpdate: function () { vis.textContent = prefix + fmt.format(o.v) + suffix; } });
    }
    return function () { el.textContent = final; };
  }
});
/* @end counter */

/* @module coverflow | id: 21 | plugins: — | cost: 4 */
CWB.define('coverflow', {
  init: function (el, api) {
    var track = api.$('.cf__track');
    var items = api.$$('.cf__item');
    function step() { return items[0] ? items[0].offsetWidth + parseFloat(getComputedStyle(track).columnGap || 0) : 300; }
    api.$$('[data-cf]').forEach(function (b) {
      api.on(b, 'click', function () {
        track.scrollBy({ left: Number(b.getAttribute('data-cf')) * step(), behavior: api.cond.reduce ? 'auto' : 'smooth' });
      }, false);
    });
    /* CSS scroll-driven animations do the 3D tilt where supported (zero JS per frame). */
    if (api.cond.reduce || (window.CSS && CSS.supports('animation-timeline: view()'))) return;
    var queued = false;
    function paint() {
      queued = false;
      var mid = track.scrollLeft + track.clientWidth / 2;
      items.forEach(function (it) {
        var d = gsap.utils.clamp(-2.5, 2.5, (it.offsetLeft + it.offsetWidth / 2 - mid) / it.offsetWidth);
        it.style.transform = 'rotateY(' + (-d * 38) + 'deg) scale(' + (1 - Math.abs(d) * 0.12) + ')';
        it.style.opacity = String(1 - Math.abs(d) * 0.28);
        it.style.zIndex = String(10 - Math.round(Math.abs(d) * 3));
      });
    }
    api.on(track, 'scroll', function () { if (!queued) { queued = true; requestAnimationFrame(paint); } });
    api.on(window, 'resize', paint);
    paint();
    return function () { items.forEach(function (it) { it.style.transform = it.style.opacity = it.style.zIndex = ''; }); };
  }
});
/* @end coverflow */

/* @module island-nav | id: 22 | plugins: ScrollTrigger | cost: 3 */
CWB.define('island-nav', {
  init: function (el, api) {
    var toggle = api.$('.island__toggle'), inner = api.$('.island__menu-inner');
    var pinnedOpen = false;
    function set(open) {
      el.setAttribute('data-open', String(open));
      toggle.setAttribute('aria-expanded', String(open));
      inner.inert = !open;
    }
    set(api.cond.desktop && window.scrollY < 120);
    api.on(toggle, 'click', function () {
      var open = el.getAttribute('data-open') !== 'true';
      pinnedOpen = open; set(open);
    }, false);
    api.on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && el.getAttribute('data-open') === 'true') { pinnedOpen = false; set(false); toggle.focus(); }
    }, false);
    if (!api.cond.desktop) {
      api.on(inner, 'click', function (e) { if (e.target.closest('a')) set(false); }, false);
      return;
    }
    ScrollTrigger.create({ start: 0, end: 'max', onUpdate: function (self) {
      if (pinnedOpen) return;
      if (self.scroll() < 120) set(true);
      else if (self.direction === 1) set(false);
    } });
  }
});
/* @end island-nav */

/* @module dock | id: 23 | plugins: — | cost: 3 */
CWB.define('dock', {
  init: function (el, api) {
    if (!api.cond.fine || api.cond.reduce) return;
    var items = api.$$('.dock__item').map(function (it) {
      return { el: it, s: gsap.quickTo(it, 'scale', { duration: 0.25, ease: 'power3' }), y: gsap.quickTo(it, 'y', { duration: 0.25, ease: 'power3' }) };
    });
    var centers = [];
    api.on(el, 'pointerenter', function () {
      gsap.set(items.map(function (i) { return i.el; }), { scale: 1, y: 0 });
      centers = items.map(function (i) { var r = i.el.getBoundingClientRect(); return r.left + r.width / 2; });
    });
    api.on(el, 'pointermove', function (e) {
      items.forEach(function (it, k) {
        var d = (e.clientX - centers[k]) / 80, s = 1 + 0.65 * Math.exp(-d * d);
        it.s(s); it.y(-(s - 1) * 22);
      });
    });
    api.on(el, 'pointerleave', function () { items.forEach(function (it) { it.s(1); it.y(0); }); });
  }
});
/* @end dock */

/* @module scramble | id: 24 | plugins: ScrollTrigger ScrambleTextPlugin | cost: 2 */
CWB.define('scramble', {
  init: function (el, api) {
    var text = el.getAttribute('data-final') || el.textContent;
    el.setAttribute('data-final', text);
    if (api.cond.reduce || !window.ScrambleTextPlugin) return;
    el.innerHTML = '<span class="sr-only"></span><span aria-hidden="true"></span>';
    el.firstChild.textContent = text; el.lastChild.textContent = text; /* real text paints first */
    gsap.to(el.lastChild, { duration: 1.3, ease: 'none',
      scrambleText: { text: text, chars: api.data('chars', 'upperCase'), revealDelay: 0.25, speed: 0.5 },
      scrollTrigger: { trigger: el, start: 'top 85%', once: true } });
    return function () { el.textContent = text; };
  }
});
/* @end scramble */

/* @module marquee | id: 25 | plugins: ScrollTrigger | cost: 4 */
CWB.define('marquee', {
  init: function (el, api) {
    if (api.cond.reduce) return; /* CSS renders a static, wrapped list */
    var track = api.$('.marquee__track');
    var clone = track.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    clone.querySelectorAll('a, button').forEach(function (n) { n.tabIndex = -1; });
    track.parentNode.appendChild(clone);
    el.classList.add('is-running');
    var inner = track.parentNode;
    var pps = api.data('speed', 60), dir = api.data('direction', 'left') === 'right' ? 1 : -1;
    var tl = gsap.fromTo(inner, { xPercent: dir === -1 ? 0 : -50 }, { xPercent: dir === -1 ? -50 : 0, ease: 'none', repeat: -1, duration: track.offsetWidth / pps });
    if (document.fonts) document.fonts.ready.then(function () { tl.duration(track.offsetWidth / pps); });
    var rest = gsap.delayedCall(0.15, function () { gsap.to(tl, { timeScale: 1, duration: 0.8, ease: 'power2.out', overwrite: true }); }).pause();
    ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top',
      onToggle: function (self) { self.isActive ? tl.play() : tl.pause(); },
      onUpdate: function (self) {
        var boost = 1 + Math.min(Math.abs(self.getVelocity()) / 500, 4);
        gsap.to(tl, { timeScale: boost, duration: 0.2, overwrite: true });
        rest.restart(true);
      } });
    api.on(el, 'pointerenter', function () { tl.pause(); });
    api.on(el, 'pointerleave', function () { tl.play(); });
    api.on(el, 'focusin', function () { tl.pause(); });
    api.on(el, 'focusout', function () { tl.play(); });
    return function () { clone.remove(); el.classList.remove('is-running'); rest.kill(); };
  }
});
/* @end marquee */

/* @module mesh-gradient | id: 26 | plugins: — | cost: 3 */
CWB.define('mesh-gradient', {
  init: function (el, api) {
    if (api.env.saveData || api.env.lowPower) el.classList.add('is-lite');
    var io = new IntersectionObserver(function (e) { el.classList.toggle('is-paused', !e[0].isIntersecting); });
    io.observe(el);
    return function () { io.disconnect(); el.classList.remove('is-paused', 'is-lite'); };
  }
});
/* @end mesh-gradient */

/* @module orbit-text | id: 27 | plugins: — | cost: 1 */
CWB.define('orbit-text', {
  init: function (el, api) {
    if (!el.querySelector('svg')) {
      var id = 'orbit-' + Math.random().toString(36).slice(2, 8), r = 70, C = 2 * Math.PI * r;
      var t = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      t.setAttribute('viewBox', '0 0 180 180'); t.setAttribute('aria-hidden', 'true'); t.classList.add('orbit__svg');
      t.innerHTML = '<defs><path id="' + id + '" d="M90,90 m-' + r + ',0 a' + r + ',' + r + ' 0 1,1 ' + 2 * r + ',0 a' + r + ',' + r + ' 0 1,1 -' + 2 * r + ',0"/></defs>' +
        '<text textLength="' + C.toFixed(1) + '" lengthAdjust="spacing"><textPath href="#' + id + '"></textPath></text>';
      t.querySelector('textPath').textContent = api.data('text', '');
      el.insertBefore(t, el.firstChild);
    }
    var io = new IntersectionObserver(function (e) { el.classList.toggle('is-paused', !e[0].isIntersecting); });
    io.observe(el);
    return function () { io.disconnect(); };
  }
});
/* @end orbit-text */

/* @module glitch | id: 28 | plugins: ScrollTrigger | cost: 2 */
CWB.define('glitch', {
  init: function (el, api) {
    el.setAttribute('data-text', el.textContent);
    if (api.cond.reduce) return;
    var timer;
    function fire() { el.classList.remove('is-glitching'); void el.offsetWidth; el.classList.add('is-glitching');
      clearTimeout(timer); timer = setTimeout(function () { el.classList.remove('is-glitching'); }, 650); }
    ScrollTrigger.create({ trigger: el, start: 'top 80%', once: true, onEnter: fire });
    api.on(el, 'pointerenter', fire);
    api.on(el, 'focusin', fire);
    return function () { clearTimeout(timer); };
  }
});
/* @end glitch */

/* @module typewriter | id: 29 | plugins: — | cost: 2 */
CWB.define('typewriter', {
  init: function (el, api) {
    var phrases; try { phrases = JSON.parse(el.getAttribute('data-phrases')); } catch (e) { phrases = [el.textContent]; }
    var original = el.innerHTML;
    el.innerHTML = '<span class="sr-only"></span><span class="tw__vis" aria-hidden="true"><span class="tw__ghosts"></span><span class="tw__live"></span></span>';
    el.firstChild.textContent = phrases.join(' · ');
    var ghosts = el.querySelector('.tw__ghosts'), live = el.querySelector('.tw__live');
    phrases.forEach(function (p) { var g = document.createElement('span'); g.textContent = p; ghosts.appendChild(g); });
    if (api.cond.reduce) { live.textContent = phrases[0]; return function () { el.innerHTML = original; }; }
    var pi = 0, ci = 0, del = false, timer = null, visible = false;
    function tick() {
      var p = phrases[pi];
      live.textContent = p.slice(0, ci);
      var wait = del ? 28 : 55;
      if (!del && ci === p.length) { del = true; wait = 2000; }
      else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 350; }
      ci += del ? -1 : 1;
      if (del && ci < 0) ci = 0;
      timer = visible ? setTimeout(tick, wait) : null;
    }
    var io = new IntersectionObserver(function (e) {
      visible = e[0].isIntersecting;
      if (visible && !timer) tick();
    });
    io.observe(el);
    return function () { io.disconnect(); clearTimeout(timer); el.innerHTML = original; };
  }
});
/* @end typewriter */

/* @module stroke-text | id: 30 | plugins: — | cost: 1 */
CWB.define('stroke-text', {
  init: function (el, api) {
    el.setAttribute('data-text', el.textContent);
    var io = new IntersectionObserver(function (e) { el.classList.toggle('is-paused', !e[0].isIntersecting); });
    io.observe(el);
    return function () { io.disconnect(); };
  }
});
/* @end stroke-text */

/* @module line-reveal | id: 31 | plugins: SplitText ScrollTrigger | cost: 3 */
CWB.gateDone = CWB.gateDone || Promise.resolve();
CWB.define('line-reveal', {
  init: function (el, api) {
    var show = function () { gsap.set(el, { visibility: 'visible' }); };
    if (api.cond.reduce || !window.SplitText) { show(); return; }
    var onLoad = api.data('trigger', 'scroll') === 'load';
    var split;
    try {
      split = SplitText.create(el, {
        type: 'lines', mask: 'lines', autoSplit: true, aria: 'auto',
        onSplit: function (self) {
          show();
          var vars = { yPercent: 110, duration: onLoad ? 0.85 : 0.9, ease: 'expo.out', stagger: 0.08 };
          if (!onLoad) vars.scrollTrigger = { trigger: el, start: 'top 85%', once: true };
          else vars.delay = 0.05;
          var tw = gsap.from(self.lines, vars);
          /* Hero lines wait for the intro gate (if any) instead of playing under it. */
          if (onLoad) { tw.pause(); CWB.gateDone.then(function () { tw.play(); }); }
          return tw;
        }
      });
    } catch (err) { show(); throw err; }
    return function () { if (split) split.revert(); };
  }
});
/* @end line-reveal */

/* @module frame-scrub | id: 32 | plugins: ScrollTrigger | cost: 20 */
CWB.define('frame-scrub', {
  init: function (el, api) {
    /* Reduced motion / save-data: poster only. */
    if (api.cond.reduce || api.env.saveData) return;
    var canvas = api.$('.scrub__canvas'), ctx = canvas.getContext('2d');
    var pattern = api.data('src', ''), count = api.data('count', 0), pad = api.data('pad', 3);
    var stepN = api.cond.desktop ? 1 : api.data('mobile-step', 2);
    if (!pattern || !count) return;
    var urls = [];
    for (var i = 1; i <= count; i += stepN) urls.push(pattern.replace('{i}', String(i).padStart(pad, '0')));
    var frames = new Array(urls.length), current = -1, target = 0;
    /* Progressive fill: every 8th frame first, then the gaps — scrubbing works early. */
    var order = [];
    for (var s = 8; s >= 1; s = s / 2 | 0) { for (var k = 0; k < urls.length; k += s) if (order.indexOf(k) < 0) order.push(k); if (s === 1) break; }
    var cancelled = false;
    (function loadNext(n) {
      if (cancelled || n >= order.length) return;
      var idx = order[n], img = new Image();
      img.decoding = 'async'; img.src = urls[idx];
      img.decode().then(function () { frames[idx] = img; if (idx === 0) draw(0, true); }).catch(function () {})
        .finally(function () { loadNext(n + 1); });
    })(0);
    function nearest(i) { for (var d = 0; d < frames.length; d++) { if (frames[i - d]) return i - d; if (frames[i + d]) return i + d; } return -1; }
    function size() {
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = canvas.clientWidth * dpr; canvas.height = canvas.clientHeight * dpr; current = -1;
    }
    function draw(i, force) {
      var n = nearest(i); if (n < 0 || (n === current && !force)) return;
      var img = frames[n], cw = canvas.width, ch = canvas.height;
      var sc = Math.max(cw / img.naturalWidth, ch / img.naturalHeight), w = img.naturalWidth * sc, h = img.naturalHeight * sc;
      ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h); current = n;
      el.classList.add('is-live');
    }
    size(); api.on(window, 'resize', function () { size(); draw(target, true); });
    ScrollTrigger.create({ trigger: el, start: 'top top', end: '+=' + api.data('scroll', 300) + '%',
      pin: true, scrub: true, anticipatePin: 1,
      onUpdate: function (self) { target = Math.round(self.progress * (frames.length - 1)); } });
    api.loop(function () { draw(target); });
    return function () { cancelled = true; el.classList.remove('is-live'); };
  }
});
/* @end frame-scrub */

/* @module velocity-skew | id: 34 | plugins: ScrollTrigger | cost: 3 */
CWB.define('velocity-skew', {
  init: function (el, api) {
    if (api.cond.reduce) return;
    var items = api.$$('[data-skew]'); if (!items.length) items = [el];
    var max = api.data('max', 6);
    var to = gsap.quickTo(items, 'skewY', { duration: 0.45, ease: 'power3' });
    var clamp = gsap.utils.clamp(-max, max);
    var rest = gsap.delayedCall(0.12, function () { to(0); }).pause(); /* the v2 bug: no return-to-rest */
    ScrollTrigger.create({ trigger: el, start: 'top bottom', end: 'bottom top',
      onUpdate: function (self) { to(clamp(self.getVelocity() / -300)); rest.restart(true); } });
    return function () { rest.kill(); gsap.set(items, { skewY: 0 }); };
  }
});
/* @end velocity-skew */

/* @module intro-gate | id: 35 | plugins: — | cost: 3 */
CWB.gateDone = CWB.gateDone || Promise.resolve();
CWB.define('intro-gate', {
  init: function (el, api) {
    var KEY = 'cwb-gate-seen', seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
    function done() { el.remove(); document.documentElement.classList.remove('cwb-gated'); if (CWB.lenis) CWB.lenis.start(); ScrollTrigger.refresh(); }
    if (api.cond.reduce || seen) { done(); return; }
    var resolve; CWB.gateDone = new Promise(function (r) { resolve = r; });
    document.documentElement.classList.add('cwb-gated');
    if (CWB.lenis) CWB.lenis.stop();
    var max = api.data('max', 1800);
    var crit = Array.prototype.slice.call(document.querySelectorAll('img[fetchpriority="high"]'))
      .map(function (i) { return i.decode ? i.decode().catch(function () {}) : null; });
    var ready = Promise.all(crit.concat([document.fonts ? document.fonts.ready : null]));
    var cap = new Promise(function (r) { setTimeout(r, max); });
    Promise.race([ready, cap]).then(function () {
      try { sessionStorage.setItem(KEY, '1'); } catch (e) {}
      gsap.timeline({ onComplete: function () { done(); resolve(); } })
        .to(api.$('.gate__bar'), { scaleX: 1, duration: 0.45, ease: 'power2.inOut' })
        .to(el, { yPercent: -100, duration: 0.8, ease: 'expo.inOut' }, '+=0.05');
    });
  }
});
/* @end intro-gate */

/* @module video-hero | id: 37 | plugins: — | cost: 4 */
CWB.define('video-hero', {
  init: function (el, api) {
    /* HTML carries autoplay/muted/loop/playsinline + poster, so the video plays even if JS
       fails. JS adds: reduced-motion + save-data → poster only, offscreen pause, and a
       visible pause control (WCAG 2.2.2 for motion > 5 s). */
    var video = api.$('.vhero__video'), btn = api.$('.vhero__toggle');
    if (!video) return;
    var KEY = 'cwb-hero-paused', userPaused = false;
    try { userPaused = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
    function setBtn() {
      if (!btn) return;
      var paused = video.paused;
      btn.setAttribute('aria-pressed', String(paused));
      btn.setAttribute('aria-label', paused ? 'Play background video' : 'Pause background video');
      el.classList.toggle('is-paused', paused);
    }
    function play() { var p = video.play(); if (p && p.catch) p.catch(function () { setBtn(); }); }
    if (api.cond.reduce || api.env.saveData || userPaused) {
      video.removeAttribute('autoplay'); video.pause(); setBtn();
    }
    if (btn) api.on(btn, 'click', function () {
      if (video.paused) { userPaused = false; play(); } else { userPaused = true; video.pause(); }
      try { sessionStorage.setItem(KEY, userPaused ? '1' : '0'); } catch (e) {}
      setBtn();
    }, false);
    api.on(video, 'play', setBtn); api.on(video, 'pause', setBtn);
    var io = new IntersectionObserver(function (e) {
      if (!e[0].isIntersecting) { if (!video.paused) video.pause(); }
      else if (!userPaused && !api.cond.reduce && !api.env.saveData) play();
    }, { threshold: 0.05 });
    io.observe(el);
    setBtn();
    return function () { io.disconnect(); };
  }
});
/* @end video-hero */

/* @module voice-agent | id: 38 | plugins: — | cost: 0 */
CWB.define('voice-agent', {
  init: function (el, api) {
    /* No vendor SDK: the page's own voice runtime (sa-voice-agent-builder, Gemini Flash Live)
       listens for cwb:voice-start / cwb:voice-stop and reports back through detail.state /
       detail.say. Without data-ready="true" the widget shows the fallback link only. */
    var btn = api.$('.voice__btn'), status = api.$('.voice__status'), fallback = api.$('.voice__fallback');
    function say(t) { if (status) status.textContent = t; }
    function state(s) { el.setAttribute('data-state', s); btn.setAttribute('aria-pressed', String(s === 'live')); }
    function fail(msg) { state('error'); say(msg || ''); if (fallback) fallback.hidden = false; }
    state('idle');
    if (api.data('ready', '') !== 'true') { console.warn('CWB voice-agent: no voice runtime (data-ready) — showing fallback only'); fail(''); return; }
    api.on(btn, 'click', function () {
      var cur = el.getAttribute('data-state'), live = cur === 'live' || cur === 'connecting';
      if (!live) { state('connecting'); say('Connecting… allow microphone access when asked.'); }
      el.dispatchEvent(new CustomEvent(live ? 'cwb:voice-stop' : 'cwb:voice-start', { bubbles: true, detail: { el: el, state: state, say: say, fail: fail } }));
    }, false);
  }
});
/* @end voice-agent */

/* @module voice-gemini | id: 43 | plugins: — | cost: 0 */
CWB.define('voice-gemini', {
  init: function (el, api) {
    /* Gemini Live adapter for voice-agent (same element: data-cwb="voice-agent voice-gemini").
       No SDK: raw Live API WebSocket. The page never sees the API key — data-token-url
       (templates/api/voice-token.mjs) returns a one-use ephemeral token with the model,
       voice and system prompt locked server-side. Mic: 16 kHz PCM16 in; 24 kHz PCM16 out. */
    var tokenUrl = String(api.data('token-url', '/api/voice-token'));
    var WS = 'wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContentConstrained?access_token=';
    var gen = 0, ws = null, mic = null, inCtx = null, outCtx = null, node = null, playAt = 0, playing = [], ui = null;
    /* Worklet batches 100 ms (1600 samples) per message → ~10 socket sends/s. */
    var WORKLET = 'registerProcessor("cwb-pcm",class extends AudioWorkletProcessor{constructor(){super();this.b=new Int16Array(1600);this.n=0;this.s=0}process(i){var c=i[0][0];if(c)for(var k=0;k<c.length;k++){var v=Math.max(-1,Math.min(1,c[k]));this.b[this.n++]=v<0?v*32768:v*32767;this.s+=v*v;if(this.n===1600){var o=this.b.buffer;this.port.postMessage({pcm:o,rms:Math.sqrt(this.s/1600)},[o]);this.b=new Int16Array(1600);this.n=0;this.s=0}}return true}})';

    function b64(buf) { var b = new Uint8Array(buf), s = ''; for (var i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000)); return btoa(s); }
    function flush() { playing.forEach(function (n) { try { n.stop(); } catch (e) {} }); playing = []; playAt = 0; }
    function play(data) {
      var bin = atob(data), n = bin.length >> 1, buf = outCtx.createBuffer(1, n, 24000), ch = buf.getChannelData(0);
      for (var i = 0; i < n; i++) { var v = bin.charCodeAt(2 * i) | (bin.charCodeAt(2 * i + 1) << 8); ch[i] = (v > 32767 ? v - 65536 : v) / 32768; }
      var src = outCtx.createBufferSource(); src.buffer = buf; src.connect(outCtx.destination);
      playAt = Math.max(playAt, outCtx.currentTime); src.start(playAt); playAt += buf.duration;
      playing.push(src); src.onended = function () { playing = playing.filter(function (x) { return x !== src; }); };
    }
    function stop(msg) {
      gen++;
      if (ws) { ws.onclose = null; try { ws.close(); } catch (e) {} ws = null; }
      if (node) { node.port.onmessage = null; node.disconnect(); node = null; }
      if (mic) { mic.getTracks().forEach(function (t) { t.stop(); }); mic = null; }
      flush();
      [inCtx, outCtx].forEach(function (c) { if (c) c.close(); }); inCtx = outCtx = null;
      el.style.setProperty('--level', '0');
      if (ui && msg !== undefined) { ui.state('idle'); ui.say(msg); }
    }
    function fail(e) { console.error('voice-gemini', e); stop(); if (ui) ui.fail('Voice is unavailable right now.'); }

    api.on(el, 'cwb:voice-start', function (e) {
      ui = e.detail; stop(); var my = gen;
      /* AudioContexts must be created inside the click gesture. */
      inCtx = new AudioContext({ sampleRate: 16000 }); outCtx = new AudioContext({ sampleRate: 24000 });
      Promise.all([
        fetch(tokenUrl, { method: 'POST' }).then(function (r) { if (!r.ok) throw new Error('token ' + r.status); return r.json(); }),
        navigator.mediaDevices.getUserMedia({ audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true } }),
        inCtx.audioWorklet.addModule(URL.createObjectURL(new Blob([WORKLET], { type: 'text/javascript' })))
      ]).then(function (r) {
        if (my !== gen) { r[1].getTracks().forEach(function (x) { x.stop(); }); return; }
        var t = r[0]; mic = r[1];
        ws = new WebSocket(WS + encodeURIComponent(t.token));
        ws.onopen = function () { ws.send(JSON.stringify({ setup: { model: 'models/' + t.model } })); };
        ws.onerror = function () { fail('socket error'); };
        ws.onclose = function (ev) { stop(ev.code === 1000 ? 'Call ended.' : 'Call dropped.'); };
        ws.onmessage = function (ev) {
          (ev.data instanceof Blob ? ev.data.text() : Promise.resolve(ev.data)).then(function (txt) {
            var m = JSON.parse(txt), sc = m.serverContent;
            if (m.setupComplete) {
              node = new AudioWorkletNode(inCtx, 'cwb-pcm');
              node.port.onmessage = function (p) {
                el.style.setProperty('--level', Math.min(1, p.data.rms * 4).toFixed(3));
                if (ws && ws.readyState === 1) ws.send(JSON.stringify({ realtimeInput: { audio: { data: b64(p.data.pcm), mimeType: 'audio/pcm;rate=16000' } } }));
              };
              inCtx.createMediaStreamSource(mic).connect(node);
              ui.state('live'); ui.say('Connected — go ahead and talk.');
            }
            if (sc && sc.interrupted) flush();
            if (sc && sc.modelTurn) (sc.modelTurn.parts || []).forEach(function (pt) { if (pt.inlineData && /^audio\/pcm/.test(pt.inlineData.mimeType || '')) play(pt.inlineData.data); });
            if (m.goAway) say('Call ending soon.');
          }).catch(fail);
        };
      }).catch(function (err) { fail(err); if (err && err.name === 'NotAllowedError') ui.say('Microphone blocked — allow it to talk, or use the link.'); });
    });
    api.on(el, 'cwb:voice-stop', function () { stop('Call ended.'); });
    function say(t) { if (ui) ui.say(t); }
    return function () { stop(); };
  }
});
/* @end voice-gemini */

/* @module expand-panels | id: 39 | plugins: — | cost: 6 */
/* Expanding video panels. Clean-room build from observed public behaviour
   (references/examples/menken-clean-room.md); no reference code, art or copy.
   data-variant="bold" (default): 12vh bar → 2× inner, neighbours shift ±½ bar,
   0.6s in, 0.1s hold + 0.4s out, power3.out (our ease), one video at a time.
   data-variant="gentle" (trust sectors): 1.4× inner from centre, neighbours still,
   0.45s power2.out, posters only — no video playback. */
CWB.define('expand-panels', {
  init: function (el, api) {
    var panels = api.$$('.expand__panel');
    var inners = api.$$('.expand__inner');
    var medias = api.$$('.expand__media');
    var captions = api.$$('.expand__caption');
    var rest = api.$('.expand__rest');
    var reduce = api.cond.reduce;
    var gentle = el.getAttribute('data-variant') === 'gentle';
    var mobileQ = window.matchMedia('(max-width: 699.98px)');
    var mobile = mobileQ.matches;
    var fine = api.cond.fine && !mobile;
    var active = -1, outCall = null;
    var GROW = gentle ? 1.4 : 2, EASE = gentle ? 'power2.out' : 'power3.out';
    var DUR_IN = gentle ? 0.45 : 0.6, DUR_OUT = gentle ? 0.35 : 0.4, HOLD = 0.1;
    var playVideo = !gentle && !reduce && !api.env.saveData;
    var bar = function () { return panels[0] ? panels[0].getBoundingClientRect().width : 0; };

    function setVideo(i, on) {
      var p = panels[i], vid = p && p.querySelector('video');
      if (!vid) return;
      if (on && playVideo) {
        var src = p.getAttribute('data-video');
        if (src && vid.getAttribute('data-loaded') !== '1') { vid.src = src; vid.setAttribute('data-loaded', '1'); }
        var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {});
        gsap.to(vid, { opacity: 1, duration: 0.3, ease: 'none', overwrite: 'auto' });
      } else {
        gsap.to(vid, { opacity: 0, duration: reduce ? 0 : 0.3, ease: 'none', delay: reduce ? 0 : HOLD, overwrite: 'auto',
          onComplete: function () { try { vid.pause(); } catch (e) {} } });
      }
    }
    function layout(index, instant) {
      var w = bar(), dur = instant || reduce ? 0 : (index === -1 ? DUR_OUT : DUR_IN);
      var grow = w * (GROW - 1), half = grow / 2;
      inners.forEach(function (inner, i) {
        var tw = w, x = 0, xp = -25;
        if (index !== -1) {
          if (i === index) { tw = w * GROW; x = -half; xp = 0; }
          else if (!gentle) x = i < index ? -half : half;
        }
        if (mobile) { tw = inner.parentElement.clientWidth; x = 0; xp = 0; }
        gsap.to(inner, { width: tw, x: x, duration: dur, ease: EASE, overwrite: 'auto' });
        if (medias[i]) gsap.to(medias[i], { xPercent: xp, duration: dur, ease: EASE, overwrite: 'auto' });
      });
    }
    function setCaption(index) {
      captions.forEach(function (c, i) {
        var on = i === index;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-hidden', on ? 'false' : 'true');
        if (on) c.removeAttribute('hidden'); else c.setAttribute('hidden', '');
      });
      if (rest) { rest.classList.toggle('is-off', index !== -1); rest.setAttribute('aria-hidden', index !== -1 ? 'true' : 'false'); }
    }
    function activate(index, instant) {
      if (index === active) return;
      if (outCall) { outCall.kill(); outCall = null; }
      if (active !== -1) { panels[active].classList.remove('is-active'); panels[active].setAttribute('aria-expanded', 'false'); setVideo(active, false); }
      active = index;
      el.setAttribute('data-active', String(index));
      if (index === -1) {
        var go = function () { layout(-1, instant); setCaption(-1); };
        if (instant || reduce) go(); else outCall = gsap.delayedCall(HOLD, go);
        return;
      }
      panels[index].classList.add('is-active');
      panels[index].setAttribute('aria-expanded', 'true');
      panels[index].style.zIndex = String(20 + index);
      layout(index, instant); setCaption(index); setVideo(index, true);
    }
    panels.forEach(function (p, i) {
      p.setAttribute('aria-expanded', 'false');
      if (!p.hasAttribute('type')) p.setAttribute('type', 'button');
      api.on(p, 'click', function () {
        if (fine && active === i && p.getAttribute('data-link')) { window.location.hash = p.getAttribute('data-link'); return; }
        activate(active === i ? -1 : i, reduce);
      }, false);
      api.on(p, 'focus', function () { if (fine) activate(i, reduce); });
      if (fine) {
        api.on(p, 'pointerenter', function () { activate(i, false); });
        api.on(p, 'pointerleave', function (ev) {
          var nxt = ev.relatedTarget && ev.relatedTarget.closest && ev.relatedTarget.closest('.expand__panel');
          if (nxt && el.contains(nxt)) return;
          if (active === i) activate(-1, false);
        });
      }
    });
    api.on(el, 'keydown', function (ev) {
      if (ev.key === 'Escape') { activate(-1, reduce); return; }
      if (ev.key !== 'ArrowRight' && ev.key !== 'ArrowLeft') return;
      ev.preventDefault();
      var next = active < 0 ? 0 : active + (ev.key === 'ArrowRight' ? 1 : -1);
      next = Math.max(0, Math.min(panels.length - 1, next));
      panels[next].focus(); activate(next, reduce);
    }, false);
    api.on(window, 'resize', function () { mobile = mobileQ.matches; layout(active, true); });
    /* Offscreen = collapsed and silent (one video at a time across the page). */
    var io = new IntersectionObserver(function (e) { if (!e[0].isIntersecting && active !== -1) activate(-1, true); }, { threshold: 0 });
    io.observe(el);
    layout(-1, true);
    return function () { io.disconnect(); if (outCall) outCall.kill(); panels.forEach(function (p, i) { setVideo(i, false); }); };
  }
});
/* @end expand-panels */

/* @module view-switch | id: 40 | plugins: — | cost: 3 */
/* Optional companion to expand-panels: two buttons swap data-view="gallery|explore".
   View Transitions when available and motion is allowed; instant swap otherwise. */
CWB.define('view-switch', {
  init: function (el, api) {
    var root = el.closest('.expand') || el;
    var btns = [].slice.call(root.querySelectorAll('.vswitch__btn'));
    var explore = root.querySelector('.expand__explore'), frame = root.querySelector('.expand__explore-frame');
    var label = root.querySelector('[data-explore-title]');
    var prev = root.querySelector('[data-explore-prev]'), next = root.querySelector('[data-explore-next]');
    var panels = [].slice.call(root.querySelectorAll('.expand__panel'));
    var idx = 0, reduce = api.cond.reduce, vt = !!document.startViewTransition && !reduce;
    function title(i) { var p = panels[(i + panels.length) % panels.length]; return (p && p.getAttribute('data-title')) || ''; }
    function paint() {
      var p = panels[idx]; if (!p || !frame) return;
      var img = frame.querySelector('img'), vid = frame.querySelector('video');
      var poster = p.getAttribute('data-poster'), src = p.getAttribute('data-video');
      if (img && poster) img.src = poster;
      var exploring = root.getAttribute('data-view') === 'explore';
      if (vid) {
        if (!exploring || reduce || api.env.saveData || !src) { vid.pause(); vid.style.opacity = '0'; }
        else { if (vid.getAttribute('data-src-now') !== src) { vid.src = src; vid.setAttribute('data-src-now', src); } vid.style.opacity = '1'; var pr = vid.play(); if (pr && pr.catch) pr.catch(function () {}); }
      }
      if (label) label.textContent = title(idx);
      if (prev) prev.textContent = '← ' + title(idx - 1);
      if (next) next.textContent = title(idx + 1) + ' →';
      var view = root.getAttribute('data-view') || 'gallery';
      btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.getAttribute('data-view') === view)); });
    }
    function setView(name) {
      var apply = function () {
        root.setAttribute('data-view', name);
        if (explore) { if (name === 'explore') explore.removeAttribute('hidden'); else { explore.setAttribute('hidden', ''); var v = explore.querySelector('video'); if (v) v.pause(); } }
        paint();
      };
      if (vt) document.startViewTransition(apply); else apply();
    }
    btns.forEach(function (b) { api.on(b, 'click', function () { setView(b.getAttribute('data-view') || 'gallery'); }, false); });
    if (prev) api.on(prev, 'click', function () { idx = (idx - 1 + panels.length) % panels.length; paint(); }, false);
    if (next) api.on(next, 'click', function () { idx = (idx + 1) % panels.length; paint(); }, false);
    root.setAttribute('data-view', 'gallery');
    paint();
  }
});
/* @end view-switch */

/* @module video-chapters | id: 41 | plugins: — | cost: 4 */
/* Video-per-section (Chuma's signature style). Put data-cwb="video-chapters" on <main>
   (or any wrapper). Each chapter <video> ships muted/loop/playsinline, preload="none",
   a poster, width/height and data-src — no src — so first load costs posters only.
   Rules: at most ONE chapter video loaded+playing at a time (the most-visible one);
   src is attached only when its chapter is chosen; offscreen = paused; reduced motion /
   save-data = posters only; one pause/play control ([data-vchap-toggle]) for all.
   Copy lives in the HTML next to each video, never in it. */
CWB.define('video-chapters', {
  init: function (el, api) {
    var vids = api.$$('video[data-src]');
    if (!vids.length) return;
    var toggles = [].slice.call(document.querySelectorAll('[data-vchap-toggle]'));
    var KEY = 'cwb-vchap-paused', userPaused = false;
    try { userPaused = sessionStorage.getItem(KEY) === '1'; } catch (e) {}
    var still = api.cond.reduce || api.env.saveData;
    var ratios = vids.map(function () { return 0; }), active = -1;
    function setToggle() {
      var paused = still || userPaused;
      toggles.forEach(function (b) {
        /* Visible text IS the accessible name (WCAG 2.5.3) — no aria-label. */
        b.setAttribute('aria-pressed', String(paused));
        var t = b.querySelector('[data-vchap-label]'); if (t) t.textContent = paused ? 'Play motion' : 'Pause motion';
      });
      el.classList.toggle('vchap-paused', paused);
    }
    function play(i) {
      var v = vids[i]; if (!v) return;
      if (v.getAttribute('data-loaded') !== '1') { v.src = v.getAttribute('data-src'); v.setAttribute('data-loaded', '1'); }
      var p = v.play(); if (p && p.catch) p.catch(function () {});
      v.closest('[data-vchapter]') && v.closest('[data-vchapter]').classList.add('is-playing');
    }
    function stop(i) {
      var v = vids[i]; if (!v) return;
      try { v.pause(); } catch (e) {}
      v.closest('[data-vchapter]') && v.closest('[data-vchapter]').classList.remove('is-playing');
    }
    function choose() {
      var best = -1, bestR = 0.2;
      ratios.forEach(function (r, i) { if (r > bestR) { bestR = r; best = i; } });
      if (best !== active) { if (active !== -1) stop(active); active = best; el.setAttribute('data-vchap-active', String(best)); }
      if (active !== -1 && !still && !userPaused) play(active);
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { ratios[vids.indexOf(e.target)] = e.isIntersecting ? e.intersectionRatio : 0; });
      choose();
    }, { threshold: [0, 0.2, 0.4, 0.6, 0.8, 1] });
    vids.forEach(function (v) { io.observe(v); });
    toggles.forEach(function (b) {
      api.on(b, 'click', function () {
        if (still) return;
        userPaused = !userPaused;
        try { sessionStorage.setItem(KEY, userPaused ? '1' : '0'); } catch (e) {}
        if (userPaused && active !== -1) stop(active); else choose();
        setToggle();
      }, false);
    });
    api.on(document, 'visibilitychange', function () { if (document.hidden && active !== -1) stop(active); else choose(); });
    setToggle();
    return function () { io.disconnect(); vids.forEach(function (v, i) { stop(i); }); };
  }
});
/* @end video-chapters */

/* @module jumbo-fit | id: 42 | plugins: — | cost: 1 */
/* Fit a jumbo headline to its box (edge-to-edge words) with no overflow at 320–2560px.
   CSS does the first pass (.jumbo-box container + cqi size, so there is no layout jump and no
   CLS); this module only fine-tunes --jumbo-cqi after document.fonts.ready and on resize.
   Markup: div.jumbo-box > (heading).t-jumbo.t-jumbo--bleed[data-cwb="jumbo-fit"] containing the word
   Options: data-fit-max="0.98" (share of the box width), data-fit-min="40" (px floor).
   The word stays real HTML text. Works without GSAP-dependent features (no tweens). */
CWB.define('jumbo-fit', {
  init: function (el, api) {
    var box = el.parentElement, share = api.data('fit-max', 0.98), floor = api.data('fit-min', 40), raf = 0;
    function fit() {
      raf = 0;
      var bs = getComputedStyle(box);
      var W = box.clientWidth - parseFloat(bs.paddingLeft) - parseFloat(bs.paddingRight); if (!(W > 0)) return; /* content box, not padding box */
      /* measure the END state: pause scroll-scrub animations (scale / tracking) for this synchronous read */
      var anim = el.style.animation; el.style.animation = 'none';
      el.style.setProperty('--jumbo-cqi', '100px');
      var probe = document.createRange(); probe.selectNodeContents(el);
      var w = probe.getBoundingClientRect().width || el.scrollWidth;
      if (!w) { el.style.animation = anim; return; }
      /* measured at 100px: size scales linearly with width (single-line bleed words) */
      var px = Math.max(floor, Math.floor(100 * (W * share) / w));
      el.style.setProperty('--jumbo-cqi', px + 'px');
      /* guard: never exceed the box */
      var r = document.createRange(); r.selectNodeContents(el);
      var over = r.getBoundingClientRect().width - W;
      if (over > 0.5) el.style.setProperty('--jumbo-cqi', Math.floor(px * W / (W + over + 2)) + 'px');
      el.style.animation = anim;
    }
    function schedule() { if (!raf) raf = requestAnimationFrame(fit); }
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(fit);
    var ro = new ResizeObserver(schedule); ro.observe(box);
    /* web fonts can arrive after fonts.ready resolved (lazy font loading) — refit when any font finishes */
    if (document.fonts && document.fonts.addEventListener) api.on(document.fonts, 'loadingdone', schedule);
    return function () { ro.disconnect(); if (raf) cancelAnimationFrame(raf); el.style.removeProperty('--jumbo-cqi'); };
  }
});
/* @end jumbo-fit */
