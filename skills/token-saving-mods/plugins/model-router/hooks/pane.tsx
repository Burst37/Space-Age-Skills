// The "Subagent Model Selector" pane: one card per subagent the mod looked at. It shows the task,
// Haiku's tier and confidence, the model the subagent ran on, the one it would have run on, and
// the dollars saved once it ends. A card opens to Haiku's whole answer and the detail file.
import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'
import type { PickCard } from '../types'
import { DOOR_COLORS, dispatcherSvg } from './mascot.ts'
import { openFile } from './windows.ts'

type On = Parameters<Register>[0]

const NAME = 'model-router'
export const PANE = 'model-router'
// The name a person reads; the folder, switch key and /model-router keep the old name.
export const PANE_TITLE = 'Subagent Model Selector'
const MAX_CARDS = 20

const ACCENT = '#d97757'
const GOOD = '#16a34a'
const BAD = '#dc2626'

export const cardsAtom = atom({ plugin: 'model-router', key: 'cards' } as const, [] as PickCard[], { shape: 'cards-1' })
export const openAtom = atom({ plugin: 'model-router', key: 'open' } as const, [] as string[], { shape: 'open-1' })
// How many judge calls run now: two subagents can start at once.
export const busyAtom = atom({ plugin: 'model-router', key: 'busy' } as const, 0)
export const offAtom = atom({ plugin: 'model-router', key: 'off' } as const, false)

// Module variables start over on a reload; the cards live in $.state.
let seq = 0
// The person closed the pane: the mod stops opening it until /model-router asks.
let closed = false
// switches.json says "model-router:hidden": the mod never opens the pane by itself.
let switchHidden = false

export function resetPane() {
  seq = 0
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
    // The pane is a nicety: the routing never waits on it.
  }
}

export async function closePane($: EngineInterface) {
  try {
    await $.ui.close({ id: PANE })
  } catch {
    // Not open.
  }
}

export async function addCard($: EngineInterface, card: Omit<PickCard, 'id' | 'at'>): Promise<string> {
  const at = await $.clock.now()
  const list = (await read($, cardsAtom)) ?? []
  seq = Math.max(seq, ...list.map(c => Number(c.id) || 0)) + 1
  const id = String(seq)
  await update($, cardsAtom, l => [{ ...card, id, at }, ...(l ?? [])].slice(0, MAX_CARDS))
  return id
}

/** true when a judge call starts, false when it ends. */
export async function setBusy($: EngineInterface, busy: boolean) {
  await update($, busyAtom, n => Math.max(0, (typeof n === 'number' ? n : 0) + (busy ? 1 : -1)))
}

export async function setOff($: EngineInterface, off: boolean) {
  await update($, offAtom, () => off)
}

export async function setCard($: EngineInterface, id: string, change: Partial<PickCard>) {
  await update($, cardsAtom, l => (l ?? []).map(c => (c.id === id ? { ...c, ...change } : c)))
}

// ---------- words ----------

/** Haiku, Sonnet or Opus from a model id; anything else as it is. */
export function family(model: string | undefined): string {
  if (!model) return 'unknown'
  if (/haiku/i.test(model)) return 'Haiku'
  if (/sonnet/i.test(model)) return 'Sonnet'
  if (/opus/i.test(model)) return 'Opus'
  if (/fable/i.test(model)) return 'Fable'
  return model
}

const TIER_WORD = { fast: 'simple', balanced: 'everyday', deep: 'hard' } as const
const TIER_DOOR = { fast: 0, balanced: 1, deep: 2 } as const

const doorOf = (model: string | undefined) => {
  const f = family(model)
  return f === 'Haiku' ? 0 : f === 'Sonnet' ? 1 : f === 'Opus' ? 2 : null
}

const cut = (s: string, n: number) => (s.length > n ? `${s.slice(0, Math.max(0, n - 1))}…` : s)
const money = (v: number) => `$${Math.abs(v) < 0.01 ? Math.abs(v).toFixed(4) : Math.abs(v).toFixed(2)}`
const conf = (v: number | null | undefined) => (typeof v === 'number' ? v.toFixed(2) : 'not given')

// ---------- hooks ----------

function noop() {}

export function registerPane(on: On) {
  on('ui.close', async ($, e, next) => {
    if (e.id === PANE && e.origin.kind === 'person') closed = true
    return next(e)
  }).catch(($, e, next) => next(e))

  on('ui.press', { plugin: NAME }, async ($, e, next) => {
    if (e.element.startsWith('card-')) {
      const id = e.element.slice('card-'.length)
      await update($, openAtom, l => ((l ?? []).includes(id) ? (l ?? []).filter(x => x !== id) : [...(l ?? []), id]))
      return { element: e.element }
    }
    if (e.element.startsWith('file-')) {
      const id = e.element.slice('file-'.length)
      const card = ((await read($, cardsAtom)) ?? []).find(c => c.id === id)
      if (card?.detail) await openFile($, card.detail).catch(() => undefined)
      return { element: e.element }
    }
    return next(e)
  })

  on('ui.render', { component: 'Pane', requestId: PANE }, async ($, e) => {
    const els = $.ui.resolve(e)
    const { Box, Text, Button } = els
    if (await read($, offAtom)) return <Text dimColor>Turned off. Open /mods to turn it on.</Text>
    // Svg draws on desktop, the editor and mobile; the terminal gets a glyph.
    const Svg = e.surface !== 'terminal' && 'Svg' in els ? els.Svg : null
    const width = Math.max(32, e.props.bodyColumns)
    const cards = (await read($, cardsAtom)) ?? []
    const open = (await read($, openAtom)) ?? []
    const busy = ((await read($, busyAtom)) ?? 0) > 0
    const cw = width - 4

    const ended = cards.filter(c => typeof c.saved === 'number')
    const saved = ended.reduce((n, c) => n + (c.saved ?? 0), 0)
    const moved = cards.filter(c => c.outcome === 'moved' || c.outcome === 'forced').length
    const last = cards.find(c => c.ran)
    const tiles = [
      { label: 'Subagents', value: String(cards.length) },
      { label: 'Moved', value: String(moved) },
      { label: saved < 0 ? 'Extra cost' : 'Saved', value: money(saved) },
    ]
    const tileW = Math.floor((width - (tiles.length - 1)) / tiles.length)

    const mascot = Svg ? (
      <Box key="mascot" width={12} flexShrink={0}>
        <Svg
          source={dispatcherSvg(busy, busy ? null : doorOf(last?.ran))}
          alt="Claude dispatcher with a signal paddle and three doors"
          width={72}
          height={48}
        />
      </Box>
    ) : (
      <Box key="mascot" width={6} flexShrink={0}>
        <Text color={ACCENT}>{busy ? '▟█▙⚑' : '▟█▙ '}</Text>
      </Box>
    )

    const card = (c: PickCard) => {
      const isOpen = open.includes(c.id)
      const live = c.phase === 'judging' || c.phase === 'running'
      const mark = c.phase === 'failed' ? '✗' : c.phase === 'done' ? '✓' : '●'
      const door = c.tier ? DOOR_COLORS[TIER_DOOR[c.tier]] : undefined
      const said = c.phase === 'judging' ? 'Haiku is reading the task…' : c.tier ? `Haiku said ${TIER_WORD[c.tier]} work · confidence ${conf(c.confidence)}` : 'Haiku gave no answer'
      const ranLine =
        c.ran === undefined
          ? ''
          : c.ran === c.would
            ? `Ran on ${family(c.ran)} · same as without the mod`
            : `Ran on ${family(c.ran)} · would have run on ${family(c.would)}`
      const end =
        c.phase === 'judging'
          ? { text: 'Judging', color: ACCENT }
          : c.phase === 'running'
            ? { text: 'Running', color: ACCENT }
            : c.phase === 'failed'
              ? { text: 'Did not start', color: BAD }
              : typeof c.saved === 'number'
                ? c.saved >= 0
                  ? { text: `Saved ${money(c.saved)}`, color: GOOD }
                  : { text: `Cost ${money(c.saved)} more`, color: BAD }
                : { text: 'Done', color: GOOD }
      return (
        <Box
          key={`c-${c.id}`}
          flexDirection="column"
          width={width}
          marginBottom={1}
          borderStyle="round"
          borderColor={live ? ACCENT : undefined}
          borderDimColor={!live}
          paddingX={1}
        >
          <Box flexDirection="row" justifyContent="space-between" width={cw}>
            <Box width={cw - 2}>
              <Text bold wrap="truncate-end">
                {cut(c.task || 'Subagent', cw - 2)}
              </Text>
            </Box>
            <Text bold color={c.phase === 'failed' ? BAD : live ? ACCENT : GOOD}>
              {mark}
            </Text>
          </Box>
          <Text dimColor wrap="wrap">
            {`${c.agentType} · ${said}`}
          </Text>
          {ranLine ? (
            <Text wrap="wrap">
              <Text color={door ?? ACCENT}>{'■ '}</Text>
              {ranLine}
            </Text>
          ) : null}
          {c.why ? (
            <Text dimColor wrap="wrap">
              {c.why}
            </Text>
          ) : null}
          <Box flexDirection="row" justifyContent="space-between" width={cw}>
            <Text bold color={end.color}>
              {end.text}
            </Text>
            <Button key={`card-${c.id}`} plain dimColor onPress={noop}>
              {isOpen ? '▾ Hide details' : '▸ Details'}
            </Button>
          </Box>
          {isOpen ? (
            <Box key={`d-${c.id}`} flexDirection="column" width={cw} marginTop={1}>
              <Text bold>Haiku's answer</Text>
              <Text wrap="wrap">{c.judge ? c.judge : 'No answer came back.'}</Text>
              {typeof c.judgeMs === 'number' ? <Text dimColor>{`Took ${(c.judgeMs / 1000).toFixed(1)} s`}</Text> : null}
              {c.policy ? <Text dimColor wrap="wrap">{`Rule: ${c.policy}`}</Text> : null}
              {typeof c.risky === 'number' ? <Text dimColor>{`Risk score: ${c.risky.toFixed(2)}`}</Text> : null}
              {c.costBefore != null && c.costAfter != null ? (
                <Text dimColor wrap="wrap">{`List price: ${money(c.costBefore)} on ${family(c.would)}, ${money(c.costAfter)} on ${family(c.ran)}`}</Text>
              ) : null}
              <Text bold>Task</Text>
              <Text dimColor wrap="wrap">
                {c.prompt || c.task}
              </Text>
              {c.detail ? (
                <Text dimColor wrap="wrap">
                  {c.detail}
                </Text>
              ) : null}
              {c.detail ? <Button key={`file-${c.id}`} label="Open detail file" onPress={noop} /> : null}
            </Box>
          ) : null}
        </Box>
      )
    }

    return (
      <Box flexDirection="column" width={width}>
        <Box key="header" flexDirection="row" gap={1} width={width} marginBottom={1}>
          {mascot}
          <Box flexDirection="column" width={width - 13}>
            <Text bold color={busy ? ACCENT : undefined}>
              {busy ? 'Haiku is picking a model…' : PANE_TITLE}
            </Text>
            <Text dimColor wrap="wrap">
              Haiku reads each subagent task and picks Haiku, Sonnet or Opus.
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
        {cards.length === 0 ? (
          <Text key="empty" dimColor wrap="wrap">
            Cards show up here when Claude starts a subagent.
          </Text>
        ) : (
          cards.map(card)
        )}
      </Box>
    )
  })
}
