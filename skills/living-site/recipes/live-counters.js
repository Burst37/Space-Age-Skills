// live-counters.js: sliders that drive big numbers which count (never jump) and a bar that fills like progress.
// <input type="range" data-calc="words" ...> and <b data-out="hours"></b>, <i data-bar></i>. Write compute() for the product.
// The slider track fills up to the thumb through the --p custom property: background:linear-gradient(90deg,var(--accent) var(--p),#2a2a2d var(--p)).
function liveCounters(root, compute, fmt = (n) => Math.round(n).toLocaleString('en-US')) {
  const ins = [...root.querySelectorAll('input[data-calc]')], outs = [...root.querySelectorAll('[data-out]')], bar = root.querySelector('[data-bar]');
  const shown = {}; let raf;
  const paint = (el) => el.style.setProperty('--p', ((el.value - el.min) / (el.max - el.min) * 100) + '%');
  function update(animate) {
    const v = Object.fromEntries(ins.map(i => [i.dataset.calc, +i.value])); ins.forEach(paint);
    const res = compute(v); // { hours: 20, value: 1210, fill: .3 }
    if (bar) bar.style.transform = `scaleX(${Math.min(1, res.fill ?? 0)})`;
    cancelAnimationFrame(raf); const from = { ...shown }, t0 = performance.now(), dur = animate ? 700 : 0;
    (function step(now) {
      const k = dur ? Math.min(1, (now - t0) / dur) : 1, e = 1 - (1 - k) ** 3;
      outs.forEach(o => { const key = o.dataset.out, a = from[key] ?? 0; shown[key] = a + (res[key] - a) * e; o.textContent = (o.dataset.prefix || '') + fmt(shown[key]); });
      if (k < 1) raf = requestAnimationFrame(step);
    })(t0);
  }
  ins.forEach(i => i.addEventListener('input', () => update(true)));
  new IntersectionObserver((es, ob) => es.forEach(e => { if (e.isIntersecting) { update(true); ob.disconnect(); } }), { threshold: .3 }).observe(root);
}
