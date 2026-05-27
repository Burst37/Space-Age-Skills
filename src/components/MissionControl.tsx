"use client";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

interface Vitals {
  ts?: number;
  claude?:      { ok?: boolean; version?: string; latencyMs?: number };
  codex?:       { ok?: boolean; version?: string; latencyMs?: number };
  gemini?:      { ok?: boolean; version?: string; latencyMs?: number };
  openclaw?:    { ok?: boolean; latencyMs?: number };
  hermes?:      { ok?: boolean; model?: string; provider?: string; latencyMs?: number };
  antigravity?: { ok?: boolean; version?: string; latencyMs?: number };
}

interface PipelineStats {
  sitesToday?: number;
  totalCost?: number;
  lastBuilt?: string | null;
}

const AGENTS = [
  { id: "claude",      label: "Claude",          href: "/claude",   color: "var(--agent-claude)",   desc: "Orchestrator · Creative" },
  { id: "codex",       label: "Codex",           href: "/codex",    color: "var(--agent-codex)",    desc: "Code review · Rescue" },
  { id: "gemini",      label: "Gemini",          href: "/gemini",   color: "var(--agent-gemini)",   desc: "Multimodal · Long context" },
  { id: "openclaw",    label: "OpenClaw",        href: "/openclaw", color: "var(--agent-openclaw)", desc: "Multi-agent swarm" },
  { id: "hermes",      label: "Hermes VPS",      href: "/terminal", color: "var(--agent-hermes)",   desc: "146.190.78.120 · 24/7" },
  { id: "antigravity", label: "Antigravity",     href: "/guide",    color: "var(--cyan)",           desc: "2M context IDE" },
];

const QUICK_ACCESS = [
  { href: "/terminal", label: "VPS Terminal",   icon: "▶", color: "var(--orange)" },
  { href: "/pipeline", label: "Pipeline",       icon: "⧖", color: "var(--cyan)" },
  { href: "/studio",   label: "Image Studio",   icon: "◉", color: "var(--green)" },
  { href: "/video",    label: "Video Studio",   icon: "▣", color: "var(--purple)" },
  { href: "/kanban",   label: "Kanban",         icon: "⊟", color: "var(--orange)" },
  { href: "/journal",  label: "Journal",        icon: "▤", color: "var(--fg-dim)" },
];

function ledClass(ok?: boolean) {
  if (ok === undefined) return "led led--unknown";
  return ok ? "led led--online" : "led led--offline";
}

export default function MissionControl() {
  const [vitals, setVitals] = useState<Vitals>({});
  const [pipeline, setPipeline] = useState<PipelineStats>({});
  const [time, setTime] = useState("");

  const fetchData = useCallback(async () => {
    try {
      const [vRes, pRes] = await Promise.all([
        fetch("/api/vitals"),
        fetch("/api/pipeline-status"),
      ]);
      if (vRes.ok) setVitals(await vRes.json());
      if (pRes.ok) setPipeline(await pRes.json());
    } catch { /* offline */ }
  }, []);

  useEffect(() => {
    fetchData();
    const iv = setInterval(fetchData, 30_000);
    const tc = setInterval(() => setTime(new Date().toLocaleTimeString("en-US", { hour12: false })), 1000);
    return () => { clearInterval(iv); clearInterval(tc); };
  }, [fetchData]);

  const vMap = vitals as Record<string, { ok?: boolean; latencyMs?: number }>;

  const onlineCount = AGENTS.filter(a => vMap[a.id]?.ok).length;

  return (
    <div style={{ padding: "28px 32px", minHeight: "100vh" }}>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 10, letterSpacing: "0.2em",
          color: "var(--orange)", marginBottom: 6,
        }}>SPACE AGE AI SOLUTIONS · DALLAS TX</div>
        <h1 style={{
          fontFamily: "Orbitron, sans-serif",
          fontSize: "clamp(24px, 4vw, 48px)",
          fontWeight: 900,
          letterSpacing: "0.06em",
          color: "var(--fg)",
          lineHeight: 1.0,
          marginBottom: 4,
        }}>MISSION CONTROL</h1>
        <div style={{
          fontFamily: "JetBrains Mono, monospace",
          fontSize: 11, color: "var(--fg-muted)",
          display: "flex", gap: 20, flexWrap: "wrap",
        }}>
          <span>{time}</span>
          <span style={{ color: onlineCount > 0 ? "var(--green)" : "var(--red)" }}>
            {onlineCount}/{AGENTS.length} AGENTS ONLINE
          </span>
          <span>SITES TODAY: <strong style={{ color: "var(--cyan)" }}>{pipeline.sitesToday ?? "—"}</strong></span>
          <span>PIPELINE COST: <strong style={{ color: "var(--green)" }}>${pipeline.totalCost?.toFixed(2) ?? "—"}</strong></span>
        </div>
      </div>

      {/* ── Agent grid ───────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Agent Status</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: 10,
        }}>
          {AGENTS.map(agent => {
            const status = vMap[agent.id];
            return (
              <Link key={agent.id} href={agent.href} style={{ textDecoration: "none" }}>
                <div className="glass" style={{
                  padding: "14px 16px",
                  borderRadius: 8,
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  borderLeft: `2px solid ${agent.color}`,
                  display: "flex", flexDirection: "column", gap: 6,
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                      fontFamily: "Orbitron, sans-serif",
                      fontSize: 10, fontWeight: 700,
                      letterSpacing: "0.12em",
                      color: agent.color,
                    }}>{agent.label.toUpperCase()}</span>
                    <span className={ledClass(status?.ok)} />
                  </div>
                  <div style={{
                    fontFamily: "DM Sans, sans-serif",
                    fontSize: 11, color: "var(--fg-muted)",
                  }}>{agent.desc}</div>
                  {status?.latencyMs !== undefined && (
                    <div style={{
                      fontFamily: "JetBrains Mono, monospace",
                      fontSize: 9, color: "var(--fg-muted)",
                    }}>{status.latencyMs}ms</div>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── Quick access ──────────────────────────────────────────────── */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>Quick Access</div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
          gap: 8,
        }}>
          {QUICK_ACCESS.map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
              <div className="glass" style={{
                padding: "12px 14px",
                borderRadius: 6,
                cursor: "pointer",
                display: "flex", alignItems: "center", gap: 8,
                transition: "background 0.12s",
              }}>
                <span style={{ fontSize: 16, color: item.color }}>{item.icon}</span>
                <span style={{
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: 12, color: "var(--fg-dim)",
                  fontWeight: 500,
                }}>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* ── API models available ──────────────────────────────────────── */}
      <div>
        <div className="section-label" style={{ marginBottom: 12 }}>API Model Stack</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {[
            { label: "DeepSeek V4 Pro", color: "var(--agent-deepseek)", note: "1.6T params · 1M ctx · primary coding" },
            { label: "Minimax 2.7",     color: "var(--agent-minimax)",   note: "long-context · creative" },
            { label: "Gemma 3 27B",     color: "var(--agent-gemma)",     note: "fast · batch tasks" },
          ].map(m => (
            <div key={m.label} className="glass" style={{
              padding: "8px 14px",
              borderRadius: 6,
              display: "flex", flexDirection: "column", gap: 2,
            }}>
              <div style={{
                fontFamily: "JetBrains Mono, monospace",
                fontSize: 10, color: m.color, fontWeight: 600,
              }}>{m.label}</div>
              <div style={{
                fontFamily: "DM Sans, sans-serif",
                fontSize: 10, color: "var(--fg-muted)",
              }}>{m.note}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
