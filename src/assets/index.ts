/**
 * Sprite registries. An icon's stable ID is its filename stem — drop a new
 * PNG into the folder (or add a grid to scripts/sprites and `npm run gen:art`)
 * and it automatically appears in the pickers.
 */

function registry(glob: Record<string, unknown>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(glob).map(([path, url]) => [
      path.split('/').pop()!.replace(/\.png$/, ''),
      url as string,
    ]),
  )
}

export const choreIcons = registry(
  import.meta.glob('./icons/chores/*.png', { eager: true, query: '?url', import: 'default' }),
)

export const prizeIcons = registry(
  import.meta.glob('./icons/prizes/*.png', { eager: true, query: '?url', import: 'default' }),
)

export const avatars = registry(
  import.meta.glob('./avatars/*.png', { eager: true, query: '?url', import: 'default' }),
)

export const decor = registry(
  import.meta.glob('./decor/*.png', { eager: true, query: '?url', import: 'default' }),
)
