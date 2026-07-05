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
import { RAINBOW } from '../palette.mjs'

const DIR = 'avatars'
const SCALE = 2 // 64x64 grid -> 128x128 png

function unicorn() {
  const g = makeGrid(64)
  // neck + chest sweeping down-right
  for (let j = 30; j <= 60; j++) {
    const left = 22 + Math.round((j - 30) * 0.35)
    hline(g, left, Math.min(50, left + 22), j, 'w')
  }
  // head + muzzle — kept clean white, no facial shading
  ellipse(g, 27, 21, 12, 10, 'w')
  ellipse(g, 13, 27, 7, 5, 'w')
  // soft shadow only low on the neck, well away from the face
  dither(g, 25, 50, 5, 9, 'w', '5')
  // nostril, mouth, blush
  px(g, 8, 27, 'q')
  px(g, 8, 28, 'P')
  hline(g, 7, 10, 30, 'S')
  fillRect(g, 13, 30, 3, 2, 'q')
  // gentle eye with glint + single lash
  fillRect(g, 22, 19, 3, 3, 'k')
  px(g, 23, 19, 'W')
  px(g, 25, 18, 'k')
  // ears
  for (let j = 0; j < 6; j++) {
    hline(g, 36, 36 + Math.min(3, j), 5 + j, 'w')
  }
  px(g, 37, 7, 'q')
  px(g, 37, 8, 'q')
  // golden spiral horn
  line(g, 30, 9, 17, 1, 'y')
  line(g, 31, 10, 18, 2, 'y')
  line(g, 32, 11, 19, 3, 'Y')
  px(g, 17, 1, 'W')
  for (let s = 0; s < 4; s++) {
    px(g, 20 + s * 3, 3 + s * 2, '3')
    px(g, 21 + s * 3, 4 + s * 2, '3')
  }
  // flowing rainbow mane: smooth solid 2px bands hugging the neck
  RAINBOW.forEach((c, i) => {
    for (let t = 0; t <= 46; t++) {
      const y = 8 + t
      if (y > 62) break
      const wave = Math.sin(t / 11 + i * 0.45) * 2.2
      const x = 37 + i * 2.2 + wave + t * 0.26
      px(g, x, y, c)
      px(g, x + 1, y, c)
    }
  })
  // fuller forelock over the brow
  for (let i = 0; i < 3; i++) {
    const c = RAINBOW[i]
    for (let t = 0; t < 11 - i * 2; t++) {
      px(g, 34 - t, 7 + i * 2 + Math.round(t * 0.55), c)
      px(g, 34 - t, 8 + i * 2 + Math.round(t * 0.55), c)
    }
  }
  sparkle(g, 6, 8, 'W', 2)
  sparkle(g, 58, 4, 'w')
  sparkle(g, 5, 48, 'w')
  return outline(g)
}

function spaceElf() {
  const g = makeGrid(64)
  // long pointy ears
  for (let t = 0; t < 10; t++) {
    hline(g, 14 + t, 20 + Math.round(t * 0.4), 21 + Math.round(t * 0.8), 'e')
    hline(g, 44 - Math.round(t * 0.4), 50 - t, 21 + Math.round(t * 0.8), 'e')
  }
  px(g, 15, 22, 'E')
  px(g, 49, 22, 'E')
  // face
  ellipse(g, 32, 27, 11, 10, 'e')
  ellipse(g, 32, 32, 8, 4, 'e')
  // chin shade
  hline(g, 28, 36, 36, 'E')
  // pink hair: cap + framing strands
  ellipse(g, 32, 16, 13, 8, 'p')
  fillRect(g, 20, 16, 4, 14, 'p')
  fillRect(g, 40, 16, 4, 14, 'p')
  px(g, 21, 30, 'P')
  px(g, 42, 30, 'P')
  hline(g, 24, 40, 22, 'P') // fringe edge
  px(g, 27, 23, 'P')
  px(g, 33, 23, 'P')
  px(g, 38, 23, 'P')
  dither(g, 24, 11, 12, 3, 'q', 'p') // shine
  // gold circlet with teal gem
  hline(g, 22, 42, 20, 'y')
  px(g, 22, 20, '3')
  px(g, 42, 20, '3')
  fillRect(g, 31, 18, 3, 3, 't')
  px(g, 31, 18, 'u')
  // big sparkly eyes
  for (const ex of [25, 36]) {
    fillRect(g, ex, 26, 3, 4, 't')
    fillRect(g, ex + 1, 27, 1, 2, 'k')
    px(g, ex, 26, 'W')
  }
  // smile + blush
  hline(g, 30, 34, 33, 'E')
  px(g, 29, 32, 'E')
  px(g, 35, 32, 'E')
  fillRect(g, 21, 30, 3, 2, 'q')
  fillRect(g, 40, 30, 3, 2, 'q')
  // violet suit with teal star
  fillRect(g, 20, 40, 24, 20, 'v')
  fillRect(g, 20, 40, 24, 3, 'V') // collar shadow
  fillRect(g, 41, 43, 3, 17, 'V')
  vline(g, 43, 43, 59, '8')
  dither(g, 21, 44, 3, 14, 'v', 'V')
  fillRect(g, 15, 42, 5, 12, 'v') // arms
  fillRect(g, 44, 42, 5, 12, 'v')
  px(g, 15, 53, '8')
  px(g, 48, 53, '8')
  sparkle(g, 32, 49, 't', 2)
  px(g, 32, 49, 'u')
  sparkle(g, 56, 6, 'W')
  sparkle(g, 7, 12, 'w')
  return outline(g)
}

function spaceHero() {
  const g = makeGrid(64)
  // cape flares behind the shoulders
  for (let j = 0; j < 18; j++) {
    hline(g, 12 - Math.round(j * 0.2), 17, 42 + j, 'r')
    hline(g, 47, 52 + Math.round(j * 0.2), 42 + j, 'r')
  }
  vline(g, 16, 44, 59, '9')
  vline(g, 48, 44, 59, '9')
  // big white helmet
  disc(g, 32, 24, 16, 'w')
  // dome shading + glint
  for (let j = 0; j <= 8; j++) {
    const half = Math.round(16 * Math.sqrt(1 - ((j + 8) / 16) ** 2))
    hline(g, 32 - half, 32 + half, 24 + 8 + j, '5')
  }
  dither(g, 22, 32, 20, 3, 'w', '5')
  line(g, 22, 13, 27, 10, 'W')
  line(g, 22, 14, 27, 11, '4')
  // antenna
  vline(g, 32, 3, 7, 'X')
  disc(g, 32, 2.4, 1.6, 'y')
  px(g, 31, 1, 'W')
  // teal visor with diagonal glint
  fillRect(g, 22, 18, 21, 12, 'T')
  fillRect(g, 23, 19, 19, 10, 't')
  fillRect(g, 23, 26, 19, 3, 'T')
  vline(g, 41, 20, 28, '2')
  line(g, 25, 20, 29, 24, 'u')
  line(g, 26, 20, 30, 24, 'W')
  // neck ring
  fillRect(g, 24, 40, 16, 3, 's')
  hline(g, 25, 38, 40, 'w')
  // pink suit with gold star
  fillRect(g, 18, 43, 28, 17, 'p')
  fillRect(g, 18, 43, 28, 2, 'P')
  fillRect(g, 43, 45, 3, 15, 'P')
  vline(g, 45, 45, 59, '1')
  dither(g, 19, 46, 3, 12, 'p', 'q')
  sparkle(g, 32, 51, 'y', 3)
  sparkle(g, 32, 51, '4', 1)
  sparkle(g, 4, 6, 'W')
  sparkle(g, 59, 14, 'w')
  return outline(g)
}

function astroCat() {
  const g = makeGrid(64)
  // glass bubble helmet: purple interior, teal ring, glints
  disc(g, 32, 26, 19, 'm')
  for (let a = 0; a < 160; a++) {
    const t = (a / 160) * Math.PI * 2
    px(g, 32 + Math.cos(t) * 19, 26 + Math.sin(t) * 19, 'u')
    px(g, 32 + Math.cos(t) * 18, 26 + Math.sin(t) * 18, 'u')
  }
  line(g, 20, 13, 25, 9, 'W')
  line(g, 20, 15, 24, 11, 'w')
  // ears inside the bubble
  for (let j = 0; j < 8; j++) {
    hline(g, 21, 21 + Math.min(5, j), 11 + j, 's')
    hline(g, 43 - Math.min(5, j), 43, 11 + j, 's')
  }
  fillRect(g, 22, 14, 2, 3, 'q')
  fillRect(g, 40, 14, 2, 3, 'q')
  // head + tabby stripes
  ellipse(g, 32, 28, 12, 10.5, 's')
  vline(g, 30, 18, 21, 'S')
  vline(g, 33, 17, 20, 'S')
  vline(g, 36, 18, 21, 'S')
  // cheeks shading
  px(g, 21, 31, 'S')
  px(g, 43, 31, 'S')
  // muzzle
  ellipse(g, 32, 33, 7, 5, 'w')
  // eyes: green with slit pupils + glints
  for (const ex of [25, 36]) {
    fillRect(g, ex, 25, 3, 4, 'g')
    vline(g, ex + 1, 26, 28, 'k')
    px(g, ex, 25, 'W')
  }
  // nose + mouth + whiskers
  fillRect(g, 31, 32, 2, 2, 'p')
  px(g, 31, 32, 'q')
  vline(g, 32, 34, 35, 'S')
  hline(g, 17, 22, 32, 'w')
  hline(g, 18, 23, 35, 'w')
  hline(g, 42, 47, 32, 'w')
  hline(g, 41, 46, 35, 'w')
  // orange suit with gold badge
  fillRect(g, 20, 47, 24, 13, 'o')
  fillRect(g, 20, 47, 24, 3, 'O')
  fillRect(g, 41, 50, 3, 10, 'O')
  vline(g, 43, 50, 59, '0')
  dither(g, 21, 51, 3, 8, 'o', 'y')
  sparkle(g, 32, 54, 'y', 2)
  px(g, 32, 54, '4')
  sparkle(g, 57, 8, 'W')
  sparkle(g, 6, 42, 'w')
  return outline(g)
}

function rainbowRobot() {
  const g = makeGrid(64)
  // antenna
  vline(g, 32, 3, 7, 'X')
  disc(g, 32, 2.6, 1.8, 'y')
  px(g, 31, 2, 'W')
  // head with brow highlight + side shading
  fillRect(g, 18, 8, 28, 22, 's')
  fillRect(g, 19, 9, 26, 3, 'w')
  hline(g, 20, 43, 9, '4')
  fillRect(g, 43, 10, 3, 20, 'S')
  vline(g, 45, 10, 29, 'N')
  // glowing teal eyes
  for (const ex of [23, 36]) {
    fillRect(g, ex, 15, 5, 6, 'T')
    fillRect(g, ex + 1, 16, 3, 4, 't')
    px(g, ex + 1, 16, 'u')
    px(g, ex + 2, 17, 'W')
  }
  // mouth grill
  for (let i = 0; i < 7; i++) {
    vline(g, 26 + i * 2, 24, 27, i % 2 === 0 ? 'X' : 'S')
  }
  // ear bolts
  fillRect(g, 14, 15, 4, 6, 'X')
  fillRect(g, 46, 15, 4, 6, 'X')
  px(g, 15, 16, 'w')
  px(g, 47, 16, 'w')
  // body with rainbow chest bands (each with a darker under-edge)
  fillRect(g, 20, 32, 24, 22, 'S')
  fillRect(g, 21, 33, 22, 20, 's')
  const darks = ['9', '0', '3', '6', '7', '8']
  RAINBOW.forEach((c, i) => {
    fillRect(g, 23, 36 + i * 3, 18, 2, c)
    hline(g, 23, 40, 37 + i * 3, darks[i])
  })
  // arms with claw discs
  fillRect(g, 14, 34, 4, 14, 'X')
  fillRect(g, 46, 34, 4, 14, 'X')
  vline(g, 14, 34, 47, 'S')
  disc(g, 16, 50, 2.6, 's')
  disc(g, 48, 50, 2.6, 's')
  px(g, 15, 49, 'w')
  px(g, 47, 49, 'w')
  // tread base
  fillRect(g, 22, 54, 20, 5, 'x')
  for (let i = 0; i < 5; i++) px(g, 24 + i * 4, 56, 'X')
  sparkle(g, 56, 6, 'W')
  sparkle(g, 8, 26, 'w')
  return outline(g)
}

function starMage() {
  const g = makeGrid(64)
  // tall wizard hat centered over the face, tip flopping right
  for (let j = 0; j <= 20; j++) {
    const spread = Math.round(j * 0.8)
    const bend = j < 6 ? 5 - j : 0
    hline(g, 32 - spread + bend, 32 + spread + bend, 3 + j, 'v')
  }
  for (let j = 8; j <= 20; j++) {
    const spread = Math.round(j * 0.8)
    px(g, 32 + spread, 3 + j, 'V')
    px(g, 31 + spread, 3 + j, 'V')
  }
  px(g, 37, 2, 'y') // star on the floppy tip
  sparkle(g, 37, 1, 'y', 1)
  // brim
  ellipse(g, 32, 25, 17, 4, 'V')
  hline(g, 17, 47, 27, '8')
  // stars on the hat
  px(g, 30, 10, 'y')
  px(g, 38, 16, 'y')
  px(g, 27, 18, 'W')
  px(g, 42, 21, '4')
  // face
  ellipse(g, 32, 34, 10, 8.5, 'e')
  hline(g, 28, 36, 41, 'E')
  // eyes + blush + smile
  for (const ex of [27, 36]) {
    fillRect(g, ex, 32, 2, 3, 'k')
    px(g, ex, 32, 'W')
  }
  fillRect(g, 23, 36, 3, 2, 'q')
  fillRect(g, 38, 36, 3, 2, 'q')
  hline(g, 30, 34, 38, 'E')
  // blue robe with star clasp
  fillRect(g, 18, 44, 28, 16, 'B')
  fillRect(g, 18, 44, 28, 2, '7')
  fillRect(g, 43, 46, 3, 14, '7')
  dither(g, 19, 47, 3, 11, 'B', 'b')
  sparkle(g, 32, 51, 'y', 2)
  px(g, 32, 51, '4')
  // staff with glowing teal orb
  vline(g, 54, 20, 58, 'c')
  vline(g, 55, 20, 58, 'C')
  disc(g, 54.5, 15, 4, 'T')
  disc(g, 54.5, 15, 2.8, 't')
  px(g, 53, 13, 'u')
  px(g, 54, 13, 'W')
  sparkle(g, 54, 8, 'u', 1)
  sparkle(g, 8, 10, 'W')
  sparkle(g, 10, 52, 'w')
  return outline(g)
}

export default {
  unicorn: { dir: DIR, rows: toRows(unicorn()), scale: SCALE },
  'space-elf': { dir: DIR, rows: toRows(spaceElf()), scale: SCALE },
  'space-hero': { dir: DIR, rows: toRows(spaceHero()), scale: SCALE },
  'astro-cat': { dir: DIR, rows: toRows(astroCat()), scale: SCALE },
  'rainbow-robot': { dir: DIR, rows: toRows(rainbowRobot()), scale: SCALE },
  'star-mage': { dir: DIR, rows: toRows(starMage()), scale: SCALE },
}
