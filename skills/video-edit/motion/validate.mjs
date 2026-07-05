#!/usr/bin/env node
/* Motion plan validator. Enforces the catalog + MOTION_DESIGN_LAWS before render.
   Usage:  node validate.mjs <plan.json>
   Exit 0 = PASS (warnings allowed), exit 1 = has errors. */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const catalog = JSON.parse(readFileSync(join(__dirname, "catalog.json"), "utf8"));
const planPath = process.argv[2];
if (!planPath) {
  console.error("usage: node validate.mjs <plan.json>");
  process.exit(2);
}
const plan = JSON.parse(readFileSync(resolve(planPath), "utf8"));

const errors = [];
const warnings = [];
const E = (i, msg) => errors.push(`  ✗ scene ${i} — ${msg}`);
const W = (msg) => warnings.push(`  ! ${msg}`);

const PALETTE = catalog.palette.map((c) => c.toUpperCase());
const hexRe = /#[0-9a-fA-F]{6}\b/g;
function scanPalette(value, i, where) {
  if (typeof value === "string") {
    const hits = value.match(hexRe) || [];
    for (const h of hits) if (!PALETTE.includes(h.toUpperCase())) E(i, `off-palette color ${h} in ${where} (palette is raisin/silver/lime only)`);
  } else if (Array.isArray(value)) {
    value.forEach((v, k) => scanPalette(v, i, `${where}[${k}]`));
  } else if (value && typeof value === "object") {
    for (const k of Object.keys(value)) scanPalette(value[k], i, `${where}.${k}`);
  }
}

const scenes = plan.scenes;
if (!Array.isArray(scenes) || scenes.length === 0) {
  console.error("PLAN INVALID: `scenes` must be a non-empty array.");
  process.exit(1);
}
if (scenes.length > catalog.maxScenes) W(`${scenes.length} scenes — over the ${catalog.maxScenes} soft cap; consider trimming (restraint).`);

const [DMIN, DMAX] = catalog.durationRange;
let totalFrames = 0;

scenes.forEach((s, i) => {
  totalFrames += s.durationInFrames || 0;
  const spec = catalog.vizzes[s.viz];
  if (!spec) { E(i, `unknown viz "${s.viz}". Pick from: ${Object.keys(catalog.vizzes).join(", ")}`); return; }
  const d = s.durationInFrames;
  if (typeof d !== "number" || d < DMIN || d > DMAX) E(i, `durationInFrames ${d} out of range [${DMIN}, ${DMAX}] (too short can't be read; too long drags).`);
  const p = s.props || {};
  for (const key of spec.required) if (p[key] === undefined) E(i, `${s.viz} missing required prop "${key}".`);
  scanPalette(p, i, "props");

  // viz-specific data sanity (the laws as data checks)
  if (s.viz === "lineChart" && Array.isArray(p.points) && Array.isArray(p.xLabels)) {
    if (p.points.length !== p.xLabels.length) E(i, `lineChart: points (${p.points.length}) and xLabels (${p.xLabels.length}) must match.`);
    if (typeof p.yMax === "number" && Math.max(...p.points) > p.yMax) E(i, `lineChart: yMax (${p.yMax}) is below max point (${Math.max(...p.points)}).`);
  }
  if (s.viz === "barChart" && Array.isArray(p.bars)) {
    if (p.bars.length < 2) E(i, `barChart: needs at least 2 bars to compare.`);
    p.bars.forEach((b, k) => { if (typeof b.value !== "number" || !b.label) E(i, `barChart bar[${k}] needs {label, value:number}.`); });
  }
  if (s.viz === "kpiStats" && Array.isArray(p.stats)) {
    if (p.stats.length < 2 || p.stats.length > 4) W(`scene ${i}: kpiStats reads best with 2-4 stats (has ${p.stats.length}).`);
    p.stats.forEach((st, k) => { if (typeof st.value !== "number" || !st.label) E(i, `kpiStats stat[${k}] needs {value:number, label}.`); });
  }
  if (s.viz === "network" && Array.isArray(p.nodes)) {
    if (p.nodes.length < 3 || p.nodes.length > 8) E(i, `network: nodes should be 3-8 (has ${p.nodes.length}).`);
  }
  if (s.viz === "layerStack" && Array.isArray(p.layers) && p.layers.length < 2) E(i, `layerStack: needs at least 2 layers.`);
  if (s.viz === "processFlow" && Array.isArray(p.steps) && (p.steps.length < 2 || p.steps.length > 4)) E(i, `processFlow: needs 2-4 steps (has ${p.steps.length}).`);
  if (s.viz === "comparison") {
    for (const side of ["left", "right"]) {
      const v = p[side];
      if (!v || !v.label || !v.stat || !v.sub) E(i, `comparison.${side} needs {label, stat, sub}.`);
    }
  }
});

console.log(`\nMotion plan: ${scenes.length} scenes, ${totalFrames} frames (${(totalFrames / catalog.fps).toFixed(1)}s @ ${catalog.fps}fps)`);
if (warnings.length) { console.log("\nWarnings:"); warnings.forEach((w) => console.log(w)); }
if (errors.length) {
  console.log(`\nFAIL — ${errors.length} error(s):`);
  errors.forEach((e) => console.log(e));
  process.exit(1);
}
console.log("\nPASS — plan obeys the catalog + motion laws.\n");
process.exit(0);
