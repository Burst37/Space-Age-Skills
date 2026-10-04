#!/usr/bin/env node
/**
 * Website Fusion Engine CLI — the real tool the skill references.
 * Zero runtime dependencies (Node >= 18). Commands:
 *
 *   doctor [--json]              Capability report for the current environment.
 *   init <project-dir>          Scaffold the docs/ artifact tree + a manifest stub.
 *   validate <manifest.json>    Manifest is structurally complete + no UNDECIDED critical fields.
 *   scan <project-dir>          Secret scan. Fails closed (exit 1) on any finding.
 *   gate <project-dir> [--tier quick|standard|flagship]
 *                               Are the artifacts required for the tier present? exit 0 = authorized.
 *
 * Exit codes: 0 = pass/authorized, 1 = fail/blocked, 2 = usage error.
 */
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const cmd = args[0];
const flags = new Set(args.filter((a) => a.startsWith('--')));
const positional = args.slice(1).filter((a) => !a.startsWith('--'));
const tierArg = (() => {
  const i = args.indexOf('--tier');
  return i !== -1 ? args[i + 1] : null;
})();

const C = { red: '\x1b[31m', green: '\x1b[32m', yellow: '\x1b[33m', dim: '\x1b[2m', reset: '\x1b[0m' };
const ok = (s) => console.log(`${C.green}✓${C.reset} ${s}`);
const bad = (s) => console.log(`${C.red}✗${C.reset} ${s}`);
const warn = (s) => console.log(`${C.yellow}!${C.reset} ${s}`);

function have(bin, probe) {
  try { execSync(probe || `command -v ${bin}`, { stdio: 'ignore' }); return true; }
  catch { return false; }
}

// Must match exactly what forensics.mjs does (`await import('playwright')`).
// A resolvable `npx playwright --version` does NOT imply the local `playwright`
// package resolves as a module import — npx can satisfy the CLI from a global
// cache while `import('playwright')` still fails. Check the real import path.
function playwrightImportable() {
  try { execSync(`node -e "await import('playwright')"`, { stdio: 'ignore', shell: '/bin/bash' }); return true; }
  catch { return false; }
}

// ---------------------------------------------------------------- doctor
function doctor() {
  const checks = {
    node: { ok: true, detail: process.version },
    git: { ok: have('git'), detail: 'isolated worktrees + version control' },
    playwright: { ok: playwrightImportable(), detail: 'browser forensics + visual QA (tools/forensics.mjs)' },
    chromium: {
      ok: !!process.env.PLAYWRIGHT_BROWSERS_PATH || have('chromium', 'command -v chromium || command -v chromium-browser'),
      detail: 'headless capture engine',
    },
    firecrawl: { ok: !!process.env.FIRECRAWL_API_KEY, detail: 'static crawl/scrape (optional)' },
    imageMagick: { ok: have('convert', 'command -v convert || command -v magick'), detail: 'visual diff (optional)' },
  };
  const report = {
    version: '5.0.0',
    generated_at: new Date().toISOString(),
    capabilities: Object.fromEntries(
      Object.entries(checks).map(([k, v]) => [k, {
        status: v.ok ? 'available' : 'missing',
        purpose: v.detail,
      }]),
    ),
  };
  if (flags.has('--json')) { console.log(JSON.stringify(report, null, 2)); return 0; }
  console.log(`Website Fusion Engine — capability report (v${report.version})\n`);
  for (const [k, v] of Object.entries(checks)) (v.ok ? ok : (k === 'node' || k === 'git' ? bad : warn))(`${k.padEnd(13)} ${C.dim}${v.detail}${C.reset}`);
  console.log(`\n${C.dim}Missing optional tools are fine — mark the capability 'missing' and route around it.${C.reset}`);
  return 0;
}

// ------------------------------------------------------------------ init
const ARTIFACT_TREE = [
  'docs/intake', 'docs/research/sources', 'docs/design/section-specs',
  'docs/plans', 'docs/reviews', 'docs/qa',
];
const MANIFEST_STUB = {
  project: { name: '', domain: '', mode: 'rebrand', tier: 'standard', authorization: '', targetStack: '', hosting: '' },
  sources: [{ id: 'source-a', type: 'url', location: '', roles: ['layout'], exactness: 'close' }],
  identity: { name: '', tagline: '', colors: [], fonts: [], logoSource: '' },
  decisions: { navigation: 'UNDECIDED', hero: 'UNDECIDED', motion: 'UNDECIDED', pageTransitions: 'UNDECIDED', customCursor: 'UNDECIDED' },
  assets: { sources: [], mustUse: [], mustNotUse: [], generationAllowed: false },
  pages: [], applications: [], acceptanceCriteria: [], requiredDeliverables: [],
};
function init() {
  const dir = positional[0];
  if (!dir) { bad('usage: fusion.mjs init <project-dir>'); return 2; }
  for (const d of ARTIFACT_TREE) fs.mkdirSync(path.join(dir, d), { recursive: true });
  const mPath = path.join(dir, 'docs/intake/project-manifest.json');
  if (!fs.existsSync(mPath)) fs.writeFileSync(mPath, JSON.stringify(MANIFEST_STUB, null, 2) + '\n');
  ok(`scaffolded artifact tree under ${dir}/docs/`);
  ok(`manifest stub: ${mPath}`);
  return 0;
}

// -------------------------------------------------------------- validate
const CRITICAL = ['project.mode', 'project.authorization', 'project.targetStack'];
function get(obj, dotted) { return dotted.split('.').reduce((o, k) => (o == null ? o : o[k]), obj); }
function validate() {
  const mf = positional[0];
  if (!mf) { bad('usage: fusion.mjs validate <manifest.json>'); return 2; }
  let m;
  try { m = JSON.parse(fs.readFileSync(mf, 'utf8')); }
  catch (e) { bad(`cannot parse ${mf}: ${e.message}`); return 1; }
  let failed = 0;
  for (const f of CRITICAL) {
    const v = get(m, f);
    if (!v || v === 'UNDECIDED') { bad(`missing/UNDECIDED critical field: ${f}`); failed++; } else ok(`${f} = ${v}`);
  }
  const undecided = Object.entries(m.decisions || {}).filter(([, v]) => v === 'UNDECIDED').map(([k]) => k);
  if (undecided.length) { bad(`UNDECIDED decisions block implementation: ${undecided.join(', ')}`); failed++; }
  if (!Array.isArray(m.sources) || m.sources.length === 0) { bad('no sources defined'); failed++; }
  if (m.project?.authorization === 'inspiration-only' && m.project?.mode === 'faithful-recreation') {
    bad('faithful-recreation requires owned/client-approved/licensed, not inspiration-only'); failed++;
  }
  console.log(failed ? `\n${C.red}manifest INVALID (${failed} issue${failed > 1 ? 's' : ''})${C.reset}` : `\n${C.green}manifest valid${C.reset}`);
  return failed ? 1 : 0;
}

// ------------------------------------------------------------------ scan
const SECRET_PATTERNS = [
  [/AKIA[0-9A-Z]{16}/, 'AWS access key id'],
  [/-----BEGIN (?:RSA |EC |OPENSSH |DSA |PGP )?PRIVATE KEY-----/, 'private key'],
  [/sk-[A-Za-z0-9]{20,}/, 'OpenAI-style secret key'],
  [/sk-ant-[A-Za-z0-9-]{20,}/, 'Anthropic API key'],
  [/gh[pousr]_[A-Za-z0-9]{30,}/, 'GitHub token'],
  [/xox[baprs]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/AIza[0-9A-Za-z_\-]{35}/, 'Google API key'],
  [/(?:api[_-]?key|secret|password|passwd|token)\s*[:=]\s*['"][^'"\s]{8,}['"]/i, 'hardcoded credential'],
];
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage']);
const TEXT_EXT = new Set(['.js', '.mjs', '.ts', '.tsx', '.jsx', '.json', '.md', '.env', '.yml', '.yaml', '.html', '.css', '.txt', '.sh']);
function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.isDirectory()) { if (!SKIP_DIRS.has(e.name)) walk(path.join(dir, e.name), out); }
    else { const ext = path.extname(e.name); if (TEXT_EXT.has(ext) || e.name.startsWith('.env')) out.push(path.join(dir, e.name)); }
  }
  return out;
}
function scan() {
  const root = positional[0] || '.';
  const files = walk(root);
  const findings = [];
  for (const f of files) {
    const lines = fs.readFileSync(f, 'utf8').split('\n');
    lines.forEach((line, i) => {
      for (const [re, label] of SECRET_PATTERNS) {
        if (re.test(line) && !/example|placeholder|your[_-]?key|dummy|xxxx/i.test(line)) {
          findings.push({ file: path.relative(root, f), line: i + 1, type: label });
        }
      }
    });
  }
  const report = { version: '5.0.0', generated_at: new Date().toISOString(), scanned_files: files.length, findings, blocking_count: findings.length, status: findings.length ? 'blocked' : 'passed' };
  const outDir = path.join(root, 'docs/qa');
  if (fs.existsSync(path.dirname(outDir)) || fs.existsSync(root)) { fs.mkdirSync(outDir, { recursive: true }); fs.writeFileSync(path.join(outDir, 'secret-scan.json'), JSON.stringify(report, null, 2) + '\n'); }
  if (findings.length) { findings.forEach((x) => bad(`${x.type} — ${x.file}:${x.line}`)); console.log(`\n${C.red}secret scan BLOCKED (${findings.length})${C.reset}`); return 1; }
  ok(`secret scan passed — ${files.length} files, 0 findings`);
  return 0;
}

// ------------------------------------------------------------------ gate
const GATE_ARTIFACTS = {
  quick: ['docs/intake/project-manifest.json', 'docs/design/DESIGN.md'],
  standard: ['docs/intake/project-manifest.json', 'docs/research/capability-report.json', 'docs/design/DESIGN.md', 'docs/design/remix-matrix.json', 'docs/design/section-specs'],
  flagship: ['docs/intake/project-manifest.json', 'docs/research/capability-report.json', 'docs/design/DESIGN.md', 'docs/design/remix-matrix.json', 'docs/design/section-specs', 'docs/design/asset-ledger.json', 'docs/research/sources'],
};
function gate() {
  const root = positional[0];
  if (!root) { bad('usage: fusion.mjs gate <project-dir> [--tier quick|standard|flagship]'); return 2; }
  const tier = tierArg || 'standard';
  const required = GATE_ARTIFACTS[tier];
  if (!required) { bad(`unknown tier: ${tier}`); return 2; }
  let missing = 0;
  for (const rel of required) {
    const p = path.join(root, rel);
    if (fs.existsSync(p)) ok(rel); else { bad(`missing: ${rel}`); missing++; }
  }
  // flagship also requires motion-map for any motion-role source
  if (tier === 'flagship') {
    const motionMap = path.join(root, 'docs/design/motion-map.json');
    if (fs.existsSync(motionMap)) ok('docs/design/motion-map.json'); else { bad('missing: docs/design/motion-map.json (flagship)'); missing++; }
  }
  const status = missing ? 'blocked' : 'authorized';
  const out = path.join(root, 'docs/research');
  fs.mkdirSync(out, { recursive: true });
  fs.writeFileSync(path.join(out, 'implementation-gate.json'), JSON.stringify({ tier, status, missing, generated_at: new Date().toISOString() }, null, 2) + '\n');
  console.log(missing ? `\n${C.red}GATE: blocked (${missing} missing) — implementation forbidden${C.reset}` : `\n${C.green}GATE: authorized for ${tier} — implementation may begin${C.reset}`);
  return missing ? 1 : 0;
}

// --------------------------------------------------------------- dispatch
const table = { doctor, init, validate, scan, gate };
if (!table[cmd]) {
  console.log('Website Fusion Engine CLI\n\nUsage:\n  fusion.mjs doctor [--json]\n  fusion.mjs init <project-dir>\n  fusion.mjs validate <manifest.json>\n  fusion.mjs scan <project-dir>\n  fusion.mjs gate <project-dir> [--tier quick|standard|flagship]');
  process.exit(cmd ? 2 : 0);
}
process.exit(table[cmd]());
