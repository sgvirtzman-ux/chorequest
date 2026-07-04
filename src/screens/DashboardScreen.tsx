import { useState } from 'react'
import type { Player } from '../types'
import { decor, prizeIcons } from '../assets'
import { sfx } from '../audio/chiptune'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PixelButton } from '../components/PixelButton'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppDispatch, useAppState } from '../state/AppStateContext'
import { getPlayerWeekChores, type WeekChoreEntry } from '../state/selectors'
import { useCurrentWeekKey } from '../state/useCurrentWeekKey'
import { weekRangeLabel } from '../utils/week'
import { ChoreCard } from './ChoreCard'
import styles from './DashboardScreen.module.css'

export function DashboardScreen({ player }: { player: Player }) {
  const { data } = useAppState()
  const dispatch = useAppDispatch()
  const weekKey = useCurrentWeekKey()
  const [confirming, setConfirming] = useState<WeekChoreEntry | null>(null)

  const entries = getPlayerWeekChores(data, player.id, weekKey)
  const doneCount = entries.filter((e) => e.completion !== null).length
  const progress = entries.length === 0 ? 0 : Math.round((doneCount / entries.length) * 100)

  return (
    <div className={styles.screen}>
      <ScreenHeader
        player={player}
        onBack={() => dispatch({ type: 'NAVIGATE', screen: 'title' })}
        backLabel="Switch"
      />

      <div className={styles.weekRow}>
        <span className={styles.weekLabel}>★ This week: {weekRangeLabel(weekKey)}</span>
        <span className={styles.progressText}>
          {doneCount} of {entries.length} quests done
        </span>
      </div>
      <div
        className={styles.progressTrack}
        role="progressbar"
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {entries.length === 0 ? (
        <p className={styles.empty}>
          No quests assigned this week!
          <br />
          Ask a parent to assign chores in ⚙ settings.
        </p>
      ) : (
        <div className={styles.grid}>
          {entries.map((entry) => (
            <ChoreCard
              key={entry.assignment.id}
              entry={entry}
              onClaim={() => {
                sfx.play('click')
                setConfirming(entry)
              }}
            />
          ))}
        </div>
      )}

      <nav className={styles.footerNav}>
        <PixelButton
          variant="pink"
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'shop' })}
        >
          <img className={styles.navIcon} src={prizeIcons['coins-few']} alt="" />
          Prize Shop
        </PixelButton>
        <PixelButton
          variant="teal"
          onClick={() => dispatch({ type: 'NAVIGATE', screen: 'leaderboard' })}
        >
          <img className={styles.navIcon} src={decor.crown} alt="" />
          Leaderboard
        </PixelButton>
      </nav>

      {confirming ? (
        <ConfirmDialog
          title="Quest complete?"
          message={
            <>
              Did you finish <strong>{confirming.chore.name}</strong> for{' '}
              <strong>{confirming.chore.points} points</strong>?
              <br />A parent will approve it before points are awarded.
            </>
          }
          confirmLabel="I did it!"
          confirmSound={false}
          onConfirm={() => {
            dispatch({
              type: 'CLAIM_CHORE',
              assignmentId: confirming.assignment.id,
              weekKey,
            })
            sfx.play('claim')
            setConfirming(null)
          }}
          onCancel={() => setConfirming(null)}
        />
      ) : null}
    </div>
  )
}
