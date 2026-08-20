'use client'

import { motion } from 'framer-motion'
import { useState, useEffect, useCallback } from 'react'

const AGENTS = [
  { id: 'claude',   label: 'Claude',    role: 'Orchestrator',   color: '#ff6b00', status: 'online',  model: 'sonnet-4.6',    ctx: '200K' },
  { id: 'codex',    label: 'Codex',     role: 'Code / Rescue',  color: '#00e5ff', status: 'online',  model: 'o3',            ctx: '128K' },
  { id: 'gemini',   label: 'Gemini',    role: 'Multimodal',     color: '#4285f4', status: 'idle',    model: 'flash-2.5',     ctx: '1M'   },
  { id: 'openclaw', label: 'OpenClaw',  role: 'Swarm',          color: '#9c40ff', status: 'idle',    model: 'gpt-4o',        ctx: '128K' },
  { id: 'hermes',   label: 'Hermes',    role: 'VPS · 24/7',     color: '#f5a623', status: 'online',  model: '146.190.78.120',ctx: 'VPS'  },
  { id: 'deepseek', label: 'DeepSeek',  role: 'Primary Code',   color: '#38bdf8', status: 'idle',    model: 'v4-pro',        ctx: '128K' },
]

const SELF_HOSTED = [
  { id: 'n8n',      label: 'n8n',         role: 'Workflow Automation', color: '#ea4b71', icon: '⇶', repo: 'stacks/n8n',         url: 'http://146.190.78.120:5678' },
  { id: 'ghost',    label: 'Ghost',        role: 'Publishing Platform', color: '#738a94', icon: '◈', repo: 'stacks/ghost',        url: 'http://146.190.78.120:2368' },
  { id: 'stirling', label: 'Stirling PDF', role: 'PDF Toolkit',        color: '#4e9af1', icon: '▤', repo: 'stacks/stirling-pdf', url: 'http://146.190.78.120:8080' },
  { id: 'chatwoot',     label: 'Chatwoot',      role: 'Customer Support',   color: '#1f93ff', icon: '✉', repo: 'stacks/chatwoot',          url: 'http://146.190.78.120:3000' },
  { id: 'claude-video', label: 'Claude Video',  role: '/watch skill',       color: '#a855f7', icon: '◉', repo: 'skills/claude-video',      url: '/watch' },
]

const QUICK = [
  { label: 'Terminal', icon: '>_', href: '/terminal' },
  { label: 'Pipeline', icon: '⇶',  href: '/pipeline' },
  { label: 'Image',    icon: '◈',  href: '/studio'   },
  { label: 'Video',    icon: '▶',  href: '/video'    },
  { label: 'Watch',    icon: '◉',  href: '/watch'    },
  { label: 'Kanban',   icon: '▦',  href: '/kanban'   },
  { label: 'Journal',  icon: '✦',  href: '/journal'  },
]

const MODELS = [
  { name: 'DeepSeek V4 Pro', role: 'Primary coding',        ctx: '16T params · 1M ctx', color: '#38bdf8', price: '$0.14/M', id: 'deepseek/deepseek-v4-pro' },
  { name: 'Minimax 2.7',     role: 'Long-context creative',  ctx: '1M ctx',              color: '#a855f7', price: '$0.40/M', id: 'minimax/minimax-2.7'       },
  { name: 'GLM-5.2',         role: 'Agentic coding · 753B',  ctx: '1M ctx · MIT',        color: '#ea4b71', price: '$1.00/M', id: 'z-ai/glm-5.2'              },
  { name: 'Kimi K2.7 Code',  role: 'End-to-end coding',      ctx: '262K ctx',            color: '#f5a623', price: '$0.61/M', id: 'moonshotai/kimi-k2.7-code' },
  { name: 'Gemma 4 31B',     role: 'Fast · free tier avail', ctx: '256K · multimodal',   color: '#00e676', price: '$0.12/M', id: 'google/gemma-4-31b-it'     },
  { name: 'Gemma 4 26B A4B', role: 'MoE · batch tasks',      ctx: '256K · free',         color: '#34d399', price: '$0.06/M', id: 'google/gemma-4-26b-a4b-it' },
]

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } }
}

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  show:   { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 24 } }
}

/* ── Shared keyframes injected once ──────────────────────────────────── */
const KEYFRAMES = `
  @keyframes ledpulse   { 0%,100%{opacity:1} 50%{opacity:.45} }
  @keyframes vpspulse   { 0%,100%{box-shadow:0 0 0 0 rgba(0,230,118,0.55)} 70%{box-shadow:0 0 0 6px rgba(0,230,118,0)} }
  @keyframes scanline   { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
  @keyframes copyfade   { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(-8px)} }
`

function LED({ status }: { status: string }) {
  const colors: Record<string, string> = { online: '#00e676', idle: '#5a618a', busy: '#ff6b00' }
  const c = colors[status] ?? colors.idle
  const pulse = status === 'online' || status === 'busy'
  return (
    <span style={{
      display: 'inline-block', width: 7, height: 7, borderRadius: '50%',
      background: c, flexShrink: 0,
      boxShadow: pulse ? `0 0 6px ${c}, 0 0 12px ${c}55` : 'none',
      animation: pulse ? 'ledpulse 2.5s ease-in-out infinite' : 'none',
    }} />
  )
}

/* ── Skeuomorphic button ─────────────────────────────────────────────── */
function SkeuoButton({ icon, label, href }: { icon: string; label: string; href: string }) {
  const [pressed, setPressed] = useState(false)
  return (
    <motion.a
      href={href}
      variants={fadeUp}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
      style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        textDecoration: 'none', userSelect: 'none',
        width: 88,
      }}
    >
      <div style={{
        width: 56, height: 56,
        borderRadius: 16,
        background: pressed
          ? 'linear-gradient(160deg, #1a1a24 0%, #2a2a38 100%)'
          : 'linear-gradient(160deg, #2e2e40 0%, #1a1a26 60%, #141420 100%)',
        boxShadow: pressed
          ? 'inset 0 3px 8px rgba(0,0,0,0.8), inset 0 1px 3px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04)'
          : '0 6px 16px rgba(0,0,0,0.6), 0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.12), inset 0 -1px 0 rgba(0,0,0,0.4)',
        border: pressed
          ? '1px solid rgba(255,107,0,0.25)'
          : '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
        transition: 'box-shadow 80ms ease, background 80ms ease, border 80ms ease',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* gloss highlight */}
        {!pressed && (
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '45%',
            borderRadius: '16px 16px 50% 50% / 16px 16px 24px 24px',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 100%)',
            pointerEvents: 'none',
          }} />
        )}
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 20,
          color: pressed ? 'rgba(255,107,0,0.7)' : '#ff6b00',
          filter: pressed ? 'none' : 'drop-shadow(0 0 6px rgba(255,107,0,0.5))',
          transition: 'color 80ms ease, filter 80ms ease',
          transform: pressed ? 'scale(0.92)' : 'scale(1)',
        }}>{icon}</span>
      </div>
      <span style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: 700,
        fontSize: 10,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        color: pressed ? 'rgba(255,107,0,0.8)' : 'rgba(255,255,255,0.5)',
        transition: 'color 80ms ease',
      }}>{label}</span>
    </motion.a>
  )
}

/* ── Section header with decorative rule ─────────────────────────────── */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <div style={{ width: 3, height: 12, borderRadius: 2, background: 'rgba(255,107,0,0.55)' }} />
      <span style={{
        fontFamily: "'Rajdhani', sans-serif",
        fontWeight: 700, fontSize: 9,
        letterSpacing: '0.25em',
        textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.3)',
      }}>{children}</span>
      <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(255,255,255,0.06), transparent)' }} />
    </div>
  )
}

/* ── Model tile with copy-to-clipboard ───────────────────────────────── */
function ModelTile({ m }: { m: typeof MODELS[0] }) {
  const [copied, setCopied] = useState(false)
  const copy = useCallback(() => {
    navigator.clipboard.writeText(m.id).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    })
  }, [m.id])

  return (
    <motion.div
      variants={fadeUp}
      onClick={copy}
      title={`Click to copy: ${m.id}`}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: '1px solid rgba(255,255,255,0.06)',
        borderTop: `2px solid ${m.color}55`,
        borderRadius: 10, padding: '14px 16px',
        display: 'flex', flexDirection: 'column', gap: 5,
        cursor: 'pointer', position: 'relative', overflow: 'hidden',
        transition: 'background 120ms ease',
      }}
      whileHover={{ background: 'rgba(255,255,255,0.04)' } as never}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{
          fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
          fontSize: 11, color: m.color, letterSpacing: '0.03em',
        }}>{m.name}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: m.color, background: `${m.color}18`,
          border: `1px solid ${m.color}33`, padding: '2px 6px', borderRadius: 4,
        }}>{m.price}</span>
      </div>
      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{m.role}</span>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{m.ctx}</span>

      {/* copy toast */}
      {copied && (
        <div style={{
          position: 'absolute', inset: 0, borderRadius: 10,
          background: `${m.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'copyfade 1.4s ease forwards',
          pointerEvents: 'none',
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
            color: m.color, letterSpacing: '0.08em',
          }}>✓ copied</span>
        </div>
      )}
    </motion.div>
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
        boxShadow: `0 8px 32px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.09)`,
        display: 'flex', flexDirection: 'column',
        gap: large ? 14 : 10,
        transition: 'box-shadow 200ms ease',
        gridColumn: large ? 'span 2' : 'span 1',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <LED status={agent.status} />
          <span style={{
            fontFamily: "'Orbitron', sans-serif", fontWeight: 800,
            fontSize: large ? 17 : 13, color: agent.color, letterSpacing: '0.04em',
          }}>{agent.label}</span>
        </div>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
          fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
          color: agent.status === 'online' ? '#00e676' : '#5a618a',
          background: agent.status === 'online' ? 'rgba(0,230,118,0.1)' : 'rgba(255,255,255,0.04)',
          padding: '3px 8px', borderRadius: 4,
          border: `1px solid ${agent.status === 'online' ? 'rgba(0,230,118,0.2)' : 'rgba(255,255,255,0.06)'}`,
        }}>{agent.status}</span>
      </div>
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: large ? 13 : 11, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4,
      }}>{agent.role}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 'auto' }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
          color: 'rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.06)', padding: '2px 7px', borderRadius: 4,
        }}>{agent.model}</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: agent.color + '99' }}>{agent.ctx}</span>
      </div>
    </motion.div>
  )
}

export default function MissionControl() {
  const [time, setTime] = useState('')
  const [onlineCount, setOnlineCount] = useState(0)
  const [vpsOnline] = useState(true)

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }))
    tick()
    const id = setInterval(tick, 1000)
    setOnlineCount(AGENTS.filter(a => a.status === 'online').length)
    return () => clearInterval(id)
  }, [])

  return (
    <div style={{
      height: '100%', overflowY: 'auto',
      padding: '28px 32px',
      display: 'flex', flexDirection: 'column', gap: 28,
    }}>
      <style>{KEYFRAMES}</style>

      {/* ── TOP BAR ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}
      >
        <div>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
            fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#ff6b00', marginBottom: 6,
          }}>SPACE AGE AI SOLUTIONS · DALLAS TX</div>
          <h1 style={{
            fontFamily: "'Orbitron', sans-serif", fontWeight: 900,
            fontSize: 'clamp(26px, 3.5vw, 48px)',
            color: 'rgba(255,255,255,0.95)', letterSpacing: '0.04em', lineHeight: 1,
          }}>MISSION CONTROL</h1>
        </div>

        {/* Live readout */}
        <div style={{ display: 'flex', gap: 24, alignItems: 'flex-end' }}>
          {/* VPS status pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7,
            background: vpsOnline ? 'rgba(0,230,118,0.07)' : 'rgba(255,50,50,0.07)',
            border: `1px solid ${vpsOnline ? 'rgba(0,230,118,0.2)' : 'rgba(255,50,50,0.2)'}`,
            borderRadius: 20, padding: '6px 12px',
            alignSelf: 'center',
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: vpsOnline ? '#00e676' : '#ff4444',
              display: 'inline-block', flexShrink: 0,
              animation: vpsOnline ? 'vpspulse 2s ease-out infinite' : 'none',
            }} />
            <span style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10,
              color: vpsOnline ? '#00e676' : '#ff4444', letterSpacing: '0.05em',
            }}>146.190.78.120</span>
          </div>

          {[
            { label: 'AGENTS ONLINE', value: `${onlineCount}/${AGENTS.length}` },
            { label: 'LOCAL TIME',    value: time },
          ].map(({ label, value }) => (
            <div key={label} style={{ textAlign: 'right' }}>
              <div style={{
                fontFamily: "'Rajdhani', sans-serif", fontWeight: 700,
                fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)', marginBottom: 2,
              }}>{label}</div>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                fontSize: 18, color: '#ff6b00', letterSpacing: '0.04em',
              }}>{value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── DIVIDER ──────────────────────────────── */}
      <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,107,0,0.6), rgba(255,107,0,0.1), transparent)' }} />

      {/* ── AGENT GRID ──────────────────────────── */}
      <div>
        <SectionLabel>Agent Status</SectionLabel>
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}
        >
          <AgentTile agent={AGENTS[0]} large />
          {AGENTS.slice(1).map(a => <AgentTile key={a.id} agent={a} />)}
        </motion.div>
      </div>

      {/* ── QUICK ACCESS — skeuomorphic buttons ─── */}
      <div>
        <SectionLabel>Quick Access</SectionLabel>
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          style={{ display: 'flex', gap: 16, flexWrap: 'wrap', paddingBottom: 4 }}
        >
          {QUICK.map(q => <SkeuoButton key={q.label} icon={q.icon} label={q.label} href={q.href} />)}
        </motion.div>
      </div>

      {/* ── SELF-HOSTED STACK ───────────────────── */}
      <div>
        <SectionLabel>Self-Hosted Stack</SectionLabel>
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}
        >
          {SELF_HOSTED.map(s => (
            <motion.a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp}
              whileHover={{ scale: 1.015, y: -3, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
              style={{
                textDecoration: 'none',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderTop: `2px solid ${s.color}55`,
                borderRadius: 10, padding: '14px 16px',
                display: 'flex', flexDirection: 'column', gap: 5, cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 14, color: s.color }}>{s.icon}</span>
                <span style={{
                  fontFamily: "'Orbitron', sans-serif", fontWeight: 700,
                  fontSize: 11, color: s.color, letterSpacing: '0.03em',
                }}>{s.label}</span>
              </div>
              <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{s.role}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(255,255,255,0.2)', marginTop: 4 }}>{s.repo}</span>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* ── MODEL STACK ──────────────────────────── */}
      <div>
        <SectionLabel>API Model Stack</SectionLabel>
        <motion.div
          variants={stagger} initial="hidden" animate="show"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}
        >
          {MODELS.map(m => <ModelTile key={m.name} m={m} />)}
        </motion.div>
        <div style={{
          marginTop: 8,
          fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
          color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em',
        }}>↑ click any tile to copy OpenRouter model ID</div>
      </div>

    </div>
  )
}
