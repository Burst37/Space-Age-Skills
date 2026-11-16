#!/usr/bin/env node
/**
 * CWB lead queue (v3.5) — Google Maps rows → scored leads → one job folder per site → claimed by any harness.
 *
 *   node scripts/lead-jobs.mjs score  leads.csv|.json|.jsonl [--audit] [--out leads.scored.json]
 *   node scripts/lead-jobs.mjs init   leads.scored.json --out jobs [--top 10] [--priority HIGH] [--tier factory]
 *   node scripts/lead-jobs.mjs claim  jobs --by <harness-id>        # prints the claimed job dir; exit 3 = queue empty
 *   node scripts/lead-jobs.mjs done   jobs/<slug> [--preview https://…]   # refuses without a passing qa/report.json
 *   node scripts/lead-jobs.mjs fail   jobs/<slug> --reason "…"
 *   node scripts/lead-jobs.mjs release jobs/<slug>                   # back to queued (crashed or abandoned run)
 *   node scripts/lead-jobs.mjs status jobs
 *
 * Rows come from spaceage-geofusion-x / GoSom / the Maps scraper kit / lead-to-brief sheets (column aliases below).
 * Missing facts stay null: nothing here invents a phone, review count, address or owner.
 * Protocol: references/lead-pipeline.md (scoring, spec-demo rules) and references/multi-harness.md (claiming).
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync, readdirSync, cpSync, rmSync } from 'node:fs';
import { join, dirname, resolve, extname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const SKILL = resolve(dirname(fileURLToPath(import.meta.url)), '..');

/* ---------- parse ---------- */
export function parseCsv(text) {
  const rows = []; let row = [], cur = '', q = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) { if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') q = false; else cur += c; continue; }
    if (c === '"') q = true;
    else if (c === ',') { row.push(cur); cur = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && text[i + 1] === '\n') i++; row.push(cur); cur = ''; if (row.some((v) => v.trim())) rows.push(row); row = []; }
    else cur += c;
  }
  row.push(cur); if (row.some((v) => v.trim())) rows.push(row);
  const head = (rows.shift() || []).map((h) => h.trim());
  return rows.map((r) => Object.fromEntries(head.map((h, i) => [h, (r[i] ?? '').trim()])));
}
export function readRows(file) {
  const text = readFileSync(file, 'utf8').replace(/^﻿/, '');
  const ext = extname(file).toLowerCase();
  if (ext === '.csv') return parseCsv(text);
  if (ext === '.jsonl') return text.split('\n').filter((l) => l.trim()).map((l) => JSON.parse(l));
  const data = JSON.parse(text);
  return Array.isArray(data) ? data : data.rows || data.leads || data.results || [];
}

/* ---------- normalize ---------- */
const ALIAS = {
  name: ['name', 'title', 'business_name', 'businessName'],
  category: ['category', 'categories', 'type', 'main_category'],
  address: ['address', 'complete_address', 'full_address', 'formatted_address'],
  city: ['city'], state: ['state', 'region'], zip: ['zip', 'postal_code'],
  phone: ['phone', 'phone_number', 'phoneNumber'],
  website: ['website', 'site', 'web_site', 'url', 'domain'],
  rating: ['rating', 'review_rating', 'stars', 'totalScore'],
  reviews: ['reviews', 'review_count', 'reviews_count', 'user_ratings_total', 'reviewsCount'],
  maps_url: ['maps_url', 'link', 'place_url', 'google_maps_url', 'source_url'],
  place_id: ['place_id', 'placeId', 'cid', 'data_id'],
  hours: ['hours', 'open_hours', 'opening_hours'],
  site_status: ['siteStatus', 'site_status'], site_notes: ['siteNotes', 'site_notes'],
};
const pick = (row, keys) => { for (const k of keys) { const v = row[k]; if (v != null && String(Array.isArray(v) ? v[0] : v).trim() !== '') return Array.isArray(v) ? v[0] : v; } return null; };
const num = (v) => { if (v == null) return null; const n = Number(String(v).replace(/[^\d.]/g, '')); return Number.isFinite(n) && String(v).match(/\d/) ? n : null; };
export const slugify = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-').slice(0, 60);

/* Maps category → CWB sector (the pickers' vocabulary), profile and a REAL schema.org type.
   Unknown categories fall back to LocalBusiness: never guess a subtype that schema.org does not define. */
const SECTORS = [
  [/home ?(health|care)|senior|caregiv|assisted/i, 'home-healthcare', 'LocalBusiness', 'Call us'],
  [/dent|orthodont/i, 'dental', 'Dentist', 'Book a visit'],
  [/law|attorney|legal/i, 'law', 'LegalService', 'Request a consultation'],
  [/clinic|medical|doctor|chiropr|physio|therap|urgent care|optom|veterin/i, 'medical', 'MedicalBusiness', 'Book a visit'],
  [/insur/i, 'insurance', 'InsuranceAgency', 'Get a quote'],
  [/plumb/i, 'trades', 'Plumber', 'Call now'],
  [/roof/i, 'trades', 'RoofingContractor', 'Free inspection'],
  [/hvac|heating|air cond|furnace/i, 'trades', 'HVACBusiness', 'Free quote'],
  [/electric/i, 'trades', 'Electrician', 'Get a quote'],
  [/paint/i, 'trades', 'HousePainter', 'Free estimate'],
  [/locksmith/i, 'trades', 'Locksmith', 'Call now'],
  [/mov(ing|ers)/i, 'trades', 'MovingCompany', 'Get a quote'],
  [/contractor|remodel|construct|concrete|fenc|landscap|lawn|tree|pest|clean|handyman|garage|pressure|pool|gutter|floor|paving|masonry|drywall|window|siding/i, 'trades', 'HomeAndConstructionBusiness', 'Free estimate'],
  [/auto|car |car$|tire|mechanic|body shop|detail|towing|transmission/i, 'automotive', 'AutoRepair', 'Book service'],
  [/barber/i, 'beauty', 'HairSalon', 'Book now'], [/nail/i, 'beauty', 'NailSalon', 'Book now'],
  [/salon|hair|lash|brow|beauty|makeup/i, 'beauty', 'BeautySalon', 'Book now'],
  [/spa|massage/i, 'wellness', 'DaySpa', 'Book now'], [/tattoo/i, 'beauty', 'TattooParlor', 'Book now'],
  [/gym|fitness|yoga|pilates|martial|boxing/i, 'fitness', 'ExerciseGym', 'Start a trial'],
  [/cafe|coffee/i, 'cafe', 'CafeOrCoffeeShop', 'See the menu'], [/bakery/i, 'food', 'Bakery', 'See the menu'],
  [/restaurant|grill|pizza|taco|bbq|diner|kitchen|bar\b|food/i, 'restaurant', 'Restaurant', 'See the menu'],
  [/real estate|realtor|property/i, 'real-estate', 'RealEstateAgent', 'Book a call'],
  [/pet|groom|kennel|dog/i, 'pet', 'LocalBusiness', 'Book now'],
];
const TRUST = /^(law|legal|saas|medical|dental|home-healthcare|senior-care|healthcare|therapy|pharmacy|telehealth|finance|insurance)$/; // same list as the pickers
export function sectorFor(category) {
  const hit = SECTORS.find(([re]) => re.test(category || ''));
  const [, sector, schema, cta] = hit || [null, 'local-service', 'LocalBusiness', 'Call us'];
  return { sector, schema_type: schema, cta, profile: TRUST.test(sector) ? 'gentle' : 'bold' };
}

const SOCIAL = /(^|\.)(facebook|fb|instagram|yelp|linktr|tiktok|x|twitter|nextdoor|yellowpages|thumbtack|angi|homeadvisor|houzz|bbb|mapquest|google|linkedin|youtube|doordash|ubereats|grubhub|booksy|vagaro|squareup)\.[a-z.]+$|(^|\.)(business\.site|sites\.google\.com|linktr\.ee)$/i;
const FREE_BUILDER = /(wixsite\.com|weebly\.com|godaddysites\.com|square\.site|webnode\.[a-z]+|jimdo(free|site)?\.com|blogspot\.com|wordpress\.com|carrd\.co|webflow\.io|myshopify\.com|ueniweb\.com|site123\.me|strikingly\.com)$/i;
const hostOf = (u) => { try { return new URL(/^https?:/i.test(u) ? u : 'https://' + u).hostname.replace(/^www\./, ''); } catch { return null; } };

export function normalize(row) {
  const g = (k) => pick(row, ALIAS[k]);
  const address = g('address');
  const m = address && /,\s*([^,]+),\s*([A-Z]{2})\s*(\d{5})?/.exec(String(address));
  const lead = {
    name: g('name') && String(g('name')).trim(), category: g('category') && String(g('category')).trim(),
    address: address && String(address).trim(), city: g('city') || (m && m[1].trim()) || null, state: g('state') || (m && m[2]) || null, zip: g('zip') || (m && m[3]) || null,
    phone: g('phone') && String(g('phone')).trim(), website: g('website') && String(g('website')).trim(),
    rating: num(g('rating')), reviews: num(g('reviews')), maps_url: g('maps_url'), place_id: g('place_id'), hours: g('hours'),
  };
  lead.slug = slugify([lead.name, lead.city].filter(Boolean).join(' '));
  Object.assign(lead, sectorFor(lead.category));
  lead.site = classifySite(lead.website, g('site_status'), g('site_notes'));
  return lead;
}

/* ---------- site gap ---------- */
export function classifySite(website, presetStatus, presetNotes) {
  if (!website) return { status: 'none', gap: 100, reasons: ['no website on the listing'] };
  const host = hostOf(website);
  if (!host) return { status: 'none', gap: 100, reasons: [`website field is not a URL: ${website}`] };
  if (SOCIAL.test(host)) return { status: 'social-only', gap: 90, reasons: [`only a social/directory page (${host})`] };
  if (FREE_BUILDER.test(host)) return { status: 'free-builder', gap: 75, reasons: [`free builder subdomain (${host})`] };
  if (/^(none|weak)$/i.test(presetStatus || '')) return { status: presetStatus.toLowerCase(), gap: presetStatus.toLowerCase() === 'none' ? 100 : 60, reasons: [presetNotes || 'pre-scored in the sheet'] };
  return { status: 'unaudited', gap: null, reasons: ['has its own domain: run score --audit before deciding'] };
}
/* Pure HTML audit of an existing site. Evidence only: every point has a reason the pitch can quote. */
export function auditHtml(html, url, year = new Date().getFullYear()) {
  const reasons = []; let gap = 0; const add = (n, why) => { gap += n; reasons.push(why); };
  const text = html.replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (!/^https:/i.test(url)) add(15, 'no HTTPS');
  if (!/<meta[^>]+name=["']viewport["']/i.test(html)) add(30, 'no mobile viewport (not responsive)');
  if (!/<title>[^<]{3,}<\/title>/i.test(html)) add(10, 'no page title');
  if (!/<h1[\s>]/i.test(html)) add(10, 'no H1');
  if (!/application\/ld\+json/i.test(html)) add(10, 'no structured data (LocalBusiness schema)');
  if (text.length < 600) add(15, `almost no readable text (${text.length} characters)`);
  if (/<font[\s>]|<center[\s>]|<marquee|\.swf|<table[^>]+(width|cellpadding)=/i.test(html)) add(15, 'legacy markup (table layout / font tags)');
  const years = [...html.matchAll(/(?:©|&copy;|copyright)\s*(?:\d{4}\s*[-–]\s*)?(\d{4})/gi)].map((m) => Number(m[1]));
  if (years.length && Math.max(...years) <= year - 3) add(10, `copyright year ${Math.max(...years)}`);
  if (!/tel:/i.test(html)) add(5, 'phone number is not tappable');
  gap = Math.min(100, gap);
  return { status: gap >= 40 ? 'weak' : 'decent', gap, reasons: reasons.length ? reasons : ['no gaps found by the static audit'] };
}
async function auditSite(url) {
  const full = /^https?:/i.test(url) ? url : 'https://' + url;
  try {
    const r = await fetch(full, { redirect: 'follow', signal: AbortSignal.timeout(12000), headers: { 'user-agent': 'Mozilla/5.0 (compatible; site-audit)' } });
    if (!r.ok) return { status: 'dead', gap: 85, reasons: [`site returns HTTP ${r.status}`] };
    return auditHtml(await r.text(), r.url);
  } catch (e) { return { status: 'unreachable', gap: null, reasons: [`could not fetch (${e.name}): re-audit from a network that can reach it before pitching`] }; }
}

/* ---------- score ---------- */
export function prioritize(lead) {
  const why = [...lead.site.reasons];
  if (!lead.name) return { priority: 'SKIP', why: ['no business name'] };
  if (!lead.phone) { why.push('no phone on the listing'); return { priority: 'SKIP', why }; }
  if (lead.site.gap == null) return { priority: 'AUDIT', why };
  const proven = (lead.reviews ?? 0) >= 10 && (lead.rating ?? 0) >= 4;
  why.push(lead.reviews == null ? 'review count unknown' : `${lead.reviews} reviews, rating ${lead.rating ?? 'unknown'}`);
  if (lead.site.gap >= 75 && proven) return { priority: 'HIGH', why };
  if (lead.site.gap >= 40) return { priority: 'MED', why };
  return { priority: 'SKIP', why };
}
export async function score(rows, { audit = false } = {}) {
  const seen = new Set(), leads = [];
  for (const row of rows) {
    const lead = normalize(row);
    const key = (lead.place_id && 'p:' + lead.place_id) || (lead.phone && 't:' + lead.phone.replace(/\D/g, '')) || 'n:' + lead.slug;
    if (seen.has(key)) continue; seen.add(key);
    if (audit && lead.site.status === 'unaudited') lead.site = await auditSite(lead.website);
    Object.assign(lead, prioritize(lead));
    leads.push(lead);
  }
  const rank = { HIGH: 0, MED: 1, AUDIT: 2, SKIP: 3 };
  return leads.sort((a, b) => rank[a.priority] - rank[b.priority] || (b.reviews ?? 0) - (a.reviews ?? 0));
}

/* ---------- init ---------- */
const fill = (tpl, vars) => tpl.replace(/\{\{(\w+)\}\}/g, (m, k) => (vars[k] != null ? String(vars[k]) : m));
const known = (v, label) => (v == null || v === '' ? `UNKNOWN (${label}: not on the listing; leave it off the page)` : v);
export function initJob(lead, outDir, { tier = 'factory' } = {}) {
  const job = join(outDir, lead.slug);
  if (existsSync(job)) return null;                                 // never overwrite a job another run may own
  mkdirSync(job, { recursive: true });
  cpSync(join(SKILL, 'templates', 'handoff'), join(job, 'handoff'), { recursive: true });
  const loc = [lead.city, lead.state].filter(Boolean).join(', ');
  const vars = { ...lead, loc, tier, skill: SKILL, job: resolve(job), cta: lead.cta, category: lead.category || 'Local business',
    phone: lead.phone, address: known(lead.address, 'address'), hours: known(lead.hours, 'hours'),
    reviews_line: lead.reviews != null && lead.rating != null ? `${lead.rating} stars from ${lead.reviews} Google reviews (${lead.maps_url || 'source: Google Business Profile'})` : 'UNKNOWN: do not show a rating or review count',
    name_q: JSON.stringify(lead.name), loc_q: JSON.stringify(loc), category_q: JSON.stringify(lead.category || 'Local business'), cta_q: JSON.stringify(`${lead.cta} · ${lead.phone}`),
    jumbo: (String(lead.category || lead.name).match(/[A-Za-z]{3,9}/) || ['Local'])[0].replace(/^./, (c) => c.toUpperCase()),
    dials: lead.profile === 'gentle' ? '{ warmth: 0.8, classic: 0.6, loud: 0.2 }' : '{ warmth: 0.5, classic: 0.35, loud: 0.6 }',
    section_y: lead.profile === 'gentle' ? 'gentle' : 'cinematic', custom_type: 'behind-subject',
    gap_reasons: lead.site.reasons.map((r) => `- ${r}`).join('\n'), site_status: lead.site.status, old_site: lead.website || 'none' };
  for (const f of ['brief.md', 'wireframe.yaml', 'type-inputs.yaml', 'JOB.md']) {
    const out = fill(readFileSync(join(SKILL, 'templates', 'lead', f), 'utf8'), vars);
    writeFileSync(f === 'JOB.md' ? join(job, f) : join(job, 'handoff', f), out);
  }
  writeFileSync(join(job, 'lead.json'), JSON.stringify(lead, null, 2) + '\n');
  writeStatus(job, { state: 'queued', priority: lead.priority, tier, created: new Date().toISOString() });
  return job;
}

/* ---------- queue ---------- */
const statusOf = (job) => { try { return JSON.parse(readFileSync(join(job, 'status.json'), 'utf8')); } catch { return null; } };
function writeStatus(job, patch) { writeFileSync(join(job, 'status.json'), JSON.stringify({ ...(statusOf(job) || {}), ...patch }, null, 2) + '\n'); }
const jobsIn = (dir) => readdirSync(dir, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => join(dir, d.name)).filter((j) => statusOf(j)).sort();
export function claim(dir, by) {
  const rank = { HIGH: 0, MED: 1 };
  const queued = jobsIn(dir).filter((j) => statusOf(j).state === 'queued').sort((a, b) => (rank[statusOf(a).priority] ?? 9) - (rank[statusOf(b).priority] ?? 9));
  for (const job of queued) {
    try { mkdirSync(join(job, '.claim')); } catch { continue; }      // mkdir is atomic: two harnesses can never take one job
    writeStatus(job, { state: 'claimed', by, claimed: new Date().toISOString() });
    return job;
  }
  return null;
}
export function finish(job) {
  const report = ['site/qa/report.json', 'qa/report.json'].map((p) => join(job, p)).find(existsSync);
  let pass = false; try { pass = JSON.parse(readFileSync(report, 'utf8')).pass === true; } catch {}
  if (!pass) return 'no passing qa/report.json (run scripts/verify.mjs to exit 0 first)';
  const page = join(job, 'site', 'index.html');
  if (!existsSync(page)) return 'site/index.html missing';
  const html = readFileSync(page, 'utf8');
  if (!/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(html)) return 'spec demo must carry <meta name="robots" content="noindex"> until the business buys it';
  if (!/data-cwb-spec/.test(html)) return 'spec demo must carry the visible preview notice (data-cwb-spec)';
  if (/\{\{\w+\}\}|UNKNOWN \(/.test(html)) return 'unfilled placeholder or UNKNOWN fact in the page';
  return null;
}

/* ---------- cli ---------- */
async function main() {
  const [cmd, target, ...rest] = process.argv.slice(2);
  const opt = (name, dflt = null) => { const i = rest.indexOf(name); return i >= 0 && rest[i + 1] != null ? rest[i + 1] : dflt; };
  const die = (msg, code = 2) => { console.error(msg); process.exit(code); };
  if (!cmd || !target) die('usage: lead-jobs.mjs score|init|claim|done|fail|release|status <path> [options]  (see the header of this file)');
  if (cmd === 'score') {
    const leads = await score(readRows(target), { audit: rest.includes('--audit') });
    const out = opt('--out', target.replace(/\.[^.]+$/, '') + '.scored.json');
    writeFileSync(out, JSON.stringify(leads, null, 2) + '\n');
    const n = (p) => leads.filter((l) => l.priority === p).length;
    console.log(`${leads.length} leads → HIGH ${n('HIGH')} · MED ${n('MED')} · AUDIT ${n('AUDIT')} · SKIP ${n('SKIP')} → ${out}`);
    for (const l of leads.filter((x) => x.priority !== 'SKIP').slice(0, 15)) console.log(`${l.priority.padEnd(5)} ${l.slug} · ${l.site.status} · ${l.why.join('; ')}`);
  } else if (cmd === 'init') {
    const out = opt('--out', 'jobs'), want = opt('--priority', 'HIGH').split(','), top = Number(opt('--top', 10));
    const leads = JSON.parse(readFileSync(target, 'utf8')).filter((l) => want.includes(l.priority)).slice(0, top);
    const made = leads.map((l) => initJob(l, out, { tier: opt('--tier', 'factory') })).filter(Boolean);
    console.log(`${made.length} job(s) created in ${out}${leads.length - made.length ? ` (${leads.length - made.length} already existed)` : ''}`);
    made.forEach((j) => console.log(j));
  } else if (cmd === 'claim') {
    const by = opt('--by') || die('claim needs --by <harness-id>');
    const job = claim(target, by); if (!job) die('queue empty', 3);
    console.log(resolve(job));
  } else if (cmd === 'done') {
    const err = finish(target); if (err) die(`not done: ${err}`, 1);
    writeStatus(target, { state: 'done', preview_url: opt('--preview'), finished: new Date().toISOString() });
    console.log('done', target);
  } else if (cmd === 'fail') {
    writeStatus(target, { state: 'failed', reason: opt('--reason', 'unspecified'), finished: new Date().toISOString() });
  } else if (cmd === 'release') {
    rmSync(join(target, '.claim'), { recursive: true, force: true }); writeStatus(target, { state: 'queued', by: null });
  } else if (cmd === 'status') {
    for (const j of jobsIn(target)) { const s = statusOf(j); console.log(`${s.state.padEnd(8)} ${(s.priority || '').padEnd(5)} ${(s.by || '-').padEnd(14)} ${j}${s.preview_url ? ' → ' + s.preview_url : ''}${s.reason ? ' — ' + s.reason : ''}`); }
  } else die(`unknown command: ${cmd}`);
}
if (import.meta.url === pathToFileURL(process.argv[1] || '').href) await main();
