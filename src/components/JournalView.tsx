"use client";
import { useEffect, useState } from "react";
export default function JournalView() {
  const [entry, setEntry] = useState(""); const [saving, setSaving] = useState(false); const [saved, setSaved] = useState(false);
  async function save() {
    if (!entry.trim()) return; setSaving(true);
    await fetch("/api/vault-write", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ content:`## ${new Date().toLocaleTimeString()}\n${entry}`, daily:true }) });
    setSaving(false); setSaved(true); setEntry(""); setTimeout(()=>setSaved(false),3000);
  }
  return (
    <div style={{ padding:"28px 32px" }}>
      <div className="section-label" style={{ marginBottom:6 }}>Obsidian Daily Notes</div>
      <h1 style={{ fontSize:16, letterSpacing:"0.1em", marginBottom:20 }}>JOURNAL</h1>
      <div className="glass" style={{ padding:"16px", borderRadius:8, marginBottom:12 }}>
        <textarea value={entry} onChange={e=>setEntry(e.target.value)} placeholder="Log thoughts, session notes, pipeline updates…" rows={12}
          style={{ width:"100%", resize:"vertical", background:"transparent", border:"none", outline:"none", color:"var(--fg)", fontFamily:"DM Sans,sans-serif", fontSize:14, lineHeight:1.7 }} />
      </div>
      <button onClick={save} disabled={saving||!entry.trim()} className="btn-primary">
        {saving?"SAVING…":saved?"✓ SAVED":"SAVE TO VAULT ▶"}
      </button>
    </div>
  );
}
