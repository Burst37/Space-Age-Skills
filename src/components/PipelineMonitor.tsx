"use client";
import { useEffect, useState, useCallback } from "react";

interface PipelineStats {
  sitesToday?: number;
  totalCost?: number;
  lastBuilt?: string | null;
  agentStatus?: Record<string, boolean>;
  ok?: boolean;
}

const SWARM_AGENTS = [
  { id: "deepseek", label: "DeepSeek V4 Pro", color: "var(--agent-deepseek)", role: "Primary coder" },
  { id: "gemini",   label: "Gemini Flash",    color: "var(--agent-gemini)",   role: "Multimodal" },
  { id: "minimax",  label: "Minimax 2.7",     color: "var(--agent-minimax)",  role: "Long context" },
  { id: "codex",    label: "Codex",           color: "var(--agent-codex)",    role: "Code review" },
  { id: "gemma",    label: "Gemma 3",         color: "var(--agent-gemma)",    role: "Batch tasks" },
];

const TARGET_DAILY = 50;

export default function PipelineMonitor() {
  const [stats, setStats] = useState<PipelineStats>({});
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const r = await fetch("/api/pipeline-status");
      if (r.ok) setStats(await r.json());
    } catch { /* VPS offline */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const id = setInterval(fetchStats, 15_000);
    return () => clearInterval(id);
  }, [fetchStats]);

  const pct = Math.min(100, Math.round(((stats.sitesToday || 0) / TARGET_DAILY) * 100));

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 28 }}>
        <div className="section-label" style={{ marginBottom: 6 }}>Space Age AI Solutions</div>
        <h1 style={{ fontSize: 18, letterSpacing: "0.1em", marginBottom: 4 }}>LEAD GEN PIPELINE</h1>
        <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 12, color: "var(--fg-muted)" }}>
          Google Maps → Scraper → Cinematic HTML → Outreach → Close · $300–750/site
        </div>
      </div>

      {/* KPI row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12, marginBottom: 24 }}>
        {[
          { label: "SITES TODAY",   value: stats.sitesToday ?? (loading ? "…" : 0),  color: "var(--orange)", unit: "" },
          { label: "DAILY TARGET",  value: TARGET_DAILY,                               color: "var(--cyan)",   unit: "sites" },
          { label: "COMPLETION",    value: `${pct}%`,                                  color: pct > 80 ? "var(--green)" : "var(--orange)", unit: "" },
          { label: "PIPELINE COST", value: stats.totalCost != null ? `$${stats.totalCost.toFixed(2)}` : (loading ? "…" : "$0.00"), color: "var(--green)", unit: "" },
        ].map(kpi => (
          <div key={kpi.label} className="glass" style={{ padding: "14px 16px", borderRadius: 8 }}>
            <div className="section-label" style={{ marginBottom: 4, fontSize: 8 }}>{kpi.label}</div>
            <div className="data-value" style={{ color: kpi.color, fontSize: 28 }}>{kpi.value}</div>
            {kpi.unit && <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 9, color: "var(--fg-muted)" }}>{kpi.unit}</div>}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div className="glass" style={{ padding: "16px 20px", borderRadius: 8, marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span className="section-label" style={{ fontSize: 9 }}>Daily Progress</span>
          <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 10, color: "var(--fg-muted)" }}>
            {stats.sitesToday || 0} / {TARGET_DAILY}
          </span>
        </div>
        <div style={{ height: 6, background: "var(--bg-elevated)", borderRadius: 3, overflow: "hidden" }}>
          <div style={{
            height: "100%", borderRadius: 3,
            width: `${pct}%`,
            background: pct > 80 ? "var(--green)" : "var(--orange)",
            boxShadow: `0 0 8px ${pct > 80 ? "var(--green)" : "var(--orange)"}`,
            transition: "width 0.6s ease",
          }} />
        </div>
      </div>

      {/* 5-Agent Swarm */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-label" style={{ marginBottom: 12 }}>5-Agent Parallel Swarm</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8 }}>
          {SWARM_AGENTS.map(a => {
            const online = stats.agentStatus?.[a.id] ?? false;
            return (
              <div key={a.id} className="glass" style={{
                padding: "12px 14px", borderRadius: 6,
                borderLeft: `2px solid ${a.color}`,
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span className={`led ${online ? "led--online" : "led--unknown"}`} />
                  <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: 9, fontWeight: 700, letterSpacing: "0.1em", color: a.color }}>
                    {a.label.toUpperCase()}
                  </span>
                </div>
                <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 10, color: "var(--fg-muted)" }}>{a.role}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cost model */}
      <div className="glass" style={{ padding: "16px 20px", borderRadius: 8 }}>
        <div className="section-label" style={{ marginBottom: 10 }}>Cost Model</div>
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "Variable / lead", value: "$0.05–$0.14", color: "var(--green)" },
            { label: "Monthly overhead", value: "$45–$65",    color: "var(--cyan)" },
            { label: "Target close rate", value: "$300–750",   color: "var(--orange)" },
            { label: "Daily target",     value: "25–80 sites", color: "var(--fg-dim)" },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: 8, color: "var(--fg-muted)", letterSpacing: "0.1em", marginBottom: 2 }}>
                {item.label.toUpperCase()}
              </div>
              <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: 14, fontWeight: 600, color: item.color }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
