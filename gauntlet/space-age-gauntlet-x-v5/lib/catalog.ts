import { Benchmark, Mode, TaskType } from "./types";

export const BENCHMARKS:Record<TaskType,Benchmark[]>={
  "Website / UI":[
    {dimension:"Visual polish",target:"Elite editorial/product-site quality appropriate to the brief",evidence:"Rendered screenshots at representative breakpoints"},
    {dimension:"Typography",target:"Deliberate hierarchy, scale and rhythm; no default-framework feel",evidence:"Rendered page inspection"},
    {dimension:"Motion",target:"Purposeful choreography with no jank or decorative over-animation",evidence:"Running scroll/interaction inspection"},
    {dimension:"Responsive UX",target:"No meaningful degradation from 320px through large desktop",evidence:"Viewport matrix"},
    {dimension:"Performance",target:"Lighthouse-oriented performance with no obvious blocking regressions",evidence:"Build/browser measurements"},
    {dimension:"Accessibility",target:"WCAG AA-oriented semantics, keyboard usability and no critical automated violations",evidence:"axe/semantic/keyboard checks"},
    {dimension:"Originality",target:"No unjustified generic AI-site patterns",evidence:"Independent design judge"}
  ],
  "Software / App":[
    {dimension:"Correctness",target:"Required flows and tests pass",evidence:"Automated tests + execution"},
    {dimension:"Architecture",target:"Maintainable boundaries and dependency structure",evidence:"Source inspection"},
    {dimension:"Reliability",target:"Graceful realistic failure handling",evidence:"Failure scenarios"},
    {dimension:"Security",target:"No known critical blockers",evidence:"Threat checklist/tests"},
    {dimension:"Performance",target:"Meets explicit resource/latency goals",evidence:"Measured benchmark"}
  ],
  "AI Skill / Agent":[
    {dimension:"Instruction architecture",target:"Clear hierarchy, low contradiction, high trigger precision",evidence:"Static/adversarial review"},
    {dimension:"Portability",target:"Core behavior survives intended harnesses/models",evidence:"Adaptation matrix"},
    {dimension:"Tool use",target:"Correct selection, verification and failure handling",evidence:"Scenario tests"},
    {dimension:"Robustness",target:"Handles ambiguity/missing data/self-evaluation traps",evidence:"Adversarial suite"},
    {dimension:"Efficiency",target:"Avoids unnecessary token/context expansion",evidence:"Context audit"}
  ],
  "Research":[
    {dimension:"Evidence quality",target:"High-authority directly relevant evidence",evidence:"Source table"},
    {dimension:"Methodology",target:"Claims trace cleanly to evidence",evidence:"Claim-evidence audit"},
    {dimension:"Counterargument",target:"Material contrary evidence considered",evidence:"Red-team review"},
    {dimension:"Decision usefulness",target:"Directly supports requested decision",evidence:"Independent reviewer"}
  ],
  "Marketing / Copy":[
    {dimension:"Positioning",target:"Distinct audience-relevant promise",evidence:"Competitor comparison"},
    {dimension:"Clarity",target:"Core value understood immediately",evidence:"Cold-reader test"},
    {dimension:"Conversion",target:"CTA/objections align to funnel",evidence:"Conversion critic"},
    {dimension:"Originality",target:"No generic AI phrasing",evidence:"Independent copy critic"}
  ],
  "Creative / Visual":[
    {dimension:"Composition",target:"Intentional hierarchy and balance",evidence:"Blind visual critique"},
    {dimension:"Reference fidelity",target:"Matches required visual DNA without derivative copying",evidence:"Side-by-side comparison"},
    {dimension:"Commercial polish",target:"Production-ready finish",evidence:"Final-output review"}
  ],
  "Video / Motion":[
    {dimension:"Direction",target:"Clear story and shot purpose",evidence:"Sequence review"},
    {dimension:"Cinematography",target:"Coherent lensing, lighting and camera grammar",evidence:"Frame review"},
    {dimension:"Motion",target:"Coherent movement and pacing",evidence:"Playback review"},
    {dimension:"Continuity",target:"No distracting identity/spatial/temporal breaks",evidence:"Shot review"}
  ],
  "General":[
    {dimension:"Correctness",target:"Meets stated goal",evidence:"Artifact inspection"},
    {dimension:"Quality",target:"Strong professional standard",evidence:"Independent critic"},
    {dimension:"Usability",target:"Useful to intended user",evidence:"Task review"}
  ]
};

export const CRITICS:Record<TaskType,string[]>={
  "Website / UI":["Visual Art Director","UI/UX Critic","Typography Critic","Motion & Interaction Critic","Responsive Critic","Accessibility Critic","Performance Critic","Conversion Critic","Frontend Architecture Critic","AI-Slop Detector"],
  "Software / App":["Architecture Critic","Correctness Critic","Test Critic","Security Critic","Performance Critic","Reliability Critic","Developer-Experience Critic","UX Critic"],
  "AI Skill / Agent":["Instruction Architecture Critic","Trigger/Scope Critic","Tool-Use Critic","Failure-Mode Critic","Portability Critic","Token-Efficiency Critic","Evaluation Critic","Adversarial Prompt Critic"],
  "Research":["Evidence Critic","Methodology Critic","Counterargument Critic","Source Quality Critic","Clarity Critic","Decision-Usefulness Critic"],
  "Marketing / Copy":["Positioning Critic","Audience Critic","Clarity Critic","Conversion Critic","Originality Critic","Brand Voice Critic"],
  "Creative / Visual":["Creative Director","Composition Critic","Lighting Critic","Reference-Fidelity Critic","Continuity Critic","Commercial-Polish Critic"],
  "Video / Motion":["Director","Cinematography Critic","Motion Critic","Continuity Critic","Edit/Pacing Critic","Commercial-Polish Critic"],
  "General":["Domain Expert","Quality Critic","Usability Critic","Adversarial Critic"]
};

export const WORKSTREAMS:Record<TaskType,string[]>={
  "Website / UI":["Brief & brand interpretation","Benchmark/reference manifest","Information architecture","Wireframe/composition","Typography system","Visual system","Hero/storytelling","Interaction & motion language","Responsive implementation","Accessibility","Performance","Conversion & SEO","Integration & regression"],
  "Software / App":["Requirements","Architecture","Core implementation","Interfaces/API","Data layer","Tests","Security","Performance","Reliability","Integration"],
  "AI Skill / Agent":["Scope & trigger model","Instruction architecture","Tool policy","Platform adapters","Failure handling","Evaluation suite","Adversarial tests","Token/context audit","Integration"],
  "Research":["Question decomposition","Source strategy","Evidence collection","Synthesis","Counterevidence","Decision output","Citation audit"],
  "Marketing / Copy":["Audience/positioning","Competitive angle","Message architecture","Draft variants","Conversion review","Brand consistency","Final polish"],
  "Creative / Visual":["Reference DNA","Concepts","Composition","Lighting/color","Asset fidelity","Polish","Final review"],
  "Video / Motion":["Narrative beats","Shot grammar","Cinematography","Motion choreography","Continuity","Edit/pacing","Final review"],
  "General":["Requirements","Build","Independent review","Integration","Final verification"]
};

export function criticSet(type:TaskType,mode:Mode){
  const list=CRITICS[type];
  if(mode==="Quick") return list.slice(0,2);
  if(mode==="Pro") return list.slice(0,Math.min(6,list.length));
  return list;
}
