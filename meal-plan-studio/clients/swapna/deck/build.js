const pptxgen = require("pptxgenjs");
const fs = require("fs");
const path = require("path");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const sharp = require("sharp");
const fa = require("react-icons/fa");
const SKILL = fs.readdirSync("/root/.claude/skills/synced").map(d => `/root/.claude/skills/synced/${d}/pptx`).find(p => fs.existsSync(p + "/scripts/apply_theme.js"));
const { applyTheme } = require(SKILL + "/scripts/apply_theme.js");

const D = JSON.parse(fs.readFileSync(path.join(__dirname, "plan.json"), "utf8"));
const FOODS = JSON.parse(fs.readFileSync(path.join(__dirname, "../../skill/dietitian-meal-plan-builder/assets/foods/vegan_hypothyroid_keto_foods.json"), "utf8"));
const OUT = process.argv[2] || path.join(__dirname, "deck_raw.pptx");
const LITE = !!process.env.LITE;
const IMG = k => path.join(__dirname, LITE ? "imgj_lite" : "imgj", k + ".jpg");
const SQ = k => path.join(__dirname, LITE ? "imgsq_lite" : "imgsq", k + ".jpg");
const THUMB = k => path.join(__dirname, "imgthumb", k + ".jpg");
const STRIP = k => path.join(__dirname, "imgstrip", k + ".jpg");
const TALL = k => path.join(__dirname, "imgtall", k + ".jpg");
const INTRO = path.join(__dirname, "..", "intro");

const THEME = {
  name: "Thyroid Smart Keto", headFontFace: "Cambria", bodyFontFace: "Calibri",
  colors: { dk1: "1B2B2A", lt1: "FFFFFF", dk2: "12393F", lt2: "EDF5F3", accent1: "2FAE6E", accent2: "F2A93B", accent3: "C8423A", accent4: "3AA7C9", accent5: "62807C", accent6: "A6D4CB", hlink: "2FAE6E", folHlink: "62807C" },
};
const HEX = { P: "3FBF7F", C: "F2A93B", F: "3AA7C9", dk2: "12393F", lt2: "EDF5F3", line: "D3E3DF", dk1: "1B2B2A", mute: "62807C", red: "C8423A" };

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = "Swapna Alladi – 30-Day Thyroid-Smart Keto Reset";
pres.author = "Registered Dietitian";
pres.company = "Nutrition Practice";
const C = pres.SchemeColor;
const W = 13.333, H = 7.5, MX = 0.6;
const fmt = n => Math.round(n).toLocaleString("en-US");
const meta = {};
let slideNo = 0;

async function icon(name, color = "#FFFFFF", size = 256) {
  const svg = ReactDOMServer.renderToStaticMarkup(React.createElement(fa[name], { color, size: String(size) }));
  const buf = await sharp(Buffer.from(svg)).png().toBuffer();
  return "image/png;base64," + buf.toString("base64");
}

const FOOT = "Swapna Alladi  ·  30-Day Thyroid-Smart Keto Reset";
pres.defineSlideMaster({ title: "VIDEO", background: { color: "000000" }, objects: [] });
pres.defineSlideMaster({
  title: "TITLE", background: { color: THEME.colors.dk2 },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: 0.8, y: 1.5, w: 8.6, h: 2.3, fontSize: 54, bold: true, color: C.background1, valign: "bottom", align: "left", margin: 0 }, text: "" } }],
});
pres.defineSlideMaster({
  title: "CONTENT", background: { color: "FFFFFF" },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.32, w: W - 2 * MX, h: 0.85, fontSize: 28, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { text: { text: FOOT, options: { x: MX, y: 7.08, w: 6, h: 0.3, fontSize: 10, color: C.accent5, margin: 0 } } },
  ],
  slideNumber: { x: W - MX - 0.6, y: 7.08, w: 0.6, h: 0.3, fontSize: 10, color: C.accent5, align: "right" },
});
pres.defineSlideMaster({
  title: "DAY", background: { color: "F6FAF9" },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: 0.45, y: 0.3, w: 3.85, h: 0.6, fontSize: 32, bold: true, color: C.text2, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { text: { text: FOOT, options: { x: 0.45, y: 7.1, w: 5, h: 0.28, fontSize: 10, color: C.accent5, margin: 0 } } },
  ],
  slideNumber: { x: W - 0.45 - 0.6, y: 7.1, w: 0.6, h: 0.28, fontSize: 10, color: C.accent5, align: "right" },
});
pres.defineSlideMaster({
  title: "DARK", background: { color: THEME.colors.dk2 },
  objects: [
    { placeholder: { options: { name: "title", type: "title", x: MX, y: 0.32, w: W - 2 * MX, h: 0.85, fontSize: 28, bold: true, color: C.background1, valign: "middle", align: "left", margin: 0 }, text: "" } },
    { text: { text: FOOT, options: { x: MX, y: 7.08, w: 6, h: 0.3, fontSize: 10, color: C.accent6, margin: 0 } } },
  ],
  slideNumber: { x: W - MX - 0.6, y: 7.08, w: 0.6, h: 0.3, fontSize: 10, color: C.accent6, align: "right" },
});

const shadow = () => ({ type: "outer", color: "000000", opacity: 0.14, blur: 9, offset: 2, angle: 90 });
function newSlide(master, section, trans, anim) {
  slideNo++;
  meta[slideNo] = { trans, anim: !!anim };
  return pres.addSlide({ masterName: master, sectionTitle: section });
}
function nm(order, eff, label) { return `A${order}|${eff}|${label}`; }
function card(s, x, y, w, h, o = {}) {
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: o.r || 0.12, fill: { color: o.fill || C.background1 }, line: { color: o.line || HEX.line, width: 0.75 }, shadow: o.noShadow ? undefined : shadow(), objectName: o.name });
}
function txt(s, t, o) { s.addText(t, Object.assign({ isTextBox: true, margin: 0 }, o)); }
const dot = (s, x, y, d, color, name) => s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 }, objectName: name });
const macroPct = d => { const p = d.p * 4, c = d.c * 4, f = d.f * 9, t = p + c + f; return [p / t, c / t, f / t].map(v => Math.round(v * 100)); };
const TGT = { kcal: 1390, p: 137, f: 77, fib: 23 };
const TIERCOL = { KETO: "6A4C93", MED: "2FAE6E" };
const TIERLONG = { KETO: "KETO", MED: "REFEED" };
const TIERRANGE = { KETO: "≤ 30 g", MED: "~55 g" };
const DTYPE = { STR: "Strength", HIIT: "HIIT", REST: "Rest" };
const PROT = { egg: "Egg", white: "Egg white", seitan: "Seitan", pea: "Pea protein", lentil: "Lentil" };
const mainProt = m => { const k = m.items.map(i => i[0]).find(k => PROT[k] && k !== "white") || m.items.map(i => i[0]).find(k => PROT[k]); return k; };

(async () => {
  const IC = {};
  for (const [k, n, c] of [["check", "FaCheck", "#FFFFFF"], ["warn", "FaExclamationTriangle", "#FFFFFF"], ["x", "FaTimes", "#FFFFFF"], ["drop", "FaTint", "#12393F"], ["clock", "FaClock", "#12393F"],
    ["egg", "FaEgg", "#12393F"], ["carrot", "FaCarrot", "#12393F"], ["box", "FaBoxOpen", "#12393F"], ["scale", "FaWeight", "#12393F"], ["vial", "FaVial", "#12393F"], ["pills", "FaPills", "#12393F"],
    ["dumb", "FaDumbbell", "#12393F"], ["heart", "FaHeartbeat", "#12393F"], ["fire", "FaFire", "#12393F"], ["leaf", "FaLeaf", "#12393F"], ["bull", "FaBullseye", "#12393F"], ["cal", "FaCalendarCheck", "#12393F"],
    ["seed", "FaSeedling", "#12393F"], ["sun", "FaSun", "#12393F"], ["fish", "FaWater", "#12393F"], ["moon", "FaMoon", "#12393F"], ["bolt", "FaBolt", "#12393F"], ["shield", "FaShieldAlt", "#12393F"], ["apple", "FaAppleAlt", "#12393F"], ["ruler", "FaRulerHorizontal", "#12393F"]])
    IC[k] = await icon(n, c);

  const avg = D.avg, mm = D.minmax;
  const split = (() => { const p = avg.p * 4, c = avg.c * 4, f = avg.f * 9, t = p + c + f; return [p, c, f].map(v => Math.round(v / t * 100)); })();
  const START = Date.UTC(2026, 9, 26); // Monday, Oct 26, 2026
  const dateOf = n => new Date(START + (n - 1) * 86400000);
  const dShort = n => dateOf(n).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
  const dLong = n => dateOf(n).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", timeZone: "UTC" });
  const DOW3 = n => ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][dateOf(n).getUTCDay()];
  const eggsOf = d => d.meals.reduce((a, m) => a + m.items.filter(i => i[0] === "egg").reduce((b, i) => b + i[1], 0), 0);
  const nTier = t => D.days.filter(d => d.tier === t).length;

  // ---------- 1. INTRO VIDEO ----------
  pres.addSection({ title: "Intro" });
  {
    const s = newSlide("VIDEO", "Intro", "fade", false);
    if (LITE && !process.env.VIDEO) s.addImage({ path: path.join(INTRO, "poster_1080.jpg"), x: 0, y: 0, w: W, h: H, objectName: "IntroPoster" });
    else s.addMedia({ type: "video", path: path.join(INTRO, "intro_1080p.mp4"), cover: "data:image/jpeg;base64," + fs.readFileSync(path.join(INTRO, "poster_1080.jpg")).toString("base64"), x: 0, y: 0, w: W, h: H, objectName: "IntroVideo" });
    s.addNotes("Motion-graphics intro (9.5 s). Plays automatically and advances on its own; click to skip.");
  }

  // ---------- 2. TITLE ----------
  {
    const s = newSlide("TITLE", "Intro", "fade", true);
    s.addImage({ path: IMG("HERO"), x: 0, y: 0, w: W, h: H, objectName: "HeroBG" });
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.text2, transparency: 35 }, line: { color: C.text2, width: 0 }, objectName: "Shade" });
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: 9.6, h: H, fill: { color: C.text2, transparency: 10 }, line: { color: C.text2, width: 0 }, objectName: "ShadeLeft" });
    txt(s, "PERSONALIZED NUTRITION PLAN  ·  SWAPNA ALLADI", { x: 0.8, y: 1.0, w: 8.5, h: 0.35, fontSize: 14, bold: true, color: C.accent6, charSpacing: 5, objectName: nm(1, "fade", "eyebrow") });
    s.addText("30-Day Thyroid-Smart Keto Reset", { placeholder: "title" });
    txt(s, "High protein  ·  Ketogenic  ·  Vegan + eggs  ·  No soy  ·  No cruciferous vegetables", { x: 0.8, y: 4.0, w: 8.6, h: 0.45, fontSize: 18, color: C.background1, objectName: nm(2, "fade", "sub") });
    const chips = [[fmt(avg.kcal), "KCAL / DAY", C.background1], [avg.p + " g", "PROTEIN", C.accent1], [avg.net + " g", "AVG NET CARBS", C.accent2], [avg.f + " g", "FAT", C.accent4]];
    chips.forEach(([v, l, col], i) => {
      const x = 0.8 + i * 2.2;
      s.addShape(pres.ShapeType.roundRect, { x, y: 5.05, w: 2.0, h: 1.3, rectRadius: 0.12, fill: { color: "FFFFFF", transparency: 88 }, line: { color: "FFFFFF", width: 0.75, transparency: 55 }, objectName: nm(3 + i, "rise", "chipbg" + i) });
      txt(s, v, { x, y: 5.15, w: 2.0, h: 0.7, fontSize: 32, bold: true, color: col, align: "center", valign: "middle", objectName: nm(3 + i, "rise", "chipv" + i) });
      txt(s, l, { x, y: 5.85, w: 2.0, h: 0.3, fontSize: 12, bold: true, color: C.accent6, align: "center", charSpacing: 3, objectName: nm(3 + i, "rise", "chipl" + i) });
    });
    txt(s, `Starts Mon, Oct 26, 2026  ·  30 days  ·  ${D.days.reduce((a, d) => a + d.meals.length, 0)} meals  ·  16:8 on workout days, 19:5 on rest days  ·  Dietitian review draft`, { x: 0.8, y: 6.82, w: 8.6, h: 0.3, fontSize: 11, color: C.accent6, objectName: nm(7, "fade", "foot") });
    s.addNotes(`Overview: a soy-free, ketogenic-centric plan for Swapna (hypothyroid, levothyroxine 50 mcg every morning). Vegan plus eggs, about ${avg.p} g protein a day, net carbs at or under 30 g on keto days with one refeed day a week at about 55 g, no soy and no cruciferous vegetables. Fasting windows: 16:8 on workout days and 19:5 on rest days.`);
  }

  // ---------- 3. SNAPSHOT ----------
  pres.addSection({ title: "Client & strategy" });
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Where Swapna starts, and what changes", { placeholder: "title" });
    const stats = [["145 → 130 lb", "15-lb goal over 12 weeks", "scale"], ["BMI 28.3", "Overweight range at start", "heart"], ["~1,240 kcal", "Basal metabolic rate", "fire"], ["~1,800 kcal", "Maintenance with training (TDEE)", "bull"]];
    stats.forEach(([v, l, ic], i) => {
      const x = MX + (i % 2) * 2.95, y = 1.5 + Math.floor(i / 2) * 1.75;
      card(s, x, y, 2.75, 1.55, { name: nm(1 + i, "rise", "stat" + i) });
      s.addImage({ data: IC[ic], x: x + 0.2, y: y + 0.2, w: 0.38, h: 0.38, objectName: nm(1 + i, "rise", "static" + i) });
      txt(s, v, { x: x + 0.2, y: y + 0.65, w: 2.45, h: 0.5, fontSize: 22, bold: true, color: C.text2, objectName: nm(1 + i, "rise", "statv" + i) });
      txt(s, l, { x: x + 0.2, y: y + 1.12, w: 2.45, h: 0.3, fontSize: 12, color: C.accent5, objectName: nm(1 + i, "rise", "statl" + i) });
    });
    card(s, MX, 5.1, 5.7, 1.65, { fill: C.background2, noShadow: true, name: nm(5, "rise", "prefbg") });
    txt(s, [
      { text: "Female  ·  42  ·  5'0\"  ·  145 lb  ·  Hypothyroid", options: { bold: true, breakLine: true } },
      { text: "Levothyroxine 50 mcg every morning  ·  No soy  ·  No crucifers", options: { breakLine: true } },
      { text: "Vegan + eggs in moderation  ·  Strength 3×, HIIT 2× a week", options: { breakLine: true } },
      { text: "Focus: belly fat, toning, strength  ·  16:8 and 19:5 windows" },
    ], { x: MX + 0.25, y: 5.18, w: 5.25, h: 1.5, fontSize: 13.5, color: C.text1, valign: "middle", paraSpaceAfter: 3, objectName: nm(5, "rise", "preftxt") });
    const hd = (t, col) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: col }, valign: "middle", fontSize: 13 } });
    const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 12, color: HEX.dk1, valign: "middle" }, o) });
    const rows = [
      [hd("Metric", HEX.dk2), hd("Previous plan", HEX.mute), hd("This keto plan", "2FAE6E")],
      ["Calories", "1,400 target (menus ~1,190)", fmt(avg.kcal) + " kcal"],
      ["Protein", "130–140 g target (menus ~77 g)", `${avg.p} g  (≈ 2.2 g/kg)`],
      ["Carbohydrate", "70–90 g", `${avg.net} g net avg (keto ≤ 30, refeed ~55)`],
      ["Fat", "55–65 g", `${avg.f} g`],
      ["Soy / dairy", "Greek yogurt, paneer, whey, ghee", "No soy, no dairy: vegan + eggs"],
      ["Eggs", "Up to 4 in one meal", "≤ 2 a day, ≤ 8 a week"],
      ["Window", "12–8 PM (16:8)", "16:8 workout days, 19:5 rest days"],
      ["Goal", "145 → 120 lb in 24 weeks", "145 → 130 lb in 12 weeks"],
    ].map((r, i) => i === 0 ? r : [cell(r[0], { bold: true }), cell(r[1], { color: HEX.mute }), cell(r[2], { bold: true, color: HEX.dk2 })]);
    s.addTable(rows, { x: 6.85, y: 1.5, w: 5.88, colW: [1.3, 2.3, 2.28], rowH: [0.46, 0.56, 0.56, 0.52, 0.46, 0.66, 0.5, 0.5, 0.56], border: { type: "solid", pt: 0.5, color: HEX.line }, fill: { color: "FFFFFF" }, margin: [0.04, 0.1, 0.04, 0.1], objectName: nm(6, "fade", "compare") });
    s.addNotes("Previous-plan values come from Swapna's earlier deck (and the first draft that included soy, now removed). Its stated targets were 1,400 kcal and 130–140 g protein, but the 7-day sample menu averaged about 1,190 kcal and 77 g protein, and used Greek yogurt, paneer, cottage cheese, whey and ghee. BMR uses Mifflin-St Jeor for a 42-year-old woman at 152 cm and 65.8 kg; TDEE assumes 3 strength and 2 HIIT sessions a week. At about 1,344 kcal the deficit is about 450 kcal a day, roughly 0.9–1.25 lb a week, which puts 12–15 lb in reach over 12 weeks.");
  }

  // ---------- 4. TARGETS ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "fade", true);
    s.addText("Daily targets: high protein, ketogenic carbs, moderate fat", { placeholder: "title" });
    s.addChart(pres.charts.DOUGHNUT, [{ name: "Macros", labels: ["Protein", "Carbs", "Fat"], values: [avg.p * 4, avg.c * 4, avg.f * 9] }],
      { x: MX, y: 1.45, w: 4.9, h: 4.9, holeSize: 66, chartColors: [HEX.P, HEX.C, HEX.F], showLegend: false, showLabel: false, showValue: false, showPercent: false, dataBorder: { pt: 3, color: "FFFFFF" }, objectName: nm(1, "wheel", "ring") });
    txt(s, fmt(avg.kcal), { x: MX, y: 3.45, w: 4.9, h: 0.75, fontSize: 44, bold: true, color: C.text2, align: "center", valign: "middle", objectName: nm(2, "fade", "ringkcal") });
    txt(s, "KCAL / DAY", { x: MX, y: 4.15, w: 4.9, h: 0.3, fontSize: 12, bold: true, color: C.accent5, align: "center", charSpacing: 4, objectName: nm(2, "fade", "ringlbl") });
    [["Protein", split[0], C.accent1], ["Carbs", split[1], C.accent2], ["Fat", split[2], C.accent4]].forEach(([l, p, col], i) => {
      const x = MX + 0.35 + i * 1.55;
      dot(s, x, 6.5, 0.16, col, nm(3, "fade", "lgd" + i));
      txt(s, `${l} ${p}%`, { x: x + 0.24, y: 6.41, w: 1.3, h: 0.34, fontSize: 13, bold: true, color: C.text1, valign: "middle", objectName: nm(3, "fade", "lgt" + i) });
    });
    const cards = [
      [fmt(avg.kcal), "Calories", `Range ${fmt(mm.kmin)}–${fmt(mm.kmax)} across 30 days`, null],
      [avg.p + " g", "Protein", `${mm.pmin}–${mm.pmax} g/day  ·  ≈ ${(avg.p / 65.8).toFixed(1)} g/kg`, C.accent1],
      [avg.net + " g net", "Carbohydrate", `${mm.nmin}–${mm.nmax} g net/day  ·  ketogenic`, C.accent2],
      [avg.f + " g", "Fat", `${split[2]}% of calories, olive oil, avocado, coconut, nuts`, C.accent4],
      [avg.fib + " g", "Fiber", "Vegetables, chia, flax, hemp, seeds, berries", null],
      ["2.5–3 L", "Water", "Levothyroxine taken with water only", null],
    ];
    cards.forEach(([v, l, sub, col], i) => {
      const x = 6.0 + (i % 2) * 3.45, y = 1.45 + Math.floor(i / 2) * 1.68;
      card(s, x, y, 3.25, 1.5, { name: nm(4 + i, "rise", "tc" + i) });
      if (col) dot(s, x + 0.22, y + 0.24, 0.2, col, nm(4 + i, "rise", "tcd" + i));
      txt(s, l.toUpperCase(), { x: x + (col ? 0.52 : 0.22), y: y + 0.17, w: 2.6, h: 0.3, fontSize: 11, bold: true, color: C.accent5, charSpacing: 3, valign: "middle", objectName: nm(4 + i, "rise", "tcl" + i) });
      txt(s, v, { x: x + 0.22, y: y + 0.5, w: 2.8, h: 0.55, fontSize: 30, bold: true, color: C.text2, valign: "middle", objectName: nm(4 + i, "rise", "tcv" + i) });
      txt(s, sub, { x: x + 0.22, y: y + 1.05, w: 2.85, h: 0.35, fontSize: 11.5, color: C.accent5, valign: "top", objectName: nm(4 + i, "rise", "tcs" + i) });
    });
    s.addNotes(`Protein is about ${(avg.p / 65.8).toFixed(1)} g per kg at 65.8 kg, to protect muscle during the deficit. Carbohydrate is counted as net carbs (total minus fiber): 30 g or less on keto days and about 55 g on the weekly refeed day. At this much protein ketone levels are usually modest (nutritional ketosis); that is intended.`);
  }

  // ---------- 5. FOOD RULES ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Soy-free, thyroid-smart keto rules: vegan + eggs, no crucifers", { placeholder: "title" });
    const cols = [
      { h: "EAT", sub: "Every-day staples", col: C.accent1, ic: "check", items: ["Egg whites, whole eggs, seitan, pea protein, nutritional yeast, hemp and pumpkin seeds", "Spinach (wilted), zucchini, mushrooms, asparagus, cucumber, celery, romaine, tomato, a little bell pepper", "Olive oil, avocado, coconut milk and oil, olives, macadamias, walnuts, almonds, chia, flax, tahini", "Saturday refeed only: quinoa, sweet potato, berries, apple, orange, banana, a few lentils"] },
      { h: "LIMIT", sub: "Used with caps", col: C.accent2, ic: "warn", items: ["Net carbs: ≤ 30 g on keto days, ~55 g on the Saturday refeed", "Whole eggs: ≤ 2 a day and ≤ 8 a week (whites are not counted)", "Seitan ≤ 8 oz a day: it is wheat gluten, so skip it if she is gluten-sensitive", "Pea protein ≤ 3 scoops a day, ≤ 2 in one meal", "Bell peppers and green beans: about ½ cup at a time"] },
      { h: "NOT USED", sub: "In no meal", col: C.accent3, ic: "x", items: ["Soy in any form: tofu, tempeh, edamame, soy milk, miso, soy sauce, tamari, TVP, soy protein and soy lecithin. Read labels", "Cruciferous: broccoli, cauliflower, cabbage, kale, Brussels sprouts, bok choy, collards, arugula, radish, turnip", "Peanuts and millet; dairy, meat, poultry and fish", "Added sugars, kelp and iodine supplements"] },
    ];
    cols.forEach((c, i) => {
      const x = MX + i * 4.1, w = 3.93, y = 1.45, h = 5.05;
      card(s, x, y, w, h, { name: nm(1 + i, "rise", "uc" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: y + 0.25, w: 0.6, h: 0.6, fill: { color: c.col }, line: { color: c.col, width: 0 }, objectName: nm(1 + i, "rise", "ucc" + i) });
      s.addImage({ data: IC[c.ic], x: x + 0.38, y: y + 0.38, w: 0.34, h: 0.34, objectName: nm(1 + i, "rise", "uci" + i) });
      txt(s, c.h, { x: x + 1.0, y: y + 0.2, w: 2.7, h: 0.4, fontSize: 22, bold: true, color: C.text2, valign: "middle", objectName: nm(1 + i, "rise", "uch" + i) });
      txt(s, c.sub, { x: x + 1.0, y: y + 0.58, w: 2.7, h: 0.3, fontSize: 12, color: C.accent5, valign: "middle", objectName: nm(1 + i, "rise", "ucs" + i) });
      txt(s, c.items.map((t, j) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < c.items.length - 1 } })), { x: x + 0.25, y: y + 1.1, w: w - 0.5, h: h - 1.25, fontSize: 13, color: C.text1, valign: "top", paraSpaceAfter: 6, objectName: nm(1 + i, "rise", "uct" + i) });
    });
    txt(s, "Soy and cruciferous vegetables are fully excluded: Swapna must avoid both with her hypothyroidism. No meal, recipe or swap in this plan uses them.", { x: MX, y: 6.62, w: W - 2 * MX, h: 0.4, fontSize: 11, italic: true, color: C.accent5, objectName: nm(4, "fade", "ucfoot") });
    s.addNotes("Swapna takes levothyroxine 50 mcg every morning. After the first draft she confirmed she must avoid cruciferous vegetables (cabbage, broccoli, cauliflower, Brussels sprouts and relatives) and soy; none of either appears in any of the 30 days. Read labels on pea protein, seitan and any packaged food for soy and soy lecithin. Peanuts and millet are also left out as mild goitrogens. Kelp and iodine supplements are avoided: iodine comes from iodized salt and eggs, and too much can upset thyroid control.");
  }

  // ---------- 6. PROTEIN SOURCES ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "fade", true);
    s.addText(`Where ${avg.p} g of daily protein comes from`, { placeholder: "title" });
    const ps = Object.entries(D.protein_by_source).filter(p => p[1] > 0 && p[0] !== "Vegetables").sort((a, b) => b[1] - a[1]);
    s.addChart(pres.charts.BAR, [{ name: "Avg grams per day", labels: ps.map(p => p[0]), values: ps.map(p => p[1]) }], {
      x: MX, y: 1.45, w: 6.3, h: 3.6, barDir: "bar", chartColors: [HEX.P], showLegend: false, showTitle: true, title: "Average protein per day (g), by source", titleFontSize: 14, titleColor: HEX.dk2, titleFontFace: "+mn-lt",
      showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0",
      catAxisLabelFontSize: 11.5, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin", valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, barGapWidthPct: 40, objectName: nm(1, "wipe", "bars"),
    });
    const big = [["3 / 2", "meals a day: workout / rest days"], ["≤ 2", "whole eggs a day, ≤ 8 a week"], ["0", "soy, in any form, ever"]];
    big.forEach(([v, l], i) => {
      const x = MX + i * 2.15;
      card(s, x, 5.2, 2.0, 1.55, { fill: C.background2, noShadow: true, name: nm(2 + i, "rise", "big" + i) });
      txt(s, v, { x, y: 5.3, w: 2.0, h: 0.65, fontSize: 34, bold: true, color: C.text2, align: "center", valign: "middle", objectName: nm(2 + i, "rise", "bigv" + i) });
      txt(s, l, { x: x + 0.15, y: 5.95, w: 1.7, h: 0.7, fontSize: 11.5, color: C.text1, align: "center", valign: "top", objectName: nm(2 + i, "rise", "bigl" + i) });
    });
    const tiers = [
      ["TIER 1 · EVERY DAY", "Egg whites · seitan (≤ 8 oz a day) · pea protein (≤ 3 scoops, in a meal) · nutritional yeast", C.accent1],
      ["TIER 2 · CAPPED", "Whole eggs ≤ 2/day, ≤ 8/week · hemp and pumpkin seeds, almonds and walnuts are measured", C.accent2],
      ["REFEED DAY ONLY", "Lentils (¼ cup) with quinoa, sweet potato and fruit. Too many carbs for a keto day", C.accent4],
      ["NOT USED", "Soy in any form · dairy · meat, poultry, fish · peanuts · mock meats", C.accent3],
    ];
    tiers.forEach(([h, t, col], i) => {
      const y = 1.5 + i * 1.33;
      card(s, 7.2, y, 5.53, 1.2, { name: nm(5 + i, "rise", "tier" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: 7.4, y: y + 0.3, w: 0.6, h: 0.6, fill: { color: col }, line: { color: col, width: 0 }, objectName: nm(5 + i, "rise", "tierd" + i) });
      txt(s, i === 3 ? "✕" : String(i + 1), { x: 7.4, y: y + 0.3, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: C.text2, align: "center", valign: "middle", objectName: nm(5 + i, "rise", "tiern" + i) });
      txt(s, h, { x: 8.2, y: y + 0.13, w: 4.4, h: 0.3, fontSize: 12, bold: true, color: C.text2, charSpacing: 2, valign: "middle", objectName: nm(5 + i, "rise", "tierh" + i) });
      txt(s, t, { x: 8.2, y: y + 0.44, w: 4.4, h: 0.68, fontSize: 12, color: C.text1, valign: "top", objectName: nm(5 + i, "rise", "tiert" + i) });
    });
    s.addNotes(`Grams by source are averaged over all 30 days from ingredient-level math. Egg whites and pea protein carry a large share because, without soy and without beans on keto days, they are the leanest ways to reach about ${avg.p} g a day at ${fmt(avg.kcal)} kcal and 30 g net carbs; the plan caps pea protein at 3 scoops a day and whole eggs at 2 a day.`);
  }

  // ---------- 7. SUPPLEMENTS ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Supplements: hypothyroid support, adapted for a vegan diet", { placeholder: "title" });
    const sup = [
      ["shield", "Selenium", "200 mcg", "Daily", "Helps convert T4 to active T3. Do not exceed 400 mcg from all sources."],
      ["sun", "Vitamin D3 (lichen)", "2,000 IU", "Daily, with a fat-containing meal", "Immune and bone support. Vegan D3 comes from lichen."],
      ["fish", "Omega-3 (algae)", "2 g EPA + DHA", "Daily", "Algae oil replaces fish oil. Lowers inflammation."],
      ["moon", "Magnesium glycinate", "300–400 mg", "Nightly", "Sleep, stress and muscle recovery."],
      ["vial", "Iron + vitamin C", "18 mg", "Only if labs are low", "Take 4 hours away from levothyroxine."],
      ["leaf", "Zinc", "15 mg", "Daily, with food", "Supports thyroid hormone production. Pumpkin seeds help too."],
      ["bolt", "B-complex (methylated)", "1 serving", "With your first meal", "Must include B12. Pause biotin 3–5 days before blood draws."],
    ];
    sup.forEach(([ic, n, dose, when, why], i) => {
      const col = i % 4, row = Math.floor(i / 4), w = 2.92, h = 2.28;
      const x = MX + col * (w + 0.12), y = 1.35 + row * (h + 0.14);
      card(s, x, y, w, h, { name: nm(1 + i, "rise", "sp" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.2, y: y + 0.2, w: 0.56, h: 0.56, fill: { color: C.accent6 }, line: { color: C.accent6, width: 0 }, objectName: nm(1 + i, "rise", "spc" + i) });
      s.addImage({ data: IC[ic], x: x + 0.33, y: y + 0.33, w: 0.3, h: 0.3, objectName: nm(1 + i, "rise", "spi" + i) });
      txt(s, n, { x: x + 0.9, y: y + 0.17, w: w - 1.0, h: 0.62, fontSize: 13.5, bold: true, color: C.text2, valign: "middle", objectName: nm(1 + i, "rise", "spn" + i) });
      txt(s, dose, { x: x + 0.2, y: y + 0.88, w: w - 0.4, h: 0.42, fontSize: 21, bold: true, color: C.text2, valign: "middle", objectName: nm(1 + i, "rise", "spd" + i) });
      txt(s, when.toUpperCase(), { x: x + 0.2, y: y + 1.3, w: w - 0.4, h: 0.26, fontSize: 9.5, bold: true, color: C.accent1, charSpacing: 1, valign: "middle", objectName: nm(1 + i, "rise", "spw" + i) });
      txt(s, why, { x: x + 0.2, y: y + 1.58, w: w - 0.4, h: 0.62, fontSize: 11, color: C.text1, valign: "top", objectName: nm(1 + i, "rise", "spy" + i) });
    });
    const x = MX + 3 * 3.04, y = 1.35 + 2.42, w = 2.92, h = 2.28;
    s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12, fill: { color: C.text2 }, line: { color: C.text2, width: 0 }, shadow: shadow(), objectName: nm(8, "rise", "timebg") });
    txt(s, [
      { text: "TIMING RULES", options: { bold: true, fontSize: 12, color: C.accent6, charSpacing: 3, breakLine: true } },
      { text: "On waking: ", options: { bold: true, fontSize: 12, color: "FFFFFF" } }, { text: "levothyroxine 50 mcg with water only, then wait 30–60 min before food or coffee.", options: { fontSize: 12, color: "FFFFFF", breakLine: true } },
      { text: "4-hour gap: ", options: { bold: true, fontSize: 12, color: "FFFFFF" } }, { text: "keep iron, calcium, magnesium and fiber supplements 4 h from the dose.", options: { fontSize: 12, color: "FFFFFF" } },
    ], { x: x + 0.22, y: y + 0.15, w: w - 0.4, h: h - 0.3, valign: "top", paraSpaceAfter: 6, objectName: nm(8, "rise", "timetx") });
    s.addNotes("Supplement list and doses carried over from Swapna's earlier plan, with vegan sources: lichen D3, algae omega-3, and a B-complex that includes B12. Iron only if ferritin or iron studies are low. Confirm doses with her physician, especially selenium if she already takes a multivitamin.");
  }

  // ---------- 8. CHANGES ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "wipe", true);
    s.addText("What changed from the previous plan, and why", { placeholder: "title" });
    const hd = (t, col) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: col }, valign: "middle", fontSize: 13 } });
    const c1 = t => ({ text: t, options: { fontSize: 12.5, color: HEX.red, valign: "middle", bold: true } });
    const c2 = t => ({ text: t, options: { fontSize: 12.5, color: HEX.dk1, valign: "middle" } });
    const c3 = t => ({ text: t, options: { fontSize: 12.5, color: HEX.dk2, valign: "middle", bold: true } });
    const rows = [
      [hd("Earlier plans", HEX.dk2), hd("Why it changes", HEX.dk2), hd("Now", "2FAE6E")],
      [c1("Greek yogurt and cottage cheese bowls, paneer"), c2("Dairy: she is vegan apart from eggs"), c3("Coconut chia pudding, berry hemp bowl, egg-white plates")],
      [c1("Tofu scrambles, tofu and tempeh bowls (first draft)"), c2("Soy removed entirely: she must avoid it"), c3("Seitan, egg-white, pea-protein and seed-based meals")],
      [c1("Whey isolate; ghee in curries"), c2("Dairy-based"), c3("Pea protein (≤ 3 scoops a day); olive oil, avocado, coconut milk")],
      [c1("70–90 g carbs, carb-cycled"), c2("Keto for fat loss with a slow thyroid"), c3("≤ 30 g net on keto days; one ~55 g net refeed on Saturday")],
      [c1("12–8 PM, three meals every day"), c2("Fasting windows follow training"), c3("16:8 on workout days (3 meals), 19:5 on rest days (2 meals)")],
      [c1("Menus averaging ~77 g protein"), c2("Far below the 130–140 g target"), c3(`${avg.p} g average, ${mm.pmin} g minimum`)],
      [c1("Menus averaging ~1,190 kcal"), c2("Too low with 5 training sessions; slows a sluggish thyroid further"), c3(`${fmt(avg.kcal)} kcal average`)],
      [c1("Raw spinach by the cup"), c2("Cooking softens goitrogens and oxalates"), c3("Spinach wilted in the pan (measured raw)")],
    ];
    s.addTable(rows, { x: MX, y: 1.5, w: W - 2 * MX, colW: [3.9, 4.2, 4.03], rowH: [0.45, 0.56, 0.56, 0.52, 0.52, 0.56, 0.56, 0.66, 0.56], border: { type: "solid", pt: 0.5, color: HEX.line }, fill: { color: "FFFFFF" }, margin: [0.04, 0.14, 0.04, 0.14], objectName: nm(1, "fade", "chg") });
    s.addNotes("Every substitution traces to her diet (vegan plus eggs), her thyroid and levothyroxine, the no-soy and no-crucifer rules she confirmed, or the protein and calorie targets her earlier plan set but its menus did not reach.");
  }

  // ---------- 9. RHYTHM ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Daily rhythm: two eating windows, by day type", { placeholder: "title" });
    const bands = [
      { key: "W", y: 1.28, col: TIERCOL.KETO, title: "WORKOUT DAYS  ·  Mon, Tue, Thu, Fri, Sat  ·  16:8  ·  eat 12–8 PM", slots: [["MEAL 1 · BREAK-FAST", "12:00 PM", "B1", "After training: eggs, whites or a protein bowl"], ["MEAL 2 · POWER LUNCH", "3:30 PM", "L1", "The biggest protein meal, with vegetables"], ["MEAL 3 · LAST CALL", "7:30 PM", "D2", "Done by 8 PM: protein-forward and light"]] },
      { key: "R", y: 4.0, col: C.accent4, title: "REST DAYS  ·  Wed, Sun  ·  19:5  ·  eat 3–8 PM", slots: [["MEAL 1 · FAST-BREAKER", "3:00 PM", "L2", "Protein and fat, gentle after a 19-hour fast"], ["MEAL 2 · LAST CALL", "7:00 PM", "D7", "Done an hour before the window closes"]] },
    ];
    bands.forEach((b, bi) => {
      s.addShape(pres.ShapeType.roundRect, { x: MX, y: b.y, w: 8.34, h: 0.3, rectRadius: 0.06, fill: { color: b.col }, line: { color: b.col, width: 0 }, objectName: nm(1 + bi * 3, "rise", "bh" + bi) });
      txt(s, b.title, { x: MX + 0.12, y: b.y, w: 8.1, h: 0.3, fontSize: 11, bold: true, color: "FFFFFF", valign: "middle", charSpacing: 1, objectName: nm(1 + bi * 3, "rise", "bht" + bi) });
      b.slots.forEach(([name, time, img, note], i) => {
        const x = MX + i * 2.83, y = b.y + 0.38, w = 2.68, h = 2.25, a = D.slot_avg[b.key][String(i)], o = 2 + bi * 3 + i;
        card(s, x, y, w, h, { name: nm(o, "rise", `rh${bi}${i}`) });
        s.addImage({ path: STRIP(img), x: x + 0.08, y: y + 0.08, w: w - 0.16, h: (w - 0.16) / 2.9, objectName: nm(o, "rise", `rhimg${bi}${i}`) });
        txt(s, `${name}  ·  ${time}`, { x: x + 0.14, y: y + 0.94, w: w - 0.24, h: 0.22, fontSize: 9, bold: true, color: C.accent5, valign: "middle", objectName: nm(o, "rise", `rht${bi}${i}`) });
        txt(s, `${a[0]} kcal avg`, { x: x + 0.14, y: y + 1.14, w: 1.5, h: 0.4, fontSize: 16, bold: true, color: C.text2, valign: "middle", objectName: nm(o, "rise", `rhk${bi}${i}`) });
        [["P", a[1], HEX.P], ["N", a[4], HEX.C], ["F", a[3], HEX.F]].forEach(([l, v, col], j) => {
          const cx = x + 1.5 + j * 0.37;
          s.addShape(pres.ShapeType.roundRect, { x: cx, y: y + 1.18, w: 0.34, h: 0.32, rectRadius: 0.06, fill: { color: col, transparency: 62 }, line: { color: col, width: 0 }, objectName: nm(o, "rise", `rhc${bi}${i}${j}`) });
          txt(s, `${v}${l}`, { x: cx, y: y + 1.18, w: 0.34, h: 0.32, fontSize: 8, bold: true, color: C.text1, align: "center", valign: "middle", objectName: nm(o, "rise", `rhct${bi}${i}${j}`) });
        });
        txt(s, note, { x: x + 0.14, y: y + 1.56, w: w - 0.26, h: 0.62, fontSize: 10.5, color: C.text1, valign: "top", objectName: nm(o, "rise", `rhn${bi}${i}`) });
      });
    });
    const habits = [["pills", "On waking: levothyroxine 50 mcg with water only; coffee and food 30–60 min later"], ["drop", "2.5–3 L water; salt to taste (iodized) and electrolytes for the first two weeks"], ["dumb", "Strength Mon, Thu, Sat; HIIT Tue, Fri. On workout days train, then break the fast"], ["cal", "Weigh once a week, fasted, same day; track the 7-day average"]];
    habits.forEach(([ic, t], i) => {
      const y = 1.4 + i * 1.38;
      card(s, 9.2, y, 3.53, 1.25, { fill: C.background2, noShadow: true, name: nm(8 + i, "rise", "hb" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: 9.38, y: y + 0.36, w: 0.52, h: 0.52, fill: { color: C.accent6 }, line: { color: C.accent6, width: 0 }, objectName: nm(8 + i, "rise", "hbi" + i) });
      s.addImage({ data: IC[ic], x: 9.51, y: y + 0.49, w: 0.26, h: 0.26, objectName: nm(8 + i, "rise", "hbii" + i) });
      txt(s, t, { x: 10.05, y: y + 0.08, w: 2.55, h: 1.09, fontSize: 12, color: C.text1, valign: "middle", objectName: nm(8 + i, "rise", "hbt" + i) });
    });
    txt(s, "Chips: P protein, N net carbs, F fat (grams, averaged over the plan). Rest-day meals are larger because the same protein fits into two meals.", { x: MX, y: 6.68, w: 8.4, h: 0.3, fontSize: 10, italic: true, color: C.accent5, objectName: nm(12, "fade", "rhfoot") });
    s.addNotes("Levothyroxine on waking (about 6–7 AM) leaves at least 5 hours before the first meal on either schedule. Train before Meal 1 on workout days; if training is later, shift the window by up to an hour rather than eating before the session. Rest-day meals are larger because the same daily protein is split across two meals. Stop a fast and eat if she is dizzy, shaky or has a racing heart.");
  }

  // ---------- 10. CARB CYCLE ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Keto with one refeed: the weekly pattern", { placeholder: "title" });
    const pattern = ["KETO", "KETO", "KETO", "KETO", "KETO", "MED", "KETO"], dn = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    const wt = ["STRENGTH", "HIIT", "REST", "STRENGTH", "HIIT", "STRENGTH", "REST"], fastW = ["16:8", "16:8", "19:5", "16:8", "16:8", "16:8", "19:5"];
    pattern.forEach((t, i) => {
      const x = MX + i * 1.76, w = 1.64;
      s.addShape(pres.ShapeType.roundRect, { x, y: 1.45, w, h: 1.55, rectRadius: 0.1, fill: { color: TIERCOL[t] }, line: { color: TIERCOL[t], width: 0 }, shadow: shadow(), objectName: nm(1 + i, "rise", "cy" + i) });
      txt(s, [{ text: dn[i], options: { bold: true, fontSize: 12, color: "FFFFFF", charSpacing: 2, breakLine: true } }, { text: TIERRANGE[t], options: { bold: true, fontSize: 23, color: "FFFFFF", breakLine: true } }, { text: TIERLONG[t] + "  ·  NET CARBS", options: { fontSize: 9, color: "FFFFFF", bold: true, breakLine: true } }, { text: `${wt[i]}  ·  ${fastW[i]}`, options: { fontSize: 9.5, color: "FFFFFF" } }], { x, y: 1.5, w, h: 1.45, align: "center", valign: "middle", objectName: nm(1 + i, "rise", "cyt" + i) });
    });
    const tiers = [
      [TIERCOL.KETO, "KETO DAY", `≤ 30 g net  ·  ${nTier("KETO")} of 30 days`, "Egg whites and eggs, seitan, pea protein, low-carb vegetables, avocado, coconut, nuts and seeds. About 50 g total carbs with 20–25 g of fiber.", "L4"],
      [TIERCOL.MED, "REFEED DAY", `~55 g net  ·  ${nTier("MED")} of 30 days`, "Saturday, the third strength session. The same base plus quinoa, sweet potato, berries or fruit at the later meals.", "D5"],
      [C.accent4, "FASTING WINDOWS", "Workout 16:8  ·  Rest 19:5", "Workout days: eat 12–8 PM, three meals. Rest days: eat 3–8 PM, two meals. Levothyroxine on waking; coffee and food 30–60 minutes later.", "B7"],
    ];
    tiers.forEach(([col, lab, h, d, photo], i) => {
      const x = MX + i * 4.1, y = 3.3, w = 3.93, hh = 3.25;
      card(s, x, y, w, hh, { name: nm(8 + i, "rise", "ct" + i) });
      s.addImage({ path: STRIP(photo), x: x + 0.1, y: y + 0.1, w: w - 0.2, h: (w - 0.2) / 2.9, objectName: nm(8 + i, "rise", "ctp" + i) });
      s.addShape(pres.ShapeType.rect, { x: x + 0.1, y: y + 0.1, w: 0.1, h: (w - 0.2) / 2.9, fill: { color: col }, line: { color: col, width: 0 }, objectName: nm(8 + i, "rise", "ctb" + i) });
      txt(s, [{ text: lab, options: { bold: true, fontSize: 13, color: col, breakLine: true } }, { text: h, options: { bold: true, fontSize: 12, color: C.text2, breakLine: true } }, { text: d, options: { fontSize: 11.5, color: C.text1 } }], { x: x + 0.22, y: y + 1.5, w: w - 0.4, h: 1.65, valign: "top", paraSpaceAfter: 3, objectName: nm(8 + i, "rise", "ctt" + i) });
    });
    txt(s, `Protein stays at ${mm.pmin} g or more and calories at ${fmt(mm.kmin)}–${fmt(mm.kmax)} every day. Average net carbs are about ${avg.net} g a day (${avg.c} g total with ${avg.fib} g of fiber).`, { x: MX, y: 6.65, w: W - 2 * MX, h: 0.35, fontSize: 11, italic: true, color: C.accent5, objectName: nm(11, "fade", "cyfoot") });
    s.addNotes("The pattern repeats each week from Monday, Oct 26. Very low carbohydrate intake can lower T3 conversion in some people, so one planned refeed lands on a strength day. If her hardest session is another day, swap Saturday with that day. If she feels colder, more tired or loses hair, add a second refeed day and tell the physician.");
  }

  // ---------- calendar helpers ----------
  const CX0 = 0.45, CW = 1.72, CG = 0.062;
  const colX = i => CX0 + i * (CW + CG);
  function bar3(s, x, y, w, h, d, order, label) {
    const t = d.p * 4 + d.c * 4 + d.f * 9; let cx = x;
    [[d.p * 4, C.accent1], [d.c * 4, C.accent2], [d.f * 9, C.accent4]].forEach(([v, col], j) => {
      const ww = w * v / t;
      s.addShape(pres.ShapeType.rect, { x: cx, y, w: ww, h, fill: { color: col }, line: { color: col, width: 0 }, objectName: nm(order, "rise", `${label}b${j}`) });
      cx += ww;
    });
  }
  const tagOf = d => [...new Set(d.meals.map(m => PROT[mainProt(m)]).filter(Boolean))].join(" · ");

  function monthCalendar() {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Month at a glance: 30 days, every day's macros", { placeholder: "title" });
    ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"].forEach((n, i) => {
      s.addShape(pres.ShapeType.rect, { x: colX(i), y: 1.22, w: CW, h: 0.36, fill: { color: C.text2 }, line: { color: C.text2, width: 0 }, objectName: nm(1, "fade", "mh" + i) });
      txt(s, n, { x: colX(i), y: 1.22, w: CW, h: 0.36, fontSize: 12, bold: true, color: C.background1, align: "center", valign: "middle", objectName: nm(1, "fade", "mht" + i) });
    });
    D.days.forEach(d => {
      const r = Math.floor((d.day - 1) / 7), c = (d.day - 1) % 7, x = colX(c), y = 1.64 + r * 1.02, o = 2 + r, lab = "mc" + d.day;
      s.addShape(pres.ShapeType.roundRect, { x, y, w: CW, h: 0.98, rectRadius: 0.05, fill: { color: C.background1 }, line: { color: HEX.line, width: 0.75 }, objectName: nm(o, "rise", lab) });
      s.addShape(pres.ShapeType.rect, { x, y: y + 0.08, w: 0.06, h: 0.82, fill: { color: TIERCOL[d.tier] }, line: { color: TIERCOL[d.tier], width: 0 }, objectName: nm(o, "rise", lab + "k") });
      txt(s, [
        { text: `${dShort(d.day)}  ·  Day ${d.day}`, options: { bold: true, fontSize: 10, color: C.accent5, breakLine: true } },
        { text: `${fmt(d.kcal)} kcal`, options: { bold: true, fontSize: 15, color: C.text2, breakLine: true } },
        { text: `P${d.p}  ·  N${d.net}  ·  F${d.f}`, options: { fontSize: 10, color: C.text1, breakLine: true } },
        { text: tagOf(d), options: { fontSize: 9, color: TIERCOL[d.tier], bold: true } },
      ], { x: x + 0.14, y: y + 0.04, w: CW - 0.2, h: 0.8, valign: "top", objectName: nm(o, "rise", lab + "t") });
      bar3(s, x + 0.14, y + 0.86, CW - 0.22, 0.07, d, o, lab);
    });
    const cx = colX(2), cw = colX(6) + CW - cx, cy = 1.64 + 4 * 1.02;
    s.addShape(pres.ShapeType.roundRect, { x: cx, y: cy, w: cw, h: 0.98, rectRadius: 0.05, fill: { color: C.background2 }, line: { color: C.accent6, width: 0.75 }, objectName: nm(6, "rise", "mend") });
    txt(s, [{ text: "Day 31 onward  ", options: { bold: true, color: C.text2 } }, { text: "Re-assess at the day-30 check-in (weight trend, waist, energy, labs with her physician), then repeat Weeks 1–4 or adjust by ±100 kcal.", options: { color: C.text1 } }], { x: cx + 0.2, y: cy, w: cw - 0.4, h: 0.98, fontSize: 12.5, valign: "middle", objectName: nm(6, "rise", "mendt") });
    txt(s, [{ text: "Start: ", options: { bold: true } }, { text: `${dLong(1)}, 2026 (Day 1)  ·  4 full weeks end ${dLong(28)}  ·  Days 29–30 (${dShort(29)}–${dShort(30)}) complete the 30 days      ` }, { text: "Edge colour: ", options: { bold: true } }, { text: "purple keto · green refeed" }], { x: 0.45, y: 6.78, w: 12.43, h: 0.26, fontSize: 10, color: C.accent5, valign: "middle", objectName: nm(7, "fade", "mfoot") });
    s.addNotes("30 of 30 days planned. Day 1 is Monday, October 26, 2026. P protein, N net carbs, F fat in grams.");
  }

  function weekCalendar(wk, days, sec) {
    const s = newSlide("CONTENT", sec, "push", true);
    const f = days[0].day, l = days[days.length - 1].day;
    s.addText(`Week ${wk.week} calendar  ·  ${dShort(f)} – ${dShort(l)}`, { placeholder: "title" });
    days.forEach((d, i) => {
      const x = colX(i), o = i + 1, lab = "w" + d.day;
      s.addShape(pres.ShapeType.rect, { x, y: 1.2, w: CW, h: 0.54, fill: { color: TIERCOL[d.tier] }, line: { color: TIERCOL[d.tier], width: 0 }, objectName: nm(o, "rise", lab + "h") });
      txt(s, [{ text: `${DOW3(d.day)}  ·  ${DTYPE[d.dtype].toUpperCase()}`, options: { bold: true, fontSize: 12.5, color: C.background1, breakLine: true } }, { text: `Day ${d.day}  ·  ${dShort(d.day)}  ·  ${d.fast}`, options: { fontSize: 9.5, color: "FFFFFF" } }], { x, y: 1.2, w: CW, h: 0.54, align: "center", valign: "middle", objectName: nm(o, "rise", lab + "ht") });
      d.meals.forEach((m, j) => {
        const y = 1.8 + j * 1.25, h = 1.19;
        s.addShape(pres.ShapeType.roundRect, { x, y, w: CW, h, rectRadius: 0.05, fill: { color: C.background1 }, line: { color: HEX.line, width: 0.75 }, objectName: nm(o, "rise", `${lab}m${j}`) });
        s.addImage({ path: THUMB(m.key), x: x + 0.04, y: y + 0.04, w: CW - 0.08, h: (CW - 0.08) * 0.46 / 1.72, objectName: nm(o, "rise", `${lab}p${j}`) });
        txt(s, [
          { text: m.name, options: { bold: true, fontSize: 10, color: C.text2, breakLine: true } },
          { text: `${m.kcal} kcal`, options: { bold: true, fontSize: 9.5, color: C.text1 } },
          { text: `  ·  ${Math.round(m.p)}P ${Math.round(m.net)}N ${Math.round(m.f)}F`, options: { fontSize: 9.5, color: C.text1 } },
        ], { x: x + 0.07, y: y + 0.5, w: CW - 0.12, h: 0.66, valign: "top", objectName: nm(o, "rise", `${lab}mt${j}`) });
      });
      if (d.meals.length === 2) {
        const y = 1.8 + 2 * 1.25;
        s.addShape(pres.ShapeType.roundRect, { x, y, w: CW, h: 1.19, rectRadius: 0.05, fill: { color: C.background2 }, line: { color: C.accent6, width: 0.75 }, objectName: nm(o, "rise", lab + "fw") });
        txt(s, [{ text: "FASTING DAY", options: { bold: true, fontSize: 10, color: C.accent5, charSpacing: 2, breakLine: true } }, { text: "19 h fast", options: { bold: true, fontSize: 15, color: C.text2, breakLine: true } }, { text: "Eat 3–8 PM", options: { fontSize: 10, color: C.text1 } }], { x, y, w: CW, h: 1.19, align: "center", valign: "middle", objectName: nm(o, "rise", lab + "fwt") });
      }
      s.addShape(pres.ShapeType.roundRect, { x, y: 5.6, w: CW, h: 1.02, rectRadius: 0.05, fill: { color: C.background2 }, line: { color: C.accent6, width: 1 }, objectName: nm(o, "rise", lab + "tot") });
      txt(s, [
        { text: "DAILY TOTAL", options: { bold: true, fontSize: 9.5, color: C.accent5, breakLine: true } },
        { text: `${fmt(d.kcal)} kcal`, options: { bold: true, fontSize: 17, color: C.text2, breakLine: true } },
        { text: `P ${d.p}  ·  Net C ${d.net}  ·  F ${d.f}`, options: { bold: true, fontSize: 10.5, color: C.text1 } },
      ], { x: x + 0.1, y: 5.63, w: CW - 0.18, h: 0.8, valign: "top", objectName: nm(o, "rise", lab + "tott") });
      bar3(s, x + 0.1, 6.47, CW - 0.2, 0.08, d, o, lab);
    });
    if (wk.week === 5) {
      const n125 = D.days.filter(d => d.p >= 125).length;
      const okCaps = D.days.filter(d => eggsOf(d) <= 2 && (d.tier !== "KETO" || d.net <= 30)).length;
      const rc = [[`${nTier("KETO")} · ${nTier("MED")}`, "keto · refeed days over 30 days"], [`${n125} / 30 days`, `at 125 g protein or more (avg ${avg.p} g)`], [`${okCaps} / 30 days`, "inside caps: ≤ 2 whole eggs, keto ≤ 30 g net"]];
      const rx = colX(2), rw = colX(6) + CW - rx;
      rc.forEach(([v, lt], i) => {
        const x = rx + i * (rw / 3), w = rw / 3 - 0.12;
        card(s, x, 1.2, w, 1.0, { name: nm(3 + i, "rise", "rc" + i) });
        txt(s, v, { x: x + 0.18, y: 1.27, w: w - 0.3, h: 0.4, fontSize: 18, bold: true, color: C.text2, valign: "middle", objectName: nm(3 + i, "rise", "rcv" + i) });
        txt(s, lt, { x: x + 0.18, y: 1.67, w: w - 0.3, h: 0.5, fontSize: 10.5, color: C.accent5, valign: "top", objectName: nm(3 + i, "rise", "rcl" + i) });
      });
      const labs = D.days.map(d => String(d.day));
      s.addChart(pres.charts.BAR, ["KETO", "MED"].map(t => ({ name: { KETO: "Keto day", MED: "Refeed day" }[t], labels: labs, values: D.days.map(d => d.tier === t ? d.net : 0) })),
        { x: rx, y: 2.35, w: rw, h: 4.25, barGrouping: "stacked", chartColors: [TIERCOL.KETO, TIERCOL.MED], barGapWidthPct: 35, showLegend: true, legendPos: "b", legendFontSize: 11, legendColor: HEX.dk1, legendFontFace: "+mn-lt", showTitle: true, title: "Net carbohydrate by day (g), coloured by day type", titleFontSize: 14, titleColor: HEX.dk2, titleFontFace: "+mn-lt", catAxisLabelFontSize: 10, valAxisLabelFontSize: 10, catAxisLabelColor: HEX.dk1, valAxisLabelColor: HEX.dk1, valAxisMinVal: 0, valGridLine: { color: HEX.line, size: 0.5 }, objectName: nm(6, "wipe", "rchart") });
    }
    txt(s, [{ text: "Meals: ", options: { bold: true } }, { text: "Workout days (16:8): 12:00, 3:30 and 7:30 PM  ·  Rest days (19:5): 3:00 and 7:00 PM      " }, { text: "Header colour", options: { bold: true } }, { text: " = purple keto, green refeed. P protein, N net carbs, F fat." }], { x: 0.45, y: 6.7, w: 12.43, h: 0.3, fontSize: 10, color: C.accent5, valign: "middle", objectName: nm(8, "fade", `wfoot${wk.week}`) });
    s.addNotes(`Week ${wk.week}: ${dLong(f)} to ${dLong(l)}. Each day shows its meals (three on workout days, two on rest days) with a photo, kcal, protein, net carbs and fat, plus the daily total.`);
  }

  monthCalendar();

  // ---------- WEEKS ----------
  const GCOL = [["Protein", "egg", "D2"], ["Vegetables", "carrot", "L1"], ["Refeed carbs & fruit", "apple", "B6"], ["Fats, nuts & seeds", "seed", "L7"]];
  for (const wk of D.weeks) {
    const sec = `Week ${wk.week}`;
    pres.addSection({ title: sec });
    const days = D.days.filter(d => wk.days.includes(d.day));
    weekCalendar(wk, days, sec);
    {
      const s = newSlide("CONTENT", sec, "fade", true);
      s.addText(`Week ${wk.week} shopping list${wk.week === 5 ? "  ·  Days 29–30" : ""}`, { placeholder: "title" });
      GCOL.forEach(([h, ic, ph], i) => {
        const items = wk.groc[h] || [];
        const x = MX + i * 3.07, w = 2.9, y = 1.3, hh = 5.38;
        card(s, x, y, w, hh, { name: nm(1 + i, "rise", "gc" + i) });
        s.addImage({ path: STRIP(ph), x: x + 0.08, y: y + 0.08, w: w - 0.16, h: (w - 0.16) / 2.9, objectName: nm(1 + i, "rise", "gcp" + i) });
        s.addShape(pres.ShapeType.ellipse, { x: x + 0.16, y: y + 1.08, w: 0.46, h: 0.46, fill: { color: C.accent6 }, line: { color: C.accent6, width: 0 }, objectName: nm(1 + i, "rise", "gci" + i) });
        s.addImage({ data: IC[ic], x: x + 0.27, y: y + 1.19, w: 0.24, h: 0.24, objectName: nm(1 + i, "rise", "gcii" + i) });
        txt(s, h, { x: x + 0.72, y: y + 1.08, w: w - 0.8, h: 0.46, fontSize: 15, bold: true, color: C.text2, valign: "middle", objectName: nm(1 + i, "rise", "gch" + i) });
        const rh = Math.min(0.33, 3.6 / Math.max(items.length, 1));
        if (items.length) {
          const rows = items.map(([l, q]) => [{ text: l, options: { fontSize: 11.5, color: HEX.dk1, valign: "middle" } }, { text: q, options: { fontSize: 11.5, bold: true, color: HEX.dk2, align: "right", valign: "middle" } }]);
          const lw = 1.72;
          s.addTable(rows, { x: x + 0.16, y: y + 1.66, w: w - 0.32, colW: [lw, w - 0.32 - lw], rowH: rh, border: [{ type: "none" }, { type: "none" }, { type: "solid", pt: 0.5, color: HEX.line }, { type: "none" }], fill: { color: "FFFFFF" }, margin: [0.01, 0.02, 0.01, 0.02], objectName: nm(1 + i, "rise", "gct" + i) });
        }
        if (i === 2 && items.length < 7) {
          const ty = y + 1.66 + items.length * rh + 0.25;
          s.addShape(pres.ShapeType.roundRect, { x: x + 0.16, y: ty, w: w - 0.32, h: y + hh - 0.16 - ty, rectRadius: 0.1, fill: { color: C.background2 }, line: { color: C.background2, width: 0 }, objectName: nm(5, "rise", "tipbg") });
          txt(s, [{ text: "Prep tip", options: { bold: true, color: C.text2, fontSize: 13, breakLine: true } }, { text: "Sunday: slice seitan, bake the egg-white bake, wilt the spinach, and cook quinoa only for Saturday's refeed. Portion pea protein into jars by meal.", options: { fontSize: 11.5, color: C.text1 } }], { x: x + 0.3, y: ty + 0.1, w: w - 0.6, h: y + hh - 0.36 - ty, valign: "top", paraSpaceAfter: 4, objectName: nm(5, "rise", "tiptxt") });
        }
      });
      txt(s, "Spinach is measured raw and wilted in the pan. Sweet potato is weighed baked. Buy a 2-lb tub of unflavored pea protein and check every label for soy and soy lecithin.", { x: MX, y: 6.74, w: W - 2 * MX, h: 0.3, fontSize: 10.5, italic: true, color: C.accent5, objectName: nm(6, "fade", "gfoot") });
    }
    for (const d of days) {
      const s = newSlide("DAY", sec, "morph", false);
      s.addText(`Day ${d.day}`, { placeholder: "title" });
      txt(s, [{ text: `${dLong(d.day)}  ·  Week ${wk.week}  ·  Day ${d.day} of 30`, options: { breakLine: true } }, { text: `${DTYPE[d.dtype]} day  ·  ${d.fast} fast  ·  eat ${d.window}`, options: { bold: true, color: TIERCOL[d.tier] } }], { x: 0.45, y: 0.84, w: 3.85, h: 0.42, fontSize: 11, color: C.accent5, valign: "top", objectName: "!!sub" });
      s.addShape(pres.ShapeType.roundRect, { x: 2.3, y: 0.38, w: 2.0, h: 0.42, rectRadius: 0.1, fill: { color: TIERCOL[d.tier] }, line: { color: TIERCOL[d.tier], width: 0 }, objectName: "!!tier" });
      txt(s, `${TIERLONG[d.tier]} DAY`, { x: 2.3, y: 0.38, w: 2.0, h: 0.42, fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle", objectName: "!!tiert" });
      const pc = macroPct(d);
      s.addChart(pres.charts.DOUGHNUT, [{ name: "Macros", labels: ["Protein", "Carbs", "Fat"], values: [d.p * 4, d.c * 4, d.f * 9] }],
        { x: 0.45, y: 1.3, w: 1.95, h: 1.95, holeSize: 68, chartColors: [HEX.P, HEX.C, HEX.F], showLegend: false, showLabel: false, showValue: false, showPercent: false, dataBorder: { pt: 2, color: "F6FAF9" }, objectName: "!!ring" });
      txt(s, fmt(d.kcal), { x: 0.45, y: 1.97, w: 1.95, h: 0.4, fontSize: 20, bold: true, color: C.text2, align: "center", valign: "middle", objectName: "!!kcal" });
      txt(s, "kcal", { x: 0.45, y: 2.33, w: 1.95, h: 0.25, fontSize: 10.5, color: C.accent5, align: "center", objectName: "!!kcalu" });
      [["Protein", d.p, pc[0], C.accent1], ["Carbs", d.c, pc[1], C.accent2], ["Fat", d.f, pc[2], C.accent4]].forEach(([l, g, p, col], i) => {
        const y = 1.45 + i * 0.58;
        dot(s, 2.62, y + 0.1, 0.16, col, "!!lgd" + i);
        txt(s, l, { x: 2.88, y: y - 0.02, w: 1.4, h: 0.26, fontSize: 11, color: C.accent5, objectName: "!!lgl" + i });
        txt(s, `${g} g  ·  ${p}%`, { x: 2.88, y: y + 0.22, w: 1.45, h: 0.3, fontSize: 14, bold: true, color: C.text1, objectName: "!!lgv" + i });
      });
      const px = 0.45, py = 3.35, pw = 3.85, ph = 3.62;
      s.addShape(pres.ShapeType.rect, { x: px, y: py, w: pw, h: ph, fill: { color: "FFFFFF" }, line: { color: C.text1, width: 1.5 }, objectName: "!!panel" });
      txt(s, "Nutrition Facts", { x: px + 0.14, y: py + 0.06, w: pw - 0.28, h: 0.4, fontSize: 20, bold: true, color: C.text1, fontFace: "Cambria", valign: "middle", objectName: "!!nfh" });
      txt(s, `Daily total  ·  ${d.meals.length} meals  ·  % of daily target`, { x: px + 0.14, y: py + 0.44, w: pw - 0.28, h: 0.24, fontSize: 10, color: C.accent5, objectName: "!!nfs" });
      s.addShape(pres.ShapeType.line, { x: px + 0.14, y: py + 0.72, w: pw - 0.28, h: 0, line: { color: C.text1, width: 4 }, objectName: "!!nfl1" });
      txt(s, "Calories", { x: px + 0.14, y: py + 0.78, w: 1.6, h: 0.5, fontSize: 16, bold: true, color: C.text1, valign: "middle", objectName: "!!nfc" });
      txt(s, fmt(d.kcal), { x: px + 1.5, y: py + 0.78, w: 1.4, h: 0.5, fontSize: 28, bold: true, color: C.text1, align: "right", valign: "middle", objectName: "!!nfcv" });
      txt(s, Math.round(d.kcal / TGT.kcal * 100) + "%", { x: px + 2.95, y: py + 0.78, w: 0.76, h: 0.5, fontSize: 13, bold: true, color: C.text1, align: "right", valign: "middle", objectName: "!!nfcp" });
      s.addShape(pres.ShapeType.line, { x: px + 0.14, y: py + 1.32, w: pw - 0.28, h: 0, line: { color: C.text1, width: 2 }, objectName: "!!nfl2" });
      const rowsNF = [
        ["Total Fat", d.f + " g", Math.round(d.f / TGT.f * 100) + "%", true, 0],
        ["Total Carbohydrate", d.c + " g", "", true, 0],
        ["Dietary Fiber", d.fib + " g", Math.round(d.fib / TGT.fib * 100) + "%", false, 0.22],
        ["Net Carbs", d.net + " g", Math.round(d.net / d.ctarget * 100) + "%", false, 0.22],
        ["Protein", d.p + " g", Math.round(d.p / TGT.p * 100) + "%", true, 0],
      ];
      rowsNF.forEach(([l, v, p, b, ind], i) => {
        const y = py + 1.38 + i * 0.31;
        txt(s, [{ text: l + " ", options: { bold: b } }, { text: v, options: { bold: false } }], { x: px + 0.14 + ind, y, w: 2.7, h: 0.3, fontSize: 12.5, color: C.text1, valign: "middle", objectName: "!!nfr" + i });
        txt(s, p, { x: px + 2.95, y, w: 0.76, h: 0.3, fontSize: 12.5, bold: true, color: C.text1, align: "right", valign: "middle", objectName: "!!nfp" + i });
        s.addShape(pres.ShapeType.line, { x: px + 0.14, y: y + 0.3, w: pw - 0.28, h: 0, line: { color: "A9BDB2", width: 0.75 }, objectName: "!!nfx" + i });
      });
      txt(s, [{ text: "Today: ", options: { bold: true } }, { text: `${eggsOf(d)}/2 whole eggs  ·  net carbs ${d.net} g (${d.tier === "KETO" ? "limit" : "target about"} ${d.ctarget} g)  ·  no soy, cruciferous, dairy, meat or fish` }], { x: px + 0.14, y: py + 3.0, w: pw - 0.28, h: 0.55, fontSize: 10, color: C.text1, valign: "middle", objectName: "!!nfpur" });
      // meal cards: 3 tall photo cards
      d.meals.forEach((m, i) => {
        const two = d.meals.length === 2, cw = two ? 4.14 : 2.69, cx = 4.55 + i * (cw + 0.13), cy = 0.28, ch = 6.72, iw = cw - 0.2, ih = two ? 2.85 : iw;
        card(s, cx, cy, cw, ch, { name: "!!card" + i });
        s.addImage({ path: two ? path.join(__dirname, LITE ? "imgwide" : "imgwide", m.key + ".jpg") : SQ(m.key), x: cx + 0.1, y: cy + 0.1, w: iw, h: ih, objectName: "!!img" + i });
        s.addShape(pres.ShapeType.rect, { x: cx + 0.1, y: cy + 0.1 + ih - 0.4, w: 1.12, h: 0.4, fill: { color: C.text2, transparency: 8 }, line: { color: C.text2, width: 0 }, objectName: "!!badge" + i });
        txt(s, `${m.kcal} kcal`, { x: cx + 0.1, y: cy + 0.1 + ih - 0.4, w: 1.12, h: 0.4, fontSize: 12.5, bold: true, color: C.background1, align: "center", valign: "middle", objectName: "!!badget" + i });
        const ty = cy + 0.1 + ih + 0.1;
        txt(s, `${m.slotShort}  ·  ${m.slotName.toUpperCase()}  ·  ${m.time}`, { x: cx + 0.14, y: ty, w: cw - 0.26, h: 0.24, fontSize: 9, bold: true, color: C.accent5, objectName: "!!slot" + i });
        txt(s, m.name, { x: cx + 0.14, y: ty + 0.25, w: cw - 0.26, h: 0.56, fontSize: 14, bold: true, color: C.text2, valign: "top", fit: "shrink", objectName: "!!name" + i });
        [["PROTEIN", m.p, HEX.P], ["NET CARBS", m.net, HEX.C], ["FAT", m.f, HEX.F]].forEach(([l, v, col], j) => {
          const x = cx + 0.14 + j * 0.8;
          s.addShape(pres.ShapeType.roundRect, { x, y: ty + 0.86, w: 0.74, h: 0.52, rectRadius: 0.08, fill: { color: col, transparency: 62 }, line: { color: col, width: 0 }, objectName: `!!chip${i}${j}` });
          txt(s, [{ text: Math.round(v) + " g", options: { bold: true, fontSize: 13, breakLine: true } }, { text: l, options: { fontSize: 8, bold: true } }], { x, y: ty + 0.86, w: 0.74, h: 0.52, color: C.text1, align: "center", valign: "middle", objectName: `!!chipt${i}${j}` });
        });
        const all = [...m.lines.map(t => ({ t, add: false })), ...m.adds.map(t => ({ t: "+ " + t, add: true }))];
        const lines = all.map((o, j) => ({ text: o.t, options: { bold: o.add, color: o.add ? HEX.dk2 : HEX.dk1, breakLine: j < all.length - 1 } }));
        const ly = ty + 1.48;
        s.addShape(pres.ShapeType.line, { x: cx + 0.14, y: ly - 0.04, w: cw - 0.28, h: 0, line: { color: HEX.line, width: 0.75 }, objectName: "!!sep" + i });
        txt(s, lines, { x: cx + 0.14, y: ly + 0.04, w: cw - 0.24, h: cy + ch - ly - 0.14, fontSize: all.length > 7 ? 10.5 : 11.5, valign: "top", paraSpaceAfter: 2, objectName: "!!list" + i });
      });
      s.addNotes(`Day ${d.day} (${dLong(d.day)}), ${DTYPE[d.dtype].toLowerCase()} day, ${d.fast} fast with the eating window ${d.window}: ${fmt(d.kcal)} kcal, ${d.p} g protein, ${d.net} g net carbs (${d.c} g total, ${d.fib} g fiber; limit ${d.ctarget} g net), ${d.f} g fat. Bold lines starting with + are the day's add-ons (carb sides, protein or fat top-ups).`);
    }
  }

  // ---------- SWAP GUIDE ----------
  pres.addSection({ title: "Swap guide" });
  {
    const s = newSlide("DARK", "Swap guide", "fade", true);
    s.addText("Swap guide: trade like for like", { placeholder: "title" });
    const rules = [["1", "Same column only", "Protein for protein, carb for carb, vegetable for vegetable, fat for fat. Never eggs for quinoa, or green beans for seitan."], ["2", "Match the macro, not the volume", "Use the portion on each card. Each one is a standard FatSecret-style serving with its full macros."], ["3", "Keep the caps", "Whole eggs ≤ 2/day and ≤ 8/week. Keto days ≤ 30 g net carbs. No soy and no crucifers, ever."], ["4", "Log the swap", "Swaps change the day's totals slightly. The web app recalculates them automatically."]];
    rules.forEach(([n, h, t], i) => {
      const x = MX + (i % 2) * 6.15, y = 1.45 + Math.floor(i / 2) * 2.0, w = 5.98;
      s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 1.82, rectRadius: 0.12, fill: { color: "FFFFFF", transparency: 90 }, line: { color: "FFFFFF", width: 0.75, transparency: 60 }, objectName: nm(1 + i, "rise", "sr" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: y + 0.3, w: 0.7, h: 0.7, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: nm(1 + i, "rise", "src" + i) });
      txt(s, n, { x: x + 0.25, y: y + 0.3, w: 0.7, h: 0.7, fontSize: 24, bold: true, color: "FFFFFF", align: "center", valign: "middle", objectName: nm(1 + i, "rise", "srn" + i) });
      txt(s, [{ text: h, options: { bold: true, fontSize: 18, color: "FFFFFF", breakLine: true } }, { text: t, options: { fontSize: 13.5, color: C.accent6 } }], { x: x + 1.2, y: y + 0.18, w: w - 1.4, h: 1.5, valign: "middle", paraSpaceAfter: 4, objectName: nm(1 + i, "rise", "srt" + i) });
    });
    const strip = [["D2", "PROTEINS"], ["B6", "CARBS"], ["L1", "VEGETABLES"], ["L7", "FATS"]];
    strip.forEach(([k, l], i) => {
      const x = MX + i * 3.07, y = 5.55, w = 2.9;
      s.addImage({ path: STRIP(k), x, y, w, h: 1.0, objectName: nm(5 + i, "rise", "ss" + i) });
      s.addShape(pres.ShapeType.rect, { x, y: y + 0.62, w, h: 0.38, fill: { color: "000000", transparency: 45 }, line: { color: "000000", width: 0 }, objectName: nm(5 + i, "rise", "ssb" + i) });
      txt(s, `15 ${l}`, { x, y: y + 0.62, w, h: 0.38, fontSize: 12, bold: true, color: "FFFFFF", align: "center", valign: "middle", charSpacing: 3, objectName: nm(5 + i, "rise", "sst" + i) });
    });
  }
  const CATS = [["protein", "Proteins", "D2", HEX.P, "Pick one per meal slot. Beans and lentils count as protein but are for the Saturday refeed only."], ["carb", "Carbs", "B6", HEX.C, "Carb sides belong on the Saturday refeed day. A few berries fit a keto day."], ["veg", "Vegetables", "L1", "6FBF4A", "All non-cruciferous. Swap cup for cup; wilt spinach in the pan, about 2 cups raw at a time."], ["fat", "Fats", "L7", HEX.F, "Portions are small on purpose: 1 tsp oil, ½ oz nuts, 1 tbsp seeds."]];
  CATS.forEach(([cat, label, ph, col, tip], ci) => {
    const s = newSlide("CONTENT", "Swap guide", "push", true);
    const items = FOODS.filter(f => f.cat === cat);
    s.addText(`Swap guide  ·  ${label}: ${items.length} choices with full macros`, { placeholder: "title" });
    const pw = 2.85, py = 1.3, phh = 5.45;
    s.addImage({ path: TALL(ph), x: MX, y: py, w: pw, h: phh, objectName: nm(1, "fade", "sgp") });
    s.addShape(pres.ShapeType.rect, { x: MX, y: py + phh - 2.0, w: pw, h: 2.0, fill: { color: C.text2, transparency: 12 }, line: { color: C.text2, width: 0 }, objectName: nm(1, "fade", "sgpb") });
    s.addShape(pres.ShapeType.rect, { x: MX, y: py + phh - 2.0, w: pw, h: 0.07, fill: { color: col }, line: { color: col, width: 0 }, objectName: nm(1, "fade", "sgpc") });
    txt(s, [{ text: label.toUpperCase(), options: { bold: true, fontSize: 20, color: "FFFFFF", charSpacing: 3, breakLine: true } }, { text: tip, options: { fontSize: 12, color: C.accent6 } }], { x: MX + 0.2, y: py + phh - 1.85, w: pw - 0.4, h: 1.72, valign: "top", paraSpaceAfter: 5, objectName: nm(1, "fade", "sgpt") });
    const gx = MX + pw + 0.18, gw = W - MX - gx, cols = 5, gap = 0.1, cw = (gw - gap * (cols - 1)) / cols, chh = 1.75;
    items.forEach((f, i) => {
      const r = Math.floor(i / cols), c = i % cols, x = gx + c * (cw + gap), y = py + r * (chh + 0.1), o = 2 + r, lab = `sg${ci}_${i}`;
      s.addShape(pres.ShapeType.rect, { x, y, w: cw, h: chh, fill: { color: "FFFFFF" }, line: { color: C.text1, width: 1 }, objectName: nm(o, "rise", lab) });
      s.addShape(pres.ShapeType.rect, { x, y, w: cw, h: 0.06, fill: { color: col }, line: { color: col, width: 0 }, objectName: nm(o, "rise", lab + "c") });
      txt(s, f.n, { x: x + 0.08, y: y + 0.1, w: cw - 0.16, h: 0.4, fontSize: 11, bold: true, color: C.text1, valign: "top", fit: "shrink", objectName: nm(o, "rise", lab + "n") });
      txt(s, `${f.amt} ${f.u}  ·  ${f.g} g`, { x: x + 0.08, y: y + 0.5, w: cw - 0.16, h: 0.2, fontSize: 9, color: C.accent5, objectName: nm(o, "rise", lab + "a") });
      s.addShape(pres.ShapeType.line, { x: x + 0.08, y: y + 0.74, w: cw - 0.16, h: 0, line: { color: C.text1, width: 2.5 }, objectName: nm(o, "rise", lab + "l") });
      txt(s, [{ text: "Calories ", options: { bold: true, fontSize: 10 } }, { text: String(f.kcal), options: { bold: true, fontSize: 16 } }], { x: x + 0.08, y: y + 0.77, w: cw - 0.16, h: 0.34, color: C.text1, valign: "middle", objectName: nm(o, "rise", lab + "k") });
      [["P", f.p, HEX.P], ["C", f.c, HEX.C], ["F", f.f, HEX.F]].forEach(([l, v, cc], j) => {
        const bw = (cw - 0.16 - 0.08) / 3, bx = x + 0.08 + j * (bw + 0.04);
        s.addShape(pres.ShapeType.roundRect, { x: bx, y: y + 1.14, w: bw, h: 0.32, rectRadius: 0.05, fill: { color: cc, transparency: 62 }, line: { color: cc, width: 0 }, objectName: nm(o, "rise", `${lab}x${j}`) });
        txt(s, `${l} ${Math.round(v * 10) / 10}`, { x: bx, y: y + 1.14, w: bw, h: 0.32, fontSize: 9.5, bold: true, color: C.text1, align: "center", valign: "middle", objectName: nm(o, "rise", `${lab}xt${j}`) });
      });
      txt(s, `Fiber ${f.fib} · Sugar ${f.sug} · Sat ${f.sat} (g)`, { x: x + 0.06, y: y + 1.5, w: cw - 0.12, h: 0.22, fontSize: 7.5, color: C.accent5, objectName: nm(o, "rise", lab + "m") });
    });
    s.addNotes(`${label}: ${items.length} approved swaps. Values are per listed portion, using FatSecret / USDA-style serving data. ${items.filter(f => f.note).map(f => f.n + ": " + f.note).join(" ")}`);
  });

  // ---------- MONITORING ----------
  pres.addSection({ title: "Review" });
  {
    const s = newSlide("DARK", "Review", "fade", true);
    s.addText("Monitoring: what to track, when to adjust", { placeholder: "title" });
    const cols = [
      ["scale", "Weekly check-in", ["Weigh once a week: same day, fasted, after the bathroom", "Expect 0.75–1.25 lb a week after the first one to two weeks of water loss", "Stalled for 3 weeks: check sleep, stress, steps and labs before cutting food", "Waist, hips, arms and chest every 2 weeks; photos every 4"]],
      ["vial", "Thyroid and labs", ["Levothyroxine 50 mcg on waking, water only, same time daily", "Coffee and food 30–60 min after; iron, calcium, magnesium 4 h after", "TSH, free T4 and free T3 at 8–12 weeks, plus lipids, B12, ferritin, vitamin D, electrolytes", "The physician adjusts the dose, never her. Pause biotin 3–5 days before blood draws"]],
      ["dumb", "Fasting and training", ["Strength Mon, Thu, Sat; HIIT Tue, Fri; break the fast after training", "Salt food to taste (iodized) and add electrolytes for the first 2 weeks", "Stop a fast and eat if dizzy, shaky or heart racing", "Report racing heart, tremor, poor sleep, or worse fatigue, cold, constipation or hair loss"]],
    ];
    cols.forEach(([ic, h, items], i) => {
      const x = MX + i * 4.1, w = 3.93, y = 1.45, hh = 4.45;
      s.addShape(pres.ShapeType.roundRect, { x, y, w, h: hh, rectRadius: 0.12, fill: { color: "FFFFFF", transparency: 90 }, line: { color: "FFFFFF", width: 0.75, transparency: 60 }, objectName: nm(1 + i, "rise", "mc" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: y + 0.25, w: 0.62, h: 0.62, fill: { color: C.accent6 }, line: { color: C.accent6, width: 0 }, objectName: nm(1 + i, "rise", "mci" + i) });
      s.addImage({ data: IC[ic], x: x + 0.4, y: y + 0.4, w: 0.32, h: 0.32, objectName: nm(1 + i, "rise", "mcii" + i) });
      txt(s, h, { x: x + 1.05, y: y + 0.25, w: 2.7, h: 0.62, fontSize: 18, bold: true, color: C.background1, valign: "middle", objectName: nm(1 + i, "rise", "mch" + i) });
      txt(s, items.map((t, j) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < items.length - 1 } })), { x: x + 0.25, y: y + 1.12, w: w - 0.5, h: hh - 1.25, fontSize: 13, color: C.background1, valign: "top", paraSpaceAfter: 6, objectName: nm(1 + i, "rise", "mct" + i) });
    });
    s.addShape(pres.ShapeType.roundRect, { x: MX, y: 6.1, w: W - 2 * MX, h: 0.75, rectRadius: 0.12, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: nm(4, "rise", "succbg") });
    txt(s, [{ text: "Day-30 success markers   ", options: { bold: true } }, { text: "−4 to −6 lb on the weekly average (some early water loss)  ·  waist down  ·  strength up  ·  energy stable  ·  labs booked" }], { x: MX + 0.3, y: 6.1, w: W - 2 * MX - 0.6, h: 0.75, fontSize: 14, color: C.text2, valign: "middle", objectName: nm(4, "rise", "succtxt") });
  }
  {
    const s = newSlide("CONTENT", "Review", "fade", true);
    s.addText("Notes for dietitian review", { placeholder: "title" });
    const L = [
      "Macros are computed per ingredient from FatSecret / USDA serving values and summed per meal and per day; real-world variation is about ±5–10%.",
      `Daily totals land within ${fmt(mm.kmin)}–${fmt(mm.kmax)} kcal and ${mm.pmin}–${mm.pmax} g protein. Net carbs (total minus fiber) run ${mm.nmin}–${mm.nmax} g; keto days are 30 g or less.`,
      "Whole eggs are capped at 2 a day and 8 a week. No soy, cruciferous vegetables, dairy, meat or fish appear in any meal. Check pea protein and seitan labels for soy.",
    ];
    const R = [
      `At ~${fmt(avg.kcal)} kcal against a ~1,800 kcal TDEE the deficit is about 400 kcal a day: roughly 0.8–1 lb a week, so 10–14 lb in 12 weeks including early water loss. 15 lb is a stretch. Do not cut below ~1,300 kcal on a slow thyroid.`,
      "Very low carbohydrate intake can lower T3 conversion in some people, which is why Saturday is a refeed. If she gets colder, more tired or loses hair, add a second refeed day and tell her physician.",
      "Keto and hypothyroidism can both raise LDL, so check lipids at 8–12 weeks. Seitan is gluten: confirm she tolerates it. Levothyroxine 50 mcg daily is confirmed; any dose change is her physician's call, and the 19-hour fast is for rest days only.",
    ];
    [["Method", L, 0], ["Clinical judgment calls", R, 1]].forEach(([h, items, i]) => {
      const x = MX + i * 6.2, w = 5.93;
      card(s, x, 1.45, w, 4.4, { name: nm(1 + i, "rise", "nc" + i) });
      txt(s, h, { x: x + 0.3, y: 1.65, w: w - 0.6, h: 0.5, fontSize: 20, bold: true, color: C.text2, valign: "middle", objectName: nm(1 + i, "rise", "nch" + i) });
      txt(s, items.map((t, j) => ({ text: t, options: { bullet: { indent: 16 }, breakLine: j < items.length - 1 } })), { x: x + 0.3, y: 2.3, w: w - 0.6, h: 3.4, fontSize: 14, color: C.text1, valign: "top", paraSpaceAfter: 10, objectName: nm(1 + i, "rise", "nct" + i) });
    });
    s.addShape(pres.ShapeType.roundRect, { x: MX, y: 6.05, w: W - 2 * MX, h: 0.7, rectRadius: 0.12, fill: { color: C.background2 }, line: { color: C.background2, width: 0 }, objectName: nm(3, "rise", "endbg") });
    txt(s, "Prepared as a draft for the treating dietitian's review. It does not replace individual medical advice.", { x: MX + 0.3, y: 6.05, w: W - 2 * MX - 0.6, h: 0.7, fontSize: 13, italic: true, color: C.text2, valign: "middle", objectName: nm(3, "rise", "endtxt") });
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  fs.writeFileSync(path.join(__dirname, "meta.json"), JSON.stringify(meta));
  console.log("slides:", slideNo, "->", OUT);
})().catch(e => { console.error(e); process.exit(1); });
