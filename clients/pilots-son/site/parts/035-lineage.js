/* masked line reveal on the lineage head, matched to the other sections */
(function () {
  var G = window.gsap, ST = window.ScrollTrigger, sec = document.getElementById('lineage');
  if (!G || !ST || !sec || window.matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  var lines = sec.querySelectorAll('.l-l > span');
  G.from(lines, {
    yPercent: 112, duration: 1.05, ease: 'expo.out', stagger: .08,
    scrollTrigger: { trigger: sec, start: 'top 72%' }
  });
})();
