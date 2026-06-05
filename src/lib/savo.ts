/**
 * SAVO Motion Engine — getSAVOConfig(industry, brand) → MotionConfig
 *
 * Every field in MotionConfig maps 1:1 to a real component prop.
 * No guessing — the config decides, the component just renders it.
 *
 * Usage:
 *   import { getSAVOConfig } from '@/lib/savo';
 *   const config = getSAVOConfig('ai_agency', { innovation:10, visualRisk:9, luxury:8, clarity:7, energy:9, editorial:6 });
 *   <LiquidGlass intensity={config.liquidGlass.intensity} chromatic={config.liquidGlass.chromatic} />
 *   <GlassmorphicCard variant={config.glassmorphism.variant} blur={config.glassmorphism.blur} depth={config.glassmorphism.depth} />
 *   <HoverReveal method={config.hoverReveal.method} />
 */

// ---------------------------------------------------------------------------
// Brand signal inputs — 6 scores 0-10
// ---------------------------------------------------------------------------
export interface BrandSignals {
  /** How innovative / cutting-edge the brand feels (0–10) */
  innovation: number;
  /** Visual risk tolerance — willingness to use bold effects (0–10) */
  visualRisk: number;
  /** Luxury / premium positioning (0–10) */
  luxury: number;
  /** Desire for clarity / simplicity / trust signals (0–10) */
  clarity: number;
  /** Kinetic energy / how dynamic the brand feels (0–10) */
  energy: number;
  /** How editorial / typographic-led the brand is (0–10) */
  editorial: number;
}

// ---------------------------------------------------------------------------
// Output types
// ---------------------------------------------------------------------------
export type MotionIntensity = 'minimal' | 'standard' | 'high' | 'cinematic';

export type MaterialRoute =
  | 'dark_glass'
  | 'editorial_luxury'
  | 'clean_minimal'
  | 'vivid_gradient'
  | 'organic_warm'
  | 'technical_grid';

export interface MotionConfig {
  motionIntensity: MotionIntensity;
  materialRoute: MaterialRoute;

  parallax: {
    enabled: boolean;
    layers: number;
    reason: string;
  };

  textReveal: {
    enabled: boolean;
    method: 'word' | 'char' | 'line';
    stagger: number;
    reason: string;
  };

  cursorFX: {
    enabled: boolean;
    type: 'magnetic' | 'trail' | 'spotlight' | 'none';
    reason: string;
  };

  scrollProgress: {
    enabled: boolean;
    reason: string;
  };

  /**
   * Liquid Glass — Apple/iOS 26-style refraction via SVG filter chain.
   * Render pipeline: canvas lens map → feDisplacementMap (scale=intensity*55)
   *   → feColorMatrix saturate(50) → feBlend luminosity.
   * Chromatic aberration: R shifted -2px, B shifted +2px via feOffset.
   * BROWSER: SVG method = Chrome/Blink only. For cross-browser,
   *   swap component to ybouane/liquidglass (WebGL, all evergreen browsers).
   */
  liquidGlass: {
    enabled: boolean;
    method: 'svg' | 'css-only';
    intensity: number;
    chromatic: boolean;
    reason: string;
  };

  /**
   * Glassmorphism — backdrop-filter: blur + saturate [+ brightness/hue-rotate].
   * saturate() is critical — without it the blur renders grey and lifeless.
   * dark variant adds brightness(0.8) so content reads on top.
   */
  glassmorphism: {
    enabled: boolean;
    variant: 'light' | 'dark' | 'colored';
    blur: number;       // px — 8 to 20
    saturation: number; // % — 150 to 200
    depth: 'flat' | 'raised' | 'floating';
    reason: string;
  };

  /**
   * Hover Reveal — animated content reveal on :hover.
   * clip: clip-path inset() — hardware accelerated, no layout recalc
   * mask: mask-image gradient + mask-position — soft edge reveal
   * slide: overflow:hidden + translateY/X — most compatible
   */
  hoverReveal: {
    enabled: boolean;
    method: 'clip' | 'mask' | 'slide';
    reason: string;
  };

  /**
   * Neumorphism — dual box-shadow (dark -15% lightness, light +15% lightness).
   * HARD CONSTRAINT: bg prop MUST equal parent element background color.
   * Fails completely on dark backgrounds. Incompatible with dark_glass material.
   */
  neumorphism: {
    enabled: boolean;
    reason: string;
  };

  /** Audit trail — every disabled technique with the exact reason */
  rejected: Array<{ technique: string; reason: string }>;
}

// ---------------------------------------------------------------------------
// Industry Lock Matrix — hard gates per vertical, non-negotiable
// ---------------------------------------------------------------------------
export interface IndustryLock {
  parallax: boolean;
  textReveal: boolean;
  cursorFX: boolean;
  scrollProgress: boolean;
  liquidGlass: boolean;
  glassmorphism: boolean;
  hoverReveal: boolean;
  neumorphism: boolean;
}

export type Industry =
  | 'ai_agency'
  | 'music_artist'
  | 'nightclub_event'
  | 'portfolio_agency'
  | 'ecommerce_fashion'
  | 'fitness'
  | 'restaurant'
  | 'saas_b2b'
  | 'nonprofit'
  | 'healthcare'
  | 'credit_finance'
  | 'corporate_law';

export const INDUSTRY_LOCKS: Record<Industry, IndustryLock> = {
  // TIER 1 — Cinematic, all techniques available
  ai_agency:       { parallax:true,  textReveal:true,  cursorFX:true,  scrollProgress:true,  liquidGlass:true,  glassmorphism:true,  hoverReveal:true,  neumorphism:false },
  music_artist:    { parallax:true,  textReveal:true,  cursorFX:true,  scrollProgress:false, liquidGlass:true,  glassmorphism:true,  hoverReveal:true,  neumorphism:false },
  nightclub_event: { parallax:true,  textReveal:true,  cursorFX:true,  scrollProgress:false, liquidGlass:true,  glassmorphism:true,  hoverReveal:true,  neumorphism:false },
  portfolio_agency:{ parallax:true,  textReveal:true,  cursorFX:true,  scrollProgress:true,  liquidGlass:true,  glassmorphism:true,  hoverReveal:true,  neumorphism:false },
  // TIER 2 — High motion, most techniques
  ecommerce_fashion:{ parallax:true, textReveal:true,  cursorFX:true,  scrollProgress:false, liquidGlass:false, glassmorphism:true,  hoverReveal:true,  neumorphism:false },
  fitness:         { parallax:true,  textReveal:true,  cursorFX:false, scrollProgress:true,  liquidGlass:false, glassmorphism:false, hoverReveal:true,  neumorphism:false },
  restaurant:      { parallax:true,  textReveal:true,  cursorFX:false, scrollProgress:false, liquidGlass:false, glassmorphism:true,  hoverReveal:true,  neumorphism:false },
  // TIER 3 — Restrained, product-first
  saas_b2b:        { parallax:false, textReveal:true,  cursorFX:false, scrollProgress:true,  liquidGlass:false, glassmorphism:true,  hoverReveal:false, neumorphism:true  },
  nonprofit:       { parallax:false, textReveal:true,  cursorFX:false, scrollProgress:false, liquidGlass:false, glassmorphism:false, hoverReveal:false, neumorphism:false },
  // TIER 4 — Minimal, trust above everything
  healthcare:      { parallax:false, textReveal:false, cursorFX:false, scrollProgress:false, liquidGlass:false, glassmorphism:false, hoverReveal:false, neumorphism:false },
  credit_finance:  { parallax:false, textReveal:true,  cursorFX:false, scrollProgress:false, liquidGlass:false, glassmorphism:false, hoverReveal:false, neumorphism:true  },
  corporate_law:   { parallax:false, textReveal:false, cursorFX:false, scrollProgress:false, liquidGlass:false, glassmorphism:false, hoverReveal:false, neumorphism:false },
};

// ---------------------------------------------------------------------------
// Core decision function
// ---------------------------------------------------------------------------
export function getSAVOConfig(industry: Industry, brand: BrandSignals): MotionConfig {
  const lock = INDUSTRY_LOCKS[industry];
  const rejected: Array<{ technique: string; reason: string }> = [];

  const motionIntensity = deriveMotionIntensity(brand);
  const materialRoute   = deriveMaterialRoute(brand);

  // Parallax
  const parallax = (() => {
    if (!lock.parallax) {
      rejected.push({ technique: 'parallax', reason: 'Locked by industry' });
      return { enabled: false, layers: 0, reason: 'Locked by industry' };
    }
    if (brand.energy < 5) {
      rejected.push({ technique: 'parallax', reason: `energy=${brand.energy} < 5` });
      return { enabled: false, layers: 0, reason: 'energy too low' };
    }
    const layers = brand.energy >= 8 ? 4 : brand.energy >= 6 ? 3 : 2;
    return { enabled: true, layers, reason: `energy=${brand.energy} → ${layers} layers` };
  })();

  // Text reveal
  const textReveal = (() => {
    if (!lock.textReveal) {
      rejected.push({ technique: 'textReveal', reason: 'Locked by industry' });
      return { enabled: false, method: 'line' as const, stagger: 0, reason: 'Locked by industry' };
    }
    const method: 'word' | 'char' | 'line' =
      brand.editorial >= 8 ? 'char' : brand.editorial >= 5 ? 'word' : 'line';
    const stagger = brand.energy >= 7 ? 0.04 : 0.07;
    return { enabled: true, method, stagger, reason: `editorial=${brand.editorial} → ${method}, stagger=${stagger}s` };
  })();

  // Cursor FX
  const cursorFX = (() => {
    if (!lock.cursorFX) {
      rejected.push({ technique: 'cursorFX', reason: 'Locked by industry' });
      return { enabled: false, type: 'none' as const, reason: 'Locked by industry' };
    }
    if (brand.innovation < 6) {
      rejected.push({ technique: 'cursorFX', reason: `innovation=${brand.innovation} < 6` });
      return { enabled: false, type: 'none' as const, reason: 'innovation too low' };
    }
    const type: 'magnetic' | 'trail' | 'spotlight' =
      brand.innovation >= 9 ? 'magnetic' : brand.visualRisk >= 8 ? 'trail' : 'spotlight';
    return { enabled: true, type, reason: `innovation=${brand.innovation}, visualRisk=${brand.visualRisk} → ${type}` };
  })();

  // Scroll progress
  const scrollProgress = (() => {
    if (!lock.scrollProgress) {
      rejected.push({ technique: 'scrollProgress', reason: 'Locked by industry' });
      return { enabled: false, reason: 'Locked by industry' };
    }
    return { enabled: true, reason: 'Industry allows' };
  })();

  // Liquid Glass
  // Requires innovation ≥ 9 AND visualRisk ≥ 8
  // SVG path = Chrome-only. WebGL path = ybouane/liquidglass (cross-browser)
  const liquidGlass = (() => {
    const off = { enabled: false, method: 'css-only' as const, intensity: 0, chromatic: false };
    if (!lock.liquidGlass) {
      rejected.push({ technique: 'liquidGlass', reason: 'Locked by industry' });
      return { ...off, reason: 'Locked by industry' };
    }
    if (brand.innovation < 9) {
      rejected.push({ technique: 'liquidGlass', reason: `innovation=${brand.innovation} < 9` });
      return { ...off, reason: 'innovation below threshold (needs ≥ 9)' };
    }
    if (brand.visualRisk < 8) {
      rejected.push({ technique: 'liquidGlass', reason: `visualRisk=${brand.visualRisk} < 8` });
      return { ...off, reason: 'visualRisk below threshold (needs ≥ 8)' };
    }
    return {
      enabled: true,
      method: 'svg' as const,
      intensity: parseFloat((brand.visualRisk / 10).toFixed(2)),
      chromatic: brand.innovation >= 9,
      reason: `innovation=${brand.innovation}, visualRisk=${brand.visualRisk} → SVG displacement (Chrome-only; swap LiquidGlass component to ybouane/liquidglass for WebGL cross-browser)`,
    };
  })();

  // Glassmorphism
  // blur = 8 + (luxury/10)*12 → range 8-20px
  // saturation = 150 + (luxury/10)*50 → range 150-200%
  const glassmorphism = (() => {
    const off = { enabled: false, variant: 'dark' as const, blur: 12, saturation: 180, depth: 'flat' as const };
    if (!lock.glassmorphism) {
      rejected.push({ technique: 'glassmorphism', reason: 'Locked by industry' });
      return { ...off, reason: 'Locked by industry' };
    }
    if (brand.luxury < 6) {
      rejected.push({ technique: 'glassmorphism', reason: `luxury=${brand.luxury} < 6` });
      return { ...off, reason: 'luxury below threshold (needs ≥ 6)' };
    }
    const variant: 'light' | 'dark' | 'colored' =
      materialRoute === 'dark_glass' ? 'dark' :
      materialRoute === 'editorial_luxury' ? 'colored' : 'light';
    const blur = 8 + Math.round((brand.luxury / 10) * 12);
    const saturation = 150 + Math.round((brand.luxury / 10) * 50);
    const depth: 'flat' | 'raised' | 'floating' =
      motionIntensity === 'cinematic' ? 'floating' :
      motionIntensity === 'high' ? 'raised' : 'flat';
    return {
      enabled: true, variant, blur, saturation, depth,
      reason: `luxury=${brand.luxury} → variant='${variant}', blur=${blur}px, sat=${saturation}%, depth='${depth}'`,
    };
  })();

  // Hover Reveal
  // method driven by innovation tier: ≥8=clip, ≥6=mask, else slide
  const hoverReveal = (() => {
    if (!lock.hoverReveal) {
      rejected.push({ technique: 'hoverReveal', reason: 'Locked by industry' });
      return { enabled: false, method: 'slide' as const, reason: 'Locked by industry' };
    }
    if (brand.innovation < 5) {
      rejected.push({ technique: 'hoverReveal', reason: `innovation=${brand.innovation} < 5` });
      return { enabled: false, method: 'slide' as const, reason: 'innovation too low (needs ≥ 5)' };
    }
    const method: 'clip' | 'mask' | 'slide' =
      brand.innovation >= 8 ? 'clip' : brand.innovation >= 6 ? 'mask' : 'slide';
    return { enabled: true, method, reason: `innovation=${brand.innovation} → method='${method}'` };
  })();

  // Neumorphism
  // INCOMPATIBLE with dark_glass — shadows invisible on dark backgrounds
  // Requires clarity ≥ 7 (clean single-color bg is the whole premise)
  const neumorphism = (() => {
    if (!lock.neumorphism) {
      rejected.push({ technique: 'neumorphism', reason: 'Locked by industry' });
      return { enabled: false, reason: 'Locked by industry' };
    }
    if (brand.clarity < 7) {
      rejected.push({ technique: 'neumorphism', reason: `clarity=${brand.clarity} < 7` });
      return { enabled: false, reason: 'clarity below threshold (needs ≥ 7)' };
    }
    if (materialRoute === 'dark_glass') {
      rejected.push({ technique: 'neumorphism', reason: `incompatible with material='${materialRoute}'` });
      return { enabled: false, reason: `incompatible with '${materialRoute}' — shadows invisible on dark backgrounds` };
    }
    return {
      enabled: true,
      reason: `clarity=${brand.clarity}, material='${materialRoute}' → approved. Note: bg prop must equal parent background.`,
    };
  })();

  return {
    motionIntensity,
    materialRoute,
    parallax,
    textReveal,
    cursorFX,
    scrollProgress,
    liquidGlass,
    glassmorphism,
    hoverReveal,
    neumorphism,
    rejected,
  };
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------
function deriveMotionIntensity(brand: BrandSignals): MotionIntensity {
  const composite = (brand.energy + brand.visualRisk + brand.innovation) / 3;
  if (composite >= 8.5) return 'cinematic';
  if (composite >= 6.5) return 'high';
  if (composite >= 4)   return 'standard';
  return 'minimal';
}

function deriveMaterialRoute(brand: BrandSignals): MaterialRoute {
  if (brand.luxury >= 7 && brand.visualRisk >= 7)  return 'dark_glass';
  if (brand.editorial >= 7 && brand.luxury >= 5)   return 'editorial_luxury';
  if (brand.innovation >= 7 && brand.energy >= 7)  return 'vivid_gradient';
  if (brand.clarity <= 4 && brand.energy >= 5)     return 'organic_warm';
  if (brand.clarity >= 7 && brand.innovation >= 6) return 'technical_grid';
  return 'clean_minimal';
}

// ---------------------------------------------------------------------------
// Convenience wrapper — merges partial brand signals with defaults (5/10 each)
// ---------------------------------------------------------------------------
export function getSAVOConfigForIndustry(
  industry: Industry,
  partialBrand: Partial<BrandSignals> = {}
): MotionConfig {
  const defaults: BrandSignals = { innovation:5, visualRisk:5, luxury:5, clarity:5, energy:5, editorial:5 };
  return getSAVOConfig(industry, { ...defaults, ...partialBrand });
}

// ---------------------------------------------------------------------------
// Brand presets
// ---------------------------------------------------------------------------
export const BRAND_PRESETS: Record<string, { industry: Industry; brand: BrandSignals }> = {
  space_age_ai: {
    industry: 'ai_agency',
    brand: { innovation:10, visualRisk:9, luxury:8, clarity:7, energy:9, editorial:6 },
  },
  music_artist: {
    industry: 'music_artist',
    brand: { innovation:8, visualRisk:10, luxury:7, clarity:5, energy:10, editorial:7 },
  },
  healthcare: {
    industry: 'healthcare',
    brand: { innovation:3, visualRisk:2, luxury:3, clarity:9, energy:3, editorial:4 },
  },
  restaurant: {
    industry: 'restaurant',
    brand: { innovation:5, visualRisk:5, luxury:6, clarity:7, energy:6, editorial:5 },
  },
  saas_b2b: {
    industry: 'saas_b2b',
    brand: { innovation:6, visualRisk:4, luxury:4, clarity:9, energy:5, editorial:5 },
  },
  corporate_law: {
    industry: 'corporate_law',
    brand: { innovation:1, visualRisk:1, luxury:5, clarity:10, energy:2, editorial:6 },
  },
};
