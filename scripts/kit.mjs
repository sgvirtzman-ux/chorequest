/** Tiny deterministic pixel-drawing kit. Grids are arrays of char arrays. */

export function makeGrid(w, h = w, fill = '.') {
  return Array.from({ length: h }, () => Array(w).fill(fill))
}

export function px(g, x, y, c) {
  x = Math.round(x)
  y = Math.round(y)
  if (y >= 0 && y < g.length && x >= 0 && x < g[0].length) g[y][x] = c
}

export function fillRect(g, x, y, w, h, c) {
  for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) px(g, i, j, c)
}

export function rect(g, x, y, w, h, c) {
  for (let i = x; i < x + w; i++) {
    px(g, i, y, c)
    px(g, i, y + h - 1, c)
  }
  for (let j = y; j < y + h; j++) {
    px(g, x, j, c)
    px(g, x + w - 1, j, c)
  }
}

export function hline(g, x1, x2, y, c) {
  for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) px(g, i, y, c)
}

export function vline(g, x, y1, y2, c) {
  for (let j = Math.min(y1, y2); j <= Math.max(y1, y2); j++) px(g, x, j, c)
}

export function line(g, x1, y1, x2, y2, c) {
  let dx = Math.abs(x2 - x1)
  let dy = -Math.abs(y2 - y1)
  const sx = x1 < x2 ? 1 : -1
  const sy = y1 < y2 ? 1 : -1
  let err = dx + dy
  for (;;) {
    px(g, x1, y1, c)
    if (x1 === x2 && y1 === y2) break
    const e2 = 2 * err
    if (e2 >= dy) {
      err += dy
      x1 += sx
    }
    if (e2 <= dx) {
      err += dx
      y1 += sy
    }
  }
}

/** filled ellipse */
export function ellipse(g, cx, cy, rx, ry, c) {
  for (let j = Math.floor(cy - ry); j <= Math.ceil(cy + ry); j++) {
    for (let i = Math.floor(cx - rx); i <= Math.ceil(cx + rx); i++) {
      const nx = (i - cx) / rx
      const ny = (j - cy) / ry
      if (nx * nx + ny * ny <= 1.05) px(g, i, j, c)
    }
  }
}

export function disc(g, cx, cy, r, c) {
  ellipse(g, cx, cy, r, r, c)
}

/** ellipse outline ring (thickness ~1) */
export function ring(g, cx, cy, rx, ry, c) {
  const steps = Math.max(24, Math.ceil((rx + ry) * 4))
  for (let i = 0; i <= steps; i++) {
    const a = (i / steps) * Math.PI * 2
    px(g, cx + Math.cos(a) * rx, cy + Math.sin(a) * ry, c)
  }
}

/** plus-shaped sparkle */
export function sparkle(g, x, y, c = 'W', arm = 1) {
  px(g, x, y, c)
  for (let d = 1; d <= arm; d++) {
    px(g, x - d, y, c)
    px(g, x + d, y, c)
    px(g, x, y - d, c)
    px(g, x, y + d, c)
  }
}

/** classic 16-bit look: grow a dark outline into transparent cells that touch the shape */
export function outline(g, c = 'k') {
  const h = g.length
  const w = g[0].length
  const marks = []
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      if (g[j][i] !== '.') continue
      const touches =
        (j > 0 && g[j - 1][i] !== '.' && g[j - 1][i] !== c) ||
        (j < h - 1 && g[j + 1][i] !== '.' && g[j + 1][i] !== c) ||
        (i > 0 && g[j][i - 1] !== '.' && g[j][i - 1] !== c) ||
        (i < w - 1 && g[j][i + 1] !== '.' && g[j][i + 1] !== c)
      if (touches) marks.push([i, j])
    }
  }
  for (const [i, j] of marks) g[j][i] = c
  return g
}

export function toRows(g) {
  return g.map((row) => row.join(''))
}

/** deterministic pseudo-random for star fields (never Math.random — output is committed) */
export function lcg(seed) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 0xffffffff
  }
}
