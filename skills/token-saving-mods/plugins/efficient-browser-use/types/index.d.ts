/** One picture the mod handled, as the pane shows it. Newest first. */
export type ShotCard = {
  /** The pane's own id for the card: a running number. */
  id: string
  /** Milliseconds since the epoch. */
  at: number
  /** The tool's full name, for example mcp__Claude_Browser__computer. */
  tool: string
  /** What the mod did with it. A 'left alone' card stands for every picture one tool call left alone. */
  action: 'shrank' | 'described' | 'full size' | 'left alone'
  /** 'left alone' only: how many pictures, and why, for example "already small (Claude set scale 0.45)". */
  count?: number
  reason?: string
  /** The tool call the picture came from. */
  toolUseId?: string
  /** The original size in pixels. */
  w: number
  h: number
  /** The new size in pixels; not set when the picture was described or let through. */
  nw?: number
  nh?: number
  /** Image tokens before and after, width x height / 750. */
  before: number
  after: number
  /** The note the mod gave Claude with the picture. */
  note?: string
}

/**
 * The running totals for this chat. seen: every picture a tool gave Claude. images: the ones
 * shrunk or described. before and after: their tokens. pasted: pictures pasted in a prompt.
 */
export type Totals = { seen: number; images: number; before: number; after: number; pasted: number }

declare module 'claude-code' {
  interface PluginState {
    'efficient-browser-use': {
      /** Newest first, capped. */
      shots: Shaped<ShotCard[]>
      totals: Shaped<Totals>
      /** Small JPEGs of the newest few shrunk pictures, base64, by card id. */
      thumbs: Shaped<Record<string, string>>
      /** Ids of the cards shown open. */
      open: Shaped<string[]>
      /** True while a picture is being shrunk, and 2 s after: the mascot moves. */
      busy: boolean
      /** True while switches.json turns the mod off. */
      off: boolean
    }
  }
}
