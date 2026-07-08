'use client';

import { useState } from 'react';
import ScrollReveal from '@/components/ScrollReveal';
import ClipTransition from '@/components/ClipTransition';
import TiltCard from '@/components/TiltCard';
import VideoHero from '@/components/VideoHero';
import KineticText from '@/components/KineticText';
import ParallaxLayer from '@/components/ParallaxLayer';
import PinnedSection from '@/components/PinnedSection';
import { getSAVOConfig, BRAND_PRESETS, type BrandDNA } from '@/lib/savo';

const PRESET_KEYS = Object.keys(BRAND_PRESETS) as (keyof typeof BRAND_PRESETS)[];

const PINNED_STEPS = [
  {
    label: 'Brand DNA Input',
    content: (
      <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
        <p className="text-white/70 leading-relaxed">
          Eight scores (0–10) define the brand: clarity, authority, innovation,
          luxury, trust, emotion, visualRisk, motionTolerance. These drive every
          downstream decision.
        </p>
      </div>
    ),
  },
  {
    label: 'Industry Lock Matrix',
    content: (
      <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
        <p className="text-white/70 leading-relaxed">
          Hard rules per vertical. Healthcare cannot use ClipTransition or Tilt.
          Corporate law gets minimal motion only. These are non-negotiable before
          brand scores are even evaluated.
        </p>
      </div>
    ),
  },
  {
    label: 'MotionConfig Output',
    content: (
      <div className="p-8 bg-white/5 rounded-2xl border border-white/10">
        <p className="text-white/70 leading-relaxed">
          getSAVOConfig() returns a typed object. Every field maps 1:1 to a
          component prop. No guessing — just spread the config onto your
          components.
        </p>
      </div>
    ),
  },
];

export default function ShowcasePage() {
  const [presetKey, setPresetKey] = useState<string>('space_age_ai');
  const brand: BrandDNA = BRAND_PRESETS[presetKey];
  const config = getSAVOConfig(brand);

  return (
    <main className="bg-black text-white min-h-screen">
      {/* Video Hero */}
      <VideoHero
        src="/demo.mp4"
        poster="/poster.jpg"
        overlayOpacity={config.videoHero.overlayOpacity}
        className="h-screen"
      >
        <div className="flex flex-col items-center justify-center h-full text-center px-4">
          <KineticText
            text="SAVO Motion Engine"
            splitBy={config.kineticText.splitBy}
            className="text-5xl md:text-7xl font-black tracking-tight"
          />
          <ScrollReveal delay={0.6} intensity={config.scrollReveal.intensity}>
            <p className="mt-4 text-lg text-white/70 max-w-xl">
              Every technique. Deployed with intent.
            </p>
          </ScrollReveal>
        </div>
      </VideoHero>

      {/* Brand Selector */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <ScrollReveal intensity={config.scrollReveal.intensity}>
          <h2 className="text-3xl font-bold mb-2">Live Brand Selector</h2>
          <p className="text-white/50 mb-8">
            Switch presets to see getSAVOConfig() recalculate in real time.
          </p>
        </ScrollReveal>

        <div className="flex flex-wrap gap-3 mb-12">
          {PRESET_KEYS.map((key) => (
            <button
              key={key}
              onClick={() => setPresetKey(key)}
              className={`px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                key === presetKey
                  ? 'bg-violet-600 border-violet-600 text-white'
                  : 'border-white/20 text-white/60 hover:border-white/40'
              }`}
            >
              {key.replace(/_/g, ' ')}
            </button>
          ))}
        </div>

        {/* Config Output */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-violet-400 mb-4 uppercase tracking-widest">
              Brand DNA
            </h3>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
              {(Object.entries(brand) as [string, unknown][]).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <dt className="text-white/40">{k}</dt>
                  <dd className="text-white font-mono">
                    {typeof v === 'number' ? v : String(v)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="bg-white/5 rounded-2xl border border-white/10 p-6">
            <h3 className="text-sm font-semibold text-violet-400 mb-4 uppercase tracking-widest">
              Motion Config
            </h3>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-white/40">motionIntensity</dt>
                <dd className="text-white font-mono">{config.motionIntensity}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">heroType</dt>
                <dd className="text-white font-mono">{config.heroType}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">materialRoute</dt>
                <dd className="text-white font-mono">{config.materialRoute}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">videoHero</dt>
                <dd className={`font-mono ${config.videoHero.enabled ? 'text-green-400' : 'text-red-400'}`}>
                  {String(config.videoHero.enabled)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">clipTransition</dt>
                <dd className={`font-mono ${config.clipTransition.enabled ? 'text-green-400' : 'text-red-400'}`}>
                  {String(config.clipTransition.enabled)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">tiltCard</dt>
                <dd className={`font-mono ${config.tiltCard.enabled ? 'text-green-400' : 'text-red-400'}`}>
                  {String(config.tiltCard.enabled)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">kineticText</dt>
                <dd className={`font-mono ${config.kineticText.enabled ? 'text-green-400' : 'text-red-400'}`}>
                  {String(config.kineticText.enabled)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">parallax</dt>
                <dd className={`font-mono ${config.parallax.enabled ? 'text-green-400' : 'text-red-400'}`}>
                  {String(config.parallax.enabled)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-white/40">pinnedSection</dt>
                <dd className={`font-mono ${config.pinnedSection.enabled ? 'text-green-400' : 'text-red-400'}`}>
                  {String(config.pinnedSection.enabled)}
                </dd>
              </div>
            </dl>
            {config.rejected.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-xs text-white/30 mb-2">Rejected:</p>
                {config.rejected.map((r, i) => (
                  <p key={i} className="text-xs text-red-400/70 font-mono">{r}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Clip Transition Demo */}
      {config.clipTransition.enabled && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <ScrollReveal intensity={config.scrollReveal.intensity}>
            <h2 className="text-2xl font-bold mb-8">Clip Transitions</h2>
          </ScrollReveal>
          <div className="grid grid-cols-3 gap-4">
            {config.clipTransition.shapes.map((shape, i) => (
              <ClipTransition key={shape} shape={shape} delay={i * 0.15}>
                <div className="bg-gradient-to-br from-violet-600 to-indigo-700 rounded-xl p-8 text-center">
                  <p className="font-mono text-sm text-white/70">{shape}</p>
                </div>
              </ClipTransition>
            ))}
          </div>
        </section>
      )}

      {/* Tilt Card Demo */}
      {config.tiltCard.enabled && (
        <section className="max-w-5xl mx-auto px-6 py-12">
          <ScrollReveal intensity={config.scrollReveal.intensity}>
            <h2 className="text-2xl font-bold mb-8">Tilt Cards</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {['Premium', 'Luxury', 'Elite'].map((label, i) => (
              <TiltCard
                key={label}
                intensity={config.tiltCard.intensity}
                glare={config.tiltCard.glare}
              >
                <ScrollReveal delay={i * 0.1} intensity={config.scrollReveal.intensity}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                    <p className="text-lg font-semibold">{label}</p>
                    <p className="text-white/50 text-sm mt-2">
                      intensity={config.tiltCard.intensity} glare={String(config.tiltCard.glare)}
                    </p>
                  </div>
                </ScrollReveal>
              </TiltCard>
            ))}
          </div>
        </section>
      )}

      {/* Parallax Demo */}
      {config.parallax.enabled && (
        <section className="max-w-5xl mx-auto px-6 py-20 overflow-hidden">
          <ScrollReveal intensity={config.scrollReveal.intensity}>
            <h2 className="text-2xl font-bold mb-8">Parallax Layer</h2>
          </ScrollReveal>
          <ParallaxLayer strength={config.parallax.strength} className="rounded-2xl">
            <div className="bg-gradient-to-br from-indigo-900 to-violet-900 h-64 rounded-2xl flex items-center justify-center">
              <p className="text-white/60 font-mono">strength={config.parallax.strength}</p>
            </div>
          </ParallaxLayer>
        </section>
      )}

      {/* Kinetic Text Demo */}
      {config.kineticText.enabled && (
        <section className="max-w-5xl mx-auto px-6 py-20">
          <h2 className="text-2xl font-bold mb-8">Kinetic Text</h2>
          <KineticText
            text="Motion with intention."
            splitBy={config.kineticText.splitBy}
            className="text-4xl md:text-6xl font-black"
          />
        </section>
      )}

      {/* Pinned Section */}
      {config.pinnedSection.enabled && (
        <section className="px-6">
          <div className="max-w-5xl mx-auto py-12">
            <ScrollReveal intensity={config.scrollReveal.intensity}>
              <h2 className="text-2xl font-bold mb-4">How SAVO Works</h2>
              <p className="text-white/50">Scroll through the steps below.</p>
            </ScrollReveal>
          </div>
          <PinnedSection steps={PINNED_STEPS} />
        </section>
      )}

      <div className="h-32" />
    </main>
  );
}
