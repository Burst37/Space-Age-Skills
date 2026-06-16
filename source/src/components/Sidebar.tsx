"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LayoutGrid, Brain, Sparkles as SparklesIcon, TrendingUp, Columns3, NotebookText, Film, Building2, Workflow, MessagesSquare, Image as ImageIcon, Gamepad2, Music2, Network } from "lucide-react";
import type { ReactNode } from "react";
import AgentAvatar from "./AgentAvatar";

interface NavItem {
  href: string;
  label: string;
  icon: ReactNode;
  accent: string;
  dim: string;
}

const NAV: NavItem[] = [
  { href: "/",         label: "Mission Control", icon: <LayoutGrid size={16} />, accent: "#a855f7", dim: "rgba(168,85,247,0.16)" },
  { href: "/paperclip", label: "Paperclip", icon: <Building2 size={16} />, accent: "#d4a574", dim: "rgba(212,165,116,0.16)" },
  { href: "/room",     label: "AI Agent Mastermind", icon: <MessagesSquare size={16} />, accent: "#a855f7", dim: "rgba(168,85,247,0.16)" },
  // Agents — use real avatar logos
  { href: "/claude",   label: "Claude",   icon: <AgentAvatar agent="claude" size={22} />,   accent: "#d97757", dim: "rgba(217,119,87,0.16)" },
  { href: "/openclaw", label: "OpenClaw", icon: <AgentAvatar agent="openclaw" size={22} />, accent: "#f472b6", dim: "rgba(244,114,182,0.16)" },
  { href: "/hermes",   label: "Hermes",   icon: <AgentAvatar agent="hermes" size={22} />,   accent: "#60a5fa", dim: "rgba(96,165,250,0.16)" },
  { href: "/gemini",   label: "Gemini",   icon: <AgentAvatar agent="gemini" size={22} />,   accent: "#4285F4", dim: "rgba(66,133,244,0.16)" },
  { href: "/antigravity", label: "Antigravity", icon: <AgentAvatar agent="antigravity" size={22} />, accent: "#7c3aed", dim: "rgba(124,58,237,0.16)" },
  { href: "/codex",       label: "Codex",       icon: <AgentAvatar agent="codex" size={22} />,       accent: "#22c55e", dim: "rgba(34,197,94,0.16)" },
  { href: "/kimi",        label: "Kimi Code",   icon: <AgentAvatar agent="kimi" size={22} />,        accent: "#00CCFF", dim: "rgba(0,204,255,0.16)" },
  { href: "/glm",         label: "GLM 5.2",     icon: <AgentAvatar agent="glm" size={22} />,         accent: "#34E5B0", dim: "rgba(52,229,176,0.16)" },
  { href: "/grok",        label: "Grok Build",  icon: <AgentAvatar agent="grok" size={22} />,        accent: "#cdd3f7", dim: "rgba(205,211,247,0.16)" },
  { href: "/freeclaude",  label: "Free Claude Code", icon: <AgentAvatar agent="fcc" size={22} />,    accent: "#10b981", dim: "rgba(16,185,129,0.16)" },
  { href: "/fusion",      label: "Fusion",      icon: <Network size={18} />,                         accent: "#d4a574", dim: "rgba(212,165,116,0.16)" },
  // Personal
  { href: "/pipeline", label: "Pipeline", icon: <Workflow size={16} />, accent: "#34d399", dim: "rgba(52,211,153,0.16)" },
  { href: "/seo",      label: "SEO",      icon: <TrendingUp size={16} />, accent: "#a3e635", dim: "rgba(163,230,53,0.16)" },
  { href: "/video",    label: "Video",    icon: <Film size={16} />,      accent: "#ef4444", dim: "rgba(239,68,68,0.16)" },
  { href: "/music",    label: "Music",    icon: <Music2 size={16} />,    accent: "#c084fc", dim: "rgba(192,132,252,0.16)" },
  { href: "/games",    label: "Game Studio", icon: <Gamepad2 size={16} />, accent: "#39ff8e", dim: "rgba(57,255,142,0.16)" },
  { href: "/thumbnails", label: "Thumbnails", icon: <ImageIcon size={16} />, accent: "#fb7185", dim: "rgba(251,113,133,0.16)" },
  { href: "/notebook", label: "Notebook", icon: <NotebookText size={16} />, accent: "#fde047", dim: "rgba(253,224,71,0.16)" },
  { href: "/kanban",   label: "Kanban",   icon: <Columns3 size={16} />,  accent: "#14b8a6", dim: "rgba(20,184,166,0.16)" },
  { href: "/memory",   label: "Memory",   icon: <Brain size={16} />,     accent: "#22d3ee", dim: "rgba(34,211,238,0.16)" },
  { href: "/guide",    label: "Build Guide", icon: <SparklesIcon size={16} />, accent: "#ec4899", dim: "rgba(236,72,153,0.16)" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden md:flex flex-col w-[244px] shrink-0 py-6 border-r border-[var(--line-soft)]"
           style={{ background: "var(--bg-mid)" }}>
      <Link href="/" className="block mb-7 px-5">
        <div className="text-[10px] uppercase tracking-[0.25em] mb-1" style={{ color: "var(--cream-mute)", fontFamily: "'Manrope', sans-serif", fontWeight: 600 }}>
          Local · Studio
        </div>
        <div className="text-xl tracking-tight" style={{ fontFamily: "'Bricolage Grotesque', sans-serif", fontWeight: 500, color: "var(--cream)" }}>
          Agentic <span className="hand text-[1.3em] ml-1">OS</span>
        </div>
      </Link>

      <div className="sidebar-section-label px-5 pb-1.5">
        Workspace
      </div>
      <nav className="flex flex-col gap-0.5 relative">
        {NAV.map((item, i) => {
          const agentRoutes = new Set(["/claude", "/openclaw", "/hermes", "/gemini", "/antigravity", "/codex", "/kimi", "/glm", "/grok", "/freeclaude", "/fusion"]);
          const isAgent = agentRoutes.has(item.href);
          const prev = i > 0 ? NAV[i - 1] : null;
          const wasAgent = prev ? agentRoutes.has(prev.href) : false;
          let sectionLabel: string | undefined;
          if (isAgent && !wasAgent)      sectionLabel = "Agents";
          else if (wasAgent && !isAgent) sectionLabel = "Self";

          const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <div key={item.href}>
              {sectionLabel && (
                <div className="sidebar-section-label mt-5 mb-1.5 px-5">
                  {sectionLabel}
                </div>
              )}
              <Link
                href={item.href}
                className={`sidebar-item relative group flex items-center gap-3 py-2.5 px-5 ${active ? "active" : ""}`}
              >
                {active && (
                  <motion.span
                    layoutId="nav-indicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-[2px] h-[22px]"
                    style={{ background: "var(--gold)", boxShadow: "0 0 10px var(--gold)" }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span
                  className="shrink-0 grid place-items-center w-7 h-7 rounded-md transition"
                  style={{
                    color: active ? "var(--gold)" : "var(--cream-dim)",
                  }}
                >
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="mt-auto pt-6 mx-5 border-t border-[var(--line-soft)]">
        <div className="sidebar-section-label mt-4 mb-2">Wired</div>
        <div className="text-[11px] leading-relaxed mono" style={{ color: "var(--cream-dim)" }}>
          claude · openclaw · hermes<br />
          <span className="hand text-[1.15em]">+</span> Obsidian vault
        </div>
      </div>
    </aside>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const items = NAV.filter((_, i) => i !== 5 && i !== 6); // hide goals/journal/memory on mobile bar for space
  return (
    <nav className="md:hidden fixed bottom-3 left-1/2 -translate-x-1/2 z-40 panel panel-hot px-2 py-1.5 flex gap-1">
      {items.map((item) => {
        const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="grid place-items-center w-10 h-10 rounded-lg transition"
            style={{
              background: active ? item.dim : "transparent",
              color: active ? item.accent : "var(--fg-dim)",
            }}
          >
            {item.icon}
          </Link>
        );
      })}
    </nav>
  );
}
