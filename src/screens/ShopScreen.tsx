import type { Player } from '../types'

export function ShopScreen({ player }: { player: Player }) {
  return <main>Shop for {player.name} — coming in the next phase</main>
}
