export type TaskType = "Website / UI"|"Software / App"|"AI Skill / Agent"|"Research"|"Marketing / Copy"|"Creative / Visual"|"Video / Motion"|"General";
export type Mode = "Quick"|"Pro"|"War"|"Design";
export type Budget = "Economy"|"Balanced"|"High"|"Maximum quality";

export interface CompileInput {
  goal:string;
  taskType?:TaskType|"Auto-detect";
  harness:string;
  mode:Mode;
  budget:Budget;
  autonomy:string;
  references?:string;
  constraints?:string;
  deliverable?:string;
  enabledSystems:string[];
  referenceDNA?:unknown;
}

export interface Benchmark { dimension:string; target:string; evidence:string; }
export interface ModelRoute { role:string; provider:string; model:string; fallback:string; reason:string; }
export interface RubricItem { dimension:string; weight:number; gate:number; }
export interface GauntletPlan {
  taskType:TaskType;
  complexity:"LEAN"|"HIGH"|"EXTREME";
  benchmarks:Benchmark[];
  critics:string[];
  rubric:RubricItem[];
  routes:ModelRoute[];
  workstreams:string[];
  prompt:string;
  referenceDNA?:unknown;
}

export interface RunnerConfig {
  name:string;
  goal:string;
  taskType:TaskType;
  mode:Mode;
  workspace:string;
  maxRounds:number;
  plateauDelta:number;
  plateauRounds:number;
  hardGate:number;
  provider:{
    builder:string;
    critic:string;
    judge:string;
  };
  model:{
    builder:string;
    critic:string;
    judge:string;
  };
  checks:string[];
  web?:{
    enabled:boolean;
    url:string;
    viewports:{name:string;width:number;height:number}[];
    scrollFractions?:number[];
  };
  constraints:string[];
  protectedPaths:string[];
  prompt:string;
  referenceDNA?:unknown;
}
