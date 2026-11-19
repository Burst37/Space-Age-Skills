// word-light.js: a full-screen statement whose words light up one by one as you scroll.
// Markup: <section id="say" style="height:250vh"><div style="position:sticky;top:0;height:100vh;display:grid;place-items:center">
//           <p data-wordlight>We build <span class="hi">places you walk into,</span> not pages.</p></div></section>
// CSS:    [data-wordlight] .w{color:rgba(255,255,255,.18);transition:color .9s cubic-bezier(.32,.72,0,1)}
//         [data-wordlight] .w.on{color:#fff}  [data-wordlight] .w.hi.on{color:var(--accent)}
(() => {
  document.querySelectorAll('[data-wordlight]').forEach(p => {
    const words = [];
    (function walk(node, hi) {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const f = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(t => {
            if (!t.trim()) return f.appendChild(document.createTextNode(t));
            const s = document.createElement('span'); s.className = 'w' + (hi ? ' hi' : ''); s.textContent = t; f.appendChild(s); words.push(s);
          });
          n.replaceWith(f);
        } else walk(n, hi || n.classList.contains('hi'));
      });
    })(p, false);
    const host = p.closest('section'), still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    let queued = false;
    const tick = () => {
      queued = false;
      const r = host.getBoundingClientRect(), span = Math.max(1, r.height - innerHeight);
      const k = Math.min(1, Math.max(0, (-r.top + innerHeight * .35) / (span * .8)));
      const n = still ? words.length : Math.floor(k * (words.length + 1));
      words.forEach((w, i) => w.classList.toggle('on', i < n));
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(tick); } }, { passive: true });
    tick();
  });
})();
