"use client";
import { useRef,useState } from "react";

const systems=[["benchmarks","Benchmark Scout"],["specialists","Specialist Judges"],["blind","Blind Judging"],["regression","Regression Memory"],["plateau","Plateau Recovery"],["integration","Integration Director"],["redteam","Final Red Team"],["progress","Control Plane"]];

export default function Home(){
  const [goal,setGoal]=useState("");
  const [type,setType]=useState("Auto-detect"),[harness,setHarness]=useState("Local V3 Runner");
  const [mode,setMode]=useState("Design"),[budget,setBudget]=useState("Balanced"),[autonomy,setAutonomy]=useState("High autonomy");
  const [refs,setRefs]=useState(""),[constraints,setConstraints]=useState(""),[deliverable,setDeliverable]=useState("");
  const [enabled,setEnabled]=useState<Record<string,boolean>>(Object.fromEntries(systems.map(([k])=>[k,true])));
  const [plan,setPlan]=useState<any>(null),[busy,setBusy]=useState(false);
  const [assets,setAssets]=useState<File[]>([]),[styleNotes,setStyleNotes]=useState("");
  const [refProvider,setRefProvider]=useState("auto"),[dna,setDna]=useState<any>(null),[analyzing,setAnalyzing]=useState(false),[refError,setRefError]=useState("");
  const fileRef=useRef<HTMLInputElement>(null);

  async function analyzeRefs(){
    if(!assets.length)return;setAnalyzing(true);setRefError("");
    const fd=new FormData();assets.forEach(f=>fd.append("files",f));fd.append("styleNotes",styleNotes);fd.append("provider",refProvider);
    const r=await fetch("/api/reference/analyze",{method:"POST",body:fd});const data=await r.json();
    if(!r.ok)setRefError(data.error||"Analysis failed");else setDna(data);
    setAnalyzing(false);
  }
  async function compile(){
    if(!goal.trim())return;setBusy(true);
    const r=await fetch("/api/compile",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
      goal,taskType:type,harness,mode,budget,autonomy,references:refs,constraints,deliverable,
      enabledSystems:Object.keys(enabled).filter(k=>enabled[k]),
      referenceDNA:dna?.dna||null
    })});
    setPlan(await r.json());setBusy(false);
  }
  function preset(){
    setGoal("Build a premium cinematic website in my own brand style while borrowing the strongest reusable interaction and scroll principles from my uploaded references.");
    setType("Website / UI");setMode("Design");
    setConstraints("Do not clone reference branding, copy, proprietary assets or distinctive composition literally. Translate motion grammar and interaction principles into an original design system. Mobile first-class. Preserve accessibility and performance.");
    setDeliverable("Production-ready responsive site, source code, passing build/tests, visual inspection at key breakpoints, regression ledger and final scorecard.");
  }
  async function copy(t:string){await navigator.clipboard.writeText(t)}
  function dl(name:string,obj:any){const body=typeof obj==="string"?obj:JSON.stringify(obj,null,2);const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([body],{type:"application/json"}));a.download=name;a.click();URL.revokeObjectURL(a.href)}

  return <main className="shell">
    <header><div className="brand"><div className="logo">GX</div><div><b>Space Age Gauntlet X</b><span>V3.2 MULTIMODAL REFERENCE LAB</span></div></div><div className="pill">REFERENCE → DNA → BUILD → JUDGE</div></header>
    <section className="hero"><small>SCREENSHOTS + MOTION REFERENCES</small><h1>Show it the behavior. <em>Rebuild the principle.</em></h1><p>Upload screenshots or short screen recordings. V3.2 extracts layout and motion grammar, separates reusable technique from distinctive expression, then injects that Reference DNA into the Gauntlet.</p></section>

    <section className="referenceLab">
      <div className="labHead"><div><small>01 — REFERENCE FORENSICS</small><h2>Reference Lab</h2></div><span>{assets.length} asset{assets.length===1?"":"s"}</span></div>
      <div className="refGrid">
        <div>
          <label>Screenshots / short screen recordings</label>
          <input ref={fileRef} className="fileInput" type="file" multiple accept="image/png,image/jpeg,image/webp,video/mp4,video/webm,video/quicktime" onChange={e=>setAssets(Array.from(e.target.files||[]))}/>
          <button className="drop" onClick={()=>fileRef.current?.click()}><b>+ Add reference media</b><span>PNG · JPG · WEBP · MP4 · WEBM · MOV · up to 100MB each</span></button>
          {assets.length>0&&<div className="assetList">{assets.map((f,i)=><div key={i}><span>{f.type.startsWith("video/")?"▶":"▧"}</span><b>{f.name}</b><small>{(f.size/1024/1024).toFixed(1)} MB</small></div>)}</div>}
        </div>
        <div>
          <label>My style / brand transformation notes</label>
          <textarea value={styleNotes} onChange={e=>setStyleNotes(e.target.value)} placeholder="Example: Keep my black/gold luxury palette, editorial typography and cinematic hero treatment. I want the reference's pinned-scroll mechanics and velocity, not its colors, copy, assets or exact layout."/>
          <div className="two"><F l="Vision analyst"><select value={refProvider} onChange={e=>setRefProvider(e.target.value)}><option value="auto">Auto</option><option value="gemini">Gemini</option><option value="openai">OpenAI</option><option value="xai">xAI / Grok</option></select></F><div className="analyzeWrap"><button className="primary" onClick={analyzeRefs}>{analyzing?"Analyzing media…":"Extract Reference DNA"}</button></div></div>
          {refError&&<div className="error">{refError}</div>}
        </div>
      </div>

      {dna?.dna&&<div className="dna">
        <div className="dnaTop"><div><small>REFERENCE DNA READY</small><h3>{dna.analysisMode} · {dna.provider}</h3></div><button className="secondary" onClick={()=>dl("reference-dna.json",dna)}>Download DNA</button></div>
        <div className="dnaCols">
          <DNA title="Visual" items={[...(dna.dna.visual?.layout||[]),...(dna.dna.visual?.typography||[])]}/>
          <DNA title="Motion Grammar" items={[dna.dna.motion?.scrollModel,...(dna.dna.motion?.choreography||[])].filter(Boolean)}/>
          <DNA title="Adopt" items={dna.dna.transformation?.adopt||[]}/>
          <DNA title="Transform / Don't Copy" items={[...(dna.dna.transformation?.transformIntoOwnStyle||[]),...(dna.dna.transformation?.doNotCopy||[])]}/>
        </div>
        <details><summary>Full Reference DNA</summary><pre>{JSON.stringify(dna.dna,null,2)}</pre></details>
      </div>}
    </section>

    <div className="grid">
      <section className="panel">
        <h2>02 — Mission Control</h2>
        <label>Outcome</label><textarea value={goal} onChange={e=>setGoal(e.target.value)} placeholder="What must the agent actually build?"/>
        <div className="two"><F l="Task class"><select value={type} onChange={e=>setType(e.target.value)}>{["Auto-detect","Website / UI","Software / App","AI Skill / Agent","Research","Marketing / Copy","Creative / Visual","Video / Motion","General"].map(x=><option key={x}>{x}</option>)}</select></F><F l="Execution surface"><select value={harness} onChange={e=>setHarness(e.target.value)}>{["Local V3 Runner","Codex","Claude Code","Gemini / Antigravity","Grok","Hermes Agent","Generic agentic harness"].map(x=><option key={x}>{x}</option>)}</select></F></div>
        <label>Mode</label><div className="modes">{["Quick","Pro","War","Design"].map(m=><button key={m} className={mode===m?"active":""} onClick={()=>setMode(m)}>{m}</button>)}</div>
        <div className="two"><F l="Budget"><select value={budget} onChange={e=>setBudget(e.target.value)}>{["Economy","Balanced","High","Maximum quality"].map(x=><option key={x}>{x}</option>)}</select></F><F l="Autonomy"><select value={autonomy} onChange={e=>setAutonomy(e.target.value)}>{["Ask before major pivots","High autonomy","Fully autonomous until stop condition"].map(x=><option key={x}>{x}</option>)}</select></F></div>
        <label>Other references / quality bar</label><textarea value={refs} onChange={e=>setRefs(e.target.value)}/>
        <label>Constraints</label><textarea value={constraints} onChange={e=>setConstraints(e.target.value)}/>
        <label>Definition of done</label><textarea value={deliverable} onChange={e=>setDeliverable(e.target.value)}/>
        <label>Systems</label><div className="systems">{systems.map(([k,n])=><button key={k} className={enabled[k]?"on":""} onClick={()=>setEnabled(v=>({...v,[k]:!v[k]}))}>{enabled[k]?"✓ ":""}{n}</button>)}</div>
        <div className="actions"><button className="primary" onClick={compile}>{busy?"Compiling…":"Compile V3.2"}</button><button className="secondary" onClick={preset}>Reference-Driven Website Preset</button></div>
      </section>

      <section className="panel out">
        {!plan?<div className="empty"><div className="sphere">3.2</div><h2>Multimodal gauntlet output</h2><p>Extract Reference DNA, define your mission, then compile an execution package that knows what to borrow, what to transform, and what not to copy.</p></div>:<>
          <div className="head"><div><small>COMPILED</small><h2>{plan.taskType}</h2></div><span>{plan.complexity}</span></div>
          <div className="metrics"><M n={plan.benchmarks.length} t="benchmarks"/><M n={plan.workstreams.length} t="workstreams"/><M n={plan.critics.length} t="critics"/><M n={dna?.dna?1:0} t="reference dna"/></div>
          <details open><summary>Runner Configuration</summary><pre>{JSON.stringify(plan.runnerConfig,null,2)}</pre><div className="actions"><button className="primary" onClick={()=>dl("gauntlet.project.json",plan.runnerConfig)}>Download gauntlet.project.json</button></div></details>
          <details><summary>Execution Prompt</summary><pre>{plan.prompt}</pre><div className="actions"><button className="primary" onClick={()=>copy(plan.prompt)}>Copy Prompt</button><button className="secondary" onClick={()=>dl("gauntlet-prompt.txt",plan.prompt)}>Download Prompt</button></div></details>
        </>}
      </section>
    </div>
  </main>
}
function F({l,children}:{l:string,children:React.ReactNode}){return <div><label>{l}</label>{children}</div>}
function M({n,t}:{n:number,t:string}){return <div className="metric"><b>{n}</b><span>{t}</span></div>}
function DNA({title,items}:{title:string,items:string[]}){return <div className="dnaCard"><b>{title}</b><ul>{items.slice(0,7).map((x,i)=><li key={i}>{x}</li>)}</ul></div>}
