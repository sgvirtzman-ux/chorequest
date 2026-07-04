/**
 * Shared cosmic palette: one character per color, used by every sprite grid.
 * '.' is transparent; 'k' is the standard dark outline.
 */
export const PALETTE = {
  '.': [0, 0, 0, 0],

  k: [15, 5, 36, 255], // outline: near-black purple
  K: [28, 15, 61, 255], // dark purple
  m: [58, 43, 92, 255], // deep neutral purple
  N: [85, 67, 122, 255], // dark lavender
  n: [138, 122, 181, 255], // mid lavender
  S: [143, 128, 184, 255], // mid silver
  s: [192, 179, 224, 255], // light silver-lavender
  w: [244, 240, 255, 255], // soft white
  W: [255, 255, 255, 255], // pure white

  p: [255, 95, 210, 255], // pink
  P: [194, 47, 160, 255], // deep pink
  q: [255, 154, 229, 255], // light pink
  t: [62, 232, 216, 255], // teal
  T: [26, 143, 138, 255], // deep teal
  u: [161, 245, 236, 255], // light teal

  y: [255, 210, 74, 255], // gold
  Y: [201, 143, 27, 255], // dark gold
  o: [255, 159, 67, 255], // orange
  O: [204, 102, 34, 255], // dark orange
  r: [255, 79, 109, 255], // red-pink
  R: [200, 40, 70, 255], // dark red
  g: [74, 255, 159, 255], // green
  G: [31, 168, 99, 255], // dark green
  b: [74, 196, 255, 255], // blue
  B: [42, 111, 214, 255], // dark blue
  v: [180, 74, 255, 255], // violet
  V: [122, 43, 181, 255], // dark violet

  e: [247, 214, 179, 255], // skin light
  E: [217, 160, 102, 255], // skin tan
  c: [139, 90, 43, 255], // brown
  C: [90, 58, 27, 255], // dark brown
  x: [47, 47, 58, 255], // dark gray
  X: [98, 98, 116, 255], // mid gray
}

export const RAINBOW = ['r', 'o', 'y', 'g', 'b', 'v']
