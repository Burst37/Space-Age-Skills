"use client";

import { useEffect, useState } from "react";
import {
  Users, Target, Search, Sparkles, Loader2, Download, Copy, Check, KeyRound,
  CheckCircle2, AlertCircle, Mail, Building2, MapPin, History as HistoryIcon, ArrowRight, Wand2, ExternalLink,
} from "lucide-react";

// Local copies of the lib types (never import the node lib into a client bundle).
interface ICP {
  brief: string; offer: string; titles: string[]; industries: string[];
  geos: string[]; keywords: string[]; companySize: string; notes: string;
}
interface Lead {
  id: string; name: string; firstName: string; title: string; company: string;
  domain: string; email: string; emailStatus: string; linkedin: string; location: string;
  source: string; score?: number; reason?: string; opener?: string; emailDraft?: string;
}
interface Company { name: string; domain: string }
interface Providers { hunter: boolean; apollo: boolean; model: boolean; modelId: string; hunterHint?: string; apolloHint?: string }
interface LeadRun { ts: number; source: string; brief: string; found: number; fresh: number; scored: number }
type Source = "auto" | "domains" | "csv" | "apollo";

const ACCENT = "#f59e0b";
const KEY_HELP: Record<"hunter" | "apollo", { name: string; url: string; where: string; cost: string }> = {
  hunter: { name: "Hunter.io", url: "https://hunter.io/api-keys", where: "Sign up → API Keys", cost: "Free tier ~25 searches/mo to test, then from ~$34/mo" },
  apollo: { name: "Apollo.io", url: "https://app.apollo.io/#/settings/integrations/api", where: "Settings → Integrations → API", cost: "Paid, from ~$49/mo" },
};

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const r = await fetch(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error((j as { error?: string })?.error || `HTTP ${r.status}`);
  return j as T;
}

function scoreColor(s?: number) {
  if (!s) return "#6b7280";
  if (s >= 75) return "#10b981";
  if (s >= 45) return "#f59e0b";
  return "#ef4444";
}

function StatusBadge({ st }: { st: string }) {
  const c = st === "deliverable" ? "#10b981" : st === "risky" ? "#f59e0b" : st === "undeliverable" ? "#ef4444" : "#6b7280";
  return <span style={{ color: c, fontSize: ".68rem", fontFamily: "JetBrains Mono, monospace", marginLeft: 4 }}>{st || "unknown"}</span>;
}

export default function LeadsView() {
  const [providers, setProviders] = useState<Providers | null>(null);
  const [history, setHistory] = useState<LeadRun[]>([]);
  const [tab, setTab] = useState<"find" | "key" | "hist">("find");
  const [source, setSource] = useState<Source>("auto");
  const [brief, setBrief] = useState("");
  const [offer, setOffer] = useState("");
  const [csvText, setCsvText] = useState("");
  const [domainsText, setDomainsText] = useState("");
  const [icp, setIcp] = useState<ICP | null>(null);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [step, setStep] = useState<"idle" | "icp" | "find" | "enrich" | "score" | "done">("idle");
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState("");
  const [hunterKey, setHunterKey] = useState("");
  const [apolloKey, setApolloKey] = useState("");
  const [savingKey, setSavingKey] = useState<"" | "hunter" | "apollo">("" );
  const [keySaved, setKeySaved] = useState<"" | "hunter" | "apollo">("" );
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const loadStatus = () => {
    fetch("/api/leads/status").then(r => r.json()).then(d => {
      setProviders(d.providers || null);
      setHistory(d.history || []);
    }).catch(() => {});
  };
  useEffect(() => { loadStatus(); }, []);

  const saveKey = async (provider: "hunter" | "apollo") => {
    const key = provider === "hunter" ? hunterKey : apolloKey;
    if (!key.trim()) return;
    setSavingKey(provider);
    try {
      const r = await fetch("/api/leads/keys", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ provider, key }) });
      const d = await r.json();
      if (d.ok) { setKeySaved(provider); setTimeout(() => setKeySaved(""), 2000); loadStatus(); if (provider === "hunter") setHunterKey(""); else setApolloKey(""); }
      else setErr(d.error || "Save failed");
    } catch (e) { setErr(String((e as Error)?.message)); }
    finally { setSavingKey(""); }
  };

  const run = async () => {
    setErr(null); setLeads([]); setCompanies([]); setIcp(null);
    try {
      let activeIcp = icp;
      if (source === "auto" || source === "apollo") {
        setStep("icp"); setMsg("Parsing your ideal customer…");
        const d = await postJson<{ icp: ICP }>("/api/leads/icp", { brief, offer });
        activeIcp = d.icp; setIcp(d.icp);
      }
      setStep("find"); setMsg("Finding leads…");
      const body: Record<string, unknown> = { source, icp: activeIcp };
      if (source === "csv") body.csv = csvText;
      if (source === "domains") body.domains = domainsText;
      const fd = await postJson<{ leads: Lead[]; companies?: Company[]; needsHunter?: boolean }>("/api/leads/find", body);
      if (fd.companies?.length) setCompanies(fd.companies);
      if (fd.needsHunter) { setErr("Add your Hunter.io key (free) to pull contacts from these companies →"); setStep("done"); return; }
      let list: Lead[] = fd.leads || [];
      if (list.length && source !== "csv") {
        setStep("enrich"); setMsg(`Enriching ${list.length} leads with Hunter…`);
        const ed = await postJson<{ leads: Lead[]; skipped: number }>("/api/leads/enrich", { leads: list });
        list = ed.leads;
      }
      if (list.length && activeIcp) {
        setStep("score"); setMsg(`Scoring & personalising ${list.length} leads…`);
        const sd = await postJson<{ leads: Lead[] }>("/api/leads/score", { icp: activeIcp, leads: list });
        list = sd.leads;
      }
      setLeads(list); setStep("done"); setMsg(""); loadStatus();
    } catch (e) { setErr(String((e as Error)?.message || e)); setStep("idle"); }
  };

  const exportCsv = async () => {
    const r = await fetch("/api/leads/export", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ leads }) });
    const blob = await r.blob();
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = `leads-${leads.length}.csv`; a.click();
  };

  const copyText = (id: string, text: string) => {
    navigator.clipboard?.writeText(text).then(() => { setCopied(id); setTimeout(() => setCopied(null), 1600); });
  };

  const busy = step !== "idle" && step !== "done";
  const canRun = !busy && ((source === "auto" || source === "apollo") ? brief.trim().length > 4 : source === "csv" ? csvText.trim().length > 10 : domainsText.trim().length > 3);

  return (
    <div style={{ color: "#dbeafe", fontFamily: "Manrope, system-ui, sans-serif", maxWidth: 900, margin: "0 auto", padding: "0 4px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", padding: "13px 18px", border: "1px solid rgba(245,158,11,.22)", borderRadius: 14, background: "linear-gradient(180deg,rgba(245,158,11,.06),rgba(245,158,11,.01))" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "JetBrains Mono,monospace", fontSize: ".66rem", letterSpacing: ".18em", textTransform: "uppercase" as const, color: ACCENT }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 10px ${ACCENT}` }} />
          LEADS
        </span>
        <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".72rem", color: "#6b7a8d" }}>Find scored prospects — ready for outreach</span>
        <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
          {(["find", "key", "hist"] as const).map(t => (
            <button key={t} onClick={() => setTab(t)} style={{ padding: "7px 16px", borderRadius: 999, border: `1px solid ${tab === t ? ACCENT : "rgba(255,255,255,.15)"}`, background: tab === t ? ACCENT : "transparent", color: tab === t ? "#0a0500" : "#cbd5e1", fontWeight: tab === t ? 700 : 400, fontFamily: "JetBrains Mono,monospace", fontSize: ".72rem", cursor: "pointer" }}>
              {t === "find" ? "Find" : t === "key" ? "Keys" : "History"}
            </button>
          ))}
        </div>
      </div>

      {tab === "key" && (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column" as const, gap: 16 }}>
          {(["hunter", "apollo"] as const).map(p => {
            const info = KEY_HELP[p];
            const connected = providers ? providers[p] : false;
            const hint = p === "hunter" ? providers?.hunterHint : providers?.apolloHint;
            return (
              <div key={p} style={{ border: `1px solid ${connected ? "rgba(16,185,129,.3)" : "rgba(255,255,255,.1)"}`, borderRadius: 14, padding: "18px 22px", background: "rgba(255,255,255,.03)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  {connected ? <CheckCircle2 size={16} color="#10b981" /> : <AlertCircle size={16} color="#6b7280" />}
                  <span style={{ fontFamily: "Bricolage Grotesque,sans-serif", fontWeight: 700 }}>{info.name}</span>
                  {connected && <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".7rem", color: "#10b981" }}>connected {hint ? `(••••${hint.slice(-4)})` : ""}</span>}
                  {!connected && <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".7rem", color: "#6b7280" }}>not connected</span>}
                </div>
                <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".72rem", color: "#6b7280", margin: "0 0 12px" }}>{info.cost} — <a href={info.url} target="_blank" rel="noreferrer" style={{ color: ACCENT }}>{info.where}</a></p>
                <div style={{ display: "flex", gap: 8 }}>
                  <input value={p === "hunter" ? hunterKey : apolloKey} onChange={e => p === "hunter" ? setHunterKey(e.target.value) : setApolloKey(e.target.value)}
                    placeholder={`Paste your ${info.name} API key`}
                    style={{ flex: 1, background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 8, padding: "9px 14px", color: "#f1f5f9", fontFamily: "JetBrains Mono,monospace", fontSize: ".8rem" }} />
                  <button onClick={() => saveKey(p)} disabled={savingKey === p || !(p === "hunter" ? hunterKey : apolloKey).trim()}
                    style={{ padding: "9px 18px", borderRadius: 8, background: ACCENT, color: "#0a0500", fontWeight: 700, border: 0, cursor: "pointer", fontFamily: "JetBrains Mono,monospace", fontSize: ".78rem", display: "flex", alignItems: "center", gap: 6 }}>
                    {savingKey === p ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : keySaved === p ? <Check size={14} /> : <KeyRound size={14} />}
                    {savingKey === p ? "Saving…" : keySaved === p ? "Saved!" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "hist" && (
        <div style={{ marginTop: 20 }}>
          {history.length === 0 ? (
            <div style={{ textAlign: "center", color: "#6b7280", fontFamily: "JetBrains Mono,monospace", fontSize: ".8rem", padding: "40px 0" }}>No runs yet — find some leads first.</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 8 }}>
              {history.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "center", padding: "12px 18px", border: "1px solid rgba(255,255,255,.08)", borderRadius: 10, background: "rgba(255,255,255,.02)", flexWrap: "wrap" as const }}>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".7rem", color: "#6b7280" }}>{new Date(r.ts).toLocaleString()}</span>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".7rem", color: ACCENT }}>{r.source}</span>
                  <span style={{ flex: 1, fontFamily: "Manrope,sans-serif", fontSize: ".82rem", color: "#cbd5e1", minWidth: 160 }}>{r.brief}</span>
                  <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".7rem", color: "#10b981" }}>✓ {r.scored} scored</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {tab === "find" && (
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column" as const, gap: 20 }}>
          {/* Source selector */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
            {(["auto", "domains", "csv", "apollo"] as Source[]).map(s => (
              <button key={s} onClick={() => setSource(s)}
                style={{ padding: "8px 18px", borderRadius: 999, border: `1px solid ${source === s ? ACCENT : "rgba(255,255,255,.15)"}`, background: source === s ? `${ACCENT}22` : "transparent", color: source === s ? ACCENT : "#94a3b8", fontFamily: "JetBrains Mono,monospace", fontSize: ".76rem", cursor: "pointer", fontWeight: source === s ? 700 : 400 }}>
                {s === "auto" ? "Auto (AI + Hunter)" : s === "domains" ? "Domains (Hunter)" : s === "csv" ? "Paste CSV" : "Apollo"}
              </button>
            ))}
          </div>

          {/* ICP inputs */}
          {(source === "auto" || source === "apollo") && (
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 10 }}>
              <textarea value={brief} onChange={e => setBrief(e.target.value)} rows={2} placeholder="Your ideal customer — e.g. 'marketing directors at Series A SaaS companies in the US'…"
                style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontFamily: "Manrope,sans-serif", fontSize: ".9rem", resize: "vertical" as const, boxSizing: "border-box" as const }} />
              <input value={offer} onChange={e => setOffer(e.target.value)} placeholder="What you're offering them (optional — improves openers)…"
                style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "10px 14px", color: "#f1f5f9", fontFamily: "Manrope,sans-serif", fontSize: ".85rem", boxSizing: "border-box" as const }} />
            </div>
          )}
          {source === "domains" && (
            <textarea value={domainsText} onChange={e => setDomainsText(e.target.value)} rows={4} placeholder="One domain per line or comma-separated — stripe.com, linear.app…"
              style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontFamily: "JetBrains Mono,monospace", fontSize: ".8rem", resize: "vertical" as const, boxSizing: "border-box" as const }} />
          )}
          {source === "csv" && (
            <textarea value={csvText} onChange={e => setCsvText(e.target.value)} rows={6} placeholder="Paste CSV with header row — name, email, company, title…"
              style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.12)", borderRadius: 10, padding: "12px 14px", color: "#f1f5f9", fontFamily: "JetBrains Mono,monospace", fontSize: ".78rem", resize: "vertical" as const, boxSizing: "border-box" as const }} />
          )}

          {/* Run button */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={run} disabled={!canRun}
              style={{ display: "inline-flex", alignItems: "center", gap: 10, background: ACCENT, color: "#0a0500", fontWeight: 800, fontFamily: "Bricolage Grotesque,sans-serif", padding: "12px 26px", borderRadius: 999, border: 0, cursor: canRun ? "pointer" : "default", opacity: canRun ? 1 : .55, boxShadow: `0 0 26px ${ACCENT}55`, fontSize: "1rem" }}>
              {busy ? <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> : <Sparkles size={16} />}
              {busy ? msg : "Find Leads"}
            </button>
            {leads.length > 0 && (
              <button onClick={exportCsv} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 999, border: "1px solid rgba(255,255,255,.2)", background: "transparent", color: "#cbd5e1", cursor: "pointer", fontFamily: "JetBrains Mono,monospace", fontSize: ".76rem" }}>
                <Download size={14} /> Export CSV ({leads.length})
              </button>
            )}
          </div>

          {err && <div style={{ color: "#fca5a5", fontFamily: "JetBrains Mono,monospace", fontSize: ".8rem", background: "rgba(239,68,68,.08)", border: "1px solid rgba(239,68,68,.25)", borderRadius: 8, padding: "10px 14px" }}>{err}</div>}

          {/* Progress steps */}
          {busy && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" as const }}>
              {(["icp", "find", "enrich", "score"] as const).map(s => {
                const done = ["icp", "find", "enrich", "score", "done"].indexOf(step) > ["icp", "find", "enrich", "score", "done"].indexOf(s);
                const active = step === s;
                return (
                  <span key={s} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "JetBrains Mono,monospace", fontSize: ".68rem", color: done ? "#10b981" : active ? ACCENT : "#6b7280", padding: "4px 10px", borderRadius: 999, border: `1px solid ${done ? "rgba(16,185,129,.3)" : active ? `${ACCENT}55` : "rgba(255,255,255,.08)"}` }}>
                    {done ? <Check size={11} /> : active ? <Loader2 size={11} style={{ animation: "spin 1s linear infinite" }} /> : null}
                    {s === "icp" ? "Parse ICP" : s === "find" ? "Find" : s === "enrich" ? "Enrich" : "Score"}
                  </span>
                );
              })}
            </div>
          )}

          {/* Company suggestions (auto mode) */}
          {companies.length > 0 && (
            <div>
              <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".7rem", color: "#6b7280", marginBottom: 8 }}>TARGET COMPANIES ({companies.length})</p>
              <div style={{ display: "flex", flexWrap: "wrap" as const, gap: 6 }}>
                {companies.map((c, i) => (
                  <span key={i} style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".72rem", padding: "4px 10px", borderRadius: 999, border: "1px solid rgba(245,158,11,.25)", color: "#fcd34d", background: "rgba(245,158,11,.06)" }}>{c.name}</span>
                ))}
              </div>
            </div>
          )}

          {/* Lead cards */}
          {leads.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column" as const, gap: 12 }}>
              <p style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".7rem", color: "#6b7280", margin: 0 }}>LEADS ({leads.length})</p>
              {leads.map(l => (
                <div key={l.id} onClick={() => setExpanded(expanded === l.id ? null : l.id)}
                  style={{ border: `1px solid ${expanded === l.id ? `${ACCENT}55` : "rgba(255,255,255,.1)"}`, borderRadius: 12, padding: "14px 18px", background: "rgba(255,255,255,.03)", cursor: "pointer", transition: "border-color .15s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" as const }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: `${scoreColor(l.score)}22`, border: `1px solid ${scoreColor(l.score)}55`, display: "grid", placeItems: "center", flexShrink: 0 }}>
                      <span style={{ fontFamily: "Bricolage Grotesque,sans-serif", fontWeight: 800, fontSize: ".85rem", color: scoreColor(l.score) }}>{l.score ?? "?"}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const }}>
                        <span style={{ fontWeight: 700, color: "#f1f5f9", fontFamily: "Manrope,sans-serif" }}>{l.name}</span>
                        <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".7rem", color: "#6b7280" }}>{l.title}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" as const, marginTop: 2 }}>
                        <Building2 size={11} color="#6b7280" />
                        <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".72rem", color: "#94a3b8" }}>{l.company}</span>
                        {l.location && <><MapPin size={11} color="#6b7280" /><span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".72rem", color: "#6b7280" }}>{l.location}</span></>}
                      </div>
                    </div>
                    <div style={{ textAlign: "right" as const, minWidth: 120 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                        <Mail size={12} color="#6b7280" />
                        <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".72rem", color: l.email ? "#cbd5e1" : "#6b7280" }}>{l.email || "no email"}</span>
                        {l.email && <StatusBadge st={l.emailStatus} />}
                      </div>
                      {l.reason && <p style={{ margin: "3px 0 0", fontFamily: "Manrope,sans-serif", fontSize: ".74rem", color: "#94a3b8", textAlign: "right" as const }}>{l.reason}</p>}
                    </div>
                  </div>

                  {expanded === l.id && (
                    <div style={{ marginTop: 14, borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 14, display: "flex", flexDirection: "column" as const, gap: 12 }}>
                      {l.opener && (
                        <div style={{ background: "rgba(245,158,11,.06)", border: "1px solid rgba(245,158,11,.2)", borderRadius: 8, padding: "10px 14px" }}>
                          <p style={{ margin: "0 0 4px", fontFamily: "JetBrains Mono,monospace", fontSize: ".66rem", color: ACCENT, letterSpacing: ".12em", textTransform: "uppercase" as const }}>Opener</p>
                          <p style={{ margin: 0, fontFamily: "Manrope,sans-serif", fontSize: ".88rem", color: "#f1f5f9" }}>{l.opener}</p>
                        </div>
                      )}
                      {l.emailDraft && (
                        <div style={{ background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", borderRadius: 8, padding: "10px 14px" }}>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                            <p style={{ margin: 0, fontFamily: "JetBrains Mono,monospace", fontSize: ".66rem", color: "#6b7280", letterSpacing: ".12em", textTransform: "uppercase" as const }}>Email Draft</p>
                            <button onClick={e => { e.stopPropagation(); copyText(l.id, l.emailDraft!); }} style={{ background: "none", border: "none", cursor: "pointer", color: copied === l.id ? "#10b981" : "#6b7280", display: "flex", alignItems: "center", gap: 4, padding: 4 }}>
                              {copied === l.id ? <Check size={13} /> : <Copy size={13} />}
                              <span style={{ fontFamily: "JetBrains Mono,monospace", fontSize: ".66rem" }}>{copied === l.id ? "Copied" : "Copy"}</span>
                            </button>
                          </div>
                          <p style={{ margin: 0, fontFamily: "Manrope,sans-serif", fontSize: ".86rem", color: "#cbd5e1", whiteSpace: "pre-wrap" as const }}>{l.emailDraft}</p>
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" as const }}>
                        {l.linkedin && <a href={l.linkedin} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "JetBrains Mono,monospace", fontSize: ".72rem", color: "#60a5fa", textDecoration: "none" }}><ExternalLink size={11} /> LinkedIn</a>}
                        {l.domain && <a href={`https://${l.domain}`} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: "JetBrains Mono,monospace", fontSize: ".72rem", color: "#60a5fa", textDecoration: "none" }}><ExternalLink size={11} /> {l.domain}</a>}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {step === "done" && leads.length === 0 && !err && (
            <div style={{ textAlign: "center", padding: "40px 0", color: "#6b7280", fontFamily: "JetBrains Mono,monospace", fontSize: ".82rem" }}>No new leads found — try a different source or description.</div>
          )}
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}