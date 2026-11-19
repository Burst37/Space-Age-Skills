// The pane's mascot: a pixel Claude explorer in a sun helmet, holding a big magnifying glass.
// While a research run or an auto-mode search is working, the glass sweeps from side to side.
// Helper Desk draws a crab; this silhouette is round, with a wide hat brim and a glass.

type Px = [x: number, y: number]
type Layer = { color: string; px: Px[]; outline?: boolean }

const CLAUDE = '#d97757'
const INK = '#2b1d16'
const HAT = '#ca8a04'
const BAND = '#78350f'
const GLASS = '#bae6fd'
const RIM = '#57534e'

const W = 22
const H = 16

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
  '.glass{animation:sweep 1.4s ease-in-out infinite alternate}',
  '@keyframes sweep{from{transform:translate(-2px,1px)}to{transform:translate(1px,-1px)}}',
  '.blink{animation:blink 3s steps(1) infinite}',
  '@keyframes blink{0%{opacity:1}92%{opacity:0}100%{opacity:1}}',
  '@media (prefers-reduced-motion: reduce){.glass,.blink{animation:none}}',
].join('')

const cache = new Map<boolean, string>()

/** The explorer. `working` adds the sweeping glass. */
export function explorerSvg(working: boolean, width = 66, height = 48): string {
  const key = working
  const hit = cache.get(key)
  if (hit) return hit
  // A round body: a block with its corners cut.
  const round = block(2, 6, 11, 13).filter(([x, y]) => !((x === 2 || x === 11) && (y === 6 || y === 13)))
  const body: Layer[] = [
    { color: CLAUDE, px: [...round, [4, 14], [9, 14]] },
    { color: HAT, px: [...block(4, 2, 9, 4), ...span(5, 1, 12)] },
    { color: BAND, px: span(4, 4, 9), outline: false },
  ]
  const eyes = `<g class="${working ? 'blink' : ''}">${rects([[5, 8], [5, 9], [8, 8], [8, 9]], INK)}</g>`
  const lens = block(15, 4, 17, 6)
  const rim = [...span(3, 15, 17), ...span(7, 15, 17), [14, 4], [14, 5], [14, 6], [18, 4], [18, 5], [18, 6]] as Px[]
  const glass: Layer[] = [
    { color: CLAUDE, px: [[12, 10], [13, 10]] },
    { color: RIM, px: [...rim, [14, 8], [13, 9]] },
    { color: GLASS, px: lens },
    { color: '#ffffff', px: [[15, 4]], outline: false },
  ]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W + 2} ${H + 2}" width="${width}" height="${height}" shape-rendering="crispEdges">${working ? `<style>${ANIMATED}</style>` : ''}${group(body)}${eyes}${group(glass, 'glass')}</svg>`
  cache.set(key, svg)
  return svg
}
