"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { WifiOff, Sparkles, Send, Loader2, Trash2, ExternalLink, Compass, Hammer, ShieldCheck, Play, LayoutDashboard, FolderOpen, RotateCw } from "lucide-react";

const LSK = "agentic-os/agent-kanban/v1";

type Stage = "queued" | "building" | "reviewing" | "done" | "rejected";
interface Card { id: string; title: string; brief: string; stage: Stage; bytes?: number; note?: string }
interface BuildRec { id: string; title: string; brief: string; goal: string; model: string; bytes: number; createdAt: number }
type Tab = "board" | "workspace";

const COLS: { key: Stage | "done"; label: string; accent: string; stages: Stage[] }[] = [
  { key: "queued", label: "Backlog", accent: "#a59783", stages: ["queued"] },
  { key: "building", label: "Building", accent: "#d4a574", stages: ["building"] },
  { key: "reviewing", label: "Review", accent: "#38bdf8", stages: ["reviewing"] },
  { key: "done", label: "Done", accent: "#5ab896", stages: ["done", "rejected"] },
];

const TEAM = [
  { key: "planner", name: "Planner", icon: Compass, accent: "#38bdf8", does: "breaks the goal into cards" },
  { key: "builder", name: "Builder", icon: Hammer, accent: "#d4a574", does: "builds each card" },
  { key: "reviewer", name: "Reviewer", icon: ShieldCheck, accent: "#5ab896", does: "checks it's really built" },
] as const;

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export default function AgentKanban() {
  const [goal, setGoal] = useState("");
  const [cards, setCards] = useState<Card[]>([]);
  const [model, setModel] = useState<string | null>(null);
  const [planning, setPlanning] = useState(false);
  const [running, setRunning] = useState(false);
  const [active, setActive] = useState<string | null>(null); // which team member is working
  const [err, setErr] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("board");
  const [ws, setWs] = useState<BuildRec[]>([]);
  const hydrated = useRef(false);

  useEffect(() => {
    try { const r = localStorage.getItem(LSK); if (r) { const d = JSON.parse(r); setCards(d.cards ?? []); setGoal(d.goal ?? ""); setModel(d.model ?? null); } } catch {}
    hydrated.current = true;
  }, []);
  useEffect(() => { if (hydrated.current) try { localStorage.setItem(LSK, JSON.stringify({ cards, goal, model })); } catch {} }, [cards, goal, model]);

  const loadWorkspace = useCallback(async () => {
    try { const r = await fetch("/api/agent-kanban/workspace", { cache: "no-store" }); const j = await r.json(); setWs(j.builds ?? []); } catch {}
  }, []);
  useEffect(() => { loadWorkspace(); }, [loadWorkspace]);
  async function delBuild(id: string) { setWs((w) => w.filter((b) => b.id !== id)); try { await fetch(`/api/agent-kanban/workspace?id=${id}`, { method: "DELETE" }); } catch {} }
  async function clearAllBuilds() {
    if (!ws.length || !confirm(`Delete all ${ws.length} builds from the workspace? This can't be undone.`)) return;
    const ids = ws.map((b) => b.id); setWs([]);
    for (const id of ids) { try { await fetch(`/api/agent-kanban/workspace?id=${id}`, { method: "DELETE" }); } catch {} }
  }

  const setCard = (id: string, patch: Partial<Card>) => setCards((cs) => cs.map((c) => (c.id === id ? { ...c, ...patch } : c)));

  const plan = useCallback(async () => {
    const g = goal.trim();
    if (!g || planning || running) return;
    setErr(null); setPlanning(true); setActive("planner"); setCards([]);
    try {
      const r = await fetch("/api/agent-kanban/plan", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ goal: g }) });
      const j = await r.json();
      if (j.cards?.length) { setModel(j.model); setCards(j.cards.map((c: Card) => ({ ...c, stage: "queued" as Stage }))); }
      else setErr(j.error || "the planner returned nothing");
    } catch (e) { setErr(`planner unreachable: ${String(e).slice(0, 120)}`); }
    setActive(null); setPlanning(false);
  }, [goal, planning, running]);

  const run = useCallback(async () => {
    if (running || planning) return;
    const queue = cards.filter((c) => c.stage === "queued" || c.stage === "rejected");
    if (!queue.length) return;
    setErr(null); setRunning(true);
    for (const card of queue) {
      setActive("builder"); setCard(card.id, { stage: "building", note: undefined });
      let res: { ok?: boolean; bytes?: number; verdict?: string; note?: string; model?: string } = {};
      try {
        const r = await fetch("/api/agent-kanban/build", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ id: card.id, title: card.title, brief: card.brief, goal }) });
        res = await r.json();
        if (res.model) setModel(res.model);
      } catch (e) { res = { ok: false, note: String(e).slice(0, 120) }; }
      // hand off to the Reviewer — let it visibly "check"
      setActive("reviewer"); setCard(card.id, { stage: "reviewing" });
      await sleep(950);
      setCard(card.id, { stage: res.ok ? "done" : "rejected", bytes: res.bytes, note: res.note });
    }
    setActive(null); setRunning(false);
    loadWorkspace(); // new builds are now saved in the workspace
  }, [cards, running, planning, goal, loadWorkspace]);

  function clearBoard() { if (confirm("Clear the board?")) { setCards([]); setModel(null); try { localStorage.removeItem(LSK); } catch {} } }

  const counts = (stages: Stage[]) => cards.filter((c) => stages.includes(c.stage)).length;
  const queuedLeft = cards.some((c) => c.stage === "queued" || c.stage === "rejected");

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* header */}
      <div className="flex items-center gap-3 mb-3 shrink-0 flex-wrap">
        <div className="w-8 h-8 rounded-lg grid place-items-center text-[#0b1410]" style={{ background: "linear-gradient(135deg,#7dd3fc,#5ab896)" }}><Sparkles size={17} /></div>
        <div className="min-w-0">
          <div className="text-[15px] font-semibold text-[var(--cream)] leading-none flex items-center gap-2">
            Agent Kanban
            <span className="inline-flex items-center gap-1 text-[10px] font-medium px-1.5 py-0.5 rounded-full" style={{ background: "#38bdf81e", color: "#38bdf8", border: "1px solid #38bdf840" }}><WifiOff size={9} /> offline team</span>
          </div>
          <div className="text-[10.5px] text-[var(--cream-mute)] mt-1">A team of local agents plans, builds + reviews — live, on your Mac{model ? ` · ${model}` : ""}</div>
        </div>
        {/* tabs */}
        <div className="ml-auto flex items-center gap-1 p-1 rounded-xl bg-[var(--bg-mid)] border border-[var(--line-soft)]">
          {([["board", "Board", LayoutDashboard], ["workspace", "Workspace", FolderOpen]] as const).map(([k, label, Icon]) => {
            const on = tab === k;
            return (
              <button key={k} onClick={() => { setTab(k); if (k === "workspace") loadWorkspace(); }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-medium transition"
                style={on ? { background: "#38bdf8", color: "#04121f" } : { color: "var(--cream-mute)" }}>
                <Icon size={13} /> {label}
                {k === "workspace" && ws.length > 0 && <span className="text-[9.5px] px-1 rounded-full" style={{ background: on ? "#04121f22" : "#38bdf81e", color: on ? "#04121f" : "#38bdf8" }}>{ws.length}</span>}
              </button>
            );
          })}
        </div>
        {/* team strip */}
        <div className="flex items-center gap-2">
          {TEAM.map((t) => {
            const on = active === t.key; const Icon = t.icon;
            return (
              <div key={t.key} title={`${t.name} — ${t.does}`} className="relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition"
                style={{ borderColor: on ? `${t.accent}` : "var(--line-soft)", background: on ? `${t.accent}1e` : "transparent" }}>
                <Icon size={14} style={{ color: t.accent }} className={on ? "animate-pulse" : ""} />
                <span className="text-[11px]" style={{ color: on ? t.accent : "var(--cream-mute)" }}>{t.name}</span>
                {on && <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full" style={{ background: t.accent, boxShadow: `0 0 8px ${t.accent}` }} />}
              </div>
            );
          })}
        </div>
      </div>

      {tab === "board" && (<>
      {/* composer */}
      <div className="flex items-end gap-2 mb-3 shrink-0">
        <input value={goal} onChange={(e) => setGoal(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") plan(); }}
          placeholder="Give the team a goal — e.g. 'a set of fun neon web toys' or 'a tiny finance toolkit'"
          className="flex-1 bg-[var(--bg-mid)] border border-[var(--line-soft)] rounded-xl px-3.5 py-2.5 text-[13.5px] text-[var(--cream)] placeholder:text-[var(--cream-mute)] focus:outline-none" />
        <button onClick={plan} disabled={!goal.trim() || planning || running} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold disabled:opacity-40" style={{ background: "#38bdf8", color: "#04121f" }}>
          {planning ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />} Assemble board
        </button>
        {queuedLeft && !planning && (
          <button onClick={run} disabled={running} className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold disabled:opacity-40" style={{ background: "#5ab896", color: "#08130d" }}>
            {running ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />} Run the team
          </button>
        )}
        {cards.length > 0 && <button onClick={clearBoard} title="Clear board" className="p-2.5 rounded-xl text-[var(--cream-mute)] hover:text-[var(--plum)] border border-[var(--line-soft)]"><Trash2 size={14} /></button>}
      </div>
      {err && <div className="text-[12px] text-[var(--plum)] bg-[rgba(196,96,126,0.08)] border border-[rgba(196,96,126,0.3)] rounded-lg px-3 py-2 mb-3 shrink-0">{err}</div>}

      {/* board */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1 min-h-0">
        {COLS.map((col) => (
          <div key={col.key} className="panel flex flex-col min-h-0 p-0 overflow-hidden">
            <div className="flex items-center gap-2 px-3 py-2.5 border-b border-[var(--line-soft)] shrink-0">
              <span className="w-2 h-2 rounded-full" style={{ background: col.accent, boxShadow: `0 0 8px ${col.accent}` }} />
              <span className="text-[12px] font-semibold uppercase tracking-wider" style={{ color: col.accent }}>{col.label}</span>
              <span className="ml-auto text-[10.5px] text-[var(--cream-mute)]">{counts(col.stages)}</span>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto scroll p-2 space-y-2">
              {cards.length === 0 && col.key === "queued" && !planning && (
                <div className="text-[11px] text-[var(--cream-mute)] p-3 text-center">Give the team a goal above — the Planner fills this column with cards.</div>
              )}
              {planning && col.key === "queued" && <div className="text-[11px] text-[var(--cream-mute)] p-3 inline-flex items-center gap-2"><Loader2 size={12} className="animate-spin" style={{ color: "#38bdf8" }} /> planning…</div>}
              <AnimatePresence>
                {cards.filter((c) => col.stages.includes(c.stage)).map((c) => (
                  <motion.div key={c.id} layout layoutId={c.id}
                    initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="rounded-xl p-2.5 border"
                    style={{ background: "var(--bg-card)", borderColor: c.stage === "rejected" ? "rgba(196,96,126,0.5)" : c.stage === "done" ? "rgba(90,184,150,0.45)" : "var(--line-soft)" }}>
                    <div className="text-[12.5px] font-medium text-[var(--cream)] leading-snug">{c.title}</div>
                    <div className="text-[10.5px] text-[var(--cream-mute)] mt-1 line-clamp-2">{c.brief}</div>

                    {c.stage === "building" && <div className="mt-2 text-[10px] inline-flex items-center gap-1.5" style={{ color: "#d4a574" }}><Hammer size={10} className="animate-pulse" /> building…</div>}
                    {c.stage === "reviewing" && <div className="mt-2 text-[10px] inline-flex items-center gap-1.5" style={{ color: "#38bdf8" }}><ShieldCheck size={10} className="animate-pulse" /> reviewing…</div>}
                    {c.stage === "rejected" && <div className="mt-2 text-[10px]" style={{ color: "var(--plum)" }}>⚠ {c.note || "no real build landed"}</div>}

                    {c.stage === "done" && (
                      <div className="mt-2">
                        <iframe src={`/api/agent-kanban/preview/${c.id}`} title={c.title} loading="lazy"
                          sandbox="allow-scripts allow-popups"
                          className="w-full rounded-lg border border-[var(--line-soft)] bg-black" style={{ aspectRatio: "16/10" }} />
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-[9.5px]" style={{ color: "#5ab896" }}>✓ {c.bytes ? `${(c.bytes / 1024).toFixed(1)}K` : "built"} · verified</span>
                          <button onClick={() => window.open(`/api/agent-kanban/preview/${c.id}`, "_blank")} className="ml-auto text-[9.5px] inline-flex items-center gap-1" style={{ color: "var(--gold)" }}><ExternalLink size={9} /> open</button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
      </>)}

      {/* WORKSPACE — every build the team has saved, persisted on disk */}
      {tab === "workspace" && (
        <div className="panel flex flex-col min-h-0 flex-1 p-0 overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2.5 border-b border-[var(--line-soft)] shrink-0">
            <FolderOpen size={14} style={{ color: "#7dd3fc" }} />
            <span className="text-[12.5px] text-[var(--cream)] font-medium">Workspace</span>
            <span className="text-[10.5px] text-[var(--cream-mute)]">{ws.length} build{ws.length === 1 ? "" : "s"} · saved on your Mac</span>
            <div className="ml-auto flex items-center gap-1.5">
              {ws.length > 0 && <button onClick={clearAllBuilds} className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] border border-[var(--line-soft)] text-[var(--cream-mute)] hover:text-[var(--plum)] hover:border-[rgba(196,96,126,0.4)]"><Trash2 size={11} /> Clear all</button>}
              <button onClick={loadWorkspace} title="Refresh" className="p-1.5 rounded-lg border border-[var(--line-soft)] text-[var(--cream-mute)] hover:text-[var(--cream)]"><RotateCw size={12} /></button>
            </div>
          </div>
          <div className="flex-1 min-h-0 overflow-y-auto scroll p-3">
            {ws.length === 0 ? (
              <div className="h-full grid place-items-center text-center"><div className="text-[11.5px] text-[var(--cream-mute)] max-w-[320px]">Nothing saved yet. Build a board and every card the team finishes lands here — kept on your Mac, ready to show off.</div></div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ws.map((b) => (
                  <div key={b.id} className="rounded-xl border border-[var(--line-soft)] overflow-hidden bg-[var(--bg-card)] hover:border-[#38bdf855] transition group">
                    <iframe src={`/api/agent-kanban/preview/${b.id}`} title={b.title} loading="lazy" sandbox="allow-scripts allow-popups" className="w-full bg-black border-0" style={{ aspectRatio: "16/10" }} />
                    <div className="p-2.5">
                      <div className="text-[12px] font-medium text-[var(--cream)] truncate">{b.title}</div>
                      {b.goal && <div className="text-[10px] text-[var(--cream-mute)] truncate mt-0.5">from: {b.goal}</div>}
                      <div className="flex items-center gap-2 mt-1.5">
                        <span className="text-[9.5px]" style={{ color: "#5ab896" }}>{(b.bytes / 1024).toFixed(1)}K</span>
                        <button onClick={() => window.open(`/api/agent-kanban/preview/${b.id}`, "_blank")} className="text-[9.5px] inline-flex items-center gap-1" style={{ color: "var(--gold)" }}><ExternalLink size={9} /> open</button>
                        <button onClick={() => { if (confirm(`Delete "${b.title}"?`)) delBuild(b.id); }} title="Delete this build" className="ml-auto inline-flex items-center gap-1 text-[9.5px] text-[var(--cream-mute)] hover:text-[var(--plum)] transition"><Trash2 size={11} /> delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
