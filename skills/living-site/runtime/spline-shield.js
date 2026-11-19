/* spline-shield.js: keeps the page scrollable over Spline embeds.
   Our own scenes (my.spline.design): a transparent shield passes the cursor in by postMessage,
   so the wheel always scrolls the page. Community previews: "click to play", wheel scrolls until then. */
(() => {
  const OURS = /my\.spline\.design/;
  const css = document.createElement('style');
  css.textContent = '.sp-shield{position:absolute;inset:0;z-index:1}.sp-pill{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);font:500 12px/1 Inter,system-ui,sans-serif;letter-spacing:.04em;color:#fff;background:rgba(0,0,0,.55);backdrop-filter:blur(10px);padding:9px 14px;border-radius:99px;transition:opacity .3s;pointer-events:none;white-space:nowrap}';
  document.head.appendChild(css);
  function wrap(f) {
    const host = f.parentElement;
    if (getComputedStyle(host).position === 'static') host.style.position = 'relative';
    const sh = document.createElement('div'); sh.className = 'sp-shield';
    f.after(sh);
    const src = f.getAttribute('src') || f.dataset.src || '';
    if (OURS.test(src)) {
      const send = (sp, e) => { const r = f.getBoundingClientRect(); if (f.contentWindow) f.contentWindow.postMessage({ sp, x: (e.clientX - r.left) / r.width, y: (e.clientY - r.top) / r.height }, '*'); };
      sh.addEventListener('pointermove', e => send('move', e));
      sh.addEventListener('pointerleave', e => send('leave', e));
      sh.addEventListener('pointerdown', e => send('down', e));
      sh.addEventListener('pointerup', e => send('up', e));
      sh.addEventListener('click', e => send('click', e));
    } else {
      sh.style.cursor = 'pointer';
      const pill = document.createElement('span'); pill.className = 'sp-pill'; pill.textContent = 'Click to play with it';
      sh.appendChild(pill);
      let playing = false;
      sh.addEventListener('click', () => { playing = true; sh.style.pointerEvents = 'none'; pill.style.opacity = 0; });
      document.addEventListener('mousemove', () => { if (playing) { playing = false; sh.style.pointerEvents = ''; pill.style.opacity = 1; } });
    }
  }
  document.querySelectorAll('iframe').forEach(wrap);
})();
