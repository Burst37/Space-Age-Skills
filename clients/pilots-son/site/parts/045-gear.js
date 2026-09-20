(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sec = document.getElementById('gear'); if(!sec) return;
  try{ if(window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger); }catch(e){}
  if(window.gsap){
    var lines = sec.querySelectorAll('.g-l > span');
    if(RM){ gsap.set(lines,{yPercent:0}); }
    else{
      gsap.set(lines,{yPercent:112});
      gsap.to(lines,{yPercent:0,duration:1.05,ease:'power4.out',stagger:.08,
        scrollTrigger:{trigger:'.g-head',start:'top 74%'}});
      gsap.from(sec.querySelectorAll('.g-cell'),{y:64,opacity:0,duration:.9,ease:'power3.out',
        stagger:.075,scrollTrigger:{trigger:'.g-grid',start:'top 82%'}});
      sec.querySelectorAll('.g-cell').forEach(function(c,i){
        gsap.to(c,{yPercent: (i%2 ? -5 : 4), ease:'none',
          scrollTrigger:{trigger:c,start:'top bottom',end:'bottom top',scrub:.8}});
      });
    }
  }
  sec.addEventListener('click',function(e){
    var sz=e.target.closest('.g-sz');
    if(sz){
      sz.parentNode.querySelectorAll('.g-sz').forEach(function(b){ b.setAttribute('aria-pressed','false'); });
      sz.setAttribute('aria-pressed','true');
      var cc=sz.closest('.g-cell'), mm=cc && cc.querySelector('.g-szmsg');
      if(mm) mm.textContent='';
      sz.parentNode.classList.remove('is-ask');
      return;
    }
    var add=e.target.closest('.g-add'); if(!add) return;
    var c=add.closest('.g-cell'); if(!c) return;
    var grp=c.querySelector('.g-sizes'), size='One size';
    if(grp){
      var picked=grp.querySelector('.g-sz[aria-pressed="true"]');
      if(!picked){
        var msg=c.querySelector('.g-szmsg');
        if(msg) msg.textContent='Pick a size first';
        grp.classList.remove('is-ask'); void grp.offsetWidth; grp.classList.add('is-ask');
        return;
      }
      size=picked.dataset.sz;
    }
    window.dispatchEvent(new CustomEvent('cart:add',{detail:{
      id:c.dataset.id,name:c.dataset.name,price:+c.dataset.price,
      size:size,image:'assets/'+c.dataset.img}}));
    var was=add.textContent; add.textContent='Added'; add.dataset.done='1';
    setTimeout(function(){ add.textContent=was; add.dataset.done=''; },1600);
  });
})();
