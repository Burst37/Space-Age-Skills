/**
 * SAVO Motion Engine — getSAVOConfig(brand) → MotionConfig
 *
 * The ONLY source of truth for which techniques deploy on which sites.
 * Every field in MotionConfig maps 1:1 to an actual component prop.
 *
 * Usage:
 *   import { getSAVOConfig, BRAND_PRESETS } from '@/lib/savo';
 *   const config = getSAVOConfig(BRAND_PRESETS.space_age_ai);
 *   <TiltCard intensity={config.tiltCard.intensity} glare={config.tiltCard.glare}>
 */

export type IndustryType =
  | 'ai_agency'
  | 'music_artist'
  | 'ecommerce_fashion'
  | 'restaurant'
  | 'nightclub_event'
  | 'fitness'
  | 'healthcare'
  | 'corporate_law'
  | 'credit_finance'
  | 'saas_b2b'
  | 'nonprofit'
  | 'portfolio_agency';

export interface BrandDNA {
  industry: IndustryType;
  /** 0-10: How clear and legible must the layout be? */
  clarity: number;
  /** 0-10: Institutional credibility weight */
  authority: number;
  /** 0-10: Appetite for novel, unexpected interactions */
  innovation: number;
  /** 0-10: Premium / high-end positioning */
  luxury: number;
  /** 0-10: Trust signals matter (testimonials, certs) */
  trust: number;
  /** 0-10: Emotional resonance vs rational persuasion */
  emotion: number;
  /** 0-10: Tolerance for visual complexity / risk */
  visualRisk: number;
  /** 0-10: How much motion the audience expects/enjoys */
  motionTolerance: number;
  mobileConversionPriority: 'standard' | 'high' | 'critical';
}

export interface MotionConfig {
  videoHero: {
    enabled: boolean;
    overlayOpacity: number;
    reason: string;
  };
  scrollReveal: {
    enabled: boolean;
    intensity: 'subtle' | 'standard' | 'dramatic';
    stagger: boolean;
    yOffset: number;
    reason: string;
  };
  clipTransition: {
    enabled: boolean;
    shapes: Array<'triangle' | 'diamond' | 'hexagon'>;
    reason: string;
  };
  tiltCard: {
    enabled: boolean;
    intensity: number;
    glare: boolean;
    reason: string;
  };
  kineticText: {
    enabled: boolean;
    splitBy: 'word' | 'char';
    reason: string;
  };
  parallax: {
    enabled: boolean;
    strength: number;
    reason: string;
  };
  pinnedSection: {
    enabled: boolean;
    reason: string;
  };
  motionIntensity: 'minimal' | 'subtle' | 'standard' | 'high' | 'cinematic';
  heroType: 'video' | 'typography' | 'static';
  materialRoute:
    | 'dark_glass'
    | 'warm_trust'
    | 'editorial_luxury'
    | 'premium_minimal'
    | 'industrial';
  rejected: string[];
}

// ---------------------------------------------------------------------------
// Industry Lock Matrix — hard constraints per vertical
// These are non-negotiable regardless of brand DNA scores.
// ---------------------------------------------------------------------------
interface IndustryLock {
  videoHero: boolean;
  clipTransition: boolean;
  tiltCard: boolean;
  kineticText: boolean;
  parallax: boolean;
  pinnedSection: boolean;
  maxMotionIntensity: MotionConfig['motionIntensity'];
  material: MotionConfig['materialRoute'];
  heroType: MotionConfig['heroType'];
}

const INTENSITY_RANK: Record<MotionConfig['motionIntensity'], number> = {
  minimal: 0,
  subtle: 1,
  standard: 2,
  high: 3,
  cinematic: 4,
};

const INDUSTRY_LOCKS: Record<IndustryType, IndustryLock> = {
  // TIER 1 — Cinematic allowed
  ai_agency: {
    videoHero: true,
    clipTransition: true,
    tiltCard: true,
    kineticText: true,
    parallax: true,
    pinnedSection: true,
    maxMotionIntensity: 'cinematic',
    material: 'dark_glass',
    heroType: 'video',
  },
  music_artist: {
    videoHero: true,
    clipTransition: true,
    tiltCard: true,
    kineticText: true,
    parallax: true,
    pinnedSection: true,
    maxMotionIntensity: 'cinematic',
    material: 'editorial_luxury',
    heroType: 'video',
  },
  nightclub_event: {
    videoHero: true,
    clipTransition: true,
    tiltCard: true,
    kineticText: true,
    parallax: true,
    pinnedSection: false,
    maxMotionIntensity: 'cinematic',
    material: 'dark_glass',
    heroType: 'video',
  },
  portfolio_agency: {
    videoHero: true,
    clipTransition: true,
    tiltCard: true,
    kineticText: true,
    parallax: true,
    pinnedSection: true,
    maxMotionIntensity: 'cinematic',
    material: 'editorial_luxury',
    heroType: 'video',
  },
  // TIER 2 — High motion allowed
  ecommerce_fashion: {
    videoHero: true,
    clipTransition: true,
    tiltCard: true,
    kineticText: true,
    parallax: true,
    pinnedSection: true,
    maxMotionIntensity: 'high',
    material: 'editorial_luxury',
    heroType: 'video',
  },
  fitness: {
    videoHero: true,
    clipTransition: false,
    tiltCard: true,
    kineticText: true,
    parallax: true,
    pinnedSection: false,
    maxMotionIntensity: 'high',
    material: 'industrial',
    heroType: 'video',
  },
  restaurant: {
    videoHero: true,
    clipTransition: false,
    tiltCard: true,
    kineticText: false,
    parallax: true,
    pinnedSection: false,
    maxMotionIntensity: 'high',
    material: 'warm_trust',
    heroType: 'video',
  },
  // TIER 3 — Restrained
  saas_b2b: {
    videoHero: true,
    clipTransition: false,
    tiltCard: true,
    kineticText: false,
    parallax: false,
    pinnedSection: true,
    maxMotionIntensity: 'standard',
    material: 'premium_minimal',
    heroType: 'video',
  },
  nonprofit: {
    videoHero: true,
    clipTransition: false,
    tiltCard: false,
    kineticText: false,
    parallax: false,
    pinnedSection: false,
    maxMotionIntensity: 'subtle',
    material: 'warm_trust',
    heroType: 'video',
  },
  // TIER 4 — Minimal only
  healthcare: {
    videoHero: true,
    clipTransition: false,
    tiltCard: false,
    kineticText: false,
    parallax: false,
    pinnedSection: false,
    maxMotionIntensity: 'subtle',
    material: 'warm_trust',
    heroType: 'video',
  },
  credit_finance: {
    videoHero: false,
    clipTransition: false,
    tiltCard: false,
    kineticText: false,
    parallax: false,
    pinnedSection: false,
    maxMotionIntensity: 'minimal',
    material: 'premium_minimal',
    heroType: 'static',
  },
  corporate_law: {
    videoHero: false,
    clipTransition: false,
    tiltCard: false,
    kineticText: false,
    parallax: false,
    pinnedSection: false,
    maxMotionIntensity: 'minimal',
    material: 'premium_minimal',
    heroType: 'typography',
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function capIntensity(
  desired: MotionConfig['motionIntensity'],
  max: MotionConfig['motionIntensity']
): MotionConfig['motionIntensity'] {
  return INTENSITY_RANK[desired] <= INTENSITY_RANK[max] ? desired : max;
}

function scoreToIntensity(score: number): MotionConfig['motionIntensity'] {
  if (score >= 9) return 'cinematic';
  if (score >= 7) return 'high';
  if (score >= 5) return 'standard';
  if (score >= 3) return 'subtle';
  return 'minimal';
}

// ---------------------------------------------------------------------------
// Core decision function
// ---------------------------------------------------------------------------
export function getSAVOConfig(brand: BrandDNA): MotionConfig {
  const lock = INDUSTRY_LOCKS[brand.industry];
  const rejected: string[] = [];

  // Resolve motion intensity from brand scores, then cap at industry max
  const desiredIntensity = scoreToIntensity(
    (brand.motionTolerance + brand.visualRisk + brand.innovation) / 3
  );
  const motionIntensity = capIntensity(desiredIntensity, lock.maxMotionIntensity);

  // Video Hero
  const videoHeroEnabled = lock.videoHero && brand.emotion >= 5 && brand.visualRisk >= 4;
  if (!videoHeroEnabled && lock.videoHero) {
    rejected.push(`videoHero: emotion=${brand.emotion} or visualRisk=${brand.visualRisk} too low`);
  } else if (!lock.videoHero) {
    rejected.push(`videoHero: locked off for ${brand.industry}`);
  }

  // Scroll Reveal — always enabled, intensity varies
  const revealIntensity: MotionConfig['scrollReveal']['intensity'] =
    motionIntensity === 'cinematic' || motionIntensity === 'high'
      ? 'dramatic'
      : motionIntensity === 'standard'
      ? 'standard'
      : 'subtle';

  // Clip Transition
  const clipEnabled =
    lock.clipTransition && brand.visualRisk >= 6 && brand.innovation >= 5;
  if (!clipEnabled) {
    rejected.push(
      lock.clipTransition
        ? `clipTransition: visualRisk=${brand.visualRisk} or innovation=${brand.innovation} below threshold`
        : `clipTransition: locked off for ${brand.industry}`
    );
  }

  // Tilt Card
  const tiltEnabled = lock.tiltCard && brand.luxury >= 5 && brand.innovation >= 4;
  const tiltIntensity = Math.min(brand.luxury / 10 + brand.innovation / 20, 1);
  if (!tiltEnabled) {
    rejected.push(
      lock.tiltCard
        ? `tiltCard: luxury=${brand.luxury} or innovation=${brand.innovation} below threshold`
        : `tiltCard: locked off for ${brand.industry}`
    );
  }

  // Kinetic Text
  const kineticEnabled =
    lock.kineticText && brand.motionTolerance >= 6 && brand.innovation >= 6;
  if (!kineticEnabled) {
    rejected.push(
      lock.kineticText
        ? `kineticText: motionTolerance=${brand.motionTolerance} or innovation=${brand.innovation} below threshold`
        : `kineticText: locked off for ${brand.industry}`
    );
  }

  // Parallax
  const parallaxEnabled =
    lock.parallax && brand.visualRisk >= 5 && brand.motionTolerance >= 5;
  const parallaxStrength =
    parallaxEnabled ? Math.min(0.08 + (brand.visualRisk / 10) * 0.12, 0.2) : 0;
  if (!parallaxEnabled) {
    rejected.push(
      lock.parallax
        ? `parallax: visualRisk=${brand.visualRisk} or motionTolerance=${brand.motionTolerance} below threshold`
        : `parallax: locked off for ${brand.industry}`
    );
  }

  // Pinned Section
  const pinnedEnabled =
    lock.pinnedSection && brand.innovation >= 6 && brand.clarity >= 5;
  if (!pinnedEnabled) {
    rejected.push(
      lock.pinnedSection
        ? `pinnedSection: innovation=${brand.innovation} or clarity=${brand.clarity} below threshold`
        : `pinnedSection: locked off for ${brand.industry}`
    );
  }

  // Mobile conversion — degrade motion if critical
  const mobileDegrade = brand.mobileConversionPriority === 'critical';

  return {
    videoHero: {
      enabled: videoHeroEnabled,
      overlayOpacity: mobileDegrade ? 0.6 : 0.2 + (1 - brand.emotion / 10) * 0.4,
      reason: videoHeroEnabled
        ? `emotion=${brand.emotion}, visualRisk=${brand.visualRisk} → approved`
        : 'disabled — see rejected[]',
    },
    scrollReveal: {
      enabled: true,
      intensity: mobileDegrade ? 'subtle' : revealIntensity,
      stagger: brand.motionTolerance >= 6,
      yOffset: revealIntensity === 'dramatic' ? 60 : revealIntensity === 'standard' ? 40 : 20,
      reason: `intensity derived from motionIntensity=${motionIntensity}`,
    },
    clipTransition: {
      enabled: clipEnabled,
      shapes:
        brand.innovation >= 8
          ? ['triangle', 'diamond', 'hexagon']
          : brand.innovation >= 6
          ? ['diamond', 'hexagon']
          : ['hexagon'],
      reason: clipEnabled
        ? `visualRisk=${brand.visualRisk}, innovation=${brand.innovation} → approved`
        : 'disabled — see rejected[]',
    },
    tiltCard: {
      enabled: tiltEnabled,
      intensity: parseFloat(tiltIntensity.toFixed(2)),
      glare: brand.luxury >= 7,
      reason: tiltEnabled
        ? `luxury=${brand.luxury}, innovation=${brand.innovation} → approved`
        : 'disabled — see rejected[]',
    },
    kineticText: {
      enabled: kineticEnabled,
      splitBy: brand.innovation >= 8 ? 'char' : 'word',
      reason: kineticEnabled
        ? `motionTolerance=${brand.motionTolerance}, innovation=${brand.innovation} → approved`
        : 'disabled — see rejected[]',
    },
    parallax: {
      enabled: parallaxEnabled,
      strength: parseFloat(parallaxStrength.toFixed(3)),
      reason: parallaxEnabled
        ? `visualRisk=${brand.visualRisk}, motionTolerance=${brand.motionTolerance} → strength=${parallaxStrength.toFixed(3)}`
        : 'disabled — see rejected[]',
    },
    pinnedSection: {
      enabled: pinnedEnabled,
      reason: pinnedEnabled
        ? `innovation=${brand.innovation}, clarity=${brand.clarity} → approved`
        : 'disabled — see rejected[]',
    },
    motionIntensity,
    heroType: lock.heroType,
    materialRoute: lock.material,
    rejected,
  };
}

// ---------------------------------------------------------------------------
// Brand Presets — drop-in profiles for common archetypes
// ---------------------------------------------------------------------------
export const BRAND_PRESETS: Record<string, BrandDNA> = {
  space_age_ai: {
    industry: 'ai_agency',
    clarity: 7,
    authority: 7,
    innovation: 10,
    luxury: 8,
    trust: 7,
    emotion: 7,
    visualRisk: 9,
    motionTolerance: 9,
    mobileConversionPriority: 'standard',
  },
  healthcare: {
    industry: 'healthcare',
    clarity: 9,
    authority: 8,
    innovation: 3,
    luxury: 3,
    trust: 10,
    emotion: 7,
    visualRisk: 2,
    motionTolerance: 3,
    mobileConversionPriority: 'critical',
  },
  music_artist: {
    industry: 'music_artist',
    clarity: 6,
    authority: 5,
    innovation: 8,
    luxury: 7,
    trust: 4,
    emotion: 10,
    visualRisk: 10,
    motionTolerance: 10,
    mobileConversionPriority: 'standard',
  },
  restaurant: {
    industry: 'restaurant',
    clarity: 8,
    authority: 6,
    innovation: 4,
    luxury: 6,
    trust: 6,
    emotion: 8,
    visualRisk: 5,
    motionTolerance: 6,
    mobileConversionPriority: 'high',
  },
  ecommerce_luxury: {
    industry: 'ecommerce_fashion',
    clarity: 7,
    authority: 6,
    innovation: 7,
    luxury: 9,
    trust: 6,
    emotion: 8,
    visualRisk: 7,
    motionTolerance: 8,
    mobileConversionPriority: 'high',
  },
  saas_b2b: {
    industry: 'saas_b2b',
    clarity: 9,
    authority: 8,
    innovation: 6,
    luxury: 4,
    trust: 9,
    emotion: 4,
    visualRisk: 4,
    motionTolerance: 5,
    mobileConversionPriority: 'standard',
  },
  corporate_law: {
    industry: 'corporate_law',
    clarity: 10,
    authority: 10,
    innovation: 1,
    luxury: 5,
    trust: 10,
    emotion: 2,
    visualRisk: 1,
    motionTolerance: 1,
    mobileConversionPriority: 'standard',
  },
  nightclub: {
    industry: 'nightclub_event',
    clarity: 4,
    authority: 3,
    innovation: 9,
    luxury: 7,
    trust: 3,
    emotion: 10,
    visualRisk: 10,
    motionTolerance: 10,
    mobileConversionPriority: 'standard',
  },
};
