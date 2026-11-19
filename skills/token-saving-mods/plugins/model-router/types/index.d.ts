/** Why the model stayed or moved, as the pane words it. */
export type Outcome = 'moved' | 'forced' | 'agreed' | 'under-bar' | 'no-answer'

/** One subagent the mod looked at, as the pane shows it. Newest first. */
export type PickCard = {
  /** The pane's own id for the card: a running number. */
  id: string
  /** Milliseconds since the epoch. */
  at: number
  agentType: string
  /** The Agent call's short description. */
  task: string
  /** The start of the subagent's prompt, for the expanded view. */
  prompt: string
  phase: 'judging' | 'running' | 'done' | 'failed'
  tier?: 'fast' | 'balanced' | 'deep'
  confidence?: number | null
  risky?: number | null
  /** The model the subagent ran on. */
  ran?: string
  /** The model it would have run on without the mod. */
  would?: string
  outcome?: Outcome
  /** One plain sentence: why it moved or stayed. */
  why?: string
  /** What the policy said, as the log has it. */
  policy?: string
  /** Haiku's whole answer, cut to 2,000 characters. */
  judge?: string
  judgeMs?: number
  /** Dollars at list price, set when the run ends. */
  costBefore?: number | null
  costAfter?: number | null
  saved?: number | null
  /** Absolute path of the detail file, set when the run ends. */
  detail?: string
}

declare module 'claude-code' {
  interface PluginState {
    'model-router': {
      /** Newest first, capped. */
      cards: Shaped<PickCard[]>
      /** Ids of the cards shown open. */
      open: Shaped<string[]>
      /** How many judge calls run now: the mascot moves while it is above 0. */
      busy: number
      /** True while switches.json turns the mod off. */
      off: boolean
    }
  }
}
