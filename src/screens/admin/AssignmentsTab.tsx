import { useState } from 'react'
import { choreIcons } from '../../assets'
import { AvatarBadge } from '../../components/AvatarBadge'
import { PointsBadge } from '../../components/PointsBadge'
import { useAppDispatch, useAppState } from '../../state/AppStateContext'
import shared from './admin.module.css'
import styles from './AssignmentsTab.module.css'

/** Weekly duty roster: pick a player, check the chores they do every week. */
export function AssignmentsTab() {
  const { data } = useAppState()
  const dispatch = useAppDispatch()
  const [selectedId, setSelectedId] = useState(data.players[0]?.id ?? null)

  const player = data.players.find((p) => p.id === selectedId) ?? null
  const chores = data.chores.filter((c) => !c.archived)
  const assignedChoreIds = player
    ? data.assignments.filter((a) => a.playerId === player.id).map((a) => a.choreId)
    : []
  const weeklyTotal = chores
    .filter((c) => assignedChoreIds.includes(c.id))
    .reduce((sum, c) => sum + c.points, 0)

  const toggle = (choreId: string) => {
    if (!player) return
    const next = assignedChoreIds.includes(choreId)
      ? assignedChoreIds.filter((id) => id !== choreId)
      : [...assignedChoreIds, choreId]
    dispatch({ type: 'SET_PLAYER_ASSIGNMENTS', playerId: player.id, choreIds: next })
  }

  if (data.players.length === 0) {
    return <p className={shared.empty}>Add players first, then assign their weekly quests.</p>
  }

  return (
    <>
      <div className={styles.playerRow} role="tablist" aria-label="Choose player">
        {data.players.map((p) => (
          <button
            key={p.id}
            type="button"
            role="tab"
            aria-selected={p.id === selectedId}
            className={`${styles.playerBtn} ${p.id === selectedId ? styles.playerBtnActive : ''}`}
            onClick={() => setSelectedId(p.id)}
          >
            <AvatarBadge avatarId={p.avatarId} name={p.name} size="small" />
          </button>
        ))}
      </div>

      {player ? (
        <>
          <p className={styles.summary}>
            {player.name}'s weekly quests: {assignedChoreIds.length} chores ·{' '}
            {weeklyTotal} pts possible
          </p>
          {chores.length === 0 ? (
            <p className={shared.empty}>No chores exist yet — create some in the Chores tab.</p>
          ) : (
            <div className={shared.list}>
              {chores.map((chore) => {
                const checked = assignedChoreIds.includes(chore.id)
                return (
                  <button
                    key={chore.id}
                    type="button"
                    className={`${shared.row} ${styles.choreToggle}`}
                    aria-pressed={checked}
                    onClick={() => toggle(chore.id)}
                  >
                    <span className={`${styles.check} ${checked ? styles.checked : ''}`}>
                      {checked ? '✔' : ''}
                    </span>
                    <img className={shared.rowIcon} src={choreIcons[chore.iconId]} alt="" />
                    <span className={shared.rowMain}>
                      <span className={shared.rowTitle}>{chore.name}</span>
                    </span>
                    <PointsBadge points={chore.points} size="small" />
                  </button>
                )
              })}
            </div>
          )}
        </>
      ) : null}
    </>
  )
}
