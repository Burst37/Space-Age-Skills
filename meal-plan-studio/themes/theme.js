// Resolve a theme key from themes.json into the tokens the deck builders use.
const fs = require("fs"), path = require("path");
const ALL = JSON.parse(fs.readFileSync(path.join(__dirname, "themes.json"), "utf8")).themes;
function resolve(key) {
  const t = ALL.find(x => x.key === key) || ALL[0];
  const c = t.colors;
  return {
    key: t.key, name: t.name, layout: t.layout, radius: t.radius,
    THEME: { name: t.name, headFontFace: t.fonts.head, bodyFontFace: t.fonts.body, colors: { ...c, lt1: "FFFFFF", hlink: c.accent1, folHlink: c.accent5 } },
    HEX: { P: c.accent1, C: c.accent2, F: c.accent4, dk2: c.dk2, lt2: c.lt2, line: t.line, dk1: c.dk1, mute: c.accent5, red: c.accent3, daybg: t.daybg, rule: t.rule, veg: t.veg },
    TIERCOL: t.tiers,
  };
}
module.exports = { resolve, keys: ALL.map(t => t.key) };
