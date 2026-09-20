(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sec = document.getElementById('drop'); if(!sec) return;
  try{ if(window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger); }catch(e){}

  /* ---- ticker built from the real drop names ---- */
  (function(){
    var host = document.getElementById('drop-ticker'); if(!host) return;
    var words = ['Forever a Fly Boy','Abduction','Cyber Geisha','Wear the name','Poseidon',
                 'Phoenix Rising','Drop 01 — limited run','Chrome Autobot','Winged Pegasus'];
    var html = words.map(function(w){ return '<span>'+w+'</span><i>&bull;</i>'; }).join('');
    host.innerHTML = html + html;
    if(RM || !window.gsap) return;
    var half = host.scrollWidth / 2;
    var tw = gsap.to(host,{x:-half,duration:26,ease:'none',repeat:-1,
      modifiers:{x:function(x){ return (parseFloat(x) % half) + 'px'; }}});
    /* scroll velocity leans and speeds the band — the marquee reacts to the reader */
    if(window.ScrollTrigger){
      ScrollTrigger.create({trigger:sec,start:'top bottom',end:'bottom top',
        onUpdate:function(self){
          var v = Math.max(-1, Math.min(1, self.getVelocity() / 2200));
          gsap.to(tw, {timeScale: 1 + Math.abs(v)*2.6, duration:.35, overwrite:true});
          gsap.to(host, {skewX: v * -7, duration:.45, ease:'power3.out', overwrite:true});
        }});
    }
  })();

  /* ---- the grid: all 19 visible, no sequential gate, cards rise on entry ---- */
  (function(){
    var pin  = document.getElementById('drop-pin'),
        rail = document.getElementById('drop-rail'),
        idx  = document.getElementById('drop-idx');
    if(!pin || !rail) return;
    var cells = rail.querySelectorAll('.d-cell');
    cells.forEach(function(c){ if(c.querySelector('video')) c.classList.add('has-spin'); });
    if(idx) idx.textContent = String(cells.length);
    if(RM || !window.gsap || !window.ScrollTrigger) return;

    /* one direction, 70ms cascade, per row so it reads as a wave not a list */
    gsap.from(cells,{y:48,opacity:0,duration:.8,ease:'power3.out',stagger:.055,
      scrollTrigger:{trigger:rail,start:'top 84%'}});

    /* play a 360° spin only while its cell is actually in view */
    cells.forEach(function(c){
      var v=c.querySelector('video'); if(!v) return;
      c.addEventListener('mouseenter',function(){ v.play().catch(function(){}); });
      c.addEventListener('mouseleave',function(){ v.pause(); });
    });
  })();

  /* ---- headline reveal ---- */
  (function(){
    var lines = sec.querySelectorAll('.d-l > span');
    if(!lines.length || !window.gsap) return;
    if(RM){ gsap.set(lines,{yPercent:0}); return; }
    gsap.set(lines,{yPercent:112});
    gsap.to(lines,{yPercent:0,duration:1.05,ease:'power4.out',stagger:.08,
      scrollTrigger:{trigger:'.d-head',start:'top 72%'}});
  })();

  /* ---- commerce: size pick + add to cart ---- */
  sec.addEventListener('click', function(e){
    var sz = e.target.closest('.d-sz');
    if(sz){
      sz.parentNode.querySelectorAll('.d-sz').forEach(function(b){ b.setAttribute('aria-pressed','false'); });
      sz.setAttribute('aria-pressed','true');
      var m = sz.closest('.d-cell').querySelector('.d-szmsg');
      if(m) m.textContent = '';
      var g = sz.closest('.d-sizes');
      if(g) g.classList.remove('is-ask');
      return;
    }
    var q = e.target.closest('.d-quick');
    if(q){ window.dispatchEvent(new CustomEvent('pdp:open',{detail:{id:q.dataset.quick}})); return; }
    var add = e.target.closest('.d-add');
    if(add){
      var cell = add.closest('.d-cell'); if(!cell) return;
      var picked = cell.querySelector('.d-sz[aria-pressed="true"]');
      if(!picked){
        var grp = cell.querySelector('.d-sizes'), msg = cell.querySelector('.d-szmsg');
        if(msg) msg.textContent = 'Pick a size first';
        if(grp){
          grp.classList.remove('is-ask');
          void grp.offsetWidth;
          grp.classList.add('is-ask');
        }
        return;
      }
      window.dispatchEvent(new CustomEvent('cart:add',{detail:{
        id: cell.dataset.id, name: cell.dataset.name,
        price: +cell.dataset.price, size: picked.dataset.sz,
        image: 'assets/' + cell.dataset.img
      }}));
      var was = add.textContent;
      add.textContent = 'Added'; add.dataset.done = '1';
      setTimeout(function(){ add.textContent = was; add.dataset.done = ''; }, 1600);
    }
  });
})();
