// living-pipeline.js: the Level 3 workhorse. A living diagram in the Claude motion language:
// cards with soft depth, wires that draw themselves, a packet that rides each wire, a node that pulses
// when the packet lands, a tick that draws itself, then the next round. It never stops breathing.
//
//   <div class="lp-island" id="flow"></div>
//   <script src="living-pipeline.js"></script>
//   livingPipeline(document.getElementById('flow'), {
//     theme: 'light',                       // 'light' = white dot-grid island (the loved look) | 'dark'
//     accent: '#2B7EF9',                    // ONE accent
//     nodes: [                              // x, y in a 1000 x 560 box; img = a REAL logo or the Claude spark PNG
//       { id: 'voice', x: 120, y: 280, label: 'You talk', img: 'img/logos/mic.svg' },
//       { id: 'claude', x: 500, y: 280, label: 'Claude', img: 'img/spark-clay.png', big: true },
//       { id: 'site', x: 880, y: 280, label: 'Live', img: 'img/logos/browser.svg' }
//     ],
//     route: ['voice', 'claude', 'site'],   // the order a packet travels each round
//     rounds: [                             // what the round is about; shown under the last node (max 4 words)
//       'Fix the login bug', 'Draft the launch notes'
//     ],
//     onArrive: (node, round, api) => {}    // optional: add your own beat when a packet lands (a mini preview, a typed line)
//   });
//
// Rules it keeps for you: starts empty and builds in at 30% visible; loops forever after; pauses off screen;
// reduced motion or the Motion Off switch shows the finished still; nothing scales from 0; one accent.
(function () {
  const NS = 'http://www.w3.org/2000/svg';
  const css = `
  .lp-island{position:relative;border-radius:24px;overflow:hidden;aspect-ratio:1000/560}
  .lp-island.light{background:#fff radial-gradient(circle,rgb(226,226,232) 1.4px,transparent 1.6px) 19px 19px/38px 38px;box-shadow:0 40px 100px -50px rgba(20,33,61,.35),0 0 0 1px rgba(20,33,61,.08)}
  .lp-island.dark{background:#11131a radial-gradient(circle,rgba(255,255,255,.06) 1.4px,transparent 1.6px) 19px 19px/38px 38px;box-shadow:0 0 0 1px rgba(255,255,255,.08)}
  .lp-island svg{position:absolute;inset:0;width:100%;height:100%}
  .lp-node{opacity:0;transform-box:fill-box;transform-origin:center;transition:opacity .75s cubic-bezier(.33,1,.68,1),transform 1.05s cubic-bezier(.16,1,.3,1),filter .75s;filter:blur(5px)}
  .lp-node.in{opacity:1;filter:none}`;
  if (!document.getElementById('lp-css')) { const s = document.createElement('style'); s.id = 'lp-css'; s.textContent = css; document.head.appendChild(s); }

  window.livingPipeline = function (host, cfg) {
    const light = (cfg.theme || 'light') === 'light', A = cfg.accent || '#2B7EF9';
    const INK = light ? '#14213D' : '#EDEDF3', CARD = light ? '#FFFFFF' : '#1B1E27', EDGE = light ? 'rgba(20,33,61,.12)' : 'rgba(255,255,255,.1)';
    host.classList.add('lp-island', light ? 'light' : 'dark');
    const svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '0 0 1000 560'); host.appendChild(svg);
    const el = (tag, at, parent = svg) => { const n = document.createElementNS(NS, tag); for (const k in at) n.setAttribute(k, at[k]); parent.appendChild(n); return n; };
    const defs = el('defs', {});
    const f = el('filter', { id: 'lp-shadow', x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs);
    el('feDropShadow', { dx: 0, dy: 10, stdDeviation: 14, 'flood-color': light ? '#14213D' : '#000', 'flood-opacity': light ? .12 : .5 }, f);
    const byId = Object.fromEntries(cfg.nodes.map(n => [n.id, n]));
    // wires first, so cards sit on top
    const wires = [];
    for (let i = 0; i < cfg.route.length - 1; i++) {
      const a = byId[cfg.route[i]], b = byId[cfg.route[i + 1]], mx = (a.x + b.x) / 2;
      const d = `M${a.x} ${a.y}C${mx} ${a.y} ${mx} ${b.y} ${b.x} ${b.y}`;
      el('path', { d, fill: 'none', stroke: EDGE, 'stroke-width': 2 });
      const live = el('path', { d, fill: 'none', stroke: A, 'stroke-width': 2.5, 'stroke-linecap': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 });
      wires.push(live);
    }
    const packet = el('circle', { r: 7, fill: A, opacity: 0 });
    const trail = el('circle', { r: 14, fill: A, opacity: 0 });
    // cards
    const cards = cfg.nodes.map((n, i) => {
      const w = n.big ? 200 : 168, h = n.big ? 184 : 156;
      const pos = el('g', { transform: `translate(${n.x} ${n.y})` });
      const g = el('g', { class: 'lp-node' }, pos);
      g.style.transitionDelay = (i * .09) + 's'; g.style.transform = 'translateY(16px) scale(.9)';
      const ring = el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 22, fill: 'none', stroke: A, 'stroke-width': 2, opacity: 0 }, g);
      el('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 22, fill: CARD, stroke: EDGE, filter: 'url(#lp-shadow)' }, g);
      if (n.img) el('image', { href: n.img, x: -32, y: -h / 2 + 30, width: 64, height: 64, preserveAspectRatio: 'xMidYMid meet' }, g);
      const lab = el('text', { x: 0, y: h / 2 - 22, 'text-anchor': 'middle', 'font-family': 'inherit', 'font-weight': 600, 'font-size': 21, fill: INK, 'letter-spacing': '-.4' }, g); lab.textContent = n.label;
      const tickBg = el('circle', { cx: w / 2 - 6, cy: -h / 2 + 6, r: 12, fill: A, opacity: 0 }, g);
      const tick = el('path', { d: `M${w / 2 - 12} ${-h / 2 + 6}l4 4 7.5-8`, fill: 'none', stroke: '#fff', 'stroke-width': 2.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1 }, g);
      return { n, g, ring, tickBg, tick, w, h };
    });
    const caption = el('text', { x: 500, y: 500, 'text-anchor': 'middle', 'font-family': 'inherit', 'font-weight': 600, 'font-size': 26, fill: INK, opacity: 0 });
    const api = { svg, el, accent: A, ink: INK };

    const io = (x) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2, out = (x) => 1 - Math.pow(1 - x, 3);
    const HOP = 1.3, LAND = .9, legs = wires.length, ROUND = .8 + legs * (HOP + LAND) + 1.6;
    let round = 0, lastRound = -1;
    function frame(t) {
      const r = Math.floor(t / ROUND), lt = t % ROUND;
      if (r !== lastRound) { lastRound = r; round = r; caption.textContent = cfg.rounds ? cfg.rounds[r % cfg.rounds.length] : ''; }
      let px = null, py = null;
      cards.forEach(c => { c.ring.setAttribute('opacity', 0); });
      for (let i = 0; i < legs; i++) {
        const s = .8 + i * (HOP + LAND), k = Math.max(0, Math.min(1, (lt - s) / HOP));
        wires[i].setAttribute('stroke-dashoffset', 1 - io(k));
        if (k > 0 && k < 1) { const p = wires[i].getPointAtLength(wires[i].getTotalLength() * io(k)); px = p.x; py = p.y; }
        const land = lt - (s + HOP), c = cards[cfg.nodes.indexOf(byId[cfg.route[i + 1]])];
        if (land >= 0 && land < .7) { const q = land / .7; c.ring.setAttribute('opacity', (1 - q) * .8); c.ring.setAttribute('transform', `scale(${1 + q * .18})`); c.g.style.transform = `scale(${1 + Math.sin(q * Math.PI) * .05})`; }
        else if (land >= .7 || land < 0) c.g.style.transform = 'none';
        const tk = Math.max(0, Math.min(1, (land - .25) / .5));
        c.tickBg.setAttribute('opacity', out(tk)); c.tick.setAttribute('stroke-dashoffset', 1 - out(Math.max(0, tk * 1.3 - .3)));
        if (land >= 0 && land < 0.02 && cfg.onArrive) cfg.onArrive(c.n, round, api);
      }
      const first = cards[cfg.nodes.indexOf(byId[cfg.route[0]])];
      first.ring.setAttribute('opacity', lt < .8 ? (Math.sin(lt / .8 * Math.PI)) * .7 : 0);
      packet.setAttribute('opacity', px == null ? 0 : 1); trail.setAttribute('opacity', px == null ? 0 : .18);
      if (px != null) { packet.setAttribute('cx', px); packet.setAttribute('cy', py); trail.setAttribute('cx', px); trail.setAttribute('cy', py); }
      caption.setAttribute('opacity', lt < .4 ? lt / .4 : lt > ROUND - .5 ? (ROUND - lt) / .5 : 1);
      // the round fades its wires and ticks back to empty in the last beat
      if (lt > ROUND - .6) { const q = (lt - (ROUND - .6)) / .6; wires.forEach(w => w.setAttribute('stroke-opacity', 1 - q)); cards.forEach(c => { c.tickBg.setAttribute('opacity', 1 - q); }); }
      else wires.forEach(w => w.setAttribute('stroke-opacity', 1));
    }
    const still = () => matchMedia('(prefers-reduced-motion: reduce)').matches || (window.Motion && window.Motion.mode === 'off');
    let run = false, acc = 0, last = 0, built = false;
    function loop(now) { if (!run) return; acc += Math.min(.05, (now - last) / 1000); last = now; frame(acc); requestAnimationFrame(loop); }
    new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting && !built) { built = true; cards.forEach(c => { c.g.classList.add('in'); c.g.style.transform = 'none'; }); }
      if (still()) { cards.forEach(c => c.g.classList.add('in')); frame(ROUND - .7); return; }
      if (e.isIntersecting && !run) { run = true; last = performance.now(); setTimeout(() => requestAnimationFrame(loop), built ? 0 : 900); }
      else if (!e.isIntersecting) run = false;
    }), { threshold: .3 }).observe(host);
    return api;
  };
})();
