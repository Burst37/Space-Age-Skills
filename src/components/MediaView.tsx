"use client";
import { useState } from "react";

const IMAGE_MODELS = [
  { id: "seedream5",   label: "Seedream 5",        badge: "FREE 2K", color: "var(--green)",  note: "Backgrounds · Property · Street — DEFAULT", default: true },
  { id: "nanobananapro", label: "NanoBanana Pro",  badge: "CREDITS", color: "var(--orange)", note: "Character · Pixar CGI · Stylized art" },
  { id: "chatgptimage", label: "ChatGPT Image 2.0", badge: "CREDITS", color: "var(--cyan)",   note: "Product hero · Luxury · Ultra-detail commercial" },
];

export default function MediaView() {
  const [model, setModel] = useState("seedream5");
  const [prompt, setPrompt] = useState("");
  const [generating, setGenerating] = useState(false);

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 6 }}>Higgsfield MCP</div>
        <h1 style={{ fontSize: 16, letterSpacing: "0.1em" }}>IMAGE STUDIO</h1>
      </div>

      {/* Model selector */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 10, marginBottom: 20 }}>
        {IMAGE_MODELS.map(m => (
          <div key={m.id}
            onClick={() => setModel(m.id)}
            className="glass"
            style={{
              padding: "14px 16px", borderRadius: 8, cursor: "pointer",
              border: `1px solid ${model === m.id ? m.color : "var(--border)"}`,
              background: model === m.id ? `${m.color}11` : "var(--glass-bg)",
              transition: "all 0.15s",
            }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
              <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: 10, fontWeight: 700, color: m.color }}>
                {m.label.toUpperCase()}
              </span>
              <span style={{
                fontFamily: "JetBrains Mono, monospace", fontSize: 8, fontWeight: 700,
                padding: "2px 6px", borderRadius: 3,
                background: model === m.id ? m.color : "var(--bg-elevated)",
                color: model === m.id ? "#000" : "var(--fg-muted)",
              }}>{m.badge}</span>
            </div>
            <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "var(--fg-muted)" }}>{m.note}</div>
          </div>
        ))}
      </div>

      {/* Prompt */}
      <div className="glass" style={{ padding: "16px", borderRadius: 8, marginBottom: 12 }}>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Describe your image... (min 150 words for cinematic quality)"
          rows={5}
          style={{
            width: "100%", resize: "vertical",
            background: "transparent", border: "none", outline: "none",
            color: "var(--fg)", fontFamily: "DM Sans, sans-serif",
            fontSize: 13, lineHeight: 1.6,
          }}
        />
      </div>

      <button
        onClick={() => setGenerating(true)}
        disabled={!prompt.trim() || generating}
        className="btn-primary"
        style={{ marginBottom: 20 }}
      >
        {generating ? "GENERATING…" : "GENERATE IMAGE ▶"}
      </button>

      <div style={{
        padding: "40px",
        border: "2px dashed var(--border)",
        borderRadius: 8,
        textAlign: "center",
        color: "var(--fg-muted)",
        fontFamily: "JetBrains Mono, monospace",
        fontSize: 11,
      }}>
        Generated images will appear here<br/>
        <span style={{ fontSize: 9, opacity: 0.6 }}>Connect Higgsfield MCP in Claude.ai to enable generation</span>
      </div>
    </div>
  );
}
