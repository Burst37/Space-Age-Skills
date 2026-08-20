// Loader — first-load intro.
// Two images push in from opposite vertical directions while the brand
// word breathes outward, then the images slide back out revealing home.
import { projects, imgAt } from "./projects.js";

const ENTER    = 2200;
const BREATHE  = 2400;
const WORD_FADE = 600;
const EXIT     = 2200;
const EXIT_AT  = BREATHE + 650;

const el = (cls) => { const d = document.createElement("div"); d.className = cls; return d; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const onceLoaded = (img) =>
  img.complete
    ? Promise.resolve()
    : new Promise((res) => { img.onload = res; img.onerror = res; });

function randomImage(project) {
  const n = 1 + Math.floor(Math.random() * 5);
  return imgAt(project, String(n).padStart(2, "0") + ".jpg");
}

function pickTwoProjects() {
  const i = Math.floor(Math.random() * projects.length);
  let j = Math.floor(Math.random() * (projects.length - 1));
  if (j >= i) j++;
  return [projects[i], projects[j]];
}

export function runLoader() {
  const [pLeft, pRight] = pickTwoProjects();

  const loader  = el("loader");
  const bg      = el("loader-bg");
  const left    = el("loader-half loader-half--left");
  const right   = el("loader-half loader-half--right");

  const leftImg  = new Image(); leftImg.src  = randomImage(pLeft);  leftImg.alt  = ""; leftImg.draggable  = false;
  const rightImg = new Image(); rightImg.src = randomImage(pRight); rightImg.alt = ""; rightImg.draggable = false;
  left.append(leftImg); right.append(rightImg);

  const word = el("loader-word");
  word.textContent = "KENDALL";

  loader.append(bg, left, right, word);
  document.body.appendChild(loader);

  left.style.transform  = "translateY(100%)";
  right.style.transform = "translateY(-100%)";

  Promise.race([
    Promise.all([onceLoaded(leftImg), onceLoaded(rightImg)]),
    wait(600),
  ]).then(start);

  function start() {
    void left.offsetWidth;

    left.style.transition  = `transform ${ENTER}ms var(--ease)`;
    right.style.transition = `transform ${ENTER}ms var(--ease)`;
    left.style.transform   = "translateY(0)";
    right.style.transform  = "translateY(0)";

    word.style.transition =
      `letter-spacing ${BREATHE}ms var(--ease), ` +
      `text-indent ${BREATHE}ms var(--ease), ` +
      `opacity ${WORD_FADE}ms var(--ease)`;
    word.style.letterSpacing = "0.5em";
    word.style.textIndent    = "0.5em";

    setTimeout(() => { word.style.opacity = "0"; }, BREATHE);

    setTimeout(() => {
      bg.style.opacity = "0";
      left.style.transition  = `transform ${EXIT}ms var(--ease)`;
      right.style.transition = `transform ${EXIT}ms var(--ease)`;
      left.style.transform   = "translateY(100%)";
      right.style.transform  = "translateY(-100%)";
    }, EXIT_AT);

    setTimeout(() => loader.remove(), EXIT_AT + EXIT + 60);
  }
}
