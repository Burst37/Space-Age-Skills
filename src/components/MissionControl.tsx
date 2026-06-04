'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

const AGENTS = [
  { id: 'claude',   label: 'Claude',    role: 'Orchestrator',   color: '#ff6b00', status: 'online',  model: 'sonnet-4.6',    ctx: '200K' },
  { id: 'codex',    label: 'Codex',     role: 'Code / Rescue',  color: '#00e5ff', status: 'online',  model: 'o3',            ctx: '128K' },
  { id: 'gemini',   label: 'Gemini',    role: 'Multimodal',     color: '#4285f4', status: 'idle',    model: 'flash-2.5',     ctx: '1M'   },
  { id: 'openclaw', label: 'OpenClaw',  role: 'Swarm',          color: '#9c40ff', status: 'idle',    model: 'gpt-4o',        ctx: '128K' },
  { id: 'hermes',   label: 'Hermes',    role: 'VPS · 24/7',     color: '#f5a623', status: 'online',  model: '146.190.78.120',ctx: 'VPS'  },
  { id: 'deepseek', label: 'DeepSeek',  role: 'Primary Code',   color: '#38bdf8', status: 'idle',    model: 'v4-pro',        ctx: '128K' },
]

const QUICK = [
  { label: 'Terminal',    icon: '>_',  href: '/terminal' },
  { label: 'Pipeline',   icon: '⇶',   href: '/pipeline' },
  { label: 'Image',      icon: '◈',   href: '/studio'   },
  { label: 'Video',      icon: '▶',   href: '/video'    },
  { label: 'Kanban',     icon: '▦',   href: '/kanban'   },
  { label: 'Journal',    icon: '✦',   href: '/journal'  },
  { label: 'Lessons',    icon: '◬',   href: '/lessons'  },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } }
}

function LED({ status }: { status: string }) {
  const colors: Record<string, string> = {
    online: '#00e676',
    idle:   '#5a618a',
    busy:   '#ff6b00',
  }
  const c = colors[status] ?? colors.idle
  const pulse = status === 'online' || status === 'busy'
  return (
    <span style={{
      display: 'inline-block',
      width: 7, height: 7,
      borderRadius: '50%',
      background: c,
      boxShadow: pulse ? `0 0 6px ${c}, 0 0 12px ${c}55` : 'none',
      flexShrink: 0,
      animation: pulse ? 'ledpulse 2.5s ease-in-out infinite' : 'none',
      position: 'relative',
    }}>
      <style>{`@keyframes ledpulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
    </span>
  )
}

function AgentTile({ agent, large }: { agent: typeof AGENTS[0]; large?: boolean }) {
  return (
    <motion.div
      variants={fadeUp}
      whileHover={{ scale: 1.015, y: -3, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: `1px solid rgba(255,255,255,0.13)`,
        backdropFilter: 'blur(48px) saturate(200%)',
        WebkitBackdropFilter: 'blur(48px) saturate(200%)',
        borderRadius: 14,
        padding: large ? '22px 24px' : '16px 18px',
        cursor: 'pointer',
        boxShadow: `0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.09), 0 0 0 0 ${agent.color}00`,
        display: 'flex',
        flexDirection: 'column',
        gap: large ? 14 : 10,
        transition: 'box-shadow 200ms ease',
        gridColumn: large ? 'span 2' : 'span 1',
      }}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LED status={agent.status} />
          <span style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 800,
            fontSize: large ? 17 : 13,
            color: agent.color,
            letterSpacing: '0.04em',
          }}>{agent.label}</span>
        </div>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: agent.status === 'online' ? '#00e676' : '#5a618a',
          background: agent.status === 'online' ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.04)',
          padding: '3px 8px',
          borderRadius: 4,
          border: `1px solid ${agent.status === 'online' ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.06)'}`,
        }}>{agent.status}</span>
      </div>

      {/* Role */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: large ? 13 : 11,
        color: 'rgba(255,255,255,0.45)',
        lineHeight: 1.4,
      }}>{agent.role}</div>

      {/* Model + ctx */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: 'rgba(255,255,255,0.3)',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)',
          padding: '2px 7px',
          borderRadius: 4,
        }}>{agent.model}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: agent.color + '99',
        }}>{agent.ctx}</span>
      </div>
    </motion.div>
  )
}

export default function MissionControl() {
  const [time, setTime] = useState('')
  const [onlineCount, setOnlineCount] = useState(0)

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    setOnlineCount(AGENTS.filter(a => a.status === 'online').length)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      height: '100%',
      overflowY: 'auto',
      padding: '28px 32px',
      display: 'flex',
      flexDirection: 'column',
      gap: 28,
    }}>

      {/* ── TOP BAR ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
      >
        <div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: 10,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            color: '#ff6b00',
            marginBottom: 6,
          }}>SPACE AGE AI SOLUTIONS · DALLAS TX</div>
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif",
            fontWeight: 900,
            fontSize: 'clamp(26px, 3.5vw, 48px)',
            color: 'rgba(255,255,255,0.95)',
            letterSpacing: '0.04em',
            lineHeight: 1,
          }}>MISSION CONTROL</h1>
        </div>

        {/* Live readout */}
        <div style={{
          display: 'flex',
          gap: 24,
          alignItems: 'flex-end',
        }}>
          {[
            { label: 'AGENTS ONLINE', value: `${onlineCount}/${AGENTS.length}` },
            { label: 'LOCAL TIME',    value: time },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: 9,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
                marginBottom: 2,
              }}>{label}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 600,
                fontSize: 18,
                color: '#ff6b00',
                letterSpacing: '0.04em',
              }}>{value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── DIVIDER ──────────────────────────────── */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg, rgba(255,107,0,0.6), rgba(255,107,0,0.1), transparent)',
      }} />

      {/* ── AGENT GRID ──────────────────────────── */}
      <div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 14,
        }}>AGENT STATUS</div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 12,
          }}
        >
          {/* Claude spans 2 cols */}
          <AgentTile agent={AGENTS[0]} large />
          {AGENTS.slice(1).map(a => <AgentTile key={a.id} agent={a} />)}
        </motion.div>
      </div>

      {/* ── QUICK ACCESS ────────────────────────── */}
      <div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 14,
        }}>QUICK ACCESS</div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
        >
          {QUICK.map(q => (
            <motion.a
              key={q.label}
              href={q.href}
              variants={fadeUp}
              whileHover={{ scale: 1.04, y: -2, transition: { type: 'spring', stiffness: 350, damping: 20 } }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                backdropFilter: 'blur(20px)',
                borderRadius: 8,
                padding: '10px 16px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)',
                cursor: 'pointer',
              }}
            >
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: '#ff6b00',
              }}>{q.icon}</span>
              <span style={{
                fontFamily: "'Rajdhani', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.65)',
              }}>{q.label}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* ── MODEL STACK ──────────────────────────── */}
      <div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 14,
        }}>API MODEL STACK</div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}
        >
          {[
            { name: 'DeepSeek V4 Pro',   role: 'Primary coding',       ctx: '16T params · 1M ctx', color: '#38bdf8' },
            { name: 'Minimax 2.7',        role: 'Long-context creative', ctx: '1M ctx',              color: '#a855f7' },
            { name: 'Gemma 3 27B',        role: 'Fast · batch tasks',    ctx: 'Free tier',           color: '#00e676' },
          ].map(m => (
            <motion.div
              key={m.name}
              variants={fadeUp}
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderTop: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 10,
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
              }}
            >
              <span style={{
                fontFamily: "'Orbitron', sans-serif",
                fontWeight: 700,
                fontSize: 11,
                color: m.color,
                letterSpacing: '0.03em',
              }}>{m.name}</span>
              <span style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: 'rgba(255,255,255,0.4)',
              }}>{m.role}</span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: 'rgba(255,255,255,0.2)',
                marginTop: 4,
              }}>{m.ctx}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

    </div>
  )
}
