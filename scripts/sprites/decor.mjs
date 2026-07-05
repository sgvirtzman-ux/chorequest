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
  const g = makeGrid(96, 52)
  // six 3px concentric arc bands with a subtle dark under-edge each
  const darks = ['9', '0', '3', '6', '7', '8']
  RAINBOW.forEach((c, i) => {
    const rOuter = 46 - i * 4
    for (let deg = 0; deg <= 180; deg += 0.5) {
      const a = (deg / 180) * Math.PI
      for (const r of [rOuter, rOuter - 1, rOuter - 2]) {
        px(g, 48 + Math.cos(a) * r, 50 - Math.sin(a) * r, c)
      }
      px(g, 48 + Math.cos(a) * (rOuter - 3), 50 - Math.sin(a) * (rOuter - 3), darks[i])
    }
  })
  // fluffy cloud puffs at the feet
  for (const cx of [7, 89]) {
    ellipse(g, cx, 47, 6.5, 4, 'w')
    ellipse(g, cx + (cx < 48 ? 5 : -5), 49, 5.5, 3, 'w')
    ellipse(g, cx + (cx < 48 ? -3 : 3), 50, 4, 2.4, 'w')
    px(g, cx - 2, 44, 'W')
    hline(g, cx - 3, cx + 4, 51, '5')
  }
  return outline(g)
}

function planet() {
  const g = makeGrid(64)
  // teal planet with terminator shading + craters
  disc(g, 32, 32, 18, 't')
  for (let j = 14; j <= 50; j++) {
    for (let i = 14; i <= 50; i++) {
      const dx = (i - 32) / 18
      const dy = (j - 32) / 18
      const d = dx * dx + dy * dy
      if (d <= 1.05 && dx + dy > 0.65) px(g, i, j, 'T')
      if (d <= 1.05 && dx + dy > 1.15) px(g, i, j, '2')
    }
  }
  ellipse(g, 25, 23, 4.5, 3, 'u') // highlight
  for (const [cx, cy, r] of [[38, 26, 3], [24, 38, 2.4], [33, 44, 1.8]]) {
    disc(g, cx, cy, r, 'T')
    px(g, cx - 1, cy - 1, 'u')
  }
  // pink ring: front half passes over the disc
  for (let a = 0; a <= 180; a += 0.5) {
    const t = (a / 180) * Math.PI
    const x = 32 + Math.cos(t) * 28
    const y = 35 + Math.sin(t) * 7
    if (y >= 35) {
      px(g, x, y, 'p')
      px(g, x, y - 1, 'q')
      px(g, x, y + 1, 'P')
    }
  }
  hline(g, 1, 6, 35, 'p')
  hline(g, 58, 63, 35, 'p')
  hline(g, 2, 5, 34, 'q')
  hline(g, 59, 62, 34, 'q')
  return outline(g)
}

function crown() {
  const g = makeGrid(32, 28)
  // band with bronze base + cream shine
  fillRect(g, 4, 17, 24, 8, 'y')
  hline(g, 4, 27, 23, 'Y')
  hline(g, 4, 27, 24, '3')
  hline(g, 5, 26, 17, '4')
  // three spikes with topping jewels
  for (const cx of [7, 16, 25]) {
    for (let j = 0; j < 11; j++) {
      const half = Math.round((j / 10) * 3)
      hline(g, cx - half, cx + half, 7 + j, 'y')
    }
    vline(g, cx + 2, 12, 16, 'Y')
    px(g, cx - 1, 9, '4')
  }
  px(g, 7, 5, 'p')
  fillRect(g, 15, 3, 3, 3, 't')
  px(g, 15, 3, 'u')
  px(g, 25, 5, 'p')
  // center ruby
  fillRect(g, 14, 19, 4, 4, 'r')
  px(g, 14, 19, 'W')
  px(g, 17, 22, '9')
  // side gems
  px(g, 8, 20, 'b')
  px(g, 24, 20, 'b')
  return outline(g)
}

function coin() {
  const g = makeGrid(32)
  disc(g, 15.5, 15.5, 13, 'y')
  for (let a = 0; a < 72; a++) {
    const t = (a / 72) * Math.PI * 2
    const c = Math.sin(t) > 0.3 ? '3' : 'Y'
    px(g, 15.5 + Math.cos(t) * 13, 15.5 + Math.sin(t) * 13, c)
    px(g, 15.5 + Math.cos(t) * 12, 15.5 + Math.sin(t) * 12, c)
  }
  // star stamp
  sparkle(g, 15, 15, 'Y', 5)
  sparkle(g, 15, 15, '3', 2)
  // glint
  px(g, 8, 8, 'W')
  px(g, 9, 8, '4')
  px(g, 8, 9, '4')
  px(g, 10, 7, 'W')
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
  rainbow: { dir: DIR, rows: toRows(rainbow()), scale: 2 },
  planet: { dir: DIR, rows: toRows(planet()), scale: 2 },
  crown: { dir: DIR, rows: toRows(crown()), scale: 4 },
  coin: { dir: DIR, rows: toRows(coin()), scale: 4 },
  'star-small': { dir: DIR, rows: toRows(starSmall()), scale: 4 },
}
