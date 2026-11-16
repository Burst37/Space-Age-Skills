#!/usr/bin/env node
/**
 * CWB goldfish review (v3.4) — fresh-context review of hand-off docs, adapted from Google's Elephant-Goldfish Model
 * (Apache-2.0). Protocol: references/goldfish-review.md. Lenses: references/goldfish-lenses.yaml.
 *
 *   node scripts/goldfish.mjs pack GR1 --handoff handoff [--target f]... [--source file|url]... [--tier factory] [--out dir]
 *       → <out>/<lens>/PROMPT.md, REPORT_FORMAT.md, target/, rules/, sources/, SOURCES.md, MANIFEST.json
 *         One packet per lens. Give a fresh subagent ONLY its packet path. Refuses conversation-like sources.
 *   node scripts/goldfish.mjs lint <report.md> [--resolved] [--json]
 *       → checks the report format; with --resolved every blocker/should needs a decision
 *         (fix | contest: reason | ask | accept-risk: reason). Exit 1 = malformed, a lens not run, or unresolved.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync, copyFileSync, statSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readYaml } from './lib/util.mjs';

const HERE = dirname(fileURLToPath(import.meta.url));
const SKILL = resolve(HERE, '..');
const args = process.argv.slice(2);
const cmd = args[0];
const all = (f) => args.flatMap((a, i) => (a === f ? [args[i + 1]] : []));
const opt = (f, d) => (args.includes(f) ? args[args.indexOf(f) + 1] : d);
const cfg = await readYaml(join(SKILL, 'references/goldfish-lenses.yaml'));
const SEV = ['blocker', 'should', 'nit'];
// Anything that smells like the elephant's memory is not a goldfish source.
const FORBIDDEN = /(transcript|conversation|chat[-_ ]?log|session[-_]?memory|notes?\.md$|memory|summary\.md$|\.jsonl$)/i;

const REPORT_FORMAT = `# Report format (copy exactly)

\`\`\`markdown
# Goldfish review <GATE> — <target file>

## Reviewer status
| Lens | Status |
|---|---|
| <lens-id> | completed |

## Paraphrase            (naive-client only: "What this site will do" / "Who it is for")

## Findings
| ID | Sev | Lens | Scope | Finding | Evidence | Decision |
|---|---|---|---|---|---|---|
| <GATE>-<n> | blocker/should/nit | <lens-id> | <section or line> | <what is wrong and the fix> | <rule file + wording / source / URL + what it shows / computed value> | |
\`\`\`
Leave Decision empty — the elephant fills it (fix | contest: reason | ask | accept-risk: reason).
If there are no findings, keep the table header and write "No findings" under it.`;

function usage() {
  console.error('usage: goldfish.mjs pack <GR1|GR2|GR3> --handoff dir [--target f]... [--source f|url]... [--tier t] [--lenses a,b] [--out dir]\n       goldfish.mjs lint <report.md> [--resolved] [--json]');
  process.exit(2);
}

async function pack() {
  const gate = args[1];
  const g = cfg.gates?.[gate];
  if (!g) usage();
  const handoff = opt('--handoff', 'handoff');
  const tier = opt('--tier', '');
  let lenses = opt('--lenses', '') ? opt('--lenses').split(',') : (tier === 'factory' ? cfg.lean.factory[gate] : g.lenses);
  if (!lenses.length) { console.log(JSON.stringify({ gate, skipped: `no lenses for tier ${tier}` })); return; }
  const targets = all('--target').length ? all('--target') : g.targets.map((t) => join(handoff, t)).filter((p) => existsSync(p));
  if (!targets.length) { console.error(`${gate}: no target docs found (looked in ${handoff} for ${g.targets.join(', ')})`); process.exit(1); }
  const sources = all('--source');
  const bad = [...targets, ...sources].filter((s) => FORBIDDEN.test(basename(s)));
  if (bad.length && !args.includes('--allow-notes')) {
    console.error(`${gate}: refusing conversation-like inputs (a goldfish never sees the elephant's memory): ${bad.join(', ')}`);
    process.exit(1);
  }
  const out = resolve(opt('--out', join(handoff, 'reviews', `${gate}-packets`)));
  const made = [];
  for (const id of lenses) {
    const L = cfg.lenses[id];
    if (!L) { console.error(`unknown lens ${id}`); process.exit(1); }
    const dir = join(out, id);
    for (const d of ['target', 'rules', 'sources']) mkdirSync(join(dir, d), { recursive: true });
    for (const t of targets) copyFileSync(t, join(dir, 'target', basename(t)));
    const rules = [];
    for (const r of L.rules) { const p = join(SKILL, r); if (existsSync(p)) { const n = r.replace(/\//g, '__'); copyFileSync(p, join(dir, 'rules', n)); rules.push(n); } }
    const urls = [], files = [], failed = [];
    for (const s of sources) {
      if (/^https?:\/\//.test(s)) {
        try {
          const res = await fetch(s, { redirect: 'follow' });
          const body = await res.text();
          const n = s.replace(/^https?:\/\//, '').replace(/[^\w.-]+/g, '_').slice(0, 80) + '.html';
          writeFileSync(join(dir, 'sources', n), body); urls.push(`${s} → sources/${n} (HTTP ${res.status}, raw HTML; render it yourself if you can open URLs)`);
        } catch (e) { failed.push(`${s} (${e.message}) — open it yourself if you can`); }
      } else if (existsSync(s) && statSync(s).isFile()) { copyFileSync(s, join(dir, 'sources', basename(s))); files.push(`sources/${basename(s)}`); }
      else if (existsSync(s)) { for (const f of readdirSync(s)) { const p = join(s, f); if (statSync(p).isFile() && !FORBIDDEN.test(f)) { copyFileSync(p, join(dir, 'sources', f)); files.push(`sources/${f}`); } } }
      else failed.push(`${s} (not found)`);
    }
    writeFileSync(join(dir, 'SOURCES.md'), `# Sources for ${id} (${gate})\n\n## Target docs\n${targets.map((t) => `- target/${basename(t)}`).join('\n')}\n\n## Rules (CWB)\n${rules.map((r) => `- rules/${r}`).join('\n')}\n\n## Sources\n${[...urls, ...files].map((s) => `- ${s}`).join('\n') || '- (none)'}\n${failed.length ? `\n## Not saved\n${failed.map((s) => `- ${s}`).join('\n')}\n` : ''}`);
    writeFileSync(join(dir, 'REPORT_FORMAT.md'), REPORT_FORMAT.replace(/<GATE>/g, gate));
    writeFileSync(join(dir, 'PROMPT.md'), `# Goldfish reviewer: ${L.title} (${id}) — gate ${gate}\n\n${cfg.common_mandate}\n## Your lens\n${L.checks.map((c) => `- ${c}`).join('\n')}\n\n## Do this\n1. Read SOURCES.md, then every file in target/, rules/ and sources/.\n2. Review the target docs through your lens only.\n3. Write your report in the format in REPORT_FORMAT.md, with Lens = ${id}, IDs ${gate}-${id}-1, -2 …\n`);
    writeFileSync(join(dir, 'MANIFEST.json'), JSON.stringify({ gate, lens: id, targets: targets.map((t) => basename(t)), rules, sources: [...urls, ...files], failed }, null, 2));
    made.push(dir);
  }
  console.log(JSON.stringify({ gate, lenses, packets: made, launch: 'one fresh subagent per packet; its task text = "Read <packet>/PROMPT.md and follow it." and nothing else' }, null, 2));
}

function cells(line) { return line.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim()); }
function tableAfter(md, heading) {
  const lines = md.split('\n'); const i = lines.findIndex((l) => new RegExp(`^##\\s+${heading}`, 'i').test(l));
  if (i < 0) return null;
  const rows = []; let started = false;
  for (const l of lines.slice(i + 1)) {
    if (/^##\s/.test(l)) break;
    if (/^\s*\|/.test(l)) { started = true; rows.push(cells(l)); } else if (started && l.trim()) break;
  }
  return rows.length >= 2 ? { head: rows[0].map((h) => h.toLowerCase()), rows: rows.slice(2) } : { head: [], rows: [] };
}

function lint() {
  const file = args[1]; if (!file || !existsSync(file)) usage();
  const md = readFileSync(file, 'utf8'); const resolved = args.includes('--resolved');
  const errors = [], warns = [];
  const st = tableAfter(md, 'Reviewer status');
  if (!st || !st.rows.length) errors.push('no "## Reviewer status" table');
  const status = Object.fromEntries((st?.rows || []).map((r) => [r[0].replace(/`/g, ''), (r[1] || '').toLowerCase()]));
  for (const [lens, s] of Object.entries(status)) {
    if (!cfg.lenses[lens]) errors.push(`unknown lens in status table: ${lens}`);
    if (!['completed', 'not run'].includes(s)) errors.push(`lens ${lens}: status must be "completed" or "not run" (got "${s}")`);
    if (s === 'not run') errors.push(`lens ${lens} did not run — retry once; a lens that did not run is never "zero findings"`);
  }
  const ft = tableAfter(md, 'Findings');
  if (!ft) errors.push('no "## Findings" table');
  const col = (n) => ft?.head.findIndex((h) => h.startsWith(n));
  const need = ['id', 'sev', 'lens', 'scope', 'finding', 'evidence'];
  for (const n of need) if (ft && col(n) < 0) errors.push(`findings table lacks a "${n}" column`);
  const counts = { blocker: 0, should: 0, nit: 0 }, open = [], ids = new Set();
  for (const r of ft?.rows || []) {
    const get = (n) => (col(n) >= 0 ? (r[col(n)] || '') : '');
    const id = get('id'); if (/^no findings$/i.test(id)) continue;
    if (!id) { errors.push('a finding has no ID'); continue; }
    if (ids.has(id)) errors.push(`duplicate ID ${id}`); ids.add(id);
    const sev = get('sev').toLowerCase().replace(/[^a-z]/g, '');
    if (!SEV.includes(sev)) { errors.push(`${id}: severity must be blocker/should/nit (got "${get('sev')}")`); continue; }
    counts[sev]++;
    const lens = get('lens').replace(/`/g, '');
    if (!status[lens]) errors.push(`${id}: lens "${lens}" is not in the status table`);
    if (!get('scope')) errors.push(`${id}: no scope (section or line)`);
    if (!get('finding')) errors.push(`${id}: empty finding`);
    if (!get('evidence') && !/judgment/i.test(get('finding'))) errors.push(`${id}: no evidence — cite a rule, source, URL or computed value, or mark it nit + "judgment"`);
    if (sev !== 'nit' && /judgment/i.test(get('evidence') + get('finding')) && !get('evidence').replace(/judgment/i, '').trim()) warns.push(`${id}: ${sev} rests on judgment only`);
    const dec = get('decision').toLowerCase();
    if (resolved && sev !== 'nit') {
      if (!dec) open.push(`${id} (${sev}) has no decision`);
      else if (!/^(fix|fixed|ask|contest|accept-risk)/.test(dec)) errors.push(`${id}: decision must be fix | contest: reason | ask | accept-risk: reason`);
      else if (/^(contest|accept-risk)\s*:?\s*$/.test(dec)) errors.push(`${id}: ${dec} needs a reason the reviewer could check`);
    }
  }
  const asks = (ft?.rows || []).filter((r) => col('decision') >= 0 && /^ask/i.test(r[col('decision')] || '')).map((r) => r[col('id')]);
  const ok = !errors.length && !(resolved && open.length);
  const out = { file, ok, counts, lenses: status, open, asks_for_chuma: asks, errors, warns, clean_round: ok && !(ft?.rows || []).some((r) => /blocker/i.test(r[col('sev')] || '') && !/^(fix|fixed|contest|accept-risk)/i.test(r[col('decision')] || '')) };
  console.log(args.includes('--json') ? JSON.stringify(out, null, 2) : [
    `${ok ? 'PASS' : 'FAIL'} ${file}`, `findings: ${counts.blocker} blocker · ${counts.should} should · ${counts.nit} nit`,
    ...errors.map((e) => `  error: ${e}`), ...open.map((e) => `  open: ${e}`), ...warns.map((e) => `  warn: ${e}`),
    asks.length ? `  ask Chuma at the next approval: ${asks.join(', ')}` : '',
  ].filter(Boolean).join('\n'));
  process.exit(ok ? 0 : 1);
}

if (cmd === 'pack') await pack(); else if (cmd === 'lint') lint(); else usage();
