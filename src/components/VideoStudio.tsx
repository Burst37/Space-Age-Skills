"use client";
import { useState } from "react";

const VIDEO_MODELS = [
  { id: "seedance2",  label: "Seedance 2.0", badge: "DEFAULT", color: "var(--orange)", note: "Reference-driven · Strong identity" },
  { id: "kling3",     label: "Kling 3.0",    badge: "MULTI-SHOT", color: "var(--cyan)",   note: "Multi-shot · Audio · Motion transfer" },
  { id: "veo31",      label: "Veo 3.1",      badge: "LIPSYNC",   color: "var(--purple)", note: "Lipsync MV only" },
];

export default function VideoStudio() {
  const [model, setModel] = useState("seedance2");
  const [prompt, setPrompt] = useState("");

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 6 }}>Higgsfield MCP</div>
        <h1 style={{ fontSize: 16, letterSpacing: "0.1em" }}>VIDEO STUDIO</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 20 }}>
        {VIDEO_MODELS.map(m => (
          <div key={m.id} onClick={() => setModel(m.id)} className="glass" style={{
            padding: "14px 16px", borderRadius: 8, cursor: "pointer",
            border: `1px solid ${model === m.id ? m.color : "var(--border)"}`,
            background: model === m.id ? `${m.color}11` : "var(--glass-bg)",
            transition: "all 0.15s",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: 10, fontWeight: 700, color: m.color }}>
                {m.label.toUpperCase()}
              </span>
              <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 8, padding: "2px 6px", borderRadius: 3, background: "var(--bg-elevated)", color: "var(--fg-muted)" }}>
                {m.badge}
              </span>
            </div>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "var(--fg-muted)" }}>{m.note}</div>
          </div>
        ))}
      </div>

      <div className="glass" style={{ padding: "16px", borderRadius: 8, marginBottom: 12 }}>
        <textarea value={prompt} onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your video scene..." rows={5}
          style={{ width: "100%", resize: "vertical", background: "transparent", border: "none", outline: "none", color: "var(--fg)", fontFamily: "DM Sans, sans-serif", fontSize: 13, lineHeight: 1.6 }}
        />
      </div>
      <button className="btn-primary" disabled={!prompt.trim()}>GENERATE VIDEO ▶</button>
    </div>
  );
}
