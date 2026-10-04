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
    if (!api.cond.desktop || api.cond.reduce) return;
    var track = api.$('.hpan__track');
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
    /* The provider SDK loads only when the visitor presses the button — zero cost on page load.
       Only the PUBLIC key belongs here. Private keys never ship in client code. */
    var btn = api.$('.voice__btn'), status = api.$('.voice__status'), fallback = api.$('.voice__fallback');
    var provider = api.data('provider', 'vapi');
    var pub = String(api.data('public-key', '')), assistant = String(api.data('assistant-id', ''));
    var configured = provider === 'custom' || (pub && assistant && !/\{\{|^pk_x+$/i.test(pub + assistant));
    var client = null, active = false, busy = false;
    function say(t) { if (status) status.textContent = t; }
    function state(s) { el.setAttribute('data-state', s); btn.setAttribute('aria-pressed', String(s === 'live')); }
    function fail(msg) { busy = false; active = false; state('error'); say(msg); if (fallback) fallback.hidden = false; }
    state('idle');
    if (!configured) { console.warn('CWB voice-agent: missing public key / assistant id — showing fallback only'); fail(''); return; }

    function load() {
      if (provider === 'custom') return Promise.resolve(null);
      return import('https://cdn.jsdelivr.net/npm/@vapi-ai/web@2.7.1/+esm').then(function (m) {
        var Vapi = (m.default && m.default.default) || m.default;
        var c = new Vapi(pub);
        c.on('call-start', function () { busy = false; active = true; state('live'); say('Connected — go ahead and talk.'); });
        c.on('call-end', function () { active = false; state('idle'); say('Call ended.'); });
        c.on('volume-level', function (v) { el.style.setProperty('--level', Math.min(1, v * 1.6).toFixed(3)); });
        c.on('error', function (e) { console.error('voice-agent', e); fail('Voice is unavailable right now.'); });
        return c;
      });
    }
    api.on(btn, 'click', function () {
      if (busy) return;
      if (active) { busy = true; say('Ending call…'); (client && client.stop ? client.stop() : Promise.resolve()).finally(function () { busy = false; }); return; }
      busy = true; state('connecting'); say('Connecting… allow microphone access when asked.');
      (client ? Promise.resolve(client) : load()).then(function (c) {
        client = c;
        if (provider === 'custom') {
          /* Gemini Flash Live / own runtime: sa-voice-agent-builder listens for this event. */
          el.dispatchEvent(new CustomEvent('cwb:voice-start', { bubbles: true, detail: { el: el } }));
          busy = false; return;
        }
        return c.start(assistant);
      }).catch(function (e) { console.error('voice-agent', e); fail('Voice is unavailable right now.'); });
    }, false);
    return function () { if (client && active && client.stop) client.stop(); };
  }
});
/* @end voice-agent */
