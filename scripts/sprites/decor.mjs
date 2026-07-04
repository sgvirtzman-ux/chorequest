import {
  disc,
  ellipse,
  fillRect,
  hline,
  lcg,
  line,
  makeGrid,
  outline,
  px,
  ring,
  sparkle,
  toRows,
  vline,
} from '../kit.mjs'
import { RAINBOW } from '../palette.mjs'

const DIR = 'decor'

/** seamless 64x64 starfield tile (transparent background, layered over --bg) */
function starTile(seed, count, bright) {
  const g = makeGrid(64)
  const rand = lcg(seed)
  const colors = bright ? ['W', 'w', 't', 'p', 'y'] : ['n', 's', 'N', 'w']
  for (let i = 0; i < count; i++) {
    // keep 1px off the edges so the tile repeats without seams
    const x = 1 + Math.floor(rand() * 62)
    const y = 1 + Math.floor(rand() * 62)
    const c = colors[Math.floor(rand() * colors.length)]
    if (bright && rand() > 0.8) sparkle(g, x, y, c)
    else px(g, x, y, c)
  }
  return g
}

function rainbow() {
  const g = makeGrid(48, 26)
  // six concentric arc bands
  RAINBOW.forEach((c, i) => {
    const rOuter = 23 - i * 2
    for (let deg = 0; deg <= 180; deg += 1) {
      const a = (deg / 180) * Math.PI
      for (const r of [rOuter, rOuter - 1]) {
        const x = 24 + Math.cos(a + Math.PI) * r
        const y = 25 - Math.sin(a + Math.PI) * -r
        px(g, x, 25 - Math.sin(a) * r, c)
      }
    }
  })
  // cloud puffs at the feet
  for (const cx of [3, 45]) {
    ellipse(g, cx, 24, 3.4, 2, 'w')
    ellipse(g, cx + (cx < 24 ? 3 : -3), 25, 3, 1.6, 'w')
  }
  return outline(g)
}

function planet() {
  const g = makeGrid(32)
  // teal planet with shading + craters
  disc(g, 15.5, 15.5, 9, 't')
  for (let j = 7; j <= 25; j++) {
    for (let i = 7; i <= 25; i++) {
      const dx = (i - 15.5) / 9
      const dy = (j - 15.5) / 9
      if (dx * dx + dy * dy <= 1.05 && dx + dy > 0.7) px(g, i, j, 'T')
    }
  }
  ellipse(g, 12, 11, 2.4, 1.6, 'u') // highlight
  disc(g, 18, 13, 1.4, 'T')
  disc(g, 12, 18, 1.2, 'T')
  // pink ring — behind is hidden, front half drawn over the disc
  for (let a = 0; a <= 180; a += 1) {
    const t = (a / 180) * Math.PI
    const x = 15.5 + Math.cos(t) * 14
    const y = 17 + Math.sin(t) * 3.6
    if (y >= 17) {
      px(g, x, y, 'p')
      px(g, x, y - 1, 'q')
    }
  }
  // ring tips
  hline(g, 0, 3, 17, 'p')
  hline(g, 28, 31, 17, 'p')
  return outline(g)
}

function crown() {
  const g = makeGrid(16, 14)
  fillRect(g, 2, 8, 12, 4, 'y')
  hline(g, 2, 13, 11, 'Y')
  // three spikes
  for (const cx of [3, 8, 13]) {
    line(g, cx - 1, 8, cx, 3, 'y')
    line(g, cx + 1, 8, cx, 3, 'y')
    vline(g, cx, 4, 8, 'y')
  }
  px(g, 3, 2, 'p')
  px(g, 8, 2, 't')
  px(g, 13, 2, 'p')
  px(g, 7, 9, 'r')
  px(g, 8, 9, 'r')
  return outline(g)
}

function coin() {
  const g = makeGrid(16)
  disc(g, 7.5, 7.5, 6, 'y')
  for (let a = 0; a < 32; a++) {
    const t = (a / 32) * Math.PI * 2
    px(g, 7.5 + Math.cos(t) * 6, 7.5 + Math.sin(t) * 6, 'Y')
  }
  // star stamp
  sparkle(g, 7, 7, 'Y', 2)
  px(g, 4, 4, 'W')
  px(g, 5, 3, 'W')
  return outline(g)
}

/** small 4-point star for UI garnish */
function starSmall() {
  const g = makeGrid(12)
  sparkle(g, 5, 5, 'w', 4)
  sparkle(g, 5, 5, 'W', 2)
  px(g, 4, 4, 'W')
  px(g, 6, 4, 'W')
  px(g, 4, 6, 'W')
  px(g, 6, 6, 'W')
  return g
}

export default {
  'star-tile': { dir: DIR, rows: toRows(starTile(42, 46, false)), scale: 2 },
  'star-tile-bright': { dir: DIR, rows: toRows(starTile(7, 22, true)), scale: 2 },
  rainbow: { dir: DIR, rows: toRows(rainbow()) },
  planet: { dir: DIR, rows: toRows(planet()) },
  crown: { dir: DIR, rows: toRows(crown()), scale: 8 },
  coin: { dir: DIR, rows: toRows(coin()), scale: 8 },
  'star-small': { dir: DIR, rows: toRows(starSmall()), scale: 4 },
}
