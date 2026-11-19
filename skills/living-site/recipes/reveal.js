// reveal.js: play each .rise once when about 30% of it is on screen. Groups (data-stagger) step 90 ms apart.
(() => {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    const t = e.target, kids = t.hasAttribute('data-stagger') ? [...t.querySelectorAll('.rise')] : [t];
    kids.forEach((k, i) => setTimeout(() => k.classList.add('in'), i * 90));
    io.unobserve(t);
  }), { threshold: .3 });
  document.querySelectorAll('[data-stagger], .rise:not([data-stagger] .rise)').forEach(el => io.observe(el));
})();
