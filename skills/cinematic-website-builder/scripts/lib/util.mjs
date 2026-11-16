/**
 * CWB shared helpers (no npm install required for the helpers themselves).
 *   loadDep(name)   import a package from: the script's own resolution, $CWB_NODE_MODULES,
 *                   ./node_modules in the cwd, or the global npm root. Returns null if absent.
 *   readYaml(path)  js-yaml when available, else a small built-in parser that covers the
 *                   subset CWB templates use (maps, lists, inline [a, b] / {a: 1}, quoted
 *                   strings, numbers, booleans, null, `|` and `>` blocks, # comments).
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';

const roots = () => {
  const r = [];
  if (process.env.CWB_NODE_MODULES) r.push(process.env.CWB_NODE_MODULES);
  r.push(join(process.cwd(), 'node_modules'));
  try { r.push(execSync('npm root -g', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim()); } catch {}
  return r;
};

export async function loadDep(name) {
  try { const m = await import(name); return m.default && Object.keys(m).length <= 2 ? m.default : m; } catch {}
  for (const root of roots()) {
    if (!existsSync(join(root, name))) continue;
    try { return createRequire(join(root, 'noop.js'))(name); } catch {}
  }
  return null;
}

/* ---------- YAML ---------- */
function scalar(s) {
  s = s.trim();
  if (s === '' || s === '~' || s === 'null') return null;
  if (s === 'true') return true;
  if (s === 'false') return false;
  if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
  if ((s[0] === '"' && s.at(-1) === '"')) { try { return JSON.parse(s); } catch { return s.slice(1, -1); } }
  if (s[0] === "'" && s.at(-1) === "'") return s.slice(1, -1).replace(/''/g, "'");
  if (s[0] === '[' && s.at(-1) === ']') return splitFlow(s.slice(1, -1)).map(scalar);
  if (s[0] === '{' && s.at(-1) === '}') {
    const o = {};
    for (const part of splitFlow(s.slice(1, -1))) { const i = part.indexOf(':'); if (i > 0) o[part.slice(0, i).trim()] = scalar(part.slice(i + 1)); }
    return o;
  }
  return s;
}
function splitFlow(s) {
  const out = []; let depth = 0, cur = '', q = null;
  for (const ch of s) {
    if (q) { cur += ch; if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; cur += ch; continue; }
    if (ch === '[' || ch === '{') depth++;
    if (ch === ']' || ch === '}') depth--;
    if (ch === ',' && depth === 0) { if (cur.trim()) out.push(cur.trim()); cur = ''; continue; }
    cur += ch;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}
function stripComment(line) {
  let q = null;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (q) { if (ch === q) q = null; continue; }
    if (ch === '"' || ch === "'") { q = ch; continue; }
    if (ch === '#' && (i === 0 || /\s/.test(line[i - 1]))) return line.slice(0, i);
  }
  return line;
}
export function parseYaml(text) {
  const raw = text.replace(/\t/g, '  ').split(/\r?\n/);
  const lines = [];
  for (let i = 0; i < raw.length; i++) {
    const l = raw[i];
    if (/^\s*(#.*)?$/.test(l) || /^---\s*$/.test(l)) continue;
    lines.push({ ind: l.match(/^ */)[0].length, text: stripComment(l).replace(/\s+$/, ''), raw: l, idx: i });
  }
  let p = 0;
  function block(ind) {
    if (p >= lines.length) return null;
    return lines[p].text.trimStart().startsWith('- ') || lines[p].text.trim() === '-' ? list(lines[p].ind) : map(lines[p].ind);
  }
  function blockScalar(parentInd, fold) {
    const buf = []; let min = null;
    // read raw lines following until indentation <= parentInd
    const startIdx = lines[p - 1].idx + 1;
    let i = startIdx;
    for (; i < raw.length; i++) {
      const l = raw[i];
      if (/^\s*$/.test(l)) { buf.push(''); continue; }
      const ind = l.match(/^ */)[0].length;
      if (ind <= parentInd) break;
      if (min === null) min = ind;
      buf.push(l.slice(min));
    }
    while (p < lines.length && lines[p].idx < i) p++;
    while (buf.length && buf.at(-1) === '') buf.pop();
    return fold ? buf.join(' ').replace(/\s+/g, ' ').trim() : buf.join('\n');
  }
  function value(rest, ind) {
    rest = rest.trim();
    if (rest === '|' || rest === '|-' || rest === '>' || rest === '>-') return blockScalar(ind, rest[0] === '>');
    if (rest !== '') return scalar(rest);
    if (p < lines.length && (lines[p].ind > ind || (lines[p].ind === ind && lines[p].text.trimStart().startsWith('- ')))) return block(ind + 1);
    return null;
  }
  function map(ind) {
    const o = {};
    while (p < lines.length && lines[p].ind === ind && !lines[p].text.trimStart().startsWith('- ')) {
      const t = lines[p].text.trim(); p++;
      const m = t.match(/^("[^"]+"|'[^']+'|[^:]+?)\s*:(\s+(.*))?$/);
      if (!m) continue;
      const key = m[1].replace(/^["']|["']$/g, '');
      o[key] = value(m[3] || '', ind);
    }
    return o;
  }
  function list(ind) {
    const a = [];
    while (p < lines.length && lines[p].ind === ind && (lines[p].text.trimStart().startsWith('- ') || lines[p].text.trim() === '-')) {
      const line = lines[p];
      const rest = line.text.trim().replace(/^-\s?/, '');
      if (rest === '') { p++; a.push(block(ind + 1)); continue; }
      const km = rest.match(/^("[^"]+"|'[^']+'|[A-Za-z0-9_\-.]+)\s*:(\s+(.*))?$/);
      if (km && !rest.startsWith('{') && !rest.startsWith('[')) {
        // list item that is a map: rewrite this line as a map line at ind+2
        const childInd = ind + 2 + (line.text.slice(ind + 1).match(/^ */)[0].length - 1);
        line.ind = childInd; line.text = ' '.repeat(childInd) + rest;
        a.push(map(childInd));
      } else { p++; a.push(scalar(rest)); }
    }
    return a;
  }
  const out = block(0);
  return out == null ? {} : out;
}

export async function readYaml(path) {
  const text = readFileSync(path, 'utf8');
  const y = await loadDep('js-yaml');
  if (y && y.load) return y.load(text) ?? {};
  return parseYaml(text);
}

export function toYaml(v, ind = 0) {
  const pad = ' '.repeat(ind);
  const q = (s) => (typeof s === 'string' && (s === '' || /[\n:#\[\]{},&*!|>'"%@`]|^\s|\s$|^(true|false|null|-?\d+(\.\d+)?)$/.test(s)) ? JSON.stringify(s) : String(s));
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    if (v.every((x) => x === null || typeof x !== 'object')) return '[' + v.map(q).join(', ') + ']';
    return '\n' + v.map((x) => {
      if (x && typeof x === 'object' && !Array.isArray(x)) {
        const body = toYaml(x, ind + 2).replace(/^\n/, '');
        return pad + '- ' + body.slice(ind + 2);
      }
      return pad + '- ' + toYaml(x, ind + 2).replace(/^\n/, '');
    }).join('\n');
  }
  if (v && typeof v === 'object') {
    const keys = Object.keys(v);
    if (!keys.length) return '{}';
    return '\n' + keys.map((k) => {
      const s = toYaml(v[k], ind + 2);
      return pad + k + ':' + (s.startsWith('\n') ? s : ' ' + s);
    }).join('\n');
  }
  return v === null || v === undefined ? 'null' : q(v);
}
