// Home page — project browser (infinite loop).
// LEFT panel:  vertical list of names, moves DOWN when advancing.
// RIGHT panel: vertical thumbnail carousel, moves UP (opposite direction).
// Clicking a thumbnail/active title opens a 3-page project view.
import { projects, imgSrc, imgAt } from "./projects.js";
import { StepScroll } from "./stepscroll.js";
import { runLoader }  from "./loader.js";

runLoader();

const namesEl    = document.getElementById("names");
const carouselEl = document.getElementById("carousel");

const N = projects.length;
const M = N * 2;   // double-buffer for seamless looping

const nameEls  = [];
const thumbEls = [];
for (let t = 0; t < M; t++) {
  const p = projects[t % N];

  const nameEl = document.createElement("div");
  nameEl.className = "name";
  nameEl.innerHTML = `<span class="name__title">${p.name}</span><span class="name__tag">${p.category}</span>`;
  namesEl.appendChild(nameEl);
  nameEls.push(nameEl);

  const thumbEl = document.createElement("div");
  thumbEl.className = "thumb";
  thumbEl.innerHTML =
    `<img src="${imgSrc(p)}" alt="${p.name}" draggable="false" />` +
    `<div class="thumb__overlay"><span class="thumb__plus"></span></div>`;
  carouselEl.appendChild(thumbEl);
  thumbEls.push(thumbEl);
}

let pos      = 0;
let isOpen   = false;
let menuOpen = false;
let heroEl   = null;
let heroSlot = null;
const prevRel = new Array(M).fill(null);
let nameStep  = 0;
let thumbStep = 0;

function measure() {
  const vh = window.innerHeight;
  nameStep  = vh * 0.18;
  thumbStep = vh * 0.67;
}

function relOf(t) {
  let rel = ((t - pos) % M + M) % M;
  if (rel > M / 2) rel -= M;
  return rel;
}

function applyTile(t, rel) {
  const dist = Math.abs(rel);

  const nameEl = nameEls[t];
  nameEl.style.transform =
    `translateY(calc(-50% + ${rel * nameStep}px)) scale(${rel === 0 ? 1 : 0.4})`;
  nameEl.classList.toggle("is-active", rel === 0);
  nameEl.style.opacity = dist <= 1 ? "1" : "0";

  const thumbEl = thumbEls[t];
  thumbEl.style.transform =
    `translate(-50%, calc(-50% + ${-rel * thumbStep}px)) scale(${rel === 0 ? 1 : 0.86})`;
  thumbEl.style.opacity = rel === 0 ? "1" : dist === 1 ? "0.5" : "0";
  thumbEl.style.zIndex  = rel === 0 ? "2" : "1";
  thumbEl.classList.toggle("is-current", rel === 0);
}

function render() {
  if (isOpen) return;
  for (let t = 0; t < M; t++) {
    if (thumbEls[t] === heroEl) continue;
    const rel     = relOf(t);
    const wrapped = prevRel[t] !== null && Math.abs(rel - prevRel[t]) > 1;
    if (wrapped) {
      nameEls[t].style.transition  = "none";
      thumbEls[t].style.transition = "none";
      applyTile(t, rel);
      void nameEls[t].offsetWidth;
      nameEls[t].style.transition  = "";
      thumbEls[t].style.transition = "";
    } else {
      applyTile(t, rel);
    }
    prevRel[t] = rel;
  }
}

measure();
render();

let entering        = false;
let pvCooldownUntil = 0;
let pvDurMs         = 0;
let pg              = 0;
let pvLeft          = [];
let pvRight         = [];
const sectionTimers = [];
let revealTimer     = null;

const projectPage = document.getElementById("projectPage");
const sectionEls  = [...projectPage.querySelectorAll(".proj-section")];
const brandEl     = document.querySelector(".brand");
const pvEl        = document.getElementById("pv");

new StepScroll({
  target: document.querySelector(".shell"),
  onStep: (dir) => {
    if (menuOpen) return;
    if (isOpen) {
      if (entering) return;
      const now = performance.now();
      if (now < pvCooldownUntil) return;
      if (!pvDurMs) pvDurMs = cssMs("--pv-dur");
      pvCooldownUntil = now + pvDurMs;
      pvStep(dir);
      return;
    }
    pos += dir;
    render();
  },
});

window.addEventListener("resize", () => { measure(); render(); });

const QUOTE = {
  name: "Jane Doe",
  text: "Some people think design means how it looks. But if you dig deeper, it's really how it works.",
};

const HERO_TRANSITION =
  ["top", "left", "width", "height", "transform"]
    .map((p) => `${p} var(--hero-dur) var(--ease)`)
    .join(", ");

function buildPV(project) {
  const sectionsClone = projectPage
    .querySelector(".project-page__inner")
    .cloneNode(true);
  sectionsClone.querySelectorAll(".proj-section").forEach((s) => s.classList.add("is-in"));

  pvEl.innerHTML = "";
  const leftTrack  = document.createElement("div");
  leftTrack.className  = "pv-track pv-track--left";
  const rightTrack = document.createElement("div");
  rightTrack.className = "pv-track pv-track--right";

  const panel = (cls, inner) => {
    const el = document.createElement("div");
    el.className = `pv-panel ${cls}`;
    if (inner) el.append(inner);
    return el;
  };
  const imgPanel = (file) => {
    const el = panel("pv-image");
    el.innerHTML = `<img src="${imgAt(project, file)}" alt="${project.name}" draggable="false" />`;
    return el;
  };

  const leftP0 = panel("pv-white");
  leftP0.append(sectionsClone);
  pvLeft  = [leftP0, imgPanel("02.jpg"), imgPanel("04.jpg")];
  pvLeft.forEach((el) => leftTrack.append(el));

  const rightP0 = imgPanel("01.jpg");
  const rightP1 = panel("pv-white pv-figure");
  rightP1.innerHTML = `<img class="pv-figure__img" src="${imgAt(project, "03.jpg")}" alt="${project.name}" draggable="false" />`;
  const rightP2 = panel("pv-white pv-quote");
  rightP2.innerHTML =
    `<span class="pv-quote__name">${QUOTE.name}</span>` +
    `<p class="pv-quote__text">${QUOTE.text}</p>`;
  pvRight = [rightP0, rightP1, rightP2];
  pvRight.forEach((el) => rightTrack.append(el));

  pvEl.append(leftTrack, rightTrack);
}

function renderPV(animate = true) {
  const apply = (el, y) => {
    if (!animate) el.style.transition = "none";
    el.style.transform = `translateY(${y}vh)`;
    if (!animate) { void el.offsetWidth; el.style.transition = ""; }
  };
  pvLeft.forEach( (el, i) => apply(el,  (i - pg) * 100));
  pvRight.forEach((el, i) => apply(el, -(i - pg) * 100));
}

function pvStep(dir) {
  const next = pg + dir;
  if (next < 0) { close(); return; }
  if (next > pvLeft.length - 1) return;
  pg = next;
  renderPV(true);
}

function open(thumbEl) {
  if (isOpen) return;
  isOpen = true; entering = true; pg = 0;
  heroEl = thumbEl;
  const project = projects[thumbEls.indexOf(thumbEl) % N];

  document.body.classList.add("project-open");
  projectPage.setAttribute("aria-hidden", "false");
  heroEl.classList.remove("is-current");

  const r = heroEl.getBoundingClientRect();
  const relLeft = r.left - window.innerWidth * 0.5;
  heroSlot = { left: relLeft, top: r.top, w: r.width, h: r.height };
  heroEl.style.zIndex = "12";
  heroEl.style.transition = "none";
  heroEl.style.transform  = "none";
  heroEl.style.left   = `${relLeft}px`;
  heroEl.style.top    = `${r.top}px`;
  heroEl.style.width  = `${r.width}px`;
  heroEl.style.height = `${r.height}px`;
  void heroEl.offsetWidth;

  heroEl.style.transition = HERO_TRANSITION;
  heroEl.style.left   = "0";
  heroEl.style.top    = "0";
  heroEl.style.width  = "50vw";
  heroEl.style.height = "100vh";

  thumbEls.forEach((el) => { if (el !== heroEl) el.style.opacity = "0"; });

  sectionEls.forEach((el) => el.classList.remove("is-in"));
  const revealMs = cssMs("--reveal-dur");
  sectionEls.forEach((el, i) => {
    sectionTimers.push(setTimeout(() => el.classList.add("is-in"), revealMs + i * 220));
  });

  buildPV(project);
  renderPV(false);
  const entryMs = revealMs + (sectionEls.length - 1) * 220 + 720;
  revealTimer = setTimeout(() => { pvEl.classList.add("is-shown"); entering = false; }, entryMs);
}

function close() {
  if (!isOpen) return;
  isOpen = false; entering = false;
  clearTimeout(revealTimer);
  if (pvEl.classList.contains("is-shown")) {
    pvEl.classList.remove("is-shown");
    setTimeout(() => { pg = 0; renderPV(false); contractHero(); }, 360);
  } else {
    contractHero();
  }
}

function contractHero() {
  document.body.classList.remove("project-open");
  projectPage.setAttribute("aria-hidden", "true");
  sectionTimers.forEach(clearTimeout);
  sectionTimers.length = 0;
  sectionEls.forEach((el) => el.classList.remove("is-in"));

  const el = heroEl;
  el.style.transition = HERO_TRANSITION;
  el.style.left   = `${heroSlot.left}px`;
  el.style.top    = `${heroSlot.top}px`;
  el.style.width  = `${heroSlot.w}px`;
  el.style.height = `${heroSlot.h}px`;

  setTimeout(() => {
    el.style.transition = "none";
    el.style.top = ""; el.style.left = "";
    el.style.width = ""; el.style.height = "";
    el.style.transform = ""; el.style.zIndex = "";
    heroEl = null; heroSlot = null;
    pvEl.innerHTML = ""; pvLeft = []; pvRight = [];
    render();
    void el.offsetWidth;
    el.style.transition = "";
  }, cssMs("--hero-dur") + 40);

  render();
}

function cssMs(name) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return v.endsWith("ms") ? parseFloat(v) : parseFloat(v) * 1000;
}

carouselEl.addEventListener("click", (e) => {
  const thumb = e.target.closest(".thumb.is-current");
  if (thumb && !isOpen) open(thumb);
});

namesEl.addEventListener("click", (e) => {
  if (isOpen || !e.target.closest(".name.is-active")) return;
  const hero = document.querySelector(".thumb.is-current");
  if (hero) open(hero);
});

brandEl.addEventListener("click", (e) => { e.preventDefault(); if (isOpen) close(); });

const menuBtn     = document.querySelector(".menu");
const menuPanel   = document.getElementById("menuPanel");
const menuFadeEls = [...menuPanel.querySelectorAll(".menu-item, .menu-studio")];
const menuTimers  = [];

function openMenu() {
  if (menuOpen) return;
  menuOpen = true;
  document.body.classList.add("menu-open");
  menuPanel.setAttribute("aria-hidden", "false");
  menuBtn.textContent = "CLOSE";
  menuBtn.setAttribute("aria-expanded", "true");
  menuFadeEls.forEach((el) => el.classList.remove("is-in"));
  const start = cssMs("--menu-dur") * 0.55;
  menuFadeEls.forEach((el, i) => {
    menuTimers.push(setTimeout(() => el.classList.add("is-in"), start + i * 110));
  });
}

function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false;
  document.body.classList.remove("menu-open");
  menuPanel.setAttribute("aria-hidden", "true");
  menuBtn.textContent = "MENU";
  menuBtn.setAttribute("aria-expanded", "false");
  menuTimers.forEach(clearTimeout);
  menuTimers.length = 0;
  menuFadeEls.forEach((el) => el.classList.remove("is-in"));
}

menuBtn.addEventListener("click", () => { menuOpen ? closeMenu() : openMenu(); });

window.addEventListener("keydown", (e) => {
  if (e.key !== "Escape") return;
  if (menuOpen) closeMenu();
  else if (isOpen) close();
});
