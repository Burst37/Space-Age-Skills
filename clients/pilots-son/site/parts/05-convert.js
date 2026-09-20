/* ==========================================================
   P5 — CONVERT : global scroll engine, cart, pdp, capture
   runs last. IIFE. scoped to #cv-* / .x-*
   ========================================================== */
(function () {
  'use strict';

  var D = document;
  var q = function (s, r) { return (r || D).querySelector(s); };
  var qa = function (s, r) { return Array.prototype.slice.call((r || D).querySelectorAll(s)); };
  var RM = false;
  try { RM = window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  var G = window.gsap || null;
  var ST = window.ScrollTrigger || null;

  try { if (G && ST) G.registerPlugin(ST); } catch (e) {}
  try { if (G && window.ScrollToPlugin) G.registerPlugin(window.ScrollToPlugin); } catch (e) {}
  try { if (G && window.SplitText) G.registerPlugin(window.SplitText); } catch (e) {}

  /* ========================================================
     1. GLOBAL SCROLL ENGINE  (owned by P5, used by P1–P4)
     ======================================================== */
  var lenis = null;

  (function scrollEngine() {
    if (RM) { window.__lenis = null; return; }            // no smooth scroll under reduce
    if (window.__lenis) { lenis = window.__lenis; return; } // never two instances
    if (!window.Lenis) return;
    try {
      lenis = new window.Lenis({
        lerp: 0.085,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.6,
        gestureOrientation: 'vertical',
        autoResize: true
      });
      window.__lenis = lenis;

      /* Lenis drives the real window scroll position, so ScrollTrigger needs
         no scrollerProxy — it only needs to be told to update on every
         Lenis scroll, and to be ticked from the same clock as GSAP. */
      if (ST) lenis.on('scroll', ST.update);

      if (G) {
        G.ticker.add(function (t) { lenis.raf(t * 1000); });
        G.ticker.lagSmoothing(0);
      } else {
        var raf = function (t) { lenis.raf(t); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
      }
    } catch (e) { lenis = null; window.__lenis = null; }
  })();

  function refreshST() { try { if (ST) ST.refresh(); } catch (e) {} }

  window.addEventListener('load', function () {
    refreshST();
    setTimeout(refreshST, 300);
  });
  try {
    if (D.fonts && D.fonts.ready) D.fonts.ready.then(function () { refreshST(); setTimeout(refreshST, 120); });
  } catch (e) {}
  qa('img').forEach(function (img) {
    if (!img.complete) img.addEventListener('load', function () { refreshST(); }, { once: true });
  });
  var rz;
  window.addEventListener('resize', function () { clearTimeout(rz); rz = setTimeout(refreshST, 220); });

  var scrollLocks = 0;
  function lockScroll() {
    scrollLocks++;
    if (scrollLocks > 1) return;
    if (lenis) { try { lenis.stop(); } catch (e) {} }
    D.documentElement.style.overflow = 'hidden';
  }
  function unlockScroll() {
    scrollLocks = Math.max(0, scrollLocks - 1);
    if (scrollLocks) return;
    D.documentElement.style.overflow = '';
    if (lenis) { try { lenis.start(); } catch (e) {} }
  }
  function scrollToId(id) {
    var el = D.getElementById(id);
    if (!el) return;
    if (lenis) { try { lenis.scrollTo(el, { offset: 0, duration: 1.1 }); return; } catch (e) {} }
    el.scrollIntoView({ behavior: RM ? 'auto' : 'smooth', block: 'start' });
  }

  /* ========================================================
     2. CATALOG
     ======================================================== */
  var APP = ['S', 'M', 'L', 'XL', 'XXL'];
  var ONE = ['One size'];

  var CAT = {
    hoodie: { id: 'hoodie', name: 'All-Over Print Hoodie', price: 168,
      image: 'assets/b1-hoodie-front.jpg', sizes: APP, print: 'All-over, front + back',
      desc: 'The anchor of Drop 01. All-over print, front and back.' },
    crew: { id: 'crew', name: 'Flight Crew Crewneck', price: 138,
      image: 'assets/b1-hoodie-front.jpg', sizes: APP, print: 'All-over, front + back',
      desc: 'The hoodie print, stripped to the crew.' },
    tee: { id: 'tee', name: 'Squadron Tee', price: 78,
      image: 'assets/b3-tee.jpg', sizes: APP, print: 'All-over, front + back',
      desc: 'All-over print tee. Front and back, no blank panels.' },
    joggers: { id: 'joggers', name: 'Runway Joggers', price: 128,
      image: 'assets/b5-joggers.jpg', sizes: APP, print: 'All-over, leg panel',
      desc: 'All-over print on the leg panel. Built to run with the hoodie.' },
    sunglasses: { id: 'sunglasses', name: 'Aviator Sunglasses', price: 185,
      image: 'assets/b7-sunglasses.jpg', sizes: ONE, print: 'Etched bayonet temple',
      desc: 'Gold-tone aviator frame. The original issue silhouette.' },
    socks: { id: 'socks', name: 'Ribbed Socks 3-Pack', price: 38,
      image: 'assets/c3-socks.jpg', sizes: ONE, print: 'Woven cuff mark',
      desc: 'Three pairs, ribbed, marked at the cuff.' }
  };
  var ALIAS = { hood: 'hoodie', hoodies: 'hoodie', crewneck: 'crew', sweatshirt: 'crew', sweats: 'joggers',
    jogger: 'joggers', pants: 'joggers', tshirt: 'tee', 't-shirt': 'tee', tees: 'tee', shades: 'sunglasses',
    sunnies: 'sunglasses', sunglass: 'sunglasses', eyewear: 'sunglasses', aviators: 'sunglasses',
    sock: 'socks', 'socks-3pack': 'socks' };

  function product(id) {
    if (!id) return null;
    var k = String(id).toLowerCase().trim();
    if (CAT[k]) return CAT[k];
    if (ALIAS[k] && CAT[ALIAS[k]]) return CAT[ALIAS[k]];
    var keys = Object.keys(CAT), i;
    for (i = 0; i < keys.length; i++) if (k.indexOf(keys[i]) > -1) return CAT[keys[i]];
    for (i = 0; i < keys.length; i++) if (keys[i].indexOf(k) > -1) return CAT[keys[i]];
    return null;
  }

  /* ========================================================
     3. CART STORE
     ======================================================== */
  var KEY = 'tps.cart.v1';
  var items = [];

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return [];
      var d = JSON.parse(raw);
      if (!Array.isArray(d)) return [];
      return d.filter(function (l) { return l && l.name && isFinite(l.price); })
        .map(function (l) {
          return { key: l.key || (l.id + '|' + (l.size || '') + '|' + (l.config || '')),
            id: l.id || 'item', name: String(l.name), price: Number(l.price) || 0,
            size: l.size || '', config: l.config || '', image: l.image || '',
            qty: Math.max(1, Math.min(99, parseInt(l.qty, 10) || 1)) };
        });
    } catch (e) { return []; }
  }
  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(items)); } catch (e) {}
  }
  function count() { return items.reduce(function (n, l) { return n + l.qty; }, 0); }
  function subtotal() { return items.reduce(function (n, l) { return n + l.price * l.qty; }, 0); }
  function money(n) {
    return '$' + (Math.round(n * 100) / 100).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  function announceCount() {
    try {
      window.dispatchEvent(new CustomEvent('cart:count', { detail: { count: count(), subtotal: subtotal() } }));
    } catch (e) {}
  }

  function addItem(d) {
    if (!d) return;
    var p = product(d.id) || {};
    var name = d.name || p.name || 'Item';
    var price = isFinite(Number(d.price)) && d.price !== '' && d.price !== null ? Number(d.price) : (p.price || 0);
    var size = d.size || (p.sizes ? p.sizes[Math.min(2, p.sizes.length - 1)] : '');
    var image = d.image || p.image || '';
    var config = d.config || '';
    var key = (d.id || name) + '|' + size + '|' + config;
    var found = null;
    items.forEach(function (l) { if (l.key === key) found = l; });
    if (found) found.qty = Math.min(99, found.qty + (parseInt(d.qty, 10) || 1));
    else items.push({ key: key, id: d.id || name, name: name, price: price, size: size,
      config: config, image: image, qty: Math.max(1, parseInt(d.qty, 10) || 1) });
    save(); render(); announceCount();
    return key;
  }
  function setQty(key, n) {
    items = items.map(function (l) { if (l.key === key) l.qty = Math.max(0, Math.min(99, n)); return l; })
      .filter(function (l) { return l.qty > 0; });
    save(); render(); announceCount();
  }
  function removeItem(key) {
    items = items.filter(function (l) { return l.key !== key; });
    save(); render(); announceCount();
  }

  /* ========================================================
     4. DOM refs
     ======================================================== */
  var scrim = q('#cv-scrim');
  var cartEl = q('#cv-cart'), pdpEl = q('#cv-pdp');
  var linesEl = q('#cv-lines'), subEl = q('#cv-sub'), cartSub = q('#cv-cart-sub');

  if (cartEl) {
    var cb = q('#cv-cart-body'); if (cb) cb.setAttribute('data-lenis-prevent', '');
    var pi = q('.x-pdp-info'); if (pi) pi.setAttribute('data-lenis-prevent', '');
  }

  /* ========================================================
     5. CART RENDER
     ======================================================== */
  function render() {
    if (!linesEl) return;
    var n = count(), sum = subtotal();

    linesEl.innerHTML = '';
    items.forEach(function (l) {
      var li = D.createElement('li');
      var meta = [l.config, l.size].filter(Boolean).join(' — ');
      li.innerHTML =
        '<div class="x-li-fig">' + (l.image ? '<img src="' + l.image + '" alt="" decoding="async">' : '') + '</div>' +
        '<div class="x-li-main">' +
          '<p class="x-li-name">' + esc(l.name) + '</p>' +
          '<p class="micro x-li-cfg">' + esc(meta || 'Drop 01') + '</p>' +
          '<div class="x-li-qty">' +
            '<button class="x-step" type="button" data-act="dec" aria-label="Decrease quantity of ' + esc(l.name) + '">&minus;</button>' +
            '<span class="x-qn" aria-label="Quantity">' + l.qty + '</span>' +
            '<button class="x-step" type="button" data-act="inc" aria-label="Increase quantity of ' + esc(l.name) + '">+</button>' +
          '</div>' +
        '</div>' +
        '<div class="x-li-right">' +
          '<span class="x-li-price">' + money(l.price * l.qty) + '</span>' +
          '<button class="x-rm" type="button" data-act="rm" aria-label="Remove ' + esc(l.name) + ' from cart">Remove</button>' +
        '</div>';
      li.setAttribute('data-key', l.key);
      linesEl.appendChild(li);
    });

    if (cartEl) cartEl.classList.toggle('is-filled', n > 0);
    if (cartSub) cartSub.textContent = n === 1 ? '1 item' : n + ' items';
    if (subEl) subEl.textContent = money(sum);

  }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  if (linesEl) {
    linesEl.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-act]'); if (!b) return;
      var li = b.closest('li[data-key]'); if (!li) return;
      var key = li.getAttribute('data-key'), act = b.getAttribute('data-act');
      var cur = 0; items.forEach(function (l) { if (l.key === key) cur = l.qty; });
      if (act === 'inc') setQty(key, cur + 1);
      else if (act === 'dec') setQty(key, cur - 1);
      else removeItem(key);
      var again = linesEl.querySelector('li[data-key="' + key + '"] .x-step[data-act="' + act + '"]');
      if (again) again.focus(); else focusFirst(cartEl);
    });
  }

  /* ========================================================
     6. DRAWER CONTROLLER (shared a11y)
     ======================================================== */
  var openEl = null, lastFocus = null;

  function focusList(root) {
    return qa('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])', root)
      .filter(function (el) { return el.offsetWidth || el.offsetHeight || el.getClientRects().length; });
  }
  function focusFirst(root) {
    var f = focusList(root); (f[0] || root).focus();
  }

  function openDrawer(el, trigger) {
    if (!el || openEl === el) return;
    if (openEl) closeDrawer(true);
    lastFocus = trigger || D.activeElement;
    openEl = el;
    el.hidden = false;
    if (scrim) scrim.hidden = false;
    D.body.setAttribute('data-cv-open', el.id);
    lockScroll();

    if (G && !RM) {
      G.set(el, { xPercent: 100 });
      G.to(el, { xPercent: 0, duration: 0.68, ease: 'power3.out' });
      G.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.46, ease: 'power2.out' });
      var kids = qa('.x-dr-head > *, .x-lines > li, .x-empty > *, .x-dr-foot > *, .x-pdp-info > *', el);
      if (kids.length) G.fromTo(kids, { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.62, ease: 'power3.out', stagger: 0.06, delay: 0.14, clearProps: 'transform' });
    } else {
      if (scrim) scrim.style.opacity = '1';
      el.style.transform = 'none';
    }
    setTimeout(function () { focusFirst(el); }, RM ? 0 : 120);
  }

  function closeDrawer(instant) {
    var el = openEl; if (!el) return;
    openEl = null;
    D.body.removeAttribute('data-cv-open');
    var done = function () {
      el.hidden = true;
      if (scrim) { scrim.hidden = true; scrim.style.opacity = ''; }
      unlockScroll();
      if (lastFocus && D.contains(lastFocus)) { try { lastFocus.focus(); } catch (e) {} }
      lastFocus = null;
    };
    if (G && !RM && !instant) {
      G.to(el, { xPercent: 100, duration: 0.46, ease: 'power3.in' });
      G.to(scrim, { opacity: 0, duration: 0.44, ease: 'power2.in', onComplete: done });
    } else { done(); }
  }

  D.addEventListener('keydown', function (e) {
    if (!openEl) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
    if (e.key !== 'Tab') return;
    var f = focusList(openEl); if (!f.length) return;
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (D.activeElement === first || !openEl.contains(D.activeElement))) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && D.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });
  if (scrim) scrim.addEventListener('click', function () { closeDrawer(); });
  var cx = q('#cv-cart-x'); if (cx) cx.addEventListener('click', function () { closeDrawer(); });
  var px = q('#cv-pdp-x'); if (px) px.addEventListener('click', function () { closeDrawer(); });
  var ec = q('#cv-empty-cta');
  if (ec) ec.addEventListener('click', function () { closeDrawer(); setTimeout(function () { scrollToId('drop'); }, 260); });

  var co = q('#cv-checkout');
  if (co) co.addEventListener('click', function () {
    var s = q('#cv-cart-sub');
    if (s) { s.textContent = 'Demo — no checkout wired'; setTimeout(render, 2600); }
  });

  /* ========================================================
     7. PDP DRAWER
     ======================================================== */
  var pdpCur = null, pdpSize = '';
  function openPdp(id, trigger, override) {
    var p = product(id); if (!p || !pdpEl) return;
    pdpCur = p;
    var o = override || {};
    var img = q('#cv-pdp-img');
    if (img) { img.src = o.image || p.image; img.alt = p.name + ' — The Pilot\'s Son Drop 01'; }
    q('#cv-pdp-name').textContent = p.name;
    q('#cv-pdp-price').textContent = money(p.price);
    q('#cv-pdp-desc').textContent = p.desc;
    q('#cv-pdp-kick').textContent = o.kick || 'Quick view — Drop 01';
    var spec = q('#cv-pdp-spec');
    spec.innerHTML =
      row('Material', p.material) + row('Print', p.print) + row('Fit', p.fit) +
      row('Seams', 'Double-stitched') + row('Stock', 'Limited run');

    pdpSize = '';
    var row2 = q('#cv-size-row');
    row2.innerHTML = p.sizes.map(function (s, i) {
      return '<label class="x-size"><input type="radio" name="cv-size" value="' + esc(s) + '"' +
        (p.sizes.length === 1 ? ' checked' : (i === 2 ? ' checked' : '')) + '><span>' + esc(s) + '</span></label>';
    }).join('');
    var checked = row2.querySelector('input:checked');
    pdpSize = checked ? checked.value : p.sizes[0];
    row2.addEventListener('change', function (e) {
      if (e.target && e.target.name === 'cv-size') { pdpSize = e.target.value; setPdpLive(''); }
    });
    var an = q('#cv-pdp-addn'); if (an) an.textContent = money(p.price);
    setPdpLive('');
    openDrawer(pdpEl, trigger);
  }
  function row(k, v) {
    return '<div><dt>' + esc(k) + '</dt><dd>' + esc(v) + '</dd></div>';
  }
  function setPdpLive(t) { var l = q('#cv-pdp-live'); if (l) l.textContent = t; }

  var pAdd = q('#cv-pdp-add');
  if (pAdd) pAdd.addEventListener('click', function () {
    if (!pdpCur) return;
    addItem({ id: pdpCur.id, name: pdpCur.name, price: pdpCur.price, size: pdpSize, image: pdpCur.image });
    setPdpLive(pdpCur.name + ' added to cart.');
    var t = lastFocus;
    closeDrawer(true);
    setTimeout(function () { openDrawer(cartEl, t); }, 60);
  });

  /* ========================================================
     8. PUBLIC EVENT API  (P1–P4 talk to P5 through these)
     ======================================================== */
  window.addEventListener('cart:add', function (e) {
    var d = (e && e.detail) || {};
    addItem(d);
    if (d.silent !== true) openDrawer(cartEl, d.trigger || D.activeElement);
  });
  window.addEventListener('cart:open', function (e) {
    var d = (e && e.detail) || {};
    openDrawer(cartEl, d.trigger || D.activeElement);
  });
  window.addEventListener('cart:close', function () { closeDrawer(); });
  window.addEventListener('pdp:open', function (e) {
    var d = (e && e.detail) || {};
    openPdp(d.id, d.trigger || D.activeElement, d);
  });

  window.__tpsCart = {
    add: addItem, open: function () { openDrawer(cartEl); }, close: closeDrawer,
    pdp: openPdp, items: function () { return items.slice(); },
    count: count, subtotal: subtotal, catalog: CAT
  };

  /* delegated fallback so any piece can wire with markup only */
  D.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cart-add]');
    if (a) {
      e.preventDefault();
      addItem({ id: a.getAttribute('data-cart-add'), size: a.getAttribute('data-size') || '',
        config: a.getAttribute('data-config') || '' });
      openDrawer(cartEl, a);
      return;
    }
    var v = e.target.closest('[data-pdp-open]');
    if (v) { e.preventDefault(); openPdp(v.getAttribute('data-pdp-open'), v); return; }
    var o = e.target.closest('[data-cart-open]');
    if (o) { e.preventDefault(); openDrawer(cartEl, o); }
  });

  items = load();
  render();
  announceCount();

  /* ========================================================
     9. CAPTURE FORM
     ======================================================== */
  var form = q('#cv-form'), email = q('#cv-email'), live = q('#cv-live'),
      note = q('#cv-note'), submit = q('#cv-submit');
  var RX = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

  function say(msg, bad) {
    if (!live) return;
    live.textContent = msg;
    live.style.color = bad ? 'var(--flare)' : 'var(--bone)';
  }
  if (form && email) {
    email.addEventListener('input', function () {
      if (!form.classList.contains('is-bad')) return;
      if (RX.test(email.value.trim())) {
        form.classList.remove('is-bad'); email.setAttribute('aria-invalid', 'false'); say('');
      }
    });
    email.addEventListener('blur', function () {
      var v = email.value.trim();
      if (v && !RX.test(v)) {
        form.classList.add('is-bad'); email.setAttribute('aria-invalid', 'true');
        say('That address needs a name, an @ and a domain.', true);
      }
    });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = email.value.trim();
      if (!v) {
        form.classList.add('is-bad'); email.setAttribute('aria-invalid', 'true');
        say('Enter an email so we can call you to the gate.', true); email.focus(); return;
      }
      if (!RX.test(v)) {
        form.classList.add('is-bad'); email.setAttribute('aria-invalid', 'true');
        say('That address needs a name, an @ and a domain.', true); email.focus(); return;
      }
      form.classList.remove('is-bad');
      email.setAttribute('aria-invalid', 'false');
      email.readOnly = true;
      if (submit) { submit.disabled = true; submit.textContent = 'On the manifest'; }
      form.classList.add('is-done');
      if (note) note.textContent = 'Confirmation sent to ' + v;
      say("You're on the manifest. Wheels up soon.");
      if (G && !RM) {
        G.fromTo(live, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.52, ease: 'power3.out' });
      }
    });
  }

  /* ========================================================
     10. SECTION MOTION
     ======================================================== */
  if (G && ST && !RM) {
    var sec = q('#notify');
    if (sec) {
      var lines = qa('.x-nt-mega .x-ln > span');
      if (lines.length) {
        G.set(lines, { yPercent: 108 });
        G.to(lines, {
          yPercent: 0, duration: 0.98, ease: 'power3.out', stagger: 0.085,
          scrollTrigger: { trigger: sec, start: 'top 72%', once: true }
        });
      }
      var rise = qa('.x-nt-top > *, .x-nt-spec .x-spec > div, .x-nt-copy, .x-form', sec);
      if (rise.length) {
        G.set(rise, { opacity: 0, y: 26 });
        G.to(rise, {
          opacity: 1, y: 0, duration: 0.86, ease: 'power3.out', stagger: 0.07,
          scrollTrigger: { trigger: sec, start: 'top 70%', once: true },
          clearProps: 'transform'
        });
      }
      var rails = qa('.x-runway i');
      if (rails.length) {
        G.fromTo(rails, { scaleY: 0.2, transformOrigin: '50% 0%' },
          { scaleY: 1, duration: 1.2, ease: 'power2.out', stagger: 0.06,
            scrollTrigger: { trigger: sec, start: 'top 85%', once: true } });
        G.to(rails, {
          yPercent: 12, ease: 'none',
          scrollTrigger: { trigger: sec, start: 'top bottom', end: 'bottom top', scrub: 0.7 }
        });
      }
    }

    var foot = q('#cv-foot'), wm = q('#cv-wm');
    if (foot && wm) {
      /* horizontal movement driven by vertical scroll — measured so the
         wordmark never clips: it travels from flush-right to flush-left. */
      var delta = function () {
        var cw = wm.parentNode.getBoundingClientRect().width;
        var sw = wm.getBoundingClientRect().width;
        return cw - sw;
      };
      G.fromTo(wm,
        { x: function () { var d = delta(); return d > 12 ? d : 0; } },
        { x: function () { var d = delta(); return d > 12 ? 0 : (d < -12 ? d : 0); },
          ease: 'none',
          scrollTrigger: { trigger: foot, start: 'top bottom', end: 'bottom bottom',
            scrub: 0.6, invalidateOnRefresh: true } });

      var fcols = qa('.x-fcol', foot);
      if (fcols.length) {
        G.set(fcols, { opacity: 0, y: 30 });
        G.to(fcols, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.08,
          scrollTrigger: { trigger: foot, start: 'top 84%', once: true }, clearProps: 'transform' });
      }
    }
  }

  /* reduced motion: nothing is parked invisible */
  if (RM) {
    qa('.x-nt-mega .x-ln > span, .x-fcol, .x-runway i').forEach(function (el) {
      el.style.opacity = '1'; el.style.transform = 'none';
    });
  }
})();
