/* Meal-plan experience runtime. One IIFE, no globals. Order of concerns:
   data + helpers -> binders -> shader -> glass -> sections (video, numbers, week, clock, dishes, days+sheet, shop, swap, track) -> nav -> scroll motion -> PWA.
   Fail-open: every section renders without GSAP; motion is layered on only when GSAP loaded and motion is allowed. */
(() => {
'use strict';
const DATA = JSON.parse(document.getElementById('plan-data').textContent);
const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
const FINE = matchMedia('(hover:hover) and (pointer:fine)').matches;
const UA = navigator.userAgent, CHROMIUM = /Chrome\//.test(UA) && !/CriOS|FxiOS|EdgiOS|OPiOS/.test(UA);
const HAS_GSAP = !!window.gsap; if (HAS_GSAP && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
const root = document.documentElement; if (HAS_GSAP && !RM) root.classList.add('motion');
const fmt = n => Math.round(n).toLocaleString('en-US');
const get = (o, p) => p.split('.').reduce((a, k) => a && a[k], o);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const h = (tag, attrs, ...kids) => { const e = document.createElement(tag); for (const k in attrs || {}) { const v = attrs[k]; if (k === 'class') e.className = v; else if (k === 'html') e.innerHTML = v; else if (k.startsWith('on')) e.addEventListener(k.slice(2), v); else if (v !== false && v != null) e.setAttribute(k, v === true ? '' : v); } kids.flat().forEach(c => c != null && e.append(c.nodeType ? c : document.createTextNode(c))); return e; };
const store = { get: (k, d) => { try { return JSON.parse(localStorage.getItem('mps:' + DATA.client.slug + ':' + k)) ?? d; } catch (e) { return d; } }, set: (k, v) => { try { localStorage.setItem('mps:' + DATA.client.slug + ':' + k, JSON.stringify(v)); } catch (e) { } } };
const img = (k, s) => (DATA.inline && DATA.inline[k + '-' + s]) || `${DATA.base}img/${k}-${s}.webp`;
const T = DATA.tiers, col = t => T[t].color;
const START = Date.UTC(...DATA.client.start.split('-').map((v, i) => i === 1 ? v - 1 : +v));
const dateOf = d => new Date(START + (d - 1) * 864e5);
const dshort = d => dateOf(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
const dlong = d => dateOf(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', timeZone: 'UTC' });
const DOW = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const hexv = hx => { hx = hx.replace('#', ''); return [0, 2, 4].map(i => parseInt(hx.slice(i, i + 2), 16) / 255); };
const cssv = n => getComputedStyle(root).getPropertyValue(n).trim();

/* ---------- binders ---------- */
$$('[data-t]').forEach(e => { const v = get(DATA, e.dataset.t); if (v != null) e.textContent = v; });
{ const lines = DATA.copy.hero.h1; const hh = $('#h1'); lines.forEach((ln, i) => { const row = h('span', { class: 'row' }); ln.split(' ').forEach((w, j, a) => { row.append(h('span', { class: 'hw' + (i === lines.length - 1 ? ' em' : '') }, w), j < a.length - 1 ? ' ' : ''); }); hh.append(row); }); $$('.hw.em', hh).forEach(e => { e.innerHTML = '<em>' + esc(e.textContent) + '</em>'; }); }
$('#stats').append(...[[fmt(DATA.avg.kcal), 'kcal a day'], [DATA.avg.p + ' g', 'protein'], [DATA.avg.c + ' g', 'carbs, average'], [DATA.avg.f + ' g', 'fat']].map(([v, l]) => h('div', { class: 'stat glass' }, h('b', { class: 'num', 'data-count': parseFloat(v.replace(/,/g, '')), 'data-suffix': v.replace(/[\d,]/g, '') }, v), h('span', {}, l))));
const NAV = [['watch', 'Watch'], ['numbers', 'Numbers'], ['week', 'Week'], ['meals', 'Meals'], ['days', 'Days'], ['shop', 'Shop'], ['swap', 'Swap'], ['track', 'Track']];
$('#navlinks').append(...NAV.map(([id, l]) => h('li', {}, h('a', { class: 'l', href: '#' + id }, l))));
$('#navpanel').append(...NAV.map(([id, l]) => h('a', { href: '#' + id }, l)));
$('#footlinks').append(...NAV.map(([id, l]) => h('a', { href: '#' + id, class: 'mut' }, l)));
$('#marq').append(...[0, 1].map(() => h('span', {}, ...DATA.dishes.slice(0, 14).map(d => h('i', { style: 'font-style:normal' }, d.name)))));

/* ---------- shader background ---------- */
const GL = (() => {
  const cv = $('#gl'); let gl = null;
  try { gl = cv.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'low-power' }) || cv.getContext('experimental-webgl'); } catch (e) { }
  if (!gl) { root.classList.add('no-gl'); return null; }
  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `precision highp float;
uniform vec2 uR;uniform float uT;uniform float uS;uniform float uMix;uniform vec3 uBg;uniform vec3 uC1;uniform vec3 uC2;uniform vec3 uC3;uniform vec3 uRip[6];
float hash(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+vec2(1.,1.)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 m=mat2(1.6,1.2,-1.2,1.6);for(int i=0;i<4;i++){v+=a*noise(p);p=m*p;a*=.5;}return v;}
void main(){
  vec2 p=(gl_FragCoord.xy-.5*uR)/min(uR.x,uR.y);
  vec2 disp=vec2(0.);
  for(int i=0;i<6;i++){vec3 r=uRip[i];if(r.z>=0.){vec2 d=p-r.xy;float L=length(d)+1e-4;float w=sin(L*26.-r.z*6.5)*exp(-L*3.2)*exp(-r.z*1.15)*smoothstep(0.,.06,r.z);disp+=d/L*w*.045;}}
  p+=disp;
  float t=uT*.055;
  vec2 q=vec2(fbm(p*1.4+t),fbm(p*1.4+vec2(5.2,1.3)-t));
  vec2 r=vec2(fbm(p*1.8+3.*q+vec2(1.7,9.2)+t*1.3),fbm(p*1.8+3.*q+vec2(8.3,2.8)-t*1.1));
  float f=fbm(p*1.15+2.6*r+uS*.55);
  vec3 col=mix(uBg,uC1,smoothstep(.22,.78,f));
  col=mix(col,uC2,smoothstep(.45,1.,length(q))*.75*smoothstep(.3,.9,f));
  col=mix(col,uC3,smoothstep(.35,.95,r.x*r.y*2.2)*.6);
  float ridge=pow(1.-abs(2.*f-1.),7.);col+=uC2*ridge*.2;
  col.r+=.035*sin(f*13.+t*9.);col.b+=.035*cos(f*12.-t*8.);
  float vg=smoothstep(1.35,.15,length(p*vec2(.75,1.)));
  col=mix(uBg,col,uMix*(.55+.45*vg));
  col+=(hash(gl_FragCoord.xy+uT)-.5)*.03;
  gl_FragColor=vec4(col,1.);}`;
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return gl.getShaderParameter(o, gl.COMPILE_STATUS) ? o : (console.warn(gl.getShaderInfoLog(o)), null); };
  const vs = sh(gl.VERTEX_SHADER, VS), fs = sh(gl.FRAGMENT_SHADER, FS); if (!vs || !fs) { root.classList.add('no-gl'); return null; }
  const pr = gl.createProgram(); gl.attachShader(pr, vs); gl.attachShader(pr, fs); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { root.classList.add('no-gl'); return null; }
  gl.useProgram(pr); const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const U = n => gl.getUniformLocation(pr, n), u = { R: U('uR'), T: U('uT'), S: U('uS'), M: U('uMix'), Bg: U('uBg'), C1: U('uC1'), C2: U('uC2'), C3: U('uC3'), Rip: U('uRip') };
  const pal = () => { const bg = hexv(cssv('--bg0')), a1 = hexv(cssv('--a1')), a2 = hexv(cssv('--a2')), a3 = hexv(cssv('--a3')), a4 = hexv(cssv('--a4')); const k = (c, m) => c.map(v => v * m);
    return { hero: { bg, c1: a1, c2: a2, c3: a4, mix: 1 }, calm: { bg, c1: k(a1, .75), c2: k(a4, .8), c3: k(a2, .6), mix: .5 }, warm: { bg, c1: a2, c2: a1, c3: a3, mix: .72 }, cool: { bg, c1: a4, c2: a1, c3: a2, mix: .62 } }; };
  let still = false, P = pal(), cur = JSON.parse(JSON.stringify(P.hero)), tgt = P.hero, scale = innerWidth < 700 ? .42 : .55, w = 0, hgt = 0, scrollV = 0, last = 0, slow = 0, frames = 0;
  const rips = Array.from({ length: 6 }, () => ({ x: 0, y: 0, t0: -99 })), rbuf = new Float32Array(18);
  const size = () => { const dpr = Math.min(devicePixelRatio || 1, 2); w = Math.max(2, Math.round(innerWidth * dpr * scale)); hgt = Math.max(2, Math.round(innerHeight * dpr * scale)); cv.width = w; cv.height = hgt; gl.viewport(0, 0, w, hgt); };
  size(); let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (RM) draw(7); }, 150); });
  const lerp = (a, b, k) => a + (b - a) * k, mixv = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
  const draw = t => {
    for (let i = 0; i < 6; i++) { const r = rips[i], age = t - r.t0; rbuf[i * 3] = r.x; rbuf[i * 3 + 1] = r.y; rbuf[i * 3 + 2] = age < 4 ? age : -1; }
    gl.uniform2f(u.R, w, hgt); gl.uniform1f(u.T, t); gl.uniform1f(u.S, scrollV); gl.uniform1f(u.M, cur.mix); gl.uniform3fv(u.Bg, cur.bg); gl.uniform3fv(u.C1, cur.c1); gl.uniform3fv(u.C2, cur.c2); gl.uniform3fv(u.C3, cur.c3); gl.uniform3fv(u.Rip, rbuf); gl.drawArrays(gl.TRIANGLES, 0, 3); };
  let ri = 0, t0 = performance.now();
  const api = {
    tone(n) { tgt = P[n] || P.calm; if (RM || still) { cur = JSON.parse(JSON.stringify(tgt)); draw(7); } },
    ripple(cx, cy) { const m = Math.min(w, hgt), px = (cx / innerWidth) * w, py = (1 - cy / innerHeight) * hgt, r = rips[ri++ % 6]; r.x = (px - .5 * w) / m; r.y = (py - .5 * hgt) / m; r.t0 = (performance.now() - t0) / 1000; if (RM || still) draw(7 + .3); },
    scroll(v) { scrollV = v; },
    repal() { P = pal(); tgt = P.hero; }
  };
  const loop = now => {
    if (still) return; requestAnimationFrame(loop); if (document.hidden) return; const mobile = innerWidth < 700; if (mobile && now - last < 33) return;
    const dt = now - last; last = now; frames++; if (frames > 20 && dt > 34) { slow++; if (slow > 25) { if (scale > .26) { scale *= .82; size(); slow = 0; } else { still = true; cur = JSON.parse(JSON.stringify(tgt)); draw(7); } } } else if (dt < 22) slow = Math.max(0, slow - 1);
    cur = { bg: mixv(cur.bg, tgt.bg, .04), c1: mixv(cur.c1, tgt.c1, .04), c2: mixv(cur.c2, tgt.c2, .04), c3: mixv(cur.c3, tgt.c3, .04), mix: lerp(cur.mix, tgt.mix, .04) };
    draw((now - t0) / 1000); };
  if (RM) draw(7); else requestAnimationFrame(loop);
  cv.addEventListener('webglcontextlost', e => { e.preventDefault(); root.classList.add('no-gl'); });
  return api;
})();
if (GL) { let lt = 0; addEventListener('pointerdown', e => { if (e.target.closest('button,a,input,label,.sheet,.car')) return; GL.ripple(e.clientX, e.clientY); }, { passive: true });
  if (FINE) addEventListener('pointermove', e => { const n = performance.now(); if (n - lt > 160) { lt = n; GL.ripple(e.clientX, e.clientY); } }, { passive: true }); }
const tones = new Map(); const tIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { tones.set(e.target, e.target.dataset.tone); } else tones.delete(e.target); const last = [...tones.values()].pop(); if (GL && last) GL.tone(last); const hv = $('.veil'); hv.style.background = last === 'hero' ? 'linear-gradient(180deg,rgba(0,0,0,.12),rgba(0,0,0,.4))' : ''; }), { rootMargin: '-45% 0px -45% 0px' }); $$('[data-tone]').forEach(s => tIO.observe(s));

/* ---------- liquid glass ---------- */
const Glass = (() => {
  const defs = $('#svgdefs'); const NS = 'http://www.w3.org/2000/svg';
  const sdf = (x, y, w, hh, r) => { const px = Math.abs(x - w / 2) - (w / 2 - r), py = Math.abs(y - hh / 2) - (hh / 2 - r); return Math.hypot(Math.max(px, 0), Math.max(py, 0)) + Math.min(Math.max(px, py), 0) - r; };
  const map = (w, hh, r, bezel) => { const c = document.createElement('canvas'); c.width = w; c.height = hh; const g = c.getContext('2d'), id = g.createImageData(w, hh), d = id.data;
    for (let y = 0; y < hh; y++) for (let x = 0; x < w; x++) { const s = sdf(x + .5, y + .5, w, hh, r), depth = -s, i = (y * w + x) * 4; let dx = 0, dy = 0;
      if (depth < bezel && depth > -2) { const nx = (sdf(x + 1.5, y + .5, w, hh, r) - sdf(x - .5, y + .5, w, hh, r)) / 2, ny = (sdf(x + .5, y + 1.5, w, hh, r) - sdf(x + .5, y - .5, w, hh, r)) / 2, nl = Math.hypot(nx, ny) || 1, t = 1 - Math.max(depth, 0) / bezel, m = Math.pow(t, 2.4); dx = nx / nl * m; dy = ny / nl * m; }
      d[i] = 128 + 127 * dx; d[i + 1] = 128 + 127 * dy; d[i + 2] = 128; d[i + 3] = 255; }
    g.putImageData(id, 0, 0); return c.toDataURL('image/png'); };
  const filter = (id, el, bezel, scale) => { const w = Math.round(el.offsetWidth), hh = Math.round(el.offsetHeight); if (w < 20 || hh < 20) return false; const r = parseFloat(getComputedStyle(el).borderTopLeftRadius) || 24;
    let f = document.getElementById(id); if (f) f.remove(); f = document.createElementNS(NS, 'filter'); f.id = id; f.setAttribute('x', '0'); f.setAttribute('y', '0'); f.setAttribute('width', w); f.setAttribute('height', hh); f.setAttribute('filterUnits', 'userSpaceOnUse'); f.setAttribute('color-interpolation-filters', 'sRGB');
    f.innerHTML = `<feImage href="${map(w, hh, Math.min(r, w / 2, hh / 2), bezel)}" x="0" y="0" width="${w}" height="${hh}" preserveAspectRatio="none" result="m"/><feDisplacementMap in="SourceGraphic" in2="m" scale="${scale}" xChannelSelector="R" yChannelSelector="G"/>`; defs.append(f); el.style.setProperty('--refract', `blur(2.5px) url(#${id})`); el.classList.add('refract'); return true; };
  const pointer = () => { if (!FINE) return; addEventListener('pointermove', e => { const g = e.target.closest && e.target.closest('.glass'); if (!g) return; const r = g.getBoundingClientRect(); g.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%'); g.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%'); g.style.setProperty('--ang', Math.round(Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * 57.3 + 90) + 'deg'); }, { passive: true }); };
  pointer();
  return { refract(el, id, bezel = 30, scale = 34) { if (!CHROMIUM) return false; try { return filter(id, el, bezel, scale); } catch (e) { return false; } } };
})();

/* ---------- video ---------- */
(() => {
  const v = $('#vid'), box = $('#player'), btn = $('#playbtn'), bar = $('#vprog'), ch = DATA.copy.watch.chapters; let manual = false, cur = 0;
  const saver = navigator.connection && navigator.connection.saveData;
  const setSrc = id => { const inl = DATA.inline && DATA.inline[id + '-video']; if (inl) fetch(inl).then(r => r.blob()).then(b => { v.src = URL.createObjectURL(b); v.load(); }); else v.src = DATA.base + id + '.mp4'; };
  const load = i => { cur = i; const c = ch[i]; v.poster = (DATA.inline && DATA.inline[c.id + '-poster']) || DATA.base + c.id + '-poster.jpg'; setSrc(c.id); v.load(); $$('#chapters .chip').forEach((b, j) => b.setAttribute('aria-selected', j === i)); box.dataset.playing = 'false'; };
  $('#chapters').append(...ch.map((c, i) => h('button', { class: 'chip', role: 'tab', 'aria-selected': i === 0, onclick: () => { load(i); manual = true; v.play().catch(() => { }); } }, c.label, h('span', { class: 'mut', style: 'font-weight:500' }, c.dur))));
  load(0);
  const toggle = () => { manual = true; if (v.paused) v.play().catch(() => { }); else v.pause(); };
  btn.addEventListener('click', toggle); v.addEventListener('click', toggle);
  v.addEventListener('play', () => { box.dataset.playing = 'true'; btn.setAttribute('aria-label', 'Pause video'); }); v.addEventListener('pause', () => { box.dataset.playing = 'false'; btn.setAttribute('aria-label', 'Play video'); });
  v.addEventListener('timeupdate', () => { if (v.duration) bar.style.transform = `scaleX(${v.currentTime / v.duration})`; });
  if (!RM && !saver) new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && e.intersectionRatio > .55) { if (!manual && v.paused) v.play().catch(() => { }); } else if (!v.paused && !manual) v.pause(); else if (!e.isIntersecting && manual) v.pause(); }), { threshold: [0, .55] }).observe(box);
  addEventListener('keydown', e => { if (e.key === ' ' && document.activeElement === v) { e.preventDefault(); toggle(); } });
})();

/* ---------- numbers ---------- */
(() => {
  const a = DATA.avg, tot = a.p * 4 + a.c * 4 + a.f * 9, parts = [[a.p * 4 / tot, cssv('--a1'), 'Protein', a.p, a.p * 4], [a.c * 4 / tot, cssv('--a2'), 'Carbs', a.c, a.c * 4], [a.f * 9 / tot, cssv('--a4'), 'Fat', a.f, a.f * 9]];
  const C = 2 * Math.PI * 84, g = $('#arcs'), NS = 'http://www.w3.org/2000/svg'; let off = 0; const arcs = [];
  parts.forEach(([p, c]) => { const el = document.createElementNS(NS, 'circle'); el.setAttribute('cx', 100); el.setAttribute('cy', 100); el.setAttribute('r', 84); el.setAttribute('stroke', c); el.dataset.len = Math.max(0, p * C - 3); el.setAttribute('stroke-dasharray', `${el.dataset.len} ${C}`); el.setAttribute('stroke-dashoffset', -off); off += p * C; g.append(el); arcs.push(el); });
  $('#ringkcal').textContent = fmt(a.kcal); $('#ringkcal').dataset.count = a.kcal;
  const mx = Math.max(...parts.map(p => p[1] && p[3])); $('#macros').append(...parts.map(([p, c, n, gm, kc]) => h('div', { class: 'macro glass', 'data-r': '' }, h('div', {}, h('small', {}, n), h('b', { class: 'num' }, gm + ' g')), h('div', { class: 'track' }, h('i', { style: `--c:${c};--w:${Math.min(1, gm / (n === 'Fat' ? 100 : 170))}` })), h('span', { class: 'mut num' }, Math.round(p * 100) + '%'))));
  $('#facts').append(...DATA.copy.numbers.facts.map(([b, s]) => h('div', { 'data-r': '' }, h('b', {}, b), h('span', {}, s))));
  window.__arcs = arcs;
})();

/* ---------- week ---------- */
(() => {
  const wk = DATA.week, mx = Math.max(...wk.map(k => T[k].carbs)), cols = $('#cols');
  wk.forEach((k, i) => cols.append(h('div', { class: 'col', 'data-tier': k, style: `--c:${col(k)};--h:${Math.max(14, T[k].carbs / mx * 78)}%` }, h('b', { class: 'num' }, T[k].carbs + ' g'), h('i', {}), h('span', {}, DOW[i].toUpperCase()))));
  const st = $('#steps'); DATA.copy.week.steps.forEach((s, i) => st.append(h('article', { class: 'step glass', 'data-tier': s.tier, 'data-r': '' }, h('span', { class: 'dot', style: `--c:${col(s.tier)}` }), h('p', { class: 'eyebrow', style: 'display:inline;margin-left:.6rem' }, s.days), h('h3', {}, s.title), h('p', { class: 'mut' }, s.body))));
  const stage = $('#stage'), setOn = t => { if (t) { stage.dataset.on = t; $$('.col', stage).forEach(c => c.toggleAttribute('data-on', c.dataset.tier === t)); } else { delete stage.dataset.on; $$('.col', stage).forEach(c => c.removeAttribute('data-on')); } $$('.step').forEach(s => s.classList.toggle('on', s.dataset.tier === t)); };
  window.__weekOn = setOn;
})();

/* ---------- clock ---------- */
(() => {
  const C = DATA.clock, keys = Object.keys(C), NS = 'http://www.w3.org/2000/svg', svg = $('#clocksvg'), R = 96, L = 2 * Math.PI * R; let cur = keys[0], alt = false;
  const m2a = m => m / 1440 * L;
  svg.innerHTML = `<g transform="rotate(-90 120 120)"><circle cx="120" cy="120" r="${R}" fill="none" stroke="rgba(255,255,255,.12)" stroke-width="26"/><circle id="arc" cx="120" cy="120" r="${R}" fill="none" stroke-width="26" stroke-linecap="round" stroke-dasharray="0 ${L}" style="transition:stroke-dasharray .9s cubic-bezier(.2,.9,.2,1),stroke-dashoffset .9s cubic-bezier(.2,.9,.2,1),stroke .5s"/></g><g id="dots"></g>` + [[0, '12 AM'], [360, '6 AM'], [720, '12 PM'], [1080, '6 PM']].map(([m, t]) => { const a = m / 1440 * 2 * Math.PI - Math.PI / 2; return `<text x="${120 + 128 * Math.cos(a)}" y="${120 + 128 * Math.sin(a) + 4}" text-anchor="middle" font-size="9" font-weight="700" fill="${cssv('--soft')}" letter-spacing="1">${t}</text>`; }).join('');
  const seg = $('#seg'); seg.append(...keys.map(k => h('button', { class: 'chip', role: 'tab', 'data-k': k, 'aria-selected': k === cur, onclick: () => { cur = k; alt = false; render(); } }, h('span', { class: 'dot', style: `--c:${col(k)}` }), T[k].short)));
  const swb = $('#swb'); swb.addEventListener('click', () => { alt = !alt; render(); });
  const fm = m => { const hh = Math.floor(m / 60) % 24, mm = m % 60; return `${((hh + 11) % 12) + 1}${mm ? ':' + String(mm).padStart(2, '0') : ''} ${hh < 12 ? 'AM' : 'PM'}`; };
  function render() { const d = alt && C[cur].alt ? C[cur].alt : C[cur], arc = $('#arc'), len = m2a(d.end - d.start); arc.setAttribute('stroke', col(cur)); arc.setAttribute('stroke-dasharray', `${len} ${L}`); arc.setAttribute('stroke-dashoffset', -m2a(d.start));
    $('#dots').innerHTML = d.meals.map(m => { const a = m.min / 1440 * 2 * Math.PI - Math.PI / 2; return `<circle cx="${120 + R * Math.cos(a)}" cy="${120 + R * Math.sin(a)}" r="6.5" fill="#fff" stroke="${col(cur)}" stroke-width="3"/>`; }).join('');
    const eat = (d.end - d.start) / 60; $('#cmid').textContent = (Number.isInteger(eat) ? eat : eat.toFixed(1)) + ' h'; $('#cmid2').textContent = 'eating · ' + (24 - eat).toFixed(eat % 1 ? 1 : 0).replace('.0', '') + ' h fasting';
    $('#clocknote').textContent = (alt && C[cur].altNote) || DATA.copy.clock.notes[cur]; $('#clockmeals').replaceChildren(...d.meals.map(m => h('li', {}, h('span', {}, m.slot), h('b', { class: 'num' }, fm(m.min)))));
    $$('#seg .chip').forEach(b => b.setAttribute('aria-selected', b.dataset.k === cur)); const sw = $('#sw'); sw.hidden = !C[cur].alt; swb.setAttribute('aria-checked', alt); }
  render();
})();

/* ---------- dishes carousel ---------- */
const Dishes = (() => {
  const car = $('#car'), bg = $('#dishbg'); let list = DATA.dishes, cards = [], act = -1, cw = 0, vw = 0, tick = false, ids = 0;
  bg.append(h('div'), h('div')); let bgi = 0;
  const filt = $('#dfilters'); let ft = 'ALL';
  const fbtn = (k, label, c) => h('button', { class: 'chip', 'aria-pressed': k === ft, 'data-k': k, onclick: () => { ft = k; $$('#dfilters .chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k)); build(); } }, c ? h('span', { class: 'dot', style: `--c:${c}` }) : null, label);
  filt.append(fbtn('ALL', 'All dishes'), ...Object.keys(T).map(k => fbtn(k, T[k].short, col(k))));
  const mac = d => h('div', { class: 'mac' }, h('span', { style: `--c:${cssv('--a1')}` }, d.p + 'P'), h('span', { style: `--c:${cssv('--a2')}` }, d.c + 'C'), h('span', { style: `--c:${cssv('--a4')}` }, d.f + 'F'), h('span', { style: '--c:#fff' }, d.kcal + ' kcal'));
  function build() { list = DATA.dishes.filter(d => ft === 'ALL' || d.tiers.includes(ft)); car.replaceChildren(...list.map((d, i) => h('button', { class: 'dc glass', 'data-i': i, 'aria-label': d.name + ', ' + d.kcal + ' kilocalories. Open details', onclick: () => openDish(d.key), onfocus: () => center(i) },
      h('div', { class: 'ph' }, h('img', { src: img(d.key, 480), alt: d.alt || d.name, loading: i < 3 ? 'eager' : 'lazy', decoding: 'async', width: 480, height: 360 })),
      h('div', { class: 'tx' }, h('small', {}, h('span', { class: 'dot', style: `--c:${col(d.tiers[0])}` }), d.slotName + ' · ' + d.time), h('h3', {}, d.name), mac(d))))); cards = $$('.dc', car); measure(); car.scrollTo({ left: 0 }); act = -1; update(); }
  function measure() { vw = car.clientWidth; cw = cards[0] ? cards[0].offsetWidth : 300; cards.forEach(c => { c._c = c.offsetLeft + c.offsetWidth / 2; }); if (!Glass._tried && cards[0]) { Glass._tried = true; } cards.length && refr(); }
  let rto; function refr() { clearTimeout(rto); rto = setTimeout(() => { if (cards[0]) { const ok = Glass.refract(cards[0], 'rf-card', 34, 38); if (ok) cards.slice(1).forEach(c => { c.style.setProperty('--refract', cards[0].style.getPropertyValue('--refract')); c.classList.add('refract'); }); } }, 120); }
  function update() { tick = false; const mid = car.scrollLeft + vw / 2; let best = 0, bd = 1e9;
    cards.forEach((c, i) => { const o = (c._c - mid) / (cw * 1.05), a = Math.abs(o), cl = Math.max(-2.2, Math.min(2.2, o)); const rm = RM; c.style.transform = rm ? '' : `translate3d(0,${Math.min(a, 1.6) * 14}px,${-Math.min(a, 1.6) * 150}px) rotateY(${-cl * 30}deg) scale(${1 - Math.min(a, 1.5) * .09})`; c.style.opacity = rm ? '' : String(1 - Math.min(a, 1.7) * .3); c.style.setProperty('--mx', (50 - cl * 38).toFixed(0) + '%'); c.style.setProperty('--ang', (200 - cl * 70).toFixed(0) + 'deg'); if (a < bd) { bd = a; best = i; } });
    if (best !== act) { act = best; cards.forEach((c, i) => c.classList.toggle('is-active', i === act)); const d = list[act]; if (d) { const n = bg.children[bgi ^= 1], o = bg.children[bgi ^ 1]; n.style.backgroundImage = `url(${img(d.key, 160)})`; n.classList.add('on'); o.classList.remove('on'); $('#dpos').textContent = `${act + 1} of ${list.length}  ·  ${d.name}`; } } }
  car.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
  function center(i, smooth = true) { const c = cards[i]; if (c) car.scrollTo({ left: c._c - vw / 2, behavior: smooth && !RM ? 'smooth' : 'auto' }); }
  $('#dprev').onclick = () => center(Math.max(0, act - 1)); $('#dnext').onclick = () => center(Math.min(cards.length - 1, act + 1));
  car.addEventListener('keydown', e => { if (e.key === 'ArrowRight') { e.preventDefault(); center(Math.min(cards.length - 1, act + 1)); } if (e.key === 'ArrowLeft') { e.preventDefault(); center(Math.max(0, act - 1)); } });
  // mouse drag (touch uses native momentum scrolling)
  let down = null; car.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = { x: e.clientX, l: car.scrollLeft, moved: false }; });
  addEventListener('pointermove', e => { if (!down) return; const dx = e.clientX - down.x; if (Math.abs(dx) > 5 && !down.moved) { down.moved = true; car.classList.add('drag'); car.setPointerCapture && 0; } if (down.moved) car.scrollLeft = down.l - dx; });
  addEventListener('pointerup', () => { if (!down) return; const mv = down.moved; down = null; if (mv) { car.classList.remove('drag'); center(act); const stop = e => { e.stopPropagation(); e.preventDefault(); }; car.addEventListener('click', stop, { capture: true, once: true }); } });
  addEventListener('resize', () => { measure(); update(); });
  build(); document.fonts && document.fonts.ready.then(() => { measure(); update(); });
  return { measure };
})();

/* ---------- sheet (day + dish) ---------- */
const sheet = $('#sheet'), sin = $('#sheetin'); let curDay = 1;
const lock = on => { root.style.overflow = on ? 'hidden' : ''; };
sheet.addEventListener('close', () => lock(false)); sheet.addEventListener('click', e => { if (e.target === sheet) sheet.close(); });
const mealCard = m => h('article', { class: 'meal' }, h('img', { src: img(m.key, 480), alt: m.name, loading: 'lazy', width: 480, height: 360 }), h('div', { class: 'b' }, h('small', {}, m.slot + ' · ' + m.time), h('h4', {}, m.name), h('div', { class: 'mac' }, h('span', { style: `--c:${cssv('--a1')}` }, m.p + 'P'), h('span', { style: `--c:${cssv('--a2')}` }, m.c + 'C'), h('span', { style: `--c:${cssv('--a4')}` }, m.f + 'F'), h('span', { style: '--c:#fff' }, m.kcal + ' kcal')), h('ul', {}, ...m.lines.map(l => h('li', {}, l)), ...m.adds.map(l => h('li', { class: 'add' }, '+ ' + l)))));
const closeBtn = () => h('button', { class: 'close', 'aria-label': 'Close', onclick: () => sheet.close(), html: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>' });
function openDay(n) { curDay = Math.max(1, Math.min(DATA.days.length, n)); const d = DATA.days[curDay - 1], c = col(d.tier);
  sin.className = 'in glass'; sin.replaceChildren(h('header', {}, h('div', {}, h('p', { class: 'eyebrow', style: 'margin:0 0 .4rem' }, h('span', { class: 'dot', style: `--c:${c};margin-right:.5rem` }), T[d.tier].label + ' · ' + dateOf(curDay).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', timeZone: 'UTC' })), h('h3', { id: 'sheettitle' }, 'Day ' + curDay)), h('div', { class: 'nav2' }, h('button', { 'aria-label': 'Previous day', disabled: curDay === 1, onclick: () => openDay(curDay - 1) }, '‹'), h('button', { 'aria-label': 'Next day', disabled: curDay === DATA.days.length, onclick: () => openDay(curDay + 1) }, '›'), closeBtn())),
    h('div', { class: 'tot' }, h('span', {}, fmt(d.kcal) + ' kcal'), h('span', { style: `box-shadow:inset 0 0 0 1.5px ${cssv('--a1')}` }, d.p + ' g protein'), h('span', { style: `box-shadow:inset 0 0 0 1.5px ${cssv('--a2')}` }, d.c + ' g carbs' + (d.tier === 'KETO' ? ' (' + (d.c - d.fib) + ' net)' : '')), h('span', { style: `box-shadow:inset 0 0 0 1.5px ${cssv('--a4')}` }, d.f + ' g fat'), h('span', {}, d.fib + ' g fiber')),
    h('p', { class: 'mut', style: 'margin:0 0 1.2rem' }, T[d.tier].daynote), h('div', { class: 'mealgrid' }, ...d.meals.map(mealCard)));
  if (!sheet.open) { lock(true); sheet.showModal(); } sin.scrollTop = 0; }
function openDish(key) { const d = DATA.dishes.find(x => x.key === key), m = d.sample; sin.className = 'in glass dishfull';
  sin.replaceChildren(h('header', {}, h('div', {}, h('p', { class: 'eyebrow', style: 'margin:0 0 .4rem' }, d.slotName + ' · ' + d.tiers.map(t => T[t].short).join(' / ')), h('h3', { id: 'sheettitle' }, d.name)), closeBtn()),
    h('div', { class: 'big' }, h('img', { src: img(key, 960), alt: d.alt || d.name, style: 'width:100%;border-radius:22px;aspect-ratio:4/3;object-fit:cover' }), h('div', {}, h('div', { class: 'mac', style: 'margin-bottom:1rem' }, h('span', { style: `--c:${cssv('--a1')}` }, d.p + ' g protein'), h('span', { style: `--c:${cssv('--a2')}` }, d.c + ' g carbs'), h('span', { style: `--c:${cssv('--a4')}` }, d.f + ' g fat'), h('span', { style: '--c:#fff' }, d.kcal + ' kcal')), h('h4', { style: 'margin:.2rem 0 .5rem;font-family:var(--display);font-size:1.3rem' }, 'What goes in'), h('ul', { style: 'margin:0 0 1.2rem;padding-left:1.1rem;display:grid;gap:.35rem' }, ...m.lines.map(l => h('li', {}, l)), ...m.adds.map(l => h('li', { class: 'add', style: 'font-weight:800' }, '+ ' + l))), h('p', { class: 'eyebrow' }, 'On days'), h('div', { class: 'filters', style: 'margin:0' }, ...d.days.slice(0, 12).map(n => h('button', { class: 'chip', onclick: () => openDay(n) }, 'Day ' + n))))));
  lock(true); sheet.showModal(); sin.scrollTop = 0; }
let tx = 0; sheet.addEventListener('touchstart', e => { tx = e.changedTouches[0].clientX; }, { passive: true }); sheet.addEventListener('touchend', e => { if (!sin.querySelector('.mealgrid')) return; const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 70 && !e.target.closest('.car')) openDay(curDay + (dx < 0 ? 1 : -1)); }, { passive: true });
addEventListener('keydown', e => { if (!sheet.open || !sin.querySelector('.mealgrid')) return; if (e.key === 'ArrowRight') openDay(curDay + 1); if (e.key === 'ArrowLeft') openDay(curDay - 1); });

/* ---------- days grid ---------- */
(() => {
  const g = $('#grid'), gf = $('#gfilters'); $('#dowrow').append(...DOW.map(d => h('div', { class: 'dow' }, d.toUpperCase())));
  g.append(...DATA.days.map(d => h('button', { class: 'tile', style: `--c:${col(d.tier)}`, 'data-tier': d.tier, 'aria-label': `Day ${d.day}, ${dlong(d.day)}, ${T[d.tier].label}, ${d.kcal} kilocalories`, onclick: () => openDay(d.day) }, h('div', {}, h('span', { class: 'n' }, d.day), h('span', { class: 'k' }, dshort(d.day)), h('span', { class: 'k kc num' }, fmt(d.kcal) + ' kcal')), h('div', { class: 'th' }, ...d.meals.map(m => h('img', { src: img(m.key, 160), alt: '', loading: 'lazy', decoding: 'async', width: 160, height: 120 }))))));
  let f = 'ALL'; const set = k => { f = k; $$('#gfilters .chip').forEach(b => b.setAttribute('aria-pressed', b.dataset.k === k)); $$('.tile', g).forEach(t => t.classList.toggle('off', k !== 'ALL' && t.dataset.tier !== k)); };
  gf.append(h('button', { class: 'chip', 'data-k': 'ALL', 'aria-pressed': true, onclick: () => set('ALL') }, 'All days'), ...Object.keys(T).map(k => h('button', { class: 'chip', 'data-k': k, 'aria-pressed': false, onclick: () => set(k) }, h('span', { class: 'dot', style: `--c:${col(k)}` }), T[k].short + ' (' + DATA.days.filter(d => d.tier === k).length + ')')));
  $('#legend').append(...Object.keys(T).map(k => h('span', {}, h('i', { class: 'dot', style: `--c:${col(k)}` }), T[k].label + ': ' + T[k].range)));
})();

/* ---------- shopping ---------- */
(() => {
  const tabs = $('#wtabs'), lists = $('#shoplists'); let wk = 0; const state = store.get('shop', {});
  const key = (w, g, n) => `${w}|${g}|${n}`;
  tabs.append(...DATA.groc.map((w, i) => h('button', { class: 'chip', role: 'tab', 'aria-selected': i === 0, onclick: () => { wk = i; render(); $$('#wtabs .chip').forEach((b, j) => b.setAttribute('aria-selected', j === i)); } }, 'Week ' + w.week, h('span', { class: 'mut', style: 'font-weight:500' }, w.range))));
  function progress() { const w = DATA.groc[wk]; let tot = 0, done = 0; Object.entries(w.groups).forEach(([g, it]) => it.forEach(([n]) => { tot++; if (state[key(w.week, g, n)]) done++; })); $('#shopbar').style.transform = `scaleX(${tot ? done / tot : 0})`; $('#shopcount').textContent = `${done} of ${tot} in the basket`; }
  function render() { const w = DATA.groc[wk]; lists.replaceChildren(...Object.entries(w.groups).filter(([, it]) => it.length).map(([g, it]) => h('div', { class: 'lst glass' }, h('h3', {}, g), ...it.map(([n, q]) => { const id = 'sh' + Math.random().toString(36).slice(2, 8); const inp = h('input', { type: 'checkbox', id, checked: !!state[key(w.week, g, n)], onchange: e => { state[key(w.week, g, n)] = e.target.checked; store.set('shop', state); progress(); } }); return h('label', { for: id }, inp, h('span', {}, n), h('b', { class: 'q num' }, q)); })))); progress(); }
  render();
  $('#copylist').onclick = async () => { const w = DATA.groc[wk]; const t = `Week ${w.week} shopping\n` + Object.entries(w.groups).map(([g, it]) => g + '\n' + it.filter(([n]) => !state[key(w.week, g, n)]).map(([n, q]) => `- ${n}: ${q}`).join('\n')).join('\n\n'); try { await navigator.clipboard.writeText(t); $('#copylist').textContent = 'Copied'; } catch (e) { $('#copylist').textContent = 'Copy not allowed here'; } setTimeout(() => $('#copylist').textContent = 'Copy what is left', 1800); };
  if (navigator.share) { const b = $('#sharelist'); b.hidden = false; b.onclick = () => { const w = DATA.groc[wk]; navigator.share({ title: `Week ${w.week} shopping`, text: Object.entries(w.groups).map(([g, it]) => g + '\n' + it.filter(([n]) => !state[key(w.week, g, n)]).map(([n, q]) => `- ${n}: ${q}`).join('\n')).join('\n\n') }).catch(() => { }); }; }
})();

/* ---------- swap guide ---------- */
(() => {
  const cats = [['protein', 'Proteins'], ['carb', 'Carbs'], ['veg', 'Vegetables'], ['fat', 'Fats']], tabs = $('#stabs'), grid = $('#fgrid'), box = $('#swapbox'), q = $('#fsearch'); let cat = 'protein', sel = null;
  tabs.append(...cats.map(([k, l]) => h('button', { class: 'chip', role: 'tab', 'data-k': k, 'aria-selected': k === cat, onclick: () => { cat = k; sel = null; box.classList.remove('on'); $$('#stabs .chip').forEach(b => b.setAttribute('aria-selected', b.dataset.k === k)); render(); } }, l + ' (' + DATA.foods.filter(f => f.cat === k).length + ')')));
  const dist = (a, b) => Math.abs(a.kcal - b.kcal) / Math.max(a.kcal, 50) + Math.abs(a.p - b.p) / Math.max(a.p, 5) + .6 * Math.abs(a.c - b.c) / Math.max(a.c, 5) + .6 * Math.abs(a.f - b.f) / Math.max(a.f, 5);
  const sg = (v, d = 1) => (v > 0 ? '+' : v < 0 ? '−' : '±') + Math.abs(v).toFixed(d).replace(/\.0$/, '');
  function show(f) { sel = f; $$('#fgrid .food').forEach(b => b.setAttribute('aria-pressed', b.dataset.n === f.n)); const alts = DATA.foods.filter(x => x.cat === f.cat && x.n !== f.n).map(x => [dist(f, x), x]).sort((a, b) => a[0] - b[0]).slice(0, 3).map(a => a[1]);
    box.replaceChildren(h('h3', {}, 'Closest swaps for ' + f.n + ' (' + f.amt + ' ' + f.u + ')'), h('div', { class: 'row' }, ...alts.map(a => h('div', { class: 'opt' }, h('b', {}, a.n), h('span', { class: 'mut' }, a.amt + ' ' + a.u), h('div', { class: 'mac', style: 'margin-top:.5rem' }, h('span', { style: '--c:#fff' }, sg(a.kcal - f.kcal, 0) + ' kcal'), h('span', { style: `--c:${cssv('--a1')}` }, sg(a.p - f.p) + 'P'), h('span', { style: `--c:${cssv('--a2')}` }, sg(a.c - f.c) + 'C'), h('span', { style: `--c:${cssv('--a4')}` }, sg(a.f - f.f) + 'F'))))), h('p', { class: 'mini', style: 'margin:.9rem 0 0' }, 'Swap one for one within the same group. Differences are against the food you picked.')); box.classList.add('on'); }
  function render() { const s = q.value.trim().toLowerCase(); grid.replaceChildren(...DATA.foods.filter(f => f.cat === cat && (!s || f.n.toLowerCase().includes(s))).map(f => h('button', { class: 'food', 'data-n': f.n, 'aria-pressed': sel && sel.n === f.n, onclick: () => show(f) }, h('b', {}, f.n), h('small', {}, f.amt + ' ' + f.u), h('span', { class: 'k num' }, f.kcal + ' kcal'), h('div', { class: 'mac' }, h('span', { style: `--c:${cssv('--a1')}` }, f.p + 'P'), h('span', { style: `--c:${cssv('--a2')}` }, f.c + 'C'), h('span', { style: `--c:${cssv('--a4')}` }, f.f + 'F'))))); }
  q.addEventListener('input', render); render();
})();

/* ---------- rules ---------- */
{ const r = DATA.copy.rules, mk = (t, items, c, cls) => h('div', { class: 'rule glass ' + (cls || ''), 'data-r': '' }, h('span', { class: 'dot', style: `--c:${c}` }), h('h3', {}, t), h('ul', {}, ...items.map(i => h('li', {}, i))));
  $('#rulesgrid').append(mk('Eat', r.eat, cssv('--a1')), mk('Limit', r.limit, cssv('--a2')), mk('Not used', r.avoid, cssv('--a3'), 'no')); }

/* ---------- tracker ---------- */
(() => {
  const g = DATA.goal, ent = store.get('weights', []), NS = 'http://www.w3.org/2000/svg', svg = $('#chart');
  const iso = d => d.toISOString().slice(0, 10), day = s => Date.parse(s + 'T00:00:00Z') / 864e5;
  $('#wdate').value = iso(new Date()); const s0 = day(DATA.client.start), end = s0 + g.weeks * 7;
  const planAt = d => g.from + (g.to - g.from) * Math.min(1, Math.max(0, (d - s0) / (end - s0)));
  function render() { ent.sort((a, b) => a.d.localeCompare(b.d)); const pts = [{ d: DATA.client.start, w: g.from, start: true }, ...ent.filter(e => e.d !== DATA.client.start)];
    const X0 = s0 - 2, X1 = end + 8, ys = pts.map(p => p.w).concat([g.to, g.from]), Y0 = Math.min(...ys) - 2, Y1 = Math.max(...ys) + 2, W = 640, H = 400, P = { l: 46, r: 16, t: 16, b: 34 };
    const x = d => P.l + (d - X0) / (X1 - X0) * (W - P.l - P.r), y = w => P.t + (Y1 - w) / (Y1 - Y0) * (H - P.t - P.b), ink = cssv('--soft');
    let s = ''; for (let w = Math.ceil(Y0 / 5) * 5; w <= Y1; w += 5) s += `<line x1="${P.l}" x2="${W - P.r}" y1="${y(w)}" y2="${y(w)}" stroke="rgba(255,255,255,.1)"/><text x="${P.l - 8}" y="${y(w) + 4}" text-anchor="end" font-size="11" fill="${ink}">${w}</text>`;
    s += `<line x1="${x(s0)}" y1="${y(g.from)}" x2="${x(end)}" y2="${y(g.to)}" stroke="${cssv('--a2')}" stroke-width="2" stroke-dasharray="6 6"/><line x1="${P.l}" x2="${W - P.r}" y1="${y(g.to)}" y2="${y(g.to)}" stroke="${cssv('--a1')}" stroke-width="1.5" stroke-dasharray="2 5"/><text x="${W - P.r}" y="${y(g.to) - 8}" text-anchor="end" font-size="11" font-weight="700" fill="${cssv('--a1')}">Goal ${g.to}</text>`;
    const xs = [0, 4, 8, 12, 16].filter(w => s0 + w * 7 <= X1); xs.forEach(w => { s += `<text x="${x(s0 + w * 7)}" y="${H - 10}" text-anchor="middle" font-size="11" fill="${ink}">Wk ${w}</text>`; });
    const line = pts.map((p, i) => `${i ? 'L' : 'M'}${x(day(p.d))},${y(p.w)}`).join(' '); s += `<path d="${line}" fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>` + pts.map(p => `<circle cx="${x(day(p.d))}" cy="${y(p.w)}" r="${p.start ? 6 : 5}" fill="${p.start ? cssv('--a2') : '#fff'}" stroke="${cssv('--bg0')}" stroke-width="2"/>`).join('');
    svg.innerHTML = s; const last = pts[pts.length - 1], lost = g.from - last.w, wks = Math.max((day(last.d) - s0) / 7, 0);
    let rate = null; const rec = pts.filter(p => day(p.d) >= day(last.d) - 14); if (rec.length >= 3) { const n = rec.length, mx = rec.reduce((a, p) => a + day(p.d), 0) / n, my = rec.reduce((a, p) => a + p.w, 0) / n, sl = rec.reduce((a, p) => a + (day(p.d) - mx) * (p.w - my), 0) / rec.reduce((a, p) => a + (day(p.d) - mx) ** 2, 0); rate = -sl * 7; } else if (pts.length > 1 && wks > 0) rate = lost / wks;
    $('#readout').replaceChildren(...[[last.w.toFixed(1), 'Now (lb)'], [(lost >= 0 ? '−' : '+') + Math.abs(lost).toFixed(1), 'Change (lb)'], [rate == null ? '–' : (rate >= 0 ? '−' : '+') + Math.abs(rate).toFixed(1), 'Per week (lb)']].map(([b, l]) => h('div', {}, h('b', { class: 'num' }, b), h('span', {}, l))));
    const pa = planAt(day(last.d)); $('#trkmsg').textContent = pts.length < 2 ? `Start ${g.from} lb. Plan: ${g.to} lb by ${new Date((end) * 864e5).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}. Weigh in once a week, same morning.` : (last.w <= pa + 1 ? 'On or ahead of the plan line.' : `About ${(last.w - pa).toFixed(1)} lb behind the plan line. One week is noise; look at the 2-week trend.`) + (rate > 0.2 && last.w > g.to ? ` At this pace you reach ${g.to} lb around ${new Date((day(last.d) + (last.w - g.to) / rate * 7) * 864e5).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })}.` : ''); }
  $('#wform').addEventListener('submit', e => { e.preventDefault(); const w = parseFloat($('#wval').value), d = $('#wdate').value; if (!(w > 60 && w < 500) || !d) return; const i = ent.findIndex(x => x.d === d); if (i >= 0) ent[i].w = w; else ent.push({ d, w }); store.set('weights', ent); $('#wval').value = ''; render(); });
  $('#trkcsv').onclick = () => { const csv = 'date,weight_lb\n' + ent.map(e => e.d + ',' + e.w).join('\n'); const a = h('a', { href: URL.createObjectURL(new Blob([csv], { type: 'text/csv' })), download: DATA.client.slug + '-weights.csv' }); document.body.append(a); a.click(); a.remove(); };
  $('#trkclr').onclick = () => { if (confirm('Clear all logged weights on this device?')) { ent.length = 0; store.set('weights', ent); render(); } };
  render();
})();

/* ---------- nav, progress, a11y tabs ---------- */
(() => {
  const nav = $('#nav'), pan = $('#navpanel'), mb = $('#menubtn'), bar = $('.progress'); let t = false;
  mb.onclick = () => { const o = pan.dataset.open !== 'true'; pan.dataset.open = o; mb.setAttribute('aria-expanded', o); mb.setAttribute('aria-label', o ? 'Close menu' : 'Open menu'); }; pan.addEventListener('click', e => { if (e.target.closest('a')) { pan.dataset.open = 'false'; mb.setAttribute('aria-expanded', 'false'); } });
  addEventListener('keydown', e => { if (e.key === 'Escape' && pan.dataset.open === 'true') { pan.dataset.open = 'false'; mb.setAttribute('aria-expanded', 'false'); mb.focus(); } });
  const onS = () => { t = false; const y = scrollY, m = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${m > 0 ? y / m : 0})`; if (GL) GL.scroll(y / innerHeight); };
  addEventListener('scroll', () => { if (!t) { t = true; requestAnimationFrame(onS); } }, { passive: true }); onS();
  const links = $$('#navlinks a'); new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id)); }), { rootMargin: '-45% 0px -50% 0px' }).observe && NAV.forEach(([id]) => { const s = document.getElementById(id); s && new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) links.forEach(a => a.setAttribute('aria-current', a.getAttribute('href') === '#' + id)); }), { rootMargin: '-45% 0px -50% 0px' }).observe(s); });
  $$('[role=tablist]').forEach(tl => tl.addEventListener('keydown', e => { if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return; const tabs = $$('[role=tab]', tl), i = tabs.indexOf(document.activeElement); if (i < 0) return; const n = tabs[(i + (e.key === 'ArrowRight' ? 1 : tabs.length - 1)) % tabs.length]; n.focus(); n.click(); }));
  let dp; addEventListener('beforeinstallprompt', e => { e.preventDefault(); dp = e; const b = $('#installbtn'); b.hidden = false; b.onclick = () => dp.prompt(); });
})();

/* ---------- scroll motion (GSAP) ---------- */
if (HAS_GSAP && window.ScrollTrigger && !RM) {
  const ST = ScrollTrigger, mm = gsap.matchMedia();
  gsap.from('.hero .hw', { yPercent: 115, duration: 1.15, stagger: .09, ease: 'expo.out', delay: .15 });
  gsap.from('.hero .eyebrow,.hero .tag,.hero .ctas', { y: 28, opacity: 0, duration: .9, stagger: .12, ease: 'power3.out', delay: .55 });
  gsap.from('.hero .stat', { y: 36, opacity: 0, scale: .96, duration: .9, stagger: .1, ease: 'power3.out', delay: .95 });
  ST.batch('[data-r]', { start: 'top 90%', once: true, onEnter: b => gsap.to(b, { opacity: 1, y: 0, duration: .95, stagger: .08, ease: 'power3.out', overwrite: true }) });
  $$('[data-count]').forEach(e => { const to = +e.dataset.count, suf = e.dataset.suffix || ''; if (!isFinite(to)) return; const o = { v: 0 }; ST.create({ trigger: e, start: 'top 92%', once: true, onEnter: () => gsap.to(o, { v: to, duration: 1.6, ease: 'power2.out', onUpdate: () => { e.textContent = (e.id === 'ringkcal' ? fmt(o.v) : fmt(o.v) + (suf ? ' ' + suf.trim() : '')); } }) }); });
  const C = 2 * Math.PI * 84; (window.__arcs || []).forEach((el, i) => { const len = +el.dataset.len; gsap.fromTo(el, { attr: { 'stroke-dasharray': `0 ${C}` } }, { attr: { 'stroke-dasharray': `${len} ${C}` }, ease: 'none', scrollTrigger: { trigger: '.ringbox', start: 'top 85%', end: 'center 45%', scrub: .6 } }); });
  gsap.utils.toArray('.col i').forEach((el, i) => gsap.from(el, { scaleY: 0, transformOrigin: '50% 100%', duration: 1.1, ease: 'expo.out', delay: i * .06, scrollTrigger: { trigger: '#cols', start: 'top 85%', once: true } }));
  const m = $('#marq'); const mq = gsap.to(m, { xPercent: -50, repeat: -1, ease: 'none', duration: 55 }); ST.create({ trigger: '.marq', onUpdate: s => { const v = Math.min(Math.abs(s.getVelocity()) / 350, 5); gsap.to(mq, { timeScale: 1 + v * (s.direction), duration: .3, overwrite: true }); gsap.to(mq, { timeScale: 1, delay: .4, duration: 1.2 }); } });
  const hd = $('.hero .display'); let sp = 0; ST.create({ start: 0, end: 'max', onUpdate: s => { sp = Math.min(Math.abs(s.getVelocity()) / 260, 16); } }); gsap.ticker.add(() => { sp *= .9; if (sp > .05 || hd.style.getPropertyValue('--split')) hd.style.setProperty('--split', sp.toFixed(2) + 'px'); });
  gsap.to('.hero .wrap', { yPercent: -8, opacity: .15, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  mm.add('(min-width: 900px) and (min-height: 720px)', () => { const stage = $('.week'); ST.create({ trigger: '.week .wrap', start: 'top 70px', end: '+=1400', pin: true, pinSpacing: true, scrub: true, onToggle: s => stage.classList.toggle('pinned', s.isActive), onUpdate: s => { const p = s.progress, n = DATA.copy.week.steps.length, i = Math.min(n - 1, Math.floor(p * n * 0.999)); window.__weekOn(DATA.copy.week.steps[i].tier); } }); window.__weekOn(DATA.copy.week.steps[0].tier); return () => window.__weekOn(null); });
  mm.add('(max-width: 899px), (max-height: 719px)', () => { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) window.__weekOn(e.target.dataset.tier); }), { rootMargin: '-40% 0px -40% 0px' }); $$('.step').forEach(s => io.observe(s)); return () => io.disconnect(); });
  addEventListener('load', () => ST.refresh()); document.fonts && document.fonts.ready.then(() => ST.refresh());
} else if (!RM) { const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) window.__weekOn && window.__weekOn(e.target.dataset.tier); }), { rootMargin: '-40% 0px -40% 0px' }); $$('.step').forEach(s => io.observe(s)); }

/* ---------- PWA ---------- */
if ('serviceWorker' in navigator && /^https?:/.test(location.protocol) && DATA.pwa) navigator.serviceWorker.register('sw.js').catch(() => { });
})();
