// The Efficient Browser Use pane: one card per picture the mod shrank. It shows the tool, the
// original size, the new size and the tokens before and after, with a small copy of the new picture
// on the newest cards. One small card per tool call says how many pictures it left alone, and why.
// A running total for the chat sits on top. A card opens to the note Claude got.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'
import type { ShotCard, Totals } from '../types'
import { cameraSvg } from './mascot.ts'

type On = Parameters<Register>[0]

const NAME = 'efficient-browser-use'
export const PANE = 'efficient-browser-use'
export const PANE_TITLE = 'Efficient Browser Use'
// Left-alone cards give way first, so a long browser task never pushes a shrunk card out.
const MAX_CARDS = 60
// Only the newest few shrunk pictures keep a small copy, so the pane stays light.
const MAX_THUMBS = 3
// The mascot keeps moving this long after a shrink, so a fast one still shows.
const BUSY_MS = 2000

const ACCENT = '#d97757'
const GOOD = '#16a34a'

const EMPTY: Totals = { seen: 0, images: 0, before: 0, after: 0, pasted: 0 }

const shotsAtom = atom({ plugin: 'efficient-browser-use', key: 'shots' } as const, [] as ShotCard[], { shape: 'shots-1' })
// Totals kept before "seen" was counted come back without it: whole() fills it in.
const totalsAtom = atom({ plugin: 'efficient-browser-use', key: 'totals' } as const, EMPTY, { shape: 'totals-1' })
const thumbsAtom = atom({ plugin: 'efficient-browser-use', key: 'thumbs' } as const, {} as Record<string, string>, { shape: 'thumbs-1' })
const openAtom = atom({ plugin: 'efficient-browser-use', key: 'open' } as const, [] as string[], { shape: 'open-1' })
const busyAtom = atom({ plugin: 'efficient-browser-use', key: 'busy' } as const, false)
const offAtom = atom({ plugin: 'efficient-browser-use', key: 'off' } as const, false)

// Module variables start over on a reload; the cards live in $.state.
let seq = 0
let busyGen = 0
// The person closed the pane: the mod stops opening it by itself until it is asked to.
let closed = false
// switches.json says "efficient-browser-use:hidden": the mod never opens the pane by itself.
let switchHidden = false

export function resetPane() {
  seq = 0
  busyGen = 0
  closed = false
  switchHidden = false
}

export function setSwitchHidden(hidden: boolean) {
  switchHidden = hidden
}

/** asked: the person asked for the pane (a command, or Open in /mods). That always opens it. */
export async function openPane($: EngineInterface, asked = false) {
  if (asked) closed = false
  else if (closed || switchHidden) return
  try {
    await $.ui.open({ id: PANE, title: PANE_TITLE })
  } catch {
    // The pane is a nicety: the shrinking never waits on it.
  }
}

export async function closePane($: EngineInterface) {
  try {
    await $.ui.close({ id: PANE })
  } catch {
    // Not open.
  }
}

export async function setOff($: EngineInterface, off: boolean) {
  await update($, offAtom, () => off)
}

/** The mascot moves now, and stops BUSY_MS after the last call with false. */
export async function setBusy($: EngineInterface, busy: boolean) {
  const gen = ++busyGen
  if (busy) {
    await update($, busyAtom, () => true)
    return
  }
  $.clock.after(BUSY_MS, () => {
    if (gen === busyGen) void update($, busyAtom, () => false).catch(() => undefined)
  })
}

const whole = (t: Partial<Totals> | undefined): Totals => ({ ...EMPTY, ...(t ?? {}) })

export async function loadTotals($: EngineInterface): Promise<Totals> {
  return whole(await read($, totalsAtom))
}

export async function setTotals($: EngineInterface, totals: Totals) {
  await update($, totalsAtom, () => ({ ...totals }))
}

/** Drops the oldest left-alone cards first, then the oldest of the rest. The list is newest first. */
export function trim(list: ShotCard[]): ShotCard[] {
  const out = [...list]
  for (let i = out.length - 1; out.length > MAX_CARDS && i >= 0; i--) if (out[i]!.action === 'left alone') out.splice(i, 1)
  return out.slice(0, MAX_CARDS)
}

/**
 * Adds one tool call's cards in one write, in the order the pictures came. One write per call:
 * a card can never be lost to another write made in the same call. Returns the new ids.
 */
export async function addShots($: EngineInterface, cards: Array<Omit<ShotCard, 'id' | 'at'>>): Promise<string[]> {
  if (cards.length === 0) return []
  const at = await $.clock.now()
  const list = (await read($, shotsAtom)) ?? []
  seq = Math.max(seq, ...list.map(c => Number(c.id) || 0))
  const made = cards.map(c => ({ ...c, id: String(++seq), at }))
  await update($, shotsAtom, l => trim([...[...made].reverse(), ...(l ?? [])]))
  return made.map(c => c.id)
}

/** Shrunk cards the ledger has and the pane lost: added back, so the pane matches the ledger. */
export async function restoreShots($: EngineInterface, rows: Array<Omit<ShotCard, 'id'>>): Promise<number> {
  const list = (await read($, shotsAtom)) ?? []
  const have = new Map<string, number>()
  for (const c of list) if (c.toolUseId && c.action !== 'left alone') have.set(c.toolUseId, (have.get(c.toolUseId) ?? 0) + 1)
  const missing: Array<Omit<ShotCard, 'id'>> = []
  for (const r of rows) {
    const key = r.toolUseId ?? ''
    const n = have.get(key) ?? 0
    if (key && n > 0) have.set(key, n - 1)
    else missing.push(r)
  }
  if (missing.length === 0) return 0
  seq = Math.max(seq, ...list.map(c => Number(c.id) || 0))
  const made = missing.map(c => ({ ...c, id: String(++seq) }))
  await update($, shotsAtom, l => trim([...(l ?? []), ...made].sort((a, b) => b.at - a.at || Number(b.id) - Number(a.id))))
  return made.length
}

/** Keeps the small copy of the newest MAX_THUMBS shrunk pictures, apart from the cards. */
export async function setThumb($: EngineInterface, id: string, thumb: string) {
  await update($, thumbsAtom, m => {
    const next = { ...(m ?? {}), [id]: thumb }
    const keep = Object.keys(next)
      .sort((a, b) => Number(b) - Number(a))
      .slice(0, MAX_THUMBS)
    return Object.fromEntries(keep.map(k => [k, next[k]!]))
  })
}

// ---------- words ----------

/** A plain name for the tool that made the picture. */
export function toolName(tool: string): string {
  if (/Claude_Browser/i.test(tool)) return 'Built-in browser'
  if (/claude-in-chrome/i.test(tool)) return 'Chrome'
  if (/playwright/i.test(tool)) return 'Playwright'
  if (tool === 'Read') return 'Read (a picture file)'
  const parts = tool.split('__')
  return parts.length > 2 ? `${parts[1]} ${parts.slice(2).join(' ')}` : tool
}

const commas = (n: number) => Math.round(n).toLocaleString('en-US')
const short = (n: number) => (n >= 10_000 ? `${(n / 1000).toFixed(0)}k` : n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(Math.round(n)))

/** The small picture, framed, with a grey box under it in case the image does not draw. */
function thumbSvg(base64: string, w: number, h: number): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect x="0" y="0" width="${w}" height="${h}" rx="4" fill="#a8a29e" fill-opacity=".25"/><image href="data:image/jpeg;base64,${base64}" x="0" y="0" width="${w}" height="${h}" preserveAspectRatio="xMidYMid meet"/></svg>`
}

// ---------- hooks ----------

function noop() {}

export function registerPane(on: On) {
  on('ui.close', async ($, e, next) => {
    if (e.id === PANE && e.origin.kind === 'person') closed = true
    return next(e)
  }).catch(($, e, next) => next(e))

  on('ui.press', { plugin: NAME }, async ($, e, next) => {
    if (e.element.startsWith('shot-')) {
      const id = e.element.slice('shot-'.length)
      await update($, openAtom, l => ((l ?? []).includes(id) ? (l ?? []).filter(x => x !== id) : [...(l ?? []), id]))
      return { element: e.element }
    }
    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const els = $.ui.resolve(e)
    const { Box, Text, Button } = els
    if (await read($, offAtom)) return <Text dimColor>Turned off. Open /mods to turn it on.</Text>
    // Svg draws on desktop, the editor and mobile; the terminal gets a glyph and no small pictures.
    const Svg = e.surface !== 'terminal' && 'Svg' in els ? els.Svg : null
    const width = Math.max(32, e.props.bodyColumns)
    const shots = (await read($, shotsAtom)) ?? []
    const totals = whole(await read($, totalsAtom))
    const thumbs = (await read($, thumbsAtom)) ?? {}
    const open = (await read($, openAtom)) ?? []
    const busy = await read($, busyAtom)
    const cw = width - 4

    const tiles = [
      { label: 'Pictures seen', value: String(Math.max(totals.seen, totals.images)) },
      { label: 'Shrunk', value: String(totals.images) },
      { label: 'Tokens saved', value: short(Math.max(0, totals.before - totals.after)) },
    ]
    const tileW = Math.floor((width - (tiles.length - 1)) / tiles.length)

    const mascot = Svg ? (
      <Box key="mascot" width={12} flexShrink={0}>
        <Svg source={cameraSvg(Boolean(busy))} alt="Claude camera with a flash, a lens and a photo" width={72} height={45} />
      </Box>
    ) : (
      <Box key="mascot" width={6} flexShrink={0}>
        <Text color={ACCENT}>{busy ? '▟█▙✦' : '▟█▙ '}</Text>
      </Box>
    )

    // One small card for every picture one tool call left alone, with the reason.
    const quiet = (c: ShotCard) => (
      <Box key={`s-${c.id}`} flexDirection="column" width={width} marginBottom={1} borderStyle="round" borderDimColor paddingX={1}>
        <Box flexDirection="row" justifyContent="space-between" width={cw}>
          <Text bold dimColor wrap="truncate-end">
            {toolName(c.tool)}
          </Text>
          <Text dimColor>·</Text>
        </Box>
        <Text dimColor wrap="wrap">
          {`${c.count ?? 1} picture${(c.count ?? 1) === 1 ? '' : 's'} left alone: ${c.reason ?? 'already small'}`}
        </Text>
      </Box>
    )

    const card = (c: ShotCard, i: number) => {
      if (c.action === 'left alone') return quiet(c)
      const isOpen = open.includes(c.id)
      const live = Boolean(busy) && i === firstLive
      const pic = thumbs[c.id]
      const thumb = Svg && pic ? thumbSvg(pic, 64, 40) : null
      const size = c.nw && c.nh ? `${c.w}x${c.h} → ${c.nw}x${c.nh}` : `${c.w}x${c.h}`
      const saved = c.before - c.after
      const end =
        c.action === 'full size'
          ? { text: 'Let through at full size', color: undefined }
          : { text: `Saved ${commas(saved)} tokens`, color: GOOD }
      const body = (
        <Box flexDirection="column" width={thumb ? cw - 12 : cw}>
          <Box flexDirection="row" justifyContent="space-between" width={thumb ? cw - 12 : cw}>
            <Text bold wrap="truncate-end">
              {toolName(c.tool)}
            </Text>
            <Text bold color={live ? ACCENT : GOOD}>
              {live ? '●' : '✓'}
            </Text>
          </Box>
          <Text dimColor wrap="wrap">
            {c.action === 'described' ? `${size} · described in words by Haiku` : c.action === 'full size' ? `${size} · full size` : `${size} pixels`}
          </Text>
          <Text wrap="wrap">{`${commas(c.before)} → ${commas(c.after)} tokens`}</Text>
        </Box>
      )
      return (
        <Box
          key={`s-${c.id}`}
          flexDirection="column"
          width={width}
          marginBottom={1}
          borderStyle="round"
          borderColor={live ? ACCENT : undefined}
          borderDimColor={!live}
          paddingX={1}
        >
          {thumb && Svg ? (
            <Box flexDirection="row" gap={1} width={cw}>
              <Box width={11} flexShrink={0}>
                <Svg source={thumb} alt="Small copy of the picture Claude got" width={64} height={40} />
              </Box>
              {body}
            </Box>
          ) : (
            body
          )}
          <Box flexDirection="row" justifyContent="space-between" width={cw}>
            <Text bold color={end.color} dimColor={!end.color}>
              {end.text}
            </Text>
            <Button key={`shot-${c.id}`} plain dimColor onPress={noop}>
              {isOpen ? '▾ Hide details' : '▸ Details'}
            </Button>
          </Box>
          {isOpen ? (
            <Box key={`d-${c.id}`} flexDirection="column" width={cw} marginTop={1}>
              <Text bold>Tool</Text>
              <Text dimColor wrap="wrap">
                {c.tool}
              </Text>
              <Text bold>What Claude was told</Text>
              <Text dimColor wrap="wrap">
                {c.note || 'Nothing: the picture went through as it was.'}
              </Text>
              <Text dimColor wrap="wrap">
                Tokens are width x height / 750. Claude reads a picture at most 1568 px on its long side.
              </Text>
            </Box>
          ) : null}
        </Box>
      )
    }

    const firstLive = shots.findIndex(c => c.action !== 'left alone')

    return (
      <Box flexDirection="column" width={width}>
        <Box key="header" flexDirection="row" gap={1} width={width} marginBottom={1}>
          {mascot}
          <Box flexDirection="column" width={width - 13}>
            <Text bold color={busy ? ACCENT : undefined}>
              {busy ? 'Shrinking a picture…' : PANE_TITLE}
            </Text>
            <Text dimColor wrap="wrap">
              Each picture Claude gets is made smaller first, so it costs fewer tokens.
            </Text>
          </Box>
        </Box>
        <Box key="tiles" flexDirection="row" gap={1} width={width} marginBottom={1}>
          {tiles.map(t => (
            <Box key={`t-${t.label}`} flexDirection="column" borderStyle="round" paddingX={1} width={tileW}>
              <Text dimColor wrap="truncate-end">
                {t.label}
              </Text>
              <Text bold color={ACCENT} wrap="truncate-end">
                {t.value}
              </Text>
            </Box>
          ))}
        </Box>
        {totals.pasted > 0 ? (
          <Text key="pasted" dimColor wrap="wrap">
            {`${totals.pasted} pasted picture${totals.pasted === 1 ? '' : 's'} went through as they were: mods cannot shrink pasted pictures.`}
          </Text>
        ) : null}
        {shots.length === 0 ? (
          <Text key="empty" dimColor wrap="wrap">
            Cards show up here when Claude takes a screenshot or reads a picture.
          </Text>
        ) : (
          shots.map(card)
        )}
      </Box>
    )
  })
}
