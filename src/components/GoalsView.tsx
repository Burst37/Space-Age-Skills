"use client";
import { useState } from "react";
const CATS = ["Pipeline","Clients","Content","Dev","Health","Finance"];
export default function GoalsView() {
  const [goals, setGoals] = useState<{ id:string; text:string; cat:string; done:boolean }[]>([
    { id:"g1", text:"Deploy Agent OS to VPS", cat:"Dev", done:false },
    { id:"g2", text:"Close 3 leads this week", cat:"Pipeline", done:false },
    { id:"g3", text:"WYSIWYG brand deck", cat:"Clients", done:false },
  ]);
  const [text, setText] = useState(""); const [cat, setCat] = useState("Pipeline");
  return (
    <div style={{ padding:"28px 32px" }}>
      <div className="section-label" style={{ marginBottom:6 }}>Space Age</div>
      <h1 style={{ fontSize:16, letterSpacing:"0.1em", marginBottom:20 }}>GOALS</h1>
      <div style={{ display:"flex", gap:8, marginBottom:16 }}>
        <input value={text} onChange={e=>setText(e.target.value)} onKeyDown={e=>e.key==="Enter"&&text.trim()&&(setGoals(g=>[...g,{id:`g${Date.now()}`,text,cat,done:false}]),setText(""))}
          placeholder="Add goal…" style={{ flex:1, padding:"8px 12px", background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:5, color:"var(--fg)", fontFamily:"DM Sans,sans-serif", fontSize:12, outline:"none" }} />
        <select value={cat} onChange={e=>setCat(e.target.value)} style={{ padding:"8px", background:"var(--bg-card)", border:"1px solid var(--border)", borderRadius:5, color:"var(--fg)", fontFamily:"DM Sans,sans-serif", fontSize:12 }}>
          {CATS.map(c=><option key={c}>{c}</option>)}
        </select>
      </div>
      <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
        {goals.map(g=>(
          <div key={g.id} className="glass" style={{ padding:"12px 16px", borderRadius:6, display:"flex", alignItems:"center", gap:12, opacity:g.done?0.5:1 }}>
            <input type="checkbox" checked={g.done} onChange={()=>setGoals(gs=>gs.map(x=>x.id===g.id?{...x,done:!x.done}:x))} style={{ accentColor:"var(--orange)", width:14, height:14 }} />
            <span style={{ flex:1, fontFamily:"DM Sans,sans-serif", fontSize:13, textDecoration:g.done?"line-through":"none", color:"var(--fg)" }}>{g.text}</span>
            <span style={{ fontFamily:"JetBrains Mono,monospace", fontSize:9, padding:"2px 6px", borderRadius:3, background:"var(--bg-elevated)", color:"var(--fg-muted)" }}>{g.cat}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
