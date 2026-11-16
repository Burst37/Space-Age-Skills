/* lead-jobs regression: scoring, dedupe, audit, job init, atomic claim, done-gate. Run: node tests/lead-jobs.test.mjs */
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readRows, score, auditHtml, initJob, claim, finish, sectorFor } from '../scripts/lead-jobs.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const leads = await score(readRows(join(here, 'fixtures', 'leads.csv')));
const by = Object.fromEntries(leads.map((l) => [l.slug, l]));
assert.equal(leads.length, 5, 'duplicate phone row is dropped');
assert.equal(by['green-valley-landscaping-mesquite'].priority, 'HIGH');
assert.equal(by['tonys-barber-shop-garland'].site.status, 'social-only');
assert.equal(by['tonys-barber-shop-garland'].priority, 'HIGH');
assert.equal(by['apex-roofing-storm-repair-dallas'].priority, 'AUDIT', 'own domain is never pitched unaudited');
assert.equal(by['no-phone-cleaning-plano'].priority, 'SKIP');
assert.equal(by['new-shop-nails-irving'].priority, 'MED', 'free builder but unproven (no reviews) is MED');
assert.equal(by['new-shop-nails-irving'].reviews, null, 'missing review count stays null');
assert.deepEqual(sectorFor('Tree service'), { sector: 'trades', schema_type: 'HomeAndConstructionBusiness', cta: 'Free estimate', profile: 'bold' });
assert.equal(sectorFor('Home health care service').profile, 'gentle');
assert.equal(sectorFor('Zeppelin hangar').schema_type, 'LocalBusiness');

const weak = auditHtml('<html><body><table width="600"><tr><td><font>Welcome</font> &copy; 2014</td></tr></table></body></html>', 'http://old.example', 2026);
assert.equal(weak.status, 'weak'); assert.ok(weak.reasons.includes('no mobile viewport (not responsive)'));
const ok = auditHtml(`<html><head><title>Good Co</title><meta name="viewport" content="width=device-width"><script type="application/ld+json">{}</script></head><body><h1>Good</h1><a href="tel:1">call</a><p>${'word '.repeat(200)}</p></body></html>`, 'https://good.example', 2026);
assert.equal(ok.status, 'decent'); assert.equal(ok.gap, 0);

const jobs = mkdtempSync(join(tmpdir(), 'cwb-jobs-'));
const high = leads.filter((l) => l.priority === 'HIGH');
const made = high.map((l) => initJob(l, jobs));
assert.equal(made.length, 2); assert.equal(initJob(high[0], jobs), null, 'existing job is not overwritten');
const brief = readFileSync(join(made[0], 'handoff', 'brief.md'), 'utf8');
assert.ok(!/\{\{\w+\}\}/.test(brief), 'brief has no unfilled placeholders'); assert.ok(/Hours: UNKNOWN/.test(brief), 'unknown facts are labelled, not invented');
const a = claim(jobs, 'harness-a'), b = claim(jobs, 'harness-b'), c = claim(jobs, 'harness-c');
assert.ok(a && b && a !== b, 'two harnesses get two different jobs'); assert.equal(c, null, 'third claim finds the queue empty');
assert.match(finish(a), /no passing qa\/report\.json/);
mkdirSync(join(a, 'site', 'qa'), { recursive: true });
writeFileSync(join(a, 'site', 'qa', 'report.json'), '{"pass":true}');
writeFileSync(join(a, 'site', 'index.html'), '<html><body>hi</body></html>');
assert.match(finish(a), /noindex/);
writeFileSync(join(a, 'site', 'index.html'), '<html><head><meta name="robots" content="noindex"></head><body><aside data-cwb-spec>Preview</aside></body></html>');
assert.equal(finish(a), null);
console.log('lead-jobs: all checks passed · jobs dir', jobs);
console.log('JOB=' + made[0]);
