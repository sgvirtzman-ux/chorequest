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

const DIR = 'icons/chores'
const SCALE = 2 // 64x64 grid -> 128x128 png

function trashCans() {
  const g = makeGrid(64)
  // alley lighting: single source upper-left, deep shadows on the right
  // big can
  fillRect(g, 8, 24, 21, 32, 's')
  for (let x = 11; x <= 22; x += 4) vline(g, x, 26, 54, 'S')
  fillRect(g, 22, 25, 4, 31, 'S') // wide right shadow
  vline(g, 26, 25, 55, 'N')
  vline(g, 27, 25, 55, 'N')
  vline(g, 28, 25, 55, 'm') // deepest edge, away from the light
  dither(g, 20, 27, 3, 27, 's', 'S')
  dither(g, 25, 27, 2, 27, 'S', 'N')
  vline(g, 9, 25, 55, 'w') // lit rim
  vline(g, 10, 26, 44, '4')
  // lid, shadowed on the right
  fillRect(g, 6, 18, 25, 5, 'S')
  hline(g, 7, 29, 18, 's')
  hline(g, 7, 24, 19, 'w')
  fillRect(g, 25, 19, 6, 4, 'N')
  fillRect(g, 14, 14, 9, 4, 'S')
  hline(g, 15, 20, 14, 'w')
  px(g, 22, 15, 'N')
  // trash poking out from under the lid
  px(g, 12, 23, 'y')
  px(g, 13, 23, 'Y')
  px(g, 19, 23, 'w')
  px(g, 20, 23, 'n')
  // small can
  fillRect(g, 36, 30, 20, 26, 's')
  for (let x = 39; x <= 47; x += 4) vline(g, x, 32, 54, 'S')
  fillRect(g, 49, 31, 4, 25, 'S')
  vline(g, 53, 31, 55, 'N')
  vline(g, 54, 31, 55, 'N')
  vline(g, 55, 31, 55, 'm')
  dither(g, 47, 33, 3, 21, 's', 'S')
  dither(g, 52, 33, 2, 21, 'S', 'N')
  vline(g, 37, 31, 55, 'w')
  // tilted lid
  for (let j = 0; j < 5; j++) hline(g, 34 + j, 56 - j, 28 - j, 'S')
  hline(g, 38, 55, 24, 'w')
  hline(g, 37, 56, 25, 'S')
  fillRect(g, 51, 26, 5, 2, 'N')
  // cast shadows pooling on the ground
  hline(g, 10, 33, 57, 'm')
  hline(g, 13, 30, 58, 'K')
  hline(g, 38, 59, 57, 'm')
  hline(g, 41, 57, 58, 'K')
  // grime: drips, stains, gunk puddle between the cans
  vline(g, 13, 27, 34, 'G')
  vline(g, 18, 40, 46, 'G')
  px(g, 19, 47, '6')
  vline(g, 47, 33, 40, 'G')
  vline(g, 43, 46, 51, '6')
  px(g, 12, 50, '6')
  px(g, 40, 44, 'G')
  fillRect(g, 30, 55, 5, 2, '6')
  px(g, 32, 54, 'g')
  px(g, 35, 56, 'G')
  // thicker stink rising everywhere
  for (const [sx, sy, h] of [[13, 2, 11], [23, 6, 9], [43, 9, 11], [52, 13, 8], [33, 1, 9]]) {
    for (let t = 0; t < h; t++) {
      const x = sx + Math.round(Math.sin(t / 1.5) * 2)
      px(g, x, sy + t, t % 3 === 0 ? 'G' : 'g')
    }
  }
  outline(g)
  // flies drawn after outlining so their delicate wings/buzz dots stay crisp
  for (const [fx, fy] of [[6, 9], [30, 13], [58, 21], [48, 3]]) {
    px(g, fx, fy, 'k')
    px(g, fx + 1, fy, 'x')
    px(g, fx - 1, fy - 1, 'X')
    px(g, fx + 2, fy - 1, 'X')
    px(g, fx - 3, fy + 1, 'n')
    px(g, fx - 2, fy + 3, 'n')
    px(g, fx + 3, fy + 2, 'n')
  }
  return g
}

function messyBedroom() {
  const g = makeGrid(64)
  // headboard with knob
  fillRect(g, 4, 14, 7, 34, 'c')
  vline(g, 5, 15, 46, 'C')
  disc(g, 7, 12, 2.4, 'c')
  px(g, 6, 11, 'e')
  // mattress + valance
  fillRect(g, 11, 32, 46, 10, 'w')
  hline(g, 12, 56, 40, '5')
  hline(g, 12, 56, 41, '5')
  // pillow with crease
  ellipse(g, 18, 28, 7, 4.5, 'w')
  line(g, 14, 27, 21, 29, '5')
  px(g, 12, 25, '4')
  // rumpled pink blanket: jagged edge, fold shadows, highlight
  fillRect(g, 26, 26, 31, 12, 'p')
  for (const [bx, by] of [[26, 24], [31, 25], [37, 23], [44, 25], [51, 24]]) {
    fillRect(g, bx, by, 3, 3, 'p')
  }
  line(g, 29, 29, 38, 33, 'P')
  line(g, 42, 28, 52, 32, 'P')
  line(g, 33, 35, 44, 36, '1')
  hline(g, 27, 54, 26, 'q')
  dither(g, 28, 31, 6, 2, 'p', 'P')
  // legs
  fillRect(g, 12, 42, 4, 10, 'c')
  fillRect(g, 50, 42, 4, 10, 'c')
  vline(g, 13, 43, 51, 'C')
  vline(g, 51, 43, 51, 'C')
  // floor mess: sock, toy block, ball, book
  fillRect(g, 18, 56, 6, 4, 'r')
  fillRect(g, 22, 54, 3, 3, 'r')
  px(g, 23, 55, '9')
  fillRect(g, 30, 54, 6, 6, 't')
  hline(g, 31, 34, 55, 'u')
  vline(g, 34, 56, 59, 'T')
  px(g, 32, 57, '2')
  disc(g, 44, 57, 3, 'y')
  px(g, 42, 55, 'W')
  px(g, 45, 58, '3')
  fillRect(g, 52, 56, 8, 4, 'b')
  hline(g, 53, 58, 56, 'w')
  vline(g, 59, 56, 59, '7')
  return outline(g)
}

function bathroom() {
  const g = makeGrid(64)
  // tank with lid + flusher
  fillRect(g, 8, 10, 18, 16, 'w')
  hline(g, 8, 25, 13, '5')
  hline(g, 9, 24, 11, '4')
  vline(g, 24, 11, 25, '5')
  fillRect(g, 20, 15, 4, 3, 'S')
  px(g, 21, 15, 'w')
  // bowl + seat + water
  ellipse(g, 19, 34, 13, 9, 'w')
  for (let j = 4; j <= 9; j++) {
    const half = Math.round(13 * Math.sqrt(1 - (j / 9) ** 2))
    hline(g, 19 - half, 19 + half, 34 + j, '5')
  }
  ellipse(g, 19, 32, 9, 4.5, '5')
  ellipse(g, 19, 32, 7, 3.4, 'u')
  ellipse(g, 20, 33, 4, 1.8, 'b')
  // base
  fillRect(g, 14, 44, 11, 10, 'w')
  vline(g, 23, 45, 53, '5')
  hline(g, 12, 27, 54, '5')
  hline(g, 12, 27, 55, 'S')
  sparkle(g, 28, 20, 'W', 2)
  // scrub brush
  vline(g, 46, 12, 30, 'c')
  vline(g, 47, 12, 30, 'C')
  disc(g, 46, 10, 1.6, 'y')
  fillRect(g, 41, 30, 12, 8, 'p')
  for (let x = 42; x <= 51; x += 2) vline(g, x, 36, 40, 'q')
  hline(g, 42, 51, 30, 'q')
  vline(g, 52, 31, 37, 'P')
  // bubbles with glints
  for (const [bx, by, r] of [[52, 8, 3], [58, 16, 2.2], [42, 4, 2], [56, 46, 2.6], [48, 52, 1.8]]) {
    disc(g, bx, by, r, 'b')
    disc(g, bx, by, r - 1.2, 'u')
    px(g, bx - 1, by - 1, 'W')
  }
  px(g, 61, 26, 'u')
  px(g, 36, 46, 'u')
  return outline(g)
}

function vacuum() {
  const g = makeGrid(64)
  // handle with grip
  line(g, 46, 4, 38, 22, 'X')
  line(g, 47, 4, 39, 22, 'x')
  line(g, 48, 5, 40, 22, 'X')
  hline(g, 44, 50, 3, 'x')
  hline(g, 44, 50, 4, 'X')
  // dust bag with seams
  ellipse(g, 18, 32, 8, 12, 'v')
  for (let j = 22; j <= 42; j++) {
    const t = (j - 32) / 12
    const half = Math.round(8 * Math.sqrt(Math.max(0, 1 - t * t)))
    px(g, 18 + half - 1, j, 'V')
    if (j > 36) hline(g, 18 - half + 1, 18 + half - 1, j, '8')
  }
  line(g, 15, 24, 14, 38, 'V')
  px(g, 14, 24, 'q')
  // pink body with highlight band + trim
  fillRect(g, 26, 24, 17, 26, 'p')
  fillRect(g, 28, 26, 4, 22, 'q')
  fillRect(g, 40, 26, 3, 24, 'P')
  vline(g, 42, 26, 49, '1')
  fillRect(g, 26, 34, 17, 3, 'P')
  hline(g, 27, 41, 34, '1')
  sparkle(g, 34, 30, 'W', 1)
  // teal base with wheels
  fillRect(g, 12, 50, 41, 8, 't')
  fillRect(g, 12, 55, 41, 3, 'T')
  hline(g, 13, 52, 58, '2')
  hline(g, 13, 51, 50, 'u')
  disc(g, 18, 57, 2.6, 'k')
  disc(g, 46, 57, 2.6, 'k')
  px(g, 17, 56, 'X')
  px(g, 45, 56, 'X')
  // dust motes being pulled in
  px(g, 6, 48, 'n')
  px(g, 4, 52, 's')
  px(g, 8, 44, 'n')
  sparkle(g, 57, 40, 's')
  sparkle(g, 8, 12, 'w')
  return outline(g)
}

function dirtyCar() {
  const g = makeGrid(64)
  // cabin with two window panes
  fillRect(g, 18, 18, 29, 15, 't')
  fillRect(g, 21, 21, 10, 9, 'b')
  fillRect(g, 34, 21, 10, 9, 'b')
  px(g, 22, 22, 'u')
  px(g, 23, 22, 'W')
  px(g, 35, 22, 'u')
  hline(g, 21, 43, 29, '7')
  // body
  fillRect(g, 6, 32, 52, 14, 't')
  hline(g, 7, 56, 33, 'u')
  hline(g, 7, 56, 34, 'u')
  fillRect(g, 6, 42, 52, 4, 'T')
  hline(g, 7, 56, 45, '2')
  // lights
  fillRect(g, 56, 34, 3, 3, 'y')
  px(g, 56, 34, '4')
  fillRect(g, 5, 34, 2, 3, 'r')
  // wheels with hubs
  for (const wx of [18, 46]) {
    disc(g, wx, 47, 6.5, 'x')
    disc(g, wx, 47, 4.4, 'X')
    disc(g, wx, 47, 2.2, 'S')
    px(g, wx - 1, 46, 'w')
  }
  // mud: blobby clusters + door streaks
  for (const [mx, my] of [[10, 38], [14, 40], [26, 39], [30, 41], [38, 38], [50, 40], [44, 42], [22, 43]]) {
    px(g, mx, my, 'c')
    px(g, mx + 1, my, 'C')
    px(g, mx, my + 1, 'C')
  }
  line(g, 33, 36, 35, 43, 'c')
  line(g, 12, 35, 13, 41, 'C')
  px(g, 28, 26, 'c') // splash on the window
  px(g, 29, 27, 'C')
  // dust cloud behind
  disc(g, 3, 50, 2.2, 'n')
  disc(g, 6, 54, 1.6, 'n')
  px(g, 9, 57, 's')
  return outline(g)
}

function laundry() {
  const g = makeGrid(64)
  // machine body with side shading
  fillRect(g, 10, 8, 44, 50, 'w')
  vline(g, 52, 9, 57, '5')
  vline(g, 51, 9, 57, '5')
  vline(g, 11, 9, 57, '4')
  hline(g, 11, 52, 56, '5')
  // control panel
  fillRect(g, 10, 8, 44, 8, 's')
  hline(g, 11, 52, 8, 'w')
  disc(g, 17, 12, 2.4, 'k')
  px(g, 16, 11, 'X')
  fillRect(g, 26, 11, 3, 3, 'p')
  fillRect(g, 32, 11, 3, 3, 't')
  fillRect(g, 38, 11, 3, 3, 'v')
  px(g, 26, 11, 'q')
  px(g, 32, 11, 'u')
  // porthole door: steel ring, glass, water + suds
  disc(g, 32, 38, 15, 'S')
  disc(g, 32, 38, 13.4, 's')
  disc(g, 32, 38, 12, 'B')
  for (let j = 0; j <= 12; j++) {
    const half = Math.round(12 * Math.sqrt(1 - (j / 12) ** 2))
    hline(g, 32 - half, 32 + half, 38 + j, 'b')
  }
  hline(g, 21, 43, 38, '7')
  // suds bubbles in the upper glass
  for (const [bx, by, r] of [[27, 32, 2.6], [34, 30, 2], [39, 34, 2.2], [24, 36, 1.6], [31, 35, 1.4]]) {
    disc(g, bx, by, r, 'u')
    px(g, bx - 1, by - 1, 'W')
  }
  px(g, 37, 42, 'u')
  px(g, 26, 44, 'W')
  // glass glint arc
  line(g, 24, 28, 28, 25, 'W')
  // feet
  fillRect(g, 13, 58, 5, 2, 'x')
  fillRect(g, 46, 58, 5, 2, 'x')
  sparkle(g, 6, 6, 'w')
  sparkle(g, 58, 50, 's')
  return outline(g)
}

export default {
  'trash-cans': { dir: DIR, rows: toRows(trashCans()), scale: SCALE },
  'messy-bedroom': { dir: DIR, rows: toRows(messyBedroom()), scale: SCALE },
  bathroom: { dir: DIR, rows: toRows(bathroom()), scale: SCALE },
  vacuum: { dir: DIR, rows: toRows(vacuum()), scale: SCALE },
  'dirty-car': { dir: DIR, rows: toRows(dirtyCar()), scale: SCALE },
  laundry: { dir: DIR, rows: toRows(laundry()), scale: SCALE },
}
