/* ---------- P0 MOTION LAYER ----------------------------------------------
   Everything here is global: it decorates sections the other parts own
   rather than owning any of them, so a section can be rewritten without
   touching this file. All of it no-ops under prefers-reduced-motion.      */
(function () {
  var G = window.gsap, ST = window.ScrollTrigger;
  var RM = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var body = document.body;

  /* --- 1. load curtain ---------------------------------------------------
     The hero is a scrubbed frame sequence; showing it half-decoded looks
     broken, so hold the page until the first frame is actually painted. */
  (function boot() {
    var cur = document.getElementById('m-curtain');
    var n   = document.getElementById('m-curtain-n');
    if (!cur) { body.dataset.boot = 'done'; return; }
    if (RM || !G) { cur.remove(); body.dataset.boot = 'done'; return; }

    var pct = 0, done = false;
    var tick = setInterval(function () {
      pct = Math.min(96, pct + Math.random() * 11);
      if (n) n.textContent = Math.round(pct);
    }, 90);

    function release() {
      if (done) return; done = true;
      clearInterval(tick);
      if (n) n.textContent = '100';
      G.to(cur, {
        clipPath: 'inset(0 0 100% 0)', duration: 1.05, ease: 'expo.inOut', delay: .18,
        onStart: function () { body.dataset.boot = 'done'; },
        onComplete: function () { cur.remove(); if (ST) ST.refresh(); }
      });
      G.from('.h-fg, .h-strip', { y: 26, opacity: 0, duration: 1.1, stagger: .09,
                                  ease: 'expo.out', delay: .5 });
    }

    var first = document.querySelector('.h-shot img');
    if (first && !first.complete) first.addEventListener('load', release, { once: true });
    window.addEventListener('load', release, { once: true });
    setTimeout(release, 2600);            // never trap the page behind a slow asset
  })();

  if (RM || !G || !ST) return;

  /* --- 2. section handoffs ----------------------------------------------
     Sections used to butt straight into each other. Each one now gets a
     veil that darkens it as it leaves and a seam that draws itself across
     the next one arriving. Both are injected INSIDE the section so they
     ride the existing pins and stickies instead of fighting them. */
  var secs = Array.prototype.slice.call(document.querySelectorAll('main > section, body > section'));
  secs.forEach(function (sec, i) {
    if (getComputedStyle(sec).position === 'static') sec.style.position = 'relative';

    if (i > 0) {
      var seam = document.createElement('i'); seam.className = 'm-seam';
      var tick = document.createElement('i'); tick.className = 'm-seam-t';
      sec.appendChild(seam); sec.appendChild(tick);
      ST.create({
        trigger: sec, start: 'top 92%', end: 'top 46%', scrub: true,
        onUpdate: function (self) {
          seam.style.transform = 'scaleX(' + self.progress.toFixed(3) + ')';
          tick.style.opacity   = String(Math.max(0, (self.progress - .55) / .45));
        }
      });
    }

    if (i < secs.length - 1) {
      var veil = document.createElement('i'); veil.className = 'm-veil';
      sec.appendChild(veil);
      ST.create({
        trigger: sec, start: 'bottom 55%', end: 'bottom top', scrub: true,
        onUpdate: function (self) { veil.style.opacity = (self.progress * .55).toFixed(3); }
      });
    }
  });

  /* --- 3. progress rail ---------------------------------------------------
     Where you are in the drop, and what you are looking at. Reads as a
     tracker, not as a cockpit gauge. */
  (function rail() {
    var fill = document.getElementById('m-alt-fill');
    var num  = document.getElementById('m-alt-n');
    var lab  = document.getElementById('m-alt-lab');
    if (!fill) return;
    var names = secs.map(function (s) {
      return (s.getAttribute('data-alt') || s.id || '').replace(/[-_]/g, ' ') || 'the drop';
    });
    ST.create({
      start: 0, end: 'max', scrub: true,
      onUpdate: function (self) {
        var p = self.progress;
        fill.style.height = (p * 100).toFixed(2) + '%';
        if (num) num.textContent = Math.round(p * 100);
        if (lab) {
          var idx = Math.min(secs.length - 1, Math.floor(p * secs.length));
          if (lab.textContent !== names[idx]) lab.textContent = names[idx];
        }
      }
    });
  })();

  /* --- 4. parallax + velocity skew --------------------------------------- */
  document.querySelectorAll('[data-par]').forEach(function (el) {
    var d = parseFloat(el.getAttribute('data-par')) || 12;
    G.fromTo(el, { yPercent: -d }, {
      yPercent: d, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  (function skew() {
    var targets = document.querySelectorAll('.m-skew');
    if (!targets.length) return;
    var set = G.quickSetter(targets, 'skewY', 'deg'), cur = 0;
    ST.create({
      start: 0, end: 'max',
      onUpdate: function (self) {
        var v = G.utils.clamp(-4, 4, self.getVelocity() / -420);
        if (Math.abs(v) > Math.abs(cur)) cur = v;
      }
    });
    G.ticker.add(function () { cur = G.utils.interpolate(cur, 0, .12); set(cur); });
  })();

  /* --- 5. grain drift ----------------------------------------------------- */
  (function grain() {
    var g = document.querySelector('.m-grain');
    if (!g) return;
    G.to(g, { x: 26, y: -18, duration: .5, repeat: -1, yoyo: true, ease: 'none',
              repeatRefresh: true, modifiers: {
                x: function () { return (Math.random() * 40 - 20) + 'px'; },
                y: function () { return (Math.random() * 40 - 20) + 'px'; }
              } });
  })();

  /* --- 6. cursor + magnetic controls -------------------------------------
     The ring reads what it is over, so the whole page answers the pointer
     rather than only the elements with a :hover rule. */
  (function cursor() {
    var cur = document.getElementById('m-cur');
    if (!cur || window.matchMedia('(pointer:coarse)').matches) return;
    var x = G.quickTo(cur, 'x', { duration: .4, ease: 'power3' });
    var y = G.quickTo(cur, 'y', { duration: .4, ease: 'power3' });

    window.addEventListener('pointermove', function (e) {
      body.dataset.cur = body.dataset.cur || 'on';
      x(e.clientX); y(e.clientY);
      var t = e.target.closest('button,a,[role="button"],input,select,summary,.s-sw,.d-cell');
      body.dataset.cur = t ? (t.matches('.s-sw,.d-cell') ? 'drag' : 'hot') : 'on';
    }, { passive: true });
    window.addEventListener('pointerleave', function () { body.dataset.cur = ''; });

    /* magnets: the button leans toward the pointer before it is reached */
    document.querySelectorAll('.h-cta,.d-add,.x-btn,.g-add,button[type="submit"]').forEach(function (b) {
      var qx = G.quickTo(b, 'x', { duration: .5, ease: 'power3' });
      var qy = G.quickTo(b, 'y', { duration: .5, ease: 'power3' });
      b.addEventListener('pointermove', function (e) {
        var r = b.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * .28);
        qy((e.clientY - (r.top + r.height / 2)) * .38);
      });
      b.addEventListener('pointerleave', function () { qx(0); qy(0); });
    });
  })();

  /* --- 7. numerals roll up when they arrive ------------------------------ */
  document.querySelectorAll('[data-count]').forEach(function (el) {
    var to = parseFloat(el.getAttribute('data-count')) || 0;
    var o  = { v: 0 };
    ST.create({
      trigger: el, start: 'top 86%', once: true,
      onEnter: function () {
        G.to(o, { v: to, duration: 1.4, ease: 'expo.out',
                  onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString(); } });
      }
    });
  });
})();

/* --- 8. display type extrudes as it arrives -------------------------------
   The megas were flat cream slabs. Driving --ext off scroll gives the face
   real depth and makes each heading an event instead of a label. */
(function extrude() {
  var G = window.gsap, ST = window.ScrollTrigger;
  if (!G || !ST || window.matchMedia('(prefers-reduced-motion:reduce)').matches) {
    document.querySelectorAll('.mega').forEach(function (h) { h.style.setProperty('--ext', '9px'); });
    return;
  }
  document.querySelectorAll('.mega').forEach(function (h) {
    ST.create({
      trigger: h, start: 'top 92%', end: 'top 34%', scrub: true,
      onUpdate: function (self) {
        h.style.setProperty('--ext', (self.progress * 12).toFixed(2) + 'px');
      }
    });
  });
})();
