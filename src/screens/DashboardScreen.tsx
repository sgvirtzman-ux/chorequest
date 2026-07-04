import type { Player } from '../types'

export function DashboardScreen({ player }: { player: Player }) {
  return <main>Dashboard for {player.name} — coming in the next phase</main>
}
