/* guard.mjs - brand-copy provenance gate.
 *
 * Nothing brand-facing ships unless it traces to the client's own source or has
 * been explicitly signed off. The build refuses to write index.html otherwise.
 *
 *   SOURCE    the string's words occur in refs/pilotsson/index.html
 *   LEDGER    listed in COPY_LEDGER.tsv - known agent-written copy, awaiting the
 *             client's keep/cut decision. Grandfathered, never silently grown.
 *   VERBATIM  printed on a garment or sent by the client. Must match exactly;
 *             a near-miss is a hard failure, not a warning.
 *   NEW       none of the above -> BUILD FAILS.
 */
import fs from 'node:fs';
const R = '/home/user/lumen/site';
const SRC = '/home/user/lumen/refs/pilotsson/index.html';

const norm = s => s.replace(/&[a-z]+;|&#\d+;/gi, ' ')
  .replace(/[^a-z0-9 ]/gi, ' ').toLowerCase().split(/\s+/).filter(Boolean);

const srcWords = ' ' + norm(fs.readFileSync(SRC, 'utf8')).join(' ') + ' ';

function inSource(text) {
  const w = norm(text).filter(x => x.length > 2);
  if (!w.length) return true;
  if (w.length < 3) return srcWords.includes(' ' + w.join(' ') + ' ');
  const runs = [];
  for (let i = 0; i + 3 <= w.length; i++) runs.push(w.slice(i, i + 3).join(' '));
  return runs.filter(r => srcWords.includes(r)).length / runs.length >= 0.6;
}

const readList = f => fs.existsSync(`${R}/${f}`)
  ? fs.readFileSync(`${R}/${f}`, 'utf8').split('\n')
      .filter(l => l.trim() && !l.startsWith('#'))
  : [];

const ledger = new Set(readList('COPY_LEDGER.tsv').map(l => l.split('\t').pop().trim()));
const verbatim = readList('COPY_VERBATIM.tsv').map(l => {
  const p = l.split('\t');
  return { where: p[0].trim(), text: p[1].trim() };
});

const built = fs.readdirSync(`${R}/parts`).filter(f => f.endsWith('.html'))
  .map(f => ({ file: f, body: fs.readFileSync(`${R}/parts/${f}`, 'utf8') }));

const flat = s => s.replace(/<[^>]+>/g, ' ').replace(/&rsquo;/g, "'")
  .replace(/&[a-z]+;/gi, ' ').replace(/\s+/g, ' ').trim().toLowerCase();
const flatBody = flat(built.map(b => b.body).join('\n'));

const fail = [];

/* 1. verbatim client wording must survive untouched */
for (const v of verbatim) {
  if (!flatBody.includes(flat(v.text))) {
    fail.push(`VERBATIM ALTERED  ${v.where}`);
    fail.push(`      expected: "${v.text}"`);
  }
}

/* 2. no untraced brand copy may enter the build */
const seen = new Set();
const fresh = [];
for (const { file, body } of built) {
  body.split('\n').forEach((line, i) => {
    for (const m of line.matchAll(/>([^<>]{3,300})</g)) {
      const t = m[1].replace(/\s+/g, ' ').trim();
      if (!/[A-Za-z]{3}/.test(t)) continue;
      const key = file + ' ' + t;
      if (seen.has(key)) continue;
      seen.add(key);
      if (inSource(t) || ledger.has(t)) continue;
      // a fragment of a locked verbatim string is the client's own wording
      const words = s => norm(s.replace(/<[^>]+>/g, ' ')).join(' ');
      if (verbatim.some(v => words(v.text).includes(words(t)))) continue;
      fresh.push(`${file}:${i + 1}  ${t}`);
    }
  });
}
if (fresh.length) {
  fail.push(`UNTRACED COPY (${fresh.length}) - not in the client's source, not signed off:`);
  fresh.forEach(f => fail.push('      ' + f));
}

if (fail.length) {
  console.error('\nX  COPY GUARD FAILED - build blocked\n');
  fail.forEach(f => console.error('   ' + f));
  console.error('\n   To clear this, do ONE of:');
  console.error('     - restore the client\'s wording, or');
  console.error('     - get the line approved, then add it to COPY_LEDGER.tsv');
  console.error('   Do not add a line to the ledger to silence the guard.\n');
  process.exit(1);
}
console.log(`ok copy guard: ${seen.size} strings | ${verbatim.length} verbatim locked | 0 untraced`);
