import { atom, read, update } from 'claude-code'
import type { EngineInterface, ModelUsage, Register, TurnUsage } from 'claude-code'
import type { AgentView, AutoView, FoundView, RunView, SourceView, ToolUse } from '../types'
import { explorerSvg } from './mascot.ts'

const NAME = 'research-router'
const TITLE = 'Research Router'
const PANE = 'research-router'
// Not /research: another plugin's /content:research answers to that name first.
const COMMAND = 'research-router'
// The cheap worker. Every search, page and brief goes through it, never through the main chat.
const MODEL = 'claude-haiku-5-5'
// Haiku 5.5 list prices per million tokens, as Model Router's policy.ts cached them on 2026-10-06.
const PRICE_IN = 0.1
const PRICE_OUT = 0.5
// Subagent list prices per million tokens, as Model Router's policy.ts cached them on 2026-10-06.
// Haiku has a second card for one request whose prompt is over 100K tokens.
type Price = { input: number; output: number; cacheRead: number; cacheWrite: number }
const PRICES: { family: RegExp; name: string; small: Price; large?: Price }[] = [
  { family: /opus/i, name: 'Opus', small: { input: 4, output: 20, cacheRead: 0.2, cacheWrite: 5 } },
  { family: /sonnet/i, name: 'Sonnet', small: { input: 2, output: 10, cacheRead: 0.2, cacheWrite: 2.5 } },
  {
    family: /haiku/i,
    name: 'Haiku',
    small: { input: 0.1, output: 0.5, cacheRead: 0.01, cacheWrite: 0.125 },
    large: { input: 0.5, output: 2.5, cacheRead: 0.05, cacheWrite: 0.625 },
  },
]
// How many subagents' tool text and request usage the mod keeps while it waits for their runs.
const MAX_AGENT_MEMO = 32
const MAX_RUNS = 8
const MAX_AUTO = 12
const SEARCH_LIMIT = 4
const MAX_QUERIES = 2
const MAX_SOURCES = 6
const MAX_FETCHES = 4
const MIN_PARTS = 2
const MAX_PARTS = 4
// What the worker's model reads of each page, and of all of them together.
const PAGE_CHARS = 12_000
const ALL_CHARS = 60_000
// What the notes file keeps of each page's own text.
const NOTE_PAGE_CHARS = 40_000
// A page shorter than this after the HTML is stripped is a script shell, not an article.
const MIN_PAGE_CHARS = 200
// What the expanded card keeps of the brief and of each subagent report.
const BRIEF_CHARS = 4000
const REPORT_CHARS = 2500
const FIRECRAWL_MS = 150_000
// One WebSearch or WebFetch call. A permission dialog nobody answers counts against it.
const TOOL_MS = 90_000
const PAGE_MS = 20_000
const PLAN_MS = 30_000
const WRITE_MS = 120_000
// Auto mode: Haiku is asked only when the search engine's commentary alone is over this many tokens.
// Under it, the call costs more than it can save.
const AUTO_MIN_COMMENTARY = 800
const AUTO_MS = 25_000
// One deep-mode subagent's time limit.
const PART_MS = 300_000
const OFF_TEXT = `${TITLE} is off. Turn it on with /mods.`
const USAGE_TEXT = `Type /${COMMAND} and a question, for example: /${COMMAND} what do people say about Claude Code plugins? Put deep first to use subagents: /${COMMAND} deep <question>`
// Pane colours, the same as the other mods' panes.
const ACCENT = '#d97757'
const GOOD = '#16a34a'
const BAD = '#dc2626'
const UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36 research-router/2'

const SYSTEM = [
  'You are a research worker. You read web search results and pages, and you report what they say.',
  'Write plain, simple English in short sentences. Never use em dashes or en dashes. Never use the word "ship".',
  'Use only the sources you are given. Never invent a number, date, name or quote.',
].join(' ')

// Connector tools are matched by what they say they do, because their names are random ids.
const WEBBY = /\b(web|internet|online|google|bing|urls?|web ?pages?|websites?|search engine|serp)\b/i
const ACTION = /\b(search\w*|scrap\w*|crawl\w*|fetch\w*|brows\w*|research\w*)\b/i

type Firecrawl = { bin: string; node: string; path: string }
type Kit = { firecrawl: Firecrawl | null; webSearch: boolean; webFetch: boolean; connectors: { name: string; description: string }[] }
type Link = { title: string; url: string }
// `via` names the path that read the page, for the log and the notes file.
// `newest`: the newest date found on the page, YYYY-MM-DD, when there is one.
type Source = Link & { text: string; via: string; newest?: string }
// `noWebFetch`: WebFetch failed to answer once in this run (missing, or no answer in time), so the run stops asking it.
// `agentCost`: dollars the deep-mode subagents used, at list price.
type Job = { id: number; question: string; reply: number; tools: ToolUse[]; helperIn: number; helperOut: number; read: number; agentCost: number; noWebFetch?: boolean }
type CallResult = { text?: string; result?: unknown; isError?: true; deny?: string }
// `since`: the first day of the time window the request names, YYYY-MM-DD. `official`: pages to read first.
type Plan = { mode: 'quick' | 'deep'; queries: string[]; parts: string[]; since: string | null; official: string[] }
type Done = { answer: string; reason: string; model?: string; usage?: TurnUsage }
type WebSearchRecord = { query: string; results: unknown[]; durationSeconds: number; searchCount?: number }

const runsAtom = atom({ plugin: 'research-router', key: 'runs' } as const, [] as RunView[], { shape: 'runs-2' })
const autoAtom = atom({ plugin: 'research-router', key: 'auto' } as const, [] as AutoView[], { shape: 'auto-1' })
const foundAtom = atom({ plugin: 'research-router', key: 'found' } as const, null as FoundView | null, { shape: 'found-1' })
const offAtom = atom({ plugin: 'research-router', key: 'off' } as const, false)
const routerAtom = atom({ plugin: 'research-router', key: 'router' } as const, false)
const busyAtom = atom({ plugin: 'research-router', key: 'busy' } as const, 0)
const openAtom = atom({ plugin: 'research-router', key: 'open' } as const, [] as number[], { shape: 'open-1' })

// Module variables start over on a reload; the pane's values live in $.state.
let home = ''
let off = false
let router = false
let kit: Kit | null = null
// Set on the first "no tool named WebFetch": later pages go straight to a plain read.
let webFetchMissing = false
// Deep mode: a subagent's answer arrives as its own turn.complete, matched by agentId.
const waiters = new Map<string, (d: Done) => void>()
// Answers that arrived before anyone waited (a fast subagent), and the ids this mod started.
const answers = new Map<string, Done>()
const owned = new Set<string>()
// The person closed the pane: auto mode stops opening it until /research-router asks.
let closed = false
// switches.json says "research-router:hidden": the pane opens only when asked.
let switchHidden = false
let switchError = ''
let routerKnown = false
let session = ''
// Deep mode: the characters each subagent's tools handed it, and each of its requests' usage, by agentId.
const agentChars = new Map<string, number>()
const agentSteps = new Map<string, TurnUsage[]>()

// Newest last; the oldest goes when the map is full.
function remember<V>(map: Map<string, V>, id: string, value: V) {
  map.delete(id)
  map.set(id, value)
  for (const k of [...map.keys()].slice(0, Math.max(0, map.size - MAX_AGENT_MEMO))) map.delete(k)
}

// The /mods switchboard turns this mod off in every chat with switches.json; Model Router's switch is read too.
async function readSwitch($: EngineInterface) {
  let now = off
  let routed = router
  let nowHidden = switchHidden
  try {
    const mods = `${$.plugin.root.replace(/\\/g, '/').split('/.claude/')[0] ?? ''}/.claude/mods`
    let json: Record<string, unknown> = {}
    if (await $.fs.exists(`${mods}/switches.json`)) json = JSON.parse(String(await $.fs.read(`${mods}/switches.json`))) as Record<string, unknown>
    now = json[NAME] === false
    nowHidden = json[`${NAME}:hidden`] === true
    // Model Router's manifest is a file; the folder alone is the second check.
    const installed = (await exists($, `${mods}/model-router/.claude-plugin/plugin.json`)) || (await exists($, `${mods}/model-router`))
    routed = installed && json['model-router'] !== false
    switchError = ''
  } catch (err) {
    // A broken file changes nothing. Logged once, not every 3 seconds.
    const said = err instanceof Error ? err.message : String(err)
    if (said !== switchError) await log($, 'switches', `switches.json not read, nothing changed: ${said}`)
    switchError = said
  }
  if (nowHidden !== switchHidden) {
    switchHidden = nowHidden
    if (nowHidden) await closePane($)
  }
  if (now !== off) {
    off = now
    await update($, offAtom, () => now)
    if (now) await closePane($)
  }
  if (routed !== router || !routerKnown) {
    routerKnown = true
    router = routed
    await update($, routerAtom, () => routed)
  }
}

// Open in /mods writes an empty file named for this mod and this chat: open the pane, remove the file.
async function checkOpen($: EngineInterface) {
  if (!session || !home) return
  const path = `${home}/.claude/mods/.open-${NAME}-${session}`
  if (!(await exists($, path))) return
  if (await isWin($)) await ps($, 'Remove-Item -LiteralPath $env:MODS_PATH -Force -ErrorAction SilentlyContinue', { MODS_PATH: path }, { timeoutMs: 10_000 })
  else await $.process.run(['/bin/rm', '-f', path], { timeoutMs: 10_000 })
  if (!off) await openPane($, true)
}


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
// Appends text to a file, making its folder; waits while another writer holds the file.
const PS_APPEND = `$p=$env:MODS_PATH; $d=[IO.Path]::GetDirectoryName($p); if ($d) { [void][IO.Directory]::CreateDirectory($d) }
$t=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadToEnd().Trim()))
for ($i=0; ; $i++) { try { [IO.File]::AppendAllText($p, $t, [Text.UTF8Encoding]::new($false)); break } catch { if ($i -ge 40) { throw }; Start-Sleep -Milliseconds 50 } }`

// Windows: firecrawl is an npm .cmd shim, which runs only through cmd. Read the shim for
// the script it starts and run that with node, the same [node, script, ...] call as on the Mac.
async function findFirecrawlWin($: EngineInterface): Promise<Firecrawl | null> {
  const where = async (name: string) => {
    const r = await $.process.run(['where.exe', name], { timeoutMs: 8000 }).catch(() => null)
    return r && r.exitCode === 0 ? r.stdout.split(/\r?\n/).map(s => s.trim().replace(/\\/g, '/')).filter(Boolean) : []
  }
  const appData = ((await $.env.get('APPDATA').catch(() => undefined)) ?? '').replace(/\\/g, '/')
  const shims = (await where('firecrawl')).filter(s => /\.cmd$/i.test(s))
  if (appData && (await exists($, `${appData}/npm/firecrawl.cmd`))) shims.push(`${appData}/npm/firecrawl.cmd`)
  let bin = ''
  for (const shim of shims) {
    const text = String(await $.fs.read(shim).catch(() => ''))
    const m = /"%(?:~dp0|dp0)%\\?([^"]*\.[cm]?js)"/i.exec(text)
    if (!m?.[1]) continue
    const js = `${shim.slice(0, shim.lastIndexOf('/'))}/${m[1].replace(/\\/g, '/').replace(/^\//, '')}`
    if (await exists($, js)) {
      bin = js
      break
    }
  }
  if (!bin) return null
  const shimDir = shims[0] ? shims[0].slice(0, shims[0].lastIndexOf('/')) : ''
  const nodes = [...(shimDir ? [`${shimDir}/node.exe`] : []), ...(await where('node.exe')), 'C:/Program Files/nodejs/node.exe']
  for (const n of nodes) if (await exists($, n)) return { bin, node: n, path: '' }
  return null
}

const logsDir = () => `${home}/.claude/mods-logs`
const notesDir = () => `${home}/.claude/mods-logs/research-router`

// A true append: many mods write the ledger, so a read and rewrite would drop their lines.
async function append($: EngineInterface, path: string, text: string) {
  // Windows has no /bin/sh: PowerShell appends, the text sent as base64.
  const r = (await isWin($))
    ? await ps($, PS_APPEND, { MODS_PATH: path }, { stdin: b64(text), timeoutMs: 10_000 })
    : await $.process.run(['/bin/sh', '-c', 'mkdir -p "$(dirname "$1")" && cat >> "$1"', 'sh', path], { stdin: text, timeoutMs: 10_000 })
  if (r.exitCode !== 0) throw new Error(`append to ${path} failed: ${r.stderr.slice(0, 200)}`)
}

async function log($: EngineInterface, what: string, detail: unknown) {
  try {
    const msg = detail instanceof Error ? detail.message : String(detail)
    await append($, `${logsDir()}/research-router.log`, `${new Date(await $.clock.now()).toISOString()} ${what}: ${msg}\n`)
  } catch {
    // Nowhere left to report it.
  }
}

// Plain text: no em or en dashes, never the banned word.
function clean(raw: string, max: number) {
  return raw
    .replace(/\s*[—–]\s*/g, ', ')
    .replace(/\bship(s|ped|ping)?\b/gi, 'publish')
    .trim()
    .slice(0, max)
}

function oneLine(raw: string, max: number) {
  return clean(raw.replace(/\s+/g, ' '), max)
}

function tokens(chars: number) {
  return Math.ceil(chars / 4)
}

function commas(n: number) {
  return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

function dollars(helperIn: number, helperOut: number) {
  return (helperIn * PRICE_IN + helperOut * PRICE_OUT) / 1_000_000
}

function money(d: number) {
  return d < 0.01 ? `$${d.toFixed(4)}` : `$${d.toFixed(2)}`
}

// One request (or, with oneRequest false, a turn's summed counts) at list price; null for a model with no price here.
function requestCost(model: string, u: ModelUsage, oneRequest: boolean): number | null {
  const card = PRICES.find(p => p.family.test(model))
  if (!card) return null
  const input = u.input_tokens ?? 0
  const read = u.cache_read_input_tokens ?? 0
  const write = u.cache_creation_input_tokens ?? 0
  // Summed counts are not one prompt: only a single request's size can pick the long-prompt card.
  const p = oneRequest && input + read + write > 100_000 && card.large ? card.large : card.small
  return (input * p.input + (u.output_tokens ?? 0) * p.output + read * p.cacheRead + write * p.cacheWrite) / 1_000_000
}

// "claude-haiku-5-5" reads as "Haiku"; a model with no family here keeps its id.
function family(model: string) {
  return PRICES.find(p => p.family.test(model))?.name ?? model
}

function tally(models: string[]) {
  const counts = new Map<string, number>()
  for (const m of models) counts.set(family(m), (counts.get(family(m)) ?? 0) + 1)
  return [...counts].map(([m, c]) => `${m} x${c}`)
}

// Today and the time window the request names in plain words, counted back from today.
function day(ms: number) {
  return new Date(ms).toISOString().slice(0, 10)
}

function windowStart(question: string, now: number): string | null {
  const m = /\b(?:last|past|previous)\s+(\d{1,3})\s+(day|week|month)s?\b/i.exec(question)
  if (m) return day(now - Number(m[1]) * (m[2]!.toLowerCase() === 'week' ? 7 : m[2]!.toLowerCase() === 'month' ? 30 : 1) * 86_400_000)
  if (/\b(?:this|last|past)\s+week\b/i.test(question)) return day(now - 7 * 86_400_000)
  if (/\b(?:this|last|past)\s+month\b/i.test(question)) return day(now - 30 * 86_400_000)
  if (/\b(?:today|yesterday)\b/i.test(question)) return day(now - 86_400_000)
  return null
}

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

// The newest date a page names, up to today: ISO dates and "Nov 2, 2026" or "2 November 2026".
function newestDate(raw: string, today: string): string | undefined {
  const found: string[] = []
  for (const m of raw.matchAll(/\b(20\d\d)-(\d\d)-(\d\d)/g)) found.push(`${m[1]}-${m[2]}-${m[3]}`)
  const pad = (n: string) => n.padStart(2, '0')
  for (const m of raw.matchAll(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?\s+(\d{1,2}),?\s+(20\d\d)\b/g)) {
    found.push(`${m[3]}-${pad(String(MONTHS.indexOf(m[1]!.toLowerCase()) + 1))}-${pad(m[2]!)}`)
  }
  for (const m of raw.matchAll(/\b(\d{1,2})\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\.?,?\s+(20\d\d)\b/g)) {
    found.push(`${m[3]}-${pad(String(MONTHS.indexOf(m[2]!.toLowerCase()) + 1))}-${pad(m[1]!)}`)
  }
  return found.filter(d => /^20\d\d-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/.test(d) && d <= today).sort().pop()
}

// Said to every writer: the brief keeps what the sources hedge, and never upgrades a claim.
const CAVEATS =
  'Keep each source\'s own caveats and limits. Never state a claim more strongly than its source does. Say who measured a number: a vendor testing its own product is "the vendor\'s own test", never "controlled" or "independent" unless the source says so. Say when a number comes from one source only.'

// A connector's name without its random server id.
function shortName(tool: string) {
  return tool.replace(/^mcp__[^_]+(?:_[^_]+)*?__/, '')
}

function urlsIn(text: string) {
  const out: string[] = []
  for (const m of text.matchAll(/https?:\/\/[^\s)\]"'<>,|]+/g)) {
    const u = m[0].replace(/[.;:]+$/, '')
    if (!out.includes(u)) out.push(u)
  }
  return out
}

async function exists($: EngineInterface, path: string) {
  try {
    return await $.fs.exists(path)
  } catch {
    return false
  }
}

// Rejects with `what` when the promise gives no answer in `ms`.
async function withTimeout<T>($: EngineInterface, p: Promise<T>, ms: number, what: string): Promise<T> {
  const box: { timer?: { cancel: () => void } } = {}
  const late = new Promise<never>((_, reject) => {
    box.timer = $.clock.after(ms, () => reject(new Error(`${what} gave no answer in ${ms / 1000} s`)))
  })
  try {
    return await Promise.race([p, late])
  } finally {
    box.timer?.cancel()
  }
}

// The desktop app's process may not have nvm on its PATH, so look in the usual places by hand.
async function findFirecrawl($: EngineInterface): Promise<Firecrawl | null> {
  if (await isWin($)) return findFirecrawlWin($)
  const dirs: string[] = []
  const nvm = `${home}/.nvm/versions/node`
  try {
    if (await exists($, nvm)) {
      const versions = (await $.fs.list(nvm)).filter(v => v.kind === 'dir').map(v => v.name)
      versions.sort((a, b) => b.localeCompare(a, 'en', { numeric: true }))
      for (const v of versions) dirs.push(`${nvm}/${v}/bin`)
    }
  } catch {
    // No nvm here.
  }
  dirs.push('/opt/homebrew/bin', '/usr/local/bin', `${home}/.local/bin`, `${home}/.npm-global/bin`, `${home}/.bun/bin`, `${home}/.volta/bin`)
  const nodes = ['/opt/homebrew/bin/node', '/usr/local/bin/node', '/usr/bin/node']
  for (const dir of dirs) {
    if (!(await exists($, `${dir}/firecrawl`))) continue
    let node = (await exists($, `${dir}/node`)) ? `${dir}/node` : ''
    for (const n of nodes) if (!node && (await exists($, n))) node = n
    if (!node) continue
    return { bin: `${dir}/firecrawl`, node, path: [dir, node.slice(0, node.lastIndexOf('/')), '/usr/bin', '/bin', '/usr/sbin', '/sbin'].join(':') }
  }
  // Last try: the person's own shell knows their PATH.
  try {
    const r = await $.process.run(['/bin/zsh', '-ilc', 'command -v firecrawl; command -v node'], { timeoutMs: 8000 })
    const found = r.stdout.split('\n').map(s => s.trim()).filter(s => s.startsWith('/'))
    const bin = found.find(s => s.endsWith('/firecrawl'))
    const node = found.find(s => s.endsWith('/node'))
    if (bin && node) return { bin, node, path: [bin.slice(0, bin.lastIndexOf('/')), node.slice(0, node.lastIndexOf('/')), '/usr/bin', '/bin'].join(':') }
  } catch {
    // No shell answer either.
  }
  return null
}

async function refreshTools($: EngineInterface): Promise<Kit> {
  const list = await $.tool.list().catch(() => [])
  const names = new Set(list.map(t => t.name))
  const connectors = list
    .filter(t => t.mcp && !t.name.includes(NAME) && WEBBY.test(t.description) && ACTION.test(t.description))
    .map(t => ({ name: t.name, description: oneLine(t.description, 160) }))
    .slice(0, 12)
  const firecrawl = await findFirecrawl($)
  kit = { firecrawl, webSearch: names.has('WebSearch'), webFetch: names.has('WebFetch'), connectors }
  const found: FoundView = {
    at: await $.clock.now(),
    firecrawl: firecrawl?.bin ?? null,
    webSearch: kit.webSearch,
    webFetch: kit.webFetch,
    connectors: connectors.map(c => shortName(c.name)),
  }
  await update($, foundAtom, () => found)
  return kit
}

async function setRun($: EngineInterface, id: number, change: (r: RunView) => RunView) {
  await update($, runsAtom, list => (list ?? []).map(r => (r.id === id ? change(r) : r)))
}

// Each step goes to the pane and the log, so a stalled run shows where it stopped.
async function step($: EngineInterface, id: number, text: string) {
  await setRun($, id, r => ({ ...r, step: text }))
  await log($, `run ${id}`, text)
}

async function used($: EngineInterface, job: Job, name: string, kind: ToolUse['kind'], calls = 1) {
  const hit = job.tools.find(t => t.name === name)
  if (hit) hit.calls += calls
  else job.tools.push({ name, kind, calls })
  const tools = job.tools.map(t => ({ ...t }))
  await setRun($, job.id, r => ({ ...r, tools }))
}

function countUsage(u: ModelUsage | undefined) {
  if (!u) return { input: 0, output: 0 }
  return { input: (u.input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0), output: u.output_tokens ?? 0 }
}

async function ask($: EngineInterface, job: Job, prompt: string, maxTokens: number, timeoutMs: number) {
  const r = await $.model.complete({ model: MODEL, system: SYSTEM, prompt, maxTokens, timeoutMs })
  const u = countUsage(r.usage)
  job.helperIn += u.input
  job.helperOut += u.output
  await used($, job, MODEL, 'model')
  if (!r.isAnswered) throw new Error(`the worker model did not answer (${r.reason})`)
  return r.text
}

function cleanQueries(raw: unknown[]) {
  return raw
    .map(q => String(q ?? ''))
    // Strip quotes only around the whole line: a query can start with a quoted phrase.
    .map(l => l.replace(/^\s*(?:[-*•]|\d+[.)])\s*/, '').trim().replace(/^(["'])(.*)\1$/, '$2').trim())
    .filter(l => l.length > 2)
}

// The planner picks quick or deep, and writes the queries and the parts. `deep` forces deep.
async function plan($: EngineInterface, job: Job, question: string, forceDeep: boolean, today: string): Promise<Plan> {
  const fallback: Plan = { mode: forceDeep ? 'deep' : 'quick', queries: [oneLine(question, 200)], parts: forceDeep ? [oneLine(question, 400)] : [], since: null, official: [] }
  try {
    const text = await ask(
      $,
      job,
      [
        `Today is ${today}.`,
        `Research request: ${question}`,
        '',
        forceDeep
          ? 'This request is deep: split it into 2 to 4 separate lines of research.'
          : 'Decide how big it is. "quick": one or two web searches answer it. "deep": it needs 2 to 4 separate lines of research, for example several products, a broad survey, or a comparison across many angles.',
        `Write ${MAX_QUERIES} short web search queries, under 12 words each, that would find the best sources. If the request names a time window, such as "last 7 days", put the month and year in the queries.`,
        'Prefer official sources. For a product, that is its own changelog, release notes, docs or GitHub releases page; for Claude Code, its docs changelog and https://github.com/anthropics/claude-code/releases. Put up to 2 such page URLs in "official", only URLs you are sure exist, else [].',
        'Set "since" to the first day of the time window the request names, as YYYY-MM-DD, counted back from today. With no window, "since" is null.',
        'For deep, also write 2 to 4 self-contained sub-questions, one per line of research. For quick, parts is [].',
        'Answer with JSON only, in this form:',
        '{"mode":"quick","queries":["...","..."],"parts":[],"official":[],"since":null}',
      ].join('\n'),
      400,
      PLAN_MS,
    )
    const json = /\{[\s\S]*\}/.exec(text)?.[0]
    if (!json) throw new Error('the planner gave no JSON')
    const data = JSON.parse(json) as { mode?: unknown; queries?: unknown; parts?: unknown; official?: unknown; since?: unknown }
    const queries = cleanQueries(Array.isArray(data.queries) ? data.queries : []).slice(0, MAX_QUERIES).map(q => oneLine(q, 200))
    const parts = cleanQueries(Array.isArray(data.parts) ? data.parts : []).slice(0, MAX_PARTS).map(p => oneLine(p, 400))
    const mode = forceDeep || (data.mode === 'deep' && parts.length >= MIN_PARTS) ? 'deep' : 'quick'
    const official = (Array.isArray(data.official) ? data.official : [])
      .map(u => String(u ?? '').trim())
      .filter(u => /^https:\/\/[^\s]+$/.test(u))
      .slice(0, 2)
    const since = typeof data.since === 'string' && /^20\d\d-\d\d-\d\d$/.test(data.since) && data.since <= today ? data.since : null
    return {
      mode,
      queries: queries.length ? queries : fallback.queries,
      parts: mode === 'deep' ? (parts.length ? parts : fallback.parts) : [],
      since,
      official,
    }
  } catch (err) {
    await log($, 'plan', err)
    return fallback
  }
}

// Rejects when no tool has that name, or when the call gives no answer in time.
async function callTool($: EngineInterface, input: Record<string, unknown>, ms = TOOL_MS): Promise<CallResult> {
  const call = ($.tool.call as unknown as (i: Record<string, unknown>) => Promise<CallResult>)(input)
  return (await withTimeout($, call, ms, String(input.tool))) ?? {}
}

// What the model would read: `text` from core, else the tool's own record.
function resultText(r: CallResult) {
  if (r.text) return r.text
  if (typeof r.result === 'string') return r.result
  return r.result === undefined ? '' : JSON.stringify(r.result)
}

// What went wrong with a call that answered, or '' when it answered with text.
function problem(r: CallResult, text: string) {
  if (r.deny) return `denied: ${oneLine(r.deny, 200)}`
  if (r.isError) return `error: ${oneLine(text, 200)}`
  return text ? '' : 'empty result'
}

// A WebSearch answer holds link lists ({ tool_use_id, content: [{ title, url }] }) and the search
// engine's own commentary (strings). The links are the sources; the commentary is background.
function searchParts(r: CallResult, text: string) {
  const links: Link[] = []
  const notes: string[] = []
  const add = (title: unknown, url: unknown) => {
    if (typeof url !== 'string' || !/^https?:\/\//.test(url) || links.some(l => l.url === url)) return
    links.push({ title: oneLine(String(title || url), 160), url })
  }
  const results = (r.result as { results?: unknown } | undefined)?.results
  if (Array.isArray(results)) {
    for (const item of results) {
      if (typeof item === 'string') notes.push(item)
      else if (item && typeof item === 'object' && Array.isArray((item as { content?: unknown }).content)) {
        for (const c of (item as { content: { title?: unknown; url?: unknown }[] }).content) add(c?.title, c?.url)
      }
    }
  }
  if (!links.length) {
    // The text form: `Links: [{"title":...,"url":...}]` on one line.
    const m = /Links:\s*(\[.*\])/.exec(text)
    try {
      for (const l of m ? (JSON.parse(m[1] ?? '[]') as { title?: unknown; url?: unknown }[]) : []) add(l?.title, l?.url)
    } catch {
      // Not JSON after all.
    }
    for (const u of urlsIn(text)) add(u, u)
  }
  if (!notes.length && text) notes.push(text.replace(/Links:\s*\[.*\]/, '').trim())
  return { links, notes: notes.filter(n => n.trim()) }
}

function decode(s: string) {
  return s
    .replace(/&nbsp;/gi, ' ')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&#(\d+);/g, (_, n: string) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n: string) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/gi, '&')
}

// The readable text of an HTML page: no scripts, styles or menus, block ends as new lines.
function htmlToText(html: string) {
  const title = /<title[^>]*>([\s\S]*?)<\/title>/i.exec(html)?.[1] ?? ''
  const body = html
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<(script|style|noscript|svg|head|template|iframe|nav|footer|aside|form)\b[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<\/?(p|div|br|li|ul|ol|h[1-6]|tr|section|article|header|blockquote|pre|table|main)\b[^>]*>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
  const text = decode(body)
    .replace(/[ \t\f\v\r]+/g, ' ')
    .replace(/ *\n */g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
  return { title: oneLine(decode(title), 160), text }
}

function header(headers: Record<string, string>, name: string) {
  const key = Object.keys(headers).find(k => k.toLowerCase() === name)
  return key ? (headers[key] ?? '') : ''
}

// One page, three ways: WebFetch while it exists, a plain GET with no key, then the firecrawl CLI.
async function readPage($: EngineInterface, job: Job, link: Link, question: string, today: string): Promise<Source | null> {
  if (!webFetchMissing && !job.noWebFetch) {
    try {
      const r = await callTool($, {
        tool: 'WebFetch',
        url: link.url,
        prompt: `Pull out every fact that helps answer this question: ${question}. Keep numbers, names, dates and short quotes.`,
      })
      await used($, job, 'WebFetch', 'built-in')
      const text = resultText(r)
      const bad = problem(r, text)
      if (!bad) return { ...link, text, via: 'WebFetch', newest: newestDate(text, today) }
      await log($, 'WebFetch', `${bad} for ${link.url}`)
    } catch (err) {
      const why = err instanceof Error ? err.message : String(err)
      job.noWebFetch = true
      // The tool is not in this session at all: later runs skip it too.
      if (/no tool named/i.test(why)) webFetchMissing = true
      await log($, 'WebFetch', why)
    }
  }
  try {
    const res = await withTimeout($, $.http.fetch(link.url, { headers: { 'User-Agent': UA, Accept: 'text/html,text/plain;q=0.9,*/*;q=0.5' } }), PAGE_MS, 'the page')
    await used($, job, 'plain page read (no key)', 'http')
    const type = header(res.headers, 'content-type')
    if (!res.ok) await log($, 'page', `HTTP ${res.status} for ${link.url}`)
    else if (type && !/html|text|xml|json/i.test(type)) await log($, 'page', `skipped ${type} at ${link.url}`)
    else {
      const page = /html/i.test(type) || /<html|<body/i.test(res.text.slice(0, 2000)) ? htmlToText(res.text) : { title: '', text: res.text.trim() }
      // The raw HTML keeps the dates a page hides in <time> tags and meta fields.
      if (page.text.length >= MIN_PAGE_CHARS) {
        return { title: link.title === link.url && page.title ? page.title : link.title, url: link.url, text: page.text.slice(0, NOTE_PAGE_CHARS), via: 'plain GET', newest: newestDate(res.text, today) }
      }
      await log($, 'page', `only ${page.text.length} characters of text at ${link.url}`)
    }
  } catch (err) {
    await log($, 'page', err)
  }
  const fc = kit?.firecrawl
  if (fc) {
    try {
      const r = await $.process.run([fc.node, fc.bin, 'scrape', link.url, '--format', 'markdown', '--only-main-content'], {
        cwd: notesDir(),
        // Windows keeps its own Path: fc.path is empty there.
        env: fc.path ? { PATH: fc.path } : {},
        timeoutMs: FIRECRAWL_MS,
      })
      await used($, job, 'firecrawl scrape (CLI)', 'cli')
      if (r.exitCode === 0 && r.stdout.trim().length >= MIN_PAGE_CHARS) return { ...link, text: r.stdout.trim().slice(0, NOTE_PAGE_CHARS), via: 'firecrawl scrape', newest: newestDate(r.stdout, today) }
      await log($, 'firecrawl', `scrape exit ${r.exitCode}, ${r.stdout.length} characters: ${r.stderr.slice(0, 200)}`)
    } catch (err) {
      await log($, 'firecrawl', err)
    }
  }
  return null
}

function parseFirecrawl(stdout: string): Source[] {
  let data: unknown
  try {
    data = JSON.parse(stdout)
  } catch {
    const at = stdout.indexOf('{')
    data = at >= 0 ? JSON.parse(stdout.slice(at)) : null
  }
  const d = (data as { data?: unknown } | null)?.data
  const items = (Array.isArray(d) ? d : ((d as { web?: unknown } | undefined)?.web ?? [])) as Record<string, unknown>[]
  return items
    .filter(i => typeof i.url === 'string')
    .map(i => ({
      title: oneLine(String(i.title ?? i.url), 160),
      url: String(i.url),
      text: [String(i.description ?? ''), String(i.markdown ?? '')].filter(Boolean).join('\n\n'),
      via: 'firecrawl search',
    }))
}

async function viaFirecrawl($: EngineInterface, job: Job, fc: Firecrawl, queries: string[]) {
  const sources: Source[] = []
  for (const [i, q] of queries.entries()) {
    await step($, job.id, `Searching ${i + 1} of ${queries.length} with firecrawl`)
    const r = await $.process.run(
      [fc.node, fc.bin, 'search', q, '--limit', String(SEARCH_LIMIT), '--scrape', '--json', '--timeout', '60000'],
      { cwd: notesDir(), env: fc.path ? { PATH: fc.path } : {}, timeoutMs: FIRECRAWL_MS },
    )
    await used($, job, 'firecrawl search (CLI)', 'cli')
    if (r.exitCode !== 0) {
      await log($, 'firecrawl', `exit ${r.exitCode}: ${r.stderr.slice(0, 300)}`)
      continue
    }
    const found = parseFirecrawl(r.stdout)
    await log($, 'firecrawl', `${found.length} pages for "${q}"`)
    for (const s of found) {
      if (!sources.some(x => x.url === s.url)) sources.push(s)
    }
  }
  const kept = sources.slice(0, MAX_SOURCES)
  // Count each kept page once, cut where the worker cuts it, so "before" is not inflated.
  for (const s of kept) job.read += s.title.length + s.url.length + Math.min(s.text.length, PAGE_CHARS)
  return { sources: kept, notes: [] as string[] }
}

// First choice, no outside service: the built-in WebSearch for links, then each page read for real.
// Tried even when $.tool.list leaves WebSearch out, because a deferred tool is not on that list.
async function viaWebTools($: EngineInterface, job: Job, queries: string[], question: string, o: { official: string[]; since: string | null; today: string }) {
  // The official pages the planner named are read first, ahead of anything the search finds.
  const links: Link[] = o.official.map(url => ({ title: url, url }))
  const notes: string[] = []
  for (const [i, q] of queries.entries()) {
    await step($, job.id, `Searching ${i + 1} of ${queries.length}`)
    let r: CallResult
    try {
      r = await callTool($, { tool: 'WebSearch', query: q })
    } catch (err) {
      // No such tool, or no answer in time: asking again would only wait again.
      await log($, 'WebSearch', err)
      break
    }
    // The pane counts only calls that ran; a missing tool or a timeout goes to the log alone.
    await used($, job, 'WebSearch', 'built-in')
    const text = resultText(r)
    const bad = problem(r, text)
    if (bad) {
      await log($, 'WebSearch', `${bad} for "${q}"`)
      if (r.deny) break
      continue
    }
    const found = searchParts(r, text)
    await log($, 'WebSearch', `${commas(text.length)} characters, ${found.links.length} links for "${q}"`)
    job.read += text.length
    notes.push(...found.notes)
    for (const l of found.links) if (!links.some(x => x.url === l.url)) links.push(l)
  }
  const sources: Source[] = []
  const toRead = links.slice(0, MAX_FETCHES)
  for (const [i, link] of toRead.entries()) {
    await step($, job.id, `Reading page ${i + 1} of ${toRead.length}`)
    const page = await readPage($, job, link, question, o.today)
    if (!page) {
      await log($, `run ${job.id}`, `page ${i + 1}: not read, ${link.url}`)
      continue
    }
    job.read += Math.min(page.text.length, PAGE_CHARS)
    // A page whose newest date is before the window holds nothing from inside it.
    if (o.since && page.newest && page.newest < o.since) {
      await log($, `run ${job.id}`, `page ${i + 1}: skipped, its newest date ${page.newest} is before ${o.since}, ${link.url}`)
      continue
    }
    await log($, `run ${job.id}`, `page ${i + 1}: read by ${page.via}, ${commas(page.text.length)} characters${page.newest ? `, newest date ${page.newest}` : ''}, ${link.url}`)
    sources.push(page)
  }
  // Only pages read count as sources. Links nobody read are listed apart, unless no page was read at all.
  const unread = links.filter(l => !sources.some(s => s.url === l.url))
  if (!sources.length) for (const link of unread.slice(0, MAX_SOURCES)) sources.push({ ...link, text: '', via: 'search link, not read' })
  return { sources, notes, unread: sources.some(s => s.text) ? unread : [] }
}

// One short Haiku call: keep only the pages about the request itself, and inside its time window.
async function relevant($: EngineInterface, job: Job, question: string, sources: Source[], since: string | null, today: string) {
  const read = sources.filter(s => s.text)
  if (!read.length) return sources
  try {
    const text = await ask(
      $,
      job,
      [
        `Today is ${today}.`,
        `Research request: ${question}`,
        since ? `The request covers ${since} to ${today}.` : '',
        '',
        'Pages found for it, numbered, each with its first lines:',
        read.map((s, i) => `[${i + 1}] ${s.title} (${s.url})${s.newest ? `, newest date ${s.newest}` : ''}\n${s.text.slice(0, 600)}`).join('\n\n'),
        '',
        'Which pages to keep: a page stays only if it is about the subject of the request itself, not a different product or project with a similar name.',
        since ? 'With a time window, a page stays only if it holds something from inside the window.' : '',
        'Answer with this JSON and nothing else: {"keep":[1,2],"why":"one short line"}',
      ]
        .filter(l => l !== '')
        .join('\n'),
      200,
      PLAN_MS,
    )
    const json = /\{[\s\S]*\}/.exec(text)?.[0]
    if (!json) throw new Error('the relevance check gave no JSON')
    const data = JSON.parse(json) as { keep?: unknown; why?: unknown }
    if (!Array.isArray(data.keep)) throw new Error('the relevance check gave no "keep" list')
    const keep = new Set(data.keep.map(Number))
    const kept = read.filter((_, i) => keep.has(i + 1))
    const dropped = read.filter((_, i) => !keep.has(i + 1))
    await log($, `run ${job.id}`, `relevance check kept ${kept.length} of ${read.length} pages${dropped.length ? `, dropped ${dropped.map(s => s.url).join(' ')}` : ''}${typeof data.why === 'string' ? `: ${oneLine(data.why, 160)}` : ''}`)
    return kept
  } catch (err) {
    await log($, 'relevance', `${err instanceof Error ? err.message : String(err)}; every page kept`)
    return sources
  }
}

// The last resort: a connector that says it searches the web, asked with a plain query.
async function viaConnector($: EngineInterface, job: Job, k: Kit, query: string) {
  for (const c of k.connectors.slice(0, 2)) {
    await step($, job.id, `Searching with ${shortName(c.name)}`)
    let r: CallResult
    try {
      r = await callTool($, { tool: c.name, query })
    } catch (err) {
      await log($, shortName(c.name), err)
      continue
    }
    await used($, job, shortName(c.name), 'connector')
    const text = resultText(r)
    const bad = problem(r, text) || (text.length < 200 ? 'too short' : '')
    await log($, shortName(c.name), bad || `${commas(text.length)} characters`)
    if (bad) continue
    job.read += text.length
    const links = searchParts(r, text).links.slice(0, MAX_SOURCES)
    // A connector's text is background; its links are the sources.
    return { sources: links.map(l => ({ ...l, text: '', via: `${shortName(c.name)} link` })), notes: [text] }
  }
  return { sources: [] as Source[], notes: [] as string[] }
}

async function writeUp($: EngineInterface, job: Job, question: string, sources: Source[], notes: string[], today: string, since: string | null) {
  let room = ALL_CHARS
  const take = (s: string) => {
    const body = s.slice(0, Math.max(0, Math.min(PAGE_CHARS, room)))
    room -= body.length
    return body
  }
  const blocks = sources.map((s, i) => `[${i + 1}] ${s.title} (${s.url})\n${s.text ? take(s.text) : '(page not read; only the search engine listed it)'}`)
  const background = notes.map(n => take(n)).filter(Boolean)
  const text = await ask(
    $,
    job,
    [
      `Today is ${today}.${since ? ` The question covers ${since} to ${today}: leave out anything dated before ${since}, and say so if little falls inside it.` : ''}`,
      `Question: ${question}`,
      '',
      'Sources, numbered:',
      blocks.join('\n\n---\n\n') || '(none: no page was about the question)',
      '',
      'Search engine notes (background only, no number of their own; a claim from them takes the number of the source it names, else no number):',
      background.join('\n\n---\n\n') || '(none)',
      '',
      'Write two parts.',
      'BRIEF: at most 180 words. Lead with the direct answer. Put [n] after each claim, n being the source number. Say plainly what the sources do not settle.',
      CAVEATS,
      'NOTES: detailed notes for a later reader, source by source: the facts, numbers, dates and short quotes that bear on the question, each with its [n]. At most 900 words.',
      'If the sources do not answer the question, say so in the brief.',
      'Answer in exactly this form and nothing else:',
      '<brief>...</brief>',
      '<notes>...</notes>',
    ].join('\n'),
    2500,
    WRITE_MS,
  )
  const brief = /<brief>([\s\S]*?)<\/brief>/i.exec(text)?.[1] ?? text.slice(0, 1200)
  const more = /<notes>([\s\S]*?)<\/notes>/i.exec(text)?.[1] ?? text
  return { brief: clean(brief, 1600), notes: clean(more, 12_000) }
}

function partPrompt(question: string, part: string, n: number, total: number, today: string) {
  return [
    `Today is ${today}.`,
    `You are research worker ${n} of ${total}. Research only this part:`,
    part,
    '',
    `It is one part of a bigger question: ${question}`,
    '',
    'Use WebSearch to find sources. If you have WebFetch, read the best 2 or 3 pages.',
    'Then answer in at most 250 words of plain English: the facts, numbers, dates and names that answer your part. Put [n] after each claim, matching your source list.',
    CAVEATS,
    'End with this exact block and nothing after it:',
    'SOURCES:',
    '1. Page title | https://full.page/url',
    '2. Page title | https://full.page/url',
    'Rules: list only pages you found, by their full page URL. A search query is not a source. Never paste raw pages or long quotes. Never invent a number, name, date or quote. Never use em dashes.',
  ].join('\n')
}

// A subagent's report: its text, and its own numbered source list.
function parseReport(answer: string) {
  const at = answer.search(/\n\s*SOURCES:\s*\n/i)
  const body = (at >= 0 ? answer.slice(0, at) : answer).trim()
  const tail = at >= 0 ? answer.slice(at) : ''
  const list = new Map<number, Link>()
  for (const m of tail.matchAll(/^\s*(\d+)[.)]\s*(.*?)\s*\|\s*(https?:\/\/\S+)\s*$/gm)) list.set(Number(m[1]), { title: oneLine(m[2] || m[3] || '', 160), url: m[3] ?? '' })
  if (!list.size) for (const [i, u] of urlsIn(tail || answer).entries()) list.set(i + 1, { title: u, url: u })
  return { body, list }
}

function waitFor($: EngineInterface, agentId: string, ms: number): Promise<Done> {
  const early = answers.get(agentId)
  if (early) {
    answers.delete(agentId)
    return Promise.resolve(early)
  }
  return new Promise(resolve => {
    const timer = $.clock.after(ms, () => {
      waiters.delete(agentId)
      resolve({ answer: '', reason: `no answer in ${ms / 1000} s` })
    })
    waiters.set(agentId, d => {
      timer.cancel()
      waiters.delete(agentId)
      resolve(d)
    })
  })
}

async function setAgent($: EngineInterface, id: number, part: number, change: (a: AgentView) => AgentView) {
  await setRun($, id, r => ({ ...r, agents: r.agents.map(a => (a.part === part ? change(a) : a)) }))
}

// Deep mode: one general-purpose subagent per part. Model Router's agent.spawn hook picks each model.
async function viaSubagents($: EngineInterface, job: Job, question: string, parts: string[], today: string) {
  const total = parts.length
  await setRun($, job.id, r => ({ ...r, agents: parts.map((p, i) => ({ part: i + 1, question: p, model: 'starting', status: 'working' })) }))
  await step($, job.id, `Starting ${total} subagents`)
  let finished = 0
  const results = await Promise.all(
    parts.map(async (part, i) => {
      const n = i + 1
      try {
        const spawned = await $.agent.spawn({
          prompt: partPrompt(question, part, n, total, today),
          description: `${TITLE} run ${job.id} part ${n} of ${total}`,
          subagentType: 'general-purpose',
        })
        if (spawned.deny || !spawned.agentId) throw new Error(spawned.deny ? `refused: ${oneLine(spawned.deny, 160)}` : 'no agent id')
        owned.add(spawned.agentId)
        // With no model chosen by a hook, the spawn reports "inherit": the chat's own model.
        // Any other answer means a hook (Model Router) picked the model.
        const picked = spawned.model !== 'inherit'
        const first = picked ? spawned.model : "the chat's model"
        await setAgent($, job.id, n, a => ({ ...a, model: first, picked }))
        await log($, `run ${job.id}`, `subagent ${n} of ${total} on ${spawned.model}, ${spawned.agentId}`)
        const done = await waitFor($, spawned.agentId, PART_MS)
        finished += 1
        await step($, job.id, `Subagents: ${finished} of ${total} done`)
        // What it read and what it cost count even when it gave no report: the tokens were spent.
        const chars = agentChars.get(spawned.agentId) ?? 0
        const steps = agentSteps.get(spawned.agentId) ?? []
        agentChars.delete(spawned.agentId)
        agentSteps.delete(spawned.agentId)
        job.read += chars + done.answer.length
        let cost: number | null = null
        for (const s of steps) {
          const c = requestCost(s.model, s, true)
          if (c !== null) cost = (cost ?? 0) + c
        }
        if (!steps.length && done.usage) cost = requestCost(done.usage.model, done.usage, false)
        job.agentCost += cost ?? 0
        await log(
          $,
          `run ${job.id}`,
          `subagent ${n}: its tools returned ${commas(chars)} characters, report ${commas(done.answer.length)} characters, cost ${cost === null ? 'unknown (no usage or no price)' : money(cost)}${steps.length ? `, priced by ${steps.length} requests` : done.usage ? ', priced from its turn total' : ''}`,
        )
        if (!done.answer.trim()) throw new Error(done.reason === 'answer' ? 'empty report' : done.reason)
        const model = done.model ?? first
        await setAgent($, job.id, n, a => ({ ...a, model, status: 'done', ...(cost === null ? {} : { cost }) }))
        return { n, part, model, done }
      } catch (err) {
        const why = err instanceof Error ? err.message : String(err)
        await log($, `run ${job.id}`, `subagent ${n} failed: ${why}`)
        await setAgent($, job.id, n, a => ({ ...a, status: 'failed', note: oneLine(why, 120) }))
        return { n, part, model: '', done: null as Done | null, why }
      }
    }),
  )
  const sources: Source[] = []
  const reports: string[] = []
  const failed: string[] = []
  const models: string[] = []
  for (const r of results) {
    if (!r.done) {
      failed.push(`part ${r.n} (${r.part}): ${'why' in r ? r.why : 'failed'}`)
      continue
    }
    models.push(r.model)
    const { body, list } = parseReport(r.done.answer)
    // The report's own [n] become the global numbers.
    const map = new Map<number, number>()
    for (const [local, link] of list) {
      let g = sources.findIndex(s => s.url === link.url)
      if (g < 0) {
        sources.push({ ...link, text: '', via: `subagent ${r.n}` })
        g = sources.length - 1
      }
      map.set(local, g + 1)
    }
    const renumbered = body.replace(/\[(\d+(?:\s*,\s*\d+)*)\]/g, (all, nums: string) => {
      const out = nums.split(',').map(s => map.get(Number(s.trim())))
      return out.every(Boolean) ? `[${out.join(', ')}]` : all
    })
    reports.push(`Part ${r.n}: ${r.part}\n${renumbered}`)
  }
  await used($, job, 'general-purpose subagent', 'subagent', results.length)
  return { sources, reports, failed, models: tally(models) }
}

async function joinReports($: EngineInterface, job: Job, question: string, sources: Source[], reports: string[], failed: string[]) {
  const text = await ask(
    $,
    job,
    [
      `Question: ${question}`,
      '',
      'Sources, numbered:',
      sources.map((s, i) => `[${i + 1}] ${s.title} (${s.url})`).join('\n') || '(none)',
      '',
      'Reports from the research workers, already using those numbers:',
      reports.join('\n\n---\n\n').slice(0, ALL_CHARS),
      '',
      failed.length ? `These parts failed and have no report: ${failed.join('; ')}` : '',
      'Write one BRIEF: at most 200 words. Lead with the direct answer. Keep the [n] after each claim. Say plainly what the reports do not settle, and name any part that failed.',
      CAVEATS,
      'Answer in exactly this form and nothing else:',
      '<brief>...</brief>',
    ].join('\n'),
    1200,
    WRITE_MS,
  )
  return clean(/<brief>([\s\S]*?)<\/brief>/i.exec(text)?.[1] ?? text.slice(0, 1400), 1800)
}

function slug(question: string) {
  return (
    question
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 40)
      .replace(/-+$/, '') || 'research'
  )
}

function toolLine(tools: ToolUse[]) {
  return tools.map(t => `${t.name} x${t.calls}`).join(', ')
}

function sourceLines(sources: Source[]) {
  return sources.map((s, i) => `[${i + 1}] ${s.title}: ${s.url}`)
}

function briefMessage(question: string, brief: string, sources: Source[], notesPath: string, failed: string[]) {
  return [
    `${TITLE} brief`,
    `Question: ${oneLine(question, 300)}`,
    '',
    brief,
    ...(failed.length ? ['', `Not covered, a subagent failed: ${failed.join('; ')}`] : []),
    '',
    'Sources:',
    ...sourceLines(sources),
    '',
    `Full notes, only if the brief leaves a gap: ${notesPath}`,
    'Answer the question from this brief.',
  ].join('\n')
}

function notesFile(o: {
  question: string
  when: string
  mode: Plan['mode']
  job: Job
  queries: string[]
  brief: string
  notes: string
  sources: Source[]
  before: number
  after: number
  cost: number
  models: string[]
  failed: string[]
  since: string | null
  unread: Link[]
}) {
  return [
    `# Research notes: ${oneLine(o.question, 200)}`,
    '',
    `- When: ${o.when}`,
    `- Mode: ${o.mode}${o.models.length ? `, subagents on ${o.models.join(', ')}` : ''}`,
    `- Worker: ${MODEL}, run by the ${TITLE} mod. Haiku cost about ${money(o.cost - o.job.agentCost)} at list price.`,
    ...(o.mode === 'deep' ? [`- Subagents cost about ${money(o.job.agentCost)} at list price, each request priced by its own size. Run total: about ${money(o.cost)}.`] : []),
    ...(o.since ? [`- Time window: ${o.since} to ${o.when.slice(0, 10)}. Pages whose newest date is older were skipped.`] : []),
    `- Tools used: ${toolLine(o.job.tools)}`,
    ...(o.mode === 'quick' ? [`- Search queries: ${o.queries.map(q => `"${q}"`).join(', ')}`, `- Pages read: ${o.sources.filter(s => s.text).length}`] : []),
    ...(o.failed.length ? [`- Failed parts: ${o.failed.join('; ')}`] : []),
    `- Tokens: the worker${o.mode === 'deep' ? ' and the subagents' : ''} read about ${commas(o.before)} tokens; Claude read about ${commas(o.after)} (the command reply and the brief).`,
    o.mode === 'deep'
      ? "- How tokens are counted: the text the subagents' tools returned (search results and pages) plus their reports, characters divided by 4, an estimate. Cache reads are not counted: they are the same prompt read again."
      : '- How tokens are counted: characters divided by 4, an estimate.',
    '',
    '## Brief (what Claude got)',
    '',
    o.brief,
    '',
    o.mode === 'deep' ? '## Subagent reports' : '## Notes',
    '',
    o.notes,
    '',
    '## Sources',
    '',
    ...o.sources.map((s, i) => `${i + 1}. ${s.title}, ${s.url} (${s.via}${s.newest ? `, newest date ${s.newest}` : ''})`),
    '',
    ...(o.unread.length ? ['## Links listed but not read (not counted as sources)', '', ...o.unread.map(l => `- ${l.title}, ${l.url}`), ''] : []),
    ...(o.sources.some(s => s.text)
      ? [
          `## Page text, as read (each cut at ${commas(NOTE_PAGE_CHARS)} characters)`,
          '',
          ...o.sources.filter(s => s.text).flatMap(s => [`### [${o.sources.indexOf(s) + 1}] ${s.title}`, '', `${s.url}, read by ${s.via}`, '', s.text.slice(0, NOTE_PAGE_CHARS), '']),
        ]
      : []),
  ].join('\n')
}

async function runResearch($: EngineInterface, id: number, question: string, reply: number, forceDeep: boolean) {
  const job: Job = { id, question, reply, tools: [], helperIn: 0, helperOut: 0, read: 0, agentCost: 0 }
  const t0 = await $.clock.now()
  const today = day(t0)
  const secs = async () => Math.round((await $.clock.now()) - t0) / 1000
  try {
    await step($, id, 'Planning')
    // Firecrawl runs in this folder, so it must exist. Windows has no mkdir program: writing a file makes the folder.
    if (await isWin($)) await $.fs.write(`${notesDir()}/.keep`, '').catch(() => undefined)
    else await $.process.run(['/bin/mkdir', '-p', notesDir()], { timeoutMs: 10_000 }).catch(() => undefined)
    const k = await refreshTools($)
    const p = await plan($, job, question, forceDeep, today)
    // The words of the request settle the window first; the planner's reading is the second choice.
    const since = windowStart(question, t0) ?? p.since
    await setRun($, id, r => ({ ...r, mode: p.mode }))
    await log(
      $,
      `run ${id}`,
      `${p.mode}; today ${today}${since ? `, window from ${since}` : ''}; queries: ${p.queries.map(q => `"${q}"`).join(', ')}${p.official.length ? `; official: ${p.official.join(' ')}` : ''}${p.parts.length ? `; parts: ${p.parts.map(q => `"${q}"`).join(', ')}` : ''}`,
    )

    let sources: Source[] = []
    let notes: string[] = []
    let brief = ''
    let more = ''
    let reports: string[] | undefined
    let failed: string[] = []
    let models: string[] = []
    let unread: Link[] = []
    if (p.mode === 'deep') {
      const d = await viaSubagents($, job, question, p.parts, today)
      failed = d.failed
      models = d.models
      if (!d.reports.length) throw new Error(`every subagent failed: ${d.failed.join('; ')}`)
      sources = d.sources
      await step($, id, 'Writing')
      brief = await joinReports($, job, question, sources, d.reports, failed)
      more = d.reports.join('\n\n')
      reports = d.reports.map(x => x.slice(0, REPORT_CHARS))
    } else {
      let got: { sources: Source[]; notes: string[]; unread?: Link[] } = await viaWebTools($, job, p.queries, question, { official: p.official, since, today }).catch(async err => {
        await log($, 'web tools', err)
        return { sources: [] as Source[], notes: [] as string[] }
      })
      // Firecrawl is an outside service, so it runs only when the built-in search is missing or fails.
      if (!got.sources.length && !got.notes.length && k.firecrawl) {
        await log($, 'fallback', 'WebSearch gave nothing, using the firecrawl CLI')
        got = await viaFirecrawl($, job, k.firecrawl, p.queries).catch(async err => {
          await log($, 'firecrawl', err)
          return { sources: [] as Source[], notes: [] as string[] }
        })
      }
      if (!got.sources.length && !got.notes.length && k.connectors.length) {
        await log($, 'fallback', k.firecrawl ? 'firecrawl gave nothing too, using a connector' : 'no firecrawl CLI, using a connector')
        got = await viaConnector($, job, k, p.queries[0] ?? question).catch(async err => {
          await log($, 'connector', err)
          return { sources: [] as Source[], notes: [] as string[] }
        })
      }
      if (!got.sources.length && !got.notes.length) throw new Error('no research tool on this computer returned anything')
      unread = got.unread ?? []
      await step($, id, 'Checking the pages fit the question')
      sources = await relevant($, job, question, got.sources, since, today)
      notes = got.notes
      await step($, id, 'Writing')
      const w = await writeUp($, job, question, sources, notes, today, since)
      brief = w.brief
      more = w.notes
    }

    const when = new Date(await $.clock.now()).toISOString()
    const notesPath = `${notesDir()}/${when.replace(/[-:]/g, '').slice(0, 15)}-${slug(question)}.md`
    const message = briefMessage(question, brief, sources, notesPath, failed)
    const before = tokens(job.read)
    const after = tokens(job.reply + message.length)
    const cost = dollars(job.helperIn, job.helperOut) + job.agentCost
    const pagesRead = p.mode === 'quick' ? sources.filter(s => s.text).length : undefined
    await $.fs.write(notesPath, notesFile({ question, when, mode: p.mode, job, queries: p.queries, brief, notes: more, sources, before, after, cost, models, failed, since, unread }))
    const line = {
      ts: when,
      session: await $.session.id().catch(() => 'unknown'),
      tool_use_id: null,
      mod: NAME,
      action: `research${p.mode === 'deep' ? ' deep' : ''}: ${oneLine(question, 80)}`,
      before,
      after,
      helper: { model: MODEL, in: job.helperIn, out: job.helperOut },
      ...(p.mode === 'deep' ? { subagents: { models, cost_usd: Math.round(job.agentCost * 1_000_000) / 1_000_000 } } : {}),
      measured: 'estimated',
      how:
        p.mode === 'deep'
          ? "before: the text the subagents' tools returned plus their reports, chars/4, cache reads not counted; after: reply and brief chars/4; subagents.cost_usd: each request at list price"
          : 'before: search results and page text the worker read, chars/4; after: reply and brief chars/4',
      detail: notesPath,
    }
    await append($, `${logsDir()}/savings.jsonl`, `${JSON.stringify(line)}\n`)
    const took = await secs()
    const view: SourceView[] = sources.map((s, i) => ({ n: i + 1, title: s.title, url: s.url }))
    await setRun($, id, r => ({
      ...r,
      status: 'done',
      step: 'Brief sent to Claude',
      sources: view,
      before,
      after,
      cost,
      ...(p.mode === 'deep' ? { agentCost: job.agentCost } : {}),
      ...(pagesRead === undefined ? {} : { pagesRead }),
      secs: took,
      notes: notesPath,
      brief: brief.slice(0, BRIEF_CHARS),
      reports,
    }))
    await log(
      $,
      'done',
      `run ${id} (${p.mode}) in ${took} s, ${sources.length} sources${pagesRead === undefined ? '' : `, ${pagesRead} pages read`}, ${toolLine(job.tools)}, before ${before}, after ${after}, Haiku ${money(cost - job.agentCost)}${p.mode === 'deep' ? `, subagents ${money(job.agentCost)} on ${models.join(', ') || 'none'}` : ''}`,
    )
    $.ui.toast(`${TITLE}: brief ready. About ${commas(Math.max(0, before - after))} tokens kept out of the chat.`)
    await $.prompt.submit({ text: message })
    await log($, `run ${id}`, 'brief sent to the chat')
  } catch (err) {
    const why = err instanceof Error ? err.message : String(err)
    await log($, 'failed', `run ${id}: ${why}`)
    const took = await secs()
    await setRun($, id, r => ({ ...r, status: 'failed', step: 'Stopped', error: oneLine(why, 200), secs: took, cost: dollars(job.helperIn, job.helperOut) + job.agentCost }))
    await $.prompt
      .submit({ text: `${TITLE} could not finish the research for: ${oneLine(question, 300)}\nReason: ${oneLine(why, 200)}\nTell me, and research it another way only if I ask.` })
      .catch(() => undefined)
  }
}

// Asked (the command, or Open in /mods) always opens it. On its own it opens only when not hidden and not closed.
async function openPane($: EngineInterface, asked = false) {
  if (asked) closed = false
  else if (closed || switchHidden) return
  try {
    await $.ui.open({ id: PANE, title: TITLE })
  } catch {
    // The pane is a nicety.
  }
}

async function closePane($: EngineInterface) {
  try {
    await $.ui.close({ id: PANE })
  } catch {
    // Not open.
  }
}

async function startRun($: EngineInterface, question: string, reply: number, forceDeep: boolean) {
  const runs = (await read($, runsAtom)) ?? []
  const id = (runs[0]?.id ?? 0) + 1
  const run: RunView = { id, at: await $.clock.now(), question: oneLine(question, 300), mode: forceDeep ? 'deep' : 'quick', status: 'working', step: 'Starting', tools: [], sources: [], agents: [] }
  await update($, runsAtom, list => [run, ...(list ?? [])].slice(0, MAX_RUNS))
  await openPane($, true)
  // The worker outlives this hook: a timer runs it, and the brief arrives as its own message.
  $.clock.after(0, () => {
    void runResearch($, id, question, reply, forceDeep).catch(err => log($, 'worker', err))
  })
  return id
}

async function addAuto($: EngineInterface, row: AutoView) {
  await update($, autoAtom, list => [row, ...(list ?? [])].slice(0, MAX_AUTO))
}

// Auto mode: the main chat's own WebSearch result, shortened by Haiku to what matters for the query.
// Every link entry stays as it is, so every URL stays. Any failure returns the original result.
async function shorten($: EngineInterface, query: string, toolUseId: string | undefined, r: CallResult): Promise<CallResult | null> {
  const record = r.result as WebSearchRecord | undefined
  if (r.deny || r.isError || !record || !Array.isArray(record.results)) return null
  const text = resultText(r)
  const before = tokens(text.length)
  const at = await $.clock.now()
  const commentary = record.results.filter((x): x is string => typeof x === 'string').join('\n\n')
  const extra = tokens(commentary.trim().length)
  // Only the commentary can shrink. Under the bar, Haiku would cost more than it saves.
  if (extra <= AUTO_MIN_COMMENTARY) {
    await log($, 'auto', `kept "${oneLine(query, 80)}" as it is, no Haiku call: ${commas(before)} tokens, commentary ${commas(extra)} tokens, at or under ${AUTO_MIN_COMMENTARY}`)
    await addAuto($, { at, query: oneLine(query, 120), status: 'kept', before, after: before, note: extra ? 'small already' : 'nothing to shorten' })
    return null
  }
  const sid = await $.session.id().catch(() => 'unknown')
  // Every Haiku call gets a ledger line, the ones that saved nothing too: they cost money.
  const ledger = async (after: number, result: string, u: { input: number; output: number }) => {
    const line = {
      ts: new Date(at).toISOString(),
      session: sid,
      tool_use_id: toolUseId ?? null,
      mod: NAME,
      action: `auto: ${oneLine(query, 80)}`,
      result,
      before,
      after,
      helper: { model: MODEL, in: u.input, out: u.output },
      measured: 'estimated',
      how: "before: the WebSearch result as the model reads it, chars/4; after: the same text with the commentary swapped for Haiku's shorter one, chars/4 (the same as before when nothing was swapped)",
    }
    await append($, `${logsDir()}/savings.jsonl`, `${JSON.stringify(line)}\n`)
  }
  // Haiku is about to work on this search: show the pane, and the mascot moves until it answers.
  void openPane($)
  await update($, busyAtom, n => (n ?? 0) + 1)
  const m = await $.model
    .complete({
    model: MODEL,
    system: SYSTEM,
    prompt: [
      `Search query: ${query}`,
      '',
      "Below is a web search tool's commentary on its results. Shorten it to the findings that matter for the query.",
      'Keep every number, name, date and URL that bears on the query, each finding next to its URL. Short bullets. At most 250 words. No preamble.',
      '',
      'Commentary:',
      commentary.slice(0, ALL_CHARS),
    ].join('\n'),
    maxTokens: 700,
    // There is no switch for thinking here: low effort is the least the engine can ask for.
    effort: 'low',
    timeoutMs: AUTO_MS,
  })
    .finally(() => update($, busyAtom, n => Math.max(0, (n ?? 0) - 1)))
  const u = countUsage(m.usage)
  const cost = dollars(u.input, u.output)
  if (!m.isAnswered || !m.text.trim()) {
    await log($, 'auto', `Haiku gave no answer for "${oneLine(query, 80)}" (${m.isAnswered ? 'empty' : m.reason}), original kept, cost ${money(cost)}`)
    await ledger(before, 'failed', u)
    await addAuto($, { at, query: oneLine(query, 120), status: 'failed', before, after: before, note: 'Haiku gave no answer, original kept', cost })
    return null
  }
  let short = clean(m.text, 4000)
  // The link entries hold the URLs; a URL only the commentary named is put back by hand.
  const have = new Set([...urlsIn(JSON.stringify(record.results.filter(x => typeof x !== 'string'))), ...urlsIn(short)])
  const lost = urlsIn(commentary).filter(x => !have.has(x))
  if (lost.length) short += `\n\nOther URLs in the results: ${lost.join(' ')}`
  const after = tokens(text.length - commentary.length + short.length)
  if (after >= before) {
    await log($, 'auto', `no saving for "${oneLine(query, 80)}": Haiku's text came to ${commas(after)} tokens against ${commas(before)}, original kept, cost ${money(cost)}`)
    await ledger(before, 'no saving', u)
    await addAuto($, { at, query: oneLine(query, 120), status: 'kept', before, after: before, note: 'no saving', cost })
    return null
  }
  await ledger(after, 'shortened', u)
  await log($, 'auto', `shortened "${oneLine(query, 80)}": ${commas(before)} to ${commas(after)} tokens, cost ${money(cost)}`)
  await addAuto($, { at, query: oneLine(query, 120), status: 'shortened', before, after, cost })
  return { result: { ...record, results: [...record.results.filter(x => typeof x !== 'string'), short] } }
}

function noop() {}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    home = $.plugin.root.replace(/\\/g, '/').split('/.claude/')[0] ?? ''
    session = await $.session.id().catch(() => '')
    await $.command.register({
      name: COMMAND,
      description: 'Research Router: a cheap worker runs the web research and gives Claude a short brief with sources. Put deep first for subagents. "pane" opens the pane.',
      argumentHint: '[deep] <question> | pane',
      immediate: true,
    })
    await readSwitch($).catch(err => log($, 'switches', err))
    $.clock.every(3000, () => {
      void readSwitch($)
        .then(() => checkOpen($))
        .catch(err => log($, 'switches', err))
    })
    $.clock.after(0, () => {
      void refreshTools($).catch(err => log($, 'tools', err))
    })
    return next(e)
  })

  on('command.run', { command: COMMAND }, async ($, e) => {
    if (off) return { text: OFF_TEXT }
    const raw = (e.args ?? '').trim()
    if (/^pane$/i.test(raw)) {
      await openPane($, true)
      const runs = (await read($, runsAtom)) ?? []
      const autos = (await read($, autoAtom)) ?? []
      const short = autos.filter(a => a.status === 'shortened').length
      return { text: `${TITLE} pane open. This chat: ${runs.length} research run${runs.length === 1 ? '' : 's'}, ${short} of ${autos.length} searches shortened.` }
    }
    const forceDeep = /^deep\b/i.test(raw)
    const question = raw.replace(/^deep\b[\s:,-]*/i, '').trim()
    if (!question) {
      await openPane($, true)
      return { text: USAGE_TEXT }
    }
    const reply = forceDeep
      ? `${TITLE} is on it, in deep mode. ${MODEL} splits the question, and 2 to 4 subagents research the parts. A short brief with sources comes back here as a new message. Do not research this yourself meanwhile.`
      : `${TITLE} is on it. A cheap worker (${MODEL}) plans the research, searches the web and reads the pages. A short brief with sources comes back here as a new message. Do not research this yourself meanwhile.`
    await startRun($, question, reply.length, forceDeep)
    return { text: reply }
  })

  // Auto mode. Only the main chat's own searches: the mod's own calls (origin is this plugin) and
  // every subagent's (agentId set, the deep-mode ones too) pass through, so nothing loops.
  on('tool.call', { tool: 'WebSearch' }, async ($, e, next) => {
    if (off || next.origin.plugin !== 'engine' || e.agentId) return next(e)
    const r = await next(e)
    try {
      const short = await shorten($, String(e.query ?? ''), e.tool_use_id, r as CallResult)
      return short ? (short as typeof r) : r
    } catch (err) {
      void log($, 'auto', err)
      return r
    }
  })

  // Deep mode counts what each subagent's tools handed it: the search results and pages it read.
  on('tool.call', async ($, e, next) => {
    const r = await next(e)
    const id = (e as { agentId?: string }).agentId
    if (id) remember(agentChars, id, (agentChars.get(id) ?? 0) + resultText(r as unknown as CallResult).length)
    return r
  })

  // Deep mode prices each subagent request by its own size, as Model Router does.
  on('turn.step', async function* ($, e, next) {
    const result = yield* next(e)
    if (e.agentId && result.usage) remember(agentSteps, e.agentId, [...(agentSteps.get(e.agentId) ?? []), result.usage])
    return result
  })

  // A deep-mode subagent's answer is its turn.complete.
  on('turn.complete', async ($, e, next) => {
    const id = e.agentId
    if (id) {
      const done: Done = { answer: e.answer ?? '', reason: e.reason, model: e.usage?.model, ...(e.usage ? { usage: e.usage } : {}) }
      const w = waiters.get(id)
      if (w) w(done)
      else if (!answers.has(id)) {
        answers.set(id, done)
        // Only a few fast answers wait here; old ones nobody claimed go.
        for (const k of [...answers.keys()].slice(0, Math.max(0, answers.size - 16))) answers.delete(k)
      }
    }
    return next(e)
  })

  // Keep a finished subagent's report out of the main chat: it goes into the brief instead.
  on('prompt.submit', async ($, e, next) => {
    if (e.origin?.kind === 'task-notification' && owned.size) {
      const hit = [...owned].find(id => e.text.includes(id))
      if (hit) {
        void log($, 'notification', `dropped the task notification of subagent ${hit}`)
        return { drop: `${TITLE}: a research subagent finished. Its report goes into the brief.` }
      }
    }
    return next(e)
  }).catch(($, e, next) => next(e))

  on('ui.close', async ($, e, next) => {
    if (e.id === PANE && e.origin.kind === 'person') closed = true
    return next(e)
  }).catch(($, e, next) => next(e))

  on('ui.press', { plugin: NAME }, async ($, e) => {
    const x = /^expand-(\d+)$/.exec(e.element)
    if (x) {
      const id = Number(x[1])
      await update($, openAtom, l => ((l ?? []).includes(id) ? (l ?? []).filter(v => v !== id) : [...(l ?? []), id]))
      return { element: e.element }
    }
    const m = /^open-(\d+)$/.exec(e.element)
    if (m) {
      const run = ((await read($, runsAtom)) ?? []).find(r => r.id === Number(m[1]))
      if (run?.notes) {
        const opened = (await isWin($))
          ? ps($, 'Start-Process -FilePath $env:MODS_PATH', { MODS_PATH: run.notes.replace(/\//g, '\\') }, { timeoutMs: 10_000 })
          : $.process.run(['/usr/bin/open', run.notes], { timeoutMs: 10_000 })
        await opened.catch(err => log($, 'open', err))
      }
    }
    return { element: e.element }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const els = $.ui.resolve(e)
    const { Box, Text, Link, Button } = els
    if (await read($, offAtom)) return <Text dimColor>Turned off. Open /mods to turn it on.</Text>
    // Svg draws on desktop, the editor and mobile; the terminal gets a glyph.
    const Svg = e.surface !== 'terminal' && 'Svg' in els ? els.Svg : null
    const width = Math.max(24, e.props.bodyColumns)
    const runs = (await read($, runsAtom)) ?? []
    const autos = (await read($, autoAtom)) ?? []
    const found = await read($, foundAtom)
    const routed = await read($, routerAtom)
    // A spawn that came back on a picked model proves a hook picked it then. Only the newest deep run counts,
    // so the line follows the switch again once a later run has no picked model.
    const newestDeep = runs.find(r => r.mode === 'deep')
    const pickedLast = Boolean(newestDeep?.agents.some(a => a.picked))
    const routerSeen = Boolean(routed) || pickedLast
    const lastDeep = runs.find(r => r.mode === 'deep' && r.agents.some(a => a.status === 'done'))
    const lastModels = lastDeep ? tally(lastDeep.agents.filter(a => a.status === 'done').map(a => a.model)) : []
    const open = (await read($, openAtom)) ?? []
    const shortening = ((await read($, busyAtom)) ?? 0) > 0
    const live = runs.find(r => r.status === 'working')
    const busy = Boolean(live) || shortening
    const cw = width - 4
    const tools = found
      ? `Tools: WebSearch, page reads${found.firecrawl ? ', firecrawl CLI as fallback' : ''}${found.connectors.length ? `, ${found.connectors.join(', ')}` : ''}`
      : 'Looking for research tools...'

    const mascot = Svg ? (
      <Box key="mascot" width={12} flexShrink={0}>
        <Svg source={explorerSvg(busy)} alt="Claude explorer with a helmet and a magnifying glass" width={66} height={48} />
      </Box>
    ) : (
      <Box key="mascot" width={6} flexShrink={0}>
        <Text color={ACCENT}>{busy ? '▟█▙⌕' : '▟█▙ '}</Text>
      </Box>
    )
    const doing = live ? `Researching: ${live.step}` : shortening ? 'Haiku is shortening a search…' : TITLE

    const card = (r: RunView) => {
      const models = tally(r.agents.filter(a => a.status === 'done').map(a => a.model))
      const spent =
        r.agentCost !== undefined ? `Cost: ${money(r.cost ?? 0)} (Haiku ${money((r.cost ?? 0) - r.agentCost)}, subagents ${money(r.agentCost)}).` : `Haiku: ${money(r.cost ?? 0)}.`
      const saved =
        r.before !== undefined && r.after !== undefined
          ? `Kept out of the chat: about ${commas(Math.max(0, r.before - r.after))} tokens. ${spent} Time: ${r.secs ?? 0} s.${models.length ? ` Subagents on ${models.join(', ')}.` : ''}`
          : ''
      const working = r.status === 'working'
      const isOpen = open.includes(r.id)
      const more = Boolean(r.brief || r.reports?.length)
      return (
        <Box
          key={`run-${r.id}`}
          flexDirection="column"
          borderStyle="round"
          borderColor={working ? ACCENT : undefined}
          borderDimColor={!working}
          paddingX={1}
          marginBottom={1}
          width={width}
          flexShrink={0}
        >
          <Text key="q" bold wrap="wrap">
            {r.question}
          </Text>
          <Text key="status" dimColor={r.status !== 'failed'} color={r.status === 'failed' ? 'red' : undefined} wrap="wrap">
            {`${r.mode === 'deep' ? 'Deep' : 'Quick'}. ${r.status === 'working' ? r.step : r.status === 'done' ? `Done, ${r.sources.length} sources${r.pagesRead !== undefined && r.pagesRead < r.sources.length ? `, ${r.pagesRead} pages read` : ''}.` : `Failed: ${r.error ?? 'unknown'}`}`}
          </Text>
          {r.mode === 'deep' && !routerSeen && r.status === 'working' && !r.agents.some(a => a.picked) && (
            <Text key="router" dimColor wrap="wrap">
              Model Router is off, so the subagents use the chat's own model.
            </Text>
          )}
          {r.agents.map(a => (
            <Text key={`agent-${a.part}`} dimColor wrap="wrap">
              {`Subagent ${a.part} of ${r.agents.length} on ${a.model}: ${a.status}${a.note ? `, ${a.note}` : ''}`}
            </Text>
          ))}
          {r.sources.map(s =>
            s.url.startsWith('https://') ? (
              <Link key={`src-${s.n}`} href={s.url} label={`[${s.n}] ${s.title}`} />
            ) : (
              <Text key={`src-${s.n}`} wrap="wrap">
                {`[${s.n}] ${s.title}: ${s.url}`}
              </Text>
            ),
          )}
          {saved && (
            <Text key="saved" color={GOOD} wrap="wrap">
              {saved}
            </Text>
          )}
          {(more || r.notes) && (
            <Box key="buttons" flexDirection="row" justifyContent="space-between" width={cw}>
              {r.notes ? <Button key={`open-${r.id}`} label="Open notes" onPress={noop} /> : <Text> </Text>}
              {more ? (
                <Button key={`expand-${r.id}`} plain dimColor onPress={noop}>
                  {isOpen ? '▾ Hide brief' : r.reports?.length ? '▸ Brief and reports' : '▸ Brief'}
                </Button>
              ) : null}
            </Box>
          )}
          {isOpen && more && (
            <Box key="more" flexDirection="column" width={cw} marginTop={1}>
              <Text bold>The brief Claude got</Text>
              <Text wrap="wrap">{r.brief || 'No brief was kept.'}</Text>
              {(r.reports ?? []).map((t, i) => (
                <Box key={`rep-${i}`} flexDirection="column" width={cw} marginTop={1}>
                  <Text bold>{`Subagent report ${i + 1} of ${r.reports?.length ?? 0}`}</Text>
                  <Text dimColor wrap="wrap">
                    {t}
                  </Text>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      )
    }

    return (
      <Box flexDirection="column" width={width}>
        <Box key="header" flexDirection="row" gap={1} width={width} marginBottom={1}>
          {mascot}
          <Box flexDirection="column" width={width - 13}>
            <Text bold color={busy ? ACCENT : undefined} wrap="wrap">
              {doing}
            </Text>
            <Text dimColor wrap="wrap">
              A cheap worker reads the web. Claude gets a short brief.
            </Text>
          </Box>
        </Box>
        <Text key="tools" dimColor wrap="wrap">
          {tools}
        </Text>
        <Text key="router" dimColor wrap="wrap">
          {`${routed ? 'Model Router: on. It picks each deep-mode subagent model.' : pickedLast ? "Model Router: a hook picked the last deep run's subagent models." : "Model Router: off. Deep-mode subagents use the chat's own model."}${lastModels.length ? ` Last deep run: ${lastModels.join(', ')}.` : ''}`}
        </Text>
        <Text key="gap"> </Text>
        {runs.length === 0 ? (
          <Text key="empty" dimColor wrap="wrap">
            {`No research yet. Type /${COMMAND} and a question, or /${COMMAND} deep and a question.`}
          </Text>
        ) : (
          runs.map(card)
        )}
        {autos.length > 0 && <Text key="auto-gap"> </Text>}
        {autos.length > 0 && (
          <Text key="auto-head" bold>
            Searches Claude ran
          </Text>
        )}
        {autos.map((a, i) => (
          <Box key={`auto-${i}`} flexDirection="row" gap={1} width={width}>
            <Text color={a.status === 'shortened' ? GOOD : a.status === 'failed' ? BAD : undefined} dimColor={a.status === 'kept'}>
              {a.status === 'shortened' ? '✓' : a.status === 'failed' ? '✗' : '·'}
            </Text>
            <Box width={width - 2}>
              <Text dimColor wrap="wrap">
                {`${
                  a.status === 'shortened' ? `"${a.query}": ${commas(a.before)} to ${commas(a.after)} tokens` : `"${a.query}": kept, ${commas(a.before)} tokens${a.note ? ` (${a.note})` : ''}`
                }${a.cost !== undefined ? `, Haiku ${money(a.cost)}` : ''}`}
              </Text>
            </Box>
          </Box>
        ))}
      </Box>
    )
  })
}
