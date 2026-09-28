/* ==========================================================================
   CWB RUNTIME v3 — Cinematic Website Builder kernel
   Inline this ONCE, after the GSAP <script> tags and before the module blocks.

   What it guarantees (every v2 systemic bug maps to one of these):
   - Module isolation: every module runs in its own closure + gsap.matchMedia
     context. No top-level `const track` collisions between modules.
   - Fail-open content: hidden "pre-reveal" states only apply under
     html.cwb-js AND prefers-reduced-motion: no-preference. The <head>
     snippet adds cwb-js; if GSAP/CDN fails, boot throws, or boot hasn't
     finished within the watchdog window, cwb-js is removed and the page
     renders fully visible.
   - Environment gating: reduced motion, fine pointer, viewport, save-data and
     low-power are resolved once and re-evaluated live via matchMedia.
   - Lifecycle: listeners registered through api.on() and loops through
     api.loop() are torn down automatically on context revert (breakpoint
     change, reduced-motion toggle) and paused while offscreen / tab hidden.
   - Layout truth: ScrollTrigger.refresh() after fonts + window load, so
     trigger positions never drift from late-loading type or media.
   ========================================================================== */
(function () {
  'use strict';
  var root = document.documentElement;
  var registry = {};
  var CWB = (window.CWB = { version: '3.0.0', registry: registry, instances: [] });

  var Q = {
    motion: '(prefers-reduced-motion: no-preference)',
    reduce: '(prefers-reduced-motion: reduce)',
    fine: '(hover: hover) and (pointer: fine)',
    desktop: '(min-width: 900px)',
    mobile: '(max-width: 899.98px)'
  };
  CWB.queries = Q;

  function mq(q) { return window.matchMedia(q).matches; }
  var conn = navigator.connection || {};
  CWB.env = {
    get reducedMotion() { return mq(Q.reduce); },
    get finePointer() { return mq(Q.fine); },
    get desktop() { return mq(Q.desktop); },
    saveData: !!conn.saveData,
    lowPower: (navigator.deviceMemory && navigator.deviceMemory < 4) ||
              (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4) || false
  };

  /* define(name, { plugins:[], init(el, api) -> cleanup? })
     init runs inside gsap.matchMedia; api.cond holds the live conditions. */
  CWB.define = function (name, def) { registry[name] = def; };

  function makeApi(el, conditions) {
    var disposers = [];
    var api = {
      el: el,
      cond: conditions,
      env: CWB.env,
      $: function (s) { return el.querySelector(s); },
      $$: function (s) { return Array.prototype.slice.call(el.querySelectorAll(s)); },
      data: function (k, fallback) {
        var v = el.getAttribute('data-' + k);
        if (v === null || v === '') return fallback;
        var n = Number(v);
        return isNaN(n) ? v : n;
      },
      /* Passive by default; pass `false` (or an options object) when the
         handler must call preventDefault(). */
      on: function (target, type, fn, opts) {
        var o = opts === undefined ? { passive: true } : opts;
        target.addEventListener(type, fn, o);
        disposers.push(function () { target.removeEventListener(type, fn, o); });
      },
      /* rAF loop via gsap.ticker that only runs while `watch` is on screen. */
      loop: function (fn, watch) {
        var running = false;
        function start() { if (!running) { running = true; gsap.ticker.add(fn); } }
        function stop() { if (running) { running = false; gsap.ticker.remove(fn); } }
        var io = new IntersectionObserver(function (entries) {
          entries[0].isIntersecting ? start() : stop();
        }, { rootMargin: '10% 0px' });
        io.observe(watch || el);
        disposers.push(function () { io.disconnect(); stop(); });
        return { start: start, stop: stop };
      },
      onDispose: function (fn) { disposers.push(fn); },
      _dispose: function () { while (disposers.length) { try { disposers.pop()(); } catch (e) {} } }
    };
    return api;
  }

  function boot() {
    if (!window.gsap) throw new Error('CWB: GSAP not loaded');
    var plugins = ['ScrollTrigger', 'SplitText', 'ScrambleTextPlugin', 'DrawSVGPlugin',
      'Flip', 'Observer', 'Draggable', 'InertiaPlugin', 'CustomEase']
      .map(function (p) { return window[p]; }).filter(Boolean);
    gsap.registerPlugin.apply(gsap, plugins);
    if (window.ScrollTrigger) ScrollTrigger.config({ ignoreMobileResize: true });

    root.classList.add('cwb-ready');
    initSmoothScroll();

    var nodes = document.querySelectorAll('[data-cwb]');
    Array.prototype.forEach.call(nodes, function (el) {
      el.getAttribute('data-cwb').split(/\s+/).forEach(function (name) {
        var def = registry[name];
        if (!def) { console.warn('CWB: unknown module "' + name + '"'); return; }
        var mm = gsap.matchMedia();
        mm.add({ motion: Q.motion, reduce: Q.reduce, fine: Q.fine, desktop: Q.desktop, mobile: Q.mobile },
          function (ctx) {
            var api = makeApi(el, ctx.conditions);
            var cleanup;
            try { cleanup = def.init(el, api); }
            catch (err) { console.error('CWB module "' + name + '" failed:', err); el.classList.add('cwb-failed'); }
            return function () { api._dispose(); if (typeof cleanup === 'function') cleanup(); };
          }, el);
        CWB.instances.push({ name: name, el: el, mm: mm });
      });
    });

    function refresh() { if (window.ScrollTrigger) ScrollTrigger.refresh(); }
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(refresh);
    if (document.readyState === 'complete') refresh(); else window.addEventListener('load', refresh, { once: true });
    root.classList.add('cwb-booted');
    document.dispatchEvent(new CustomEvent('cwb:ready'));
  }

  /* Smooth scroll is OPT-IN (<html data-cwb-smooth>) and never instantiated
     for reduced motion or coarse pointers. Native scroll is the default. */
  function initSmoothScroll() {
    if (!root.hasAttribute('data-cwb-smooth') || !window.Lenis) return;
    if (CWB.env.reducedMotion || !CWB.env.finePointer) return;
    var lenis = new Lenis({ lerp: 0.1, anchors: true });
    CWB.lenis = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  }

  /* Watchdog: if boot never completes, drop the pre-reveal class so no
     content is left invisible. */
  var watchdog = setTimeout(function () {
    if (!root.classList.contains('cwb-booted')) root.classList.remove('cwb-ready', 'cwb-js');
  }, 2500);

  function start() {
    try { boot(); } catch (err) {
      console.error(err);
      root.classList.remove('cwb-ready', 'cwb-js');
    } finally { clearTimeout(watchdog); }
  }
  CWB.start = start;
  /* Modules are defined after this file; boot once the DOM is parsed. */
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else setTimeout(start, 0);
})();
