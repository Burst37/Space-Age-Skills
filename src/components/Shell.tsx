"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";

const NAV = [
  { href: "/",          label: "Mission Control", icon: "⊞" },
  { href: "/claude",    label: "Claude",           icon: "◈", agent: "claude" },
  { href: "/codex",     label: "Codex",            icon: "⬡", agent: "codex" },
  { href: "/gemini",    label: "Gemini",           icon: "◆", agent: "gemini" },
  { href: "/openclaw",  label: "OpenClaw",         icon: "⬢", agent: "openclaw" },
  { href: "/terminal",  label: "VPS Terminal",     icon: "▶" },
  { href: "/pipeline",  label: "Pipeline",         icon: "⧖" },
  { href: "/studio",    label: "Image Studio",     icon: "◉" },
  { href: "/video",     label: "Video Studio",     icon: "▣" },
  { href: "/kanban",    label: "Kanban",           icon: "⊟" },
  { href: "/memory",    label: "Memory",           icon: "◎" },
  { href: "/goals",     label: "Goals",            icon: "◇" },
  { href: "/journal",   label: "Journal",          icon: "▤" },
  { href: "/guide",     label: "Guide",            icon: "⊙" },
];

const AGENT_COLORS: Record<string, string> = {
  claude:   "var(--agent-claude)",
  hermes:   "var(--agent-hermes)",
  gemini:   "var(--agent-gemini)",
  openclaw: "var(--agent-openclaw)",
  codex:    "var(--agent-codex)",
};

export default function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [vitals, setVitals] = useState<Record<string, { ok?: boolean }>>({});
  const [cavemanMode, setCavemanMode] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const fetchVitals = useCallback(async () => {
    try {
      const r = await fetch("/api/vitals");
      if (r.ok) setVitals(await r.json());
    } catch { /* offline */ }
  }, []);

  useEffect(() => {
    fetchVitals();
    const id = setInterval(fetchVitals, 30_000);
    return () => clearInterval(id);
  }, [fetchVitals]);

  const ledClass = (ok?: boolean) =>
    ok === undefined ? "led led--unknown" : ok ? "led led--online" : "led led--offline";

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", position:"relative", zIndex:1 }}>

      {/* ── SIDEBAR ──────────────────────────────────────────────── */}
      <aside style={{
        width: sidebarOpen ? "220px" : "52px",
        flexShrink: 0,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "rgba(5,5,8,0.97)",
        backdropFilter: "blur(40px) saturate(180%)",
        borderRight: "1px solid var(--border)",
        transition: "width 0.2s ease",
        overflow: "hidden",
        zIndex: 100,
      }}>

        {/* Logo strip */}
        <div
          onClick={() => setSidebarOpen(o => !o)}
          style={{
            padding: "18px 14px 14px",
            borderBottom: "1px solid var(--border)",
            display: "flex", alignItems: "center", gap: 10,
            cursor: "pointer",
          }}
        >
          <div style={{
            width: 26, height: 26, borderRadius: 5, flexShrink: 0,
            background: "linear-gradient(135deg,var(--orange) 0%,#ff9500 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 0 14px rgba(255,107,0,0.55)",
            fontFamily: "Orbitron,sans-serif",
            fontSize: 13, fontWeight: 800, color: "#fff",
          }}>S</div>
          {sidebarOpen && (
            <div>
              <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:10, fontWeight:700, letterSpacing:"0.12em", color:"var(--fg)", lineHeight:1.1 }}>SPACE AGE</div>
              <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:8, color:"var(--orange)", letterSpacing:"0.2em" }}>AGENT OS v1.0</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, overflowY:"auto", overflowX:"hidden", padding:"6px 0" }}>
          {NAV.map(({ href, label, icon, agent }) => {
            const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
            const status = agent ? vitals[agent]?.ok : undefined;
            return (
              <Link key={href} href={href} style={{ textDecoration:"none" }}>
                <div style={{
                  display: "flex", alignItems: "center", gap: 9,
                  padding: "8px 14px",
                  borderLeft: `2px solid ${active ? "var(--orange)" : "transparent"}`,
                  background: active ? "rgba(255,107,0,0.08)" : "transparent",
                  color: active ? "var(--fg)" : "var(--fg-dim)",
                  fontSize: 12,
                  fontFamily: "DM Sans,sans-serif",
                  fontWeight: active ? 600 : 400,
                  cursor: "pointer",
                  transition: "all 0.12s",
                  whiteSpace: "nowrap", overflow: "hidden",
                }}>
                  <span style={{
                    flexShrink: 0, fontSize: 14,
                    color: agent ? AGENT_COLORS[agent] : (active ? "var(--orange)" : "var(--fg-muted)"),
                  }}>{icon}</span>
                  {sidebarOpen && (
                    <>
                      <span style={{ flex:1 }}>{label}</span>
                      {status !== undefined && <span className={ledClass(status)} />}
                    </>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Hermes VPS pill */}
        {sidebarOpen && (
          <div style={{ padding:"10px 12px", borderTop:"1px solid var(--border)" }}>
            <div style={{
              display:"flex", alignItems:"center", gap:8,
              padding:"8px 10px",
              background:"var(--bg-card)",
              border:"1px solid var(--border)",
              borderRadius:6,
            }}>
              <span className={ledClass(vitals.hermes?.ok)} />
              <div style={{ flex:1, overflow:"hidden" }}>
                <div style={{ fontFamily:"Orbitron,sans-serif", fontSize:8, fontWeight:700, letterSpacing:"0.15em", color:"var(--agent-hermes)" }}>HERMES VPS</div>
                <div style={{ fontFamily:"JetBrains Mono,monospace", fontSize:9, color:"var(--fg-muted)", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>146.190.78.120</div>
              </div>
            </div>

            <button
              onClick={() => setCavemanMode(m => !m)}
              style={{
                marginTop:6, width:"100%", padding:"5px",
                background: cavemanMode ? "var(--orange-dim)" : "transparent",
                border:`1px solid ${cavemanMode ? "var(--orange)" : "var(--border)"}`,
                borderRadius:4,
                color: cavemanMode ? "var(--orange)" : "var(--fg-muted)",
                fontFamily:"Orbitron,sans-serif", fontSize:8, fontWeight:700,
                letterSpacing:"0.15em", cursor:"pointer", transition:"all 0.15s",
              }}
            >
              {cavemanMode ? "◼ CAVEMAN ON" : "◻ CAVEMAN"}
            </button>
          </div>
        )}
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main style={{ flex:1, height:"100vh", overflow:"auto", position:"relative" }}>
        {children}
      </main>
    </div>
  );
}
