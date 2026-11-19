import type { EngineInterface, Register } from 'claude-code'

// The Mods pane: every mod on this computer in three groups (token savers, chat tools,
// display), each with an On/Off switch that works in every chat (switches.json).
// A row that cannot have a switch says why. Mods that draw a pane or a band also
// get Shown/Hidden, kept as "<name>:hidden": true in the same file, and the side
// panes get Reopen. Each control shows only when the mod's code reads it; until
// then the row says it is missing. Each row says whose mod it is, with its source link, and the
// token savers show what they saved today (~/.claude/mods-logs/savings.jsonl).
// The list is found on disk, not typed in: every folder under ~/.claude/mods with a
// plugin.json and a hooks.json that has "modules", every CLAUDE_CODE_PLUGIN_DIRS
// folder (this chat's and the settings file's), and this chat's own
// ~/.claude/dev-mods/<session id>/ mods.

const PANE = 'mods'
const TITLE = 'Mods'
const NOTE = { plugin: 'mods', key: 'note' } as const
const POLL_MS = 3000
const SCAN_MS = 10_000
const RIGHT_COLS = 18
const LEDGER_MAX_BYTES = 3_500_000
const LEDGER_TAIL_LINES = 20_000

const GOOD = '#16a34a'
const WARN = '#b45309'
const INK = '#1a1c1c'

type Group = 'save' | 'chat' | 'show'
const GROUPS: readonly { id: Group; title: string; tint: string }[] = [
  { id: 'save', title: 'Token savers', tint: '#ddf3e4' },
  { id: 'chat', title: 'Chat tools', tint: '#e3eefb' },
  { id: 'show', title: 'Display', tint: '#fff4c2' },
]

// What the switchboard knows about a mod beyond its own files. hide: has a
// Shown/Hidden switch. ask: Show also leaves an open request. pane: has Open.
// origin, by, src: whose it is and where it came from, when plugin.json does not say.
type Known = {
  title: string
  what: string
  group: Group
  tip?: string
  pane?: boolean
  hide?: boolean
  ask?: boolean
  origin?: 'ours' | 'third'
  by?: string
  src?: string
  license?: string
  note?: string
}

const DAVILA = 'https://github.com/davila7/claude-code-templates/tree/main/cli-tool/components/mods/productivity'

// Known mods, in the order they show inside their group. Unknown mods follow, A to Z.
const KNOWN: Record<string, Known> = {
  'input-router': {
    title: 'Input Router',
    what: 'Big files and connector results are read by Haiku first. Claude gets short notes, and a pane shows each hand-off',
    group: 'save',
    pane: true,
    hide: true,
    ask: true,
    tip: '/input-router pane to open',
    origin: 'ours',
  },
  'read-router': { title: 'Read Router', what: 'Big file reads go to a cheap model. Claude gets short notes', group: 'save' },
  'image-offload': { title: 'Image Offload', what: 'Shrinks screenshots, or turns them into text, before Claude reads them', group: 'save' },
  'efficient-browser-use': {
    title: 'Efficient Browser Use',
    what: 'Shrinks each screenshot Claude takes in a browser, or has Haiku describe it in words',
    group: 'save',
    pane: true,
    hide: true,
    ask: true,
    tip: '/efficient-browser pane to open',
  },
  'web-fetch-cache': { title: 'Web Fetch Cache', what: 'A repeat web fetch in the same chat comes from cache', group: 'save', origin: 'third', by: 'davila7', src: `${DAVILA}/webfetch-cache` },
  'connector-reader': { title: 'Connector Reader', what: 'Big connector results are trimmed, or read by Haiku, first', group: 'save' },
  'research-router': {
    title: 'Research Router',
    what: 'A cheap worker does the research. Claude gets a short brief',
    group: 'save',
    pane: true,
    hide: true,
    ask: true,
    tip: '/research-router pane to open',
  },
  'jev-model-router': { title: 'Jev Model Router', what: 'Jev picks the model for each subagent', group: 'save', origin: 'third', by: 'davila7', src: `${DAVILA}/jev-model-router` },
  'model-router': {
    title: 'Subagent Model Selector',
    what: 'Haiku picks the model for each subagent, so easy jobs run on a cheaper model',
    group: 'save',
    pane: true,
    hide: true,
    ask: true,
    tip: '/model-router pane to open',
    origin: 'third',
    by: 'davila7',
    license: 'MIT',
    src: `${DAVILA}/jev-model-router`,
    note: 'Changed by BenAI: Haiku in place of Jev.',
  },
  'jev-compaction': { title: 'Jev Compaction', what: 'Jev picks what each old tool call keeps when the chat compacts', group: 'save', origin: 'third', by: 'tamaratran and notque', src: 'https://github.com/tamaratran/fast-jev-compaction' },
  'haiku-compaction': {
    title: 'Haiku Compaction',
    what: 'Haiku decides which old tool results to keep, shorten or drop when the chat compacts',
    group: 'save',
    origin: 'third',
    by: 'tamaratran and notque',
    license: 'MIT',
    src: 'https://github.com/tamaratran/fast-jev-compaction',
  },
  'context-router': { title: 'Context Router', what: 'Picks the skills and vault files each message needs', group: 'save' },
  'effort-optimizer': { title: 'Effort Optimizer', what: 'Picks the effort level each prompt needs', group: 'save' },
  handoff: { title: 'Handoff', what: 'Moves a long chat to a fresh one', group: 'save', hide: true, ask: true, tip: '/fresh to show it' },
  'cache-clock': { title: 'Cache Clock', what: 'Counts down until the cache goes cold', group: 'save', hide: true, tip: '/cacheclock to show or hide' },
  'savings-proof': { title: 'Savings Proof', what: 'Shows what each mod really saved', group: 'save', pane: true, hide: true, ask: true, tip: '/savings to open' },

  'brain-dump': { title: 'Brain-Dump Shaper', what: 'Turns long rambling prompts into clear briefs', group: 'chat' },
  reflect: { title: 'Reflect', what: 'Saves your corrections as lasting rules', group: 'chat' },
  'chat-relay': { title: 'Chat Relay', what: 'Lets a chat list, message and start other chats', group: 'chat', note: 'The orchestrator chat uses it to start test chats.' },
  'claude-pet-bridge': { title: 'Claude Pet Bridge', what: 'Lets Claude Pet send prompts into this chat', group: 'chat', note: 'Chat Relay needs it to message open chats.' },
  'prompt-editor': { title: 'Prompt Editor', what: 'Edits prompts and replies on screen only, for recordings', group: 'chat' },
  mods: { title: 'Mods', what: 'This switchboard', group: 'chat', tip: '/mods to open' },

  'context-meter': { title: 'Context Meter', what: 'Colour bar of how full the chat is', group: 'show', hide: true, tip: '/meter to show or hide' },
  'context-gauge': { title: 'Context Gauge', what: 'Shows what fills the context window', group: 'show', hide: true, tip: '/gauge to show or hide' },
  'helper-desk': { title: 'Helper Desk', what: 'Task progress bar above the prompt, plus a card per subagent', group: 'show', pane: true, hide: true, ask: true, tip: '/helpers to open' },
  'output-tray': { title: 'Output Tray', what: 'Lists files and links made here', group: 'show', pane: true, hide: true, ask: true, tip: '/tray to open' },
  'chat-inventory': { title: 'Chat Inventory', what: 'Connectors, files and skills this chat used', group: 'show', pane: true, hide: true, ask: true, tip: '/inventory to open' },
  'day-recap': { title: 'Day Recap', what: 'What got done today across all chats', group: 'show', pane: true, hide: true, ask: true, tip: '/today to open' },
  'replay-theater': {
    title: 'Replay Theater',
    what: "Steps through the last turn's file edits, one diff at a time",
    group: 'show',
    pane: true,
    hide: true,
    ask: true,
    tip: '/replay to open',
    origin: 'third',
    by: 'Anthropic',
    src: 'https://github.com/anthropics/claude-code-playground/tree/main/claude-code/mods/replay-theater',
  },
  'screen-share': { title: 'Screen-Share Mode', what: 'Hides emails, phones and amounts on screen', group: 'show', tip: '/screen-share to hide private data' },
}
const ORDER = Object.keys(KNOWN)

// A row in the pane: one mod found on disk.
type Row = {
  name: string
  title: string
  what: string
  group: Group
  tip: string
  pane: boolean
  hide: boolean
  ask: boolean
  origin: 'ours' | 'third'
  by: string
  src: string
  license: string
  note: string
  /** Its hooks source reads "<name>:hidden", so Shown/Hidden does something. */
  hideReady: boolean
  /** Its hooks source watches for ".open-<name>-<sid>", so Reopen does something. */
  openReady: boolean
  /** Its hooks source reads switches.json. */
  switchable: boolean
  /** The switchboard itself: always on. */
  self: boolean
  /** A mod in ~/.claude/dev-mods/<this chat>/. */
  chatOnly: boolean
  /** In the settings file's CLAUDE_CODE_PLUGIN_DIRS, so new chats load it. */
  registered: boolean
  /** In this chat's CLAUDE_CODE_PLUGIN_DIRS, so this chat loaded it. */
  here: boolean
}

// Today's savings from the ledger, counted as Savings Proof counts them.
type Saved = { missing: boolean; total: number; actions: number; estimated: number; byMod: Record<string, number> }

// Module variables reset on a reload; the switches themselves live in the file.
let sid = ''
let lastRaw = ''
let cache: { at: number; rows: Row[] } | null = null
let saved: { sig: string; value: Saved } | null = null

const NO_SWITCH = 'No switch yet: its code does not read switches.json. Ask Claude to add the /mods switch.'
const SELF_REASON = 'Always on: it is this switchboard.'

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

const homeOf = ($: EngineInterface) => $.plugin.root.replace(/\\/g, '/').split('/.claude/')[0] ?? ''
const switchesPath = ($: EngineInterface) => `${homeOf($)}/.claude/mods/switches.json`
const ledgerPath = ($: EngineInterface) => `${homeOf($)}/.claude/mods-logs/savings.jsonl`

function cut(s: string, n: number) {
  if (n <= 0) return ''
  return s.length <= n ? s : `${s.slice(0, Math.max(0, n - 1))}…`
}

async function log($: EngineInterface, where: string, err: unknown) {
  try {
    const dir = `${homeOf($)}/.claude/mods-logs`
    const file = `${dir}/mods.log`
    // $.fs.write makes the folders itself; only the Mac build also runs mkdir.
    if (!(await isWin($))) await $.process.run(['mkdir', '-p', dir])
    let old = ''
    try {
      old = String(await $.fs.read(file))
    } catch {
      old = ''
    }
    const when = new Date(await $.clock.now()).toISOString()
    const msg = err instanceof Error ? err.message : String(err)
    await $.fs.write(file, `${old}${when} ${where}: ${msg}\n`.slice(-50_000))
  } catch {
    // Nowhere left to report it.
  }
}

async function readRaw($: EngineInterface) {
  try {
    const path = switchesPath($)
    if (!(await $.fs.exists(path))) return ''
    return String(await $.fs.read(path))
  } catch {
    return ''
  }
}

function parse(raw: string): Record<string, unknown> {
  try {
    const json = JSON.parse(raw) as unknown
    return json && typeof json === 'object' && !Array.isArray(json) ? (json as Record<string, unknown>) : {}
  } catch {
    return {}
  }
}

async function readSwitches($: EngineInterface) {
  return parse(await readRaw($))
}

const isOff = (json: Record<string, unknown>, name: string) => json[name] === false
const isHidden = (json: Record<string, unknown>, name: string) => json[`${name}:hidden`] === true

async function save($: EngineInterface, json: Record<string, unknown>) {
  if (!(await isWin($))) await $.process.run(['mkdir', '-p', `${homeOf($)}/.claude/mods`])
  const text = `${JSON.stringify(json, null, 2)}\n`
  await $.fs.write(switchesPath($), text)
  lastRaw = text
}

// Read, change, write the whole file. Off is `false`; on deletes the key.
async function flip($: EngineInterface, name: string) {
  const json = await readSwitches($)
  const turnOff = !isOff(json, name)
  if (turnOff) json[name] = false
  else delete json[name]
  await save($, json)
  return turnOff
}

// Hidden is `"<name>:hidden": true`; shown deletes the key.
async function flipHidden($: EngineInterface, name: string) {
  const json = await readSwitches($)
  const key = `${name}:hidden`
  const hide = !isHidden(json, name)
  if (hide) json[key] = true
  else delete json[key]
  await save($, json)
  return hide
}

async function askOpen($: EngineInterface, name: string) {
  if (!sid) throw new Error('no session id')
  await $.fs.write(`${homeOf($)}/.claude/mods/.open-${name}-${sid}`, '')
}

async function readText($: EngineInterface, path: string) {
  try {
    if (!(await $.fs.exists(path))) return ''
    return String(await $.fs.read(path))
  } catch {
    return ''
  }
}

// Folders (or links to folders) directly inside dir. A missing dir is an empty list.
async function listDirs($: EngineInterface, dir: string) {
  try {
    const entries = await $.fs.list(dir)
    return entries.filter(x => !x.name.startsWith('.') && (x.kind === 'dir' || x.isLink)).map(x => `${dir}/${x.name}`)
  } catch {
    return []
  }
}

// A CLAUDE_CODE_PLUGIN_DIRS value as folders: split by ':', '~' meaning the home folder.
// Windows splits by ';' (a drive letter has a ':') and spells paths with forward slashes.
function splitDirs(raw: string, home: string) {
  return raw
    .split(win ? ';' : ':')
    .map(x => x.trim())
    .filter(Boolean)
    .map(x => (win ? slashed(x) : x))
    .map(x => (x === '~' ? home : x.startsWith('~/') ? `${home}${x.slice(1)}` : x))
    .map(x => x.replace(/\/+$/, ''))
}

// What this chat loaded.
async function envDirs($: EngineInterface) {
  try {
    return splitDirs((await $.env.get('CLAUDE_CODE_PLUGIN_DIRS')) ?? '', homeOf($))
  } catch {
    return []
  }
}

// What new chats will load: the settings file, read fresh. null when it cannot be read.
async function settingsDirs($: EngineInterface) {
  const raw = await readText($, `${homeOf($)}/.claude/settings.json`)
  if (!raw) return null
  const env = parse(raw).env
  if (!env || typeof env !== 'object') return []
  const dirs = (env as Record<string, unknown>).CLAUDE_CODE_PLUGIN_DIRS
  return typeof dirs === 'string' ? splitDirs(dirs, homeOf($)) : []
}

function titleCase(name: string) {
  return name
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const CODE = /\.(tsx?|jsx?|mjs|cjs)$/
const TEST = /\.test\.|\.spec\./

// Every hooks source file under hooks/ (subfolders too) and every file hooks.json names.
// Tests, backups and node_modules are left out.
async function hooksSource($: EngineInterface, dir: string, modules: unknown) {
  const files = new Set<string>()
  if (Array.isArray(modules)) {
    for (const m of modules) {
      if (typeof m !== 'string') continue
      const rel = m.replace(/^\.\//, '')
      files.add(rel.startsWith('/') ? rel : `${dir}/hooks/${rel}`)
    }
  }
  const walk = async (path: string, depth: number) => {
    let entries: Awaited<ReturnType<EngineInterface['fs']['list']>> = []
    try {
      entries = await $.fs.list(path)
    } catch {
      return
    }
    for (const x of entries) {
      if (x.name.startsWith('.') || x.name === 'node_modules') continue
      if (x.kind === 'dir' && depth < 3) await walk(`${path}/${x.name}`, depth + 1)
      else if (x.kind === 'file' && CODE.test(x.name) && !TEST.test(x.name) && x.size <= 2_000_000) files.add(`${path}/${x.name}`)
    }
  }
  await walk(`${dir}/hooks`, 0)
  let text = ''
  for (const f of files) text += `${await readText($, f)}\n`
  return text
}

function commandsIn(source: string) {
  const out: string[] = []
  for (const m of source.matchAll(/command\.register\(\s*\{\s*name:\s*['"`]([^'"`]+)['"`]/g)) {
    const name = m[1] ?? ''
    if (name && !out.includes(name)) out.push(name)
  }
  return out
}

function urlOf(v: unknown): string {
  const raw = typeof v === 'string' ? v : v && typeof v === 'object' ? (v as Record<string, unknown>).url : ''
  if (typeof raw !== 'string') return ''
  const url = raw.replace(/^git\+/, '').replace(/\.git$/, '')
  return /^https?:\/\//.test(url) ? url : ''
}

function authorOf(v: unknown): string {
  if (typeof v === 'string') return v.replace(/\s*[<(].*$/, '').trim()
  if (v && typeof v === 'object') {
    const name = (v as Record<string, unknown>).name
    return typeof name === 'string' ? name : ''
  }
  return ''
}

const OURS = /ben ?ai|benai|token-saving-mods/i

// Whose mod it is and where it came from: the known table first, then plugin.json, then the code's SPDX line.
function originOf(plugin: Record<string, unknown>, source: string, known: Known | undefined) {
  const link = urlOf(plugin.repository) || urlOf(plugin.homepage) || urlOf(plugin.author)
  const author = authorOf(plugin.author)
  const owner = /github\.com\/([^/]+)/.exec(link)?.[1] ?? ''
  const spdx = /SPDX-License-Identifier:\s*([\w.+-]+)/.exec(source)?.[1] ?? ''
  const license = known?.license ?? (typeof plugin.license === 'string' ? plugin.license : spdx)
  const third = (link !== '' && !OURS.test(link)) || (author !== '' && !OURS.test(author))
  return {
    origin: known?.origin ?? (third ? 'third' : 'ours'),
    by: known?.by ?? (third ? author || owner : ''),
    src: known?.src ?? link,
    license,
  } as const
}

const DRAWS_PANE = /component:\s*['"`]Pane['"`]|ui\.open\(/
const DRAWS_BAND = /component:\s*['"`](AbovePrompt|BelowPrompt|Footer|PromptFooter|SessionMode|StatusLine)['"`]/

// The group of a mod the table does not know: it logs savings, it draws, or it acts.
function groupOf(source: string): Group {
  if (source.includes('savings.jsonl')) return 'save'
  if (DRAWS_PANE.test(source) || DRAWS_BAND.test(source)) return 'show'
  return 'chat'
}

// A mod is a plugin.json plus a hooks.json with "modules". Anything else is not one.
async function inspect($: EngineInterface, dir: string, chatOnly: boolean, registered: Set<string>, here: Set<string>): Promise<Row | null> {
  const pluginRaw = await readText($, `${dir}/.claude-plugin/plugin.json`)
  if (!pluginRaw) return null
  const hooksJson = parse(await readText($, `${dir}/hooks/hooks.json`))
  if (!('modules' in hooksJson)) return null
  const plugin = parse(pluginRaw)
  const folder = dir.split('/').pop() ?? ''
  const name = typeof plugin.name === 'string' && plugin.name ? plugin.name : folder
  if (!name) return null
  const source = await hooksSource($, dir, hooksJson.modules)
  const known = KNOWN[name]
  const commands = commandsIn(source).map(c => `/${c}`)
  const self = name === 'mods'
  // A pane or a band can be hidden; the table may say so before the code can do it.
  const pane = known?.pane ?? DRAWS_PANE.test(source)
  const openReady = source.includes('.open-')
  return {
    name,
    title: known?.title ?? titleCase(name),
    what: known?.what ?? (typeof plugin.description === 'string' ? plugin.description : ''),
    group: known?.group ?? groupOf(source),
    tip: known?.tip ?? commands.join(', '),
    pane,
    hide: known?.hide ?? (pane || DRAWS_BAND.test(source)),
    ask: known?.ask ?? (pane && openReady),
    ...originOf(plugin, source, known),
    note: known?.note ?? '',
    hideReady: source.includes(':hidden'),
    openReady,
    switchable: !self && source.includes('switches.json'),
    self,
    chatOnly,
    registered: chatOnly || registered.has(dir),
    here: chatOnly || here.has(dir),
  }
}

// Every mod found, known ones first in table order, then the rest A to Z, this chat's own last.
async function scan($: EngineInterface): Promise<Row[]> {
  const home = homeOf($)
  const here = await envDirs($)
  const fromSettings = await settingsDirs($)
  const registered = new Set(fromSettings ?? here)
  const dirs: [string, boolean][] = []
  for (const d of await listDirs($, `${home}/.claude/mods`)) dirs.push([d, false])
  for (const d of [...(fromSettings ?? []), ...here]) dirs.push([d, false])
  if (sid) for (const d of await listDirs($, `${home}/.claude/dev-mods/${sid}`)) dirs.push([d, true])
  const found = new Map<string, Row>()
  const seen = new Set<string>()
  for (const [dir, chatOnly] of dirs) {
    if (seen.has(dir)) continue
    seen.add(dir)
    const row = await inspect($, dir, chatOnly, registered, new Set(here))
    if (row && !found.has(row.name)) found.set(row.name, row)
  }
  const rank = (r: Row) => (r.chatOnly ? 2 : ORDER.includes(r.name) ? 0 : 1)
  return [...found.values()].sort((a, b) => {
    const d = rank(a) - rank(b)
    if (d) return d
    if (rank(a) === 0) return ORDER.indexOf(a.name) - ORDER.indexOf(b.name)
    return a.title.localeCompare(b.title)
  })
}

function localDay(ms: number) {
  const d = new Date(ms)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

const num = (v: unknown) => (typeof v === 'number' && Number.isFinite(v) ? v : null)

/**
 * Today's savings from the ledger's text, the way Savings Proof counts them: a
 * tool_use_id counts once across the text, a later "real" line replacing an
 * "estimated" one; a line with no id counts once per exact text. Saved is before minus after.
 */
export function countSaved(text: string, day: string): Saved {
  type Line = { mod: string; saved: number; real: boolean; ms: number }
  const kept: Line[] = []
  const byId = new Map<string, number>()
  const seen = new Set<string>()
  for (const rawLine of text.split('\n')) {
    const raw = rawLine.trim()
    if (!raw) continue
    let o: Record<string, unknown>
    try {
      o = parse(raw)
    } catch {
      continue
    }
    const before = num(o.before)
    const after = num(o.after)
    const ms = Date.parse(typeof o.ts === 'string' ? o.ts : '')
    if (before === null || after === null || !Number.isFinite(ms)) continue
    const line: Line = { mod: typeof o.mod === 'string' && o.mod ? o.mod : 'unknown', saved: before - after, real: o.measured === 'real', ms }
    const id = typeof o.tool_use_id === 'string' ? o.tool_use_id : ''
    if (id) {
      const at = byId.get(id)
      if (at !== undefined) {
        if (!kept[at]?.real && line.real) kept[at] = line
        continue
      }
      byId.set(id, kept.length)
    } else {
      if (seen.has(raw)) continue
      seen.add(raw)
    }
    kept.push(line)
  }
  const out: Saved = { missing: false, total: 0, actions: 0, estimated: 0, byMod: {} }
  for (const l of kept) {
    if (localDay(l.ms) !== day) continue
    out.total += l.saved
    out.actions += 1
    if (!l.real) out.estimated += 1
    out.byMod[l.mod] = (out.byMod[l.mod] ?? 0) + l.saved
  }
  return out
}

// Read again only when the file or the day changed. A big ledger is read from its tail, as Savings Proof does.
async function readSaved($: EngineInterface): Promise<Saved> {
  const path = ledgerPath($)
  const day = localDay(await $.clock.now())
  let stat: { size: number; mtimeMs: number } | null = null
  try {
    stat = (await $.fs.exists(path)) ? await $.fs.stat(path) : null
  } catch {
    stat = null
  }
  const sig = stat ? `${stat.size}|${stat.mtimeMs}|${day}` : `missing|${day}`
  if (saved && saved.sig === sig) return saved.value
  let value: Saved = { missing: true, total: 0, actions: 0, estimated: 0, byMod: {} }
  if (stat) {
    let text = ''
    if (stat.size > LEDGER_MAX_BYTES) {
      const r = (await isWin($))
        ? await ps($, '[Console]::Out.Write(((Get-Content -LiteralPath $env:MODS_PATH -Tail ([int]$env:MODS_LINES) -Encoding UTF8) -join [char]10))', {
            MODS_PATH: path,
            MODS_LINES: String(LEDGER_TAIL_LINES),
          })
        : await $.process.run(['tail', '-n', String(LEDGER_TAIL_LINES), path])
      text = r.exitCode === 0 ? r.stdout : ''
    } else {
      text = await readText($, path)
    }
    value = countSaved(text, day)
  }
  saved = { sig, value }
  return value
}

// The scan is kept for 10 seconds, so drawing stays fast.
async function getRows($: EngineInterface, force = false) {
  const now = await $.clock.now()
  if (!force && cache && now - cache.at < SCAN_MS) return cache.rows
  const rows = await scan($)
  cache = { at: now, rows }
  return rows
}

const sigOf = (rows: readonly Row[]) =>
  rows
    .map(r => `${r.name}|${r.title}|${r.what}|${r.tip}|${r.switchable}|${r.chatOnly}|${r.registered}|${r.here}|${r.src}|${r.pane}|${r.hide}|${r.hideReady}|${r.openReady}`)
    .join('\n')

// While the pane is open, look again every 10 seconds and redraw when the list or today's saving changed.
async function scanPoll($: EngineInterface) {
  let open = false
  try {
    open = (await $.ui.panes()).some(p => p.id === PANE)
  } catch {
    open = false
  }
  if (!open) return
  const before = `${sigOf(cache?.rows ?? [])}|${saved?.sig ?? ''}`
  const rows = await getRows($, true)
  await readSaved($).catch(err => log($, 'ledger', err))
  if (`${sigOf(rows)}|${saved?.sig ?? ''}` !== before) $.ui.invalidate('ui.render')
}

// Another chat may flip a switch: redraw when the file changes.
async function poll($: EngineInterface) {
  const raw = await readRaw($)
  if (raw === lastRaw) return
  lastRaw = raw
  $.ui.invalidate('ui.render')
}

function tokens(n: number) {
  const a = Math.abs(n)
  const s = a >= 1_000_000 ? `${(a / 1_000_000).toFixed(1).replace(/\.0$/, '')}M` : a >= 1000 ? `${(a / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(Math.round(a))
  return n < 0 ? `-${s}` : s
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    try {
      sid = await $.session.id()
      await isWin($)
      await isWin($)
      cache = null
      saved = null
      await $.command.register({ name: 'mods', description: 'Open the Mods pane: turn each mod on or off, or show or hide it, in every chat', immediate: true })
      lastRaw = await readRaw($)
      $.clock.every(POLL_MS, () => {
        void poll($).catch(err => log($, 'poll', err))
      })
      $.clock.every(SCAN_MS, () => {
        void scanPoll($).catch(err => log($, 'scan', err))
      })
    } catch (err) {
      await log($, 'session start', err)
    }
    return next(e)
  })

  on('command.run', { command: 'mods' }, async $ => {
    try {
      await getRows($)
      await readSaved($)
    } catch (err) {
      await log($, 'scan on open', err)
    }
    await $.ui.open({ id: PANE, title: TITLE })
    return { text: 'Opened the Mods pane.' }
  })

  // Presses come here, not to onPress: a closure lives for one drawing only.
  on('ui.press', { plugin: 'mods', element: /^toggle-.+$/ }, async ($, e) => {
    const name = e.element.slice('toggle-'.length)
    const mod = (await getRows($)).find(m => m.name === name && m.switchable)
    if (!mod) return { element: e.element }
    try {
      const nowOff = await flip($, name)
      await $.state.set(NOTE, `${mod.title} is ${nowOff ? 'off' : 'on'} in every chat.`)
    } catch (err) {
      await log($, `toggle ${name}`, err)
      await $.state.set(NOTE, `Could not change ${mod.title}. See ~/.claude/mods-logs/mods.log`)
    }
    return { element: e.element }
  })

  on('ui.press', { plugin: 'mods', element: /^show-.+$/ }, async ($, e) => {
    const name = e.element.slice('show-'.length)
    const mod = (await getRows($)).find(m => m.name === name && m.hide && m.hideReady && m.switchable)
    if (!mod) return { element: e.element }
    try {
      if (isOff(await readSwitches($), name)) {
        await $.state.set(NOTE, `${mod.title} is off. Turn it on first.`)
        return { element: e.element }
      }
      const nowHidden = await flipHidden($, name)
      if (!nowHidden && mod.ask && mod.openReady) await askOpen($, name)
      await $.state.set(NOTE, `${mod.title} is ${nowHidden ? 'hidden' : 'shown'} in every chat.`)
    } catch (err) {
      await log($, `show ${name}`, err)
      await $.state.set(NOTE, `Could not change ${mod.title}. See ~/.claude/mods-logs/mods.log`)
    }
    return { element: e.element }
  })

  // Reopen: for a side pane that is On and Shown, asks this chat to open it again,
  // say after its X closed it.
  on('ui.press', { plugin: 'mods', element: /^open-.+$/ }, async ($, e) => {
    const name = e.element.slice('open-'.length)
    const mod = (await getRows($)).find(m => m.name === name && m.pane && m.openReady && m.switchable)
    if (!mod) return { element: e.element }
    try {
      const json = await readSwitches($)
      if (isOff(json, name) || isHidden(json, name)) {
        await $.state.set(NOTE, `${mod.title} is ${isOff(json, name) ? 'off' : 'hidden'}. Turn it on and show it first.`)
        return { element: e.element }
      }
      await askOpen($, name)
      await $.state.set(NOTE, `${mod.title} reopens in this chat within 3 seconds.`)
    } catch (err) {
      await log($, `open ${name}`, err)
      await $.state.set(NOTE, `Could not reopen ${mod.title}. See ~/.claude/mods-logs/mods.log`)
    }
    return { element: e.element }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const { Box, Text, Button, Link } = $.ui.resolve(e)
    const noop = () => undefined
    const note = (await $.state.get(NOTE)).value ?? ''
    const json = await readSwitches($)
    const cols = Math.max(30, e.props.bodyColumns)
    // A group card: a border and one column of padding on each side.
    const inner = cols - 4
    // Too narrow for the controls beside the text: they go under it.
    const stack = inner < 12 + 1 + RIGHT_COLS
    const left = stack ? inner : inner - RIGHT_COLS - 1
    const side = { alignItems: stack ? 'flex-start' : 'flex-end', width: stack ? undefined : RIGHT_COLS } as const

    let list: Row[] = []
    let failed = false
    try {
      list = await getRows($)
    } catch (err) {
      await log($, 'scan', err)
      failed = true
    }
    let today: Saved = { missing: true, total: 0, actions: 0, estimated: 0, byMod: {} }
    try {
      today = await readSaved($)
    } catch (err) {
      await log($, 'ledger', err)
    }

    const isOn = (m: Row) => m.self || !m.switchable || !isOff(json, m.name)
    const onCount = list.filter(m => m.switchable && !isOff(json, m.name)).length
    const offCount = list.filter(m => m.switchable && isOff(json, m.name)).length
    const noSwitch = list.filter(m => !m.switchable && !m.self).length
    const always = list.filter(m => m.self).length

    const row = (m: Row, first: boolean) => {
      const off = m.switchable && isOff(json, m.name)
      const hidden = isHidden(json, m.name)
      const savedToday = today.byMod[m.name] ?? 0
      const whose =
        m.origin === 'third'
          ? `Third-party${m.by ? `: ${m.by}` : ''}${m.license ? `, ${m.license}` : ''}`
          : `Ours${m.by ? `, ${m.by}` : ''}`
      const lines: { text: string; color?: string }[] = []
      if (m.self) lines.push({ text: SELF_REASON, color: WARN })
      else if (!m.switchable) lines.push({ text: NO_SWITCH, color: WARN })
      if (m.chatOnly) lines.push({ text: 'This chat only.' })
      else if (!m.registered) lines.push({ text: 'Not loaded in new chats yet. It is not in CLAUDE_CODE_PLUGIN_DIRS.' })
      else if (!m.here) lines.push({ text: 'Loads in new chats, not in this one.' })
      if (m.switchable) {
        const noHide = m.hide && !m.hideReady
        const noOpen = m.pane && !m.openReady
        if (noHide && noOpen) lines.push({ text: 'No Shown/Hidden or Reopen yet. Its code does not support them.', color: WARN })
        else if (noHide) lines.push({ text: 'No Shown/Hidden yet. Its code does not support it.', color: WARN })
        else if (noOpen) lines.push({ text: 'No Reopen yet. Its code does not support it.', color: WARN })
      }
      if (m.note) lines.push({ text: m.note })

      // Two toggles, each drawn with both its words: the one in force strong, the other dim.
      const canHide = m.hide && m.hideReady
      const canOpen = m.pane && m.openReady
      const controls = m.switchable ? (
        <Box flexDirection="column" {...side}>
          <Button key={`toggle-${m.name}`} label={`Turn ${m.title} ${off ? 'on' : 'off'}`} variant={off ? 'secondary' : 'primary'} onPress={noop}>
            <Text color={off ? undefined : GOOD} weight={off ? undefined : 'semibold'} dimColor={off}>
              On
            </Text>
            <Text dimColor>{' / '}</Text>
            <Text weight={off ? 'semibold' : undefined} dimColor={!off}>
              Off
            </Text>
          </Button>
          {canHide ? (
            off ? (
              <Box flexDirection="row">
                <Text dimColor>Shown / Hidden</Text>
              </Box>
            ) : (
              <Button key={`show-${m.name}`} label={`${hidden ? 'Show' : 'Hide'} ${m.title}`} variant="secondary" onPress={noop}>
                <Text weight={hidden ? undefined : 'semibold'} dimColor={hidden}>
                  Shown
                </Text>
                <Text dimColor>{' / '}</Text>
                <Text weight={hidden ? 'semibold' : undefined} dimColor={!hidden}>
                  Hidden
                </Text>
              </Button>
            )
          ) : null}
          {canOpen ? (
            off || hidden ? (
              <Text dimColor>Reopen</Text>
            ) : (
              <Button key={`open-${m.name}`} label={`Reopen ${m.title}`} variant="secondary" onPress={noop}>
                Reopen
              </Button>
            )
          ) : null}
        </Box>
      ) : (
        <Box flexDirection="column" {...side}>
          <Text dimColor>{m.self ? 'Always on' : 'No switch'}</Text>
        </Box>
      )

      return (
        <Box key={`row-${m.name}`} flexDirection={stack ? 'column' : 'row'} justifyContent="space-between" gap={stack ? 0 : 1} marginTop={first ? 0 : 1}>
          <Box flexDirection="column" width={left}>
            <Text weight="semibold" dimColor={off} wrap="truncate-end">
              {cut(m.title, left)}
            </Text>
            {m.what ? (
              <Text dimColor wrap="wrap">
                {m.what}
              </Text>
            ) : null}
            <Box flexDirection="row" gap={1}>
              <Text dimColor size="footnote" wrap="truncate-end">
                {cut(whose, m.src ? left - 7 : left)}
              </Text>
              {m.src ? <Link key={`src-${m.name}`} href={m.src} label="source" /> : null}
            </Box>
            {m.tip || savedToday ? (
              <Box flexDirection="row" gap={2}>
                {m.tip ? (
                  <Text dimColor italic size="footnote" wrap="truncate-end">
                    {m.tip}
                  </Text>
                ) : null}
                {savedToday ? (
                  <Text color={GOOD} size="footnote">
                    {`${tokens(savedToday)} saved today`}
                  </Text>
                ) : null}
              </Box>
            ) : null}
            {lines.map((l, i) => (
              <Text key={`info-${m.name}-${i}`} color={l.color} dimColor={!l.color} size="footnote" wrap="wrap">
                {l.text}
              </Text>
            ))}
          </Box>
          {controls}
        </Box>
      )
    }

    const groups = GROUPS.map(g => {
      const mods = list.filter(m => m.group === g.id)
      if (!mods.length) return null
      const onHere = mods.filter(m => m.switchable && isOn(m)).length
      const switchable = mods.filter(m => m.switchable).length
      const savedHere = g.id === 'save' && today.actions ? `, ${tokens(today.total)} saved today` : ''
      return (
        <Box key={`group-${g.id}`} flexDirection="column" borderStyle="round" borderDimColor marginTop={1} width={cols}>
          <Box flexDirection="row" justifyContent="space-between" backgroundColor={g.tint} paddingX={1}>
            <Text color={INK} weight="semibold">
              {g.title}
            </Text>
            <Text color={INK} size="footnote">
              {`${onHere} of ${switchable} on${savedHere}`}
            </Text>
          </Box>
          <Box flexDirection="column" paddingX={1} paddingY={1}>
            {mods.map((m, i) => row(m, i === 0))}
          </Box>
        </Box>
      )
    })

    const savedLine = today.missing
      ? 'No savings logged yet.'
      : today.actions
        ? `${tokens(today.total)} tokens saved today, in ${today.actions} ${today.actions === 1 ? 'action' : 'actions'}${today.estimated ? ' (est.)' : ''}`
        : 'No savings logged today.'

    return (
      <Box flexDirection="column" width={cols}>
        <Box flexDirection="column" paddingX={1}>
          <Text size="heading" color={today.actions && today.total > 0 ? GOOD : undefined} dimColor={!today.actions} wrap="wrap">
            {savedLine}
          </Text>
          <Text dimColor size="footnote" wrap="wrap">
            {`${list.length} mods: ${onCount} on, ${offCount} off${always ? `, ${always} always on` : ''}${noSwitch ? `, ${noSwitch} with no switch` : ''}. /savings shows each action.`}
          </Text>
          {note ? (
            <Text color={GOOD} wrap="truncate-end">
              {cut(note, cols - 2)}
            </Text>
          ) : null}
          {failed ? (
            <Text color={WARN} wrap="wrap">
              Could not read the mod folders. See ~/.claude/mods-logs/mods.log
            </Text>
          ) : null}
        </Box>
        {groups}
        <Box marginTop={1} flexDirection="column" paddingX={1}>
          <Text dimColor size="footnote" wrap="wrap">
            On / Off turns a mod on or off in every chat within 3 seconds. Shown / Hidden keeps it on, out of sight.
          </Text>
          <Text dimColor size="footnote" wrap="wrap">
            Reopen brings back a pane you closed in this chat.
          </Text>
          <Text dimColor size="footnote" wrap="wrap">
            New mods in ~/.claude/mods show up here by themselves.
          </Text>
        </Box>
      </Box>
    )
  })
}
