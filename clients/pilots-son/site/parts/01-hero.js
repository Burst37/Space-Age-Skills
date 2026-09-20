(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sec = document.getElementById('top'); if(!sec) return;
  try{ if(window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger); }catch(e){}

  /* ---- 1. SCROLL-SCRUBBED MULTI-ANGLE SEQUENCE ----
     18 frames: 6 looks x (worn / sneaker detail / print detail).
     The hero pins and the cut rate is driven by scroll velocity, not a timer. */
  (function(){
    var shots = [].slice.call(sec.querySelectorAll('.h-shot'));
    var tags  = [].slice.call(sec.querySelectorAll('.h-tag-i'));
    var dots  = [].slice.call(sec.querySelectorAll('.h-dots button'));
    if(!shots.length) return;
    var N = shots.length, cur = -1, fg = sec.querySelector('.h-fg'), scrim = sec.querySelector('.h-scrim');

    function paint(i){
      i = Math.max(0, Math.min(N-1, i));
      if(i === cur) return;
      shots.forEach(function(s,n){ s.classList.toggle('is-on', n === i); });
      tags.forEach(function(t,n){ t.classList.toggle('is-on', n === i); });
      var look = Math.floor(i/2);
      dots.forEach(function(d,n){ d.setAttribute('aria-current', n === look ? 'true' : 'false'); });
      cur = i;
    }
    paint(0);

    if(RM || !window.gsap || !window.ScrollTrigger){
      /* reduced motion: no scrub, no pin — first frame of each look only */
      return;
    }

    var st = ScrollTrigger.create({
      trigger: sec, start: 'top top', end: '+=' + (N * 13) + '%',
      pin: sec, pinSpacing: true, scrub: true, anticipatePin: 1,
      onUpdate: function(self){
        paint(Math.round(self.progress * (N-1)));
        /* headline clears after the first look so the product owns the frame */
        var f = Math.min(1, self.progress / (2.4/N));
        if(fg){ fg.style.opacity = String(1-f); fg.style.transform = 'translate3d(0,'+(-46*f)+'%,0)'; }
        /* the scrim exists to keep the headline legible — lift it once the headline is gone */
        if(scrim){ scrim.style.opacity = String(1 - f*0.72); }
      }
    });

    /* dots jump to the first frame of a look */
    dots.forEach(function(d){
      d.addEventListener('click', function(){
        var target = +d.dataset.go;
        var y = st.start + (st.end - st.start) * (target/(N-1));
        if(window.gsap && gsap.plugins && gsap.plugins.scrollTo) gsap.to(window,{duration:.9,ease:'power2.inOut',scrollTo:y});
        else window.scrollTo({top:y, behavior:'smooth'});
      });
    });
  })();

  /* ---- 2. HEADLINE: per-line masked rise ---- */
  (function(){
    var lines = sec.querySelectorAll('.h-l > span'); if(!lines.length || !window.gsap) return;
    if(RM){ gsap.set(lines,{y:0,opacity:1}); return; }
    gsap.set(lines,{yPercent:112});
    gsap.to(lines,{yPercent:0,duration:1.15,ease:'power4.out',stagger:.085,delay:.18});
    gsap.from(sec.querySelectorAll('.h-eyebrow, .h-sub, .h-cta, .h-strip'),
      {y:22,opacity:0,duration:.9,ease:'power3.out',stagger:.07,delay:.55});
  })();

  /* ---- 3. SCRUBBED EXIT: the hero is left behind, not scrolled past ---- */
  (function(){
    if(RM || !window.gsap || !window.ScrollTrigger) return;
    gsap.to('.h-tag, .h-dots',{opacity:0,ease:'none',
      scrollTrigger:{trigger:sec,start:'bottom 92%',end:'bottom top',scrub:.4}});
  })();

  /* ---- 4. NAV: condense, hide on down, show on up ---- */
  (function(){
    var nav = document.getElementById('hero-nav'); if(!nav) return;
    var last = 0;
    function onScroll(){
      var y = window.scrollY || document.documentElement.scrollTop;
      /* the cart must never leave the screen — a shopper nine sections deep
         had no way back to it. Condense on scroll, never hide. */
      if(y < 80) nav.dataset.state = 'top';
      else nav.dataset.state = 'lift';
      last = y;
    }
    window.addEventListener('scroll', onScroll, {passive:true}); onScroll();
  })();

  /* ---- 5. LIVE COUNTDOWN ---- */
  (function(){
    var T = Date.UTC(2026, 10, 21, 14, 0, 0);
    var D=document.getElementById('hero-cd-d'),H=document.getElementById('hero-cd-h'),
        M=document.getElementById('hero-cd-m'),S=document.getElementById('hero-cd-s');
    if(!D||!H||!M||!S) return;
    var p=function(n){return (n<10?'0':'')+n;};
    (function tick(){
      var ms=Math.max(0,T-Date.now()), s=Math.floor(ms/1000);
      var d=Math.floor(s/86400); s-=d*86400;
      var h=Math.floor(s/3600);  s-=h*3600;
      var m=Math.floor(s/60);    s-=m*60;
      D.textContent=p(d);H.textContent=p(h);M.textContent=p(m);S.textContent=p(s);
      setTimeout(tick,1000);
    })();
  })();

  /* ---- 6. CART CONTRACT ---- */
  (function(){
    var btn=document.getElementById('hero-cart'), n=document.getElementById('hero-cart-n');
    if(btn) btn.addEventListener('click',function(){ window.dispatchEvent(new CustomEvent('cart:open')); });
    var bump=null;
    window.addEventListener('cart:count',function(e){
      if(!n || !e.detail) return;
      var was = n.textContent, now = String(e.detail.count);
      n.textContent = now;
      if(btn && now !== was && +now > +was){
        btn.dataset.bump='1'; clearTimeout(bump);
        bump=setTimeout(function(){ btn.removeAttribute('data-bump'); }, 620);
      }
    });
  })();
})();
