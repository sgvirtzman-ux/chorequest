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

const DIR = 'icons/chores'

function trashCans() {
  const g = makeGrid(32)
  // big can
  fillRect(g, 4, 12, 11, 16, 's')
  for (let x = 5; x <= 13; x += 3) vline(g, x, 13, 26, 'S') // ridges
  fillRect(g, 3, 9, 13, 3, 'S') // lid
  fillRect(g, 7, 7, 5, 2, 'S') // lid handle
  // small can, tipped lid
  fillRect(g, 17, 15, 10, 13, 's')
  for (let x = 18; x <= 25; x += 3) vline(g, x, 16, 26, 'S')
  fillRect(g, 16, 12, 12, 3, 'S')
  // stink squiggles
  const stink = [
    [8, 5], [9, 4], [9, 3], [8, 2],
    [21, 8], [22, 7], [22, 6], [21, 5],
    [13, 6], [14, 5],
  ]
  for (const [x, y] of stink) px(g, x, y, 'g')
  // grime drips
  px(g, 6, 28, 'G')
  px(g, 24, 28, 'G')
  vline(g, 10, 13, 15, 'G')
  vline(g, 20, 16, 18, 'G')
  return outline(g)
}

function messyBedroom() {
  const g = makeGrid(32)
  // headboard + frame
  fillRect(g, 2, 8, 4, 17, 'c')
  fillRect(g, 3, 9, 2, 15, 'C')
  // mattress
  fillRect(g, 5, 16, 23, 5, 'w')
  // pillow
  fillRect(g, 6, 13, 6, 4, 'w')
  hline(g, 7, 10, 14, 's')
  // rumpled pink blanket with a jagged edge
  fillRect(g, 12, 14, 16, 6, 'p')
  px(g, 12, 13, 'p')
  px(g, 15, 13, 'p')
  px(g, 19, 13, 'p')
  px(g, 24, 13, 'p')
  hline(g, 13, 26, 16, 'P') // fold shadow
  hline(g, 15, 22, 18, 'P')
  // bed legs
  fillRect(g, 5, 21, 2, 5, 'c')
  fillRect(g, 26, 21, 2, 5, 'c')
  // mess on the floor: sock, toy block, ball
  fillRect(g, 9, 27, 3, 2, 'r')
  px(g, 11, 26, 'r')
  fillRect(g, 16, 26, 3, 3, 't')
  px(g, 17, 27, 'T')
  disc(g, 24, 27, 1.6, 'y')
  px(g, 27, 28, 'n')
  px(g, 13, 28, 'n')
  return outline(g)
}

function bathroom() {
  const g = makeGrid(32)
  // toilet: tank, seat, bowl, base
  fillRect(g, 4, 6, 9, 8, 'w')
  hline(g, 5, 11, 7, 's') // tank lid line
  px(g, 10, 9, 'S') // flusher
  fillRect(g, 4, 14, 14, 3, 'w') // seat
  ellipse(g, 10, 20, 6, 4, 'w') // bowl
  ellipse(g, 10, 19, 3.4, 1.8, 'u') // water
  fillRect(g, 8, 24, 5, 4, 'w') // base
  sparkle(g, 15, 12, 'W')
  // scrub brush at right
  vline(g, 25, 8, 15, 'c')
  fillRect(g, 23, 16, 5, 4, 'p')
  // bubbles
  disc(g, 22, 6, 1.6, 'b')
  disc(g, 27, 4, 1.2, 'u')
  disc(g, 29, 9, 1, 'b')
  disc(g, 21, 24, 1.4, 'u')
  disc(g, 26, 26, 1.8, 'b')
  px(g, 29, 22, 'u')
  return outline(g)
}

function vacuum() {
  const g = makeGrid(32)
  // handle
  line(g, 22, 3, 18, 12, 'X')
  line(g, 23, 3, 19, 12, 'X')
  hline(g, 21, 24, 2, 'x')
  // body (pink upright)
  fillRect(g, 13, 12, 9, 13, 'p')
  fillRect(g, 14, 13, 3, 11, 'q') // highlight
  fillRect(g, 13, 17, 9, 2, 'P') // trim band
  // dust bag
  ellipse(g, 8, 15, 4, 6, 'v')
  ellipse(g, 7, 13, 1.6, 2.4, 'V')
  // base + brush head
  fillRect(g, 6, 25, 21, 4, 't')
  fillRect(g, 6, 27, 21, 2, 'T')
  disc(g, 9, 28, 1.2, 'k')
  disc(g, 23, 28, 1.2, 'k')
  // dust sparkles being sucked up
  px(g, 3, 24, 'n')
  px(g, 2, 27, 'n')
  px(g, 4, 21, 's')
  sparkle(g, 28, 22, 's')
  return outline(g)
}

function dirtyCar() {
  const g = makeGrid(32)
  // cabin
  fillRect(g, 9, 10, 14, 7, 't')
  fillRect(g, 11, 12, 4, 4, 'b') // rear window
  fillRect(g, 17, 12, 4, 4, 'b') // front window
  px(g, 12, 12, 'u')
  px(g, 18, 12, 'u')
  // body
  fillRect(g, 3, 16, 26, 8, 't')
  hline(g, 3, 28, 17, 'u') // top highlight
  fillRect(g, 3, 21, 26, 3, 'T') // rocker shadow
  // lights
  fillRect(g, 28, 17, 2, 2, 'y')
  fillRect(g, 2, 17, 1, 2, 'r')
  // wheels
  disc(g, 9, 24, 3.4, 'x')
  disc(g, 23, 24, 3.4, 'x')
  disc(g, 9, 24, 1.4, 'S')
  disc(g, 23, 24, 1.4, 'S')
  // mud!
  const mud = [
    [5, 19], [6, 20], [7, 19], [13, 20], [14, 19], [15, 21],
    [19, 20], [25, 19], [26, 20], [16, 22], [6, 22],
  ]
  for (const [x, y] of mud) px(g, x, y, 'c')
  px(g, 14, 20, 'C')
  px(g, 26, 19, 'C')
  px(g, 6, 19, 'C')
  // dirt cloud puffs behind
  disc(g, 1, 26, 1.2, 'n')
  px(g, 3, 28, 'n')
  return outline(g)
}

function laundry() {
  const g = makeGrid(32)
  // machine body
  fillRect(g, 5, 5, 22, 24, 'w')
  vline(g, 25, 6, 27, 's') // right shading
  hline(g, 6, 25, 27, 's')
  // control panel
  fillRect(g, 5, 5, 22, 4, 's')
  disc(g, 9, 7, 1.2, 'k') // dial
  px(g, 14, 7, 'p') // buttons
  px(g, 17, 7, 't')
  px(g, 20, 7, 'v')
  // door
  disc(g, 16, 19, 7.2, 'S')
  disc(g, 16, 19, 5.4, 'B')
  ellipse(g, 16, 21, 4.6, 3, 'b') // water
  // suds
  disc(g, 13, 17, 1.4, 'u')
  disc(g, 17, 15, 1.2, 'W')
  disc(g, 19, 18, 1.4, 'u')
  px(g, 15, 14, 'W')
  sparkle(g, 3, 4, 's')
  // feet
  fillRect(g, 6, 29, 3, 1, 'x')
  fillRect(g, 23, 29, 3, 1, 'x')
  return outline(g)
}

export default {
  'trash-cans': { dir: DIR, rows: toRows(trashCans()) },
  'messy-bedroom': { dir: DIR, rows: toRows(messyBedroom()) },
  bathroom: { dir: DIR, rows: toRows(bathroom()) },
  vacuum: { dir: DIR, rows: toRows(vacuum()) },
  'dirty-car': { dir: DIR, rows: toRows(dirtyCar()) },
  laundry: { dir: DIR, rows: toRows(laundry()) },
}
