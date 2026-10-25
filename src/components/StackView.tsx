"use client";
import { useEffect, useMemo, useState } from "react";

type Tool = { name: string; cat: string; via: string; url: string; cost: number | null; status: string };
type Routine = { name: string; kind: "active" | "passive"; schedule: string; capUsdWeek: number | null; note: string };
type Skill = { name: string; model: string; description: string };
const TABS = ["Tools", "Skills", "Routines"] as const;
const MODELS = ["haiku", "sonnet", "opus"];
const card = { background: "var(--glass)", border: "1px solid var(--glass-border)", borderRadius: 8, padding: 12 } as const;
const input = { background: "transparent", border: "1px solid var(--glass-border)", color: "var(--fg)", borderRadius: 4, padding: "3px 6px", fontSize: 12 } as const;

export default function StackView() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("Tools");
  const [tools, setTools] = useState<Tool[]>([]);
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [q, setQ] = useState("");
  const [report, setReport] = useState("");
  const [picked, setPicked] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch("/api/stack").then((r) => r.json()).then((d) => { setTools(d.tools); setRoutines(d.routines); setSkills(d.skills); });
  }, []);

  const save = (t: Tool[], r: Routine[]) => {
    setTools(t); setRoutines(r);
    fetch("/api/stack", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ tools: t, routines: r }) });
  };
  const setTool = (i: number, p: Partial<Tool>) => save(tools.map((t, j) => (j === i ? { ...t, ...p } : t)), routines);
  const setRoutine = (i: number, p: Partial<Routine>) => save(tools, routines.map((r, j) => (j === i ? { ...r, ...p } : r)));

  const monthly = tools.reduce((s, t) => s + (t.cost || 0), 0);
  const groups = useMemo(() => {
    const g: Record<string, { t: Tool; i: number }[]> = {};
    tools.forEach((t, i) => { if (t.name.toLowerCase().includes(q.toLowerCase())) (g[t.cat] ||= []).push({ t, i }); });
    return g;
  }, [tools, q]);

  const run = async (skill: string) => {
    setReport(`running ${skill}…`);
    const r = await fetch("/api/stack", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ skill, model: picked[skill] ?? "" }) });
    setReport((await r.json()).report || "no output");
  };

  return (
    <div style={{ padding: 24, color: "var(--fg)", fontFamily: "DM Sans,sans-serif" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
        <h1 style={{ fontFamily: "Orbitron,sans-serif", fontSize: 16, letterSpacing: "0.12em" }}>STACK</h1>
        <span style={{ color: "var(--orange)", fontFamily: "JetBrains Mono,monospace" }}>${monthly.toFixed(0)}/mo</span>
        <span style={{ color: "var(--fg-dim)", fontSize: 12 }}>{tools.length} tools · {skills.length} skills · {routines.length} routines</span>
      </div>
      <div style={{ display: "flex", gap: 6, margin: "14px 0" }}>
        {TABS.map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ ...input, padding: "5px 12px", cursor: "pointer", borderColor: tab === t ? "var(--orange)" : undefined, color: tab === t ? "var(--orange)" : "var(--fg-dim)" }}>{t}</button>
        ))}
        {tab === "Tools" && <input placeholder="search" value={q} onChange={(e) => setQ(e.target.value)} style={{ ...input, marginLeft: "auto" }} />}
      </div>

      {tab === "Tools" && Object.entries(groups).map(([cat, items]) => (
        <section key={cat} style={{ marginBottom: 18 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "var(--fg-muted)", marginBottom: 6 }}>{cat.toUpperCase()}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 8 }}>
            {items.map(({ t, i }) => (
              <div key={t.name} style={card}>
                <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 600, fontSize: 13 }}>
                  {t.url ? <a href={t.url} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>{t.name} ↗</a> : t.name}
                  <span style={{ fontSize: 10, color: "var(--fg-dim)" }}>{t.via}</span>
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                  <select value={t.status} onChange={(e) => setTool(i, { status: e.target.value })} style={input}>
                    {["connected", "manual", "needs-auth", "unused"].map((s) => <option key={s}>{s}</option>)}
                  </select>
                  <input type="number" min={0} placeholder="$/mo" value={t.cost ?? ""} onChange={(e) => setTool(i, { cost: e.target.value === "" ? null : +e.target.value })} style={{ ...input, width: 70 }} />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}

      {tab === "Skills" && (
        <>
          <p style={{ color: "var(--fg-dim)", fontSize: 12 }}>Pin simple skills to haiku/sonnet via `model:` in SKILL.md. Run uses `claude -p` with the model picked here.</p>
          {skills.map((s) => (
            <div key={s.name} style={{ ...card, marginBottom: 6, display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                <b style={{ fontSize: 13 }}>{s.name}</b> <span style={{ color: "var(--fg-muted)", fontSize: 11 }}>model: {s.model}</span>
                <div style={{ color: "var(--fg-dim)", fontSize: 11, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.description}</div>
              </div>
              <select value={picked[s.name] ?? ""} onChange={(e) => setPicked({ ...picked, [s.name]: e.target.value })} style={input}>
                <option value="">default</option>{MODELS.map((m) => <option key={m}>{m}</option>)}
              </select>
              <button onClick={() => run(s.name)} style={{ ...input, cursor: "pointer", color: "var(--orange)" }}>▶ run</button>
            </div>
          ))}
          {report && <pre style={{ ...card, whiteSpace: "pre-wrap", fontSize: 12, marginTop: 12 }}>{report}</pre>}
        </>
      )}

      {tab === "Routines" && routines.map((r, i) => (
        <div key={r.name} style={{ ...card, marginBottom: 6, display: "flex", gap: 10, alignItems: "center" }}>
          <b style={{ flex: 1, fontSize: 13 }}>{r.name} <span style={{ color: "var(--fg-muted)", fontWeight: 400 }}>{r.schedule}</span></b>
          <select value={r.kind} onChange={(e) => setRoutine(i, { kind: e.target.value as Routine["kind"] })} style={input}><option>active</option><option>passive</option></select>
          <input type="number" min={0} placeholder="cap $/wk" value={r.capUsdWeek ?? ""} onChange={(e) => setRoutine(i, { capUsdWeek: e.target.value === "" ? null : +e.target.value })} style={{ ...input, width: 80 }} />
        </div>
      ))}
    </div>
  );
}
