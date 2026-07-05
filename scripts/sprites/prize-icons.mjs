import {
  disc,
  dither,
  ellipse,
  fillRect,
  hline,
  line,
  makeGrid,
  outline,
  px,
  sparkle,
  toRows,
  vline,
} from '../kit.mjs'

const DIR = 'icons/prizes'
const SCALE = 2 // 64x64 grid -> 128x128 png

// ---- shared money-drawing helpers ----------------------------------------

/** face-on coin with shaded rim, star stamp and glints */
function coinFace(g, cx, cy, r) {
  disc(g, cx, cy, r, 'y')
  for (let a = 0; a < 48; a++) {
    const t = (a / 48) * Math.PI * 2
    px(g, cx + Math.cos(t) * r, cy + Math.sin(t) * r, Math.sin(t) > 0.3 ? '3' : 'Y')
  }
  sparkle(g, cx, cy, 'Y', Math.max(1, Math.round(r / 3)))
  px(g, cx - r / 2, cy - r / 2, 'W')
  px(g, cx - r / 2 + 1, cy - r / 2, '4')
}

/** side-view coin for piles */
function coinSide(g, cx, cy) {
  ellipse(g, cx, cy, 4.6, 2.2, 'y')
  hline(g, cx - 4, cx + 4, cy + 2, 'Y')
  hline(g, cx - 3, cx + 3, cy + 3, '3')
  px(g, cx - 2, cy - 1, 'W')
  px(g, cx - 1, cy - 1, '4')
}

/** side view stack of bills with optional currency band */
function stack(g, x, y, w, h, banded) {
  fillRect(g, x, y, w, h, 'g')
  for (let j = y + 3; j < y + h; j += 3) {
    hline(g, x, x + w - 1, j, 'G')
  }
  vline(g, x, y, y + h - 1, 'G')
  vline(g, x + w - 1, y, y + h - 1, '6')
  vline(g, x + w - 2, y + 1, y + h - 1, '6')
  hline(g, x, x + w - 1, y + h - 1, '6')
  hline(g, x + 1, x + w - 2, y, 'w')
  hline(g, x + 1, x + w - 3, y + 1, '4')
  if (banded) {
    const bx = x + Math.floor(w / 2) - 3
    fillRect(g, bx, y, 6, h, 'y')
    vline(g, bx, y, y + h - 1, 'Y')
    vline(g, bx + 5, y, y + h - 1, '3')
    hline(g, bx + 1, bx + 4, y, '4')
  }
}

/** single bill seen from above, with border and center seal */
function bill(g, x, y, w = 26, h = 14) {
  fillRect(g, x, y, w, h, 'g')
  for (let i = x; i < x + w; i++) {
    px(g, i, y, 'G')
    px(g, i, y + h - 1, '6')
  }
  vline(g, x, y, y + h - 1, 'G')
  vline(g, x + w - 1, y, y + h - 1, '6')
  hline(g, x + 1, x + w - 2, y + 1, 'w')
  ellipse(g, x + w / 2, y + h / 2, 3.6, 2.6, 'G')
  // $ mark
  px(g, x + w / 2, y + h / 2 - 1, 'w')
  px(g, x + w / 2 - 1, y + h / 2, 'w')
  px(g, x + w / 2, y + h / 2 + 1, 'w')
  px(g, x + w / 2 + 1, y + h / 2, '4')
  // corner denominations
  px(g, x + 2, y + 2, 'w')
  px(g, x + w - 3, y + h - 3, '6')
}

// ---- prizes ---------------------------------------------------------------

function coinsFew() {
  const g = makeGrid(64)
  coinFace(g, 32, 18, 11)
  coinFace(g, 17, 42, 10)
  coinFace(g, 47, 42, 10)
  sparkle(g, 55, 10, 'W', 2)
  sparkle(g, 8, 24, 'w')
  sparkle(g, 32, 58, 'w')
  return outline(g)
}

function coinPile() {
  const g = makeGrid(64)
  const rows = [
    [58, [8, 17, 26, 35, 44, 53]],
    [52, [12, 21, 30, 39, 48]],
    [46, [17, 26, 35, 44]],
    [40, [22, 31, 40]],
  ]
  for (const [y, xs] of rows) {
    for (const x of xs) coinSide(g, x, y)
  }
  coinFace(g, 31, 22, 10)
  sparkle(g, 52, 12, 'W', 2)
  sparkle(g, 10, 18, 'w')
  return outline(g)
}

function cashBills() {
  const g = makeGrid(64)
  bill(g, 6, 8)
  bill(g, 16, 24)
  bill(g, 26, 40)
  sparkle(g, 50, 10, 'W', 2)
  sparkle(g, 8, 46, 'w')
  return outline(g)
}

function cashSmall() {
  const g = makeGrid(64)
  stack(g, 12, 26, 40, 22, true)
  coinSide(g, 10, 54)
  coinSide(g, 54, 52)
  sparkle(g, 50, 14, 'W', 2)
  sparkle(g, 10, 16, 'w')
  return outline(g)
}

function cashLarge() {
  const g = makeGrid(64)
  stack(g, 6, 18, 26, 34, true)
  stack(g, 32, 32, 26, 20, false)
  coinFace(g, 47, 18, 8)
  coinSide(g, 36, 56)
  sparkle(g, 12, 8, 'W', 2)
  sparkle(g, 58, 44, 'w')
  return outline(g)
}

function cashHuge() {
  const g = makeGrid(64)
  // mountain of money: mostly green, one banded stack up top
  stack(g, 4, 22, 20, 16, false)
  stack(g, 23, 10, 20, 18, true)
  stack(g, 42, 20, 18, 15, false)
  stack(g, 10, 36, 22, 16, true)
  stack(g, 33, 38, 21, 14, false)
  const coins = [
    [8, 58], [17, 60], [27, 59], [37, 61], [47, 59], [56, 60],
    [12, 55], [22, 56], [42, 56], [52, 55], [32, 55],
  ]
  for (const [x, y] of coins) coinSide(g, x, y)
  coinFace(g, 57, 12, 5.4)
  coinFace(g, 8, 12, 4.2)
  sparkle(g, 33, 2, 'W', 2)
  sparkle(g, 3, 32, 'w')
  sparkle(g, 61, 34, 'w')
  return outline(g)
}

function iceCream() {
  const g = makeGrid(64)
  // waffle cone
  for (let j = 38; j <= 60; j++) {
    const half = Math.round(((60 - j) / 22) * 12)
    hline(g, 32 - half, 32 + half, j, 'o')
  }
  // waffle crosshatch clipped to the cone body
  const hatch = makeGrid(64)
  for (let d = -6; d < 10; d++) {
    line(hatch, 20 + d * 4, 38, 30 + d * 4, 60, 'C')
    line(hatch, 44 - d * 4, 38, 34 - d * 4, 60, '0')
  }
  for (let j = 38; j <= 60; j++) {
    for (let i = 14; i <= 50; i++) {
      if (g[j][i] === 'o' && hatch[j][i] !== '.') g[j][i] = hatch[j][i]
    }
  }
  for (let j = 38; j <= 60; j++) {
    const half = Math.round(((60 - j) / 22) * 12)
    px(g, 32 + half, j, '0')
    px(g, 32 - half, j, 'y')
  }
  hline(g, 19, 45, 37, 'y')
  hline(g, 19, 45, 38, 'Y')
  // scoops bottom→top: violet, teal, pink — shadow ramp + dither + highlight
  const scoops = [
    { cy: 31, rx: 16, ry: 8, base: 'v', dark: 'V', darkest: '8', light: 'q' },
    { cy: 21, rx: 13, ry: 7, base: 't', dark: 'T', darkest: '2', light: 'u' },
    { cy: 12, rx: 10, ry: 6, base: 'p', dark: 'P', darkest: '1', light: 'q' },
  ]
  for (const s of scoops) {
    ellipse(g, 32, s.cy, s.rx, s.ry, s.base)
    for (let j = 0; j <= s.ry; j++) {
      const half = Math.round(s.rx * Math.sqrt(1 - (j / s.ry) ** 2))
      if (j > s.ry * 0.45) hline(g, 32 - half, 32 + half, s.cy + j, s.dark)
      if (j > s.ry * 0.8) hline(g, 32 - half, 32 + half, s.cy + j, s.darkest)
    }
    dither(g, 32 - s.rx + 3, s.cy + Math.round(s.ry * 0.25), s.rx * 2 - 6, 2, s.base, s.dark)
    ellipse(g, 32 - s.rx * 0.45, s.cy - s.ry * 0.4, s.rx * 0.3, s.ry * 0.3, s.light)
    px(g, 32 - Math.round(s.rx * 0.45), s.cy - Math.round(s.ry * 0.55), 'W')
  }
  // swirl tip + star
  ellipse(g, 32, 5, 4, 2.6, 'q')
  px(g, 31, 3, 'W')
  sparkle(g, 32, 1, 'y', 1)
  // drips
  for (const [dx, len] of [[-9, 4], [7, 5], [-3, 3]]) {
    vline(g, 32 + dx, 37, 37 + len, 'v')
    px(g, 32 + dx, 38 + len, 'V')
  }
  vline(g, 24, 26, 29, 't')
  vline(g, 41, 25, 27, 't')
  vline(g, 27, 16, 19, 'p')
  // cosmic sprinkles
  const sprinkles = [
    [26, 30, 'y'], [38, 33, 'W'], [30, 22, 'p'], [37, 19, 'y'],
    [27, 12, 'b'], [36, 10, 'W'], [24, 24, 'g'],
  ]
  for (const [x, y, c] of sprinkles) px(g, x, y, c)
  sparkle(g, 55, 12, 'W', 2)
  sparkle(g, 8, 18, 'w')
  sparkle(g, 54, 44, 'b')
  px(g, 10, 42, 'p')
  return outline(g)
}

function spaceToy() {
  const g = makeGrid(64)
  // swept pink fins behind the body
  for (let t = 0; t < 16; t++) {
    hline(g, 24 - t, 25 - Math.round(t * 0.3), 32 + t, 'p')
    hline(g, 39 + Math.round(t * 0.3), 40 + t, 32 + t, 'p')
  }
  fillRect(g, 12, 44, 6, 6, 'p')
  fillRect(g, 46, 44, 6, 6, 'p')
  vline(g, 13, 45, 49, '1')
  vline(g, 50, 45, 49, 'P')
  // white body capsule with side shading
  ellipse(g, 32, 26, 8.5, 18, 'w')
  for (let j = 10; j <= 42; j++) {
    const t = (j - 26) / 18
    const half = Math.round(8.5 * Math.sqrt(Math.max(0, 1 - t * t)))
    px(g, 32 + half - 1, j, '5')
    px(g, 32 + half - 2, j, '5')
    px(g, 32 - half + 1, j, '4')
  }
  // red nose cone
  for (let j = 0; j < 8; j++) {
    const half = Math.round((j / 7) * 6)
    hline(g, 32 - half, 32 + half, 4 + j, 'r')
  }
  px(g, 30, 5, 'W')
  vline(g, 37, 8, 11, '9')
  // porthole
  disc(g, 32, 24, 5.6, 'B')
  disc(g, 32, 24, 4, 'b')
  px(g, 30, 22, 'u')
  px(g, 31, 22, 'W')
  hline(g, 30, 34, 26, '7')
  // engine skirt
  fillRect(g, 26, 42, 12, 4, 'P')
  hline(g, 27, 36, 42, 'p')
  // flame: gold core, orange body, dark tips
  fillRect(g, 30, 46, 4, 6, 'y')
  fillRect(g, 28, 47, 8, 4, 'o')
  px(g, 27, 49, '0')
  px(g, 36, 50, '0')
  px(g, 31, 53, 'o')
  px(g, 32, 55, 'y')
  px(g, 30, 56, '0')
  sparkle(g, 52, 10, 'W', 2)
  sparkle(g, 10, 16, 'w')
  px(g, 54, 28, 't')
  px(g, 12, 56, 'b')
  return outline(g)
}

export default {
  'coins-few': { dir: DIR, rows: toRows(coinsFew()), scale: SCALE },
  'coin-pile': { dir: DIR, rows: toRows(coinPile()), scale: SCALE },
  'cash-bills': { dir: DIR, rows: toRows(cashBills()), scale: SCALE },
  'cash-small': { dir: DIR, rows: toRows(cashSmall()), scale: SCALE },
  'cash-large': { dir: DIR, rows: toRows(cashLarge()), scale: SCALE },
  'cash-huge': { dir: DIR, rows: toRows(cashHuge()), scale: SCALE },
  'ice-cream': { dir: DIR, rows: toRows(iceCream()), scale: SCALE },
  'space-toy': { dir: DIR, rows: toRows(spaceToy()), scale: SCALE },
}
