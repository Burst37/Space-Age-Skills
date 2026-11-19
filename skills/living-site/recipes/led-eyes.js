// led-eyes.js: a dark section becomes a wall of LED dots; two lit eyes follow the cursor and blink.
// Use for a robot, an assistant, any product with a face. <section id="x"><canvas data-led-eyes></canvas>...</section>
// The canvas fills its section (position:absolute;inset:0). Pauses off screen.
(() => {
  document.querySelectorAll('canvas[data-led-eyes]').forEach(cv => {
    const cx = cv.getContext('2d'), sec = cv.parentElement;
    let W = 0, H = 0, gx = 0, gy = 0, tx = 0, ty = 0, run = false, t = 0, last = 0;
    const size = () => { const d = Math.min(2, devicePixelRatio || 1); W = sec.clientWidth; H = sec.clientHeight; cv.width = W * d; cv.height = H * d; cx.setTransform(d, 0, 0, d, 0, 0); };
    size(); addEventListener('resize', size);
    sec.addEventListener('pointermove', e => { const r = sec.getBoundingClientRect(); tx = ((e.clientX - r.left) / r.width - .5) * 2; ty = ((e.clientY - r.top) / r.height - .4) * 2; });
    sec.addEventListener('pointerleave', () => { tx = ty = 0; });
    function draw(now) {
      if (!run) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now; t += dt;
      const k = 1 - Math.exp(-dt * 6); gx += (tx - gx) * k; gy += (ty - gy) * k;
      cx.clearRect(0, 0, W, H);
      const P = Math.max(9, Math.min(14, W / 110)), ex = W / 2, ey = H * .36, sep = Math.min(W * .16, 230), ew = Math.min(W * .11, 150), eh = ew * 1.25;
      const open = (t % 4.4) > 4.25 ? .12 : 1, ox = gx * ew * .22, oy = gy * eh * .14;
      for (let y = P / 2; y < H; y += P) for (let x = P / 2; x < W; x += P) {
        let lit = 0;
        for (const s of [-1, 1]) {
          const dx = (x - (ex + s * sep / 2 + ox)) / (ew / 2), dy = (y - (ey + oy)) / (eh / 2 * open);
          const d = Math.abs(dx) ** 3 + Math.abs(dy) ** 3;
          lit = Math.max(lit, d < 1 ? 1 : d < 1.5 ? (1.5 - d) * .5 : 0);
        }
        cx.fillStyle = `rgba(255,255,255,${lit ? .35 + lit * .65 : .07})`;
        cx.beginPath(); cx.arc(x, y, lit ? P * .3 : P * .16, 0, 6.283); cx.fill();
      }
      requestAnimationFrame(draw);
    }
    new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !run) { run = true; last = performance.now(); requestAnimationFrame(draw); } else if (!e.isIntersecting) run = false; }), { threshold: .1 }).observe(sec);
  });
})();
