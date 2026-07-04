import { decor } from '../assets'
import { AvatarBadge } from '../components/AvatarBadge'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppDispatch, useAppState } from '../state/AppStateContext'
import { getLeaderboard } from '../state/selectors'
import { useCurrentWeekKey } from '../state/useCurrentWeekKey'
import { weekRangeLabel } from '../utils/week'
import styles from './LeaderboardScreen.module.css'

export function LeaderboardScreen() {
  const { data, ui } = useAppState()
  const dispatch = useAppDispatch()
  const weekKey = useCurrentWeekKey()
  const rows = getLeaderboard(data, weekKey)
  const maxPoints = Math.max(1, ...rows.map((r) => r.weekPoints))
  const backScreen = ui.activePlayerId ? 'dashboard' : 'title'

  return (
    <div className={styles.screen}>
      <ScreenHeader onBack={() => dispatch({ type: 'NAVIGATE', screen: backScreen })} />
      <h1 className={styles.heading}>🏆 Galactic Leaderboard</h1>
      <p className={styles.week}>This week: {weekRangeLabel(weekKey)}</p>

      {rows.length === 0 ? (
        <p className={styles.empty}>No players yet — add your family in ⚙ settings!</p>
      ) : (
        <div className={styles.rows}>
          {rows.map((row, i) => (
            <div key={row.player.id} className={`${styles.row} ${i === 0 ? styles.first : ''}`}>
              <span className={styles.rank}>
                {i === 0 && row.weekPoints > 0 ? (
                  <img className={styles.crown} src={decor.crown} alt="week leader" />
                ) : null}
                {i + 1}
              </span>
              <AvatarBadge avatarId={row.player.avatarId} size="small" />
              <span className={styles.nameCol}>
                <span className={styles.name}>{row.player.name}</span>
                <span className={styles.done}>
                  {row.weekDone} quest{row.weekDone === 1 ? '' : 's'} approved
                </span>
              </span>
              <span className={styles.points}>{row.weekPoints}</span>
              <span
                className={styles.barTrack}
                style={{ gridColumn: '2 / -1' }}
                aria-hidden="true"
              >
                <span
                  className={styles.barFill}
                  style={{ display: 'block', width: `${(row.weekPoints / maxPoints) * 100}%` }}
                />
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
