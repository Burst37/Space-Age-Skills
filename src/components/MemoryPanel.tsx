"use client";
export default function MemoryPanel() {
  return (
    <div style={{ padding:"28px 32px" }}>
      <div className="section-label" style={{ marginBottom:6 }}>Obsidian Vault</div>
      <h1 style={{ fontSize:16, letterSpacing:"0.1em", marginBottom:20 }}>MEMORY & VAULT</h1>
      <div className="glass" style={{ padding:"20px", borderRadius:8 }}>
        <div style={{ fontFamily:"DM Sans,sans-serif", fontSize:13, color:"var(--fg-muted)" }}>
          Vault connected at: <span style={{ fontFamily:"JetBrains Mono,monospace", color:"var(--cyan)" }}>AGENTIC_OS_VAULT</span>
        </div>
      </div>
    </div>
  );
}
