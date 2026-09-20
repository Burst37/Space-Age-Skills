(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var sec = document.getElementById('craft'); if(!sec) return;
  try{ if(window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger); }catch(e){}

  /* velocity-reactive band built from the brand's own lines */
  (function(){
    var host=document.getElementById('craft-band'); if(!host) return;
    var w=['Fly high','Stay fly','Forever a Fly Boy','Est. 1974','Legacy in flight'];
    var h=w.map(function(t){return '<span>'+t+'</span><i></i>';}).join('');
    host.innerHTML=h+h;
    if(RM||!window.gsap) return;
    var half=host.scrollWidth/2;
    var tw=gsap.to(host,{x:-half,duration:30,ease:'none',repeat:-1,
      modifiers:{x:function(x){return (parseFloat(x)%half)+'px';}}});
    if(!window.ScrollTrigger) return;
    ScrollTrigger.create({trigger:sec,start:'top bottom',end:'bottom top',
      onUpdate:function(s){
        var v=Math.max(-1,Math.min(1,s.getVelocity()/2400));
        gsap.to(tw,{timeScale:1+Math.abs(v)*3,duration:.35,overwrite:true});
        gsap.to(host,{skewX:v*-8,duration:.45,ease:'power3.out',overwrite:true});
      }});
  })();

  if(!window.gsap||!window.ScrollTrigger||RM) return;

  /* spec plate rows cascade */
  gsap.from(sec.querySelectorAll('.c-plate-data div'),
    {y:20,opacity:0,duration:.75,ease:'power3.out',stagger:.075,
     scrollTrigger:{trigger:'.c-plate-data',start:'top 84%'}});
  gsap.from(sec.querySelector('.c-plate'),{y:56,opacity:0,duration:1,ease:'power3.out',
     scrollTrigger:{trigger:'.c-open',start:'top 78%'}});

  /* full-bleed warbird, scrubbed */
  /* the plate drifts and pushes in behind the knocked-out type for the
     whole time the manifest is pinned */
  gsap.fromTo(sec.querySelector('.c-mani-bg'),
    {yPercent:-6,scale:1.16},
    {yPercent:6,scale:1,ease:'none',
     scrollTrigger:{trigger:'.c-mani',start:'top bottom',end:'bottom top',scrub:.7}});
  gsap.fromTo(sec.querySelector('.c-mani-h2'),
    {backgroundPosition:'50% 20%'},
    {backgroundPosition:'50% 70%',ease:'none',
     scrollTrigger:{trigger:'.c-mani',start:'top bottom',end:'bottom top',scrub:.7}});

  /* manifesto arrives at scale, scrubbed against its approach */
  gsap.fromTo(sec.querySelector('.c-mani-h'),{scale:.86,opacity:.25},
    {scale:1,opacity:1,ease:'none',
     scrollTrigger:{trigger:'.c-mani',start:'top 88%',end:'top top',scrub:.7}});
})();
