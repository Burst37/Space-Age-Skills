/** What a helper model (a cheap model, or Jev) used for one action. */
export type Helper = {
  model: string
  in: number
  out: number
  /** Dollars, only when the helper's own bill said it. */
  usd?: number
  /** One entry per request, from helper.calls. Each is priced on its own tier. */
  calls?: { in: number; out: number }[]
}

/** One counted action from savings.jsonl, after the double counts are dropped. */
export type Row = {
  /** A stable id made from the raw line: the address of its buttons. */
  key: string
  ts: string
  ms: number
  session: string
  toolUseId: string | null
  mod: string
  /** The part of a mod with parts (Input Router: file, connector or web). Empty when the line has none. */
  part: string
  action: string
  before: number
  after: number
  /** before - after: tokens the main chat did not read (or did not write, for output tokens). */
  saved: number
  /** Output tokens (a Stably line) are priced at the output price, all others at the input price. */
  tokenKind: 'input' | 'output'
  /** A mod that saves dollars, not tokens (Model Router), says so in cost_usd. Null when it did not. */
  usd: { before: number | null; after: number | null; saved: number } | null
  /**
   * Dollars this action saved before helpers: cost_usd.saved, else output tokens x the output price,
   * else input tokens x (one cache write + one cache read per later request). Null when unknown.
   */
  valueUsd: number | null
  /**
   * How saved input tokens were priced, null for dollar, output and left-out rows.
   * chat: from the chat's transcript. reading: not read yet, so 1 write for now. no-chat: no transcript, 1 write.
   */
  cache: { how: 'chat' | 'reading' | 'no-chat'; requests: number; model: string } | null
  /** Why this line counts in no total ('' when it counts): a before no tool result could have. */
  leftOut: string
  /** One line of extra facts some mods add (Stably: effort, baseline, time). */
  extra: string
  helper: Helper | null
  /** Dollars the helper cost: from its bill, from the list price, or null when unknown. */
  helperUsd: number | null
  /** estimated: list price, but a Haiku total over 100k tokens hides which tier each request was on. */
  helperPriced: 'none' | 'bill' | 'list' | 'estimated' | 'unknown'
  measured: 'real' | 'estimated'
  detail: string
}

export type Totals = {
  actions: number
  before: number
  after: number
  saved: number
  real: number
  estimated: number
  /** Dollars of helper cost we could price (bill or list price). */
  helperUsd: number
  /** Sum of cost_usd.saved, and how many actions had one. Can be below 0. */
  usdSaved: number
  usdActions: number
  /** Sum of every known valueUsd. Net = value - helperUsd. */
  value: number
  /** Actions whose saving or helper has no known price. */
  unpriced: number
  /** Lines left out of these totals as not believable. */
  leftOut: number
  /** Chats (sessions) the counted actions came from. */
  chats: number
}

export type Ledger = {
  /** Where the lines came from: the real ledger, or the sample file. */
  path: string
  sample: boolean
  /** True when the file is not there yet. */
  missing: boolean
  /** Set when the file could not be read. */
  error: string
  /** Newest first, at most MAX_ROWS. */
  rows: Row[]
  today: Totals
  chat: Totals
  all: Totals
  /** Lines that were not valid JSON or had no number for before or after. */
  skipped: number
  /** Lines dropped because their tool_use_id was already counted. */
  dropped: number
  /** True when the file was too big and only its newest lines were read. */
  partial: boolean
  /** The session id that counts as "this chat". */
  chatId: string
  /** The local day that counts as "today", YYYY-MM-DD. */
  day: string
  /** Price per input token of this chat's model, null when unknown. A row uses its own chat's model when known. */
  mainPrice: number | null
  mainModel: string
}

/** Real figures from Claude Code for this chat, as the status line has them. */
export type Live = {
  tokens: number | null
  window: number
  percent: number | null
  usd: number | null
}

/** A compaction of this chat with real before and after counts. */
export type Compaction = {
  at: number
  before: number
  after: number
  /** compact: the engine said the counts. measure: seen as a drop in the context size. */
  source: 'compact' | 'measure'
}

export type View = {
  /** Which rows the list shows. The totals at the top always show today and this chat. */
  filter: 'chat' | 'today' | 'all'
  /** The row whose detail file is shown under it. */
  open: string
  /** The detail file's text, or why it could not be shown. */
  detail: string
  detailError: string
  note: string
}

declare module 'claude-code' {
  interface PluginState {
    'savings-proof': {
      ledger: Shaped<Ledger | null>
      live: Shaped<Live | null>
      compactions: Shaped<Compaction[]>
      view: Shaped<View>
    }
  }
}
