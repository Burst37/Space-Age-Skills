/* Shared motion engine for the scroll-film sites.
   Scrub(opts)  — canvas + pre-extracted JPEG frames scrubbed by a scroll driver.
                  ImageBitmap sliding window (off-thread decode), lerped playhead, nearest-frame fallback.
   Loop(canvas, render) — a code-drawn loop: render(ctx, t, w, h, dpr). Runs only on screen and while
                  Motion is not 'off'; in 'off' it paints one still frame (t = opts.still).
   One shared rAF for everything. Dev contract: ?jump=<y> and window.__ready. */
(function () {
  const Q = new URLSearchParams(location.search);
  const JUMP = Q.get('jump');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const items = new Set();
  let last = performance.now();
  const jank = { deltas: [] };

  function tick(now) {
    const dt = Math.min(0.1, (now - last) / 1000); last = now;
    jank.deltas.push(dt * 1000); if (jank.deltas.length > 240) jank.deltas.shift();
    for (const it of items) { try { it.tick(dt, now); } catch (e) { console.error(e); } }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);

  const moving = () => !window.Motion || window.Motion.moving;

  function Scrub(o) {
    const canvas = o.canvas, ctx = canvas.getContext('2d', { alpha: false });
    const N = o.count, fps = o.fps || 24;
    const AHEAD = Math.round((o.aheadSec || 2) * fps), KEEP = Math.round((o.behindSec || 1.4) * fps) + AHEAD;
    const images = new Array(N), loaded = new Uint8Array(N);
    const bitmaps = new Map(), decoding = new Set();
    let bmpCenter = -999, current = 0, target = 0, displayed = -1, progress = 0, nLoaded = 0;
    const maxCrop = o.maxCrop ?? 0.22;
    let cw = 0, ch = 0, blendF = 0, lastBlend = -1;

    function resize() {
      const r = canvas.getBoundingClientRect();
      const dpr = Math.min(o.dpr || 1, devicePixelRatio || 1);
      cw = Math.max(2, Math.round(r.width * dpr)); ch = Math.max(2, Math.round(r.height * dpr));
      if (canvas.width !== cw || canvas.height !== ch) { canvas.width = cw; canvas.height = ch; displayed = -1; }
    }
    function nearest(i) {
      for (let d = 0; d < N; d++) {
        if (i - d >= 0 && (bitmaps.has(i - d) || loaded[i - d])) return i - d;
        if (i + d < N && (bitmaps.has(i + d) || loaded[i + d])) return i + d;
      }
      return -1;
    }
    function draw(i, force) {
      if (i === displayed && !force) return;
      const k = bitmaps.has(i) || loaded[i] ? i : nearest(i);
      if (k < 0) return;
      const src = bitmaps.get(k) || images[k];
      const w0 = src.width, h0 = src.height;
      const sCover = Math.max(cw / w0, ch / h0);
      const crop = 1 - Math.min(cw / (w0 * sCover), ch / (h0 * sCover));
      const s = (o.cover || crop <= maxCrop) ? sCover : Math.min(cw / w0, ch / h0);
      const w = w0 * s, h = h0 * s;
      if (s !== sCover) { ctx.fillStyle = o.bg || '#000'; ctx.fillRect(0, 0, cw, ch); }
      ctx.drawImage(src, (cw - w) / 2 + (o.offsetX || 0) * cw, (ch - h) / 2, w, h);
      // blend: lay the next frame over at the playhead's fraction, so slow scrolls glide instead of step
      if (blendF > 0.02 && k === i && i + 1 < N && (bitmaps.has(i + 1) || loaded[i + 1])) {
        const nx = bitmaps.get(i + 1) || images[i + 1];
        ctx.globalAlpha = blendF; ctx.drawImage(nx, (cw - w) / 2 + (o.offsetX || 0) * cw, (ch - h) / 2, w, h); ctx.globalAlpha = 1;
      }
      displayed = k === i ? i : -1;
      o.onDraw && o.onDraw(ctx, cw, ch, k);
    }
    function ensure(center) {
      if (Math.abs(center - bmpCenter) < 3) return;
      bmpCenter = center;
      const lo = Math.max(0, center - KEEP + AHEAD), hi = Math.min(N - 1, center + AHEAD);
      for (let i = lo; i <= hi; i++) {
        if (bitmaps.has(i) || decoding.has(i) || !loaded[i]) continue;
        decoding.add(i);
        createImageBitmap(images[i]).then(b => {
          decoding.delete(i);
          if (Math.abs(i - bmpCenter) > KEEP) { b.close(); return; }
          bitmaps.set(i, b);
          if (i === Math.round(current)) draw(i, true);
        }).catch(() => decoding.delete(i));
      }
      for (const k of Array.from(bitmaps.keys())) if (k < center - KEEP || k > center + KEEP) { bitmaps.get(k).close(); bitmaps.delete(k); }
    }
    // concurrency-capped pump: opening run first, then stream the rest in order
    let next = 0; const inflight = { n: 0 };
    const order = [...Array(N).keys()];
    function pump() {
      while (inflight.n < (o.concurrency || 10) && next < N) {
        const i = order[next++]; inflight.n++;
        const img = new Image(); img.decoding = 'async';
        img.onload = () => { images[i] = img; loaded[i] = 1; nLoaded++; inflight.n--; o.onLoad && o.onLoad(nLoaded / N); if (i === 0) { resize(); draw(0, true); } pump(); };
        img.onerror = () => { inflight.n--; pump(); };
        img.src = o.src(i);
      }
    }
    pump();

    function measure() {
      const r = o.driver.getBoundingClientRect();
      const span = r.height - innerHeight;
      return span <= 0 ? 0 : Math.max(0, Math.min(1, -r.top / span));
    }
    const api = {
      get progress() { return progress; }, get frame() { return current; }, get loadedFraction() { return nLoaded / N; },
      canvas, resize, settle() { progress = measure(); target = current = progress * (N - 1); draw(Math.round(current), true); o.onProgress && o.onProgress(progress, current); },
      showFrame(i) { current = target = i; draw(i, true); },
      tick() {
        if (o.frozen && o.frozen()) return;
        progress = measure();
        target = progress * (N - 1);
        current += (target - current) * (reduced ? 1 : (o.lerp || 0.14));
        if (Math.abs(target - current) < 0.01) current = target;
        if (o.blend) {
          const i0 = Math.floor(current); blendF = current - i0;
          ensure(i0);
          const q = Math.round(blendF * 24);
          draw(i0, q !== lastBlend); lastBlend = q;
        } else {
          const i = Math.round(current);
          ensure(i);
          draw(i);
        }
        o.onProgress && o.onProgress(progress, current);
      }
    };
    addEventListener('resize', () => { resize(); draw(Math.round(current), true); });
    resize();
    items.add(api);
    return api;
  }

  function Loop(canvas, render, opts = {}) {
    const ctx = canvas.getContext('2d');
    let visible = false, t = opts.start || 0, w = 0, h = 0, dpr = 1, paintedStill = false;
    function resize() {
      const r = canvas.getBoundingClientRect();
      dpr = Math.min(opts.dpr || 2, devicePixelRatio || 1);
      w = r.width; h = r.height;
      canvas.width = Math.max(2, Math.round(w * dpr)); canvas.height = Math.max(2, Math.round(h * dpr));
      paintedStill = false; paint(t);
    }
    function paint(tt) { ctx.setTransform(dpr, 0, 0, dpr, 0, 0); render(ctx, tt, w, h, dpr); }
    new IntersectionObserver(es => { visible = es[0].isIntersecting; }, { rootMargin: '120px' }).observe(canvas);
    new ResizeObserver(resize).observe(canvas);
    const api = {
      get t() { return t; },
      tick(dt) {
        if (!visible) return;
        if (!moving() || reduced) {
          if (!paintedStill) { paint(opts.still ?? 0); paintedStill = true; }
          return;
        }
        paintedStill = false;
        t += dt * (opts.speed || 1);
        paint(t);
      }
    };
    items.add(api);
    return api;
  }

  function ready(fn) {
    const done = () => {
      if (JUMP !== null) { history.scrollRestoration = 'manual'; scrollTo(0, +JUMP || 0); }
      fn && fn();
      requestAnimationFrame(() => requestAnimationFrame(() => { window.__ready = true; }));
    };
    done();
  }

  window.MotionEngine = {
    Scrub, Loop, ready, JUMP, reduced,
    jank() { const d = [...jank.deltas].sort((a, b) => a - b); return { p95: d[Math.floor(d.length * 0.95)] | 0, max: d[d.length - 1] | 0 }; }
  };
})();
