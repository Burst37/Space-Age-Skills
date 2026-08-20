#!/usr/bin/env node
/**
 * Generate THIN per-platform adapters from the canonical SKILL.md.
 * Adapters contain ONLY: invocation syntax + a pointer back to SKILL.md.
 * They never duplicate the workflow (that was the v3 distribution bug).
 *
 *   node adapters/build-adapters.mjs            # writes adapters/<platform>/...
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const skill = fs.readFileSync(path.join(root, 'SKILL.md'), 'utf8');
const desc = (skill.match(/^description:\s*(.+)$/m) || [, ''])[1].trim();
const version = (skill.match(/^version:\s*(.+)$/m) || [, '0.0.0'])[1].trim();

const HEADER = '<!-- AUTO-GENERATED from SKILL.md. Do not edit. Run: node adapters/build-adapters.mjs -->';

function findRepoRoot(dir) {
  let cur = dir;
  while (cur !== path.parse(cur).root) {
    if (fs.existsSync(path.join(cur, '.git'))) return cur;
    cur = path.dirname(cur);
  }
  return null;
}
const repoRoot = findRepoRoot(root);
const skillPath = repoRoot ? path.relative(repoRoot, path.join(root, 'SKILL.md')) : path.join(path.basename(root), 'SKILL.md');
const POINTER = `Canonical workflow: see \`${skillPath}\` (v${version}). Load reference files on demand. Do not duplicate the workflow here.`;

const targets = [
  { dir: '.cursor/commands', file: 'website-fusion.md', fmt: 'md' },
  { dir: '.windsurf/workflows', file: 'website-fusion.md', fmt: 'md' },
  { dir: '.clinerules', file: 'website-fusion.md', fmt: 'md' },
  { dir: '.roo/rules', file: 'website-fusion.md', fmt: 'md' },
  { dir: '.continue/commands', file: 'website-fusion.md', fmt: 'md' },
  { dir: '.opencode/commands', file: 'website-fusion.md', fmt: 'md' },
  { dir: '.augment/commands', file: 'website-fusion.md', fmt: 'md' },
  { dir: '.gemini/commands', file: 'website-fusion.toml', fmt: 'toml' },
  { dir: '.amazonq/cli-agents', file: 'website-fusion.json', fmt: 'json' },
];

const mdBody = `${HEADER}\n\n# Website Fusion Engine\n\n${desc}\n\n${POINTER}\n\nInvoke: \`/website-fusion <manifest.json | onboarding.md> [--tier quick|standard|flagship]\`\n`;

for (const t of targets) {
  const dir = path.join(root, 'adapters', t.dir);
  fs.mkdirSync(dir, { recursive: true });
  let body;
  if (t.fmt === 'md') body = mdBody;
  else if (t.fmt === 'toml') body = `# ${HEADER}\nname = "website-fusion"\ndescription = "${desc.replace(/"/g, '\\"')}"\nprompt = '''\n${POINTER}\n'''\n`;
  else body = JSON.stringify({ name: 'website-fusion', description: desc, pointer: POINTER, invoke: '/website-fusion <manifest|onboarding> [--tier]' }, null, 2) + '\n';
  fs.writeFileSync(path.join(dir, t.file), body);
  console.log('wrote', path.relative(root, path.join(dir, t.file)));
}
console.log(`\n${targets.length} thin adapters generated from SKILL.md v${version}.`);
