import type { EngineInterface, ModelUsage, Register, SessionMessage } from 'claude-code'

import type { Card, CardPart, CardTool } from '../types'

// Input Router: anything big that comes into the chat from outside is read by Haiku first, and Claude gets
// short notes and a path to the full thing. Two parts, one switch:
//   file       a whole Read of a big text file or PDF (was Read Router)
//   connector  a big connector (MCP) result (was Connector Reader)
// The real tool always runs first (a big PDF is the one exception: it is read before core, only when the
// permission check says the Read would run unasked). Anything that fails passes the normal result on.
// A side pane shows each hand-off to Haiku as it happens: what went in, what came back, what it cost.
//
// The web part (repeat WebFetch, from claude-code-templates) was removed on 2026-11-03. It is archived in
// ~/.claude/mods-archive/input-router-web-part-2026-11-03/. Everything here is Ben AI's own code.
//
// Results with images belong to Efficient Browser Use, so image files and image blocks pass on untouched.

const NAME = 'input-router'
const TITLE = 'Input Router'
type Part = CardPart
const PARTS: readonly Part[] = ['file', 'connector']

const MODEL = 'claude-haiku-5-5'
const MODEL_ALIAS = 'haiku'
// Every Haiku request stays under 100k tokens, Haiku's cheap tier. JSON and logs run about 2 characters a
// token, not 4 (Connector Reader sent 260k characters and Haiku counted 107,756 tokens), so a request is
// kept under this many characters.
const PROMPT_MAX_CHARS = 150_000

// ---------- file part ----------
// A file read (whole or a range) or a shell read whose result is over this many tokens gets notes (v0.3: was 8,000).
const MIN_TOKENS = 2000
// Guard A, the edit escape: a ranged Read of fewer lines than this always passes as exact text, so Edit works.
const EDIT_LINES = 100
// How a short exact range is described to Claude. It must also be under the token limit, so long-line files need a
// smaller limit.
const SMALL_RANGE = `under ${EDIT_LINES} lines and under about ${MIN_TOKENS.toLocaleString('en-US')} tokens; if the lines are long, use a smaller limit, for example 10`
// Guard D, the piece counter: once the raw pieces of one file Claude has pulled in pass this share of it, the next
// piece gets the file's notes instead.
const COVER_SHARE = 0.5
// A PDF read of this many pages or fewer passes through: Claude zooming in after the notes.
const ZOOM_PAGES = 5
// Read takes at most 20 PDF pages per call, so `before` counts at most that many.
const READ_PAGE_CAP = 20
// Core's default line count for a Read with an offset and no limit.
const READ_LINES = 2000
// What the helper reads per call, and in all. Longer files get their head and tail read.
const CHUNK_CHARS = 120_000
const MAX_CHARS = 960_000
// Longer lines are cut, as core's Read cuts them (transcripts often have 1,000 to 1,300 character lines).
const LINE_CHARS = 2000
// $.fs.read stops at 4 MiB; bigger files are read with head and tail.
const FS_MAX = 3_900_000
const NOTE_WORDS = 1500
const CALL_MS = 180_000
const IMAGE_EXT = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'bmp', 'tif', 'tiff', 'heic', 'heif', 'ico', 'avif'])
const PDF_TOOLS = ['/opt/homebrew/bin', '/usr/local/bin', '/usr/bin']

// ---------- connector part ----------
// Under this size a result passes on untouched (about 4k tokens).
const MIN_CHARS = 16_000
// A trimmed result this small goes to Claude as it is, with no helper call (about 2k tokens).
const TRIM_ENOUGH_CHARS = 8_000
// A trim-only reply may cut text values past this many characters, but only when the cut removes at most
// CUT_SHARE of the trimmed result. Past that the content lives in the long text, so Haiku reads it whole.
const STRING_CAP = 1_200
const CUT_SHARE = 0.2
// One helper call reads at most this much of the result; the task context and rules fit in the rest of
// PROMPT_MAX_CHARS. A result past it is split by records.
const DATA_CHUNK_CHARS = 128_000
const MAX_CHUNKS = 6
const HELPER_MAX_TOKENS = 8_000
// The person's request goes to Haiku whole up to this size, cut from the middle past it. Claude's words before
// the call, and a tool's arguments, are cut at PROMPT_CHARS.
const REQUEST_CHARS = 12_000
const PROMPT_CHARS = 2_000
// $.fs.read refuses a file over 4 MiB.
const FILE_READ_MAX = 4_000_000

// Tools whose exact output the next step depends on (page refs, the app's own tools, other mods' tools).
const SKIP_SERVER =
  /^mcp__(ccd_[a-z_]+|helper-desk|chat-relay|handoff|plugin-authoring|mods|Claude_Browser|claude-in-chrome|Control_Chrome|computer-use|playwright|Claude_Code_iOS_Simulator|terminal|visualize|scheduled-tasks|mcp-registry)__/
const SKIP_TOOL = /__(read_page|find|screenshot|show_widget|read_widget_context|render-ui|read_me|create_view|guide)$/i

// Fields almost no task reads: pictures, styling, and html or rich-text copies of a plain field.
const DROP_KEY =
  /^(avatar|avatar_url|.+_avatar_url|avatar_.+|image_url|.+_image_url|thumbnail|thumbnail_url|.+_thumbnail_url|icon|icon_url|.+_icon_url|cover_image(_url)?|banner(_url)?|logo_url|html|.+_html|html_.+|rich_text|rich_text_.+|.+_rich_text|tiptap_.+|.+_tiptap_.+|body_for_editor|__typename|etag|_links|_meta|color|.+_color|emoji|display_format|display_locations|placeholder)$/i

// Paging and count fields. Code copies them into the reply word for word, so nobody has to work out
// "page X of Y" (Haiku once wrote "Page 1 of 5" for page_count: 5, the number of records on the page).
const PAGING_KEY =
  /^(page|page_number|current_page|per_page|page_size|page_count|pages|total_pages|count|total|total_count|has_more|has_next|has_next_page|next_page|next_page_token|next_cursor|cursor|offset|limit)$/i
const PAGING_HOLDER = /^(meta|pagination|paging|page_info|pageInfo)$/

// The note core gives in place of a result over its MCP token cap, and the one for any result over 100k characters.
// A Windows path starts with a drive letter (C:\ or C:/).
const CORE_NOTE = /Output has been saved to ((?:\/|[A-Za-z]:[\\/])[^\n]+?)\.?\s*(?:\n|$)/
const PERSISTED_NOTE = /Full output saved to: ((?:\/|[A-Za-z]:[\\/])\S+)/
const OVER_CAP = 'exceeds maximum allowed tokens'
// A note is short. A result longer than this is data, even when it quotes a note.
const NOTE_MAX = 12_000

// ---------- pane ----------
const PANE = 'haiku'
const PANE_TITLE = 'Haiku hand-offs'
const CARDS = { plugin: 'input-router', key: 'cards' } as const
const OPEN = { plugin: 'input-router', key: 'open' } as const
const OFF = { plugin: 'input-router', key: 'off' } as const
const CARDS_MAX = 30
const CARDS_ALL = 150
// Notes kept per card, and drawn when one is open (one drawing draws at most 100,000 characters).
const CARD_NOTES_MAX = 40_000
const DRAW_NOTES_MAX = 20_000
// The Haiku colour: a mid teal that reads on white and on a dark pane.
const HAIKU = '#139c8a'
const HAIKU_DARK = '#0b5a4f'
const GOOD = '#22a55b'
const BAD = '#e5484d'
// A ranged Read of a file with notes this many lines or more gets a one-line reminder; exact reads stay quiet.
const REMIND_LINES = 150
// A big input left alone gets a "pass" line in the log, with the reason, from this size up.
const PASS_LOG_TOKENS = MIN_TOKENS / 2
// Bash: output over this many characters (about MIN_TOKENS tokens), or output core saved to a file, gets notes.
const BASH_MIN_CHARS = MIN_TOKENS * 4
// Bash commands whose output is file or API content. Every program in the command must be a reader or a
// helper, and at least one a reader; anything else (git, npm, test runners, builds, find, ls, diff) passes.
const READERS = new Set(['cat', 'head', 'tail', 'sed', 'awk', 'gawk', 'less', 'more', 'nl', 'tac', 'jq', 'yq', 'curl', 'wget', 'grep', 'egrep', 'fgrep', 'rg', 'ag', 'zcat', 'gzcat', 'bzcat', 'xzcat', 'strings', 'pdftotext', 'textutil', 'xmllint', 'bat'])
const HELPERS = new Set(['cd', 'sort', 'uniq', 'cut', 'tr', 'column', 'fold', 'expand', 'iconv', 'wc', 'echo', 'printf', 'true', 'false', 'ls', 'find', 'du', 'stat', 'file', 'realpath', 'readlink', 'basename', 'dirname', 'pwd', 'date', 'sleep', 'seq', 'test', '[', 'set', 'unset', 'which', 'type', '.', 'source', 'mkdir', 'cp', 'mv', 'rm', 'touch', 'ln', 'chmod', 'read'])
// Words in front of the real program: sudo, xargs, shell keywords. Their flags are skipped too.
const STARTERS = new Set(['sudo', 'time', 'env', 'command', 'nice', 'exec', 'xargs', 'export', 'do', 'then', 'else', 'elif', 'if', 'while', 'until', '!', '{', '('])
// Steps that are only shell structure: a loop head, a closing word, a comment.
const STRUCTURE = new Set(['for', 'case', 'done', 'fi', 'esac', '}', ')', ';;'])
// Flags of a starter that take a value: sudo -u root, xargs -I {}, xargs -n 1, nice -n 10, env -u NAME.
const FLAG_VALUE = new Set(['-u', '-n', '-I', '-P', '-L', '-d', '-s'])

// ---------- shared state ----------

type Call = { in: number; out: number }
type Helper = { model: string; in: number; out: number; calls: Call[] }
type Done = { part: Part; label: string; before: number; after: number; how: string; at: string }

let home = ''
let off = false
let polling = false
// The chat id of the newest session.start: the 3-second poll checks that chat's /mods Open file, so after
// /clear or a resume it looks for the new chat's file, as Helper Desk does.
let currentSid = ''
// The chat's folder, for paths a shell command names from it.
let cwd = ''
// "input-router:file": false in switches.json turns one part off in every chat.
const globalOff = new Set<Part>()
// /input-router off <part> and /input-router full hold for one chat, keyed by session id.
const chatOff = new Map<string, Set<Part>>()
const fullNext = new Set<string>()
const done = new Map<string, Done[]>()
const RECENT_MAX = 8
// "input-router:hidden": true in switches.json keeps the pane shut in every chat; Hide shuts it in one chat.
let globalHidden = false
const hiddenIn = new Set<string>()

// The /mods switchboard turns this mod off in every chat with switches.json. Missing means on.
async function readSwitch($: EngineInterface) {
  try {
    const path = `${home || ($.plugin.root.replace(/\\/g, '/').split('/.claude/')[0] ?? '')}/.claude/mods/switches.json`
    const json = (await $.fs.exists(path)) ? (JSON.parse(String(await $.fs.read(path))) as Record<string, unknown>) : {}
    const wasShown = !off && !globalHidden
    const wasOff = off
    off = json[NAME] === false
    globalHidden = json[`${NAME}:hidden`] === true
    for (const p of PARTS) {
      if (json[`${NAME}:${p}`] === false) globalOff.add(p)
      else globalOff.delete(p)
    }
    // The /mods switch turns the pane off with the mod.
    if (wasShown && (off || globalHidden)) void $.ui.close({ id: PANE }).catch(() => undefined)
    if (off !== wasOff) void $.state.set(OFF, off).catch(() => undefined)
  } catch {
    // Keep the last value.
  }
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
// Windows paths as the Mac code compares them: forward slashes, drive letter upper case,
// and Git Bash's /c/... spelled C:/...
const slashed = (p: string) =>
  p
    .replace(/\\/g, '/')
    .replace(/^\/([a-zA-Z])\//, (_, d: string) => `${d.toUpperCase()}:/`)
    .replace(/^([a-z]):\//, (_, d: string) => `${d.toUpperCase()}:/`)
// Appends text to a file, making its folder; waits while another writer holds the file.
const PS_APPEND = `$p=$env:MODS_PATH; $d=[IO.Path]::GetDirectoryName($p); if ($d) { [void][IO.Directory]::CreateDirectory($d) }
$t=[Text.Encoding]::UTF8.GetString([Convert]::FromBase64String([Console]::In.ReadToEnd().Trim()))
for ($i=0; ; $i++) { try { [IO.File]::AppendAllText($p, $t, [Text.UTF8Encoding]::new($false)); break } catch { if ($i -ge 40) { throw }; Start-Sleep -Milliseconds 50 } }`
// head -c, tail -c and wc -l for a file too big for $.fs.read.
const PS_OPEN_FILE = `$f=[IO.File]::Open($env:MODS_PATH,'Open','Read','ReadWrite'); try {`
const PS_READ_REST = `$b=New-Object byte[] ($n); $r=0; while ($r -lt $n) { $k=$f.Read($b,$r,$n-$r); if ($k -le 0) { break }; $r+=$k }; [Console]::Out.Write([Text.Encoding]::UTF8.GetString($b,0,$r)) } finally { $f.Close() }`
const PS_HEAD = `${PS_OPEN_FILE} $n=[Math]::Min([long]$env:MODS_BYTES,$f.Length); ${PS_READ_REST}`
const PS_TAIL = `${PS_OPEN_FILE} $n=[Math]::Min([long]$env:MODS_BYTES,$f.Length); [void]$f.Seek(-$n,'End'); ${PS_READ_REST}`
const PS_LINES = `[Console]::Out.Write([string][Linq.Enumerable]::Count([IO.File]::ReadLines($env:MODS_PATH)))`

// The /mods switchboard's Open button writes ~/.claude/mods/.open-input-router-<session id>: open the pane in
// that chat (even after Hide or the X), then remove the file. The open is the mod's own, so a narrow window
// may hold it undrawn; the toast then names the command, which always places it.
async function checkOpen($: EngineInterface) {
  const sid = currentSid || (await sessionId($))
  if (!sid || !home) return
  const path = `${home}/.claude/mods/.open-${NAME}-${sid}`
  if (!(await $.fs.exists(path).catch(() => false))) return
  if (await isWin($)) await ps($, 'Remove-Item -LiteralPath $env:MODS_PATH -Force -ErrorAction SilentlyContinue', { MODS_PATH: path })
  else await $.process.run(['rm', '-f', path])
  hiddenIn.delete(sid)
  if (off || globalHidden) return
  const opened = await showPane($, '/mods Open')
  if (!opened.isPlaced) {
    void Promise.resolve()
      .then(() => $.ui.toast(`${PANE_TITLE} is waiting for a wider window. Type /input-router pane to show it now.`))
      .catch(() => undefined)
  }
}

async function sessionId($: EngineInterface) {
  return String(await $.session.id().catch(() => ''))
}

async function partOn($: EngineInterface, part: Part) {
  if (off || globalOff.has(part)) return false
  if (chatOff.size === 0) return true
  return !chatOff.get(await sessionId($))?.has(part)
}

// /input-router full: true once, for the next input a part would have acted on.
async function takeFull($: EngineInterface) {
  if (fullNext.size === 0) return false
  return fullNext.delete(await sessionId($))
}

// Why the shell append failed, once, for the plain log.
let fellBack = ''

// A true append (O_APPEND), so lines from the other mods that share the ledger are never lost. If the host
// will not run it, read and write back, and never write over a file that could not be read.
async function append($: EngineInterface, path: string, line: string) {
  try {
    // Once the shell append has failed, do not wait on it again.
    if (fellBack) throw new Error(fellBack)
    // Windows has no /bin/sh: PowerShell appends, the text sent as base64.
    const ran = (await isWin($))
      ? await ps($, PS_APPEND, { MODS_PATH: path }, { stdin: b64(`${line}\n`), timeoutMs: 10_000 })
      : await $.process.run(['/bin/sh', '-c', 'mkdir -p "$(dirname "$1")" && cat >> "$1"', 'sh', path], {
          stdin: `${line}\n`,
          timeoutMs: 5000,
        })
    if (ran.exitCode === 0) return
    throw new Error(`exit ${ran.exitCode}: ${ran.stderr.slice(0, 200)}`)
  } catch (err) {
    const first = !fellBack
    if (first) fellBack = `shell append failed, using read and write: ${err instanceof Error ? err.message : String(err)}`
    const old = (await $.fs.exists(path)) ? String(await $.fs.read(path)) : ''
    await $.fs.write(path, `${old}${line}\n`)
    if (first) await log($, 'mod', fellBack)
  }
}

async function log($: EngineInterface, part: Part | 'mod', what: string, detail: unknown = '') {
  try {
    const msg = detail instanceof Error ? detail.message : String(detail)
    const ts = new Date(await $.clock.now()).toISOString()
    await append($, `${home}/.claude/mods-logs/${NAME}.log`, `${ts} ${part} ${what}${msg ? `: ${msg.replace(/\s+/g, ' ').slice(0, 400)}` : ''}`)
  } catch {
    // Nowhere left to report it.
  }
}

function tokens(text: string) {
  return Math.ceil(text.length / 4)
}

function fmt(n: number) {
  return n.toLocaleString('en-US')
}

function baseName(path: string) {
  return path.split(win ? /[\\/]/ : '/').pop() ?? path
}

function extOf(path: string) {
  const base = baseName(path)
  const dot = base.lastIndexOf('.')
  return dot > 0 ? base.slice(dot + 1).toLowerCase() : ''
}

function slug(path: string) {
  return baseName(path).replace(/[^\w.-]+/g, '_')
}

function safe(name: string) {
  return name.replace(/[^A-Za-z0-9_-]+/g, '-').slice(0, 60)
}

function hash(text: string) {
  let h = 5381
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) >>> 0
  return h.toString(36)
}

function stamp(ms: number) {
  return new Date(ms).toISOString().slice(0, 19).replace('T', '-').replace(/:/g, '')
}

// Helper text reaches the transcript: no em or en dashes.
function clean(text: string) {
  return text.replace(/\s*[—–]\s*/g, ' - ').trim()
}

type Asked = Awaited<ReturnType<EngineInterface['model']['complete']>>

// One Haiku request. The full id first; if it is refused (an allowlist, or no effort on this model), the
// alias resolves to the session's Haiku.
async function ask($: EngineInterface, system: string, prompt: string, maxTokens: number, signal: AbortSignal | undefined) {
  const request = { prompt, system, maxTokens, timeoutMs: CALL_MS }
  const opts = signal ? { signal } : undefined
  try {
    const r = await $.model.complete({ model: MODEL, effort: 'low', ...request }, opts)
    if (r.isAnswered || r.reason !== 'api-error') return { model: MODEL, r }
  } catch {
    // The alias is the second try.
  }
  return { model: MODEL_ALIAS, r: (await $.model.complete({ model: MODEL_ALIAS, ...request }, opts)) as Asked }
}

function usageOf(r: Asked): Call {
  const u = ((r as { usage?: ModelUsage }).usage ?? {}) as Partial<ModelUsage>
  return {
    in: (u.input_tokens ?? 0) + (u.cache_read_input_tokens ?? 0) + (u.cache_creation_input_tokens ?? 0),
    out: u.output_tokens ?? 0,
  }
}

function helperOf(model: string, calls: Call[]): Helper {
  return { model, in: calls.reduce((s, c) => s + c.in, 0), out: calls.reduce((s, c) => s + c.out, 0), calls }
}

// One ledger line per action, in the shape every token-saving mod writes, plus the part.
async function ledger(
  $: EngineInterface,
  part: Part,
  row: { tool_use_id?: string | null; tool?: CardTool; action: string; before: number; after: number; helper: Helper | null; detail: string | null },
) {
  try {
    const line = {
      ts: new Date(await $.clock.now()).toISOString(),
      session: (await sessionId($)) || null,
      tool_use_id: row.tool_use_id || null,
      mod: NAME,
      part,
      tool: row.tool ?? (part === 'file' ? 'Read' : 'connector'),
      action: row.action,
      before: row.before,
      after: row.after,
      helper: row.helper,
      measured: 'estimated',
      detail: row.detail,
    }
    await append($, `${home}/.claude/mods-logs/savings.jsonl`, JSON.stringify(line))
  } catch (err) {
    await log($, part, 'ledger', err)
  }
}

// What /input-router lists, and a toast.
async function remember($: EngineInterface, d: Omit<Done, 'at'>) {
  const sid = await sessionId($)
  const list = done.get(sid) ?? []
  list.push({ ...d, at: new Date(await $.clock.now()).toISOString().slice(11, 16) })
  if (list.length > 50) list.shift()
  done.set(sid, list)
  void Promise.resolve()
    .then(() => $.ui.toast(`${TITLE} (${d.part}): ${d.label} ${fmt(d.before)} to ${fmt(d.after)} tokens`))
    .catch(() => undefined)
}

async function status($: EngineInterface, text: string | undefined) {
  try {
    await $.ui.status(text)
  } catch {
    // The status line is a nicety.
  }
}

// ---------- the pane's cards ----------
// None of these throw: a pane error after a tool has run must never send the call down again (the .catch would).

let cards: Card[] = []
let cardN = 0

// Haiku 5.5 list prices per token, the same table Savings Proof uses (claude-api skill, model-migration.md,
// read 2026-11-02). Each request is priced on its own tier. No usage means no price, not a guess.
function haikuUsd(calls: readonly Call[]): number | null {
  if (calls.length === 0 || calls.every(c => c.in === 0 && c.out === 0)) return null
  return calls.reduce((s, c) => s + (c.in <= 100_000 ? c.in * 0.1e-6 + c.out * 0.5e-6 : c.in * 0.5e-6 + c.out * 2.5e-6), 0)
}

async function drawCards($: EngineInterface) {
  try {
    await $.state.set(CARDS, cards.map(c => ({ ...c })))
  } catch (err) {
    await log($, 'mod', 'pane state', err)
  }
}

// The newest CARDS_MAX cards of each chat, and CARDS_ALL in all, so a busy chat never pushes another chat's cards out.
function trimCards(all: Card[]) {
  const seen = new Map<string, number>()
  const out: Card[] = []
  for (let i = all.length - 1; i >= 0 && out.length < CARDS_ALL; i--) {
    const c = all[i]!
    const n = (seen.get(c.session) ?? 0) + 1
    seen.set(c.session, n)
    if (n <= CARDS_MAX) out.push(c)
  }
  return out.reverse()
}

// After a reload the module starts empty; the cards drawn before it are still in state.
async function loadCards($: EngineInterface) {
  if (cards.length > 0) return
  try {
    const { value = [] } = await $.state.get(CARDS)
    cards = trimCards(value.map(c => ({ ...c, ...(c.phase === 'working' && { phase: 'failed' as const, state: 'Stopped by a reload' }) })))
    cardN = cards.reduce((m, c) => Math.max(m, Number(c.id.slice(1)) || 0), cardN)
  } catch (err) {
    await log($, 'mod', 'cards not loaded', err)
  }
}

// Opens the pane with every card of this chat. A person's command or press places it at any width; an open
// the mod makes on its own (a hand-off, the /mods Open button) waits undrawn on a narrow window.
async function showPane($: EngineInterface, why: string) {
  await loadCards($)
  await drawCards($)
  const opened = await $.ui.open({ id: PANE, title: PANE_TITLE })
  if (!opened.isPlaced) await log($, 'mod', 'pane not placed', `${why}: ${opened.reason}`)
  return opened
}

// A new card. Hand-offs to Haiku open the pane (unless it is hidden); kept notes only add a card.
async function newCard($: EngineInterface, c: Omit<Card, 'id' | 'session' | 'startedAt' | 'endedAt' | 'answered' | 'usd' | 'notes' | 'detail' | 'full' | 'after'> & Partial<Card>) {
  const now = await $.clock.now().catch(() => 0)
  const session = await sessionId($)
  const card: Card = { id: `c${++cardN}`, session, startedAt: now, endedAt: 0, answered: 0, usd: null, notes: '', detail: null, full: null, after: null, ...c }
  cards.push(card)
  cards = trimCards(cards)
  await drawCards($)
  if (card.phase === 'working' && !off && !globalHidden && !hiddenIn.has(session)) {
    void $.ui.open({ id: PANE, title: PANE_TITLE }).catch(err => log($, 'mod', 'pane open', err))
  }
  return card
}

async function setCard($: EngineInterface, card: Card | null | undefined, patch: Partial<Card>) {
  if (!card) return
  try {
    Object.assign(card, patch)
    if (patch.phase && patch.phase !== 'working' && !card.endedAt) card.endedAt = await $.clock.now()
    if (patch.notes !== undefined && card.notes.length > CARD_NOTES_MAX) card.notes = `${card.notes.slice(0, CARD_NOTES_MAX)}\n[cut here: the rest is in the detail file]`
  } catch {
    // Keep what is set.
  }
  await drawCards($)
}

// Live line while the requests run side by side.
const reading = (answered: number, of: number) => (of > 1 ? `Haiku is reading ${of} parts: ${answered} of ${of} done` : 'Haiku is reading')

// ============================================================================
// File part (was Read Router)
// ============================================================================

const FILE_SYSTEM = [
  'You write reading notes for another AI model. It will not see the file, only your notes.',
  'Be exact and short. Cite every place with the line numbers given at the start of each line.',
  'Plain text or simple markdown bullets. No preamble, no closing remarks, no em dashes.',
].join(' ')

// The notes body is kept; the header and footer around it are written when they are served, so they can say
// whether Haiku wrote them for this task or earlier.
type Notes = {
  body: string
  about: string
  // Said at the end: what the notes cover and when to read exact lines.
  covers: string
  exact: string
  before: number
  helper: Helper | null
  detail: string | null
  label: string
  // The pane's "open full result": the file, or the text pulled out of a PDF.
  full: string
  // 'output': notes on a shell command's output, not on a file.
  noun?: 'output'
}
type How = 'fresh' | 'kept' | 'disk'
type Line = { n: number; text: string; page?: number }
type Chunk = { lines: Line[] }
type Source = {
  path: string
  kind: 'text' | 'pdf'
  // Said at the top of the notes: what the helper read. At the end: what the notes cover, how to reach exact text.
  about: string
  covers: string
  exact: string
  full: string
  chunks: Chunk[]
  // A shell command's output: what the prompt calls it, and what the pane card shows.
  title?: string
  label?: string
  where?: string
  tool?: CardTool
  noun?: 'output'
}

// Guard B: files Claude must see word for word. Skills, CLAUDE.md, AGENTS.md, memory files, settings and switches.
function isInstruction(path: string) {
  const base = baseName(path)
  if (win) path = slashed(path)
  return (
    base === 'SKILL.md' ||
    base === 'CLAUDE.md' ||
    base === 'AGENTS.md' ||
    base === 'switches.json' ||
    /^settings(\.local)?\.json$/.test(base) ||
    path.includes('/skills/') ||
    /\/\.claude\/projects\/[^/]+\/memory\//.test(path)
  )
}

// What a read is for: the person's real request (in a subagent, its own prompt) and Claude's words just before
// the call. The request picks the notes: the same file for another request gets new notes.
type Task = { user: string; assistant: string }
const taskTag = (task: Task) => (task.user ? `|t${hash(task.user).slice(0, 6)}` : '')
const notesKey = (path: string, st: { mtimeMs: number; size: number }, task: Task, extra = '') => `${path}|${st.mtimeMs}|${st.size}${extra}${taskTag(task)}`

// Guard D: the raw lines of each file that reached Claude, per chat and agent, for the file as it is now.
// Pieces answered with notes never reached Claude as text, so they do not count.
const pulled = new Map<string, Set<number>>()
const pulledKey = (session: string, agentId: string | undefined, path: string, st: { mtimeMs: number; size: number }) =>
  `${session}\n${agentId ?? ''}\n${path}\n${st.mtimeMs}|${st.size}`
// The share of the file pulled in, counting these lines too. Each line counts once however often it is read.
function shareWith(key: string, lines: readonly number[], total: number) {
  if (total <= 0) return 0
  const had = pulled.get(key)
  let n = had?.size ?? 0
  for (const l of lines) if (l >= 1 && l <= total && !had?.has(l)) n += 1
  return Math.min(1, n / total)
}
function addPulled(key: string, lines: readonly number[]) {
  const set = pulled.get(key) ?? new Set<number>()
  for (const l of lines) set.add(l)
  pulled.set(key, set)
}
const lineRange = (from: number, count: number) => Array.from({ length: Math.max(0, count) }, (_, i) => from + i)
const pct = (share: number) => `${Math.round(share * 100)}%`

// Paths this mod answered with notes, and the notes kept per path, mtime and size.
const routed = new Set<string>()
// Ranges (path, offset, limit) this mod answered with notes, so core's "unchanged" for the same range maps to them.
const routedRanges = new Set<string>()
const rangeKey = (e: { file_path: string; offset?: number; limit?: number }) => `${e.file_path}|${e.offset ?? ''}|${e.limit ?? ''}`
const cache = new Map<string, Notes>()
// Which loop got notes for which path, and from which Read call: session, agent and path.
const noted = new Map<string, string>()
const notedKey = (session: string, agentId: string | undefined, path: string) => `${session}\n${agentId ?? ''}\n${path}`

function cut(text: string) {
  return text.length > LINE_CHARS ? `${text.slice(0, LINE_CHARS)} [line cut]` : text
}

const size = (l: Line) => l.text.length + 10

// Keeps line boundaries; one chunk is at most CHUNK_CHARS of numbered text.
function chunk(lines: Line[]): Chunk[] {
  const out: Chunk[] = []
  let cur: Line[] = []
  let n = 0
  for (const line of lines) {
    if (cur.length > 0 && n + size(line) > CHUNK_CHARS) {
      out.push({ lines: cur })
      cur = []
      n = 0
    }
    cur.push(line)
    n += size(line)
  }
  if (cur.length > 0) out.push({ lines: cur })
  return out
}

// Over MAX_CHARS the helper reads the head and the tail; the gap is said in the notes.
function fit(lines: Line[]): { kept: Line[]; gap: string } {
  if (lines.reduce((s, l) => s + size(l), 0) <= MAX_CHARS) return { kept: lines, gap: '' }
  const half = MAX_CHARS / 2
  let h = 0
  let n = 0
  while (h < lines.length && n + size(lines[h]!) <= half) n += size(lines[h++]!)
  let t = lines.length
  n = 0
  while (t > h && n + size(lines[t - 1]!) <= half) n += size(lines[--t]!)
  const from = lines[h]?.n ?? 0
  const to = lines[t - 1]?.n ?? 0
  return { kept: [...lines.slice(0, h), ...lines.slice(t)], gap: `The helper skipped lines ${fmt(from)}-${fmt(to)} (too big to read whole).` }
}

function toLines(text: string, from: number): Line[] {
  const raw = text.split('\n')
  if (raw.length > 0 && raw[raw.length - 1] === '') raw.pop()
  return raw.map((t, i) => ({ n: from + i, text: cut(t) }))
}

// null: binary content, let core answer.
async function textSource($: EngineInterface, path: string, bytes: number): Promise<Source | null> {
  let lines: Line[]
  let gap = ''
  let total: number
  if (bytes <= FS_MAX) {
    const text = String(await $.fs.read(path))
    if (text.includes('\u0000')) return null
    const all = toLines(text, 1)
    total = all.length
    const fitted = fit(all)
    lines = fitted.kept
    gap = fitted.gap
  } else {
    const half = String(MAX_CHARS / 2)
    const [head, tail, wc] = (await isWin($))
      ? await Promise.all([
          ps($, PS_HEAD, { MODS_PATH: path, MODS_BYTES: half }, { timeoutMs: 30_000 }),
          ps($, PS_TAIL, { MODS_PATH: path, MODS_BYTES: half }, { timeoutMs: 30_000 }),
          ps($, PS_LINES, { MODS_PATH: path }, { timeoutMs: 60_000 }),
        ])
      : await Promise.all([
          $.process.run(['/usr/bin/head', '-c', half, path], { timeoutMs: 30_000 }),
          $.process.run(['/usr/bin/tail', '-c', half, path], { timeoutMs: 30_000 }),
          $.process.run(['/usr/bin/wc', '-l', path], { timeoutMs: 30_000 }),
        ])
    if (head.stdout.includes('\u0000')) return null
    total = Number.parseInt(wc.stdout.trim(), 10) || 0
    // The byte cuts land mid-line: drop the head's last line and the tail's first.
    const headLines = toLines(head.stdout, 1).slice(0, -1)
    const tailRaw = toLines(tail.stdout, 1).slice(1)
    const tailFrom = Math.max(headLines.length + 1, total - tailRaw.length + 1)
    lines = [...headLines, ...tailRaw.map((l, i) => ({ n: tailFrom + i, text: l.text }))]
    gap = `The helper skipped lines ${fmt(headLines.length + 1)}-${fmt(tailFrom - 1)} (the file is ${fmt(Math.round(bytes / 1_000_000))} MB).`
  }
  return {
    path,
    kind: 'text',
    about: gap
      ? `Text file, ${fmt(total)} lines. ${gap} Refs like L120-L140 are line numbers in the real file.`
      : `Text file, ${fmt(total)} lines. Haiku read all ${fmt(total)} lines. Refs like L120-L140 are line numbers in the real file.`,
    covers: gap ? 'These notes cover every line Haiku read' : 'These notes cover the whole file',
    exact: `Read exact lines of ${path} (offset and limit, for example offset 120, limit 40) only when you must quote exact text, or right before you Edit or Write this file${gap ? ', or for the lines Haiku skipped' : ''}. A range ${SMALL_RANGE}, passes through as exact text.`,
    full: path,
    chunks: chunk(lines),
  }
}

async function bin($: EngineInterface, name: string) {
  // Windows: poppler's pdfinfo.exe and pdftotext.exe, wherever PATH has them.
  if (await isWin($)) {
    const r = await $.process.run(['where.exe', `${name}.exe`], { timeoutMs: 10_000 }).catch(() => null)
    return (r?.exitCode === 0 ? r.stdout.split(/\r?\n/).map(s => s.trim()).find(Boolean) : undefined) ?? null
  }
  for (const dir of PDF_TOOLS) {
    if (await $.fs.exists(`${dir}/${name}`).catch(() => false)) return `${dir}/${name}`
  }
  return null
}

function parsePages(arg: string | undefined, total: number): { first: number; last: number } | null {
  if (arg === undefined || arg.trim() === '') return { first: 1, last: total }
  const m = /^\s*(\d+)\s*(?:-\s*(\d+)?)?\s*$/.exec(arg)
  if (!m) return null
  const first = Math.max(1, Number(m[1]))
  const last = Math.min(total, m[2] !== undefined ? Number(m[2]) : arg.includes('-') ? total : first)
  return first <= last ? { first, last } : null
}

// null: let the Read through to core (a zoom-in, no text layer, no pdftotext, a bad pages value).
async function pdfSource($: EngineInterface, path: string, pagesArg: string | undefined, mtime: number) {
  const info = await bin($, 'pdfinfo')
  const totext = await bin($, 'pdftotext')
  if (!info || !totext) {
    await log($, 'file', 'pass', `no pdftotext or pdfinfo for ${path}`)
    return null
  }
  const meta = await $.process.run([info, path], { timeoutMs: 30_000 })
  const total = Number(/^Pages:\s+(\d+)/m.exec(meta.stdout)?.[1] ?? 0)
  if (meta.exitCode !== 0 || total === 0) {
    await log($, 'file', 'pass', `pdfinfo gave no page count for ${path} (exit ${meta.exitCode}): ${meta.stderr.slice(0, 200)}`)
    return null
  }
  const range = parsePages(pagesArg, total)
  if (!range) {
    await log($, 'file', 'pass', `pages "${pagesArg}" not understood for ${path} (${total} pages)`)
    return null
  }
  const count = range.last - range.first + 1
  if (count <= ZOOM_PAGES) return null
  const ran = await $.process.run([totext, '-f', String(range.first), '-l', String(range.last), '-enc', 'UTF-8', path, '-'], {
    timeoutMs: 120_000,
  })
  if (ran.exitCode !== 0) {
    await log($, 'file', 'pass', `pdftotext failed for ${path}: ${ran.stderr.slice(0, 200)}`)
    return null
  }
  const pages = ran.stdout.split('\f')
  if (pages.length > 0 && pages[pages.length - 1]!.trim() === '') pages.pop()
  const chars = pages.reduce((s, p) => s + p.trim().length, 0)
  // A scanned PDF has no text layer: core's page images are the only way in.
  if (chars < 100 * count) {
    await log($, 'file', 'pass', `little text in ${path} (${chars} chars, ${count} pages)`)
    return null
  }
  const out: Line[] = []
  let n = 1
  let before = 0
  pages.forEach((page, i) => {
    const no = range.first + i
    if (i < READ_PAGE_CAP) before += tokens(page)
    out.push({ n: n++, text: `=== Page ${no} ===`, page: no })
    let blank = 0
    for (const raw of page.split('\n')) {
      const text = raw.replace(/[ \t]+/g, ' ').trimEnd()
      blank = text === '' ? blank + 1 : 0
      if (blank > 1) continue
      out.push({ n: n++, text: cut(text), page: no })
    }
  })
  const sidecar = `${home}/.claude/mods-logs/${NAME}/text/${slug(path)}-p${range.first}-${range.last}-${hash(`${path}|${mtime}`)}.txt`
  const wrote = await $.fs
    .write(sidecar, `${out.map(l => l.text).join('\n')}\n`)
    .then(() => true)
    .catch(() => false)
  const fitted = fit(out)
  const where = wrote ? ` The text was pulled with pdftotext into ${sidecar} (${fmt(out.length)} lines).` : ''
  const src: Source = {
    path,
    kind: 'pdf',
    about: `PDF, pages ${range.first}-${range.last} of ${total}.${where}${fitted.gap ? ` ${fitted.gap}` : ''} Refs: p.12 is the PDF page${wrote ? ', L340 is the line in that text file' : ''}.`,
    covers: fitted.gap ? 'These notes cover every line Haiku read' : `These notes cover pages ${range.first}-${range.last}`,
    exact: wrote
      ? `Read exact text only when you must quote it: Read ${sidecar} with offset and limit, or Read ${path} with pages (${ZOOM_PAGES} pages or fewer pass through untouched).`
      : `Read exact text only when you must quote it: Read ${path} with pages (${ZOOM_PAGES} pages or fewer pass through untouched).`,
    full: wrote ? sidecar : path,
    chunks: chunk(fitted.kept),
  }
  // Over 20 pages a plain Read errors and gives no text, so `before` is a model: one 20-page Read.
  const label =
    count > READ_PAGE_CAP
      ? `${baseName(path)} (plain Read errors on ${count} pages; before = one ${READ_PAGE_CAP}-page Read)`
      : `${baseName(path)} (${count}-page PDF, before = its text)`
  return { src, before, label }
}

function promptFor(src: Source, part: Chunk, i: number, of: number, words: number, task: Task) {
  const first = part.lines[0]!
  const last = part.lines[part.lines.length - 1]!
  const where = src.kind === 'pdf' ? `pages ${first.page}-${last.page}, lines L${first.n}-L${last.n}` : `lines L${first.n}-L${last.n}`
  const cite =
    src.kind === 'pdf'
      ? 'Cite places as p.<page> L<start>-L<end>. "=== Page N ===" lines mark where each page starts.'
      : 'Cite places as L<start>-L<end>.'
  const what =
    src.kind === 'pdf' || /\.(md|mdx|txt|rst|html?|docx?|rtf|vtt|srt)\b/i.test(src.title ? (src.where ?? '') : src.path)
      ? 'Cover: the headings and sections with where each starts, key facts, numbers, names, dates, definitions and conclusions.'
      : 'Cover: the structure (sections, functions, classes, tables, config blocks) with where each starts, key values and names. For logs: first and last timestamps, each distinct error or warning with a count and where it first and last shows, and anything unusual.'
  return [
    `${src.title ?? `File: ${src.path}`}. Part ${i + 1} of ${of}: ${where}.`,
    ...(task.user ? [`The agent's task (the person's request): ${task.user}`] : []),
    ...(task.assistant ? [`Why the agent is reading this ${src.noun ?? 'file'} (its words just before the read): ${task.assistant}`] : []),
    `Write notes that let the agent do this task without reading the ${src.noun ?? 'file'} itself, and know exactly where to look for the full text.`,
    task.user || task.assistant ? 'Put first what the task needs. Then still cover the whole part, so nothing the task might need is missing.' : '',
    cite,
    what,
    'Quote short exact strings when they matter (ids, error messages, keys, figures).',
    `At most ${words} words.`,
    '<text>',
    part.lines.map(l => `L${l.n}: ${l.text}`).join('\n'),
    '</text>',
  ]
    .filter(Boolean)
    .join('\n')
}

// null: a helper call failed, so the Read goes through as it is. The pane card follows every request.
async function makeNotes($: EngineInterface, src: Source, before: number, label: string, signal: AbortSignal, task: Task): Promise<Notes | null> {
  const of = src.chunks.length
  const words = Math.max(150, Math.min(600, Math.round(NOTE_WORDS / of)))
  const plainNoun = src.noun ?? 'file'
  const card = await newCard($, { part: 'file', tool: src.tool ?? 'Read', label: src.label ?? baseName(src.path), where: src.where ?? src.path, before, requests: of, phase: 'working', state: reading(0, of) })
  let answered = 0
  try {
    const answers = await Promise.all(
      src.chunks.map((part, i) =>
        ask($, FILE_SYSTEM, promptFor(src, part, i, of, words, task), words * 2 + 300, signal).then(async a => {
          answered += 1
          await setCard($, card, { answered, state: reading(answered, of) })
          return a
        }),
      ),
    )
    const calls: Call[] = []
    const bodies: string[] = []
    for (const [i, { r }] of answers.entries()) {
      calls.push(usageOf(r))
      if (!r.isAnswered || !r.text.trim()) {
        await log($, 'file', 'helper', `part ${i + 1} of ${of} for ${src.path}: ${r.isAnswered ? 'empty' : r.reason}`)
        await setCard($, card, { phase: 'failed', state: `Haiku failed, so Claude got the plain ${plainNoun}`, usd: haikuUsd(calls) })
        return null
      }
      const part = src.chunks[i]!
      const first = part.lines[0]!
      const last = part.lines[part.lines.length - 1]!
      const head =
        of === 1 ? '' : src.kind === 'pdf' ? `## Pages ${first.page}-${last.page} (L${first.n}-L${last.n})\n` : `## Lines ${first.n}-${last.n}\n`
      bodies.push(`${head}${clean(r.text)}`)
    }
    const helper = helperOf(answers[0]?.model ?? MODEL, calls)
    const notes: Notes = { body: bodies.join('\n\n'), about: src.about, covers: src.covers, exact: src.exact, before, helper, detail: null, label, full: src.full, ...(src.noun && { noun: src.noun }) }
    const text = frame(src.path, notes, 'fresh')
    await setCard($, card, { phase: 'done', state: 'Done. Claude got these notes', after: tokens(text), notes: text, usd: haikuUsd(calls), full: src.full })
    lastCard.set(src.path, card)
    return notes
  } finally {
    if (card.phase === 'working') await setCard($, card, { phase: 'failed', state: `Something broke, so Claude got the plain ${plainNoun}` })
  }
}

// The card a fresh set of notes drew, so recordFile can add its detail file.
const lastCard = new Map<string, Card>()

// What Claude reads: a header that says who wrote the notes and for what, the notes, and when to read exact lines.
function frame(path: string, n: Notes, how: How) {
  const output = n.noun === 'output'
  const noun = output ? 'output' : 'file'
  const who =
    how === 'fresh'
      ? `Haiku (a helper model) read this ${noun} for this task and wrote these notes.`
      : how === 'kept'
        ? `Haiku (a helper model) wrote these notes earlier in this chat. The ${noun} has not changed since.`
        : `Haiku (a helper model) wrote these notes in an earlier chat. The ${noun} has not changed since.`
  const again = output ? 'run the command again or read the saved output' : 'read the file again'
  const covers = `${n.covers}${how === 'fresh' ? ' and were written for this task' : ''}. You do not need to ${again} to check them.`
  const subject = output ? `the output of \`${n.label}\`` : path
  const thing = output ? 'the saved output' : extOf(path) === 'pdf' ? 'these pages' : 'this file'
  const full = output
    ? `Reading all or most of ${thing} again returns these same notes. For the exact text of all of it, ask the person to type /input-router full, then read it again.`
    : `Reading ${thing} again, or a range of ${EDIT_LINES} lines or more or over about ${MIN_TOKENS.toLocaleString('en-US')} tokens, returns these same notes. For the exact text of all of it, ask the person to type /input-router full, then read it again.`
  return [`[${TITLE}] Notes on ${subject}. ${who}`, n.about, '', n.body, '', covers, n.exact, full].join('\n')
}

// Notes are kept on disk by path, change time and size, so a reopened chat does not pay Haiku again. The format
// version is in the name: notes written before the 2026-11-03 wording are skipped (left on disk), never served.
const NOTES_V = 2
const notesFile = (path: string, key: string) => `${home}/.claude/mods-logs/${NAME}/notes/${slug(path)}-${hash(`v${NOTES_V}|${key}`)}.json`

async function loadNotes($: EngineInterface, path: string, key: string): Promise<Notes | undefined> {
  try {
    const file = notesFile(path, key)
    if (!(await $.fs.exists(file))) return undefined
    const o = JSON.parse(String(await $.fs.read(file))) as Record<string, unknown>
    if (o.v !== NOTES_V || o.key !== key || typeof o.body !== 'string' || typeof o.before !== 'number') return undefined
    const str = (v: unknown) => (typeof v === 'string' ? v : '')
    return {
      body: o.body,
      about: str(o.about),
      covers: str(o.covers) || 'These notes cover the whole file',
      exact: str(o.exact),
      before: o.before,
      helper: null,
      detail: typeof o.detail === 'string' ? o.detail : null,
      label: String(o.label ?? baseName(path)),
      full: str(o.full) || path,
    }
  } catch (err) {
    await log($, 'file', 'notes file unreadable', err)
    return undefined
  }
}

async function saveNotes($: EngineInterface, path: string, key: string, n: Notes) {
  try {
    const { helper: _helper, ...rest } = n
    await $.fs.write(notesFile(path, key), JSON.stringify({ v: NOTES_V, key, ...rest }))
  } catch (err) {
    await log($, 'file', 'notes file not saved', err)
  }
}

// Looks in memory, then on disk; makes fresh notes only when neither has them.
async function notesFor(
  $: EngineInterface,
  path: string,
  key: string,
  make: () => Promise<Notes | null>,
): Promise<{ notes: Notes; how: How } | null> {
  const kept = cache.get(key)
  if (kept) return { notes: kept, how: 'kept' }
  const disk = await loadNotes($, path, key)
  if (disk) {
    cache.set(key, disk)
    return { notes: disk, how: 'disk' }
  }
  const made = await make()
  if (!made) return null
  cache.set(key, made)
  return { notes: made, how: 'fresh' }
}

// A Read result of type text: the notes stand where the file's lines would.
function answer(filePath: string, content: string) {
  const numLines = content.split('\n').length
  return { result: { type: 'text' as const, file: { filePath, content, numLines, startLine: 1, totalLines: numLines } } }
}

// Ledger, detail file, toast and pane card for notes Claude is about to get. Returns the text it gets.
async function recordFile($: EngineInterface, e: { tool_use_id?: string; agentId?: string; file_path: string; tool?: CardTool }, notes: Notes, how: How) {
  const fresh = how === 'fresh'
  const text = frame(e.file_path, notes, how)
  const after = tokens(text)
  try {
    if (fresh) {
      const detail = `${home}/.claude/mods-logs/${NAME}/${stamp(await $.clock.now())}-${slug(e.file_path)}.md`
      const body = [
        notes.noun === 'output' ? `# ${TITLE} (file part, Bash output): ${notes.label}` : `# ${TITLE} (file): ${e.file_path}`,
        '',
        notes.noun === 'output'
          ? `- Before: ~${fmt(notes.before)} tokens (the whole output, characters / 4; core shows Claude a preview and the saved path, and Claude pages through the rest). Saved at ${e.file_path}`
          : `- Before: ~${fmt(notes.before)} tokens (what the plain ${e.tool ?? 'Read'} would have handed Claude, characters / 4). ${notes.label}`,
        `- After: ~${fmt(after)} tokens of notes`,
        notes.helper
          ? `- Helper: ${notes.helper.model}, ${fmt(notes.helper.in)} in, ${fmt(notes.helper.out)} out, ${notes.helper.calls.length} requests (${notes.helper.calls.map(c => fmt(c.in)).join(', ')} in)`
          : '- Helper: none',
        '',
        '## What Claude got',
        '',
        text,
        '',
      ].join('\n')
      notes.detail = await $.fs
        .write(detail, body)
        .then(() => detail)
        .catch(() => null)
    }
    const why = how === 'kept' ? ' (kept notes, no helper call)' : how === 'disk' ? ' (notes kept on disk, no helper call)' : ''
    await ledger($, 'file', {
      tool_use_id: e.tool_use_id,
      tool: e.tool ?? 'Read',
      action: `notes for ${notes.noun === 'output' ? `the output of ${notes.label}` : notes.label}${why}`,
      before: notes.before,
      after,
      helper: fresh ? notes.helper : null,
      detail: notes.detail,
    })
  } catch (err) {
    await log($, 'file', 'ledger', err)
  }
  if (fresh) {
    await setCard($, lastCard.get(e.file_path), { detail: notes.detail })
    lastCard.delete(e.file_path)
  } else {
    await newCard($, {
      part: 'file',
      tool: e.tool ?? 'Read',
      label: notes.noun === 'output' ? notes.label : baseName(e.file_path),
      where: e.file_path,
      before: notes.before,
      after,
      requests: 0,
      phase: 'kept',
      state: how === 'kept' ? 'Notes from earlier in this chat. No Haiku call' : 'Notes kept on disk from an earlier chat. No Haiku call',
      notes: text,
      detail: notes.detail,
      full: notes.full,
    })
  }
  noted.set(notedKey(await sessionId($), e.agentId, e.file_path), e.tool_use_id || 'earlier')
  await remember($, { part: 'file', label: notes.noun === 'output' ? notes.label : baseName(e.file_path), before: notes.before, after, how: fresh ? 'haiku' : 'kept notes' })
  await log($, 'file', 'notes', `${e.file_path} ${fmt(notes.before)} -> ${fmt(after)} tokens${fresh ? '' : ` (${how})`}`)
  return text
}

const UNCHANGED = (path: string) =>
  [
    `[${TITLE}] ${path} is unchanged since your last Read, and the ${TITLE} notes from that Read still cover it. You do not need to read the file again to check them.`,
    `Read exact lines (offset and limit, ${SMALL_RANGE}) only when you must quote exact text, or right before you Edit or Write this file. The person can type /input-router full to let the next whole read through.`,
  ].join('\n')

// A ranged Read of many lines of a file whose notes are already in this loop gets one line after its result.
// The Read itself is never blocked or changed.
async function remind($: EngineInterface, e: { file_path: string; offset?: number; limit?: number; pages?: string; agentId?: string }, ran: ToolOut): Promise<string | null> {
  try {
    if (ran.deny !== undefined || ran.isError || e.pages !== undefined || (e.limit ?? READ_LINES) < REMIND_LINES) return null
    const from = noted.get(notedKey(await sessionId($), e.agentId, e.file_path))
    if (!from) return null
    await log($, 'file', 'reminder', `${e.file_path} offset ${e.offset ?? 1} limit ${e.limit ?? READ_LINES}`)
    return remindLine(e.file_path, from)
  } catch {
    return null
  }
}

function remindLine(path: string, from: string) {
  return `[${TITLE}] Notes for ${path} are already in this chat (from tool call ${from}) and cover this file. You do not need to read it in pieces to check them. Read exact lines (${SMALL_RANGE}) only to quote exact text or right before an Edit.`
}

// Guard A let a short piece through after the piece counter passed its share: say what the next big piece gets.
function coverLine(path: string, share: number) {
  return `[${TITLE}] You have now read ${pct(share)} of ${path} in pieces. A read of ${EDIT_LINES} lines or more of it now returns its notes. Read ranges ${SMALL_RANGE}, only to quote exact text or right before an Edit.`
}

// The file's notes for this task (kept in memory or on disk, or fresh from Haiku), in place of `before` tokens of
// raw text: a whole read, a piece over the limit, or a piece past the piece counter. null: the read passes as it
// ran (a helper failure, a binary file, or notes that would not be shorter than the text).
async function fileNotes(
  $: EngineInterface,
  e: { tool_use_id?: string; agentId?: string; file_path: string },
  before: number,
  tool: CardTool,
  signal: AbortSignal,
  why: string,
): Promise<string | null> {
  const stat = await $.fs.stat(e.file_path)
  const task = await purpose($, e.agentId)
  const key = notesKey(e.file_path, stat, task)
  const got = await notesFor($, e.file_path, key, async () => {
    const src = await textSource($, e.file_path, stat.size)
    return src ? makeNotes($, { ...src, tool }, before, baseName(e.file_path), signal, task) : null
  })
  if (!got) return null
  if (got.how === 'fresh') await saveNotes($, e.file_path, key, got.notes)
  const notes = { ...got.notes, before }
  // At a 2,000-token limit a file's notes can be longer than a piece of it: then the raw piece is the cheaper answer.
  const after = tokens(frame(e.file_path, notes, got.how))
  if (after >= before) {
    await log($, 'file', 'pass', `${e.file_path}: the notes (~${fmt(after)} tokens) are not shorter than the text (~${fmt(before)} tokens), so the ${tool} passes (${why})`)
    if (got.how === 'fresh') {
      await setCard($, lastCard.get(e.file_path), { phase: 'failed', state: 'The notes were not shorter, so Claude got the plain text' })
      lastCard.delete(e.file_path)
    }
    return null
  }
  routed.add(e.file_path)
  await log($, 'file', 'route', `${e.file_path}: ${why}`)
  return recordFile($, { ...e, tool }, notes, got.how)
}

// A Read whose lines are the whole file: notes in place of the text (kept, on disk, or fresh from Haiku).
async function wholeRead<T extends ToolOut>($: EngineInterface, e: { tool_use_id?: string; agentId?: string; file_path: string }, ran: T, filePath: string, text: string, kind: string, signal: AbortSignal) {
  const before = tokens(text)
  if (before < MIN_TOKENS) {
    await pass($, before, `${e.file_path}: ${kind} under the limit (~${fmt(before)} tokens, limit ${fmt(MIN_TOKENS)})`)
    return ran
  }
  try {
    const out = await fileNotes($, e, before, 'Read', signal, `${kind} over the limit (~${fmt(before)} tokens, limit ${fmt(MIN_TOKENS)})`)
    return out === null ? ran : (answer(filePath, out) as unknown as T)
  } catch (err) {
    await log($, 'file', 'text', err)
    return ran
  }
}

// A piece of a file that came in as raw text: a ranged Read, or a shell print of part of the file.
//   Guard A (Read only): under EDIT_LINES lines and under MIN_TOKENS it stays exact text, so Edit still works. It
//   still counts. A short range of long lines over the limit is not an edit escape: it gets the notes.
//   Guard D: once the raw pieces of a big file pass COVER_SHARE of it, the piece gets the file's notes.
//   The limit: a piece over MIN_TOKENS gets the file's notes.
// Anything else passes, and its lines count toward the share.
type Piece = { lines: readonly number[]; total: number; text: string; what: string }
async function piece(
  $: EngineInterface,
  e: { tool_use_id?: string; agentId?: string; file_path: string },
  p: Piece,
  tool: CardTool,
  signal: AbortSignal,
): Promise<{ notes: string } | { context: string | null }> {
  const st = await $.fs.stat(e.file_path)
  const key = pulledKey(await sessionId($), e.agentId, e.file_path, st)
  const size = tokens(p.text)
  const now = shareWith(key, p.lines, p.total)
  const bigFile = st.size / 4 >= MIN_TOKENS
  const where = `${e.file_path}: ${p.what}`
  if (tool === 'Read' && p.lines.length < EDIT_LINES && size < MIN_TOKENS) {
    addPulled(key, p.lines)
    await pass($, size, `${where}, edit escape (${p.lines.length} lines, under ${EDIT_LINES}; ~${fmt(size)} tokens, under ${fmt(MIN_TOKENS)}): exact text, ${pct(now)} of the file read in pieces`)
    return { context: bigFile && now > COVER_SHARE ? coverLine(e.file_path, now) : null }
  }
  const counted = bigFile && now > COVER_SHARE
  if (counted || size >= MIN_TOKENS) {
    const why = counted
      ? `piece counter: ${p.what} would make ${pct(now)} of the file read in pieces (limit ${pct(COVER_SHARE)})`
      : `${p.what} over the limit (~${fmt(size)} tokens, limit ${fmt(MIN_TOKENS)})`
    const out = await fileNotes($, e, size, tool, signal, why)
    if (out !== null) return { notes: out }
  } else {
    await pass($, size, `${where} under the limit (~${fmt(size)} tokens, limit ${fmt(MIN_TOKENS)}), ${pct(now)} of the file read in pieces`)
  }
  addPulled(key, p.lines)
  return { context: null }
}

// A big input this mod left alone, and why. Small ones are not logged.
async function pass($: EngineInterface, size: number, why: string) {
  if (size >= PASS_LOG_TOKENS) await log($, 'file', 'pass', why)
}

// /input-router full is taken only by a Read the file part would have changed, by the same rules as above.
async function wouldRoute($: EngineInterface, e: { file_path: string; offset?: number; limit?: number; pages?: string; agentId?: string }, ext: string) {
  if (isInstruction(e.file_path)) return false
  if (ext === 'pdf') {
    const range = parsePages(e.pages, Number.MAX_SAFE_INTEGER)
    return range === null || range.last - range.first + 1 > ZOOM_PAGES
  }
  if (e.pages !== undefined) return false
  const st = await $.fs.stat(e.file_path).catch(() => null)
  if (st === null || st.size / 4 < MIN_TOKENS) return false
  if (e.offset === undefined && e.limit === undefined) return true
  if (st.size > FILE_READ_MAX) return false
  const all = String(await $.fs.read(e.file_path)).split('\n')
  const start = Math.max(e.offset ?? 1, 1)
  const count = Math.max(0, Math.min(e.limit ?? READ_LINES, all.length - start + 1))
  if (start === 1 && count >= all.length) return true
  if (tokens(all.slice(start - 1, start - 1 + count).join('\n')) >= MIN_TOKENS) return true
  if (count < EDIT_LINES) return false
  return shareWith(pulledKey(await sessionId($), e.agentId, e.file_path, st), lineRange(start, count), all.length) > COVER_SHARE
}

// ============================================================================
// Connector part (was Connector Reader)
// ============================================================================

// The text of a result, when it is plain text or text blocks only. Anything else is not ours to change.
function textOf(result: unknown): { texts: string[] } | { skip: string } {
  if (typeof result === 'string') return { texts: [result] }
  if (!Array.isArray(result)) return { skip: 'not text' }
  const parts: string[] = []
  for (const block of result) {
    const type = block && typeof block === 'object' ? (block as { type?: unknown }).type : undefined
    if (type === 'image' || type === 'document') return { skip: 'image' }
    if (type !== 'text') return { skip: `block ${String(type)}` }
    parts.push(String((block as { text?: unknown }).text ?? ''))
  }
  return { texts: parts }
}

// The words of the task, so the trimmer never drops a field the task names.
function wordsOf(text: string) {
  const words = new Set<string>()
  for (const w of text.toLowerCase().match(/[a-z][a-z0-9]{3,}/g) ?? []) {
    words.add(w)
    if (w.endsWith('s')) words.add(w.slice(0, -1))
  }
  return words
}

function isWanted(key: string, words: Set<string>) {
  return key
    .toLowerCase()
    .split(/[_\-.\s]+/)
    .some(part => part.length >= 4 && words.has(part))
}

type Trim = { removed: Set<string>; cut: number; cutChars: number; unpacked: number; words: Set<string>; cap: number }

function trim(words: Set<string>, cap: number): Trim {
  return { removed: new Set(), cut: 0, cutChars: 0, unpacked: 0, words, cap }
}

function isEmpty(v: unknown) {
  if (v === null || v === undefined || v === '') return true
  if (Array.isArray(v)) return v.length === 0
  return typeof v === 'object' && Object.keys(v as object).length === 0
}

function trimValue(v: unknown, t: Trim): unknown {
  if (typeof v === 'string') {
    if (v.length >= 200 && !v.includes(' ') && /^[A-Za-z0-9+/=\r\n]+$/.test(v)) {
      t.cut += 1
      return '[base64 removed]'
    }
    // JSON written into a text field is unpacked, so the trim reaches inside it.
    if (/^\s*[[{]/.test(v)) {
      const inner = parseOne(v)
      if (inner !== undefined) {
        t.unpacked += 1
        return trimValue(inner, t)
      }
    }
    if (v.length > t.cap) {
      t.cut += 1
      t.cutChars += v.length - t.cap
      return `${v.slice(0, t.cap)} [+${(v.length - t.cap).toLocaleString('en-US')} characters, full text in the file]`
    }
    return v
  }
  if (Array.isArray(v)) {
    const items = v.map(x => trimValue(x, t)).filter(x => !isEmpty(x))
    return hoist(items)
  }
  if (v && typeof v === 'object') {
    const out: Record<string, unknown> = {}
    for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
      if (DROP_KEY.test(k) && !isWanted(k, t.words)) {
        t.removed.add(k)
        continue
      }
      const kept = trimValue(x, t)
      if (!isEmpty(kept)) out[k] = kept
    }
    return out
  }
  return v
}

// A list of three or more records whose fields hold the same value in every record lists those fields once.
function hoist(items: unknown[]): unknown {
  if (items.length < 3 || !items.every(x => x && typeof x === 'object' && !Array.isArray(x))) return items
  const rows = items as Record<string, unknown>[]
  const same: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(rows[0]!)) {
    const json = JSON.stringify(v)
    if (json.length < 40) continue
    if (rows.every(r => k in r && JSON.stringify(r[k]) === json)) same[k] = v
  }
  if (Object.keys(same).length === 0) return items
  return {
    same_in_every_item: same,
    items: rows.map(r => Object.fromEntries(Object.entries(r).filter(([k]) => !(k in same)))),
  }
}

function parseOne(text: string): unknown {
  const s = text.trim()
  if (!/^[[{]/.test(s)) return undefined
  try {
    return JSON.parse(s)
  } catch {
    return undefined
  }
}

// The texts of a list of text blocks. Core saves a result that way when it has several blocks or block notes.
function blockTexts(v: unknown): string[] | undefined {
  if (!Array.isArray(v) || v.length === 0) return undefined
  const texts: string[] = []
  for (const b of v) {
    if (!b || typeof b !== 'object' || (b as { type?: unknown }).type !== 'text') return undefined
    const text = (b as { text?: unknown }).text
    if (typeof text !== 'string') return undefined
    texts.push(text)
  }
  return texts
}

// The result as JSON when it is JSON: one value, or one value per text block. A saved list of text blocks is
// unwrapped first; blocks says how many it had.
function parse(texts: string[]): { data: unknown; text: string; blocks: number } {
  if (texts.length === 1) {
    const v = parseOne(texts[0]!)
    const inner = blockTexts(v)
    if (inner) return { ...parse(inner), blocks: inner.length }
    return { data: v, text: texts[0]!, blocks: 0 }
  }
  const values = texts.map(parseOne)
  const data = values.some(v => v !== undefined) ? values.map((v, i) => v ?? texts[i]) : undefined
  return { data, text: texts.join('\n'), blocks: 0 }
}

// A one-line outline of a JSON value: its keys, and the length of each list.
function outline(v: unknown, depth = 0): string {
  if (Array.isArray(v)) return `list of ${v.length}${v.length && depth < 1 ? ` (each ${outline(v[0], depth + 1)})` : ''}`
  if (v && typeof v === 'object') {
    const keys = Object.entries(v as Record<string, unknown>)
    if (depth >= 1) return `{${keys.slice(0, 12).map(([k]) => k).join(', ')}${keys.length > 12 ? ', ...' : ''}}`
    return `{${keys
      .slice(0, 15)
      .map(([k, x]) => (Array.isArray(x) ? `${k}[${x.length}]` : k))
      .join(', ')}${keys.length > 15 ? ', ...' : ''}}`
  }
  return typeof v
}

// The paging and count fields at the top of the data (or in a meta or pagination object), word for word.
function pagingOf(data: unknown): string {
  const found: string[] = []
  const look = (o: unknown, prefix: string, depth: number) => {
    if (!o || typeof o !== 'object' || Array.isArray(o)) return
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) {
      if (PAGING_KEY.test(k) && (v === null || ['string', 'number', 'boolean'].includes(typeof v)) && String(v).length < 200) {
        found.push(`${prefix}${k}: ${JSON.stringify(v)}`)
      } else if (depth === 0 && PAGING_HOLDER.test(k)) look(v, `${k}.`, 1)
    }
  }
  look(data, '', 0)
  return found.length > 0 ? `Paging and count fields, copied by code word for word: ${found.join(', ')}. What each field means is not worked out here.` : ''
}

function plain(text: string) {
  const tags = text.match(/<\/?[a-z][^>]*>/gi)?.length ?? 0
  const s = tags > 20 ? text.replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ').replace(/<[^>]+>/g, ' ') : text
  return s
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim()
}

function slices(text: string): string[] {
  const out: string[] = []
  for (let i = 0; i < text.length; i += DATA_CHUNK_CHARS) out.push(text.slice(i, i + DATA_CHUNK_CHARS))
  return out
}

// Splits trimmed data into parts a helper call can read, by records where the data is a list. A part never
// passes DATA_CHUNK_CHARS: one record bigger than that is cut into plain slices.
function chunks(data: unknown, text: string): string[] {
  if (text.length <= DATA_CHUNK_CHARS) return [text]
  let list: unknown[] | undefined
  let wrap: (part: unknown[]) => unknown = part => part
  if (Array.isArray(data)) list = data
  else if (data && typeof data === 'object') {
    const entries = Object.entries(data as Record<string, unknown>)
    let best: [string, unknown[]] | undefined
    for (const [k, v] of entries) {
      const items = Array.isArray(v) ? v : v && typeof v === 'object' && Array.isArray((v as { items?: unknown }).items) ? (v as { items: unknown[] }).items : undefined
      if (items && (!best || items.length > best[1].length)) best = [k, items]
    }
    if (best) {
      const [key, items] = best
      list = items
      const holder = (data as Record<string, unknown>)[key]
      wrap = part => ({
        ...(data as Record<string, unknown>),
        [key]: Array.isArray(holder) ? part : { ...(holder as Record<string, unknown>), items: part },
      })
    }
  }
  if (!list || list.length < 2) return slices(text)
  const out: string[] = []
  let part: unknown[] = []
  let n = 0
  // The wrapper (the other top-level fields) goes into every part, so it counts against the budget.
  const room = DATA_CHUNK_CHARS - JSON.stringify(wrap([])).length
  for (const item of list) {
    const len = JSON.stringify(item).length + 1
    if (part.length > 0 && n + len > room) {
      out.push(JSON.stringify(wrap(part)))
      part = []
      n = 0
    }
    part.push(item)
    n += len
  }
  if (part.length > 0) out.push(JSON.stringify(wrap(part)))
  return out.flatMap(p => (p.length > DATA_CHUNK_CHARS ? slices(p) : [p]))
}

function clip(text: string, max: number) {
  const s = text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, ' ').replace(/\s+/g, ' ').trim()
  return s.length > max ? `${s.slice(0, max)} ...` : s
}

// Long text cut from the middle, so both the start of a request and its last lines reach Haiku.
function middle(text: string, max: number) {
  const s = text.replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, ' ').replace(/\s+/g, ' ').trim()
  if (s.length <= max) return s
  const half = Math.floor((max - 24) / 2)
  return `${s.slice(0, half)} ... [middle cut] ... ${s.slice(s.length - half)}`
}

// Short replies that only say go on. They are not the task, so the walk-back steps over them.
const FILLER = new Set(
  'yes yeah yep yup ok okay k sure go ahead do it that this please pls thanks thank you continue proceed approved approve sounds good great perfect fine lgtm carry on keep going right cool nice alright now then and run start the y'.split(' '),
)
function isFiller(text: string) {
  if (text.length >= 40 || /[/\\]|\.\w{1,5}\b|\d/.test(text)) return false
  const words = text.toLowerCase().match(/[a-z]+/g) ?? []
  return words.every(w => FILLER.has(w))
}

// What the call was for: the person's last real request and Claude's last words before the call. A short go-on
// reply ("yes", "do it") is stepped over to the request before it; if every reply is one, the newest is used.
// In a subagent the transcript is its own, so the request is the subagent's prompt.
async function purpose($: EngineInterface, agentId: string | undefined): Promise<Task> {
  let rows: readonly SessionMessage[] = []
  try {
    const got = await $.session.messages(agentId ? { agentId } : {})
    if (Array.isArray(got)) rows = got as readonly SessionMessage[]
  } catch {
    // No transcript: the arguments alone say what the call was for.
  }
  let user = ''
  let filler = ''
  let assistant = ''
  for (let i = rows.length - 1; i >= 0 && !user; i--) {
    const row = rows[i]!
    if (row.role === 'assistant' && !assistant && !filler) assistant = clip(row.text ?? '', PROMPT_CHARS)
    if (row.role !== 'user' || (row.toolResults && row.toolResults.length > 0)) continue
    const text = middle(row.text ?? '', REQUEST_CHARS)
    if (!text) continue
    if (isFiller(text)) filler ||= text
    else user = text
  }
  return { user: user || filler, assistant }
}

const CONNECTOR_SYSTEM = [
  'You help another AI assistant by reading a large tool result it asked for. The assistant sees only your answer, not the raw data.',
  'Return only what the assistant needs for its task.',
  'Rules:',
  '- Copy values exactly: names, ids, emails, numbers, dates, URLs. Never invent, guess or round.',
  '- When the task needs a list of records, keep every record that fits, one compact line each, with the fields the task needs plus the record id and name.',
  '- When the task is unclear, keep one compact line per record with its id, its name and its most telling fields.',
  '- Copy paging and count fields by their exact name and value (for example page_count: 5, count: 33946, has_next_page: true). Never write "page X of Y", a page total, or what a paging field means. Never work out a number the data does not state.',
  '- No preamble and no closing summary.',
  '- The last line is "Not kept:" and then the kinds of fields you left out, in a few words.',
].join('\n')

async function extract(
  $: EngineInterface,
  parts: string[],
  task: { tool: string; args: string; user: string; assistant: string; shape: string },
  signal: AbortSignal | undefined,
  onAnswer: () => Promise<void>,
): Promise<{ text: string; helper: Helper } | { error: string; helper: Helper }> {
  const head = [
    'Task context',
    `The person's last message: ${task.user || '(none)'}`,
    `The assistant's words before the call: ${task.assistant || '(none)'}`,
    `Tool: ${task.tool}`,
    `Arguments: ${task.args}`,
  ].join('\n')
  const asks = parts
    .slice(0, MAX_CHUNKS)
    .map((part, i) =>
      ask($, CONNECTOR_SYSTEM, `${head}\n\nTool result (${task.shape}${parts.length > 1 ? `, part ${i + 1} of ${parts.length}` : ''}):\n${part}`, HELPER_MAX_TOKENS, signal).then(
        async a => {
          await onAnswer()
          return a
        },
      ),
    )
  const answers = await Promise.all(asks)
  const helper = helperOf(answers[0]?.model ?? MODEL, answers.map(a => usageOf(a.r)))
  const texts: string[] = []
  for (const { r } of answers) {
    if (!r.isAnswered) return { error: r.reason, helper }
    texts.push(clean(r.text))
  }
  if (texts.every(t => !t)) return { error: 'empty-reply', helper }
  if (parts.length > MAX_CHUNKS) {
    texts.push(`(Only the first ${MAX_CHUNKS} of ${parts.length} parts were read. The rest is only in the file.)`)
  }
  return { text: texts.join('\n\n'), helper }
}

type ToolOut = { deny?: unknown; isError?: boolean; result?: unknown }

async function connector(
  $: EngineInterface,
  e: Record<string, unknown> & { tool_use_id?: string },
  tool: string,
  ran: ToolOut,
  signal: AbortSignal | undefined,
  held: { card?: Card },
  // A Bash command's JSON output (curl of an API): the card and ledger name the command, not a connector.
  shown?: { label: string; where: string; tool: CardTool },
) {
  const got = textOf(ran.result)
  if ('skip' in got) {
    if (got.skip !== 'image') await log($, 'connector', 'pass', `${tool}: result is ${got.skip}`)
    return ran
  }

  // Over core's cap the result is a note with the path of the file core saved: read that file.
  let texts = got.texts
  let raw = texts.join('\n')
  let file = ''
  // Over the cap, Claude gets core's note, not the data. So the note is the honest "before".
  let noteText = ''
  const note = raw.length < NOTE_MAX ? (CORE_NOTE.exec(raw) ?? PERSISTED_NOTE.exec(raw)) : null
  if (note) {
    file = note[1]!
    try {
      const st = await $.fs.stat(file)
      if (st.size > FILE_READ_MAX) {
        await log($, 'connector', 'pass', `${tool}: core file is ${st.size} bytes, over the read limit`)
        return ran
      }
      noteText = raw
      raw = String(await $.fs.read(file))
      texts = [raw]
    } catch (err) {
      await log($, 'connector', 'pass', `${tool}: core file unreadable: ${err instanceof Error ? err.message : String(err)}`)
      return ran
    }
  } else if (raw.length < NOTE_MAX && raw.includes(OVER_CAP)) {
    await log($, 'connector', 'pass', `${tool}: core says the result is over its cap, but its note has no saved-file path: ${clip(raw, 300)}`)
    return ran
  }
  if (raw.length < MIN_CHARS) {
    // The connector limit stays at 16,000 characters (about 4,000 tokens); files and shell reads use 2,000 tokens.
    if (raw.length >= MIN_CHARS / 4) await log($, 'connector', 'pass', `${tool}: result under the connector limit (${fmt(raw.length)} characters, limit ${fmt(MIN_CHARS)} characters; files and shell reads use ${fmt(MIN_TOKENS)} tokens)`)
    return ran
  }
  if (await takeFull($)) {
    await log($, 'connector', 'full', `${tool}: let through whole by /input-router full`)
    return ran
  }

  const now = await $.clock.now()
  const server = shown ? 'bash' : (tool.split('__')[1] ?? 'mcp')
  const short = shown?.label ?? (tool.split('__').slice(2).join('__') || tool)
  const args = Object.fromEntries(Object.entries(e).filter(([k]) => !['tool', 'tool_use_id', 'agentId', 'requestMeta', 'consent'].includes(k)))
  const argsText = clip(JSON.stringify(args), PROMPT_CHARS)
  const task = await purpose($, typeof e.agentId === 'string' ? e.agentId : undefined)

  // Save the full result, unless core already did.
  const { data, text, blocks } = parse(texts)
  if (!file) {
    file = `${home}/.claude/mods-logs/${NAME}/results/${stamp(now)}-${safe(server)}-${safe(short)}.${data === undefined ? 'txt' : 'json'}`
    try {
      await $.fs.write(file, data !== undefined && texts.length > 1 ? JSON.stringify(data) : raw)
    } catch (err) {
      await log($, 'connector', 'pass', `${tool}: could not save the full result: ${err instanceof Error ? err.message : String(err)}`)
      return ran
    }
  }

  // Plain code first: drop fields nobody uses, empty values and pictures written as text. No text is cut here,
  // so the path choice and Haiku both see every long text whole.
  const words = wordsOf(`${task.user} ${task.assistant} ${argsText}`)
  let t = trim(words, Infinity)
  const trimmedData = data === undefined ? undefined : trimValue(data, t)
  let trimmed = trimmedData === undefined ? plain(text) : JSON.stringify(trimmedData)
  // Cutting long text values is fine only when the cut is a small share. Otherwise the content is in that text.
  if (trimmed.length > TRIM_ENOUGH_CHARS && data !== undefined) {
    const tc = trim(words, STRING_CAP)
    const capped = JSON.stringify(trimValue(data, tc))
    if (capped.length <= TRIM_ENOUGH_CHARS && tc.cutChars <= trimmed.length * CUT_SHARE) {
      t = tc
      trimmed = capped
    }
  }
  const full = tokens(raw)
  // Over core's cap, core shows Claude a short preview and the saved path, and Claude then reads the saved file.
  // So `before` is the saved file, not the preview: counting the preview made savings negative.
  const before = full
  const kind = data === undefined ? 'text' : `JSON, ${outline(data)}`
  const removed = [...t.removed].slice(0, 20)
  const removedLine = removed.length > 0 ? `Fields left out (still in the file): ${removed.join(', ')}${t.removed.size > 20 ? ', ...' : ''}.` : ''
  const coreSaved = !note
    ? ''
    : noteText.includes('contains only the first')
      ? ' Claude Code had saved it to a file because it was over its size cap, and it cut that file short: the end of the data is missing.'
      : ' Claude Code had saved it to a file because it was over its size cap.'
  const shape = blocks
    ? `a JSON list of ${blocks} text blocks. The data is in the text of each block (jq -r '.[].text')${data === undefined ? '' : `, and it is JSON, ${outline(data)}`}`
    : kind
  // The saved file is for a field the reply does not have, never for checking the reply.
  const whereHaiku = `The full result is saved here: ${file} (${shape}). Use it only for a field this note does not list, not to re-check the note (jq or python through Bash).`
  const whereTrim = `The full result is saved here: ${file} (${shape}). Nothing below is summarised: only the fields named above were left out. Use the file only for one of those fields (jq or python through Bash).`
  const steps = [
    'Empty values were dropped.',
    t.unpacked > 0 ? 'JSON written inside text fields was unpacked.' : '',
    t.cutChars > 0 ? `${t.cut} text values over ${STRING_CAP.toLocaleString('en-US')} characters were cut.` : '',
  ]
    .filter(Boolean)
    .join(' ')

  let reply = ''
  let how = ''
  let helper: Helper | null = null
  if (trimmed.length <= TRIM_ENOUGH_CHARS) {
    how = 'trim'
    reply = [
      `[${TITLE}] ${tool}: trimmed this result from about ${fmt(full)} to ${fmt(tokens(trimmed))} tokens.${coreSaved} ${removedLine} ${steps}`.replace(/ {2,}/g, ' '),
      whereTrim,
      '',
      trimmed,
    ].join('\n')
  } else {
    await status($, `${TITLE}: Haiku is reading ${short} (about ${fmt(tokens(trimmed))} tokens)`)
    const parts = chunks(trimmedData, trimmed)
    const asked = Math.min(parts.length, MAX_CHUNKS)
    const card = await newCard($, { part: 'connector', tool: shown?.tool ?? 'connector', label: short, where: shown?.where ?? tool, before, requests: asked, phase: 'working', state: reading(0, asked), full: file })
    held.card = card
    let answered = 0
    const got2 = await extract(
      $,
      parts,
      { tool, args: argsText, ...task, shape: data === undefined ? 'text' : 'JSON, trimmed: fields nobody uses and empty values removed' },
      signal,
      async () => {
        answered += 1
        await setCard($, card, { answered, state: reading(answered, asked) })
      },
    )
    helper = got2.helper
    await setCard($, card, { usd: haikuUsd(helper.calls) })
    if ('error' in got2) {
      await log($, 'connector', 'helper failed', `${tool}: ${got2.error}`)
      if (note || trimmed.length >= raw.length) {
        await status($, undefined)
        await setCard($, card, { phase: 'failed', state: 'Haiku failed, so Claude got the plain result' })
        return ran
      }
      how = 'trim, helper failed'
      reply = [
        `[${TITLE}] ${tool}: the helper model failed, so this is the trimmed result (about ${fmt(tokens(trimmed))} of ${fmt(full)} tokens). ${removedLine}`,
        whereTrim,
        '',
        trimmed,
      ].join('\n')
    } else {
      how = 'haiku'
      const paging = pagingOf(trimmedData ?? data)
      const whole = parts.length <= MAX_CHUNKS ? 'read the whole result for this task' : `read the first ${MAX_CHUNKS} of ${parts.length} parts for this task`
      reply = [
        `[${TITLE}] ${tool}: this result was about ${fmt(full)} tokens, so Haiku (a helper model) ${whole} and kept what the task needs. This note is the answer to use: you do not need to check it against the saved file.${coreSaved} ${removedLine}`.trim(),
        whereHaiku,
        ...(paging ? [paging] : []),
        '',
        got2.text,
      ].join('\n')
    }
  }

  const after = tokens(reply)
  if (after >= before) {
    await status($, undefined)
    await setCard($, held.card, { phase: 'failed', state: 'The notes were not shorter, so Claude got the plain result' })
    return ran
  }

  const detail = `${home}/.claude/mods-logs/${NAME}/${stamp(now)}-${safe(short)}.md`
  try {
    await $.fs.write(
      detail,
      [
        `# ${TITLE} (connector): ${tool}`,
        '',
        `- Arguments: ${argsText}`,
        `- Full result: ${file}${note ? ' (saved by Claude Code, over its MCP size cap)' : ''}`,
        `- Shape: ${shape}`,
        `- Path: ${how}`,
        note
          ? `- Before: about ${before} tokens (the file core saved, ${raw.length} characters; core's own note was ${noteText.length} characters). After: about ${after} tokens (${reply.length} characters)`
          : `- Before: about ${before} tokens (${raw.length} characters). After: about ${after} tokens (${reply.length} characters)`,
        `- Removed fields: ${[...t.removed].join(', ') || 'none'}`,
        `- Long text values cut: ${t.cutChars > 0 ? t.cut : 0}. JSON text fields unpacked: ${t.unpacked}`,
        helper ? `- Helper: ${helper.model}, ${helper.in} in, ${helper.out} out, ${helper.calls.length} requests (${helper.calls.map(c => c.in).join(', ')} in)` : '- Helper: none',
      ].join('\n') + '\n',
    )
  } catch {
    // The detail file is optional.
  }
  await ledger($, 'connector', {
    tool_use_id: e.tool_use_id,
    tool: shown?.tool ?? 'connector',
    action: `${how} ${short}${note ? ` (over the core cap: before is the ${fmt(full)}-token file core saved, not its ${fmt(tokens(noteText))}-token preview)` : ''}`,
    before,
    after,
    helper,
    detail,
  })
  await log($, 'connector', how, `${tool}: ${raw.length} chars${note ? ` from the core file (note ${noteText.length} chars)` : ''}, ${before} -> ${after} tokens`)
  await remember($, { part: 'connector', label: short, before, after, how: note ? `${how}, over the core cap` : how })
  await status($, `${TITLE}: ${short} ${fmt(before)} to ${fmt(after)} tokens`)
  await setCard($, held.card, {
    phase: how === 'haiku' ? 'done' : 'failed',
    state: how === 'haiku' ? 'Done. Claude got this note' : 'Haiku failed, so Claude got the trimmed result',
    after,
    notes: reply,
    detail,
  })
  return { result: reply }
}

// ============================================================================
// Commands
// ============================================================================

const PART_WORDS: Record<string, Part> = {
  file: 'file',
  files: 'file',
  read: 'file',
  connector: 'connector',
  connectors: 'connector',
  mcp: 'connector',
}
// The web part was removed on 2026-11-03.
const REMOVED = new Set(['web', 'webfetch', 'fetch'])

const ABOUT: Record<Part, string> = {
  file: `a whole Read over ~${fmt(MIN_TOKENS)} tokens, a PDF over ${ZOOM_PAGES} pages, or a Bash read (cat, sed, grep, curl and the like) over ~${fmt(MIN_TOKENS)} tokens gets Haiku notes with line numbers`,
  connector: `a connector result over ~${fmt(MIN_CHARS / 4)} tokens is trimmed by code, then read by Haiku if still over ~${fmt(TRIM_ENOUGH_CHARS / 4)}`,
}

async function statusText($: EngineInterface) {
  const sid = await sessionId($)
  const list = done.get(sid) ?? []
  const lines = [`${TITLE} is on.`]
  for (const p of PARTS) {
    const mine = list.filter(d => d.part === p)
    const state = globalOff.has(p)
      ? `off in every chat ("${NAME}:${p}": false in switches.json)`
      : chatOff.get(sid)?.has(p)
        ? `off in this chat (/input-router on ${p})`
        : 'on'
    const sum = mine.length
      ? `${mine.length} handled, ${fmt(mine.reduce((s, d) => s + d.before, 0))} to ${fmt(mine.reduce((s, d) => s + d.after, 0))} tokens`
      : 'nothing handled yet'
    lines.push(`- ${p[0]!.toUpperCase()}${p.slice(1)}: ${state}. ${sum}. When: ${ABOUT[p]}.`)
  }
  lines.push(`- /input-router full: ${fullNext.has(sid) ? 'armed. The next big input comes through whole.' : 'lets the next big input through whole, once.'}`)
  lines.push(
    `- Pane: ${globalHidden ? `hidden in every chat ("${NAME}:hidden": true in switches.json)` : hiddenIn.has(sid) ? 'hidden in this chat. /input-router pane shows it' : 'opens when Haiku reads something. /input-router pane opens it now'}.`,
  )
  if (list.length) lines.push(`- Recent: ${list.slice(-RECENT_MAX).reverse().map(d => `${d.label} ${fmt(d.before)} to ${fmt(d.after)} (${d.part}, ${d.how})`).join('; ')}.`)
  lines.push(`- Ledger: ${home}/.claude/mods-logs/savings.jsonl`)
  return lines.join('\n')
}

// ============================================================================
// Bash: a shell read of a file or an API
// ============================================================================

type BashOut = { stdout: string; stderr: string; interrupted: boolean; isImage?: boolean; backgroundTaskId?: string; returnCodeInterpretation?: string; persistedOutputPath?: string }

// The steps of a command, one per pipeline or list step, and one per $( ) inside it: the program, then its words.
// Heredoc bodies and quoted text are blanked first, so a | or ; inside them does not split the command. Steps that
// only set a variable, or are only loop words or comments, have no program. Anything odd is never a reader, so passes.
function stepsOf(cmd: string): string[][] {
  const plain = cmd
    .replace(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n[\s\S]*?\n\s*\2\s*(?=\n|$)/g, '<<Q')
    .replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, 'Q')
  const out: string[][] = []
  for (const step of plain.split(/\|\||&&|[|;\n`]|\$\(|\)/)) {
    const words = step.trim().split(/\s+/).filter(Boolean)
    if (words.length === 0 || words[0]!.startsWith('#') || STRUCTURE.has(words[0]!)) continue
    let i = 0
    while (i < words.length) {
      const w = words[i]!
      if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(w)) i += 1
      else if (STARTERS.has(w)) {
        i += 1
        while (i < words.length && words[i]!.startsWith('-')) i += FLAG_VALUE.has(words[i]!) ? 2 : 1
      } else break
    }
    if (i < words.length) out.push([baseName(words[i]!).replace(/^[({]+/, ''), ...words.slice(i + 1)])
  }
  return out
}

function programs(cmd: string): string[] {
  return stepsOf(cmd).map(s => s[0]!)
}

// Guard C: a grep or rg that lists files or counts matches finds where things are; it reads nothing. -c counts,
// but -C, -A and -B add context lines, so they make it a read. Flag clusters (-rl, -nC3) count letter by letter.
function grepFlags(prog: string, words: readonly string[]) {
  let find = false
  let context = false
  for (const w of words) {
    if (w === '--') break
    if (/^--(files|files-with-matches|files-without-match|count|count-matches)$/.test(w)) find = true
    else if (/^--(context|after-context|before-context)(=|$)/.test(w)) context = true
    else if (/^-[A-Za-z]/.test(w)) {
      const letters = w.slice(1).replace(/[^A-Za-z].*$/, '')
      if (/[ABC]/.test(letters)) context = true
      // rg -L follows links; only grep's -L lists files.
      if ((prog === 'rg' ? /[lc]/ : /[lLc]/).test(letters)) find = true
    }
  }
  return { find, context }
}

const GREPS = new Set(['grep', 'egrep', 'fgrep', 'rg', 'ag'])
const FINDERS = new Set(['find', 'ls', 'fd', 'locate', 'mdfind', 'tree'])

// A command that finds files or counts matches: every reader in it is a listing or counting grep, or it is only
// find, ls and helpers.
function findStyle(cmd: string) {
  const steps = stepsOf(cmd)
  if (steps.length === 0) return false
  const readers = steps.filter(st => READERS.has(st[0]!))
  if (readers.length === 0) return steps.some(st => FINDERS.has(st[0]!)) && steps.every(st => FINDERS.has(st[0]!) || HELPERS.has(st[0]!))
  return readers.every(st => {
    if (!GREPS.has(st[0]!)) return false
    const f = grepFlags(st[0]!, st.slice(1))
    return f.find && !f.context
  })
}

// Scripts that may print a file. They stay out of the reader list; a big output from one is logged so it can be counted.
const SCRIPTS = /^(python[0-9.]*|node|deno|bun|ruby|perl|php)$/

// Only file and API reads are touched: never builds, tests, git, or anything Claude needs exactly as it ran.
function isReader(cmd: string) {
  const progs = programs(cmd)
  return progs.length > 0 && progs.every(p => READERS.has(p) || HELPERS.has(p)) && progs.some(p => READERS.has(p))
}

// `cat /abs/file` and nothing else: the same as a Read of that file.
function catFile(cmd: string): string | null {
  const m = /^\s*cat\s+(?:'([^']+)'|"([^"]+)"|(\/\S+))\s*$/.exec(cmd)
  const path = m ? (m[1] ?? m[2] ?? m[3]) : undefined
  // Windows (Git Bash): C:/..., C:\... or /c/..., read as C:/...; a bare /tmp path is Git's own, not a Windows file.
  if (win) {
    const w = /^\s*cat\s+(?:'([^']+)'|"([^"]+)"|((?:\/|[A-Za-z]:[\\/])\S+))\s*$/.exec(cmd)
    const p = w ? slashed(w[1] ?? w[2] ?? w[3] ?? '') : ''
    return /^[A-Za-z]:\//.test(p) ? p : null
  }
  return path?.startsWith('/') ? path : null
}

// Whether the command names this text as a whole word: a path, not part of a longer name.
function mentions(cmd: string, text: string) {
  for (let i = cmd.indexOf(text); i >= 0; i = cmd.indexOf(text, i + 1)) {
    const before = i === 0 ? ' ' : cmd[i - 1]!
    const after = cmd[i + text.length] ?? ' '
    if (/[\s'"=(<]/.test(before) && /[\s'";&|)>]/.test(after)) return true
  }
  return false
}

// A file this loop already has notes for, named in the command: by full path, by its path from a folder the
// command cds into, or by the end of its path (fixtures/big.log). Quoted paths with spaces count.
function notedIn(sid: string, agentId: string | undefined, cmd: string): { path: string; from: string } | null {
  const prefix = `${sid}\n${agentId ?? ''}\n`
  const cds = [...cmd.matchAll(/\bcd\s+(?:"([^"]+)"|'([^']+)'|([^\s;&|]+))/g)].map(m => (m[1] ?? m[2] ?? m[3]!).replace(/\/$/, ''))
  const words = cmd.split(/[\s'"=<>|;&()]+/).filter(w => w.includes('/') && !w.startsWith('/'))
  for (const [key, from] of noted) {
    if (!key.startsWith(prefix)) continue
    const path = key.slice(prefix.length)
    const named =
      mentions(cmd, path) ||
      cds.some(d => path.startsWith(`${d}/`) && mentions(cmd, path.slice(d.length + 1))) ||
      words.some(w => path.endsWith(`/${w.replace(/^\.\//, '')}`))
    if (named) return { path, from }
  }
  return null
}

// Line text without a line-number prefix (cat -n, grep -n, nl), so the same line matches either way.
const bare = (line: string) => line.replace(/^\s*\d+(?:[\t:|]|\s{2,})/, '').trim()

// Files the command names: absolute paths, ~/ paths, and paths under a folder the command cds into or the chat's
// folder. Only files that exist, at most 6.
async function namedFiles($: EngineInterface, cmd: string): Promise<string[]> {
  const words = [...cmd.matchAll(/'([^']+)'|"([^"]+)"|([^\s'";&|<>()]+)/g)].map(m => m[1] ?? m[2] ?? m[3]!)
  const full = (d: string) => (d.startsWith('~/') ? `${home}${d.slice(1)}` : d)
  const cds = [...cmd.matchAll(/\bcd\s+(?:"([^"]+)"|'([^']+)'|([^\s;&|]+))/g)].map(m => full((m[1] ?? m[2] ?? m[3]!).replace(/\/$/, '')))
  const bases = [...cds.filter(d => d.startsWith('/')), ...(cwd ? [cwd] : [])]
  // Windows: a drive path (C:/..., or Git Bash's /c/...) is absolute too.
  const abs = (p: string) => p.startsWith('/') || (win && /^[A-Za-z]:\//.test(p))
  if (win) bases.splice(0, bases.length, ...[...cds.map(slashed).filter(d => /^[A-Za-z]:\//.test(d)), ...(cwd ? [slashed(cwd)] : [])])
  const out: string[] = []
  for (const raw of words) {
    if (out.length >= 6) break
    if (raw.startsWith('-') || !/[/.]/.test(raw) || raw.includes('*')) continue
    const w = win ? slashed(full(raw)) : full(raw)
    for (const path of abs(w) ? [w] : bases.map(d => `${d}/${w.replace(/^\.\//, '')}`)) {
      if (out.includes(path) || !(await $.fs.exists(path).catch(() => false))) continue
      const st = await $.fs.stat(path).catch(() => null)
      if (st?.kind === 'file') out.push(path)
    }
  }
  return out
}

// Programs whose output keeps the file's lines in order: a line range can be read straight from the command.
const RANGE_PROGS = new Set(['cat', 'nl', 'sed', 'head', 'tail', 'awk', 'cut'])

// The line range a plain sed -n 'A,Bp', head -n N, tail -n N or awk 'NR>=A && NR<=B' prints, or the whole file
// for a plain cat or nl. null: some other shape.
function rangeIn(cmd: string, total: number): { from: number; to: number } | null {
  if (!programs(cmd).every(p => RANGE_PROGS.has(p) || HELPERS.has(p))) return null
  let from = 1
  let to = total
  let m: RegExpExecArray | null
  if ((m = /\bsed\s+-n\s+['"]?(\d+)(?:\s*,\s*(\d+|\$))?\s*p['"]?/.exec(cmd))) {
    from = Number(m[1])
    to = m[2] === undefined ? from : m[2] === '$' ? total : Number(m[2])
  } else if ((m = /\bawk\s+['"]\s*NR\s*>=?\s*(\d+)\s*&&\s*NR\s*<=?\s*(\d+)/.exec(cmd))) {
    from = Number(m[1])
    to = Number(m[2])
  } else if ((m = /\bhead\s+(?:-n\s*|-)(\d+)\b/.exec(cmd))) {
    to = Number(m[1])
  } else if ((m = /\btail\s+(?:-n\s*|-)(\+?)(\d+)\b/.exec(cmd))) {
    from = m[1] ? Number(m[2]) : total - Number(m[2]) + 1
  } else if (!programs(cmd).every(p => p === 'cat' || p === 'nl' || p === 'cut' || HELPERS.has(p))) {
    return null
  }
  from = Math.max(1, from)
  to = Math.min(total, to)
  return from <= to ? { from, to } : null
}

// The one file a shell print of part of a file comes from, and which of its lines it printed. A plain range is
// read from the command; anything else is matched line by line (each file line used once, so repeats do not
// overcount). The output must come mostly (half or more) from that file.
async function fromFile($: EngineInterface, files: readonly string[], cmd: string, text: string): Promise<{ path: string; lines: number[]; total: number } | null> {
  const outLines = text.split('\n').map(bare)
  const outCount = outLines.filter(Boolean).length
  if (outCount === 0) return null
  let best: { path: string; lines: number[]; total: number } | null = null
  for (const path of files) {
    const st = await $.fs.stat(path).catch(() => null)
    if (!st || st.size > FILE_READ_MAX) continue
    const body = String(await $.fs.read(path))
    if (body.includes('\u0000')) continue
    const fileLines = body.split('\n')
    const total = fileLines.length
    const range = files.length === 1 ? rangeIn(cmd, total) : null
    let lines: number[]
    let own = 1
    if (range) lines = lineRange(range.from, range.to - range.from + 1)
    else {
      const at = new Map<string, number[]>()
      fileLines.forEach((l, i) => {
        const b = bare(l)
        if (b) at.set(b, [...(at.get(b) ?? []), i + 1])
      })
      lines = []
      for (const o of outLines) {
        const free = o ? at.get(o) : undefined
        if (free && free.length > 0) lines.push(free.shift()!)
      }
      own = lines.length / outCount
    }
    if (own >= 0.5 && lines.length > (best?.lines.length ?? 0)) best = { path, lines, total }
  }
  return best
}

// Where a reader command sends its output to disk instead of the chat: curl -o / --output, wget -O, > and >>, tee.
function diskTargets(cmd: string) {
  // Quoted text is held aside (a > inside an awk or grep pattern is not a redirect) and put back in the targets.
  const quotes: string[] = []
  const flat = cmd
    .replace(/<<-?\s*(['"]?)(\w+)\1[^\n]*\n[\s\S]*?\n\s*\2\s*(?=\n|$)/g, '<<Q')
    .replace(/'[^']*'|"(?:[^"\\]|\\.)*"/g, q => `\u0001${quotes.push(q.slice(1, -1)) - 1}\u0001`)
  const word = String.raw`([^\s;&|<>]+)`
  const out: string[] = []
  for (const step of flat.split(/\|\||&&|[|;\n]/)) {
    const words = step.trim().split(/\s+/).filter(w => w && !/^[A-Za-z_][A-Za-z0-9_]*=/.test(w) && !STARTERS.has(w))
    const prog = baseName(words[0] ?? '')
    const found: RegExpMatchArray[] = []
    // -o is curl's and wget's output file; for grep and rg it means "only the match".
    if (prog === 'curl' || prog === 'wget') found.push(...step.matchAll(new RegExp(String.raw`(?:^|\s)(?:-o|--output|-O|--output-document)(?:\s+|=)` + word, 'g')))
    // A reader's output sent to a file. A heredoc step (cat > f <<EOF) writes a file; it reads nothing.
    if (READERS.has(prog) && !step.includes('<<')) found.push(...step.matchAll(new RegExp(String.raw`(?<![0-9&>])>>?\s*` + word, 'g')))
    if (prog === 'tee') found.push(...step.matchAll(new RegExp(String.raw`\btee\s+(?:-a\s+)?` + word, 'g')))
    out.push(...found.map(m => m[1]!.replace(/\u0001(\d+)\u0001/g, (_, n: string) => quotes[Number(n)] ?? '')))
  }
  return out.filter(t => t && t !== '-' && !t.startsWith('/dev/'))
}

// A big output from a command that is not a file or API read (python3, node, git, a build): left alone, logged.
async function passOther($: EngineInterface, cmd: string, ran: ToolOut) {
  const r = ran.result as BashOut | undefined
  if (!r || typeof r.stdout !== 'string') return
  const size = r.persistedOutputPath ? Math.round(((await $.fs.stat(r.persistedOutputPath).catch(() => null))?.size ?? 0) / 4) : tokens(r.stdout)
  const progs = [...new Set(programs(cmd).filter(p => !HELPERS.has(p)))]
  if (progs.some(p => SCRIPTS.test(p))) await pass($, size, `unrouted script read (~${fmt(size)} tokens, ${progs.join(', ')}): ${clip(cmd, 200)}`)
  else if (findStyle(cmd)) await pass($, size, `find-style grep (~${fmt(size)} tokens, ${progs.join(', ')}): ${clip(cmd, 200)}`)
  else await pass($, size, `Bash output left alone (~${fmt(size)} tokens), not a file or API read (${progs.join(', ') || 'no program found'}): ${clip(cmd, 200)}`)
}

// A reader command that wrote its output to a file: nothing came into the chat, so the log says where it went.
async function logDiskWrite($: EngineInterface, cmd: string) {
  for (const target of diskTargets(cmd)) {
    const st = target.startsWith('/') || (win && /^[A-Za-z]:[\\/]/.test(target)) ? await $.fs.stat(win ? slashed(target) : target).catch(() => null) : null
    const size = st ? `, ~${fmt(Math.round(st.size / 4))} tokens` : ''
    await log($, 'file', 'pass', `Bash output written to disk (${target}${size}), not into the chat: ${clip(cmd, 200)}`)
  }
}

function outputSource(saved: string, cmd: string, text: string): Source {
  const all = toLines(text, 1)
  const { kept, gap } = fit(all)
  const label = clip(cmd.replace(/\s+/g, ' ').trim(), 80)
  return {
    path: saved,
    kind: 'text',
    title: `Output of the shell command \`${clip(cmd, 400)}\`, saved at ${saved}`,
    about: `Command output, ${fmt(all.length)} lines. ${gap || `Haiku read all ${fmt(all.length)} lines.`} Refs like L120-L140 are line numbers in the saved output.`,
    covers: gap ? 'These notes cover every line Haiku read' : 'These notes cover the whole output',
    exact: `The full output is saved at ${saved}. Read exact lines of it (Read with offset and limit) only when you must quote exact text${gap ? ', or for the lines Haiku skipped' : ''}. Short ranges like that pass through untouched.`,
    full: saved,
    chunks: chunk(kept),
    label,
    where: cmd,
    tool: 'Bash',
    noun: 'output',
  }
}

// What Claude gets in place of the command's output: a Bash result with the notes as its output.
const bashAnswer = (r: BashOut, text: string) => ({
  result: { ...r, stdout: text, stderr: '', persistedOutputPath: undefined, persistedOutputSize: undefined, rawOutputPath: undefined },
})

async function bashPart(
  $: EngineInterface,
  e: { tool_use_id?: string; agentId?: string; command: string },
  ran: ToolOut & { context?: readonly string[] },
  signal: AbortSignal,
  held: { card?: Card },
): Promise<unknown> {
  const r = ran.result as BashOut | undefined
  const cmd = e.command
  if (!r || typeof r.stdout !== 'string') return ran
  if (r.interrupted || r.isImage || r.backgroundTaskId || r.returnCodeInterpretation) {
    const why = r.interrupted ? 'interrupted' : r.isImage ? 'an image' : r.backgroundTaskId ? 'moved to the background' : `exit status note (${r.returnCodeInterpretation})`
    await pass($, tokens(r.stdout), `Bash output left alone, ${why}: ${clip(cmd, 200)}`)
    return ran
  }
  if (!isReader(cmd)) return ran
  await logDiskWrite($, cmd)
  // Guard C: grep -l, grep -c, rg --files: it finds where things are and reads nothing.
  if (findStyle(cmd)) {
    const size = r.persistedOutputPath ? Math.round(((await $.fs.stat(r.persistedOutputPath).catch(() => null))?.size ?? 0) / 4) : tokens(r.stdout)
    await pass($, size, `find-style grep (~${fmt(size)} tokens): ${clip(cmd, 200)}`)
    return ran
  }
  let text = r.stdout
  if (r.persistedOutputPath) {
    const st = await $.fs.stat(r.persistedOutputPath)
    if (st.size > FILE_READ_MAX) {
      await log($, 'file', 'pass', `Bash output is ${st.size} bytes, over the read limit: ${clip(cmd, 200)}`)
      return ran
    }
    text = String(await $.fs.read(r.persistedOutputPath))
  }
  const files = await namedFiles($, cmd)
  // Guard B: a skill, CLAUDE.md, AGENTS.md, memory or settings file reaches Claude word for word.
  const rule = files.find(isInstruction)
  if (rule) {
    await pass($, tokens(text), `${rule}: instruction file, passed word for word: ${clip(cmd, 200)}`)
    return ran
  }
  const big = Boolean(r.persistedOutputPath) || text.length >= BASH_MIN_CHARS
  // A plain print of part of one file (sed -n, head, tail, awk NR, cat -n | sed): a piece, as a ranged Read is.
  // A whole `cat` of a big file gets the file notes further down.
  const src = programs(cmd).every(p => RANGE_PROGS.has(p) || HELPERS.has(p)) ? await fromFile($, files, cmd, text) : null
  if (src && !(big && catFile(cmd) === src.path)) {
    const got = await piece($, { ...e, file_path: src.path }, { lines: src.lines, total: src.total, text, what: `shell print of ${fmt(src.lines.length)} lines` }, 'Bash', signal)
    if ('notes' in got) return bashAnswer(r, got.notes)
    const from = noted.get(notedKey(await sessionId($), e.agentId, src.path))
    const line = got.context ?? (from && src.lines.length >= REMIND_LINES ? remindLine(src.path, from) : null)
    if (line) await log($, 'file', 'reminder', `Bash re-read of ${src.path}: ${clip(cmd, 200)}`)
    return line ? { ...ran, context: [...(ran.context ?? []), line] } : ran
  }
  // A shell read of a file whose notes are already in this loop: a long one gets the reminder.
  const hit = notedIn(await sessionId($), e.agentId, cmd)
  if (hit && !big && !(catFile(cmd) === hit.path)) {
    if (text.split('\n').length < REMIND_LINES) return ran
    await log($, 'file', 'reminder', `Bash re-read of ${hit.path}: ${clip(cmd, 200)}`)
    return { ...ran, context: [...(ran.context ?? []), remindLine(hit.path, hit.from)] }
  }
  if (!big) {
    await pass($, tokens(text), `Bash output under the limit (~${fmt(tokens(text))} tokens, limit ${fmt(MIN_TOKENS)}): ${clip(cmd, 200)}`)
    return ran
  }
  if (text.includes('\u0000')) {
    await log($, 'file', 'pass', `Bash output is binary: ${clip(cmd, 200)}`)
    return ran
  }

  // JSON (curl of an API): the connector part's trim, then Haiku.
  if (parseOne(text) !== undefined) {
    if (!(await partOn($, 'connector'))) {
      await log($, 'connector', 'pass', `Bash JSON output left alone, the connector part is off: ${clip(cmd, 200)}`)
      return ran
    }
    const plainRan = { result: text }
    const out = (await connector($, { tool_use_id: e.tool_use_id, command: cmd, ...(e.agentId !== undefined && { agentId: e.agentId }) }, 'Bash', plainRan, signal, held, {
      label: clip(cmd.replace(/\s+/g, ' ').trim(), 80),
      where: cmd,
      tool: 'Bash',
    })) as ToolOut
    return out === plainRan ? ran : bashAnswer(r, String(out.result))
  }

  if (!(await partOn($, 'file'))) {
    await log($, 'file', 'pass', `Bash output left alone, the file part is off: ${clip(cmd, 200)}`)
    return ran
  }
  if (await takeFull($)) {
    await log($, 'file', 'full', `Bash: ${clip(cmd, 200)}`)
    return ran
  }
  const before = tokens(text)

  // `cat /abs/file`: notes on the file itself, shared with Read (kept in memory and on disk). Core has
  // usually saved the output too (it saves anything over about 30,000 characters); the file is the source.
  const file = catFile(cmd)
  if (file) {
    const out = await fileNotes($, { ...e, file_path: file }, before, 'Bash', signal, `whole cat over the limit (~${fmt(before)} tokens, limit ${fmt(MIN_TOKENS)})`)
    return out === null ? ran : bashAnswer(r, out)
  }
  const task = await purpose($, e.agentId)

  // Any other read: save the whole output, and give notes on it. A Read of the saved file reuses these notes.
  const saved = `${home}/.claude/mods-logs/${NAME}/results/${stamp(await $.clock.now())}-bash-${safe(programs(cmd).find(p => READERS.has(p)) ?? 'out')}-${hash(cmd)}.txt`
  await $.fs.write(saved, text)
  const stat = await $.fs.stat(saved)
  const key = notesKey(saved, stat, task)
  const got = await notesFor($, saved, key, () => makeNotes($, outputSource(saved, cmd, text), before, clip(cmd.replace(/\s+/g, ' ').trim(), 80), signal, task))
  if (!got) return ran
  return bashAnswer(r, await recordFile($, { ...e, file_path: saved, tool: 'Bash' }, { ...got.notes, before }, got.how))
}

// ============================================================================
// Pane
// ============================================================================

const MASCOT_PX = 56

// The Haiku reader: a round teal reader with glasses and a sprout, holding a page. Smooth shapes, not pixel
// rects, so it never reads as Helper Desk's crab. It moves (eyes scan, page bobs, sprout sways) only while
// Haiku is working; at rest it stands still.
function mascotSvg(working: boolean) {
  const motion = working
    ? `<style>
.eye{animation:scan 1.4s ease-in-out infinite}
.pg{animation:bob 1.4s ease-in-out infinite}
.sp{animation:sway 2.8s ease-in-out infinite;transform-origin:32px 12px}
.ln{animation:glow 1.4s ease-in-out infinite}.l2{animation-delay:-.45s}.l3{animation-delay:-.9s}
@keyframes scan{0%,100%{transform:translateX(-1.6px)}50%{transform:translateX(1.6px)}}
@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(-1.4px)}}
@keyframes sway{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
@keyframes glow{0%,100%{opacity:.35}50%{opacity:.9}}
@media (prefers-reduced-motion: reduce){.eye,.pg,.sp,.ln{animation:none}}
</style>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${MASCOT_PX}" height="${MASCOT_PX}">${motion}
<g class="sp"><path d="M32 13 C31 9 28 6 24 6 C25 10 28 12 32 13 Z" fill="${HAIKU}"/><path d="M32 13 C33 8 37 5 41 6 C39 10 36 12 32 13 Z" fill="${HAIKU_DARK}"/><rect x="31.2" y="12" width="1.6" height="5" rx=".8" fill="${HAIKU_DARK}"/></g>
<ellipse cx="25" cy="58.5" rx="5" ry="2.6" fill="${HAIKU_DARK}"/><ellipse cx="39" cy="58.5" rx="5" ry="2.6" fill="${HAIKU_DARK}"/>
<circle cx="32" cy="35" r="20" fill="${HAIKU}"/>
<circle cx="24.5" cy="30" r="6.2" fill="#ffffff" stroke="${HAIKU_DARK}" stroke-width="2.2"/><circle cx="39.5" cy="30" r="6.2" fill="#ffffff" stroke="${HAIKU_DARK}" stroke-width="2.2"/>
<path d="M30.7 30 Q32 28.6 33.3 30" fill="none" stroke="${HAIKU_DARK}" stroke-width="2"/>
<g class="eye"><circle cx="24.5" cy="31" r="2.2" fill="#10302b"/><circle cx="39.5" cy="31" r="2.2" fill="#10302b"/></g>
<g class="pg"><rect x="17" y="40" width="30" height="17" rx="2.2" fill="#ffffff" stroke="${HAIKU_DARK}" stroke-width="1.6"/>
<rect class="ln" x="21" y="44" width="22" height="2" rx="1" fill="${HAIKU}" opacity=".6"/><rect class="ln l2" x="21" y="48" width="18" height="2" rx="1" fill="${HAIKU}" opacity=".6"/><rect class="ln l3" x="21" y="52" width="20" height="2" rx="1" fill="${HAIKU}" opacity=".6"/>
<circle cx="17.5" cy="48" r="3.2" fill="${HAIKU_DARK}"/><circle cx="46.5" cy="48" r="3.2" fill="${HAIKU_DARK}"/></g>
</svg>`
}

// Which tool the hand-off came from. Cards from before 2026-11-03 have no tool: Read or connector.
const toolOf = (c: Card) => {
  const t = c.tool ?? (c.part === 'file' ? 'Read' : 'connector')
  return t === 'connector' ? 'Connector' : t
}
const clockOf = (ms: number) => new Date(ms).toTimeString().slice(0, 5)
const usdText = (usd: number | null) => (usd === null ? 'cost unknown' : `$${usd < 0.01 ? usd.toFixed(4) : usd.toFixed(3)}`)
const fileUrl = (path: string) => `file://${encodeURI(path)}`
const cutText = (text: string, n: number) => (text.length > n ? `${text.slice(0, Math.max(0, n - 1))}…` : text)

// ============================================================================
// Hooks
// ============================================================================

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    home = $.plugin.root.replace(/\\/g, '/').split('/.claude/')[0] ?? ''
    await isWin($)
    try {
      await $.command.register({
        name: 'input-router',
        description: 'Input Router. No argument: what it did in this chat. full: let the next big input through whole. off/on file|connector. pane: show the Haiku pane',
        argumentHint: '[full | pane | off <file|connector> | on <file|connector>]',
        immediate: true,
      })
    } catch (err) {
      await log($, 'mod', 'command not registered', err)
    }
    currentSid = await sessionId($)
    if (typeof e.cwd === 'string') cwd = e.cwd
    await readSwitch($)
    await loadCards($)
    if (!polling) {
      polling = true
      $.clock.every(3000, () => {
        void readSwitch($)
          .then(() => checkOpen($))
          .catch(() => undefined)
      })
    }
    return next(e)
  })

  // ---------- file ----------
  on('tool.call', { tool: 'Read' }, async ($, e, next) => {
    if (!(await partOn($, 'file'))) return next(e)
    const ext = extOf(e.file_path)
    // Image files belong to Efficient Browser Use; notebooks keep their cells.
    if (IMAGE_EXT.has(ext) || ext === 'ipynb') return next(e)
    // Guard B: skills, CLAUDE.md, AGENTS.md, memory, settings and switches reach Claude word for word.
    if (isInstruction(e.file_path)) {
      const ran = await next(e)
      const text = typeof ran.text === 'string' ? ran.text : ''
      await pass($, tokens(text), `${e.file_path}: instruction file, passed word for word`)
      return ran
    }
    // Core's saved tool results (tool-results/) are routed like any file, so subagents paging through them are
    // counted by the piece counter too.

    if (e.agentId === undefined && fullNext.size > 0 && (await wouldRoute($, e, ext)) && (await takeFull($))) {
      await log($, 'file', 'full', e.file_path)
      if (ext === 'pdf' || e.offset !== undefined || e.limit !== undefined) return next(e)
      // Core keeps a record of the read it ran under the notes; another limit stops it answering "unchanged".
      return next({ ...e, allow_large: true, ...(routed.has(e.file_path) && { offset: 1, limit: 10_000_000 }) })
    }

    if (ext === 'pdf') {
      const stat = await $.fs.stat(e.file_path)
      const task = await purpose($, e.agentId)
      const key = notesKey(e.file_path, stat, task, `|${e.pages ?? ''}`)
      const input = { file_path: e.file_path, ...(e.pages !== undefined && { pages: e.pages }) }
      let checked = false
      const got = await notesFor($, e.file_path, key, async () => {
        const plan = await pdfSource($, e.file_path, e.pages, stat.mtimeMs)
        if (!plan) return null
        // The notes skip core, and with it the permission prompt: answer only a read that would run unasked.
        const check = await $.tool.check({ tool: 'Read', input })
        checked = true
        if (check.decision !== 'allow') {
          await log($, 'file', 'pass', `${e.file_path}: permission check said ${check.decision}${check.reason ? ` (${check.reason})` : ''}, so core answers`)
          return null
        }
        return makeNotes($, plan.src, plan.before, plan.label, next.signal, task)
      })
      if (!got) return next(e)
      if (!checked && (await $.tool.check({ tool: 'Read', input })).decision !== 'allow') return next(e)
      routed.add(e.file_path)
      if (got.how === 'fresh') await saveNotes($, e.file_path, key, got.notes)
      return answer(e.file_path, await recordFile($, e, got.notes, got.how))
    }

    // A range Claude chose. Core runs first. A range that covers the whole file is a whole read. Any other range
    // is a piece: guard A, the piece counter and the limit decide (see piece()).
    if (e.offset !== undefined || e.limit !== undefined || e.pages !== undefined) {
      let ran = await next(e)
      // Core may take offset 1 for the whole read under the notes and answer "unchanged": ask for the lines.
      if (routed.has(e.file_path) && e.limit === undefined && ran.isError !== true && ran.result?.type === 'file_unchanged') {
        ran = await next({ ...e, limit: READ_LINES })
      }
      if (ran.deny !== undefined || ran.isError === true || ran.result === undefined) return ran
      const r = ran.result
      // The same range again, after this mod answered it with notes: core's "unchanged" points at those notes.
      if (r.type === 'file_unchanged') return routedRanges.has(rangeKey(e)) ? answer(r.file.filePath, UNCHANGED(e.file_path)) : ran
      if (r.type !== 'text' || e.pages !== undefined) return ran
      try {
        const total = r.file.totalLines ?? r.file.numLines
        const start = r.file.startLine ?? e.offset ?? 1
        const text = ran.text ?? r.file.content
        if ((e.offset ?? 1) <= 1 && r.file.numLines >= total) {
          const out = await wholeRead($, e, ran, r.file.filePath, text, 'whole range', next.signal)
          if (out !== ran) routedRanges.add(rangeKey(e))
          return out
        }
        const what = `ranged read, lines ${start}-${start + r.file.numLines - 1} of ${total}`
        const got = await piece($, e, { lines: lineRange(start, r.file.numLines), total, text, what }, 'Read', next.signal)
        if ('notes' in got) {
          routedRanges.add(rangeKey(e))
          return answer(r.file.filePath, got.notes)
        }
        const line = got.context ?? (await remind($, e, ran as ToolOut))
        return line ? { ...ran, context: [...(ran.context ?? []), line] } : ran
      } catch (err) {
        await log($, 'file', 'ranged read', err)
        return ran
      }
    }

    // Core runs first: the permission check, and the record of the read that Edit looks for.
    const ran = await next(e)
    if (ran.deny !== undefined || ran.isError === true || ran.result === undefined) return ran
    const r = ran.result
    if (r.type === 'file_unchanged') return routed.has(e.file_path) ? answer(r.file.filePath, UNCHANGED(e.file_path)) : ran
    if (r.type !== 'text') return ran
    return wholeRead($, e, ran, r.file.filePath, ran.text ?? r.file.content, 'whole read', next.signal)
  }).catch(($, e, next) => next(e))

  // ---------- Bash: file reads and API calls through the shell ----------
  on('tool.call', { tool: 'Bash' }, async ($, e, next) => {
    if (e.run_in_background || !((await partOn($, 'file')) || (await partOn($, 'connector')))) return next(e)
    const reader = isReader(e.command)
    const ran = await next(e)
    if (off || ran.deny !== undefined || ran.isError === true) return ran
    // The command has run: from here a failure hands back its output, never a second run.
    const held: { card?: Card } = {}
    try {
      if (!reader) {
        // A reader piped on to a writer (curl ... | tee file) sent its output to disk.
        if (programs(e.command).some(p => READERS.has(p))) await logDiskWrite($, e.command)
        await passOther($, e.command, ran as ToolOut)
        return ran
      }
      return (await bashPart($, e, ran as ToolOut, next.signal, held)) as typeof ran
    } catch (err) {
      await log($, 'file', 'Bash failed, plain output sent', err)
      await status($, undefined)
      return ran
    } finally {
      if (held.card?.phase === 'working') await setCard($, held.card, { phase: 'failed', state: 'Something broke, so Claude got the plain output' })
    }
  }).catch(($, e, next) => next(e))

  // ---------- connector ----------
  on('tool.call', async ($, e, next) => {
    const tool = String(e.tool)
    if (!tool.startsWith('mcp__') || SKIP_SERVER.test(tool) || SKIP_TOOL.test(tool) || !(await partOn($, 'connector'))) return next(e)
    const ran = await next(e)
    if (off || ran.deny !== undefined || ran.isError) return ran
    // The tool has run: from here a failure hands back its result, never a second run (the .catch would repeat it).
    const held: { card?: Card } = {}
    try {
      return (await connector($, e as unknown as Record<string, unknown> & { tool_use_id?: string }, tool, ran as ToolOut, next.signal, held)) as typeof ran
    } catch (err) {
      await log($, 'connector', 'failed, plain result sent', err)
      await status($, undefined)
      return ran
    } finally {
      if (held.card?.phase === 'working') await setCard($, held.card, { phase: 'failed', state: 'Something broke, so Claude got the plain result' })
    }
  }).catch(($, e, next) => next(e))

  // ---------- pane ----------
  // The person's close mark (X) or key: hidden in this chat, like Hide, so the next hand-off does not pop it back.
  // The close itself always goes on.
  on('ui.close', async ($, e, next) => {
    if (e.id === PANE && e.origin.kind === 'person') {
      try {
        hiddenIn.add(await sessionId($))
        void Promise.resolve()
          .then(() => $.ui.toast(`${PANE_TITLE} closed in this chat. Type /input-router pane, or press Open in /mods, to show it again.`))
          .catch(() => undefined)
      } catch {
        // The pane closes anyway.
      }
    }
    return next(e)
  })

  on('ui.press', { plugin: NAME, element: 'hide' }, async ($, e) => {
    hiddenIn.add(await sessionId($))
    await $.ui.close({ id: PANE }).catch(() => undefined)
    void Promise.resolve()
      .then(() => $.ui.toast(`${PANE_TITLE} hidden in this chat. Type /input-router pane, or press Open in /mods, to show it again.`))
      .catch(() => undefined)
    return { element: e.element }
  })

  on('ui.press', { plugin: NAME }, async ($, e, next) => {
    if (!e.element.startsWith('notes-')) return next(e)
    const id = e.element.slice('notes-'.length)
    const { value: open = '' } = await $.state.get(OPEN)
    await $.state.set(OPEN, open === id ? '' : id)
    return { element: e.element }
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e, next) => {
    const { value: isOff = false } = await $.state.get(OFF)
    if (isOff || off) return next(e)
    const els = $.ui.resolve(e)
    const { Box, Text, Button } = els
    // Svg and Markdown draw on desktop, the editor and mobile; the terminal gets text.
    const Svg = e.surface !== 'terminal' && 'Svg' in els ? els.Svg : null
    const Markdown = e.surface !== 'terminal' && 'Markdown' in els ? els.Markdown : null
    const sid = await sessionId($)
    const { value: all = [] } = await $.state.get(CARDS)
    const list = (sid ? all.filter(c => c.session === sid) : all).slice().reverse()
    const { value: openId = '' } = await $.state.get(OPEN)
    const width = Math.max(32, e.props.bodyColumns)
    const cw = width - 4
    const working = list.some(c => c.phase === 'working')
    const handed = list.filter(c => c.phase !== 'kept')
    const before = list.reduce((s, c) => s + (c.after === null ? 0 : c.before), 0)
    const after = list.reduce((s, c) => s + (c.after ?? 0), 0)
    const usd = handed.some(c => c.usd !== null) ? handed.reduce((s, c) => s + (c.usd ?? 0), 0) : null
    const summary = list.length
      ? [`${list.length} in this chat`, after ? `${fmt(before)} to ${fmt(after)} tokens` : '', handed.length ? `Haiku ${usdText(usd)}` : ''].filter(Boolean).join(' · ')
      : 'Nothing handed to Haiku yet'

    const mascot = Svg ? (
      <Box key="mascot" width={9} flexShrink={0}>
        <Svg source={mascotSvg(working)} alt={working ? 'Haiku reader, teal, reading' : 'Haiku reader, teal, resting'} width={MASCOT_PX} height={MASCOT_PX} />
      </Box>
    ) : (
      <Box key="mascot" width={7} flexShrink={0} flexDirection="column">
        <Text color={HAIKU}>{working ? '(o_o)' : '(-_-)'}</Text>
        <Text color={HAIKU}>{' [≡] '}</Text>
      </Box>
    )

    const card = (c: Card) => {
      const live = c.phase === 'working'
      const isOpen = openId === c.id
      const mark = live ? '●' : c.phase === 'done' ? '✓' : c.phase === 'failed' ? '✗' : '↺'
      const markColor = live ? HAIKU : c.phase === 'failed' ? BAD : c.phase === 'done' ? GOOD : undefined
      const stateColor = live ? HAIKU : c.phase === 'failed' ? BAD : c.phase === 'done' ? GOOD : undefined
      const secs = c.endedAt ? Math.max(0, Math.round((c.endedAt - c.startedAt) / 1000)) : 0
      const numbers = [
        c.after === null ? `${fmt(c.before)} tokens in` : `${fmt(c.before)} to ${fmt(c.after)} tokens`,
        c.requests ? `${c.requests} Haiku request${c.requests === 1 ? '' : 's'} · ${usdText(c.usd)}` : 'no Haiku call',
        clockOf(c.startedAt),
      ].join(' · ')
      const state = c.phase === 'done' || c.phase === 'failed' ? `${c.state} (${secs}s)` : c.state
      const links = [c.detail ? `[Open detail file](${fileUrl(c.detail)})` : '', c.full ? `[Open full result](${fileUrl(c.full)})` : ''].filter(Boolean).join('  ·  ')
      return (
        <Box
          key={`card-${c.id}`}
          flexDirection="column"
          width={width}
          marginBottom={1}
          borderStyle="round"
          borderColor={live ? HAIKU : undefined}
          borderDimColor={!live}
          paddingX={1}
        >
          <Box flexDirection="row" justifyContent="space-between" width={cw}>
            <Box width={cw - 2}>
              <Text wrap="truncate-end">
                <Text bold color={HAIKU}>{`${toolOf(c)}  `}</Text>
                <Text bold>{cutText(c.label, cw - 14)}</Text>
              </Text>
            </Box>
            <Text bold color={markColor}>{mark}</Text>
          </Box>
          <Text dimColor wrap="truncate-end">
            {cutText(c.where, cw)}
          </Text>
          <Text wrap="truncate-end">{numbers}</Text>
          <Text bold={live} color={stateColor} wrap="truncate-end">
            {state}
          </Text>
          {links && Markdown ? <Markdown key={`links-${c.id}`} text={links} /> : null}
          {links && !Markdown ? (
            <Text dimColor wrap="truncate-end">
              {[c.detail, c.full].filter(Boolean).join('  ')}
            </Text>
          ) : null}
          {c.notes ? (
            <Button key={`notes-${c.id}`} plain dimColor onPress={() => undefined}>
              {isOpen ? '▾ Hide the notes' : '▸ Show the notes Claude got'}
            </Button>
          ) : null}
          {isOpen && c.notes ? (
            <Box key={`text-${c.id}`} flexDirection="column" width={cw} marginTop={1}>
              <Text wrap="wrap">{c.notes.length > DRAW_NOTES_MAX ? `${c.notes.slice(0, DRAW_NOTES_MAX)}\n[cut here: open the detail file for the rest]` : c.notes}</Text>
            </Box>
          ) : null}
        </Box>
      )
    }

    return (
      <Box flexDirection="column" width={width}>
        <Box key="header" flexDirection="row" gap={1} width={width} marginBottom={1}>
          {mascot}
          <Box flexDirection="column" flexGrow={1}>
            <Box flexDirection="row" justifyContent="space-between">
              <Text bold color={working ? HAIKU : undefined}>
                {working ? 'Haiku is reading' : PANE_TITLE}
              </Text>
              <Button key="hide" label="Hide" dimColor onPress={() => undefined} />
            </Box>
            <Text dimColor wrap="wrap">
              {summary}
            </Text>
          </Box>
        </Box>
        {list.length ? null : <Text dimColor>A card shows up here each time a big file or connector result goes to Haiku.</Text>}
        {list.map(card)}
      </Box>
    )
  })

  // ---------- command ----------
  on('command.run', { command: 'input-router' }, async ($, e) => {
    await readSwitch($)
    if (off) return { text: `${TITLE} is off. Turn it on with /mods.` }
    const sid = await sessionId($)
    const words = e.args.trim().toLowerCase().split(/\s+/).filter(Boolean)
    const [verb, what] = words
    if (!verb) return { text: await statusText($) }
    if (verb === 'full') {
      fullNext.add(sid)
      return { text: `${TITLE}: the next big input in this chat (a file or a connector result) comes through whole, once.` }
    }
    if (verb === 'pane') {
      hiddenIn.delete(sid)
      if (globalHidden) return { text: `${TITLE}: the pane is hidden in every chat. Press Shown in /mods, or remove "${NAME}:hidden" from switches.json, to show it.` }
      const opened = await showPane($, '/input-router pane').catch(async err => {
        await log($, 'mod', 'pane open', err)
        return null
      })
      if (opened === null) return { text: `${TITLE}: the pane did not open. The reason is in ~/.claude/mods-logs/${NAME}.log.` }
      const count = cards.filter(c => c.session === sid).length
      if (!opened.isPlaced) return { text: `${TITLE}: the pane is open but not drawn yet (${opened.reason}).` }
      return { text: `${TITLE}: pane opened with ${count} card${count === 1 ? '' : 's'} from this chat. New cards show up when Haiku reads a big file or connector result.` }
    }
    if ((verb === 'off' || verb === 'on') && what !== undefined && REMOVED.has(what)) {
      return { text: `${TITLE}: the web part was removed on 2026-11-03. Input Router has two parts now: file and connector.` }
    }
    if ((verb === 'off' || verb === 'on') && what !== undefined && PART_WORDS[what]) {
      const part = PART_WORDS[what]!
      const set = chatOff.get(sid) ?? new Set<Part>()
      if (verb === 'off') set.add(part)
      else set.delete(part)
      if (set.size) chatOff.set(sid, set)
      else chatOff.delete(sid)
      const global = verb === 'on' && globalOff.has(part) ? ` It is still off in every chat: switches.json has "${NAME}:${part}": false.` : ''
      return { text: `${TITLE}: the ${part} part is ${verb} in this chat.${global}` }
    }
    return { text: `${TITLE}: unknown "${e.args.trim()}". Use /input-router, /input-router full, /input-router pane, or /input-router off file (or connector) and on to undo.\n\n${await statusText($)}` }
  })
}
