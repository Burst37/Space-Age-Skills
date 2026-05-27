"use client";
export default function MarkdownView({ file }: { file: string }) {
  return (
    <div style={{ padding:"28px 32px" }}>
      <div className="section-label" style={{ marginBottom:6 }}>Documentation</div>
      <h1 style={{ fontSize:16, letterSpacing:"0.1em", marginBottom:16 }}>{file.toUpperCase()}</h1>
      <div className="glass" style={{ padding:"20px", borderRadius:8, color:"var(--fg-dim)", fontFamily:"DM Sans,sans-serif", fontSize:13 }}>
        Load markdown from vault or local files.
      </div>
    </div>
  );
}
