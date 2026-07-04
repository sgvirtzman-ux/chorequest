import { Starfield } from './components/Starfield'
import { AppStateProvider, useAppState } from './state/AppStateContext'
import { TitleScreen } from './screens/TitleScreen'
import { DashboardScreen } from './screens/DashboardScreen'
import { ShopScreen } from './screens/ShopScreen'
import { LeaderboardScreen } from './screens/LeaderboardScreen'
import { AdminScreen } from './screens/admin/AdminScreen'

function Screens() {
  const { ui, data } = useAppState()
  const activePlayer = data.players.find((p) => p.id === ui.activePlayerId) ?? null

  switch (ui.screen) {
    case 'title':
      return <TitleScreen />
    case 'dashboard':
      return activePlayer ? <DashboardScreen player={activePlayer} /> : <TitleScreen />
    case 'shop':
      return activePlayer ? <ShopScreen player={activePlayer} /> : <TitleScreen />
    case 'leaderboard':
      return <LeaderboardScreen />
    case 'admin':
      return <AdminScreen />
  }
}

export default function App() {
  return (
    <AppStateProvider>
      <Starfield />
      <Screens />
    </AppStateProvider>
  )
}
