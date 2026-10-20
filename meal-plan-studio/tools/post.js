// Post-process: dedupe media, add slide transitions + entrance animations + video autoplay.
const fs = require("fs"), path = require("path"), crypto = require("crypto");
const JSZip = require(require.resolve("jszip", { paths: [require.resolve("pptxgenjs")] }));
const [IN, OUT] = [process.argv[2], process.argv[3]];
const meta = JSON.parse(fs.readFileSync(process.env.META || path.join(__dirname, "meta.json"), "utf8"));
const NS_MC = "http://schemas.openxmlformats.org/markup-compatibility/2006";

const TRANS = {
  fade: '<p:transition spd="med"><p:fade/></p:transition>',
  push: '<p:transition spd="med"><p:push dir="l"/></p:transition>',
  wipe: '<p:transition spd="med"><p:wipe dir="r"/></p:transition>',
  morph: `<mc:AlternateContent xmlns:mc="${NS_MC}"><mc:Choice xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" Requires="p159"><p:transition spd="slow"><p159:morph option="byObject"/></p:transition></mc:Choice><mc:Fallback><p:transition spd="med"><p:fade/></p:transition></mc:Fallback></mc:AlternateContent>`,
  video: '<p:transition spd="slow" advTm="9800"><p:fade/></p:transition>',
};
const DUR = { fade: 500, rise: 600, wipe: 700, wheel: 900 };

function effectXml(ids, spid, eff, node, bld) {
  const d = DUR[eff];
  const preset = { fade: [10, 0], rise: [10, 0], wipe: [22, 8], wheel: [21, 1] }[eff];
  const grp = bld ? ' grpId="0"' : "";
  const filter = { fade: "fade", rise: "fade", wipe: "wipe(left)", wheel: "wheel(1)" }[eff];
  const tgt = `<p:tgtEl><p:spTgt spid="${spid}"/></p:tgtEl>`;
  let x = `<p:par><p:cTn id="${ids.n++}" presetID="${preset[0]}" presetClass="entr" presetSubtype="${preset[1]}" fill="hold"${grp} nodeType="${node}"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst>`;
  x += `<p:set><p:cBhvr><p:cTn id="${ids.n++}" dur="1" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>${tgt}<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst></p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>`;
  x += `<p:animEffect transition="in" filter="${filter}"><p:cBhvr><p:cTn id="${ids.n++}" dur="${d}"/>${tgt}</p:cBhvr></p:animEffect>`;
  if (eff === "rise") {
    x += `<p:anim calcmode="lin" valueType="num"><p:cBhvr additive="base"><p:cTn id="${ids.n++}" dur="${d}" fill="hold"/>${tgt}<p:attrNameLst><p:attrName>ppt_y</p:attrName></p:attrNameLst></p:cBhvr><p:tavLst><p:tav tm="0"><p:val><p:strVal val="#ppt_y+0.05"/></p:val></p:tav><p:tav tm="100000"><p:val><p:strVal val="#ppt_y"/></p:val></p:tav></p:tavLst></p:anim>`;
  }
  return x + "</p:childTnLst></p:cTn></p:par>";
}

const WRAP = (inner, bld) => `<p:timing><p:tnLst><p:par><p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot"><p:childTnLst><p:seq concurrent="1" nextAc="seek"><p:cTn id="2" dur="indefinite" nodeType="mainSeq"><p:childTnLst><p:par><p:cTn id="3" fill="hold"><p:stCondLst><p:cond delay="indefinite"/><p:cond evt="onBegin" delay="0"><p:tn val="2"/></p:cond></p:stCondLst><p:childTnLst>${inner}</p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn><p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst><p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst></p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>${bld ? `<p:bldLst>${bld}</p:bldLst>` : ""}</p:timing>`;

function animTiming(xml) {
  const els = [];
  const re = /<p:(sp|pic|graphicFrame|cxnSp)>[\s\S]*?<\/p:\1>/g;
  let m;
  while ((m = re.exec(xml))) {
    const nm = /<p:cNvPr id="(\d+)" name="([^"]*)"/.exec(m[0]);
    if (!nm) continue;
    const a = /^A(\d+)\|(\w+)\|/.exec(nm[2]);
    if (!a) continue;
    els.push({ spid: nm[1], order: +a[1], eff: a[2], kind: m[1], chart: m[0].includes("drawingml/2006/chart") });
  }
  if (!els.length) return "";
  const orders = [...new Set(els.map(e => e.order))].sort((a, b) => a - b);
  const ids = { n: 4 };
  let steps = "", bld = "", t = 0;
  orders.forEach((o, si) => {
    const group = els.filter(e => e.order === o);
    let inner = "";
    group.forEach((e, gi) => {
      const hasBld = e.kind === "sp" || e.kind === "cxnSp" || e.chart;
      inner += effectXml(ids, e.spid, e.eff, gi === 0 ? "afterEffect" : "withEffect", hasBld);
      if (e.kind === "sp" || e.kind === "cxnSp") bld += `<p:bldP spid="${e.spid}" grpId="0" animBg="1"/>`;
      else if (e.chart) bld += `<p:bldGraphic spid="${e.spid}" grpId="0"><p:bldAsOne/></p:bldGraphic>`;
    });
    steps += `<p:par><p:cTn id="${ids.n++}" fill="hold"><p:stCondLst><p:cond delay="${t}"/></p:stCondLst><p:childTnLst>${inner}</p:childTnLst></p:cTn></p:par>`;
    t += si === 0 ? 450 : 260;
  });
  return WRAP(steps, bld);
}

function videoTiming(xml) {
  const m = /<p:cNvPr id="(\d+)" name="IntroVideo"/.exec(xml);
  if (!m) return "";
  return WRAP(`<p:par><p:cTn id="4" fill="hold"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:par><p:cTn id="5" presetID="1" presetClass="mediacall" presetSubtype="0" fill="hold" nodeType="afterEffect"><p:stCondLst><p:cond delay="0"/></p:stCondLst><p:childTnLst><p:cmd type="call" cmd="playFrom(0.0)"><p:cBhvr><p:cTn id="6" dur="1" fill="hold"/><p:tgtEl><p:spTgt spid="${m[1]}"/></p:tgtEl></p:cBhvr></p:cmd></p:childTnLst></p:cTn></p:par></p:childTnLst></p:cTn></p:par>`, "");
}

(async () => {
  const zip = await JSZip.loadAsync(fs.readFileSync(IN));
  // ---- dedupe media
  const media = Object.keys(zip.files).filter(n => n.startsWith("ppt/media/") && !zip.files[n].dir);
  const canon = {}, remap = {};
  for (const n of media) {
    const buf = await zip.file(n).async("nodebuffer");
    const h = crypto.createHash("md5").update(buf).digest("hex") + path.extname(n);
    if (canon[h]) remap[path.basename(n)] = canon[h]; else canon[h] = path.basename(n);
  }
  let removed = 0;
  for (const n of Object.keys(zip.files).filter(n => n.endsWith(".rels"))) {
    let x = await zip.file(n).async("string"), ch = false;
    for (const [from, to] of Object.entries(remap)) if (x.includes("media/" + from + '"')) { x = x.split("media/" + from + '"').join("media/" + to + '"'); ch = true; }
    if (ch) zip.file(n, x);
  }
  for (const from of Object.keys(remap)) { zip.remove("ppt/media/" + from); removed++; }
  console.log("media files:", media.length, "-> removed duplicates:", removed);
  // ---- slides
  let nA = 0;
  for (const [idx, mt] of Object.entries(meta)) {
    const f = `ppt/slides/slide${idx}.xml`;
    let x = await zip.file(f).async("string");
    x = x.replace(/<p:transition[\s\S]*?<\/p:transition>/, "").replace(/<p:timing[\s\S]*?<\/p:timing>/, "");
    { let n = 0; x = x.replace(/<p:cNvPr id="\d+"/g, () => `<p:cNvPr id="${++n}"`); }
    if (process.env.SAFE) { zip.file(f, x); continue; }
    const isVideo = x.includes('name="IntroVideo"');
    const tr = isVideo ? TRANS.video : TRANS[mt.trans] || "";
    const tm = isVideo ? videoTiming(x) : mt.anim ? animTiming(x) : "";
    if (tm && !isVideo) nA++;
    x = x.replace("</p:sld>", tr + tm + "</p:sld>");
    zip.file(f, x);
  }
  console.log("animated slides:", nA);
  const buf = await zip.generateAsync({ type: "nodebuffer", compression: "DEFLATE", compressionOptions: { level: 6 } });
  fs.writeFileSync(OUT, buf);
  console.log("wrote", OUT, (buf.length / 1048576).toFixed(1), "MB");
})();
