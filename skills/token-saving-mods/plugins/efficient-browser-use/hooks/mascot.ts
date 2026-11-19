// The pane's mascot: a small pixel Claude camera on two feet. A photo sits beside its lens.
// While a picture is being shrunk the flash blinks and the photo squeezes to half its size.
// Helper Desk draws a crab; this silhouette is a box with a flash, a lens and a photo.

type Px = [x: number, y: number]
type Layer = { color: string; px: Px[]; outline?: boolean }

const CLAUDE = '#d97757'
const INK = '#2b1d16'
const FLASH = '#facc15'
const BARREL = '#57534e'
const LENS = '#93c5fd'
const PAPER = '#f5f5f4'
const SKY = '#60a5fa'
const HILL = '#16a34a'
const SUN = '#facc15'

const W = 24
const H = 15

const span = (y: number, from: number, to: number): Px[] => Array.from({ length: to - from + 1 }, (_, i) => [from + i, y] as Px)
const block = (x0: number, y0: number, x1: number, y1: number): Px[] => {
  const out: Px[] = []
  for (let y = y0; y <= y1; y++) out.push(...span(y, x0, x1))
  return out
}

/** One-pixel dark ring round a set of pixels, so the drawing reads on light and dark. */
function ring(px: Px[]): Px[] {
  const has = new Set(px.map(([x, y]) => `${x},${y}`))
  const out = new Map<string, Px>()
  for (const [x, y] of px) {
    for (const p of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]] as Px[]) {
      const k = `${p[0]},${p[1]}`
      if (!has.has(k)) out.set(k, p)
    }
  }
  return [...out.values()]
}

const rects = (px: Px[], color: string) => px.map(([x, y]) => `<rect x="${x + 1}" y="${y + 1}" width="1" height="1" fill="${color}"/>`).join('')

function group(layers: Layer[], cls?: string) {
  const solid = layers.filter(l => l.outline !== false).flatMap(l => l.px)
  const inner = rects(ring(solid), INK) + layers.map(l => rects(l.px, l.color)).join('')
  return cls ? `<g class="${cls}">${inner}</g>` : inner
}

const ANIMATED = [
  '.photo{transform-box:view-box;transform-origin:17px 9px;animation:squeeze 1s ease-in-out infinite alternate}',
  '@keyframes squeeze{from{transform:scale(1)}to{transform:scale(.5)}}',
  '.flash{animation:flash .5s steps(1) infinite}',
  '@keyframes flash{0%{opacity:1}50%{opacity:.25}}',
  '@media (prefers-reduced-motion: reduce){.photo,.flash{animation:none}}',
].join('')

const cache = new Map<boolean, string>()

/** The camera. `working` adds the blinking flash and the squeezing photo. */
export function cameraSvg(working: boolean, width = 72, height = 45): string {
  const hit = cache.get(working)
  if (hit) return hit
  const body: Layer[] = [
    { color: CLAUDE, px: [...block(1, 5, 11, 12), [3, 13], [9, 13]] },
    { color: INK, px: [...span(4, 8, 9)] },
    { color: BARREL, px: block(12, 7, 13, 10) },
    { color: LENS, px: [[14, 8], [14, 9]] },
    { color: INK, px: [[4, 7], [4, 8], [7, 7], [7, 8]], outline: false },
  ]
  const flash: Layer[] = [{ color: FLASH, px: block(2, 3, 4, 4) }]
  const photo: Layer[] = [
    { color: PAPER, px: [...block(16, 2, 23, 2), ...block(16, 3, 16, 12), ...block(23, 3, 23, 12), ...block(16, 13, 23, 13)] },
    { color: SKY, px: block(17, 3, 22, 8), outline: false },
    { color: SUN, px: [[21, 4], [21, 5], [20, 4]], outline: false },
    { color: HILL, px: [...block(17, 9, 22, 12), [18, 8], [19, 8]], outline: false },
  ]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W + 2} ${H + 2}" width="${width}" height="${height}" shape-rendering="crispEdges">${working ? `<style>${ANIMATED}</style>` : ''}${group(body)}${group(flash, 'flash')}${group(photo, 'photo')}</svg>`
  cache.set(working, svg)
  return svg
}
