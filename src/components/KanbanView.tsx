"use client";
import { useState } from "react";

const COLUMNS = ["Backlog","In Progress","Review","Done"];
const INIT_CARDS: Record<string, { id: string; title: string; tag: string; color: string }[]> = {
  "Backlog":     [
    { id:"k1", title:"WYSIWYG Eyewear brand identity", tag:"Brand", color:"var(--purple)" },
    { id:"k2", title:"Voice agent Vapi deploy", tag:"Pipeline", color:"var(--orange)" },
  ],
  "In Progress": [
    { id:"k3", title:"Agent OS Dashboard build", tag:"Dev", color:"var(--cyan)" },
    { id:"k4", title:"Google Maps scraper optimization", tag:"Pipeline", color:"var(--orange)" },
  ],
  "Review":      [{ id:"k5", title:"Verdant Pro demo site", tag:"Client", color:"var(--green)" }],
  "Done":        [{ id:"k6", title:"Cold email templates v2", tag:"Outreach", color:"var(--agent-hermes)" }],
};

export default function KanbanView() {
  const [cards, setCards] = useState(INIT_CARDS);
  const [newTitle, setNewTitle] = useState("");

  function addCard() {
    if (!newTitle.trim()) return;
    const id = `k${Date.now()}`;
    setCards(prev => ({ ...prev, Backlog: [{ id, title: newTitle, tag: "Task", color: "var(--fg-dim)" }, ...prev.Backlog] }));
    setNewTitle("");
  }

  return (
    <div style={{ padding: "28px 32px" }}>
      <div style={{ marginBottom: 20 }}>
        <div className="section-label" style={{ marginBottom: 6 }}>Space Age</div>
        <h1 style={{ fontSize: 16, letterSpacing: "0.1em" }}>PROJECT KANBAN</h1>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <input value={newTitle} onChange={e => setNewTitle(e.target.value)}
          onKeyDown={e => e.key === "Enter" && addCard()}
          placeholder="Add task…"
          style={{ flex: 1, padding: "8px 12px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 5, color: "var(--fg)", fontFamily: "DM Sans, sans-serif", fontSize: 12, outline: "none" }}
        />
        <button onClick={addCard} className="btn-primary" style={{ fontSize: 9 }}>ADD</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {COLUMNS.map(col => (
          <div key={col} className="glass" style={{ borderRadius: 8, overflow: "hidden" }}>
            <div style={{
              padding: "10px 14px", borderBottom: "1px solid var(--border)",
              fontFamily: "Orbitron, sans-serif", fontSize: 9, fontWeight: 700,
              letterSpacing: "0.15em", color: "var(--fg-muted)",
              display: "flex", justifyContent: "space-between",
            }}>
              {col.toUpperCase()}
              <span style={{ color: "var(--orange)" }}>{cards[col]?.length || 0}</span>
            </div>
            <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6, minHeight: 120 }}>
              {(cards[col] || []).map(card => (
                <div key={card.id} style={{
                  padding: "8px 10px",
                  background: "var(--bg-elevated)",
                  border: "1px solid var(--border)",
                  borderLeft: `2px solid ${card.color}`,
                  borderRadius: 4,
                }}>
                  <div style={{ fontFamily: "DM Sans, sans-serif", fontSize: 11, color: "var(--fg)", marginBottom: 3 }}>{card.title}</div>
                  <span style={{
                    fontFamily: "JetBrains Mono, monospace", fontSize: 8,
                    padding: "1px 5px", borderRadius: 3,
                    background: `${card.color}22`, color: card.color,
                  }}>{card.tag}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
