import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register, SessionContextUsage, SessionCost } from 'claude-code'

import type { Compaction, Helper, Ledger, Live, Row, Totals, View } from '../types'

// Savings Proof reads ~/.claude/mods-logs/savings.jsonl, the ledger every
// token-saving mod appends to, and shows what they saved. It never writes it.

const NAME = 'savings-proof'
const PANE = 'savings-proof'
const TITLE = 'Savings Proof'
const MAX_ROWS = 300
const SHOW_ROWS = 60
const MAX_BYTES = 3_500_000
const TAIL_LINES = 20_000
const DETAIL_CHARS = 6000

// /savings sample reads the 5 test lines in test/, as if it were this time and this chat.
const SAMPLE_NOW = Date.parse('2026-11-02T12:00:00Z')
const SAMPLE_CHAT = 'sample-chat-1'

const ACCENT = '#d97757'
const GOOD = '#16a34a'
const BAD = '#dc2626'
const WARN = '#ca8a04'
const INFO = '#2563eb'

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const EMPTY_VIEW: View = { filter: 'today', open: '', detail: '', detailError: '', note: '' }
const ledgerAtom = atom({ plugin: 'savings-proof', key: 'ledger' } as const, null, { shape: 'ledger-5' })
const liveAtom = atom({ plugin: 'savings-proof', key: 'live' } as const, null, { shape: 'live-1' })
const compactAtom = atom({ plugin: 'savings-proof', key: 'compactions' } as const, [], { shape: 'compactions-1' })
const viewAtom = atom({ plugin: 'savings-proof', key: 'view' } as const, EMPTY_VIEW, { shape: 'view-1' })

// Module variables reset on a reload; what the pane draws lives in $.state.
let root = ''
let home = ''
let sid = ''
let mainModel = ''
let sample = false
let busy = false
let lastSig = ''
let prevTokens: number | null = null
let lastCompactAt = 0
// One log line the first time each watching hook fires, so a live test shows which hooks run.
const fired = new Set<string>()

// The last parsed ledger, so a new chat scan reprices it without reading the ledger again.
let lastParse: (Pick<Ledger, 'path' | 'sample' | 'chatId' | 'day' | 'mainModel' | 'partial'> & RowsOut) | null = null
// Chat transcripts price each saved input token by the requests after it.
// Session id to its ~/.claude/projects file, null when no file was found.
const transcripts = new Map<string, string | null>()
let listedAt = 0
let checkedAt = 0
// A chat is still unread, so the next poll goes on without the 1-minute wait.
let scanMore = false
// One scan per transcript, redone when the file changed, at most once a minute.
const scans = new Map<string, { sig: string; at: number; scan: Scan | null }>()

// The /mods switchboard turns this mod off in every chat with switches.json.
let off = false
// "savings-proof:hidden": true in switches.json closes the pane in every chat.
const HIDE_KEY = `${NAME}:hidden`
let hidden = false

// ---------- pure helpers (no $) ----------

const PER_M = 1e-6

/**
 * List prices per token, from the claude-api skill (model-migration.md), read 2026-11-02.
 * Anything else (Jev, an unknown model) has no price: the pane says so instead of guessing.
 */
function priceOf(model: string, prompt: number): { in: number; out: number } | null {
  const m = model.toLowerCase()
  if (/fable|mythos/.test(m)) return { in: 10 * PER_M, out: 50 * PER_M }
  if (/opus-5[-.]5/.test(m) || /^opus(\[|$)/.test(m)) return { in: 4 * PER_M, out: 20 * PER_M }
  if (/opus-5(?![-.]\d)/.test(m)) return { in: 5 * PER_M, out: 25 * PER_M }
  if (/sonnet-5/.test(m) || /^sonnet(\[|$)/.test(m)) return { in: 2 * PER_M, out: 10 * PER_M }
  if (/haiku-5[-.]5/.test(m) || /^haiku(\[|$)/.test(m)) {
    return prompt <= 100_000 ? { in: 0.1 * PER_M, out: 0.5 * PER_M } : { in: 0.5 * PER_M, out: 2.5 * PER_M }
  }
  if (/haiku-4[-.]5/.test(m)) return { in: 1 * PER_M, out: 5 * PER_M }
  return null
}

/**
 * Prompt cache prices per token, from the claude-api skill (prompt-caching.md, models.md), read 2026-11-03.
 * Claude Code writes the cache with the 1-hour TTL (ephemeral_1h_input_tokens), so a write is 2x input.
 * A read is 0.05x input on Opus 5.5, 0.025x on Fable 5.1 and Mythos 5.1, 0.1x on the others.
 */
function cacheOf(model: string): { write: number; read: number } | null {
  const p = priceOf(model, 0)
  if (!p) return null
  const m = model.toLowerCase()
  const readX =
    /(fable|mythos)-5[-.]1/.test(m) || /^(fable|mythos)(\[|$)/.test(m)
      ? 0.025
      : /opus-5[-.]5/.test(m) || /^opus(\[|$)/.test(m)
        ? 0.05
        : 0.1
  return { write: 2 * p.in, read: readX * p.in }
}

/**
 * Prints one line per main-chat request ("M <first ts> <requestId> <model>") and one per
 * compaction ("C <ts>"). awk reads a 46 MB transcript in about 1 s; JSON.parse of it would not fit.
 */
const SCAN = String.raw`function last(s, re,   out) { out = ""; while (match(s, re)) { out = substr(s, RSTART, RLENGTH); s = substr(s, RSTART + RLENGTH) } return out }
/"type":"system","subtype":"compact_boundary"/ { t = last($0, "\"timestamp\":\"[^\"]*\""); if (t != "") print "C " substr(t, 14, length(t) - 14); next }
match($0, /"type":"assistant","uuid":"[^"]*","timestamp":"[^"]*"/) {
  t = substr($0, RSTART, RLENGTH); sub(/.*"timestamp":"/, "", t); sub(/"$/, "", t)
  id = last($0, "\"requestId\":\"req_[^\"]*\""); if (id == "") next
  id = substr(id, 14, length(id) - 14)
  m = "-"; if (match($0, /"model":"[^"]*"/)) m = substr($0, RSTART + 9, RLENGTH - 10)
  print (($0 ~ /"isSidechain":true/) ? "S " : "M ") t " " id " " m
}`

// SCAN for Windows, which has no awk: the same lines from the same patterns, in PowerShell.
// The file is read one line at a time, shared, so a chat that is writing it is not stopped.
const SCAN_WIN = String.raw`$reA=[regex]'"type":"assistant","uuid":"[^"]*","timestamp":"([^"]*)"'; $reT=[regex]'"timestamp":"([^"]*)"'; $reI=[regex]'"requestId":"(req_[^"]*)"'; $reM=[regex]'"model":"([^"]*)"'
$o=New-Object Text.StringBuilder
$s=New-Object IO.StreamReader([IO.File]::Open($env:MODS_PATH,'Open','Read','ReadWrite'), [Text.Encoding]::UTF8)
try {
  while ($null -ne ($l=$s.ReadLine())) {
    if ($l.Contains('"type":"system","subtype":"compact_boundary"')) { $t=$reT.Matches($l); if ($t.Count -gt 0) { [void]$o.Append('C ').Append($t[$t.Count-1].Groups[1].Value).Append([char]10) }; continue }
    $a=$reA.Match($l); if (-not $a.Success) { continue }
    $ids=$reI.Matches($l); if ($ids.Count -eq 0) { continue }
    $md=$reM.Match($l); $mo='-'; if ($md.Success) { $mo=$md.Groups[1].Value }
    $k='M '; if ($l.Contains('"isSidechain":true')) { $k='S ' }
    [void]$o.Append($k).Append($a.Groups[1].Value).Append(' ').Append($ids[$ids.Count-1].Groups[1].Value).Append(' ').Append($mo).Append([char]10)
  }
} finally { $s.Close() }
[Console]::Out.Write($o.ToString())`

type Scan = { requests: { ms: number; model: string }[]; compacts: number[] }

// Several transcript entries share one request id: the first one dates the request.
function parseScan(text: string): Scan {
  const seen = new Set<string>()
  const requests: Scan['requests'] = []
  const compacts: number[] = []
  for (const line of text.split('\n')) {
    const p = line.trim().split(' ')
    const ms = Date.parse(p[1] ?? '')
    if (!Number.isFinite(ms)) continue
    if (p[0] === 'C') compacts.push(ms)
    else if (p[0] === 'M' && p[2] && !seen.has(p[2])) {
      seen.add(p[2])
      requests.push({ ms, model: p[3] ?? '' })
    }
  }
  compacts.sort((a, b) => a - b)
  return { requests, compacts }
}

// Each request after a tool result sends it again, until a compaction drops it.
function laterRequests(scan: Scan, ms: number): { n: number; model: string } {
  const stop = scan.compacts.find(c => c > ms) ?? Infinity
  let n = 0
  let model = ''
  for (const r of scan.requests) {
    if (r.ms <= ms || r.ms >= stop) continue
    n += 1
    if (!model && priceOf(r.model, 0)) model = r.model
  }
  return { n, model }
}

function modelLabel(model: string) {
  const m = model.replace(/^claude-/, '').replace(/\[.*\]$/, '').replace(/-(\d+)-(\d+)$/, ' $1.$2').replace(/-(\d+)$/, ' $1')
  return m ? m.charAt(0).toUpperCase() + m.slice(1) : 'unknown'
}

function num(v: unknown): number | null {
  return typeof v === 'number' && Number.isFinite(v) ? v : null
}

function str(v: unknown) {
  return typeof v === 'string' ? v : ''
}

function hash(text: string) {
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0
  return (h >>> 0).toString(36)
}

function localDay(ms: number) {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const obj = (v: unknown) => (v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : null)

// Renamed mods keep their old name on old ledger lines, so both names show the new one.
// Image Offload became Efficient Browser Use. Input Router merged Read Router, Connector Reader and Web Fetch
// Cache; the old three keep their own names, so old and new numbers stay apart.
const MOD_NAMES: Record<string, string> = {
  'jev-model-router': 'Model Router',
  'model-router': 'Model Router',
  'jev-compaction': 'Haiku Compaction',
  'haiku-compaction': 'Haiku Compaction',
  'image-offload': 'Efficient Browser Use',
  'efficient-browser-use': 'Efficient Browser Use',
  'input-router': 'Input Router',
  'read-router': 'Read Router',
  'connector-reader': 'Connector Reader',
  'web-fetch-cache': 'Web Fetch Cache',
}

const modName = (mod: string) => MOD_NAMES[mod] ?? mod

// A mod with parts (Input Router: file, connector, web) shows the part after its name.
const rowName = (r: Pick<Row, 'mod' | 'part'>) => (r.part ? `${modName(r.mod)} · ${r.part}` : modName(r.mod))

// Tokens saved per part, for each mod whose lines carry a part: "Input Router: file saved 12,000 (2) · ...".
function partLines(rows: readonly Row[]): string[] {
  const mods = new Map<string, Map<string, { saved: number; n: number }>>()
  for (const r of rows) {
    if (!r.part || r.leftOut) continue
    const name = modName(r.mod)
    const parts = mods.get(name) ?? new Map<string, { saved: number; n: number }>()
    const t = parts.get(r.part) ?? { saved: 0, n: 0 }
    t.saved += r.saved
    t.n += 1
    parts.set(r.part, t)
    mods.set(name, parts)
  }
  // Input Router's own order first, then any other part by name.
  const rank = (part: string) => {
    const i = ['file', 'connector', 'web'].indexOf(part)
    return i === -1 ? 99 : i
  }
  return [...mods].map(
    ([name, parts]) =>
      `${name}: ${[...parts]
        .sort(([a], [b]) => rank(a) - rank(b) || a.localeCompare(b))
        .map(([part, t]) => `${part} saved ${fmt(t.saved)} (${t.n})`)
        .join(' · ')}`,
  )
}

/** helper.calls: one {in, out} per request. Anything short of a full, valid list is ignored. */
function toCalls(v: unknown): Helper['calls'] {
  if (!Array.isArray(v) || v.length === 0) return undefined
  const calls: NonNullable<Helper['calls']> = []
  for (const c of v) {
    const o = obj(c)
    const i = o ? num(o.in) : null
    const out = o ? num(o.out) : null
    if (i === null || out === null) return undefined
    calls.push({ in: i, out })
  }
  return calls
}

function toHelper(v: unknown): Helper | null {
  const o = obj(v)
  if (!o) return null
  const calls = toCalls(o.calls)
  const sum = (k: 'in' | 'out') => calls?.reduce((s, c) => s + c[k], 0) ?? 0
  const h: Helper = { model: str(o.model) || 'unknown', in: num(o.in) ?? sum('in'), out: num(o.out) ?? sum('out') }
  const usd = num(o.usd)
  if (usd !== null) h.usd = usd
  if (calls) h.calls = calls
  return h
}

function priceHelper(h: Helper | null): { usd: number | null; how: Row['helperPriced'] } {
  if (!h) return { usd: 0, how: 'none' }
  if (h.usd !== undefined) return { usd: h.usd, how: 'bill' }
  const p = priceOf(h.model, 0)
  if (!p) return { usd: null, how: 'unknown' }
  // A list prices each request on its own tier.
  if (h.calls) {
    const usd = h.calls.reduce((s, c) => {
      const q = priceOf(h.model, c.in) ?? p
      return s + c.in * q.in + c.out * q.out
    }, 0)
    return { usd, how: 'list' }
  }
  // A total can add up several requests (read-router and connector-reader cap each one well
  // under 100k tokens), so it gets the short-prompt rate. While the total itself is on that
  // tier, every request was too and the price is exact. Above it, the tier is a guess.
  const exact = priceOf(h.model, h.in)?.in === p.in
  return { usd: h.in * p.in + h.out * p.out, how: exact ? 'list' : 'estimated' }
}

// Model Router (once Jev Model Router) saves dollars, not tokens: cost_usd.saved, below 0 when a task went to a dearer model.
function toUsd(v: unknown): Row['usd'] {
  const o = obj(v)
  const saved = o ? num(o.saved) : null
  return o && saved !== null ? { before: num(o.before), after: num(o.after), saved } : null
}

const secs = (ms: number) => `${(ms / 1000).toFixed(1)} s`

// Stably puts effort, baseline and time under "stably".
function stablyExtra(o: Record<string, unknown>) {
  const baseline = str(o.baseline)
  const msBefore = num(o.ms_before)
  const msAfter = num(o.ms_after)
  return [
    str(o.effort) ? `Effort ${str(o.effort)}` : '',
    baseline === 'none' ? 'no baseline yet, so 0 counted' : baseline ? `baseline: ${baseline}` : '',
    msAfter === null ? '' : msBefore === null ? secs(msAfter) : `${secs(msBefore)} to ${secs(msAfter)}`,
  ]
    .filter(Boolean)
    .join(' · ')
}

/**
 * A before no one tool result can have, so most likely a counting bug in the mod that logged it.
 * Claude Code cuts a tool result near 25,000 tokens. A cache hit (after 0) is never caught by the ratio.
 */
function implausible(before: number, after: number): string {
  if (before > 500_000) return `before ${fmt(before)} is over 500,000 tokens`
  if (after > 0 && before > 100_000 && before / after > 1000) return `${fmt(before)} to ${fmt(after)} is over a 1,000x cut`
  return ''
}

function toRow(j: unknown, raw: string): Row | null {
  const o = obj(j)
  if (!o) return null
  const before = num(o.before)
  const after = num(o.after)
  if (before === null || after === null) return null
  const ts = str(o.ts)
  const ms = Date.parse(ts)
  if (!Number.isFinite(ms)) return null
  const helper = toHelper(o.helper)
  const priced = priceHelper(helper)
  const id = str(o.tool_use_id)
  const usd = toUsd(o.cost_usd)
  const stably = obj(o.stably)
  // Stably's before and after are output tokens, so they cost the output price.
  const tokenKind: Row['tokenKind'] = stably || o.tokens === 'output' ? 'output' : 'input'
  const saved = before - after
  // valueRow prices the token rows, once the chat transcripts are read.
  const valueUsd = usd ? usd.saved : null
  return {
    key: hash(raw),
    ts,
    ms,
    session: str(o.session),
    toolUseId: id || null,
    mod: str(o.mod) || 'unknown',
    part: str(o.part),
    action: str(o.action),
    before,
    after,
    saved,
    tokenKind,
    usd,
    valueUsd,
    cache: null,
    leftOut: usd ? '' : implausible(before, after),
    extra: stably ? stablyExtra(stably) : '',
    helper,
    helperUsd: priced.usd,
    helperPriced: priced.how,
    measured: o.measured === 'real' ? 'real' : 'estimated',
    detail: str(o.detail),
  }
}

function emptyTotals(): Totals {
  return { actions: 0, before: 0, after: 0, saved: 0, real: 0, estimated: 0, helperUsd: 0, usdSaved: 0, usdActions: 0, value: 0, unpriced: 0, leftOut: 0, chats: 0 }
}

function add(t: Totals, r: Row) {
  if (r.leftOut) {
    t.leftOut += 1
    return
  }
  t.actions += 1
  // A dollar row's tokens are the same either way, and a line that changed nothing claims
  // nothing: neither goes in "before to after", so it shows only the tokens the mods cut.
  if (!r.usd && r.before !== r.after) {
    t.before += r.before
    t.after += r.after
    t.saved += r.saved
  }
  if (r.measured === 'real') t.real += 1
  else t.estimated += 1
  if (r.helperUsd !== null) t.helperUsd += r.helperUsd
  if (r.usd) {
    t.usdSaved += r.usd.saved
    t.usdActions += 1
  }
  if (r.valueUsd !== null) t.value += r.valueUsd
  if (r.valueUsd === null || r.helperPriced === 'unknown') t.unpriced += 1
}

type RowsOut = { kept: Row[]; skipped: number; dropped: number }
type Parsed = Pick<Ledger, 'rows' | 'today' | 'chat' | 'all' | 'skipped' | 'dropped'>
/** A chat's scan, 'reading' while it is not read yet, 'no-chat' when it has no transcript. */
type Found = Scan | 'reading' | 'no-chat'

/**
 * Turns the ledger's text into counted rows, not priced yet.
 * A tool_use_id counts once across the whole file: a later "real" line replaces an
 * "estimated" one, any other repeat is dropped. A null id is never matched by id,
 * only an exact repeat of the same line is dropped.
 */
function parseRows(text: string): RowsOut {
  const kept: Row[] = []
  const byId = new Map<string, number>()
  const seen = new Set<string>()
  let skipped = 0
  let dropped = 0
  for (const rawLine of text.split('\n')) {
    const raw = rawLine.trim()
    if (!raw) continue
    let j: unknown
    try {
      j = JSON.parse(raw)
    } catch {
      skipped += 1
      continue
    }
    const row = toRow(j, raw)
    if (!row) {
      skipped += 1
      continue
    }
    if (row.toolUseId) {
      const at = byId.get(row.toolUseId)
      if (at !== undefined) {
        dropped += 1
        if (kept[at]?.measured !== 'real' && row.measured === 'real') kept[at] = row
        continue
      }
      byId.set(row.toolUseId, kept.length)
    } else {
      if (seen.has(raw)) {
        dropped += 1
        continue
      }
      seen.add(raw)
    }
    kept.push(row)
  }
  return { kept, skipped, dropped }
}

/**
 * Dollars for a token row. A saved output token costs the output price once.
 * A saved input token would have been written to the prompt cache once, then read again by
 * every later request of that chat until a compaction: 1 write + (requests - 1) reads.
 */
function valueRow(r: Row, mainModel: string, found: Found): Row {
  if (r.usd || r.leftOut) return r
  if (r.tokenKind === 'output') {
    const p = priceOf(mainModel, 0)
    return { ...r, valueUsd: p ? r.saved * p.out : null }
  }
  const later = typeof found === 'object' ? laterRequests(found, r.ms) : { n: 0, model: '' }
  const model = later.model || mainModel
  const c = cacheOf(model)
  if (!c) return { ...r, valueUsd: null }
  const how = typeof found === 'object' ? 'chat' : found
  const valueUsd = r.saved * (c.write + c.read * Math.max(0, later.n - 1))
  return { ...r, valueUsd, cache: { how, requests: later.n, model } }
}

/** Sessions whose transcript prices a row: counted input-token rows only. */
function wantedChats(kept: Row[]): string[] {
  const newest = new Map<string, number>()
  for (const r of kept) {
    if (r.usd || r.leftOut || r.tokenKind === 'output' || !r.session || r.before === r.after) continue
    newest.set(r.session, Math.max(newest.get(r.session) ?? 0, r.ms))
  }
  return [...newest.entries()].sort((a, b) => b[1] - a[1]).map(e => e[0])
}

function summarize(kept: Row[], chatId: string, day: string): Pick<Parsed, 'rows' | 'today' | 'chat' | 'all'> {
  const today = emptyTotals()
  const chat = emptyTotals()
  const all = emptyTotals()
  const chats = { today: new Set<string>(), chat: new Set<string>(), all: new Set<string>() }
  for (const r of kept) {
    add(all, r)
    if (!r.leftOut) chats.all.add(r.session)
    if (localDay(r.ms) === day) {
      add(today, r)
      if (!r.leftOut) chats.today.add(r.session)
    }
    if (chatId && r.session === chatId) {
      add(chat, r)
      if (!r.leftOut) chats.chat.add(r.session)
    }
  }
  today.chats = chats.today.size
  chat.chats = chats.chat.size
  all.chats = chats.all.size
  const rows = [...kept].sort((a, b) => b.ms - a.ms).slice(0, MAX_ROWS)
  return { rows, today, chat, all }
}

function fmt(n: number) {
  const s = Math.round(Math.abs(n))
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return n < 0 ? `-${s}` : s
}

function money(x: number) {
  const a = Math.abs(x)
  const s = a >= 1 ? a.toFixed(2) : a >= 0.1 ? a.toFixed(3) : a.toFixed(4)
  return `${x < 0 && Number(s) !== 0 ? '-' : ''}$${s}`
}

const usdWords = (x: number) => (x >= 0 ? `saved ${money(x)}` : `cost ${money(-x)} more`)

function timeLabel(ms: number, day: string) {
  const d = new Date(ms)
  const hm = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  return localDay(ms) === day ? hm : `${d.getDate()} ${MONTHS[d.getMonth()] ?? ''} ${hm}`
}

function clip(text: string, width: number) {
  const w = Math.max(8, width)
  return text.length <= w ? text : `${text.slice(0, w - 1)}…`
}

const count = (n: number, one: string, many: string) => `${n} ${n === 1 ? one : many}`

// Today adds up every chat on this computer (build chats too), so the card says how many.
const todayLabel = (chats: number) => (chats === 1 ? 'TODAY · 1 CHAT' : chats ? `TODAY · ALL ${chats} CHATS` : 'TODAY · ALL CHATS')

function helperLine(r: Row) {
  if (!r.helper) return 'No helper model'
  const h = r.helper
  const tokens = `${modelLabel(h.model)}, ${fmt(h.in)} in / ${fmt(h.out)} out`
  if (r.helperPriced === 'bill') return `Helper: ${tokens}, ${money(r.helperUsd ?? 0)} (its bill)`
  if (r.helperPriced === 'list') return `Helper: ${tokens}, ~${money(r.helperUsd ?? 0)}`
  if (r.helperPriced === 'estimated') return `Helper: ${tokens}, ~${money(r.helperUsd ?? 0)} (estimated)`
  return `Helper: ${tokens}, price unknown`
}

// ---------- engine helpers ----------


// ---- Windows ----
// The Mac build runs /bin/sh and Unix tools, which Windows does not have. On Windows the
// same jobs run as PowerShell scripts: values go in through env (Windows argv quoting
// breaks on quotes), text goes in as base64 on stdin, and stdout comes back as UTF-8.
let win: boolean | undefined
async function isWin($: EngineInterface): Promise<boolean> {
  if (win === undefined) win = (await $.env.get('OS').catch(() => undefined)) === 'Windows_NT'
  return win
}
function b64(text: string): string {
  const bytes = new TextEncoder().encode(text)
  let raw = ''
  for (let i = 0; i < bytes.length; i += 1) raw += String.fromCharCode(bytes[i] ?? 0)
  return btoa(raw)
}
function ps($: EngineInterface, script: string, env: Record<string, string> = {}, init: { stdin?: string; timeoutMs?: number } = {}) {
  const full = `$ErrorActionPreference='Stop'; [Console]::OutputEncoding=[Text.UTF8Encoding]::new($false); ${script}`
  let utf16 = ''
  for (let i = 0; i < full.length; i += 1) utf16 += String.fromCharCode(full.charCodeAt(i) & 255, full.charCodeAt(i) >> 8)
  return $.process.run(['powershell.exe', '-NoProfile', '-NonInteractive', '-ExecutionPolicy', 'Bypass', '-EncodedCommand', btoa(utf16)], { env, ...init })
}
// Windows paths as the Mac code compares them: forward slashes, drive letter upper case,
// and Git Bash's /c/... spelled C:/...
const slashed = (p: string) =>
  p
    .replace(/\\/g, '/')
    .replace(/^\/([a-zA-Z])\//, (_, d: string) => `${d.toUpperCase()}:/`)
    .replace(/^([a-z]):\//, (_, d: string) => `${d.toUpperCase()}:/`)

const switchesPath = ($: EngineInterface) => `${$.plugin.root.replace(/\\/g, '/').split('/.claude/')[0] ?? ''}/.claude/mods/switches.json`
const ledgerPath = () => `${home}/.claude/mods-logs/savings.jsonl`
const samplePath = () => `${root}/test/sample-savings.jsonl`
const tilde = (p: string) => {
  const q = win ? slashed(p) : p
  return home && q.startsWith(home) ? `~${q.slice(home.length)}` : p
}

async function readSwitches($: EngineInterface): Promise<Record<string, unknown>> {
  const path = switchesPath($)
  if (!(await $.fs.exists(path))) return {}
  const json = JSON.parse(String(await $.fs.read(path))) as unknown
  return json && typeof json === 'object' && !Array.isArray(json) ? (json as Record<string, unknown>) : {}
}

async function readSwitch($: EngineInterface) {
  let now = false
  let nowHidden = false
  try {
    const json = await readSwitches($)
    now = json[NAME] === false
    nowHidden = json[HIDE_KEY] === true
  } catch {
    now = off
    nowHidden = hidden
  }
  if (nowHidden && !hidden) await $.ui.close({ id: PANE }).catch(() => undefined)
  hidden = nowHidden
  if (now === off) return
  off = now
  if (!off) lastSig = ''
  try {
    $.ui.invalidate('ui.render')
  } catch {
    // The next state change redraws anyway.
  }
}

// Read, change, write the whole file, so every chat sees the choice within 3 s.
async function setHidden($: EngineInterface, value: boolean) {
  try {
    const json = await readSwitches($)
    if (value) json[HIDE_KEY] = true
    else delete json[HIDE_KEY]
    await $.fs.write(switchesPath($), `${JSON.stringify(json, null, 2)}\n`)
  } catch (err) {
    await log($, `save hidden failed: ${String(err instanceof Error ? err.message : err)}`)
  }
  hidden = value
  if (value) await $.ui.close({ id: PANE }).catch(() => undefined)
}

// Errors are appended to ~/.claude/mods-logs/savings-proof.log, so a failure is never silent.
async function log($: EngineInterface, text: string) {
  try {
    const path = `${home}/.claude/mods-logs/savings-proof.log`
    let old = ''
    try {
      old = String(await $.fs.read(path))
    } catch {
      old = ''
    }
    const at = new Date(await $.clock.now()).toISOString()
    await $.fs.write(path, `${old}${at} ${text}\n`)
  } catch {
    // Logging must never break the pane.
  }
}

async function setLedger($: EngineInterface, value: Ledger) {
  await update($, ledgerAtom, () => value)
}

// Finds the wanted chats' files in ~/.claude/projects/<folder>/<session>.jsonl. A new session
// lists again at once; a session not found lists again after 5 minutes, never twice a minute.
async function findTranscripts($: EngineInterface, want: string[], now: number) {
  const fresh = want.some(s => !transcripts.has(s))
  const lost = want.some(s => transcripts.get(s) === null)
  if (!fresh && !(lost && now - listedAt > 300_000)) return
  if (listedAt && now - listedAt < 60_000) return
  listedAt = now
  const base = `${home}/.claude/projects`
  try {
    for (const dir of await $.fs.list(base)) {
      if (dir.kind !== 'dir') continue
      let files: Awaited<ReturnType<typeof $.fs.list>> = []
      try {
        files = await $.fs.list(`${base}/${dir.name}`)
      } catch {
        continue
      }
      for (const f of files) {
        if (f.kind === 'file' && f.name.endsWith('.jsonl')) transcripts.set(f.name.slice(0, -6), `${base}/${dir.name}/${f.name}`)
      }
    }
  } catch (err) {
    await log($, `list chats failed: ${String(err instanceof Error ? err.message : err).slice(0, 300)}`)
  }
  for (const s of want) if (!transcripts.has(s)) transcripts.set(s, null)
}

// Chat files are read only while the pane is drawn, so a closed pane in another chat costs nothing.
async function paneUp($: EngineInterface) {
  try {
    return (await $.ui.panes()).some(p => p.id === PANE && p.isPlaced)
  } catch {
    return false
  }
}

// True while a wanted chat is not found yet, or found and not read yet.
function unread(want: string[]) {
  return want.some(s => {
    const path = transcripts.get(s)
    return path === undefined || (path !== null && !scans.has(path))
  })
}

// Scans each wanted chat whose file changed, newest first, at most once a minute per file.
// A failed scan is kept, so it waits a minute too. The first open has every chat to read
// (45 files took 9 s), so one call stops after 8 scans or 2 s; the next poll goes on.
async function updateScans($: EngineInterface, want: string[], now: number): Promise<boolean> {
  let changed = false
  let done = 0
  const start = await $.clock.now()
  for (const s of want) {
    const path = transcripts.get(s)
    if (!path) continue
    let sig = ''
    try {
      const st = await $.fs.stat(path)
      sig = `${st.size}|${st.mtimeMs}`
    } catch {
      continue
    }
    const old = scans.get(path)
    if (old && (old.sig === sig || now - old.at < 60_000)) continue
    if (done >= 8 || (done > 0 && (await $.clock.now()) - start > 2000)) break
    let scan: Scan | null = null
    try {
      // Windows has no awk: the same scan runs in PowerShell.
      const r = (await isWin($))
        ? await ps($, SCAN_WIN, { MODS_PATH: path }, { timeoutMs: 60_000 })
        : await $.process.run(['/usr/bin/awk', SCAN, path], { timeoutMs: 60_000 })
      if (r.exitCode !== 0) throw new Error(`scan exited ${r.exitCode}: ${r.stderr.trim().slice(0, 200)}`)
      scan = parseScan(r.stdout)
    } catch (err) {
      await log($, `scan ${tilde(path)} failed: ${String(err instanceof Error ? err.message : err).slice(0, 300)}`)
    }
    scans.set(path, { sig, at: now, scan })
    changed = true
    done += 1
  }
  return changed
}

function foundFor(session: string): Found {
  if (sample) return 'no-chat'
  const path = transcripts.get(session)
  if (path === undefined) return 'reading'
  if (path === null) return 'no-chat'
  const s = scans.get(path)
  return s === undefined ? 'reading' : (s.scan ?? 'no-chat')
}

// Prices the last parsed rows with the scans read so far and draws them.
async function publish($: EngineInterface) {
  if (!lastParse) return
  const { kept, skipped, dropped, ...base } = lastParse
  const priced = kept.map(r => valueRow(r, base.mainModel, foundFor(r.session)))
  const mainPrice = priceOf(base.mainModel, 0)?.in ?? null
  await setLedger($, { ...base, mainPrice, missing: false, error: '', skipped, dropped, ...summarize(priced, base.chatId, base.day) })
}

async function refresh($: EngineInterface, force: boolean) {
  if (off || busy) return
  busy = true
  try {
    const path = sample ? samplePath() : ledgerPath()
    const now = sample ? SAMPLE_NOW : await $.clock.now()
    const chatId = sample ? SAMPLE_CHAT : sid
    const day = localDay(now)
    const price = priceOf(mainModel, 0)
    const mainPrice = price?.in ?? null
    const base = { path, sample, chatId, day, mainPrice, mainModel }
    let stat: { size: number; mtimeMs: number } | null = null
    try {
      stat = await $.fs.stat(path)
    } catch {
      stat = null
    }
    const sig = stat ? `${path}|${stat.size}|${stat.mtimeMs}|${day}|${chatId}|${mainModel}` : `${path}|missing|${day}`
    const dirty = force || sig !== lastSig
    if (!stat) {
      if (!dirty) return
      const none = emptyTotals()
      lastParse = null
      await setLedger($, { ...base, missing: true, error: '', rows: [], today: none, chat: none, all: none, skipped: 0, dropped: 0, partial: false })
      lastSig = sig
      return
    }
    if (dirty) {
      let text = ''
      let partial = false
      if (stat.size > MAX_BYTES) {
        // Windows has no tail: PowerShell reads the last lines.
        const r = (await isWin($))
          ? await ps($, '[Console]::Out.Write(((Get-Content -LiteralPath $env:MODS_PATH -Tail ([int]$env:MODS_LINES) -Encoding UTF8) -join [char]10))', {
              MODS_PATH: path,
              MODS_LINES: String(TAIL_LINES),
            })
          : await $.process.run(['tail', '-n', String(TAIL_LINES), path])
        if (r.exitCode !== 0) throw new Error(`tail exited ${r.exitCode}: ${r.stderr.trim()}`)
        text = r.stdout
        partial = true
      } else {
        text = String(await $.fs.read(path))
      }
      lastParse = { path, sample, chatId, day, mainModel, partial, ...parseRows(text) }
      await publish($)
      lastSig = sig
      if (!sample) scanMore = scanMore || unread(wantedChats(lastParse.kept))
    }
    // /savings never waits for chat files: the 3 s poll reads them, a batch at a time, while the
    // pane is drawn. A chat file read once is checked again once a minute (it changes every turn).
    if (force || sample || !lastParse) return
    if (!scanMore && now - checkedAt < 60_000) return
    if (!(await paneUp($))) return
    checkedAt = now
    const want = wantedChats(lastParse.kept)
    await findTranscripts($, want, now)
    const changed = await updateScans($, want, now)
    scanMore = unread(want)
    if (changed) await publish($)
  } catch (err) {
    const message = String(err instanceof Error ? err.message : err).slice(0, 300)
    await log($, `read ledger failed: ${message}`)
    const none = emptyTotals()
    await setLedger($, {
      path: sample ? samplePath() : ledgerPath(),
      sample,
      chatId: sample ? SAMPLE_CHAT : sid,
      day: '',
      mainPrice: null,
      mainModel,
      missing: false,
      error: message,
      rows: [],
      today: none,
      chat: none,
      all: none,
      skipped: 0,
      dropped: 0,
      partial: false,
    })
  } finally {
    busy = false
  }
}

async function setLive($: EngineInterface, context: SessionContextUsage, cost: SessionCost | undefined) {
  const next: Live = {
    tokens: context.tokens ?? null,
    window: context.window,
    percent: context.percent ?? null,
    usd: cost?.usd ?? null,
  }
  const now = await read($, liveAtom)
  if (JSON.stringify(now) === JSON.stringify(next)) return
  await update($, liveAtom, () => next)
}

async function readLive($: EngineInterface) {
  try {
    const u = await $.session.usage()
    await setLive($, u.context, u.cost)
  } catch (err) {
    await log($, `session.usage failed: ${String(err instanceof Error ? err.message : err)}`)
  }
}

async function firstFire($: EngineInterface, hook: string) {
  if (fired.has(hook)) return
  fired.add(hook)
  await log($, `${hook} fired (session ${sid || 'unknown'})`)
}

async function addCompaction($: EngineInterface, c: Compaction) {
  lastCompactAt = c.at
  await update($, compactAtom, list => [...list, c].slice(-20))
}

// session.measure fires after each main-chat turn. A big drop in the context size
// is a compaction the session.compact hook did not see (that hook is blocked on desktop).
async function onMeasure($: EngineInterface, context: SessionContextUsage, cost: SessionCost | undefined) {
  const cur = context.tokens ?? null
  if (cur !== null && prevTokens !== null) {
    const drop = prevTokens - cur
    const now = await $.clock.now()
    if (drop >= 10_000 && cur < prevTokens * 0.7 && now - lastCompactAt > 60_000) {
      await addCompaction($, { at: now, before: prevTokens, after: cur, source: 'measure' })
    }
  }
  if (cur !== null) prevTokens = cur
  await setLive($, context, cost)
}

// A detail path is data another mod wrote: open only a file that sits under ~/.claude/mods-logs/.
async function safeDetailPath($: EngineInterface, p: string): Promise<string | null> {
  // On Windows another mod may write the path with \, or with ~\.
  const q = win ? slashed(p) : p
  const full = q.startsWith('~/') ? `${home}${q.slice(1)}` : q
  const dir = `${home}/.claude/mods-logs/`
  if (!home || !full.startsWith(dir) || full.split('/').includes('..')) return null
  try {
    const st = await $.fs.stat(full, { resolve: true })
    if (st.kind !== 'file') return null
    if (st.realPath && !st.realPath.includes('/.claude/mods-logs/')) return null
    return full
  } catch {
    return null
  }
}

async function toggleDetail($: EngineInterface, key: string) {
  const v = await read($, viewAtom)
  if (v.open === key) {
    await update($, viewAtom, x => ({ ...x, open: '', detail: '', detailError: '' }))
    return
  }
  const row = (await read($, ledgerAtom))?.rows.find(r => r.key === key)
  if (!row) return
  if (!row.detail) {
    await update($, viewAtom, x => ({ ...x, open: key, detail: '', detailError: 'This action has no detail file.' }))
    return
  }
  const path = await safeDetailPath($, row.detail)
  if (!path) {
    await update($, viewAtom, x => ({ ...x, open: key, detail: '', detailError: `Not found under ~/.claude/mods-logs: ${row.detail}` }))
    return
  }
  let text = ''
  try {
    text = String(await $.fs.read(path))
  } catch (err) {
    await log($, `read detail failed: ${String(err instanceof Error ? err.message : err)}`)
    await update($, viewAtom, x => ({ ...x, open: key, detail: '', detailError: 'Could not read the detail file.' }))
    return
  }
  const shown = text.length > DETAIL_CHARS ? `${text.slice(0, DETAIL_CHARS)}\n\n… (open the file for the rest)` : text
  await update($, viewAtom, x => ({ ...x, open: key, detail: shown, detailError: '' }))
}

async function openFile($: EngineInterface, key: string) {
  const row = (await read($, ledgerAtom))?.rows.find(r => r.key === key)
  const path = row?.detail ? await safeDetailPath($, row.detail) : null
  let note = 'The detail file is missing.'
  if (path) {
    try {
      // Windows: Notepad, as macOS open -t opens the text editor.
      const r = (await isWin($))
        ? await ps($, "Start-Process -FilePath 'notepad.exe' -ArgumentList ('\"' + $env:MODS_PATH + '\"')", { MODS_PATH: path.replace(/\//g, '\\') }, { timeoutMs: 10_000 })
        : await $.process.run(['open', '-t', path])
      note = r.exitCode === 0 ? `Opened ${tilde(path)}` : 'Could not open the file.'
      if (r.exitCode !== 0) await log($, `open exited ${r.exitCode}: ${r.stderr.trim()}`)
    } catch (err) {
      note = 'Could not open the file.'
      await log($, `open failed: ${String(err instanceof Error ? err.message : err)}`)
    }
  }
  await update($, viewAtom, x => ({ ...x, note }))
}

async function openPane($: EngineInterface) {
  await $.ui.open({ id: PANE, title: TITLE })
  await refresh($, true)
  await readLive($)
}

// The /mods switchboard asks for this pane by leaving an empty file for this chat.
async function checkOpen($: EngineInterface) {
  if (!sid) return
  const path = `${$.plugin.root.replace(/\\/g, '/').split('/.claude/')[0] ?? ''}/.claude/mods/.open-${NAME}-${sid}`
  try {
    if (!(await $.fs.exists(path))) return
    if (await isWin($)) await ps($, 'Remove-Item -LiteralPath $env:MODS_PATH -Force -ErrorAction SilentlyContinue', { MODS_PATH: path })
    else await $.process.run(['rm', '-f', path])
    if (!off) await openPane($)
  } catch (err) {
    await log($, `open request failed: ${String(err instanceof Error ? err.message : err)}`)
  }
}

async function poll($: EngineInterface) {
  await readSwitch($)
  await checkOpen($)
  if (!off) await refresh($, false)
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    root = $.plugin.root.replace(/\\/g, '/').replace(/\/\.claude-plugin\/?$/, '')
    home = root.split('/.claude/')[0] ?? ''
    await isWin($)
    prevTokens = null
    lastSig = ''
    await $.command.register({ name: 'savings', description: 'Open Savings Proof: tokens the mods saved today and in this chat', immediate: true })
    try {
      sid = await $.session.id()
    } catch {
      sid = ''
    }
    try {
      mainModel = await $.session.model()
    } catch {
      mainModel = ''
    }
    await poll($).catch(() => undefined)
    $.clock.every(3000, () => {
      void poll($).catch(() => undefined)
    })
    return next(e)
  })

  on('command.run', { command: 'savings' }, async ($, e) => {
    if (off) return { text: 'Savings Proof is off. Turn it on with /mods.' }
    const arg = e.args.trim().toLowerCase()
    sample = arg === 'sample'
    if (hidden) await setHidden($, false)
    await openPane($)
    return {
      text: sample
        ? 'Opened Savings Proof with the 5 sample lines. This is test data, not the real ledger. Type /savings to go back.'
        : 'Opened Savings Proof.',
    }
  })

  on('session.measure', async ($, e, next) => {
    void firstFire($, 'session.measure').catch(() => undefined)
    if (!off) void onMeasure($, e.context, e.cost).catch(() => undefined)
    return next(e)
  })

  // Blocked on the desktop app by cc-plugin-sec-default (2026-11-02). Works where the engine lets it run.
  on('session.compact', async ($, e, next) => {
    const r = await next(e)
    void firstFire($, 'session.compact').catch(() => undefined)
    try {
      if (!off && !e.agentId && e.trigger !== 'precompute' && r.skip === undefined && r.tokensBefore !== undefined && r.tokensAfter !== undefined) {
        const before = r.tokensBefore
        const after = r.tokensAfter
        void (async () => addCompaction($, { at: await $.clock.now(), before, after, source: 'compact' }))().catch(() => undefined)
      }
    } catch {
      // Watching only: the compaction stands whatever happens here.
    }
    return r
  })

  on('ui.press', { plugin: 'savings-proof' }, async ($, e) => {
    const el = e.element
    if (el === 'hide') {
      await setHidden($, true)
      try {
        $.ui.toast('Savings Proof hidden. Type /savings or open /mods to show it.')
      } catch {
        // The toast is only a hint.
      }
      return { element: el }
    }
    if (off) return { element: el }
    if (el === 'refresh') {
      await refresh($, true)
      await readLive($)
    } else if (el === 'real') {
      sample = false
      await refresh($, true)
    } else if (el === 'filter-chat' || el === 'filter-today' || el === 'filter-all') {
      const filter = el.slice('filter-'.length) as View['filter']
      await update($, viewAtom, x => ({ ...x, filter }))
    } else if (el.startsWith('row:')) {
      await toggleDetail($, el.slice(4))
    } else if (el.startsWith('file:')) {
      await openFile($, el.slice(5))
    }
    return { element: el }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button, Markdown } = $.ui.resolve(e)
    if (off) {
      return (
        <Box flexDirection="column">
          <Text dimColor>Turned off. Open /mods to turn it on.</Text>
        </Box>
      )
    }
    const noop = () => undefined
    const width = Math.max(30, e.props.bodyColumns)
    const l = await read($, ledgerAtom)
    const live = await read($, liveAtom)
    const comps = await read($, compactAtom)
    const v = await read($, viewAtom)

    const stat = (key: string, label: string, t: Totals) => {
      const netText =
        // Nothing has a price only when the main model has none, no chat file gave one and no line brought its own dollars.
        l?.mainPrice === null && t.usdActions === 0 && t.actions > 0 && t.value === 0
          ? 'net: price unknown'
          : `~${money(t.value - t.helperUsd)} net after helpers${t.unpriced ? ` (${t.unpriced} not priced)` : ''}`
      return (
        <Box key={key} flexDirection="column" flexGrow={1} minWidth={24} borderStyle="round" borderColor={GOOD} paddingX={1}>
          <Text dimColor size="caption" weight="medium">
            {label}
          </Text>
          <Text bold color={GOOD} size="title" tabular>
            {fmt(t.saved)}
          </Text>
          <Text size="footnote">tokens saved</Text>
          {t.usdActions ? (
            <Text bold color={t.usdSaved >= 0 ? GOOD : BAD} tabular wrap="truncate-end">
              {`Model choice ${usdWords(t.usdSaved)}`}
            </Text>
          ) : null}
          <Text dimColor size="footnote" tabular wrap="truncate-end">
            {`${fmt(t.before)} to ${fmt(t.after)} · ${count(t.actions, 'action', 'actions')}`}
          </Text>
          <Text dimColor size="footnote" tabular wrap="truncate-end">
            {netText}
          </Text>
          {t.leftOut ? (
            <Text color={BAD} size="footnote" wrap="truncate-end">
              {`${count(t.leftOut, 'row', 'rows')} left out (not believable)`}
            </Text>
          ) : null}
          <Text size="footnote" wrap="truncate-end">
            <Text color={GOOD}>{`${t.real} real`}</Text>
            <Text dimColor> · </Text>
            <Text color={WARN}>{`${t.estimated} estimated`}</Text>
          </Text>
        </Box>
      )
    }

    const filterButton = (key: View['filter'], label: string) => (
      <Button key={`filter-${key}`} label={label} variant={v.filter === key ? 'primary' : 'secondary'} onPress={noop} />
    )

    const rows = (l?.rows ?? []).filter(r =>
      v.filter === 'all' ? true : v.filter === 'chat' ? r.session === l?.chatId : localDay(r.ms) === l?.day,
    )

    const rowView = (r: Row) => {
      const net = r.valueUsd === null ? null : r.valueUsd - (r.helperUsd ?? 0)
      const isOpen = v.open === r.key
      const badge = r.leftOut ? 'LEFT OUT' : r.measured === 'real' ? 'REAL' : 'ESTIMATED'
      const badgeColor = r.leftOut ? BAD : r.measured === 'real' ? GOOD : WARN
      const c = r.cache
      const reads = c ? Math.max(0, c.requests - 1) : 0
      const cacheText = !c
        ? ''
        : c.how === 'reading'
          ? 'Cache: 1 write for now (reading the chat)'
          : c.how === 'no-chat'
            ? `Cache: 1 write (${l?.sample ? 'sample lines have no chat file' : 'chat file not found'})`
            : reads === 0
              ? `Cache: 1 write (${c.requests ? '1 later request' : 'no later request yet'}, ${modelLabel(c.model)})`
              : `Cache: 1 write + ${count(reads, 'read', 'reads')} (${c.requests} later requests, ${modelLabel(c.model)})`
      return (
        <Box key={`r-${r.key}`} flexDirection="column" width={width} marginTop={1} paddingLeft={1} borderStyle="single" borderColor={badgeColor}>
          <Box flexDirection="row" justifyContent="space-between">
            <Text wrap="truncate-end">
              <Text bold color={ACCENT}>
                {rowName(r)}
              </Text>
              <Text dimColor>{`  ${timeLabel(r.ms, l?.day ?? '')}${l && r.session === l.chatId ? '  this chat' : ''}`}</Text>
            </Text>
            <Text bold color={badgeColor}>
              {badge}
            </Text>
          </Box>
          <Text wrap="truncate-end">{clip(r.action || '(no description)', width - 3)}</Text>
          {r.usd && r.usd.before !== null && r.usd.before === r.usd.after && r.usd.saved === 0 ? (
            <Text tabular wrap="truncate-end">{`${money(r.usd.before)} either way`}</Text>
          ) : r.usd ? (
            <Text tabular wrap="truncate-end">
              <Text>{r.usd.before !== null && r.usd.after !== null ? `${money(r.usd.before)} to ${money(r.usd.after)} · ` : 'Model price · '}</Text>
              <Text bold color={r.usd.saved >= 0 ? GOOD : BAD}>{usdWords(r.usd.saved)}</Text>
            </Text>
          ) : null}
          {r.usd && r.saved === 0 ? (
            <Text dimColor size="footnote" tabular wrap="truncate-end">{`${fmt(r.before)} tokens either way`}</Text>
          ) : (
            <Text tabular wrap="truncate-end">
              <Text>{`${fmt(r.before)} to ${fmt(r.after)} ${r.tokenKind === 'output' ? 'output tokens' : 'tokens'} · `}</Text>
              <Text bold color={r.saved >= 0 ? GOOD : BAD}>{`saved ${fmt(r.saved)}`}</Text>
            </Text>
          )}
          {r.leftOut ? (
            <Text color={BAD} size="footnote">
              {`Left out of the totals: ${r.leftOut}. Likely a counting bug in ${modName(r.mod)}.`}
            </Text>
          ) : null}
          {cacheText ? (
            <Text dimColor size="footnote" tabular wrap="truncate-end">
              {clip(cacheText, width - 3)}
            </Text>
          ) : null}
          {r.extra ? (
            <Text dimColor size="footnote" wrap="truncate-end">
              {clip(r.extra, width - 3)}
            </Text>
          ) : null}
          <Text dimColor size="footnote" tabular wrap="truncate-end">
            {clip(helperLine(r), width - 3)}
          </Text>
          <Box flexDirection="row" justifyContent="space-between">
            <Text size="footnote" tabular color={net === null || r.leftOut || r.helperPriced === 'unknown' ? undefined : net >= 0 ? GOOD : BAD} dimColor={net === null || !!r.leftOut || r.helperPriced === 'unknown'}>
              {r.leftOut
                ? 'Net: not counted'
                : net === null
                  ? 'Net: price unknown'
                  : r.helperPriced === 'unknown'
                    ? `Net: before helper ~${money(net)}`
                    : `Net ~${money(net)}`}
            </Text>
            <Button key={`row:${r.key}`} label={isOpen ? 'Close detail' : r.detail ? 'Detail' : 'No detail'} dimColor onPress={noop} />
          </Box>
          {isOpen ? (
            <Box flexDirection="column" marginTop={1}>
              {v.detailError ? <Text color={BAD}>{v.detailError}</Text> : <Markdown text={v.detail || '(empty file)'} />}
              {v.detailError ? null : (
                <Box flexDirection="row">
                  <Button key={`file:${r.key}`} label="Open file" variant="secondary" onPress={noop} />
                  <Text dimColor wrap="truncate-end">{`  ${clip(r.detail, width - 16)}`}</Text>
                </Box>
              )}
            </Box>
          ) : null}
        </Box>
      )
    }

    const emptyText =
      v.filter === 'chat' ? 'No savings in this chat yet.' : v.filter === 'today' ? 'No savings logged today yet.' : 'No savings logged yet.'

    return (
      <Box flexDirection="column" width={width}>
        {l?.sample ? (
          <Box flexDirection="row" justifyContent="space-between" borderStyle="round" borderColor={WARN} paddingX={1}>
            <Text bold color={WARN}>
              SAMPLE DATA, not the real ledger
            </Text>
            <Button key="real" label="Show real ledger" variant="secondary" onPress={noop} />
          </Box>
        ) : null}

        {!l ? <Text dimColor>Reading the savings ledger…</Text> : null}
        {l?.error ? (
          <Box flexDirection="column">
            <Text bold color={BAD}>
              The ledger did not load
            </Text>
            <Text color={BAD} wrap="wrap">
              {l.error}
            </Text>
          </Box>
        ) : null}

        {l && !l.error ? (
          <Box flexDirection={width >= 56 ? 'row' : 'column'} gap={1}>
            {stat('stat-today', `${todayLabel(l.today.chats)}${l.sample ? ' (sample day)' : ''}`, l.today)}
            {stat('stat-chat', `THIS CHAT${l.sample ? ' (sample chat)' : ''}`, l.chat)}
          </Box>
        ) : null}

        <Box flexDirection="column" marginTop={1}>
          <Text size="footnote" wrap="truncate-end">
            <Text bold color={INFO}>
              Real now
            </Text>
            <Text dimColor> (from Claude Code): </Text>
            <Text tabular>
              {live
                ? `context ${live.tokens === null ? 'not measured yet' : fmt(live.tokens)} of ${fmt(live.window)}${live.percent === null ? '' : ` (${live.percent}%)`}${live.usd === null ? '' : ` · this chat cost ${money(live.usd)}`}`
                : 'waiting for the first measure'}
            </Text>
          </Text>
          {comps.slice(-3).map((c, i) => (
            <Text key={`c${i}`} size="footnote" tabular wrap="truncate-end">
              <Text color={INFO}>{`${c.source === 'compact' ? 'Compaction' : 'Context drop'} ${timeLabel(c.at, l?.day ?? localDay(c.at))}: `}</Text>
              <Text>{`${fmt(c.before)} to ${fmt(c.after)} tokens`}</Text>
              <Text dimColor>{c.source === 'compact' ? ' (real, from the engine)' : ' (real; a compaction, /clear or /rewind)'}</Text>
            </Text>
          ))}
          {comps.length ? (
            <Text dimColor size="footnote">
              Shown apart. Not in the totals above.
            </Text>
          ) : null}
        </Box>

        {partLines(rows).map(line => (
          <Text key={`part-${line}`} size="footnote" tabular wrap="wrap">
            {line}
          </Text>
        ))}

        <Box flexDirection="row" gap={1} marginTop={1} flexWrap="wrap">
          {filterButton('chat', 'This chat')}
          {filterButton('today', 'Today (all chats)')}
          {filterButton('all', 'All')}
          <Button key="refresh" label="Refresh" dimColor onPress={noop} />
          <Button key="hide" label="Hide" dimColor onPress={noop} />
        </Box>
        {v.note ? (
          <Text color={GOOD} size="footnote" wrap="truncate-end">
            {clip(v.note, width)}
          </Text>
        ) : null}

        {l?.missing ? (
          <Box flexDirection="column" marginTop={1}>
            <Text>No savings logged yet.</Text>
            <Text dimColor wrap="wrap">
              Each token-saving mod adds one line to ~/.claude/mods-logs/savings.jsonl when it saves tokens. Rows show up here within 3 seconds.
            </Text>
          </Box>
        ) : null}
        {l && !l.missing && !l.error && rows.length === 0 ? (
          <Box marginTop={1}>
            <Text dimColor>{emptyText}</Text>
          </Box>
        ) : null}
        {rows.slice(0, SHOW_ROWS).map(rowView)}
        {rows.length > SHOW_ROWS ? <Text dimColor>{`Showing the newest ${SHOW_ROWS} of ${rows.length}.`}</Text> : null}

        {l && !l.error ? (
          <Box flexDirection="column" marginTop={1}>
            {l.dropped || l.skipped ? (
              <Text dimColor size="footnote" wrap="wrap">
                {[l.dropped ? `${count(l.dropped, 'double count', 'double counts')} dropped (same tool call)` : '', l.skipped ? `${count(l.skipped, 'bad line', 'bad lines')} skipped` : '']
                  .filter(Boolean)
                  .join(' · ')}
              </Text>
            ) : null}
            <Text dimColor size="footnote" wrap="wrap">
              {`Reading ${tilde(l.path)}${l.partial ? ` (newest ${fmt(TAIL_LINES)} lines)` : ''}. All time: ${fmt(l.all.saved)} tokens saved in ${count(l.all.actions, 'action', 'actions')}.${l.all.usdActions ? ` Model choice ${usdWords(l.all.usdSaved)}.` : ''}`}
            </Text>
            <Text dimColor size="footnote" wrap="wrap">
              {l.mainPrice === null
                ? `Token dollars need the main model's price. ${l.mainModel ? modelLabel(l.mainModel) : 'This model'} has none here. Model choice uses each mod's own dollar figure.`
                : `~$ uses list prices. A saved input token is 1 cache write (2x input: $${((cacheOf(l.mainModel)?.write ?? 0) / PER_M).toFixed(2)} per million on ${modelLabel(l.mainModel)}) plus 1 cache read ($${((cacheOf(l.mainModel)?.read ?? 0) / PER_M).toFixed(2)} per million) for each later request in its chat, until a compaction. A saved output token is $${((priceOf(l.mainModel, 0)?.out ?? 0) / PER_M).toFixed(2)} per million. Helpers are at their own price. Model choice uses each mod's own dollar figure.`}
            </Text>
          </Box>
        ) : null}
      </Box>
    )
  })
}
