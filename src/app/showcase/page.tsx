'use client';
import ScrollReveal from '@/components/ScrollReveal';
import ClipTransition from '@/components/ClipTransition';
import TiltCard from '@/components/TiltCard';
import VideoHero from '@/components/VideoHero';

const agents = [
  { label: 'Claude',  color: '#ff6b00', desc: 'Language model · Reasoning · Code generation' },
  { label: 'Codex',   color: '#00e5ff', desc: 'Code synthesis · Refactoring · Documentation' },
  { label: 'Gemini',  color: '#4285f4', desc: 'Multimodal understanding · Vision · Analysis' },
];

const clipShapes = [
  { shape: 'triangle', color: '255,107,0',   label: 'Triangle' },
  { shape: 'diamond',  color: '0,229,255',   label: 'Diamond' },
  { shape: 'hexagon',  color: '156,64,255',  label: 'Hexagon' },
] as const;

export default function ShowcasePage() {
  return (
    <div style={{ overflowY: 'auto', height: '100%' }}>

      {/* ── Video Hero ─────────────────────────────────── */}
      <VideoHero
        src="https://www.w3schools.com/html/mov_bbb.mp4"
        overlayOpacity={0.78}
        style={{ minHeight: '72vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <div style={{ textAlign: 'center', padding: '0 24px' }}>
          <p style={{
            fontFamily: 'Rajdhani, sans-serif', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--orange)', marginBottom: 20,
          }}>
            Visual Showcase
          </p>
          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 5rem)',
            fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
            color: 'var(--fg)', marginBottom: 28, lineHeight: 1.05,
          }}>
            Award-Winning<br />Techniques
          </h1>
          <p style={{ fontSize: 16, color: 'var(--fg-dim)', maxWidth: 500, margin: '0 auto', lineHeight: 1.7 }}>
            Scroll-triggered animations · Clip-path transitions ·
            3D hover effects · Video backgrounds
          </p>
        </div>
      </VideoHero>

      {/* ── Scroll Reveal ──────────────────────────────── */}
      <section style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <ScrollReveal>
          <p style={{
            fontFamily: 'Rajdhani, sans-serif', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--orange)', marginBottom: 12,
          }}>
            Technique 01
          </p>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
            fontSize: 'clamp(1.5rem, 4vw, 3rem)', color: 'var(--fg)', marginBottom: 16,
          }}>
            Scroll Animations
          </h2>
          <p style={{ color: 'var(--fg-dim)', maxWidth: 540, marginBottom: 56 }}>
            Each card enters from a different direction as it scrolls into the viewport,
            staggered with a delay.
          </p>
        </ScrollReveal>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: 24,
        }}>
          {(['up','left','up','right'] as const).map((dir, i) => (
            <ScrollReveal key={i} delay={i * 0.1} direction={dir}>
              <div className="glass" style={{ padding: 28, borderRadius: 12 }}>
                <span style={{ fontSize: 26, display: 'block', marginBottom: 16, color: 'var(--orange)' }}>
                  {['↑','←','↑','→'][i]}
                </span>
                <h3 style={{
                  fontFamily: 'Rajdhani, sans-serif', fontWeight: 700, fontSize: 16,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'var(--fg)', marginBottom: 8,
                }}>
                  {['Fade Up','Fade Left','Fade Up','Fade Right'][i]}
                </h3>
                <p style={{ color: 'var(--fg-dim)', fontSize: 13, lineHeight: 1.6 }}>
                  Enters from the {['top','left','top','right'][i]} with exponential easing.
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Clip-Path Transitions ──────────────────────── */}
      <section style={{
        padding: '80px 24px 120px',
        background: 'rgba(255,107,0,0.02)',
        borderTop: '1px solid rgba(255,255,255,0.06)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <ScrollReveal>
            <p style={{
              fontFamily: 'Rajdhani, sans-serif', fontSize: 11, fontWeight: 700,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'var(--cyan)', marginBottom: 12,
            }}>
              Technique 02
            </p>
            <h2 style={{
              fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
              fontSize: 'clamp(1.5rem, 4vw, 3rem)', color: 'var(--fg)', marginBottom: 16,
            }}>
              Clip-Path Reveals
            </h2>
            <p style={{ color: 'var(--fg-dim)', maxWidth: 540, marginBottom: 56 }}>
              Content is hidden behind a geometric clip mask that expands to full rectangle
              as the element enters the viewport.
            </p>
          </ScrollReveal>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 28,
          }}>
            {clipShapes.map(({ shape, color, label }, i) => (
              <ClipTransition key={shape} shape={shape} delay={i * 0.15}>
                <div style={{
                  background: `linear-gradient(135deg, rgba(${color},0.12), rgba(${color},0.04))`,
                  border: `1px solid rgba(${color},0.22)`,
                  borderRadius: 14, padding: '44px 32px', textAlign: 'center',
                }}>
                  <p style={{
                    fontFamily: 'Orbitron, sans-serif', fontWeight: 900, fontSize: 20,
                    color: 'var(--fg)', marginBottom: 10,
                  }}>
                    {label}
                  </p>
                  <p style={{ color: 'var(--fg-dim)', fontSize: 13 }}>
                    Clip geometry: {shape}
                  </p>
                </div>
              </ClipTransition>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3D Hover ───────────────────────────────────── */}
      <section style={{ padding: '120px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <ScrollReveal>
          <p style={{
            fontFamily: 'Rajdhani, sans-serif', fontSize: 11, fontWeight: 700,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'var(--purple)', marginBottom: 12,
          }}>
            Technique 03
          </p>
          <h2 style={{
            fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
            fontSize: 'clamp(1.5rem, 4vw, 3rem)', color: 'var(--fg)', marginBottom: 16,
          }}>
            3D Hover Effects
          </h2>
          <p style={{ color: 'var(--fg-dim)', maxWidth: 540, marginBottom: 56 }}>
            Mouse position drives perspective rotation and a specular glare highlight
            that tracks the cursor.
          </p>
        </ScrollReveal>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 28,
        }}>
          {agents.map((agent, i) => (
            <ScrollReveal key={agent.label} delay={i * 0.1}>
              <TiltCard intensity={14} glare>
                <div className="glass" style={{ padding: '36px 28px', borderRadius: 16 }}>
                  <div style={{
                    width: 12, height: 12, borderRadius: '50%',
                    background: agent.color,
                    boxShadow: `0 0 14px ${agent.color}`,
                    marginBottom: 22,
                  }} />
                  <h3 style={{
                    fontFamily: 'Orbitron, sans-serif', fontWeight: 900,
                    fontSize: 22, color: 'var(--fg)', marginBottom: 10,
                  }}>
                    {agent.label}
                  </h3>
                  <p style={{ color: 'var(--fg-dim)', fontSize: 13, lineHeight: 1.6 }}>
                    {agent.desc}
                  </p>
                </div>
              </TiltCard>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* ── Footer note ────────────────────────────────── */}
      <ScrollReveal>
        <div style={{
          padding: '48px 24px',
          textAlign: 'center',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}>
          <p style={{ color: 'var(--fg-muted)', fontSize: 11, fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.1em' }}>
            scroll-reveal · clip-path · 3d-tilt · video-hero · responsive-grid
          </p>
        </div>
      </ScrollReveal>

    </div>
  );
}
