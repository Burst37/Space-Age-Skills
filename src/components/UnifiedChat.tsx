"use client";
import { useState, useRef, useEffect, useCallback } from "react";

const CLI_AGENTS = ["claude", "gemini", "codex", "openclaw", "hermes"] as const;
const API_AGENTS = ["deepseek", "minimax", "gemma"] as const;
const ALL_AGENTS = [...CLI_AGENTS, ...API_AGENTS] as const;
type Agent = typeof ALL_AGENTS[number];

const AGENT_META: Record<Agent, { label: string; color: string; desc: string }> = {
  claude:    { label: "CLAUDE",      color: "#FF6B00", desc: "Orchestration · Planning" },
  gemini:    { label: "GEMINI",      color: "#4ade80", desc: "Multimodal · Long context" },
  codex:     { label: "CODEX",       color: "#7DF9FF", desc: "Code review · Adversarial" },
  openclaw:  { label: "OPENCLAW",    color: "#bf5af2", desc: "Multi-agent supervisor" },
  hermes:    { label: "HERMES",      color: "#f59e0b", desc: "VPS 24/7 · Telegram" },
  deepseek:  { label: "DEEPSEEK V4", color: "#38bdf8", desc: "Primary coding · 1.6T" },
  minimax:   { label: "MINIMAX 2.7", color: "#a855f7", desc: "Creative · Long context" },
  gemma:     { label: "GEMMA 3",     color: "#00ff88", desc: "Fast · Batch tasks" },
};

interface Msg {
  id: string;
  role: "user" | "agent";
  content: string;
  agent?: Agent;
  ts: number;
  durationMs?: number;
  isReview?: boolean;
}

function uid() { return Math.random().toString(36).slice(2); }

export default function UnifiedChat({
  defaultAgent = "claude",
  showAgentSwitcher = true,
}: {
  defaultAgent?: Agent;
  showAgentSwitcher?: boolean;
}) {
  const [agent, setAgent] = useState<Agent>(defaultAgent);
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [caveman, setCaveman] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const sendMessage = useCallback(async (text: string, targetAgent = agent) => {
    if (!text.trim() || loading) return;

    // Caveman slash command detection
    if (text.trim() === "/caveman" || text.trim() === "/caveman full") {
      setCaveman(true);
      setMsgs(p => [...p, { id: uid(), role: "agent", content: "caveman mode: ON. fragments. minimum connective tissue.", agent: targetAgent, ts: Date.now() }]);
      setInput("");
      return;
    }
    if (text.trim() === "/normal") {
      setCaveman(false);
      setMsgs(p => [...p, { id: uid(), role: "agent", content: "Normal mode restored.", agent: targetAgent, ts: Date.now() }]);
      setInput("");
      return;
    }

    const userMsg: Msg = { id: uid(), role: "user", content: text, ts: Date.now() };
    setMsgs(p => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const history = msgs.filter(m => m.role === "user" || m.role === "agent").slice(-20).map(m => ({
        role: m.role === "user" ? "user" as const : "assistant" as const,
        content: m.content,
      }));

      const sysPrompt = caveman
        ? "Caveman mode: compress ALL responses. Drop articles (a/an/the). Drop filler phrases. Use fragments. Max 1-2 sentences per concept. Code blocks stay complete. Technical terms stay exact. No greetings. No sign-off. Problem → Cause → Fix only."
        : "You are an AI agent in the Space Age Agent OS — a professional dashboard for Space Age AI Solutions. Be direct, execution-focused, and technical. No preamble or filler.";

      const res = await fetch("/api/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: targetAgent, messages: [...history, { role: "user", content: text }], systemPrompt: sysPrompt }),
      });

      const data = await res.json() as { content: string; durationMs: number; ok: boolean; error?: string };
      const agentMsg: Msg = {
        id: uid(),
        role: "agent",
        content: data.ok ? data.content : `Error: ${data.error || "unknown"}`,
        agent: targetAgent,
        ts: Date.now(),
        durationMs: data.durationMs,
      };
      setMsgs(p => [...p, agentMsg]);

      // Auto-log to vault
      fetch("/api/vault-write", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          path: `Daily Notes/${new Date().toISOString().slice(0,10)}.md`,
          content: `\n### ${new Date().toLocaleTimeString()} — ${targetAgent.toUpperCase()}\n**Q:** ${text}\n**A:** ${data.content?.slice(0,400)}...\n`,
          append: true,
        }),
      }).catch(() => {});
    } catch (e) {
      setMsgs(p => [...p, { id: uid(), role: "agent", content: `Network error: ${e}`, agent: targetAgent, ts: Date.now() }]);
    } finally {
      setLoading(false);
    }
  }, [agent, msgs, loading, caveman]);

  const handleReview = useCallback(async (msgContent: string) => {
    setMsgs(p => [...p, {
      id: uid(), role: "agent",
      content: "[three-brain] routing to CODEX adversarial review...",
      agent: "codex", ts: Date.now(), isReview: true,
    }]);
    await sendMessage(`Adversarial review — find bugs, risks, and what's wrong with this:\n\n${msgContent}`, "codex");
  }, [sendMessage]);

  const meta = AGENT_META[agent];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      {/* Agent identity bar */}
      <div style={{
        padding: "10px 20px",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center", gap: "12px",
        background: "rgba(255,255,255,0.02)",
      }}>
        <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: meta.color, boxShadow: `0 0 8px ${meta.color}`, flexShrink: 0 }} />
        <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "11px", fontWeight: 700, letterSpacing: "0.12em", color: meta.color }}>{meta.label}</span>
        <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "var(--fg-muted)" }}>{meta.desc}</span>
        <div style={{ flex: 1 }} />
        <button
          onClick={() => setCaveman(v => !v)}
          style={{ fontFamily: "Orbitron, sans-serif", fontSize: "9px", letterSpacing: "0.1em",
            background: caveman ? "var(--orange-dim)" : "transparent",
            border: `1px solid ${caveman ? "rgba(255,107,0,0.3)" : "var(--border)"}`,
            color: caveman ? "var(--orange)" : "var(--fg-muted)",
            padding: "3px 10px", borderRadius: "3px", cursor: "pointer" }}
        >
          {caveman ? "CAVEMAN ON" : "CAVEMAN OFF"}
        </button>
      </div>

      {/* Agent switcher */}
      {showAgentSwitcher && (
        <div style={{
          display: "flex", gap: "4px", padding: "8px 16px", overflowX: "auto",
          borderBottom: "1px solid var(--border)", background: "rgba(0,0,0,0.2)",
        }}>
          {ALL_AGENTS.map(a => (
            <button key={a}
              onClick={() => setAgent(a)}
              style={{
                fontFamily: "Orbitron, sans-serif", fontSize: "8px", fontWeight: 700,
                letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap",
                padding: "5px 10px", borderRadius: "3px", cursor: "pointer",
                background: agent === a ? `${AGENT_META[a].color}22` : "transparent",
                border: `1px solid ${agent === a ? AGENT_META[a].color : "var(--border)"}`,
                color: agent === a ? AGENT_META[a].color : "var(--fg-muted)",
                transition: "all 0.15s",
              }}
            >{AGENT_META[a].label}</button>
          ))}
        </div>
      )}

      {/* Message thread */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: "12px" }}>
        {msgs.length === 0 && (
          <div style={{ margin: "auto", textAlign: "center" }}>
            <div style={{ fontFamily: "Orbitron, sans-serif", fontSize: "11px", color: "var(--fg-muted)", letterSpacing: "0.15em" }}>
              READY
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "var(--fg-muted)", marginTop: "8px" }}>
              {meta.label} · {meta.desc}
            </div>
            <div style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "10px", color: "var(--fg-muted)", marginTop: "4px", opacity: 0.5 }}>
              /caveman — compress · /normal — restore
            </div>
          </div>
        )}
        {msgs.map(msg => (
          <div key={msg.id} style={{ display: "flex", flexDirection: "column", alignItems: msg.role === "user" ? "flex-end" : "flex-start" }}>
            <div className={msg.role === "user" ? "msg-user" : "msg-agent"} style={{
              ...(msg.isReview ? { borderColor: "rgba(125,249,255,0.3)", background: "rgba(125,249,255,0.05)" } : {}),
            }}>
              {msg.role === "agent" && (
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", paddingBottom: "6px", borderBottom: "1px solid var(--border)" }}>
                  <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: msg.agent ? AGENT_META[msg.agent]?.color : "var(--fg-muted)", flexShrink: 0 }} />
                  <span style={{ fontFamily: "Orbitron, sans-serif", fontSize: "8px", letterSpacing: "0.12em", color: msg.agent ? AGENT_META[msg.agent]?.color : "var(--fg-muted)" }}>
                    {msg.agent?.toUpperCase() || "AGENT"}
                  </span>
                  {msg.durationMs && (
                    <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "8px", color: "var(--fg-muted)", marginLeft: "auto" }}>
                      {msg.durationMs}ms
                    </span>
                  )}
                </div>
              )}
              <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word", lineHeight: 1.7 }}>{msg.content}</div>
            </div>
            {/* Three-brain review button on agent messages */}
            {msg.role === "agent" && !msg.isReview && (
              <button
                onClick={() => handleReview(msg.content)}
                style={{
                  marginTop: "4px", fontFamily: "Orbitron, sans-serif", fontSize: "8px",
                  letterSpacing: "0.1em", background: "transparent",
                  border: "1px solid rgba(125,249,255,0.2)", color: "rgba(125,249,255,0.5)",
                  padding: "3px 8px", borderRadius: "3px", cursor: "pointer",
                }}
              >
                ◉ CODEX REVIEW
              </button>
            )}
          </div>
        ))}
        {loading && (
          <div className="msg-agent" style={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: meta.color, animation: "pulse-led 0.8s ease-in-out infinite" }} />
            <span style={{ fontFamily: "JetBrains Mono, monospace", fontSize: "11px", color: "var(--fg-muted)" }}>
              {meta.label} processing...
            </span>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={{
        padding: "12px 16px",
        borderTop: "1px solid var(--border)",
        background: "rgba(255,255,255,0.02)",
        display: "flex", gap: "10px", alignItems: "flex-end",
      }}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage(input);
            }
          }}
          placeholder={`Message ${meta.label}... (Enter to send, Shift+Enter for newline)`}
          style={{
            flex: 1, resize: "none", minHeight: "40px", maxHeight: "160px",
            fontFamily: "DM Sans, sans-serif", fontSize: "14px",
            background: "var(--bg-card)", color: "var(--fg)",
            border: "1px solid var(--border)", borderRadius: "6px",
            padding: "10px 12px", outline: "none",
            lineHeight: 1.5,
          }}
          onFocus={e => { e.target.style.borderColor = meta.color; e.target.style.boxShadow = `0 0 0 2px ${meta.color}22`; }}
          onBlur={e => { e.target.style.borderColor = "var(--border)"; e.target.style.boxShadow = "none"; }}
          rows={1}
        />
        <button
          onClick={() => sendMessage(input)}
          disabled={loading || !input.trim()}
          className="btn-primary"
          style={{
            background: loading || !input.trim() ? "rgba(255,107,0,0.3)" : "var(--orange)",
            minWidth: "72px",
          }}
        >
          {loading ? "..." : "SEND"}
        </button>
      </div>
    </div>
  );
}
