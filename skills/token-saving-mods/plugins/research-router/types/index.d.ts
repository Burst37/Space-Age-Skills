/** One tool the worker used in a run, as the pane lists it. */
export type ToolUse = {
  /** What the pane shows: "WebSearch", "plain page read", "claude-haiku-5-5". */
  name: string
  kind: 'cli' | 'built-in' | 'connector' | 'model' | 'http' | 'subagent'
  calls: number
}

/** One numbered source: a real page, by its URL. */
export type SourceView = {
  n: number
  title: string
  url: string
}

/** One deep-mode subagent. */
export type AgentView = {
  part: number
  question: string
  /** The model the subagent runs on, as the spawn reported it. */
  model: string
  status: 'working' | 'done' | 'failed'
  note?: string
  /** True when a hook (Model Router) set the model at spawn: the chat's own model was not used. */
  picked?: boolean
  /** Dollars the subagent cost, at list price. */
  cost?: number
}

/** One research run, newest first in the pane. */
export type RunView = {
  id: number
  /** Milliseconds since the epoch. */
  at: number
  question: string
  mode: 'quick' | 'deep'
  status: 'working' | 'done' | 'failed'
  /** What the worker does now, or did last. */
  step: string
  tools: ToolUse[]
  sources: SourceView[]
  agents: AgentView[]
  /** Tokens the worker and the subagents read (kept out of the main chat). */
  before?: number
  /** Tokens Claude read: the command reply and the brief. */
  after?: number
  /** Dollars for the whole run at list price: the mod's own Haiku calls plus the subagents. */
  cost?: number
  /** Deep mode: the part of `cost` the subagents used. */
  agentCost?: number
  /** Pages the worker read for real (quick mode). Sources listed but not read are not counted. */
  pagesRead?: number
  secs?: number
  /** Absolute path of the notes file. */
  notes?: string
  error?: string
  /** The brief Claude got, cut to a few thousand characters, for the expanded card. */
  brief?: string
  /** Deep mode: each subagent's report, cut short, for the expanded card. */
  reports?: string[]
}

/** One WebSearch call of the main chat that auto mode saw. */
export type AutoView = {
  at: number
  query: string
  status: 'shortened' | 'kept' | 'failed'
  before: number
  after: number
  note?: string
  /** Dollars the Haiku call cost at list price; absent when no Haiku call ran. */
  cost?: number
}

/** The research tools found on this computer. */
export type FoundView = {
  at: number
  /** Absolute path of the firecrawl CLI, or null. */
  firecrawl: string | null
  webSearch: boolean
  webFetch: boolean
  /** Connector tools whose description looks like web research. */
  connectors: string[]
}

declare module 'claude-code' {
  interface PluginState {
    'research-router': {
      /** Newest first, capped. */
      runs: Shaped<RunView[]>
      /** Newest first, capped. */
      auto: Shaped<AutoView[]>
      found: Shaped<FoundView | null>
      /** True while switches.json turns the mod off. */
      off: boolean
      /** True while Model Router is installed and switched on. */
      router: boolean
      /** Searches auto mode is shortening right now: the mascot moves while it is above 0. */
      busy: number
      /** Ids of the run cards shown open. */
      open: Shaped<number[]>
    }
  }
}
