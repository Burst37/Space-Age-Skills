/* Motion switch — Off / On / X-ray. Shared by every motion site.
   API: window.Motion.mode  ('on'|'off'|'xray')
        window.Motion.on(fn) -> fn(mode) on every change (and once now)
        window.Motion.set(mode)
   Mark anything that moves:  data-xray="Seedance 2.5 · 5 clips × 5 s"
                              data-xray-tool="higgsfield|code|lottie|eleven"
                              data-xray-prompt="…"  data-xray-cost="300"
   URL: ?motion=off|on|xray (for filming). Key: M cycles. */
(function () {
  const HF = "data:image/png;base64,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";
  const MODES = ['off', 'on', 'xray'];
  const LABEL = { off: 'Off', on: 'On', xray: 'X-ray' };
  const subs = [];
  let mode = 'on';
  try { const q = new URLSearchParams(location.search).get('motion'); if (MODES.includes(q)) mode = q; } catch (e) {}

  const css = `
  .ms-pill{position:fixed;right:18px;bottom:18px;z-index:2147483000;display:flex;align-items:center;gap:4px;padding:5px;border-radius:999px;
    background:var(--ms-bg,rgba(12,14,18,.72));color:var(--ms-fg,#f4f2ee);backdrop-filter:blur(14px) saturate(1.4);-webkit-backdrop-filter:blur(14px) saturate(1.4);
    box-shadow:0 10px 40px rgba(0,0,0,.28),inset 0 0 0 1px rgba(255,255,255,.10);font:600 12px/1 var(--ms-font,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif);letter-spacing:.02em;user-select:none}
  .ms-pill .ms-k{padding:0 8px 0 10px;opacity:.62;font-weight:500;display:flex;align-items:center;gap:7px}
  .ms-pill .ms-k i{width:7px;height:7px;border-radius:50%;background:var(--ms-accent,#bff549);box-shadow:0 0 10px var(--ms-accent,#bff549);transition:opacity .3s}
  html[data-motion=off] .ms-pill .ms-k i{opacity:.2;box-shadow:none}
  .ms-pill button{all:unset;cursor:pointer;position:relative;padding:8px 13px;border-radius:999px;color:inherit;opacity:.7;transition:opacity .2s,background .25s,color .25s}
  .ms-pill button:hover{opacity:1}
  .ms-pill button[aria-pressed=true]{opacity:1;background:var(--ms-accent,#bff549);color:var(--ms-on,#0d0d0d)}
  .ms-pill button:focus-visible{outline:2px solid var(--ms-accent,#bff549);outline-offset:2px}
  html[data-motion=off] *,html[data-motion=off] *::before,html[data-motion=off] *::after{animation-play-state:paused!important;transition-duration:0s!important}
  html[data-motion=off] .ms-pill,html[data-motion=off] .ms-pill *{transition-duration:.2s!important}
  .ms-layer{position:fixed;inset:0;pointer-events:none;z-index:2147482990}
  .ms-box{position:absolute;border:1.5px dashed var(--c);border-radius:10px;box-shadow:0 0 0 9999px transparent,inset 0 0 40px color-mix(in srgb,var(--c) 14%,transparent)}
  .ms-chip{position:absolute;pointer-events:auto;cursor:pointer;display:flex;align-items:center;gap:7px;max-width:min(440px,80vw);padding:6px 10px 6px 6px;border-radius:9px;
    background:#0b0c0f;color:#f4f2ee;font:600 11.5px/1.25 var(--ms-font,ui-sans-serif,system-ui,-apple-system,sans-serif);box-shadow:0 6px 24px rgba(0,0,0,.35),inset 0 0 0 1px var(--c);white-space:nowrap}
  .ms-chip img,.ms-chip .ms-ic{width:20px;height:20px;border-radius:5px;flex:none;display:grid;place-items:center;font:700 10px/1 ui-monospace,Menlo,monospace;background:var(--c);color:#0b0c0f}
  .ms-chip .ms-t{overflow:hidden;text-overflow:ellipsis}
  .ms-chip .ms-cost{opacity:.6;font-weight:500}
  .ms-chip.open{white-space:normal;flex-wrap:wrap}
  .ms-chip .ms-p{display:none;width:100%;margin-top:6px;padding-top:7px;border-top:1px solid rgba(255,255,255,.12);font:500 11.5px/1.45 var(--ms-mono,ui-monospace,Menlo,monospace);color:#cfd3d8;white-space:normal}
  .ms-chip.open .ms-p{display:block}
  .ms-sum{position:fixed;left:18px;bottom:18px;z-index:2147483000;padding:12px 14px;border-radius:14px;background:#0b0c0f;color:#f4f2ee;font:600 12px/1.5 ui-sans-serif,system-ui,sans-serif;box-shadow:0 10px 40px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.12);display:none;min-width:220px;font-family:var(--ms-font,ui-sans-serif,system-ui,sans-serif)}
  html[data-motion=xray] .ms-sum{display:block}
  .ms-sum b{font-weight:700}.ms-sum .ms-row{display:flex;align-items:center;gap:8px}
  .ms-sum img{width:18px;height:18px;border-radius:4px}
  .ms-sum .ms-dim{opacity:.6;font-weight:500}
  @media (max-width:640px){.ms-pill{right:10px;bottom:10px}.ms-pill .ms-k{display:none}.ms-sum{left:10px;bottom:62px}}
  @media print{.ms-pill,.ms-layer,.ms-sum{display:none}}`;

  const TOOL = {
    higgsfield: { c: '#c5f74f', name: 'Higgsfield', ic: `<img alt="" src="${HF}">` },
    eleven: { c: '#c5f74f', name: 'Higgsfield · Eleven v4', ic: `<img alt="" src="${HF}">` },
    code: { c: '#7cc4ff', name: 'Code', ic: '<span class="ms-ic">&lt;/&gt;</span>' },
    lottie: { c: '#ffb36b', name: 'Lottie', ic: '<span class="ms-ic">L</span>' }
  };

  let pill, layer, sum, raf = 0, nodes = [];

  function build() {
    const st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    pill = document.createElement('div'); pill.className = 'ms-pill'; pill.setAttribute('role', 'group'); pill.setAttribute('aria-label', 'Motion');
    pill.innerHTML = `<span class="ms-k"><i></i>Motion</span>` + MODES.map(m => `<button type="button" data-m="${m}">${LABEL[m]}</button>`).join('');
    pill.addEventListener('click', e => { const b = e.target.closest('button'); if (b) set(b.dataset.m); });
    layer = document.createElement('div'); layer.className = 'ms-layer'; layer.setAttribute('aria-hidden', 'true');
    sum = document.createElement('div'); sum.className = 'ms-sum';
    document.body.append(layer, sum, pill);
    layer.addEventListener('click', e => { const c = e.target.closest('.ms-chip'); if (c) c.classList.toggle('open'); });
    addEventListener('keydown', e => {
      if (e.key !== 'm' && e.key !== 'M') return;
      if (/input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable) return;
      set(MODES[(MODES.indexOf(mode) + 1) % 3]);
    });
    apply();
  }

  function summary() {
    const all = [...document.querySelectorAll('[data-xray]')];
    const hf = all.filter(n => /higgsfield|eleven/.test(n.dataset.xrayTool || ''));
    const credits = hf.reduce((a, n) => a + (+n.dataset.xrayCost || 0), 0);
    const code = all.filter(n => (n.dataset.xrayTool || 'code') === 'code').length;
    sum.innerHTML = `<div class="ms-row"><img alt="" src="${HF}"><span><b>${hf.length}</b> Higgsfield assets <span class="ms-dim">· ${credits} credits</span></span></div>
      <div class="ms-row" style="margin-top:6px"><span class="ms-ic" style="width:18px;height:18px;border-radius:4px;display:grid;place-items:center;background:#7cc4ff;color:#0b0c0f;font:700 9px/1 ui-monospace,Menlo,monospace">&lt;/&gt;</span><span><b>${code}</b> code loops <span class="ms-dim">· 0 credits</span></span></div>`;
  }

  function draw() {
    raf = 0;
    if (!layer) return;
    if (mode !== 'xray') { layer.innerHTML = ''; return; }
    const vh = innerHeight, vw = innerWidth;
    nodes = [...document.querySelectorAll('[data-xray]')];
    let html = '';
    const taken = [];
    for (const n of nodes) {
      const r = n.getBoundingClientRect();
      if (r.bottom < 0 || r.top > vh || r.width < 8 || r.height < 8 || getComputedStyle(n).visibility === 'hidden') continue;
      const t = TOOL[n.dataset.xrayTool || 'code'] || TOOL.code;
      const x = Math.max(6, r.left), y = Math.max(6, r.top), w = Math.min(vw - 6, r.right) - x, h = Math.min(vh - 6, r.bottom) - y;
      let cy = y + 8; while (taken.some(v => Math.abs(v[0] - (x + 8)) < 160 && Math.abs(v[1] - cy) < 34)) cy += 34;
      taken.push([x + 8, cy]);
      const cost = n.dataset.xrayCost ? `<span class="ms-cost">· ${n.dataset.xrayCost} cr</span>` : '';
      const p = n.dataset.xrayPrompt ? `<span class="ms-p">${esc(n.dataset.xrayPrompt)}</span>` : '';
      html += `<div class="ms-box" style="--c:${t.c};left:${x}px;top:${y}px;width:${w}px;height:${h}px"></div>
        <div class="ms-chip" style="--c:${t.c};left:${x + 8}px;top:${cy}px">${t.ic}<span class="ms-t">${t.name} · ${esc(n.dataset.xray)}</span>${cost}${p}</div>`;
    }
    layer.innerHTML = html;
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function queue() { if (!raf && mode === 'xray') raf = requestAnimationFrame(draw); }

  function apply() {
    document.documentElement.dataset.motion = mode;
    if (pill) pill.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.m === mode)));
    if (layer) { summary(); draw(); }
    subs.forEach(f => { try { f(mode); } catch (e) { console.error(e); } });
  }
  function set(m) { if (!MODES.includes(m) || m === mode) return; mode = m; apply(); }

  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  setInterval(() => { if (mode === 'xray') queue(); }, 500);

  window.Motion = {
    get mode() { return mode; },
    get moving() { return mode !== 'off'; },
    set,
    on(f) { subs.push(f); try { f(mode); } catch (e) { console.error(e); } }
  };
  document.documentElement.dataset.motion = mode;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build); else build();
})();
