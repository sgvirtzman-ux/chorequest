import {
  disc,
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

/** face-on coin with rim, star stamp and glint */
function coin(g, cx, cy, r) {
  disc(g, cx, cy, r, 'y')
  for (let a = 0; a < 24; a++) {
    const t = (a / 24) * Math.PI * 2
    px(g, cx + Math.cos(t) * r, cy + Math.sin(t) * r, 'Y')
  }
  px(g, cx, cy - 1, 'Y')
  px(g, cx - 1, cy, 'Y')
  px(g, cx + 1, cy, 'Y')
  px(g, cx, cy + 1, 'Y')
  px(g, cx - Math.round(r / 2), cy - Math.round(r / 2), 'W')
}

/** side-view coin (for piles) */
function coinSide(g, cx, cy) {
  ellipse(g, cx, cy, 3.4, 1.6, 'y')
  hline(g, cx - 3, cx + 3, cy + 1, 'Y')
  px(g, cx - 2, cy - 1, 'W')
}

function coinsFew() {
  const g = makeGrid(32)
  coin(g, 16, 12, 6)
  coin(g, 9, 22, 5.4)
  coin(g, 22, 22, 5.4)
  sparkle(g, 27, 6, 'W')
  sparkle(g, 4, 10, 'w')
  return outline(g)
}

function coinPile() {
  const g = makeGrid(32)
  // mound rows bottom-up: [y, coin center xs] — spaced so coins stay distinct
  const rows = [
    [27, [5, 12, 19, 26]],
    [23, [8, 15, 22]],
    [19, [11, 19]],
  ]
  for (const [y, xs] of rows) {
    for (const x of xs) coinSide(g, x, y)
  }
  coin(g, 15, 10, 5.4) // crowning face-on coin
  sparkle(g, 27, 8, 'W')
  sparkle(g, 4, 12, 'w')
  return outline(g)
}

/** one bill: green rectangle, dark border, pale center seal */
function bill(g, x, y, w = 15, h = 8) {
  fillRect(g, x, y, w, h, 'g')
  for (let i = x; i < x + w; i++) {
    px(g, i, y, 'G')
    px(g, i, y + h - 1, 'G')
  }
  vline(g, x, y, y + h - 1, 'G')
  vline(g, x + w - 1, y, y + h - 1, 'G')
  ellipse(g, x + Math.floor(w / 2), y + Math.floor(h / 2), 2.2, 1.6, 'G')
  px(g, x + Math.floor(w / 2), y + Math.floor(h / 2), 'w')
}

function cashBills() {
  const g = makeGrid(32)
  bill(g, 3, 7)
  bill(g, 9, 12)
  bill(g, 14, 17)
  sparkle(g, 26, 6, 'W')
  return outline(g)
}

/** banded stack of bills seen from the side */
function stack(g, x, y, w, h) {
  fillRect(g, x, y, w, h, 'g')
  for (let j = y + 2; j < y + h; j += 2) hline(g, x, x + w - 1, j, 'G')
  fillRect(g, x, y, w, 2, 'g')
  hline(g, x, x + w - 1, y, 'w') // top bill edge highlight
  const bx = x + Math.floor(w / 2) - 2
  fillRect(g, bx, y, 4, h, 'y') // currency band
  vline(g, bx, y, y + h - 1, 'Y')
  vline(g, bx + 3, y, y + h - 1, 'Y')
}

function cashSmall() {
  const g = makeGrid(32)
  stack(g, 6, 14, 20, 11)
  sparkle(g, 27, 9, 'W')
  sparkle(g, 4, 8, 'w')
  return outline(g)
}

function cashLarge() {
  const g = makeGrid(32)
  stack(g, 3, 12, 14, 15)
  stack(g, 16, 17, 13, 10)
  coin(g, 23, 9, 4.6)
  sparkle(g, 5, 6, 'W')
  return outline(g)
}

/** plain stack without the gold band (for busy piles) */
function plainStack(g, x, y, w, h) {
  fillRect(g, x, y, w, h, 'g')
  for (let j = y + 2; j < y + h; j += 2) hline(g, x, x + w - 1, j, 'G')
  hline(g, x, x + w - 1, y, 'w')
  vline(g, x, y, y + h - 1, 'G')
  vline(g, x + w - 1, y, y + h - 1, 'G')
}

function cashHuge() {
  const g = makeGrid(32)
  // mountain of money: mostly green, a single banded stack up top
  plainStack(g, 3, 13, 12, 8)
  stack(g, 10, 5, 12, 8)
  plainStack(g, 18, 12, 12, 9)
  plainStack(g, 5, 21, 13, 8)
  plainStack(g, 17, 21, 12, 8)
  // scattered coins tumbling down the front
  coinSide(g, 4, 28)
  coinSide(g, 27, 28)
  coin(g, 27, 6, 3.4)
  coin(g, 4, 8, 3)
  sparkle(g, 16, 2, 'W')
  return outline(g)
}

function iceCream() {
  const g = makeGrid(32)
  // waffle cone
  line(g, 10, 18, 15, 29, 'o')
  line(g, 21, 18, 16, 29, 'o')
  for (let j = 18; j <= 29; j++) {
    const half = Math.max(0, Math.round((29 - j) / 2.2))
    hline(g, 16 - half, 15 + half, j, 'o')
  }
  line(g, 11, 20, 14, 27, 'C')
  line(g, 20, 20, 17, 27, 'C')
  line(g, 12, 26, 19, 19, 'C')
  // cosmic swirl scoops: violet, teal, pink
  ellipse(g, 15.5, 15, 6.4, 3, 'v')
  ellipse(g, 15.5, 11, 5.6, 3, 't')
  ellipse(g, 15.5, 7, 4.4, 2.8, 'p')
  ellipse(g, 15.5, 4.6, 2.2, 1.8, 'q') // swirl tip
  // drips + glints
  px(g, 11, 17, 'v')
  px(g, 20, 17, 'v')
  px(g, 13, 9, 'u')
  px(g, 17, 6, 'W')
  // galactic sprinkle stars
  sparkle(g, 26, 8, 'y')
  sparkle(g, 5, 12, 'W')
  px(g, 25, 20, 'b')
  px(g, 6, 22, 'p')
  return outline(g)
}

function spaceToy() {
  const g = makeGrid(32)
  // rocket body
  ellipse(g, 15.5, 14, 4.4, 9, 'w')
  // nose cone
  fillRect(g, 13, 3, 6, 3, 'r')
  px(g, 15, 2, 'r')
  px(g, 16, 2, 'r')
  ellipse(g, 15.5, 7, 3.6, 2, 'r')
  // porthole
  disc(g, 15.5, 13, 2.6, 'B')
  disc(g, 15.5, 13, 1.6, 'b')
  px(g, 14, 12, 'u')
  // fins
  line(g, 11, 17, 8, 24, 'p')
  line(g, 11, 18, 8, 24, 'p')
  fillRect(g, 8, 21, 3, 4, 'p')
  line(g, 20, 17, 23, 24, 'p')
  fillRect(g, 21, 21, 3, 4, 'p')
  fillRect(g, 13, 22, 6, 3, 'P') // engine skirt
  // flame
  px(g, 14, 25, 'y')
  px(g, 16, 25, 'y')
  fillRect(g, 14, 26, 4, 2, 'o')
  px(g, 15, 28, 'y')
  px(g, 16, 29, 'o')
  // stars
  sparkle(g, 26, 6, 'W')
  sparkle(g, 5, 9, 'w')
  px(g, 27, 18, 't')
  return outline(g)
}

export default {
  'coins-few': { dir: DIR, rows: toRows(coinsFew()) },
  'coin-pile': { dir: DIR, rows: toRows(coinPile()) },
  'cash-bills': { dir: DIR, rows: toRows(cashBills()) },
  'cash-small': { dir: DIR, rows: toRows(cashSmall()) },
  'cash-large': { dir: DIR, rows: toRows(cashLarge()) },
  'cash-huge': { dir: DIR, rows: toRows(cashHuge()) },
  'ice-cream': { dir: DIR, rows: toRows(iceCream()) },
  'space-toy': { dir: DIR, rows: toRows(spaceToy()) },
}
