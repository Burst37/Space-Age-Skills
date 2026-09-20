(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sec = document.getElementById('studio'); if(!sec) return;
  try{ if(window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger); }catch(e){}

  var deck   = document.getElementById('studio-deck');
  var panels = [].slice.call(sec.querySelectorAll('.s-panel'));
  var tabs   = [].slice.call(sec.querySelectorAll('.s-tabs button'));

  /* ---- switch between cap / socks / beanie ---- */
  tabs.forEach(function(t){
    t.addEventListener('click', function(){
      var i = +t.dataset.go;
      tabs.forEach(function(b,n){ b.setAttribute('aria-selected', n===i ? 'true':'false'); });
      panels.forEach(function(p,n){ p.classList.toggle('is-on', n===i); });
      if(window.ScrollTrigger) ScrollTrigger.refresh();
      if(!RM && window.gsap){
        var on = panels[i];
        gsap.fromTo(on.querySelectorAll('.s-stage, .s-ctl > *'),
          {y:26,opacity:0},{y:0,opacity:1,duration:.7,ease:'power3.out',stagger:.045});
      }
    });
  });

  /* ---- the actual product photo swaps on swatch pick ---- */
  sec.addEventListener('click', function(e){
    var sw = e.target.closest('.s-sw');
    if(sw){
      var panel = sw.closest('.s-panel'); if(!panel) return;
      panel.querySelectorAll('.s-sw').forEach(function(b){ b.setAttribute('aria-checked','false'); });
      sw.setAttribute('aria-checked','true');
      var img = panel.querySelector('.s-img');
      var lab = panel.querySelector('[id^="s-cn-"]');
      if(lab) lab.textContent = sw.dataset.name;
      if(!img) return;
      var next = sw.dataset.img;
      if(RM){ img.src = next; return; }
      img.classList.add('is-swap');
      var pre = new Image();
      pre.onload = function(){ img.src = next; requestAnimationFrame(function(){ img.classList.remove('is-swap'); }); };
      pre.onerror = function(){ img.classList.remove('is-swap'); };
      pre.src = next;
      return;
    }
    var add = e.target.closest('.s-add');
    if(add){
      var p = add.closest('.s-panel'); if(!p) return;
      var chosen = p.querySelector('.s-sw[aria-checked="true"]');
      var colour = chosen ? chosen.dataset.name : '';
      window.dispatchEvent(new CustomEvent('cart:add',{detail:{
        id: p.dataset.pid + '-' + colour.toLowerCase().replace(/\s+/g,'-'),
        name: p.dataset.name + (colour ? ' — ' + colour : ''),
        price: +p.dataset.price, size: 'One size',
        image: chosen ? chosen.dataset.img : ''
      }}));
      var was = add.textContent;
      add.textContent='Added'; add.dataset.done='1';
      setTimeout(function(){ add.textContent=was; add.dataset.done=''; },1600);
    }
  });

  /* ---- entrance: headline, then the stage arrives at scale ---- */
  (function(){
    if(!window.gsap) return;
    var lines = sec.querySelectorAll('.s-l > span');
    if(RM){ gsap.set(lines,{yPercent:0}); return; }
    gsap.set(lines,{yPercent:112});
    gsap.to(lines,{yPercent:0,duration:1.05,ease:'power4.out',stagger:.08,
      scrollTrigger:{trigger:'.s-head',start:'top 74%'}});
    if(!window.ScrollTrigger) return;
    gsap.from(deck,{scale:.92,opacity:0,duration:1,ease:'power3.out',
      scrollTrigger:{trigger:deck,start:'top 82%'}});
    gsap.to(sec.querySelector('.s-stage'),{yPercent:-7,ease:'none',
      scrollTrigger:{trigger:deck,start:'top bottom',end:'bottom top',scrub:.7}});
  })();
})();
