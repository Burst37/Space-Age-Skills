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
const FOODS = JSON.parse(fs.readFileSync(path.join(__dirname, "../foods.json"), "utf8"));
const OUT = process.argv[2] || path.join(__dirname, "deck_raw.pptx");
const LITE = !!process.env.LITE;
const IMG = k => path.join(__dirname, LITE ? "imgj_lite" : "imgj", k + ".jpg");
const SQ = k => path.join(__dirname, LITE ? "imgsq_lite" : "imgsq", k + ".jpg");
const THUMB = k => path.join(__dirname, "imgthumb", k + ".jpg");
const STRIP = k => path.join(__dirname, "imgstrip", k + ".jpg");
const TALL = k => path.join(__dirname, "imgtall", k + ".jpg");
const INTRO = path.join(__dirname, "..", "intro");
const POSTER_FILE = process.env.POSTER_FILE || path.join(INTRO, "poster_1080.jpg");

const CL = JSON.parse(fs.readFileSync(path.join(__dirname, "../client.json"), "utf8"));
const TH = require("../../../themes/theme.js").resolve(process.env.THEME || CL.theme);
const THEME = TH.THEME, HEX = TH.HEX, RS = TH.radius / 0.12;   // RS scales every corner radius to the theme

const pres = new pptxgen();
pres.layout = "LAYOUT_WIDE"; // 13.333 x 7.5
pres.theme = { headFontFace: THEME.headFontFace, bodyFontFace: THEME.bodyFontFace };
pres.title = CL.name + " – " + CL.title;
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

const FOOT = CL.footer;
const TX = TH.layout === "right" ? 13.333 - 9.6 + 0.8 : TH.layout === "center" ? 1.37 : 0.8, TW = TH.layout === "center" ? 10.6 : 8.6, TAL = TH.layout === "center" ? "center" : "left";
pres.defineSlideMaster({ title: "VIDEO", background: { color: "000000" }, objects: [] });
pres.defineSlideMaster({
  title: "TITLE", background: { color: THEME.colors.dk2 },
  objects: [{ placeholder: { options: { name: "title", type: "title", x: TX, y: 1.5, w: TW, h: 2.3, fontSize: 54, bold: true, color: C.background1, valign: "bottom", align: TAL, margin: 0 }, text: "" } }],
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
  title: "DAY", background: { color: HEX.daybg },
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
  s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: (o.r || 0.12) * RS, fill: { color: o.fill || C.background1 }, line: { color: o.line || HEX.line, width: 0.75 }, shadow: o.noShadow ? undefined : shadow(), objectName: o.name });
}
function txt(s, t, o) { s.addText(t, Object.assign({ isTextBox: true, margin: 0 }, o)); }
const dot = (s, x, y, d, color, name) => s.addShape(pres.ShapeType.ellipse, { x, y, w: d, h: d, fill: { color }, line: { color, width: 0 }, objectName: name });
const macroPct = d => { const p = d.p * 4, c = d.c * 4, f = d.f * 9, t = p + c + f; return [p / t, c / t, f / t].map(v => Math.round(v * 100)); };
const TGT = CL.targets;
const TIERCOL = TH.TIERCOL;
const TIERLONG = { LOW: "LOW CARB", KETO: "KETO DAY", HIGH: "TRAINING DAY" };
const TIERRANGE = { LOW: "~45 g", KETO: "~30 g", HIGH: "~95 g" };
const PROT = { chicken: "Chicken", thigh: "Chicken", turkey: "Turkey", beef: "Beef", steak: "Steak", lamb: "Lamb", salmon: "Salmon", cod: "Cod", shrimp: "Shrimp", tuna: "Tuna", egg: "Egg", greek: "Yogurt", cottage: "Cottage cheese", oats: "Oats" };
const mainProt = m => { const k = m.items.map(i => i[0]).find(k => PROT[k] && k !== "white") || m.items.map(i => i[0]).find(k => PROT[k]); return k; };

(async () => {
  const IC = {};
  for (const [k, n, c] of [["check", "FaCheck", "#FFFFFF"], ["warn", "FaExclamationTriangle", "#FFFFFF"], ["x", "FaTimes", "#FFFFFF"], ["drop", "FaTint", "#" + HEX.dk2], ["clock", "FaClock", "#" + HEX.dk2],
    ["egg", "FaEgg", "#" + HEX.dk2], ["carrot", "FaCarrot", "#" + HEX.dk2], ["box", "FaBoxOpen", "#" + HEX.dk2], ["scale", "FaWeight", "#" + HEX.dk2], ["vial", "FaVial", "#" + HEX.dk2], ["pills", "FaPills", "#" + HEX.dk2],
    ["dumb", "FaDumbbell", "#" + HEX.dk2], ["heart", "FaHeartbeat", "#" + HEX.dk2], ["fire", "FaFire", "#" + HEX.dk2], ["leaf", "FaLeaf", "#" + HEX.dk2], ["bull", "FaBullseye", "#" + HEX.dk2], ["cal", "FaCalendarCheck", "#" + HEX.dk2],
    ["seed", "FaSeedling", "#" + HEX.dk2], ["walk", "FaWalking", "#" + HEX.dk2], ["sun", "FaSun", "#" + HEX.dk2], ["fish", "FaWater", "#" + HEX.dk2], ["moon", "FaMoon", "#" + HEX.dk2], ["bolt", "FaBolt", "#" + HEX.dk2], ["shield", "FaShieldAlt", "#" + HEX.dk2], ["apple", "FaAppleAlt", "#" + HEX.dk2], ["ruler", "FaRulerHorizontal", "#" + HEX.dk2]])
    IC[k] = await icon(n, c);

  const avg = D.avg, mm = D.minmax;
  const split = (() => { const p = avg.p * 4, c = avg.c * 4, f = avg.f * 9, t = p + c + f; return [p, c, f].map(v => Math.round(v / t * 100)); })();
  const START = Date.UTC(...CL.start.split("-").map((v, i) => i === 1 ? v - 1 : +v)); // client start date (a Monday)
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
    if ((LITE && !process.env.VIDEO) || process.env.POSTER) s.addImage({ path: POSTER_FILE, x: 0, y: 0, w: W, h: H, objectName: "IntroPoster" });
    else s.addMedia({ type: "video", path: path.join(INTRO, "intro_1080p.mp4"), cover: "data:image/jpeg;base64," + fs.readFileSync(POSTER_FILE).toString("base64"), x: 0, y: 0, w: W, h: H, objectName: "IntroVideo" });
    s.addNotes("Motion-graphics intro (9.5 s). Plays automatically and advances on its own; click to skip.");
  }

  // ---------- 2. TITLE ----------
  {
    const s = newSlide("TITLE", "Intro", "fade", true);
    s.addImage({ path: IMG("HERO"), x: 0, y: 0, w: W, h: H, objectName: "HeroBG" });
    s.addShape(pres.ShapeType.rect, { x: 0, y: 0, w: W, h: H, fill: { color: C.text2, transparency: 35 }, line: { color: C.text2, width: 0 }, objectName: "Shade" });
    s.addShape(pres.ShapeType.rect, { x: TH.layout === "right" ? W - 9.6 : 0, y: 0, w: TH.layout === "center" ? W : 9.6, h: H, fill: { color: C.text2, transparency: TH.layout === "center" ? 28 : 10 }, line: { color: C.text2, width: 0 }, objectName: "ShadeLeft" });
    txt(s, "PERSONALIZED NUTRITION PLAN  ·  " + CL.name.toUpperCase(), { x: TX, y: 1.0, w: TW, h: 0.35, fontSize: 14, bold: true, color: C.accent6, align: TAL, charSpacing: 5, objectName: nm(1, "fade", "eyebrow") });
    s.addText(CL.title, { placeholder: "title" });
    txt(s, "High protein  ·  Low carb  ·  Carb-cycled to training  ·  Halal, no pork", { x: TX, y: 4.0, w: TW, h: 0.45, fontSize: 18, color: C.background1, align: TAL, objectName: nm(2, "fade", "sub") });
    const chips = [[fmt(avg.kcal), "KCAL / DAY", C.background1], [avg.p + " g", "PROTEIN", C.accent1], [avg.c + " g", "AVG CARBS", C.accent2], [avg.f + " g", "FAT", C.accent4]];
    chips.forEach(([v, l, col], i) => {
      const x = (TH.layout === "center" ? (W - 8.6) / 2 : TX) + i * 2.2;
      s.addShape(pres.ShapeType.roundRect, { x, y: 5.05, w: 2.0, h: 1.3, rectRadius: 0.12 * RS, fill: { color: "FFFFFF", transparency: 88 }, line: { color: "FFFFFF", width: 0.75, transparency: 55 }, objectName: nm(3 + i, "rise", "chipbg" + i) });
      txt(s, v, { x, y: 5.15, w: 2.0, h: 0.7, fontSize: 32, bold: true, color: col, align: "center", valign: "middle", objectName: nm(3 + i, "rise", "chipv" + i) });
      txt(s, l, { x, y: 5.85, w: 2.0, h: 0.3, fontSize: 12, bold: true, color: C.accent6, align: "center", charSpacing: 3, objectName: nm(3 + i, "rise", "chipl" + i) });
    });
    txt(s, "Starts Mon, Oct 26, 2026  ·  30 days  ·  90 meals  ·  Keto and 16:8 fasting options  ·  Dietitian review draft", { x: TX, y: 6.82, w: TW, h: 0.3, fontSize: 11, color: C.accent6, align: TAL, objectName: nm(7, "fade", "foot") });
    s.addNotes("Overview: Aleena (35, 5'2\", 145 lb) wants 125 lb in 4 months. This plan is halal with no pork, high protein, low carb and moderate fat, with carbs cycled to her Mon/Tue/Thu resistance and plyometric training. Two days a week are true keto days (net carbs 20 g or less, fat-forward meals, built on a 16:8 fasting window), two are regular low-carb days, and 16:8 fasting is optional on those.");
  }

  // ---------- 3. SNAPSHOT ----------
  pres.addSection({ title: "Client & strategy" });
  const tAvg = (t, k) => { const a = D.days.filter(d => d.tier === t); return Math.round(a.reduce((s, d) => s + d[k], 0) / a.length); };
  const netMaxKeto = Math.max(...D.days.filter(d => d.tier === "KETO").map(d => d.c - d.fib));
  const netAvgKeto = Math.round(D.days.filter(d => d.tier === "KETO").reduce((s, d) => s + d.c - d.fib, 0) / nTier("KETO"));
  const ketoOk = D.days.filter(d => d.tier === "KETO" && d.c - d.fib <= 20).length;
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Where Aleena starts, and where the plan takes her", { placeholder: "title" });
    const stats = [["145 → 125 lb", "20-lb goal in 4 months (~17 weeks)", "scale"], ["BMI 26.5 → 22.9", "Overweight range to healthy range", "heart"], ["~1,300 kcal", "Basal metabolic rate", "fire"], ["~2,000 kcal", "Maintenance with training + steps (TDEE)", "bull"]];
    stats.forEach(([v, l, ic], i) => {
      const x = MX + (i % 2) * 2.95, y = 1.5 + Math.floor(i / 2) * 1.75;
      card(s, x, y, 2.75, 1.55, { name: nm(1 + i, "rise", "stat" + i) });
      s.addImage({ data: IC[ic], x: x + 0.2, y: y + 0.2, w: 0.38, h: 0.38, objectName: nm(1 + i, "rise", "static" + i) });
      txt(s, v, { x: x + 0.2, y: y + 0.65, w: 2.45, h: 0.5, fontSize: 21, bold: true, color: C.text2, objectName: nm(1 + i, "rise", "statv" + i) });
      txt(s, l, { x: x + 0.2, y: y + 1.12, w: 2.45, h: 0.38, fontSize: 11.5, color: C.accent5, valign: "top", objectName: nm(1 + i, "rise", "statl" + i) });
    });
    card(s, MX, 5.1, 5.7, 1.65, { fill: C.background2, noShadow: true, name: nm(5, "rise", "prefbg") });
    txt(s, [
      { text: "Female  ·  35  ·  5'2\"  ·  145 lb", options: { bold: true, breakLine: true } },
      { text: "Muslim: halal, no pork  ·  High protein, low carb, moderate fat", options: { breakLine: true } },
      { text: "Mon / Tue / Thu: 1 h resistance + plyometrics (high intensity)", options: { breakLine: true } },
      { text: "10k steps most days, a 30-min walk on the others" },
    ], { x: MX + 0.25, y: 5.18, w: 5.25, h: 1.5, fontSize: 13, color: C.text1, valign: "middle", paraSpaceAfter: 3, objectName: nm(5, "rise", "preftxt") });
    const hd = (t, col) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: col }, valign: "middle", fontSize: 13 } });
    const cell = (t, o = {}) => ({ text: t, options: Object.assign({ fontSize: 12, color: HEX.dk1, valign: "middle" }, o) });
    const rows = [
      [hd("Day type", HEX.dk2), hd(`Training · ${nTier("HIGH")}`, TIERCOL.HIGH), hd(`Low-carb · ${nTier("LOW")}`, TIERCOL.LOW), hd(`Keto · ${nTier("KETO")}`, TIERCOL.KETO)],
      ["Days", "Mon · Tue · Thu", "Fri · Sun", "Wed · Sat"],
      ["Calories", `${fmt(tAvg("HIGH", "kcal"))}`, `${fmt(tAvg("LOW", "kcal"))}`, `${fmt(tAvg("KETO", "kcal"))}`],
      ["Protein", `${tAvg("HIGH", "p")} g`, `${tAvg("LOW", "p")} g`, `${tAvg("KETO", "p")} g`],
      ["Carbs", `${tAvg("HIGH", "c")} g`, `${tAvg("LOW", "c")} g`, `${tAvg("KETO", "c")} g (${netAvgKeto} net)`],
      ["Fat", `${tAvg("HIGH", "f")} g`, `${tAvg("LOW", "f")} g`, `${tAvg("KETO", "f")} g`],
      ["Purpose", "Fuel the lifts", "Steady fat loss", "Fat burning, ketosis"],
      ["Fasting", "Full window", "16:8 optional", "16:8, 12–8 PM"],
    ].map((r, i) => i === 0 ? r : [cell(r[0], { bold: true, fontSize: 11 }), cell(r[1], { fontSize: 11 }), cell(r[2], { fontSize: 11 }), cell(r[3], { bold: true, color: HEX.dk2, fontSize: 11 })]);
    s.addTable(rows, { x: 6.85, y: 1.5, w: 5.88, colW: [1.0, 1.4, 1.4, 2.08], rowH: [0.5, 0.45, 0.5, 0.5, 0.56, 0.5, 0.56, 0.56], border: { type: "solid", pt: 0.5, color: HEX.line }, fill: { color: "FFFFFF" }, margin: [0.04, 0.1, 0.04, 0.1], objectName: nm(6, "fade", "compare") });
    s.addNotes("BMR uses Mifflin-St Jeor for a 35-year-old woman at 157.5 cm and 65.8 kg (about 1,306 kcal). TDEE of about 2,000 kcal assumes three 1-hour high-intensity sessions a week plus roughly 10,000 steps most days. At an average of about 1,461 kcal the deficit is about 540 kcal a day, close to 1.1 lb a week, so 19-20 lb over about 17 weeks is realistic but on the faster side; the plan is reviewed every 3-4 weeks.");
  }

  // ---------- 4. TARGETS ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "fade", true);
    s.addText("Daily targets: high protein, low carb, moderate fat", { placeholder: "title" });
    s.addChart(pres.charts.DOUGHNUT, [{ name: "Macros", labels: ["Protein", "Carbs", "Fat"], values: [avg.p * 4, avg.c * 4, avg.f * 9] }],
      { x: MX, y: 1.45, w: 4.9, h: 4.9, holeSize: 66, chartColors: [HEX.P, HEX.C, HEX.F], showLegend: false, showLabel: false, showValue: false, showPercent: false, dataBorder: { pt: 3, color: "FFFFFF" }, objectName: nm(1, "wheel", "ring") });
    txt(s, fmt(avg.kcal), { x: MX, y: 3.45, w: 4.9, h: 0.75, fontSize: 44, bold: true, color: C.text2, align: "center", valign: "middle", objectName: nm(2, "fade", "ringkcal") });
    txt(s, "KCAL / DAY AVG", { x: MX, y: 4.15, w: 4.9, h: 0.3, fontSize: 11, bold: true, color: C.accent5, align: "center", charSpacing: 3, objectName: nm(2, "fade", "ringlbl") });
    [["Protein", split[0], C.accent1], ["Carbs", split[1], C.accent2], ["Fat", split[2], C.accent4]].forEach(([l, p, col], i) => {
      const x = MX + 0.35 + i * 1.55;
      dot(s, x, 6.5, 0.16, col, nm(3, "fade", "lgd" + i));
      txt(s, `${l} ${p}%`, { x: x + 0.24, y: 6.41, w: 1.3, h: 0.34, fontSize: 13, bold: true, color: C.text1, valign: "middle", objectName: nm(3, "fade", "lgt" + i) });
    });
    const cards = [
      [fmt(avg.kcal), "Calories", `${fmt(mm.kmin)}–${fmt(mm.kmax)}: lower on rest days`, null],
      [avg.p + " g", "Protein", `${mm.pmin}–${mm.pmax} g/day  ·  ≈ ${(avg.p / 65.8).toFixed(1)} g/kg`, C.accent1],
      [avg.c + " g", "Carbohydrate", `${mm.cmin}–${mm.cmax} g/day  ·  carb-cycled`, C.accent2],
      [avg.f + " g", "Fat", `${split[2]}% of calories, mostly unsaturated`, C.accent4],
      [avg.fib + " g", "Fiber", "Vegetables, berries, chia, flax, legumes", null],
      ["2.5–3 L", "Water", "Add electrolytes on keto and fasting days", null],
    ];
    cards.forEach(([v, l, sub, col], i) => {
      const x = 6.0 + (i % 2) * 3.45, y = 1.45 + Math.floor(i / 2) * 1.68;
      card(s, x, y, 3.25, 1.5, { name: nm(4 + i, "rise", "tc" + i) });
      if (col) dot(s, x + 0.22, y + 0.24, 0.2, col, nm(4 + i, "rise", "tcd" + i));
      txt(s, l.toUpperCase(), { x: x + (col ? 0.52 : 0.22), y: y + 0.17, w: 2.6, h: 0.3, fontSize: 11, bold: true, color: C.accent5, charSpacing: 3, valign: "middle", objectName: nm(4 + i, "rise", "tcl" + i) });
      txt(s, v, { x: x + 0.22, y: y + 0.5, w: 2.8, h: 0.55, fontSize: 30, bold: true, color: C.text2, valign: "middle", objectName: nm(4 + i, "rise", "tcv" + i) });
      txt(s, sub, { x: x + 0.22, y: y + 1.05, w: 2.85, h: 0.35, fontSize: 11.5, color: C.accent5, valign: "top", objectName: nm(4 + i, "rise", "tcs" + i) });
    });
    s.addNotes("Protein is about 2.2 g per kg at 65.8 kg: high on purpose, to protect muscle and keep her full during a deficit alongside heavy resistance and plyometric training. Carbohydrate is cycled to the training schedule: about 95 g on Mon/Tue/Thu (never above 100 g) and about 45 g on Fri and Sun, and 20 g net or less on the two keto days.");
  }

  // ---------- 5. FOOD RULES ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Food rules: halal, high protein, carbs timed to training", { placeholder: "title" });
    const cols = [
      { h: "EAT", sub: "Every-day staples", col: C.accent1, ic: "check", items: ["Halal lean protein: chicken, turkey, lean beef, lamb, white fish, salmon, shrimp, tuna", "Eggs and egg whites; plain Greek yogurt, cottage cheese, halal-certified whey", "Spinach, peppers, zucchini, mushrooms, tomatoes, cucumber, green beans, asparagus, broccoli, cauliflower", "Olive oil, avocado, almonds, walnuts, chia, flax, tahini, pumpkin seeds", "Training days only: basmati or brown rice, sweet potato, oats, quinoa, pita, fruit"] },
      { h: "LIMIT", sub: "Used with caps", col: C.accent2, ic: "warn", items: ["Carbs: training days never above 100 g; low-carb days about 45 g; keto days 20 g net or less", "Whole eggs: 3 a day at most", "Whey: 2 scoops a day at most, only to top up protein", "Oils, nuts and seeds: measured, since fat is 9 kcal a gram", "Shrimp: accepted by most, not all, halal schools. Swap for fish if she prefers"] },
      { h: "NOT USED", sub: "In no meal", col: C.accent3, ic: "x", items: ["Pork, bacon, ham, lard and pork gelatin", "Alcohol, including wine in cooking and alcohol-based vanilla or flavor extracts", "Meat that is not halal-certified or zabiha", "Gelatin or enzymes of unknown origin in yogurts, whey, broth or sauces", "Sugary drinks, juice, desserts and ultra-processed snacks"] },
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
    txt(s, "No pork or pork-derived ingredient appears in any meal, recipe or swap. Buy halal-certified meat and whey, and read labels on yogurt, broth and sauces.", { x: MX, y: 6.62, w: W - 2 * MX, h: 0.4, fontSize: 11, italic: true, color: C.accent5, objectName: nm(4, "fade", "ucfoot") });
    s.addNotes("Aleena is Muslim, so every meat is halal (zabiha or certified) and nothing contains pork, pork gelatin or alcohol. Supplements, yogurts and broths are the usual hiding places for gelatin and alcohol-based flavors, so labels matter. Shrimp is accepted by most schools of halal practice but not all (Hanafi views differ), so it is easy to swap for fish.");
  }

  // ---------- 6. PROTEIN SOURCES ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "fade", true);
    s.addText(`Where ${avg.p} g of daily protein comes from`, { placeholder: "title" });
    const ps = Object.entries(D.protein_by_source).sort((a, b) => b[1] - a[1]);
    s.addChart(pres.charts.BAR, [{ name: "Avg grams per day", labels: ps.map(p => p[0]), values: ps.map(p => p[1]) }], {
      x: MX, y: 1.45, w: 6.3, h: 3.6, barDir: "bar", chartColors: [HEX.P], showLegend: false, showTitle: true, title: "Average protein per day (g), by source", titleFontSize: 14, titleColor: HEX.dk2, titleFontFace: "+mn-lt",
      showValue: true, dataLabelPosition: "outEnd", dataLabelFontSize: 12, dataLabelColor: HEX.dk1, dataLabelFontFace: "+mn-lt", dataLabelFormatCode: "0",
      catAxisLabelFontSize: 11.5, catAxisLabelColor: HEX.dk1, catAxisLabelFontFace: "+mn-lt", catAxisOrientation: "maxMin", valAxisHidden: true, valGridLine: { style: "none" }, catGridLine: { style: "none" }, barGapWidthPct: 40, objectName: nm(1, "wipe", "bars"),
    });
    const big = [["3", "protein-anchored meals a day"], ["35–65 g", "protein in each main meal"], ["≤ 3", "whole eggs a day"]];
    big.forEach(([v, l], i) => {
      const x = MX + i * 2.15;
      card(s, x, 5.2, 2.0, 1.55, { fill: C.background2, noShadow: true, name: nm(2 + i, "rise", "big" + i) });
      txt(s, v, { x, y: 5.3, w: 2.0, h: 0.65, fontSize: 30, bold: true, color: C.text2, align: "center", valign: "middle", objectName: nm(2 + i, "rise", "bigv" + i) });
      txt(s, l, { x: x + 0.15, y: 5.95, w: 1.7, h: 0.7, fontSize: 11.5, color: C.text1, align: "center", valign: "top", objectName: nm(2 + i, "rise", "bigl" + i) });
    });
    const tiers = [
      ["TIER 1 · EVERY WEEK", "Chicken breast and thigh · lean ground turkey and beef · cod, shrimp, tuna · egg whites", C.accent1],
      ["TIER 2 · RICHER CUTS", "Salmon, sirloin and lamb for omega-3, iron and zinc · whole eggs ≤ 3/day", C.accent2],
      ["TIER 3 · TOP-UPS", "Plain Greek yogurt, cottage cheese, halal whey (≤ 2 scoops) · small lentil and chickpea portions", C.accent4],
      ["NOT USED", "Pork and pork products · non-halal meat · gelatin and alcohol-based flavors", C.accent3],
    ];
    tiers.forEach(([h, t, col], i) => {
      const y = 1.5 + i * 1.33;
      card(s, 7.2, y, 5.53, 1.2, { name: nm(5 + i, "rise", "tier" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: 7.4, y: y + 0.3, w: 0.6, h: 0.6, fill: { color: col }, line: { color: col, width: 0 }, objectName: nm(5 + i, "rise", "tierd" + i) });
      txt(s, i === 3 ? "✕" : String(i + 1), { x: 7.4, y: y + 0.3, w: 0.6, h: 0.6, fontSize: 18, bold: true, color: C.text2, align: "center", valign: "middle", objectName: nm(5 + i, "rise", "tiern" + i) });
      txt(s, h, { x: 8.2, y: y + 0.13, w: 4.4, h: 0.3, fontSize: 12, bold: true, color: C.text2, charSpacing: 2, valign: "middle", objectName: nm(5 + i, "rise", "tierh" + i) });
      txt(s, t, { x: 8.2, y: y + 0.44, w: 4.4, h: 0.68, fontSize: 12, color: C.text1, valign: "top", objectName: nm(5 + i, "rise", "tiert" + i) });
    });
    s.addNotes("Grams by source are averaged over all 30 days from ingredient-level math. Whole foods supply nearly all the protein; whey only tops up a day that falls short of its protein floor. Fish appears at least two to three times a week for omega-3.");
  }

  // ---------- 7. SUPPLEMENTS ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Optional supplements and hydration, halal-friendly", { placeholder: "title" });
    const sup = [
      ["bolt", "Creatine monohydrate", "3–5 g", "Daily, with water", "Strength and power for resistance and plyo work. A 1–2 lb water gain is normal."],
      ["sun", "Vitamin D3", "1,000–2,000 IU", "Daily, with a fat-containing meal", "Bone and immune support. Dose by blood level."],
      ["fish", "Omega-3 (EPA + DHA)", "1–2 g", "Daily, with a meal", "Recovery and heart health. Choose halal-certified or non-gelatin capsules."],
      ["moon", "Magnesium glycinate", "300–400 mg", "Evening", "Sleep, cramps and muscle recovery."],
      ["drop", "Electrolytes", "Sodium, potassium, magnesium", "Keto and fasting days", "Prevents headache and fatigue when carbs drop; salt food to taste."],
      ["dumb", "Whey isolate", "1 scoop at most", "Only to top up protein", "Halal-certified, no gelatin, no alcohol-based flavors."],
      ["vial", "Iron and ferritin", "Only if labs are low", "Test first", "Women who train hard often run low. Take away from coffee and tea."],
    ];
    sup.forEach(([ic, n, dose, when, why], i) => {
      const col = i % 4, row = Math.floor(i / 4), w = 2.92, h = 2.28;
      const x = MX + col * (w + 0.12), y = 1.35 + row * (h + 0.14);
      card(s, x, y, w, h, { name: nm(1 + i, "rise", "sp" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.2, y: y + 0.2, w: 0.56, h: 0.56, fill: { color: C.accent6 }, line: { color: C.accent6, width: 0 }, objectName: nm(1 + i, "rise", "spc" + i) });
      s.addImage({ data: IC[ic], x: x + 0.33, y: y + 0.33, w: 0.3, h: 0.3, objectName: nm(1 + i, "rise", "spi" + i) });
      txt(s, n, { x: x + 0.9, y: y + 0.17, w: w - 1.0, h: 0.62, fontSize: 13.5, bold: true, color: C.text2, valign: "middle", objectName: nm(1 + i, "rise", "spn" + i) });
      txt(s, dose, { x: x + 0.2, y: y + 0.88, w: w - 0.4, h: 0.42, fontSize: dose.length > 14 ? 14 : 21, bold: true, color: C.text2, valign: "middle", fit: "shrink", objectName: nm(1 + i, "rise", "spd" + i) });
      txt(s, when.toUpperCase(), { x: x + 0.2, y: y + 1.3, w: w - 0.4, h: 0.26, fontSize: 9.5, bold: true, color: C.accent1, charSpacing: 1, valign: "middle", objectName: nm(1 + i, "rise", "spw" + i) });
      txt(s, why, { x: x + 0.2, y: y + 1.58, w: w - 0.4, h: 0.62, fontSize: 11, color: C.text1, valign: "top", objectName: nm(1 + i, "rise", "spy" + i) });
    });
    const x = MX + 3 * 3.04, y = 1.35 + 2.42, w = 2.92, h = 2.28;
    s.addShape(pres.ShapeType.roundRect, { x, y, w, h, rectRadius: 0.12 * RS, fill: { color: C.text2 }, line: { color: C.text2, width: 0 }, shadow: shadow(), objectName: nm(8, "rise", "timebg") });
    txt(s, [
      { text: "HALAL & SAFETY", options: { bold: true, fontSize: 12, color: C.accent6, charSpacing: 3, breakLine: true } },
      { text: "Capsules: ", options: { bold: true, fontSize: 12, color: "FFFFFF" } }, { text: "softgels are often pork or bovine gelatin. Pick halal-certified or vegetarian capsules.", options: { fontSize: 12, color: "FFFFFF", breakLine: true } },
      { text: "Medicines: ", options: { bold: true, fontSize: 12, color: "FFFFFF" } }, { text: "check each supplement with her physician first.", options: { fontSize: 12, color: "FFFFFF" } },
    ], { x: x + 0.22, y: y + 0.15, w: w - 0.4, h: h - 0.3, valign: "top", paraSpaceAfter: 6, objectName: nm(8, "rise", "timetx") });
    s.addNotes("Nothing here is required. The plan reaches its targets from food alone. Creatine monohydrate has the strongest evidence for strength and power training. Doses are typical ranges to confirm with her physician; vitamin D and iron are best dosed from blood tests.");
  }

  // ---------- 8. OPTIONS: KETO + FASTING ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "wipe", true);
    s.addText("Keto and fasting are built into the week", { placeholder: "title" });
    const hd = (t, col) => ({ text: t, options: { bold: true, color: "FFFFFF", fill: { color: col }, valign: "middle", fontSize: 13 } });
    const c1 = (t, col) => ({ text: t, options: { fontSize: 12.5, color: col, valign: "middle", bold: true } });
    const c2 = t => ({ text: t, options: { fontSize: 12.5, color: HEX.dk1, valign: "middle" } });
    const rows = [
      [hd("Day type", HEX.dk2), hd("Meal times", HEX.dk2), hd("Carbohydrate", HEX.dk2), hd("Intermittent fasting", TIERCOL.KETO)],
      [c1("Training: Mon · Tue · Thu", TIERCOL.HIGH), c2("8:00 AM · 12:30 PM · 6:30 PM"), c2(`About ${tAvg("HIGH", "c")} g, never above 100 g`), c2("Keep the full window. If she trains fasted, eat a protein-forward meal within 2 hours after the session")],
      [c1("Low-carb: Fri · Sun", TIERCOL.LOW), c2("8:00 AM · 12:30 PM · 6:30 PM"), c2(`About ${tAvg("LOW", "c")} g`), c2("Optional 16:8: move the same meals to 12:00 PM · 3:30 PM · 7:30 PM")],
      [c1("Keto: Wed · Sat", TIERCOL.KETO), c2("12:00 PM · 3:30 PM · 7:30 PM (16:8 window, 12–8 PM)"), c2(`${tAvg("KETO", "c")} g total, ${netMaxKeto} g net or less`), c2("Built in. Prefer to eat early? Same food at 8:00 · 12:30 · 6:30")],
    ];
    s.addTable(rows, { x: MX, y: 1.4, w: W - 2 * MX, colW: [2.5, 3.0, 2.8, 3.43], rowH: [0.5, 0.95, 0.85, 0.85], border: { type: "solid", pt: 0.5, color: HEX.line }, fill: { color: "FFFFFF" }, margin: [0.06, 0.14, 0.06, 0.14], objectName: nm(1, "fade", "opt") });
    const tips = [
      ["Fasting window", "Water, black coffee and plain tea only until the first meal. Break the fast with protein, then eat the rest of the day as planned."],
      ["Keto days", "Eggs, avocado, olive oil, salmon, ribeye and lamb carry the calories. Add salt, potassium and magnesium in the first two weeks to avoid headaches and fatigue."],
      ["Back to carbs", "Carbs return to about 95 g on Mon, Tue and Thu, never above 100 g. A pound or two of scale swing from water is normal."],
    ];
    tips.forEach(([h, t], i) => {
      const x = MX + i * 4.1, w = 3.93, y = 4.75;
      card(s, x, y, w, 2.05, { fill: C.background2, noShadow: true, name: nm(2 + i, "rise", "ot" + i) });
      txt(s, [{ text: h, options: { bold: true, fontSize: 15, color: C.text2, breakLine: true } }, { text: t, options: { fontSize: 12, color: C.text1 } }], { x: x + 0.22, y: y + 0.12, w: w - 0.44, h: 1.8, valign: "top", paraSpaceAfter: 5, objectName: nm(2 + i, "rise", "ott" + i) });
    });
    s.addNotes("Aleena can do both intermittent fasting and keto at times, so both are built into the week. Wednesday and Saturday are keto days: fat-forward meals, net carbs 20 g or less, and a 16:8 window with meals at 12:00, 3:30 and 7:30 PM. Friday and Sunday are regular low-carb days (about 45 g) that can use the same window if she wants to fast. Monday, Tuesday and Thursday are training days with carbs capped at 100 g to fuel the resistance and plyometric sessions. Keto days use higher fat than the rest of the plan; the same food can be eaten at 8:00, 12:30 and 6:30 if she prefers not to fast.");
  }

  // ---------- 9. RHYTHM ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Daily rhythm: three meals, protein at every one", { placeholder: "title" });
    const sl = [["MEAL 1 · BREAK-FAST", "8:00 AM", "B4", "Eggs, yogurt or oats with protein. On training days, carbs sit here or after the session"], ["MEAL 2 · POWER LUNCH", "12:30 PM", "L1", "The biggest plate: lean meat or fish, vegetables, a carb side on training days"], ["MEAL 3 · DINNER", "6:30 PM", "D1", "Fish or lean meat with vegetables; the lighter-carb meal on every day type"]];
    sl.forEach(([name, time, img, note], i) => {
      const x = MX + i * 2.83, w = 2.68, a = D.slot_avg[String(i)];
      card(s, x, 1.4, w, 5.45, { name: nm(1 + i, "rise", "rh" + i) });
      s.addImage({ path: SQ(img), x: x + 0.12, y: 1.52, w: w - 0.24, h: w - 0.24, objectName: nm(1 + i, "rise", "rhimg" + i) });
      txt(s, `${name}  ·  ${time}`, { x: x + 0.16, y: 4.08, w: w - 0.3, h: 0.28, fontSize: 10, bold: true, color: C.accent5, valign: "middle", objectName: nm(1 + i, "rise", "rht" + i) });
      txt(s, `${a[0]} kcal avg`, { x: x + 0.16, y: 4.36, w: w - 0.3, h: 0.45, fontSize: 22, bold: true, color: C.text2, valign: "middle", objectName: nm(1 + i, "rise", "rhk" + i) });
      [["P", a[1], HEX.P], ["C", a[2], HEX.C], ["F", a[3], HEX.F]].forEach(([l, v, col], j) => {
        const cx = x + 0.16 + j * 0.8;
        s.addShape(pres.ShapeType.roundRect, { x: cx, y: 4.88, w: 0.74, h: 0.42, rectRadius: 0.08 * RS, fill: { color: col, transparency: 62 }, line: { color: col, width: 0 }, objectName: nm(1 + i, "rise", `rhc${i}${j}`) });
        txt(s, `${v} g ${l}`, { x: cx, y: 4.88, w: 0.74, h: 0.42, fontSize: 11, bold: true, color: C.text1, align: "center", valign: "middle", objectName: nm(1 + i, "rise", `rhct${i}${j}`) });
      });
      txt(s, note, { x: x + 0.16, y: 5.42, w: w - 0.3, h: 1.3, fontSize: 12, color: C.text1, valign: "top", objectName: nm(1 + i, "rise", "rhn" + i) });
    });
    txt(s, "Times shown are for training and low-carb days. Keto days run the 16:8 window: 12:00 · 3:30 · 7:30 PM.", { x: MX, y: 6.87, w: 8.6, h: 0.2, fontSize: 9.5, italic: true, color: C.accent5, objectName: nm(8, "fade", "rhfoot") });
    const habits = [["dumb", "Mon / Tue / Thu: 1 h resistance + plyometrics. Eat protein within 2 h after"], ["walk", "10k steps most days; a 30-minute walk on the others"], ["drop", "2.5–3 L water a day; electrolytes on keto or fasting days"], ["cal", "Weigh once a week, same morning; track the 7-day average"]];
    habits.forEach(([ic, t], i) => {
      const y = 1.4 + i * 1.38;
      card(s, 9.2, y, 3.53, 1.25, { fill: C.background2, noShadow: true, name: nm(4 + i, "rise", "hb" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: 9.38, y: y + 0.36, w: 0.52, h: 0.52, fill: { color: C.accent6 }, line: { color: C.accent6, width: 0 }, objectName: nm(4 + i, "rise", "hbi" + i) });
      s.addImage({ data: IC[ic], x: 9.51, y: y + 0.49, w: 0.26, h: 0.26, objectName: nm(4 + i, "rise", "hbii" + i) });
      txt(s, t, { x: 10.05, y: y + 0.08, w: 2.55, h: 1.09, fontSize: 12, color: C.text1, valign: "middle", objectName: nm(4 + i, "rise", "hbt" + i) });
    });
    s.addNotes("Meal times are a default. Carb sides sit in whichever meal is closest to the workout. Meal averages are across all 30 days. Keto days use the 16:8 window (12:00, 3:30, 7:30 PM); low-carb days can too if she wants to fast.");
  }

  // ---------- 10. CARB CYCLE ----------
  {
    const s = newSlide("CONTENT", "Client & strategy", "push", true);
    s.addText("Carb cycling: carbs follow the workouts", { placeholder: "title" });
    const pattern = ["HIGH", "HIGH", "KETO", "HIGH", "LOW", "KETO", "LOW"], dn = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
    pattern.forEach((t, i) => {
      const x = MX + i * 1.76, w = 1.64;
      s.addShape(pres.ShapeType.roundRect, { x, y: 1.45, w, h: 1.55, rectRadius: 0.1 * RS, fill: { color: TIERCOL[t] }, line: { color: TIERCOL[t], width: 0 }, shadow: shadow(), objectName: nm(1 + i, "rise", "cy" + i) });
      txt(s, [{ text: dn[i], options: { bold: true, fontSize: 12, color: "FFFFFF", charSpacing: 2, breakLine: true } }, { text: TIERRANGE[t], options: { bold: true, fontSize: 24, color: "FFFFFF", breakLine: true } }, { text: TIERLONG[t], options: { fontSize: 10.5, color: "FFFFFF", bold: true } }], { x, y: 1.5, w, h: 1.45, align: "center", valign: "middle", objectName: nm(1 + i, "rise", "cyt" + i) });
    });
    const tiers = [
      ["HIGH", "B6", "TRAINING DAY", `About ${tAvg("HIGH", "c")} g, never above 100 g  ·  ${nTier("HIGH")} of 30 days`, "Mon, Tue, Thu. Rice, sweet potato, oats, quinoa or fruit around the workout fuel the lifts and the plyo work."],
      ["LOW", "B2", "LOW-CARB DAY", `About ${tAvg("LOW", "c")} g  ·  ${nTier("LOW")} of 30 days`, "Fri, Sun. Lean protein, vegetables and healthy fats, with a small fruit at most. 16:8 is optional."],
      ["KETO", "KB1", "KETO DAY", `${netMaxKeto} g net carbs or less  ·  ${nTier("KETO")} of 30 days`, "Wed, Sat. Fat-forward meals: avocado, olive oil, salmon, ribeye and lamb, on a 16:8 window from 12 to 8 PM."],
    ];
    tiers.forEach(([t, ph, hh, h, d], i) => {
      const x = MX + i * 4.1, y = 3.3, w = 3.93, hgt = 3.25;
      card(s, x, y, w, hgt, { name: nm(8 + i, "rise", "ct" + i) });
      s.addImage({ path: STRIP(ph), x: x + 0.1, y: y + 0.1, w: w - 0.2, h: (w - 0.2) / 2.9, objectName: nm(8 + i, "rise", "ctp" + i) });
      s.addShape(pres.ShapeType.rect, { x: x + 0.1, y: y + 0.1, w: 0.1, h: (w - 0.2) / 2.9, fill: { color: TIERCOL[t] }, line: { color: TIERCOL[t], width: 0 }, objectName: nm(8 + i, "rise", "ctb" + i) });
      txt(s, [{ text: hh, options: { bold: true, fontSize: 13, color: TIERCOL[t], breakLine: true } }, { text: h, options: { bold: true, fontSize: 12, color: C.text2, breakLine: true } }, { text: d, options: { fontSize: 11.5, color: C.text1 } }], { x: x + 0.22, y: y + 1.5, w: w - 0.4, h: 1.65, valign: "top", paraSpaceAfter: 3, objectName: nm(8 + i, "rise", "ctt" + i) });
    });
    txt(s, `Protein stays at ${mm.pmin} g or more and calories at ${fmt(mm.kmin)}–${fmt(mm.kmax)} every day. Weekly average carbohydrate is about ${avg.c} g; training-day carbs never go above 100 g. If a workout moves, move its carb day with it.`, { x: MX, y: 6.65, w: W - 2 * MX, h: 0.35, fontSize: 11, italic: true, color: C.accent5, objectName: nm(11, "fade", "cyfoot") });
    s.addNotes("The pattern repeats each week from Monday, Oct 26: Mon, Tue and Thu are the training days with higher carbs; Wed and Sat are keto days, and Fri and Sun are regular low-carb days. Carbs are the main fuel for high-intensity resistance and plyometric work, so they are placed on those days and kept low when she is not training.");
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
      s.addShape(pres.ShapeType.roundRect, { x, y, w: CW, h: 0.98, rectRadius: 0.05 * RS, fill: { color: C.background1 }, line: { color: HEX.line, width: 0.75 }, objectName: nm(o, "rise", lab) });
      s.addShape(pres.ShapeType.rect, { x, y: y + 0.08, w: 0.06, h: 0.82, fill: { color: TIERCOL[d.tier] }, line: { color: TIERCOL[d.tier], width: 0 }, objectName: nm(o, "rise", lab + "k") });
      txt(s, [
        { text: `${dShort(d.day)}  ·  Day ${d.day}`, options: { bold: true, fontSize: 10, color: C.accent5, breakLine: true } },
        { text: `${fmt(d.kcal)} kcal`, options: { bold: true, fontSize: 15, color: C.text2, breakLine: true } },
        { text: `P${d.p}  ·  C${d.c}  ·  F${d.f}`, options: { fontSize: 10, color: C.text1, breakLine: true } },
        { text: tagOf(d), options: { fontSize: 9, color: TIERCOL[d.tier], bold: true } },
      ], { x: x + 0.14, y: y + 0.04, w: CW - 0.2, h: 0.8, valign: "top", objectName: nm(o, "rise", lab + "t") });
      bar3(s, x + 0.14, y + 0.86, CW - 0.22, 0.07, d, o, lab);
    });
    const cx = colX(2), cw = colX(6) + CW - cx, cy = 1.64 + 4 * 1.02;
    s.addShape(pres.ShapeType.roundRect, { x: cx, y: cy, w: cw, h: 0.98, rectRadius: 0.05 * RS, fill: { color: C.background2 }, line: { color: C.accent6, width: 0.75 }, objectName: nm(6, "rise", "mend") });
    txt(s, [{ text: "Day 31 onward  ", options: { bold: true, color: C.text2 } }, { text: "Re-assess at the day-30 check-in (weight trend, waist, strength, energy), then repeat Weeks 1–4 or adjust by ±100 kcal. Goal date: about Feb 26, 2027.", options: { color: C.text1 } }], { x: cx + 0.2, y: cy, w: cw - 0.4, h: 0.98, fontSize: 12.5, valign: "middle", objectName: nm(6, "rise", "mendt") });
    txt(s, [{ text: "Start: ", options: { bold: true } }, { text: "Mon, Oct 26, 2026 (Day 1)  ·  4 full weeks end Sun, Nov 22  ·  Days 29–30 (Nov 23–24) complete the 30 days      " }, { text: "Edge colour: ", options: { bold: true } }, { text: "blue low-carb · purple keto · orange training" }], { x: 0.45, y: 6.78, w: 12.43, h: 0.26, fontSize: 10, color: C.accent5, valign: "middle", objectName: nm(7, "fade", "mfoot") });
    s.addNotes("30 of 30 days planned. Day 1 is Monday, October 26, 2026.");
  }

  function weekCalendar(wk, days, sec) {
    const s = newSlide("CONTENT", sec, "push", true);
    const f = days[0].day, l = days[days.length - 1].day;
    s.addText(`Week ${wk.week} calendar  ·  ${dShort(f)} – ${dShort(l)}`, { placeholder: "title" });
    days.forEach((d, i) => {
      const x = colX(i), o = i + 1, lab = "w" + d.day;
      s.addShape(pres.ShapeType.rect, { x, y: 1.2, w: CW, h: 0.54, fill: { color: TIERCOL[d.tier] }, line: { color: TIERCOL[d.tier], width: 0 }, objectName: nm(o, "rise", lab + "h") });
      txt(s, [{ text: DOW3(d.day), options: { bold: true, fontSize: 13, color: C.background1, breakLine: true } }, { text: `Day ${d.day}  ·  ${dShort(d.day)}  ·  ${d.tier === "HIGH" ? "TRAINING" : d.tier === "KETO" ? "KETO" : "LOW CARB"}`, options: { fontSize: 9.5, color: "FFFFFF" } }], { x, y: 1.2, w: CW, h: 0.54, align: "center", valign: "middle", objectName: nm(o, "rise", lab + "ht") });
      d.meals.forEach((m, j) => {
        const y = 1.8 + j * 1.25, h = 1.19;
        s.addShape(pres.ShapeType.roundRect, { x, y, w: CW, h, rectRadius: 0.05 * RS, fill: { color: C.background1 }, line: { color: HEX.line, width: 0.75 }, objectName: nm(o, "rise", `${lab}m${j}`) });
        s.addImage({ path: THUMB(m.key), x: x + 0.04, y: y + 0.04, w: CW - 0.08, h: (CW - 0.08) * 0.46 / 1.72, objectName: nm(o, "rise", `${lab}p${j}`) });
        txt(s, [
          { text: m.name, options: { bold: true, fontSize: 10, color: C.text2, breakLine: true } },
          { text: `${m.kcal} kcal`, options: { bold: true, fontSize: 9.5, color: C.text1 } },
          { text: `  ·  ${Math.round(m.p)}P ${Math.round(m.c)}C ${Math.round(m.f)}F`, options: { fontSize: 9.5, color: C.text1 } },
        ], { x: x + 0.07, y: y + 0.5, w: CW - 0.12, h: 0.66, valign: "top", objectName: nm(o, "rise", `${lab}mt${j}`) });
      });
      s.addShape(pres.ShapeType.roundRect, { x, y: 5.6, w: CW, h: 1.02, rectRadius: 0.05 * RS, fill: { color: C.background2 }, line: { color: C.accent6, width: 1 }, objectName: nm(o, "rise", lab + "tot") });
      txt(s, [
        { text: "DAILY TOTAL", options: { bold: true, fontSize: 9.5, color: C.accent5, breakLine: true } },
        { text: `${fmt(d.kcal)} kcal`, options: { bold: true, fontSize: 17, color: C.text2, breakLine: true } },
        { text: `P ${d.p}  ·  C ${d.c}  ·  F ${d.f}`, options: { bold: true, fontSize: 10.5, color: C.text1 } },
      ], { x: x + 0.1, y: 5.63, w: CW - 0.18, h: 0.8, valign: "top", objectName: nm(o, "rise", lab + "tott") });
      bar3(s, x + 0.1, 6.47, CW - 0.2, 0.08, d, o, lab);
    });
    if (wk.week === 5) {
      const n145 = D.days.filter(d => d.p >= 120).length;
            const rc = [[`${nTier("HIGH")} · ${nTier("LOW")} · ${nTier("KETO")}`, "training · low-carb · keto days over 30 days"], [`${n145} / 30 days`, `at 120 g protein or more (avg ${avg.p} g)`], [`${ketoOk} / ${nTier("KETO")} days`, "keto days at 20 g net carbs or less"]];
      const rx = colX(2), rw = colX(6) + CW - rx;
      rc.forEach(([v, lt], i) => {
        const x = rx + i * (rw / 3), w = rw / 3 - 0.12;
        card(s, x, 1.2, w, 1.0, { name: nm(3 + i, "rise", "rc" + i) });
        txt(s, v, { x: x + 0.18, y: 1.27, w: w - 0.3, h: 0.4, fontSize: 18, bold: true, color: C.text2, valign: "middle", objectName: nm(3 + i, "rise", "rcv" + i) });
        txt(s, lt, { x: x + 0.18, y: 1.67, w: w - 0.3, h: 0.5, fontSize: 10.5, color: C.accent5, valign: "top", objectName: nm(3 + i, "rise", "rcl" + i) });
      });
      const labs = D.days.map(d => String(d.day));
      s.addChart(pres.charts.BAR, ["LOW", "KETO", "HIGH"].map(t => ({ name: { LOW: "Low-carb day", KETO: "Keto day", HIGH: "Training day" }[t], labels: labs, values: D.days.map(d => d.tier === t ? d.c : 0) })),
        { x: rx, y: 2.35, w: rw, h: 4.25, barGrouping: "stacked", chartColors: [TIERCOL.LOW, TIERCOL.KETO, TIERCOL.HIGH], barGapWidthPct: 35, showLegend: true, legendPos: "b", legendFontSize: 11, legendColor: HEX.dk1, legendFontFace: "+mn-lt", showTitle: true, title: "Carbohydrate by day (g), coloured by carb tier", titleFontSize: 14, titleColor: HEX.dk2, titleFontFace: "+mn-lt", catAxisLabelFontSize: 10, valAxisLabelFontSize: 10, catAxisLabelColor: HEX.dk1, valAxisLabelColor: HEX.dk1, valAxisMinVal: 0, valGridLine: { color: HEX.line, size: 0.5 }, objectName: nm(6, "wipe", "rchart") });
    }
    txt(s, [{ text: "Meals: ", options: { bold: true } }, { text: "Meal 1 at 8:00 AM  ·  Meal 2 at 12:30 PM  ·  Meal 3 at 6:30 PM (keto days: 12:00 · 3:30 · 7:30)      " }, { text: "Header colour", options: { bold: true } }, { text: " = carb tier (blue low-carb, purple keto, orange training)" }], { x: 0.45, y: 6.7, w: 12.43, h: 0.3, fontSize: 10, color: C.accent5, valign: "middle", objectName: nm(8, "fade", `wfoot${wk.week}`) });
    s.addNotes(`Week ${wk.week}: ${dLong(f)} to ${dLong(l)}. Each day shows all three meals with a photo, kcal, protein, carbs and fat, plus the daily total.`);
  }

  monthCalendar();

  // ---------- WEEKS ----------
  const GCOL = [["Protein", "egg", "D2"], ["Vegetables", "carrot", "L3"], ["Grains & fruit", "apple", "B6"], ["Fats, nuts & seeds", "seed", "L6"]];
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
          s.addShape(pres.ShapeType.roundRect, { x: x + 0.16, y: ty, w: w - 0.32, h: y + hh - 0.16 - ty, rectRadius: 0.1 * RS, fill: { color: C.background2 }, line: { color: C.background2, width: 0 }, objectName: nm(5, "rise", "tipbg") });
          txt(s, [{ text: "Prep tip", options: { bold: true, color: C.text2, fontSize: 13, breakLine: true } }, { text: "Sunday: grill chicken, brown the turkey and beef, hard-boil eggs and bake frittata cups. Cook rice, quinoa and sweet potato only for Mon, Tue and Thu.", options: { fontSize: 11.5, color: C.text1 } }], { x: x + 0.3, y: ty + 0.1, w: w - 0.6, h: y + hh - 0.36 - ty, valign: "top", paraSpaceAfter: 4, objectName: nm(5, "rise", "tiptxt") });
        }
      });
      txt(s, "Grains are dry measure; legumes are cooked. Buy halal-certified meat and whey. Check yogurt, broth and sauce labels for gelatin and alcohol.", { x: MX, y: 6.74, w: W - 2 * MX, h: 0.3, fontSize: 10.5, italic: true, color: C.accent5, objectName: nm(6, "fade", "gfoot") });
    }
    for (const d of days) {
      const s = newSlide("DAY", sec, "morph", false);
      s.addText(`Day ${d.day}`, { placeholder: "title" });
      txt(s, `${dLong(d.day)}  ·  Week ${wk.week}  ·  Day ${d.day} of 30`, { x: 0.45, y: 0.9, w: 3.85, h: 0.3, fontSize: 12, color: C.accent5, objectName: "!!sub" });
      s.addShape(pres.ShapeType.roundRect, { x: 2.3, y: 0.38, w: 2.0, h: 0.42, rectRadius: 0.1 * RS, fill: { color: TIERCOL[d.tier] }, line: { color: TIERCOL[d.tier], width: 0 }, objectName: "!!tier" });
      txt(s, TIERLONG[d.tier], { x: 2.3, y: 0.38, w: 2.0, h: 0.42, fontSize: 11, bold: true, color: "FFFFFF", align: "center", valign: "middle", objectName: "!!tiert" });
      const pc = macroPct(d);
      s.addChart(pres.charts.DOUGHNUT, [{ name: "Macros", labels: ["Protein", "Carbs", "Fat"], values: [d.p * 4, d.c * 4, d.f * 9] }],
        { x: 0.45, y: 1.3, w: 1.95, h: 1.95, holeSize: 68, chartColors: [HEX.P, HEX.C, HEX.F], showLegend: false, showLabel: false, showValue: false, showPercent: false, dataBorder: { pt: 2, color: HEX.daybg }, objectName: "!!ring" });
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
      txt(s, "Nutrition Facts", { x: px + 0.14, y: py + 0.06, w: pw - 0.28, h: 0.4, fontSize: 20, bold: true, color: C.text1, fontFace: THEME.headFontFace, valign: "middle", objectName: "!!nfh" });
      txt(s, "Daily total  ·  3 meals  ·  % of daily target", { x: px + 0.14, y: py + 0.44, w: pw - 0.28, h: 0.24, fontSize: 10, color: C.accent5, objectName: "!!nfs" });
      s.addShape(pres.ShapeType.line, { x: px + 0.14, y: py + 0.72, w: pw - 0.28, h: 0, line: { color: C.text1, width: 4 }, objectName: "!!nfl1" });
      txt(s, "Calories", { x: px + 0.14, y: py + 0.78, w: 1.6, h: 0.5, fontSize: 16, bold: true, color: C.text1, valign: "middle", objectName: "!!nfc" });
      txt(s, fmt(d.kcal), { x: px + 1.5, y: py + 0.78, w: 1.4, h: 0.5, fontSize: 28, bold: true, color: C.text1, align: "right", valign: "middle", objectName: "!!nfcv" });
      txt(s, Math.round(d.kcal / TGT.kcal * 100) + "%", { x: px + 2.95, y: py + 0.78, w: 0.76, h: 0.5, fontSize: 13, bold: true, color: C.text1, align: "right", valign: "middle", objectName: "!!nfcp" });
      s.addShape(pres.ShapeType.line, { x: px + 0.14, y: py + 1.32, w: pw - 0.28, h: 0, line: { color: C.text1, width: 2 }, objectName: "!!nfl2" });
      const rowsNF = [
        ["Total Fat", d.f + " g", Math.round(d.f / TGT.f * 100) + "%", true, 0],
        ["Total Carbohydrate", d.c + " g", Math.round(d.c / d.ctarget * 100) + "%", true, 0],
        ["Dietary Fiber", d.fib + " g", Math.round(d.fib / TGT.fib * 100) + "%", false, 0.22],
        ["Net Carbs", (d.c - d.fib) + " g", "", false, 0.22],
        ["Protein", d.p + " g", Math.round(d.p / TGT.p * 100) + "%", true, 0],
      ];
      rowsNF.forEach(([l, v, p, b, ind], i) => {
        const y = py + 1.38 + i * 0.31;
        txt(s, [{ text: l + " ", options: { bold: b } }, { text: v, options: { bold: false } }], { x: px + 0.14 + ind, y, w: 2.7, h: 0.3, fontSize: 12.5, color: C.text1, valign: "middle", objectName: "!!nfr" + i });
        txt(s, p, { x: px + 2.95, y, w: 0.76, h: 0.3, fontSize: 12.5, bold: true, color: C.text1, align: "right", valign: "middle", objectName: "!!nfp" + i });
        s.addShape(pres.ShapeType.line, { x: px + 0.14, y: y + 0.3, w: pw - 0.28, h: 0, line: { color: HEX.rule, width: 0.75 }, objectName: "!!nfx" + i });
      });
      txt(s, d.tier === "KETO" ? [{ text: "Keto day: ", options: { bold: true } }, { text: `${d.c - d.fib} g net carbs  ·  16:8 window 12–8 PM  ·  halal, no pork` }] : d.tier === "LOW" ? [{ text: "Low-carb day: ", options: { bold: true } }, { text: `${d.c - d.fib} g net carbs  ·  optional 16:8 (12–8 PM)  ·  halal, no pork` }] : [{ text: "Training day: ", options: { bold: true } }, { text: `carbs fuel the session  ·  halal, no pork` }], { x: px + 0.14, y: py + 3.0, w: pw - 0.28, h: 0.55, fontSize: 10, color: C.text1, valign: "middle", objectName: "!!nfpur" });
      // meal cards: 3 tall photo cards
      d.meals.forEach((m, i) => {
        const cw = 2.69, cx = 4.55 + i * (cw + 0.13), cy = 0.28, ch = 6.72, iw = cw - 0.2;
        card(s, cx, cy, cw, ch, { name: "!!card" + i });
        s.addImage({ path: SQ(m.key), x: cx + 0.1, y: cy + 0.1, w: iw, h: iw, objectName: "!!img" + i });
        s.addShape(pres.ShapeType.rect, { x: cx + 0.1, y: cy + 0.1 + iw - 0.4, w: 1.12, h: 0.4, fill: { color: C.text2, transparency: 8 }, line: { color: C.text2, width: 0 }, objectName: "!!badge" + i });
        txt(s, `${m.kcal} kcal`, { x: cx + 0.1, y: cy + 0.1 + iw - 0.4, w: 1.12, h: 0.4, fontSize: 12.5, bold: true, color: C.background1, align: "center", valign: "middle", objectName: "!!badget" + i });
        const ty = cy + 0.1 + iw + 0.1;
        txt(s, `${m.slotShort}  ·  ${m.slotName.toUpperCase()}  ·  ${m.time}`, { x: cx + 0.14, y: ty, w: cw - 0.26, h: 0.24, fontSize: 9, bold: true, color: C.accent5, objectName: "!!slot" + i });
        txt(s, m.name, { x: cx + 0.14, y: ty + 0.25, w: cw - 0.26, h: 0.56, fontSize: 14, bold: true, color: C.text2, valign: "top", fit: "shrink", objectName: "!!name" + i });
        [["PROTEIN", m.p, HEX.P], ["CARBS", m.c, HEX.C], ["FAT", m.f, HEX.F]].forEach(([l, v, col], j) => {
          const x = cx + 0.14 + j * 0.8;
          s.addShape(pres.ShapeType.roundRect, { x, y: ty + 0.86, w: 0.74, h: 0.52, rectRadius: 0.08 * RS, fill: { color: col, transparency: 62 }, line: { color: col, width: 0 }, objectName: `!!chip${i}${j}` });
          txt(s, [{ text: Math.round(v) + " g", options: { bold: true, fontSize: 13, breakLine: true } }, { text: l, options: { fontSize: 8, bold: true } }], { x, y: ty + 0.86, w: 0.74, h: 0.52, color: C.text1, align: "center", valign: "middle", objectName: `!!chipt${i}${j}` });
        });
        const all = [...m.lines.map(t => ({ t, add: false })), ...m.adds.map(t => ({ t: "+ " + t, add: true }))];
        const lines = all.map((o, j) => ({ text: o.t, options: { bold: o.add, color: o.add ? HEX.dk2 : HEX.dk1, breakLine: j < all.length - 1 } }));
        const ly = ty + 1.48;
        s.addShape(pres.ShapeType.line, { x: cx + 0.14, y: ly - 0.04, w: cw - 0.28, h: 0, line: { color: HEX.line, width: 0.75 }, objectName: "!!sep" + i });
        txt(s, lines, { x: cx + 0.14, y: ly + 0.04, w: cw - 0.24, h: cy + ch - ly - 0.14, fontSize: all.length > 7 ? 10.5 : 11.5, valign: "top", paraSpaceAfter: 2, objectName: "!!list" + i });
      });
      s.addNotes(`Day ${d.day} (${dLong(d.day)}), ${TIERLONG[d.tier].toLowerCase()}: ${fmt(d.kcal)} kcal, ${d.p} g protein, ${d.c} g carbs (target ${d.ctarget} g), ${d.f} g fat, ${d.fib} g fiber. Bold lines starting with + are the day's add-ons (carb sides or protein top-ups).`);
    }
  }

  // ---------- SWAP GUIDE ----------
  pres.addSection({ title: "Swap guide" });
  {
    const s = newSlide("DARK", "Swap guide", "fade", true);
    s.addText("Swap guide: trade like for like", { placeholder: "title" });
    const rules = [["1", "Same column only", "Protein for protein, carb for carb, vegetable for vegetable, fat for fat. Never eggs for rice, or green beans for salmon."], ["2", "Match the macro, not the volume", "Use the portion on each card. Each one is a standard FatSecret-style serving with its full macros."], ["3", "Keep the caps", "Whole eggs ≤ 3 a day, whey ≤ 2 scoops a day. Halal meat only, never pork or gelatin. Carb sides stay on training days."], ["4", "Log the swap", "Swaps shift the day's totals slightly. Keep the day within about ±50 kcal and protein at its usual level."]];
    rules.forEach(([n, h, t], i) => {
      const x = MX + (i % 2) * 6.15, y = 1.45 + Math.floor(i / 2) * 2.0, w = 5.98;
      s.addShape(pres.ShapeType.roundRect, { x, y, w, h: 1.82, rectRadius: 0.12 * RS, fill: { color: "FFFFFF", transparency: 90 }, line: { color: "FFFFFF", width: 0.75, transparency: 60 }, objectName: nm(1 + i, "rise", "sr" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: y + 0.3, w: 0.7, h: 0.7, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: nm(1 + i, "rise", "src" + i) });
      txt(s, n, { x: x + 0.25, y: y + 0.3, w: 0.7, h: 0.7, fontSize: 24, bold: true, color: "FFFFFF", align: "center", valign: "middle", objectName: nm(1 + i, "rise", "srn" + i) });
      txt(s, [{ text: h, options: { bold: true, fontSize: 18, color: "FFFFFF", breakLine: true } }, { text: t, options: { fontSize: 13.5, color: C.accent6 } }], { x: x + 1.2, y: y + 0.18, w: w - 1.4, h: 1.5, valign: "middle", paraSpaceAfter: 4, objectName: nm(1 + i, "rise", "srt" + i) });
    });
    const strip = [["D2", "PROTEINS"], ["B6", "CARBS"], ["L3", "VEGETABLES"], ["L6", "FATS"]];
    strip.forEach(([k, l], i) => {
      const x = MX + i * 3.07, y = 5.55, w = 2.9;
      s.addImage({ path: STRIP(k), x, y, w, h: 1.0, objectName: nm(5 + i, "rise", "ss" + i) });
      s.addShape(pres.ShapeType.rect, { x, y: y + 0.62, w, h: 0.38, fill: { color: "000000", transparency: 45 }, line: { color: "000000", width: 0 }, objectName: nm(5 + i, "rise", "ssb" + i) });
      txt(s, `${FOODS.filter(f => f.cat === { PROTEINS: "protein", CARBS: "carb", VEGETABLES: "veg", FATS: "fat" }[l]).length} ${l}`, { x, y: y + 0.62, w, h: 0.38, fontSize: 12, bold: true, color: "FFFFFF", align: "center", valign: "middle", charSpacing: 3, objectName: nm(5 + i, "rise", "sst" + i) });
    });
  }
  const CATS = [["protein", "Proteins", "D2", HEX.P, "Pick one per meal slot. Keep the halal source. Legumes count as protein but bring carbs."], ["carb", "Carbs", "B6", HEX.C, "Carb sides belong on training days. On low-carb days keep to a small fruit, or none."], ["veg", "Vegetables", "L3", HEX.veg, "Swap cup for cup. Carrots run higher in carbs than leafy or green vegetables."], ["fat", "Fats", "L6", HEX.F, "Portions are small on purpose: 1 tsp oil, ½ oz nuts, 1 tbsp seeds."]];
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
        s.addShape(pres.ShapeType.roundRect, { x: bx, y: y + 1.14, w: bw, h: 0.32, rectRadius: 0.05 * RS, fill: { color: cc, transparency: 62 }, line: { color: cc, width: 0 }, objectName: nm(o, "rise", `${lab}x${j}`) });
        txt(s, `${l} ${Math.round(v * 10) / 10}`, { x: bx, y: y + 1.14, w: bw, h: 0.32, fontSize: 9.5, bold: true, color: C.text1, align: "center", valign: "middle", objectName: nm(o, "rise", `${lab}xt${j}`) });
      });
      txt(s, `Fiber ${f.fib} g  ·  Net carbs ${Math.round((f.c - f.fib) * 10) / 10} g`, { x: x + 0.06, y: y + 1.5, w: cw - 0.12, h: 0.22, fontSize: 7.5, color: C.accent5, objectName: nm(o, "rise", lab + "m") });
    });
    s.addNotes(`${label}: ${items.length} approved swaps. Values are per listed portion, using FatSecret / USDA-style serving data. All choices are halal-friendly: use halal-certified meat and whey. ${items.filter(f => f.note).map(f => f.n + ": " + f.note).join(" ")}`);
  });

  // ---------- MONITORING ----------
  pres.addSection({ title: "Review" });
  {
    const s = newSlide("DARK", "Review", "fade", true);
    s.addText("Monitoring: what to track, when to adjust", { placeholder: "title" });
    const cols = [
      ["scale", "Weekly check-in", ["Weigh once a week: same morning, after the bathroom, before food", "Target 1–1.2 lb a week (20 lb in about 17 weeks)", "Losing over 2 lb a week for 2 weeks: add 100 kcal", "Under 0.5 lb for 2 weeks: check logging, then +1,500 steps or −100 kcal", "Waist, hips and thighs every 2 weeks; photos every 4"]],
      ["dumb", "Training and recovery", ["Mon / Tue / Thu: 1 h resistance + plyometrics, carbs around the session", "Protein 35–65 g at each main meal, within 2 h after training", "Sleep 7 h or more; strength dropping means add carbs on training days", "Keto days: add salt and electrolytes if tired or headachy"]],
      ["vial", "Health checks and planning", ["Annual bloodwork: lipids, glucose, vitamin D, ferritin and iron", "Hunger, mood and cycle: report big changes to her physician", "Ramadan is expected around Feb 8, 2027 (confirm by moon sighting). Ask for a suhoor and iftar version of this plan before then", "Travel and eating out: protein first, then vegetables, carbs last"]],
    ];
    cols.forEach(([ic, h, items], i) => {
      const x = MX + i * 4.1, w = 3.93, y = 1.45, hh = 4.45;
      s.addShape(pres.ShapeType.roundRect, { x, y, w, h: hh, rectRadius: 0.12 * RS, fill: { color: "FFFFFF", transparency: 90 }, line: { color: "FFFFFF", width: 0.75, transparency: 60 }, objectName: nm(1 + i, "rise", "mc" + i) });
      s.addShape(pres.ShapeType.ellipse, { x: x + 0.25, y: y + 0.25, w: 0.62, h: 0.62, fill: { color: C.accent6 }, line: { color: C.accent6, width: 0 }, objectName: nm(1 + i, "rise", "mci" + i) });
      s.addImage({ data: IC[ic], x: x + 0.4, y: y + 0.4, w: 0.32, h: 0.32, objectName: nm(1 + i, "rise", "mcii" + i) });
      txt(s, h, { x: x + 1.05, y: y + 0.25, w: 2.7, h: 0.62, fontSize: 18, bold: true, color: C.background1, valign: "middle", objectName: nm(1 + i, "rise", "mch" + i) });
      txt(s, items.map((t, j) => ({ text: t, options: { bullet: { indent: 14 }, breakLine: j < items.length - 1 } })), { x: x + 0.25, y: y + 1.12, w: w - 0.5, h: hh - 1.25, fontSize: 13, color: C.background1, valign: "top", paraSpaceAfter: 6, objectName: nm(1 + i, "rise", "mct" + i) });
    });
    s.addShape(pres.ShapeType.roundRect, { x: MX, y: 6.1, w: W - 2 * MX, h: 0.75, rectRadius: 0.12 * RS, fill: { color: C.accent1 }, line: { color: C.accent1, width: 0 }, objectName: nm(4, "rise", "succbg") });
    txt(s, [{ text: "Day-30 success markers   ", options: { bold: true } }, { text: "−4 to −5 lb on the weekly average  ·  waist down  ·  lifts and plyo up  ·  energy stable  ·  check-ups booked" }], { x: MX + 0.3, y: 6.1, w: W - 2 * MX - 0.6, h: 0.75, fontSize: 14, color: C.text2, valign: "middle", objectName: nm(4, "rise", "succtxt") });
  }
  {
    const s = newSlide("CONTENT", "Review", "fade", true);
    s.addText("Notes for dietitian review", { placeholder: "title" });
    const L = [
      "Macros are computed per ingredient from FatSecret / USDA serving values and summed per meal and per day; real-world variation is about ±5–10%.",
      `Daily totals land within ${fmt(mm.kmin)}–${fmt(mm.kmax)} kcal and ${mm.pmin}–${mm.pmax} g protein. Whey is used only when a day falls short of its protein floor (140 g, or 120 g on keto days).`,
      "Carbs follow training: about 95 g on Mon, Tue and Thu (never above 100 g), about 45 g on Fri and Sun, and 20 g net or less on the two keto days (Wed, Sat). No pork, alcohol or pork-derived ingredient appears in any meal.",
    ];
    const R = [
      "20 lb in 4 months needs about 1.15 lb a week, a deficit near 570 kcal a day. At about 1,461 kcal against a ~2,000 kcal TDEE the expected pace is about 1.1 lb a week, so 19–20 lb is realistic but on the fast side. Dropping ~100 kcal is the lever if progress stalls.",
      "The TDEE estimate (BMR ~1,306 × activity, plus 10k steps) can be off by ±10%. Re-check after 3–4 weekly weigh-ins before changing anything.",
      "Protein near 2.2 g/kg is high but suits heavy training; confirm with her physician if she has kidney disease. Shrimp is accepted by most, not all, halal schools: swap for fish if preferred.",
    ];
    [["Method", L, 0], ["Clinical judgment calls", R, 1]].forEach(([h, items, i]) => {
      const x = MX + i * 6.2, w = 5.93;
      card(s, x, 1.45, w, 4.4, { name: nm(1 + i, "rise", "nc" + i) });
      txt(s, h, { x: x + 0.3, y: 1.65, w: w - 0.6, h: 0.5, fontSize: 20, bold: true, color: C.text2, valign: "middle", objectName: nm(1 + i, "rise", "nch" + i) });
      txt(s, items.map((t, j) => ({ text: t, options: { bullet: { indent: 16 }, breakLine: j < items.length - 1 } })), { x: x + 0.3, y: 2.3, w: w - 0.6, h: 3.4, fontSize: 14, color: C.text1, valign: "top", paraSpaceAfter: 10, objectName: nm(1 + i, "rise", "nct" + i) });
    });
    s.addShape(pres.ShapeType.roundRect, { x: MX, y: 6.05, w: W - 2 * MX, h: 0.7, rectRadius: 0.12 * RS, fill: { color: C.background2 }, line: { color: C.background2, width: 0 }, objectName: nm(3, "rise", "endbg") });
    txt(s, "Prepared as a draft for the treating dietitian's review. It does not replace individual medical advice.", { x: MX + 0.3, y: 6.05, w: W - 2 * MX - 0.6, h: 0.7, fontSize: 13, italic: true, color: C.text2, valign: "middle", objectName: nm(3, "rise", "endtxt") });
  }

  await pres.writeFile({ fileName: OUT });
  await applyTheme(OUT, THEME);
  fs.writeFileSync(path.join(__dirname, "meta.json"), JSON.stringify(meta));
  console.log("slides:", slideNo, "->", OUT);
})().catch(e => { console.error(e); process.exit(1); });
