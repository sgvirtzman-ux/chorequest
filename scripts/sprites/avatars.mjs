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
import { RAINBOW } from '../palette.mjs'

const DIR = 'avatars'

function unicorn() {
  const g = makeGrid(32)
  // neck/chest
  fillRect(g, 12, 18, 9, 10, 'w')
  // head, snout pointing left
  ellipse(g, 12, 13, 6, 5, 'w')
  ellipse(g, 6, 15, 3, 2.4, 'w')
  px(g, 4, 15, 'q') // nostril
  // ear
  line(g, 16, 7, 16, 5, 'w')
  px(g, 17, 6, 'w')
  px(g, 17, 7, 'w')
  // golden horn
  line(g, 13, 7, 10, 2, 'y')
  line(g, 14, 7, 11, 2, 'Y')
  // eye + blush
  px(g, 10, 12, 'k')
  px(g, 10, 13, 'k')
  px(g, 7, 17, 'q')
  px(g, 8, 17, 'q')
  // flowing rainbow mane down the right side
  RAINBOW.forEach((c, i) => {
    const x = 17 + i
    vline(g, x, 8 + i, 24 + (i % 3), c)
  })
  px(g, 18, 7, 'r')
  px(g, 20, 8, 'y')
  sparkle(g, 26, 5, 'W')
  sparkle(g, 4, 6, 'w')
  return outline(g)
}

function spaceElf() {
  const g = makeGrid(32)
  // pointy ears
  line(g, 7, 14, 4, 10, 'e')
  line(g, 7, 15, 5, 12, 'e')
  line(g, 24, 14, 27, 10, 'e')
  line(g, 24, 15, 26, 12, 'e')
  // head
  ellipse(g, 15.5, 14, 6, 6, 'e')
  // pink hair cap + fringe
  ellipse(g, 15.5, 10, 6.4, 4, 'p')
  px(g, 10, 13, 'p')
  px(g, 13, 12, 'p')
  px(g, 18, 12, 'p')
  px(g, 21, 13, 'p')
  fillRect(g, 12, 5, 8, 2, 'q') // shine
  // gold circlet with gem
  hline(g, 11, 20, 9, 'y')
  px(g, 15, 8, 't')
  px(g, 16, 8, 't')
  // face
  px(g, 12, 15, 'k')
  px(g, 19, 15, 'k')
  px(g, 12, 14, 't') // sparkly teal eye tops
  px(g, 19, 14, 't')
  hline(g, 14, 17, 18, 'E') // smile
  // suit: violet with teal star emblem
  fillRect(g, 10, 21, 12, 8, 'v')
  fillRect(g, 8, 22, 2, 6, 'v') // arms
  fillRect(g, 22, 22, 2, 6, 'v')
  fillRect(g, 10, 21, 12, 2, 'V') // collar shadow
  sparkle(g, 15, 25, 't', 1)
  px(g, 16, 25, 't')
  sparkle(g, 27, 4, 'W')
  return outline(g)
}

function spaceHero() {
  const g = makeGrid(32)
  // cape flare behind shoulders
  fillRect(g, 5, 20, 4, 9, 'r')
  fillRect(g, 23, 20, 4, 9, 'r')
  px(g, 4, 28, 'r')
  px(g, 27, 28, 'r')
  // big round white helmet
  ellipse(g, 15.5, 11.5, 8, 8, 'w')
  px(g, 10, 5, 'W') // dome shine
  px(g, 11, 4, 'W')
  // antenna
  vline(g, 15, 1, 3, 'X')
  px(g, 15, 0, 'y')
  // teal visor window (smaller than the dome so the helmet reads)
  fillRect(g, 11, 9, 10, 6, 'T')
  fillRect(g, 12, 10, 8, 4, 't')
  fillRect(g, 13, 10, 3, 1, 'u')
  // neck ring
  hline(g, 11, 20, 19, 's')
  // pink suit with gold star
  fillRect(g, 9, 20, 14, 9, 'p')
  fillRect(g, 9, 20, 14, 2, 'P')
  fillRect(g, 7, 21, 2, 6, 'p') // arms in front of cape
  fillRect(g, 23, 21, 2, 6, 'p')
  sparkle(g, 15, 24, 'y', 1)
  px(g, 16, 24, 'y')
  sparkle(g, 3, 5, 'W')
  sparkle(g, 28, 15, 'w')
  return outline(g)
}

function astroCat() {
  const g = makeGrid(32)
  // glass bubble helmet: soft purple interior so the cat reads
  disc(g, 15.5, 13, 9.4, 'm')
  for (let a = 0; a < 72; a++) {
    const t = (a / 72) * Math.PI * 2
    px(g, 15.5 + Math.cos(t) * 9.4, 13 + Math.sin(t) * 9.4, 'u')
  }
  px(g, 9, 7, 'W') // glass glint
  px(g, 10, 6, 'W')
  px(g, 8, 9, 'W')
  // cat ears
  for (let j = 0; j < 4; j++) {
    hline(g, 10, 10 + j, 6 + j, 's')
    hline(g, 21 - j, 21, 6 + j, 's')
  }
  px(g, 11, 8, 'q')
  px(g, 20, 8, 'q')
  // cat head + muzzle
  ellipse(g, 15.5, 14, 6, 5.4, 's')
  ellipse(g, 15.5, 16.4, 3.4, 2.6, 'w')
  // eyes, nose, whiskers
  px(g, 12, 13, 'k')
  px(g, 13, 13, 'g')
  px(g, 18, 13, 'g')
  px(g, 19, 13, 'k')
  px(g, 15, 16, 'p')
  px(g, 16, 16, 'p')
  hline(g, 10, 11, 16, 'w')
  hline(g, 20, 21, 16, 'w')
  // orange suit with badge
  fillRect(g, 10, 23, 12, 6, 'o')
  fillRect(g, 10, 23, 12, 2, 'O')
  px(g, 15, 26, 'y')
  px(g, 16, 26, 'y')
  sparkle(g, 28, 4, 'W')
  sparkle(g, 3, 21, 'w')
  return outline(g)
}

function rainbowRobot() {
  const g = makeGrid(32)
  // antenna
  vline(g, 15, 3, 6, 'X')
  disc(g, 15.5, 2.4, 1.4, 'y')
  // head
  fillRect(g, 9, 6, 14, 10, 's')
  fillRect(g, 10, 7, 12, 2, 'w') // brow highlight
  // glowing teal eyes
  fillRect(g, 11, 9, 3, 3, 'T')
  fillRect(g, 18, 9, 3, 3, 'T')
  px(g, 12, 10, 't')
  px(g, 19, 10, 't')
  // mouth grill
  hline(g, 12, 19, 13, 'X')
  hline(g, 12, 19, 14, 'S')
  // ear bolts
  fillRect(g, 7, 9, 2, 3, 'X')
  fillRect(g, 23, 9, 2, 3, 'X')
  // body with rainbow chest bands
  fillRect(g, 10, 17, 12, 11, 'S')
  fillRect(g, 11, 18, 10, 8, 's')
  RAINBOW.forEach((c, i) => {
    hline(g, 12, 19, 19 + i, c)
  })
  // arms
  fillRect(g, 7, 18, 2, 7, 'X')
  fillRect(g, 23, 18, 2, 7, 'X')
  disc(g, 8, 26, 1.4, 's')
  disc(g, 24, 26, 1.4, 's')
  sparkle(g, 27, 4, 'W')
  return outline(g)
}

function starMage() {
  const g = makeGrid(32)
  // wizard hat: tall bent cone with brim
  line(g, 17, 2, 12, 12, 'v')
  line(g, 18, 2, 20, 12, 'v')
  for (let j = 4; j <= 12; j++) {
    const spread = Math.round((j - 2) * 0.9)
    hline(g, 17 - spread / 2, 18 + spread / 2, j, 'v')
  }
  px(g, 17, 1, 'y') // star on tip
  fillRect(g, 8, 12, 17, 3, 'V') // brim
  // stars on hat
  px(g, 15, 7, 'y')
  px(g, 19, 10, 'y')
  px(g, 13, 11, 'W')
  // face
  ellipse(g, 16, 18, 5.4, 4.6, 'e')
  px(g, 13, 17, 'k')
  px(g, 19, 17, 'k')
  px(g, 12, 20, 'q')
  px(g, 20, 20, 'q')
  hline(g, 15, 17, 21, 'E')
  // robe with star
  fillRect(g, 10, 23, 13, 6, 'B')
  fillRect(g, 10, 23, 13, 2, 'k')
  sparkle(g, 16, 26, 'y', 1)
  // staff
  vline(g, 27, 10, 28, 'c')
  sparkle(g, 27, 8, 't', 1)
  sparkle(g, 4, 6, 'W')
  return outline(g)
}

export default {
  unicorn: { dir: DIR, rows: toRows(unicorn()) },
  'space-elf': { dir: DIR, rows: toRows(spaceElf()) },
  'space-hero': { dir: DIR, rows: toRows(spaceHero()) },
  'astro-cat': { dir: DIR, rows: toRows(astroCat()) },
  'rainbow-robot': { dir: DIR, rows: toRows(rainbowRobot()) },
  'star-mage': { dir: DIR, rows: toRows(starMage()) },
}
