'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ─── Lesson data ──────────────────────────────────────────────────────────────

type Step = {
  num: number
  title: string
  prompt: string
  tip?: string
}

type Lesson = {
  id: string
  number: number
  title: string
  subtitle: string
  tools: string[]
  tags: string[]
  overview: string
  imagePrompts: { label: string; prompt: string }[]
  steps: Step[]
  tip: string
}

const LESSONS: Lesson[] = [
  {
    id: 'kate-monroe-hero',
    number: 26,
    title: 'Kate Monroe Hero Section',
    subtitle: 'Scroll-driven video hero with loading transition',
    tools: ['Higgsfield', 'Nano Banana', 'Seedance 2.0', 'Claude Code'],
    tags: ['CSS Grid', 'Scroll Animation', 'Video Scrub', 'Loading Screen', 'Japandi'],
    overview:
      'Build a cinematic full-screen hero section in 8 iterative Claude Code prompts. ' +
      'The finished result: a scroll-scrubbed MP4 with an inverted animation flow — ' +
      'starts full-screen, reveals the card layout as the user scrolls — plus a bone-white ' +
      'loading screen that cross-fades into the hero. Visuals generated with Higgsfield ' +
      '(start/end frames via Nano Banana, video via Seedance 2.0).',
    imagePrompts: [
      {
        label: 'Prompt 01 — End Frame (model in kitchen)',
        prompt:
          'Add the model in the reference image to a kitchen.\n\n' +
          'Style: Shot on a Hasselblad H6D medium format digital camera with a 35mm lens at f/8, ' +
          'soft diffused daylight from an unseen window providing even natural illumination with ' +
          'gentle directional warmth. Refined earthy color palette of rich walnut and espresso wood, ' +
          'creamy ivory linen, warm jute and woven rattan, terracotta clay, soft sage olive leaves, ' +
          'and pale plaster wall, low-saturation cinematic rendering with painterly tonal harmony. ' +
          'Razor-sharp focus throughout with deep depth of field revealing every wood grain, fiber, ' +
          'and ceramic texture, gentle shadow gradation grounding each object, soft warm highlight glow, ' +
          'considered art-directed composition with negative space allowing the eye to rest. Refined ' +
          'interior editorial mood with a Japandi minimalist sensibility, premium furniture or homeware ' +
          'campaign quality reminiscent of high-end design publications with a quiet meditative warmth.',
      },
      {
        label: 'Prompt 02 — Start Frame (empty kitchen)',
        prompt: 'Remove the model from the image please',
      },
      {
        label: 'Prompt 03 — The Video',
        prompt:
          'The female model slowly walks in frame to the kitchen-island and ends with a pose towards the camera. ' +
          'The camera stays exactly in place.',
      },
    ],
    steps: [
      {
        num: 1,
        title: 'Base layout with CSS Grid',
        prompt:
          'Build a full-screen interior-design hero section in HTML and CSS.\n\n' +
          'Palette:\n' +
          '- Background #6C5E53\n' +
          '- Bone text #EFEAE4\n' +
          '- Sand accent #C8BFB0\n' +
          '- Ink #432F30\n\n' +
          'Layout (single 100vh screen, no scroll):\n' +
          '- Top-left: large wordmark "KATE  MONROE" in Montserrat 500, letter-spacing 0.18em, sand color.\n' +
          '- Bottom-left: a small landscape kitchen photo.\n' +
          '- Center-bottom: a serif quote in Ovo — "I create spaces that tell a story, spaces that make you feel something. ' +
          'A home that feels personal and unique." with "KATE  MONROE" as a small uppercase signature underneath.\n' +
          '- Right side: a tall portrait photo flush to the right edge of the screen, full viewport height.\n\n' +
          'Use CSS Grid. The wordmark spans from the left edge of the kitchen photo to the right edge of the quote. ' +
          'The signature aligns to the bottom of the kitchen photo.',
      },
      {
        num: 2,
        title: 'Responsive right-side image',
        prompt:
          'Make the layout responsive:\n' +
          '- Cap the left content (wordmark, quote, thumbnail) at max-width 960px.\n' +
          '- The portrait on the right fills all remaining horizontal space.\n' +
          '- The model in the portrait must stay horizontally centered as the image area resizes.\n' +
          '- Add the same horizontal spacing between the quote and the portrait as the page\'s left padding.',
      },
      {
        num: 3,
        title: 'Swap in the final portrait',
        prompt:
          'Replace the right-side image with a wider landscape photo of the model in a kitchen.\n\n' +
          'The image should:\n' +
          '- Cover the entire right column edge to edge (object-fit: cover).\n' +
          '- Use object-position calc(50% - 200px) center so the model sits slightly left of center for a more cinematic crop.',
      },
      {
        num: 4,
        title: 'Scroll-driven transition to full-screen',
        prompt:
          'Add a scroll-driven transition. The hero stays pinned (position: fixed) while the body is 200vh tall.\n\n' +
          'As the user scrolls 0 → 100vh:\n' +
          '- The right-side portrait grows from its grid cell to the full viewport (covering the quote and thumbnail).\n' +
          '- The "KATE MONROE" wordmark translates from its top-left position to the exact center of the viewport.\n' +
          '- The wordmark color animates from sand (#C8BFB0) to white.\n' +
          '- The quote and thumbnail fade out.\n' +
          '- The portrait\'s object-position lerps from calc(50% - 200px) to center center, so the final state extends cleanly to the right edge.\n\n' +
          'Use a JS scroll listener with requestAnimationFrame. Measure element positions once on load (after fonts are ready) and on resize. Use an ease-in-out curve.',
      },
      {
        num: 5,
        title: 'Fading subheading at end state',
        prompt:
          'Add a subheading "Art Direction & Interior Design" in Ovo, uppercase, letter-spacing 0.18em, white.\n\n' +
          'It sits centered horizontally below the wordmark in its end state.\n' +
          'It fades in over the last 15% of the scroll progress, only after the wordmark has fully settled in the center.',
      },
      {
        num: 6,
        title: 'Replace portrait with scroll-scrubbed video',
        prompt:
          'Replace the right-side image with an MP4 video. The video should:\n' +
          '- Be muted, playsinline, preload="auto", and never autoplay.\n' +
          '- Start paused on its first frame.\n' +
          '- Scrub forward as the user scrolls — currentTime maps linearly from 0 to video.duration based on scroll progress.\n' +
          '- Inherit all the same object-fit, object-position, and transition behavior the image had.',
      },
      {
        num: 7,
        title: 'Reverse the animation flow',
        prompt:
          'Invert the entire scroll animation so the experience starts at the end state.\n\n' +
          'Start state (scroll = 0):\n' +
          '- Full-screen video paused on frame 0.\n' +
          '- "KATE MONROE" centered in white.\n' +
          '- Subheading "Art Direction & Interior Design" fades in automatically a moment after page load.\n\n' +
          'As the user scrolls:\n' +
          '- The subheading fades out within the first 15% of scroll.\n' +
          '- The video shrinks back into the right grid cell while scrubbing forward.\n' +
          '- The wordmark translates from center to top-left, color animating white → sand.\n' +
          '- The quote and thumbnail fade in as the card layout settles.\n\n' +
          'Keep the same easing and the same scroll distance (one viewport).',
      },
      {
        num: 8,
        title: 'Loading screen transition',
        prompt:
          'Add a loading screen that plays before the hero animation begins.\n\n' +
          'Start state:\n' +
          '- Full-screen #EFEAE4 background covering everything.\n' +
          '- The "KATE MONROE" wordmark sits at the exact same center position, font, and size as the post-load centered state, but in #6C5E53.\n\n' +
          'Sequence:\n' +
          '1. Hold the loading screen for ~1.2s.\n' +
          '2. Fade the bone background to transparent over ~0.9s.\n' +
          '3. Simultaneously animate the wordmark color from #6C5E53 to white, in lockstep with the background fade, so it looks like a single smooth color crossfade.\n' +
          '4. Once the loader is done, run the existing subheading fade-in.\n\n' +
          'Critical: there should be only ONE wordmark element. Position it above the loader using z-index so it\'s visible from the very first paint, with no jump or shift between the brown and white states.',
        tip: 'Run these prompts in order in a single Claude Code session so each step builds on the previous file. Drop your asset path into the prompt where it says "image" or "video".',
      },
    ],
    tip: 'Run all 8 prompts in order in a single Claude Code session — each builds on the previous output. Swap in your own image/video paths as you go.',
  },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function Tag({ label, color = '#ff6b00' }: { label: string; color?: string }) {
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 9,
      fontWeight: 600,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color,
      background: `${color}18`,
      border: `1px solid ${color}44`,
      borderRadius: 4,
      padding: '3px 7px',
    }}>{label}</span>
  )
}

function PromptBlock({ label, prompt }: { label: string; prompt: string }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(prompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }
  return (
    <div style={{
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderLeft: '2px solid #ff6b0066',
      borderRadius: 8,
      overflow: 'hidden',
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px 14px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.03)',
      }}>
        <span style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.5)',
        }}>{label}</span>
        <button
          onClick={copy}
          style={{
            background: copied ? 'rgba(0,230,118,0.12)' : 'rgba(255,255,255,0.06)',
            border: `1px solid ${copied ? 'rgba(0,230,118,0.3)' : 'rgba(255,255,255,0.1)'}`,
            borderRadius: 4,
            color: copied ? '#00e676' : 'rgba(255,255,255,0.4)',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            letterSpacing: '0.12em',
            padding: '3px 9px',
            cursor: 'pointer',
            transition: 'all 0.15s',
          }}
        >{copied ? 'COPIED' : 'COPY'}</button>
      </div>
      <pre style={{
        margin: 0,
        padding: '14px 16px',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 11,
        lineHeight: 1.7,
        color: 'rgba(255,255,255,0.72)',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
      }}>{prompt}</pre>
    </div>
  )
}

function StepCard({ step, index }: { step: Step; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 24 }}
      style={{
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: '1px solid rgba(255,255,255,0.11)',
        borderRadius: 10,
        overflow: 'hidden',
      }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          padding: '14px 18px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <span style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: '50%',
          background: 'rgba(255,107,0,0.15)',
          border: '1px solid rgba(255,107,0,0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          fontWeight: 700,
          color: '#ff6b00',
        }}>{String(step.num).padStart(2, '0')}</span>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: "'Rajdhani', sans-serif",
            fontWeight: 700,
            fontSize: 13,
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.88)',
          }}>{step.title}</div>
        </div>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          color: 'rgba(255,255,255,0.25)',
          transition: 'transform 0.2s',
          transform: open ? 'rotate(90deg)' : 'rotate(0deg)',
        }}>▶</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 18px 18px' }}>
              <PromptBlock label="Paste into Claude Code" prompt={step.prompt} />
              {step.tip && (
                <div style={{
                  marginTop: 10,
                  padding: '10px 12px',
                  background: 'rgba(255,107,0,0.07)',
                  border: '1px solid rgba(255,107,0,0.2)',
                  borderRadius: 6,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 11,
                  color: 'rgba(255,165,80,0.85)',
                  lineHeight: 1.6,
                }}>
                  <span style={{ fontWeight: 700 }}>TIP: </span>{step.tip}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

function LessonDetail({ lesson, onBack }: { lesson: Lesson; onBack: () => void }) {
  return (
    <div style={{ padding: '28px 32px', maxWidth: 900 }}>
      {/* Back */}
      <button
        onClick={onBack}
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 6,
          color: 'rgba(255,255,255,0.4)',
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 10,
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          padding: '6px 12px',
          cursor: 'pointer',
          marginBottom: 24,
        }}
      >← All Lessons</button>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: '#ff6b00',
          marginBottom: 6,
        }}>LESSON {String(lesson.number).padStart(2, '0')}</div>
        <h1 style={{
          fontFamily: "'Orbitron', sans-serif",
          fontWeight: 900,
          fontSize: 'clamp(20px, 2.8vw, 36px)',
          color: 'rgba(255,255,255,0.95)',
          letterSpacing: '0.04em',
          margin: '0 0 6px',
        }}>{lesson.title}</h1>
        <div style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          color: 'rgba(255,255,255,0.45)',
          marginBottom: 14,
        }}>{lesson.subtitle}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {lesson.tools.map(t => <Tag key={t} label={t} color="#38bdf8" />)}
          {lesson.tags.map(t => <Tag key={t} label={t} color="#ff6b00" />)}
        </div>
      </div>

      <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,107,0,0.5), transparent)', marginBottom: 28 }} />

      {/* Overview */}
      <div style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        lineHeight: 1.75,
        color: 'rgba(255,255,255,0.6)',
        marginBottom: 32,
        maxWidth: 700,
      }}>{lesson.overview}</div>

      {/* Image / Video prompts */}
      <div style={{ marginBottom: 32 }}>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 14,
        }}>HIGGSFIELD GENERATION PROMPTS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {lesson.imagePrompts.map(p => (
            <PromptBlock key={p.label} label={p.label} prompt={p.prompt} />
          ))}
        </div>
      </div>

      {/* Steps */}
      <div>
        <div style={{
          fontFamily: "'Rajdhani', sans-serif",
          fontWeight: 700,
          fontSize: 9,
          letterSpacing: '0.25em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.25)',
          marginBottom: 14,
        }}>CLAUDE CODE BUILD STEPS</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {lesson.steps.map((step, i) => (
            <StepCard key={step.num} step={step} index={i} />
          ))}
        </div>
      </div>

      {/* Global tip */}
      <div style={{
        marginTop: 24,
        padding: '14px 16px',
        background: 'rgba(255,107,0,0.07)',
        border: '1px solid rgba(255,107,0,0.2)',
        borderRadius: 8,
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 12,
        color: 'rgba(255,165,80,0.8)',
        lineHeight: 1.65,
      }}>
        <span style={{ fontWeight: 700 }}>PRO TIP: </span>{lesson.tip}
      </div>
    </div>
  )
}

// ─── Lesson index card ────────────────────────────────────────────────────────

function LessonCard({ lesson, onClick, index }: { lesson: Lesson; onClick: () => void; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: 'spring', stiffness: 260, damping: 24 }}
      whileHover={{ scale: 1.012, y: -3, transition: { type: 'spring', stiffness: 320, damping: 22 } }}
      onClick={onClick}
      style={{
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderTop: '1px solid rgba(255,255,255,0.13)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        borderRadius: 12,
        padding: '20px 22px',
        cursor: 'pointer',
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          fontWeight: 700,
          letterSpacing: '0.2em',
          color: '#ff6b00',
          background: 'rgba(255,107,0,0.1)',
          border: '1px solid rgba(255,107,0,0.25)',
          padding: '3px 8px',
          borderRadius: 4,
        }}>#{String(lesson.number).padStart(2, '0')}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          color: 'rgba(255,255,255,0.2)',
        }}>{lesson.steps.length} steps</span>
      </div>
      <h2 style={{
        fontFamily: "'Orbitron', sans-serif",
        fontWeight: 800,
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        letterSpacing: '0.03em',
        margin: '0 0 5px',
      }}>{lesson.title}</h2>
      <p style={{
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        margin: '0 0 14px',
        lineHeight: 1.5,
      }}>{lesson.subtitle}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
        {lesson.tags.slice(0, 4).map(t => <Tag key={t} label={t} />)}
      </div>
    </motion.div>
  )
}

// ─── Root view ────────────────────────────────────────────────────────────────

export default function WebLessonsView() {
  const [active, setActive] = useState<Lesson | null>(null)

  return (
    <div style={{ height: '100%', overflowY: 'auto' }}>
      <AnimatePresence mode="wait">
        {active ? (
          <motion.div key="detail" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <LessonDetail lesson={active} onBack={() => setActive(null)} />
          </motion.div>
        ) : (
          <motion.div key="index" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.18 }}>
            <div style={{ padding: '28px 32px' }}>
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <div style={{
                  fontFamily: "'Rajdhani', sans-serif",
                  fontWeight: 700,
                  fontSize: 9,
                  letterSpacing: '0.25em',
                  textTransform: 'uppercase',
                  color: '#ff6b00',
                  marginBottom: 6,
                }}>SPACE AGE · WEB DESIGN TRAINING</div>
                <h1 style={{
                  fontFamily: "'Orbitron', sans-serif",
                  fontWeight: 900,
                  fontSize: 'clamp(24px, 3vw, 42px)',
                  color: 'rgba(255,255,255,0.95)',
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  margin: '0 0 8px',
                }}>WEB LESSONS</h1>
                <p style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: 'rgba(255,255,255,0.4)',
                  margin: 0,
                }}>Real designer techniques — step-by-step prompts you paste straight into Claude Code.</p>
              </motion.div>

              <div style={{ height: 1, background: 'linear-gradient(90deg, rgba(255,107,0,0.5), rgba(255,107,0,0.1), transparent)', margin: '20px 0 28px' }} />

              {/* Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: 14,
              }}>
                {LESSONS.map((l, i) => (
                  <LessonCard key={l.id} lesson={l} onClick={() => setActive(l)} index={i} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
