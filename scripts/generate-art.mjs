/**
 * ChoreQuest pixel-art generator.
 *
 * Renders every sprite module (character grids) to PNGs with nearest-neighbor
 * scaling and writes them into src/assets/** (committed) — the app build never
 * runs this. Also writes public/favicon.png and a contact-sheet.png at the
 * repo root (gitignored) for quick visual review.
 *
 * Usage: npm run gen:art
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PNG } from 'pngjs'
import { PALETTE } from './palette.mjs'
import choreIcons from './sprites/chore-icons.mjs'
import prizeIcons from './sprites/prize-icons.mjs'
import avatars from './sprites/avatars.mjs'
import decor from './sprites/decor.mjs'
import logo from './sprites/logo.mjs'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..')
const ASSETS = join(ROOT, 'src', 'assets')
const DEFAULT_SCALE = 4 // 32x32 grid -> 128x128 png

const collections = { ...choreIcons, ...prizeIcons, ...avatars, ...decor, ...logo }

function validate(name, rows) {
  const width = rows[0].length
  rows.forEach((row, j) => {
    if (row.length !== width) {
      throw new Error(`${name}: row ${j} is ${row.length} wide, expected ${width}`)
    }
    for (const ch of row) {
      if (!(ch in PALETTE)) {
        throw new Error(`${name}: unknown palette char "${ch}" in row ${j}`)
      }
    }
  })
}

function renderPng(rows, scale) {
  const w = rows[0].length
  const h = rows.length
  const png = new PNG({ width: w * scale, height: h * scale })
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const [r, g, b, a] = PALETTE[rows[j][i]]
      for (let sy = 0; sy < scale; sy++) {
        for (let sx = 0; sx < scale; sx++) {
          const idx = ((j * scale + sy) * w * scale + (i * scale + sx)) * 4
          png.data[idx] = r
          png.data[idx + 1] = g
          png.data[idx + 2] = b
          png.data[idx + 3] = a
        }
      }
    }
  }
  return png
}

let count = 0
for (const [name, { dir, rows, scale = DEFAULT_SCALE }] of Object.entries(collections)) {
  validate(name, rows)
  const outDir = join(ASSETS, dir)
  if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })
  writeFileSync(join(outDir, `${name}.png`), PNG.sync.write(renderPng(rows, scale)))
  count++
}

// favicon: the unicorn mascot at 64x64 (HD grid is already 64px at 1x)
const unicornRows = avatars.unicorn.rows
writeFileSync(join(ROOT, 'public', 'favicon.png'), PNG.sync.write(renderPng(unicornRows, 1)))

// contact sheet for eyeballing (gitignored): all sprites side by side at 3x
{
  const entries = Object.entries(collections)
  const cell = 140
  const cols = 6
  const rowsCount = Math.ceil(entries.length / cols)
  const sheet = new PNG({ width: cols * cell, height: rowsCount * cell })
  sheet.data.fill(30) // dark gray backdrop
  for (let i = 3; i < sheet.data.length; i += 4) sheet.data[i] = 255
  entries.forEach(([, { rows }], idx) => {
    const gw = rows[0].length
    const gh = rows.length
    const scale = Math.max(1, Math.floor(Math.min(128 / gw, 128 / gh)))
    const img = renderPng(rows, scale)
    const ox = (idx % cols) * cell + Math.floor((cell - gw * scale) / 2)
    const oy = Math.floor(idx / cols) * cell + Math.floor((cell - gh * scale) / 2)
    for (let j = 0; j < img.height; j++) {
      for (let i = 0; i < img.width; i++) {
        const src = (j * img.width + i) * 4
        if (img.data[src + 3] === 0) continue
        const dst = ((oy + j) * sheet.width + (ox + i)) * 4
        sheet.data.set(img.data.subarray(src, src + 4), dst)
      }
    }
  })
  writeFileSync(join(ROOT, 'contact-sheet.png'), PNG.sync.write(sheet))
}

console.log(`Generated ${count} sprites + favicon + contact-sheet.png`)
