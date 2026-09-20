/* ---------- P1.5 THE BOARD ------------------------------------------------
   A board that flicks its characters into place is a scoreboard move, not an
   airport one — it reads as a drop list going live. It does real work too:
   the index, the sort control and the jump-to for all nineteen pieces. Rows
   are generated from the product cards themselves, so the catalogue is never
   written down twice.                                                      */
(function () {
  var G = window.gsap, ST = window.ScrollTrigger;
  var RM = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  var sec = document.getElementById('board');
  var host = document.getElementById('b-rows');
  if (!sec || !host) return;

  var GLYPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$·';

  var items = Array.prototype.slice.call(document.querySelectorAll('#drop .d-cell'))
    .map(function (c, i) {
      var sizes = c.querySelectorAll('[data-size],.d-size,.d-sz');
      return {
        i: i,
        id: c.getAttribute('data-id') || ('p' + i),
        name: (c.getAttribute('data-name') || '').toUpperCase(),
        price: parseFloat(c.getAttribute('data-price')) || 0,
        img: c.querySelector('.d-media img') ? c.querySelector('.d-media img').getAttribute('src') : '',
        fab: (function () {
          var t = c.querySelector('.d-thesis');
          return t ? t.textContent.trim() : 'ALL-OVER PRINT';
        })(),
        siz: sizes.length ? 'S–3XL' : 'S–3XL',
        el: c
      };
    });
  if (!items.length) return;

  /* status is merchandising, not decoration — and it speaks like a drop,
     not like a terminal. */
  items.forEach(function (it, i) {
    it.stat = i % 7 === 3 ? 'LOW STOCK' : (i % 3 === 0 ? 'SIGNATURE' : 'IN STOCK');
    it.skey = it.stat === 'LOW STOCK' ? 'final' : (it.stat === 'SIGNATURE' ? 'boarding' : 'ontime');
  });

  function flap(text) {
    var w = document.createElement('span');
    w.className = 'b-flap';
    text.split('').forEach(function (ch) {
      var s = document.createElement('span');
      s.textContent = ch;
      s.dataset.fin = ch;
      w.appendChild(s);
    });
    return w;
  }

  function paint(list) {
    host.textContent = '';
    list.forEach(function (it) {
      var r = document.createElement('div');
      r.className = 'b-row';
      r.setAttribute('role', 'row');
      r.tabIndex = 0;
      r.dataset.id = it.id;
      r.dataset.img = it.img;

      var gate = document.createElement('span'); gate.className = 'b-gate';
      gate.appendChild(flap(String(it.i + 1).padStart(2, '0')));

      var name = document.createElement('span'); name.className = 'b-name';
      name.appendChild(flap(it.name));

      var fab = document.createElement('span'); fab.className = 'b-fab'; fab.textContent = it.fab;
      var siz = document.createElement('span'); siz.className = 'b-siz'; siz.textContent = it.siz;

      var fare = document.createElement('span'); fare.className = 'b-fare';
      fare.appendChild(flap('$' + it.price));

      var st = document.createElement('span'); st.className = 'b-stat';
      var dot = document.createElement('i'); st.appendChild(dot);
      st.appendChild(flap('VIEW'));

      [gate, name, fab, siz, fare, st].forEach(function (n) { r.appendChild(n); });
      host.appendChild(r);
    });
    wire();
    if (!RM && G) reveal();
  }

  /* the flap itself: glyphs tumble through the alphabet, then settle */
  function reveal() {
    var rows = host.querySelectorAll('.b-row');
    rows.forEach(function (r, ri) {
      var cells = r.querySelectorAll('.b-flap span');
      G.set(cells, { opacity: 0 });
      ST.create({
        trigger: r, start: 'top 94%', once: true,
        onEnter: function () {
          cells.forEach(function (s, si) {
            var fin = s.dataset.fin, spins = 3 + (si % 4), n = 0;
            var d = ri * 0.012 + si * 0.014;
            G.set(s, { opacity: 1, rotateX: -92, transformPerspective: 320 });
            G.to(s, { rotateX: 0, duration: .44, delay: d, ease: 'back.out(2.2)' });
            if (fin.trim()) {
              var iv = setInterval(function () {
                s.textContent = GLYPH[(Math.random() * GLYPH.length) | 0];
                if (++n >= spins) { clearInterval(iv); s.textContent = fin; }
              }, 44);
              setTimeout(function () { clearInterval(iv); s.textContent = fin; }, (d + .5) * 1000 + 220);
            }
          });
        }
      });
    });
  }

  function wire() {
    var peek = document.getElementById('b-peek');
    var pimg = document.getElementById('b-peek-img');
    var qx = (!RM && G && peek) ? G.quickTo(peek, 'x', { duration: .5, ease: 'power3' }) : null;
    var qy = (!RM && G && peek) ? G.quickTo(peek, 'y', { duration: .5, ease: 'power3' }) : null;

    host.querySelectorAll('.b-row').forEach(function (r) {
      function go() {
        var t = document.querySelector('#drop .d-cell[data-id="' + r.dataset.id + '"]');
        if (!t) return;
        if (G && window.ScrollToPlugin) G.to(window, { duration: 1.1, ease: 'expo.inOut',
          scrollTo: { y: t, offsetY: 140 } });
        else t.scrollIntoView({ behavior: 'smooth', block: 'center' });
        t.classList.add('is-flagged');
        setTimeout(function () { t.classList.remove('is-flagged'); }, 2400);
      }
      r.addEventListener('click', go);
      r.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); go(); }
      });
      if (peek && pimg && qx) {
        r.addEventListener('pointerenter', function () {
          if (!r.dataset.img) return;
          pimg.src = r.dataset.img;
          G.to(peek, { opacity: 1, duration: .3 });
        });
        r.addEventListener('pointermove', function (e) { qx(e.clientX + 26); qy(e.clientY - 104); });
        r.addEventListener('pointerleave', function () { G.to(peek, { opacity: 0, duration: .25 }); });
      }
    });
  }

  /* sort — nineteen SKUs with no way to order them was a real shopping problem */
  sec.querySelectorAll('.b-s').forEach(function (b) {
    b.addEventListener('click', function () {
      sec.querySelectorAll('.b-s').forEach(function (o) { o.classList.toggle('is-on', o === b); });
      var k = b.dataset.sort, list = items.slice();
      if (k === 'price') list.sort(function (a, c) { return a.price - c.price; });
      else if (k === 'name') list.sort(function (a, c) { return a.name.localeCompare(c.name); });
      else list.sort(function (a, c) { return a.i - c.i; });
      paint(list);
      if (ST) ST.refresh();
    });
  });

  paint(items);
})();
