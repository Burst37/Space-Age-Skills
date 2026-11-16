#!/usr/bin/env node
/**
 * CWB shot lint (v3.5) — every generated clip starts as one JSON shot spec; this rejects vague or contradictory ones
 * before credits are spent, and compiles the spec into a model-ready prompt.
 *
 *   node scripts/shot-lint.mjs handoff/assets/shots            # lint every *.json in the folder (or one file)
 *   node scripts/shot-lint.mjs handoff/assets/shots/hero.json --compile     # print the prose prompt (I2V master order)
 *   [--today 2026-11-16] [--max-roster-age 30]
 *
 * Schema + field meanings: references/video-json-prompting.md. Cinematography values come from
 * space-age-cinematic-director (v4.1): one primary move, physical camera path, tiered meta tokens.
 */
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';

const str = (v) => typeof v === 'string' && v.trim().length > 0;
const TIER_C = /\.(R3D|MOV|CR2|ARW|DNG|MXF)\b|\b[A-Z]\d{3}_[A-Z]\d{3}_/;   // filename-style anchors: optional flavour only

export function lintShot(s, { today = new Date(), maxAge = 30 } = {}) {
  const e = [], need = (ok, msg) => { if (!ok) e.push(msg); };
  need(str(s.slot), 'slot: which page slot this clip fills');
  need(['i2v', 't2v', 'multi-shot'].includes(s.mode), 'mode: i2v | t2v | multi-shot');
  need(str(s.intent), 'intent: one sentence, what the viewer must feel or notice first');
  const m = s.model || {};
  need(str(m.id) && !/^REPLACE/.test(m.id) && str(m.platform), 'model.id + model.platform: the exact model, from the live roster (references/model-roster.md)');
  const age = (today - new Date(m.roster_checked)) / 864e5;
  need(str(m.roster_checked) && age >= 0 && age <= maxAge, `model.roster_checked: date the live roster was read, at most ${maxAge} days ago (got ${m.roster_checked || 'none'})`);
  need(Number(s.duration_s) > 0 && str(s.aspect_ratio), 'duration_s + aspect_ratio');
  if (s.web && !s.long_form) need(s.duration_s >= 3 && s.duration_s <= 10, 'website clips run 3–10 s (set long_form: true for a hero film)');
  need(Array.isArray(s.negatives) && s.negatives.length > 0, 'negatives: motion/identity constraints (director §15 step 7)');
  const shots = s.mode === 'multi-shot' ? s.shots || [] : [s];
  if (s.mode === 'multi-shot') { need(shots.length >= 2, 'multi-shot needs shots[] with at least 2 entries'); need(s.look_bible && str(s.look_bible.camera) && str(s.look_bible.lens_family) && str(s.look_bible.grade), 'look_bible: camera, lens_family, grade shared by every shot'); }
  shots.forEach((x, i) => {
    const at = s.mode === 'multi-shot' ? `shots[${i}].` : '';
    const c = x.camera || {}, l = x.lens || {}, sh = x.shot || {};
    need(str(sh.size) && str(sh.angle) && str(sh.composition), `${at}shot: size, angle, composition`);
    need(str(c.move), `${at}camera.move: the ONE primary move ("locked off" is a valid move)`);
    need(!/\b(and|then|while|into)\b|[+,&]/i.test(c.move || ''), `${at}camera.move has more than one move ("${c.move}"): one primary move per shot`);
    need(c.path && str(c.path.start) && str(c.path.end), `${at}camera.path: start → end framing`);
    need(Number(l.focal_length_mm) > 0 && str(l.aperture), `${at}lens: focal_length_mm + aperture`);
    need(x.lighting && str(x.lighting.key), `${at}lighting.key: source, direction, quality`);
    need(x.motion && str(x.motion.subject), `${at}motion.subject: the one physical action ("none" for a still-life loop)`);
  });
  if (s.mode === 'i2v') {
    const src = s.source || {};
    need(str(src.start_frame), 'source.start_frame: the approved anchor still (hero video is never text-to-video)');
    need(Array.isArray(src.invariants) && src.invariants.length > 0, 'source.invariants: what must not change (identity, logo, geometry, light direction)');
    if (s.loop) need(src.end_frame === src.start_frame || str(s.loop_method), 'loop: end_frame must equal start_frame, or name a loop_method');
  }
  const tokens = [...((s.meta_tokens || {}).tier_a || []), ...((s.meta_tokens || {}).tier_b || [])];
  need(tokens.length <= 5, 'meta_tokens: at most 5; tokens support the physical direction, they do not replace it');
  need(!tokens.some((t) => TIER_C.test(t)) || s.allow_tier_c === true, 'meta_tokens: filename-style (tier C) anchors are optional flavour, set allow_tier_c: true to keep them');
  if (s.web) { need(str(s.web.text_safe_zone), 'web.text_safe_zone: where copy sits over the clip'); need(!s.audio || s.audio === 'none', 'web clips are muted: audio must be "none"'); }
  return e;
}

/* Prose in the director's master order, for models that take text. The JSON stays the source of truth. */
export function compileShot(s) {
  const one = (x) => [
    `${x.shot.size}, ${x.shot.angle}. ${x.shot.composition}.`,
    x.motion.subject !== 'none' ? `Subject: ${x.motion.subject}.` : 'Subject holds still.',
    `Camera: ${x.camera.move}${x.camera.support ? ` on ${x.camera.support}` : ''}, from ${x.camera.path.start} to ${x.camera.path.end}${x.camera.speed ? `, ${x.camera.speed}` : ''}.`,
    x.motion.parallax ? `Parallax: ${x.motion.parallax}.` : '', x.motion.secondary ? `Secondary motion: ${x.motion.secondary}.` : '', x.motion.environment ? `Environment: ${x.motion.environment}.` : '',
    `${x.camera.body ? x.camera.body + ', ' : ''}${x.lens.focal_length_mm}mm${x.lens.family ? ' ' + x.lens.family : ''} at ${x.lens.aperture}${x.lens.focus ? ', ' + x.lens.focus : ''}.`,
    `Light: ${x.lighting.key}${x.lighting.fill ? '; fill ' + x.lighting.fill : ''}${x.lighting.evolution && x.lighting.evolution !== 'none' ? '; ' + x.lighting.evolution : ''}.`,
    x.color && x.color.grade ? `Grade: ${x.color.grade}.` : '',
  ].filter(Boolean).join(' ');
  const tokens = [...((s.meta_tokens || {}).tier_a || []), ...((s.meta_tokens || {}).tier_b || [])];
  return [
    s.mode === 'i2v' ? `Preserve from the source frame: ${s.source.invariants.join('; ')}.` : '',
    s.mode === 'multi-shot' ? `Look: ${s.look_bible.camera}, ${s.look_bible.lens_family}, ${s.look_bible.grade}.\n` + s.shots.map((x, i) => `Shot ${i + 1}${x.time ? ` (${x.time})` : ''}: ${one(x)}`).join('\n') : one(s),
    s.loop ? 'The last frame matches the first frame so the clip loops seamlessly.' : '',
    s.web ? `Keep ${s.web.text_safe_zone} clean for overlaid text.` : '',
    tokens.length ? tokens.join(', ') + '.' : '',
    `Constraints: ${s.negatives.join('; ')}.`,
  ].filter(Boolean).join('\n');
}

if (import.meta.url === pathToFileURL(process.argv[1] || '').href) {
  const args = process.argv.slice(2), target = args.find((a) => !a.startsWith('--') && args[args.indexOf(a) - 1] !== '--today' && args[args.indexOf(a) - 1] !== '--max-roster-age');
  const val = (n, d) => (args.includes(n) ? args[args.indexOf(n) + 1] : d);
  if (!target) { console.error('usage: shot-lint.mjs <shots dir | shot.json> [--compile] [--today YYYY-MM-DD] [--max-roster-age days]'); process.exit(2); }
  const files = statSync(target).isDirectory() ? readdirSync(target).filter((f) => f.endsWith('.json') && !f.endsWith('.example.json')).map((f) => join(target, f)) : [target];
  if (!files.length) { console.error(`no shot specs in ${target}`); process.exit(1); }
  let bad = 0;
  for (const f of files) {
    let shot; try { shot = JSON.parse(readFileSync(f, 'utf8')); } catch (err) { console.log(`FAIL ${f}\n  - not valid JSON: ${err.message}`); bad++; continue; }
    const errs = lintShot(shot, { today: new Date(val('--today', new Date().toISOString().slice(0, 10))), maxAge: Number(val('--max-roster-age', 30)) });
    if (errs.length) { bad++; console.log(`FAIL ${f}\n` + errs.map((x) => `  - ${x}`).join('\n')); }
    else { console.log(`ok   ${f}`); if (args.includes('--compile')) console.log('\n' + compileShot(shot) + '\n'); }
  }
  process.exit(bad ? 1 : 0);
}
