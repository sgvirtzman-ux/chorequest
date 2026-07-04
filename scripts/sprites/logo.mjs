import { makeGrid, outline, px, sparkle, toRows } from '../kit.mjs'
import { RAINBOW } from '../palette.mjs'

const DIR = 'decor'

/** 5x7 pixel letters — just the glyphs the logo needs */
const FONT = {
  C: ['.###.', '#...#', '#....', '#....', '#....', '#...#', '.###.'],
  H: ['#...#', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  O: ['.###.', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'],
  E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  Q: ['.###.', '#...#', '#...#', '#...#', '#.#.#', '#..#.', '.##.#'],
  U: ['#...#', '#...#', '#...#', '#...#', '#...#', '#...#', '.###.'],
  S: ['.####', '#....', '#....', '.###.', '....#', '....#', '####.'],
  T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
}

/**
 * "CHORE / QUEST" on two lines, rainbow-swept by column,
 * with a white top-row shine per letter and grown dark outline.
 */
function logo() {
  const lines = ['CHORE', 'QUEST']
  const letterW = 6 // 5px glyph + 1px gap
  const textW = lines[0].length * letterW - 1
  const margin = 3
  const g = makeGrid(textW + margin * 2, 7 * 2 + 3 + margin * 2)

  lines.forEach((word, li) => {
    const y0 = margin + li * 10
    ;[...word].forEach((ch, ci) => {
      const glyph = FONT[ch]
      const x0 = margin + ci * letterW
      glyph.forEach((row, j) => {
        ;[...row].forEach((cell, i) => {
          if (cell !== '#') return
          const col = x0 + i
          const band = Math.min(
            RAINBOW.length - 1,
            Math.floor(((col - margin) / textW) * RAINBOW.length),
          )
          px(g, col, y0 + j, j === 0 ? 'w' : RAINBOW[band])
        })
      })
    })
  })

  sparkle(g, 1, 1, 'W')
  sparkle(g, textW + margin * 2 - 2, 3, 'W')
  sparkle(g, 2, 7 * 2 + 3 + margin, 'w')
  return outline(g)
}

export default {
  logo: { dir: DIR, rows: toRows(logo()), scale: 8 },
}
