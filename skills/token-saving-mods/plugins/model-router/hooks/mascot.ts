// The pane's mascot: a pixel Claude dispatcher in a blue cap. It holds up a green signal
// paddle and stands next to three doors, one per model (Haiku, Sonnet, Opus).
// While Haiku judges a task the paddle waves and the doors light up one by one.
// Helper Desk draws a crab; this silhouette is tall, with a paddle and doors.

type Px = [x: number, y: number]
type Layer = { cls?: string; color: string; px: Px[]; outline?: boolean }

const CLAUDE = '#d97757'
const INK = '#2b1d16'
const CAP = '#2563eb'
const PADDLE = '#16a34a'
// The three doors, in tier order: Haiku, Sonnet, Opus.
export const DOOR_COLORS = ['#0d9488', '#7c3aed', '#c2410c'] as const

const W = 24
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

function draw(groups: { cls?: string; layers: Layer[] }[], css: string, width: number, height: number) {
  const body = groups
    .map(g => {
      const solid = g.layers.filter(l => l.outline !== false).flatMap(l => l.px)
      const inner = rects(ring(solid), INK) + g.layers.map(l => rects(l.px, l.color)).join('')
      return g.cls ? `<g class="${g.cls}">${inner}</g>` : inner
    })
    .join('')
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W + 2} ${H + 2}" width="${width}" height="${height}" shape-rendering="crispEdges">${css ? `<style>${css}</style>` : ''}${body}</svg>`
}

const ANIMATED = [
  '.paddle{transform-box:view-box;transform-origin:13.5px 10.5px;animation:wave .7s ease-in-out infinite alternate}',
  '@keyframes wave{from{transform:rotate(-22deg)}to{transform:rotate(18deg)}}',
  '.d0,.d1,.d2{animation:lit 1.5s steps(1) infinite;opacity:.35}',
  '.d1{animation-delay:.5s}.d2{animation-delay:1s}',
  '@keyframes lit{0%{opacity:1}33%{opacity:.35}100%{opacity:.35}}',
  '@media (prefers-reduced-motion: reduce){.paddle,.d0,.d1,.d2{animation:none;opacity:1}}',
].join('')

const cache = new Map<string, string>()

/**
 * The dispatcher. `working` adds the waving paddle and the doors lighting in turn;
 * `lit` (0, 1 or 2) lights one door when it stands still, the model the last task went to.
 */
export function dispatcherSvg(working: boolean, lit: number | null = null, width = 72, height = 48): string {
  const key = `${working}:${lit}:${width}:${height}`
  const hit = cache.get(key)
  if (hit) return hit
  const body: Layer[] = [
    { color: CLAUDE, px: [...block(3, 5, 10, 12), [2, 8], [2, 9], [11, 9]] },
    { color: CAP, px: [...block(4, 2, 9, 4), ...span(4, 2, 3)] },
    { color: INK, px: [[5, 7], [5, 8], [8, 7], [8, 8]], outline: false },
    { color: CLAUDE, px: [[4, 13], [4, 14], [9, 13], [9, 14]] },
  ]
  const paddle: Layer[] = [
    { color: CLAUDE, px: [[12, 9], [13, 9]] },
    { color: INK, px: [[13, 8], [13, 7], [13, 6], [13, 5]], outline: false },
    { color: PADDLE, px: block(11, 0, 15, 4).filter(([x, y]) => !((x === 11 || x === 15) && (y === 0 || y === 4)) && y !== 2) },
    { color: '#ffffff', px: span(2, 11, 15) },
  ]
  const doors = DOOR_COLORS.map((color, i) => {
    const x = 16 + i * 3
    return {
      cls: working ? `d${i}` : undefined,
      layers: [
        { color: !working && lit !== null && lit !== i ? '#a8a29e' : color, px: block(x, 7, x + 1, 14) },
        { color: '#fef3c7', px: [[x + 1, 11]] as Px[], outline: false },
      ],
    }
  })
  const svg = draw([{ layers: body }, { cls: 'paddle', layers: paddle }, ...doors], working ? ANIMATED : '', width, height)
  cache.set(key, svg)
  return svg
}
