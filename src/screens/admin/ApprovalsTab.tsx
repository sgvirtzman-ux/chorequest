import { sfx } from '../../audio/chiptune'
import { AvatarBadge } from '../../components/AvatarBadge'
import { PixelButton } from '../../components/PixelButton'
import { useAppDispatch, useAppState } from '../../state/AppStateContext'
import { getPendingCompletions, getPendingRedemptions } from '../../state/selectors'
import { weekRangeLabel } from '../../utils/week'
import styles from './admin.module.css'

export function ApprovalsTab() {
  const { data } = useAppState()
  const dispatch = useAppDispatch()

  const completions = getPendingCompletions(data)
  const redemptions = getPendingRedemptions(data)
  const playerById = new Map(data.players.map((p) => [p.id, p]))

  // group pending quests by week so "last week" items stand out
  const byWeek = new Map<string, typeof completions>()
  for (const c of completions) {
    const list = byWeek.get(c.weekKey) ?? []
    list.push(c)
    byWeek.set(c.weekKey, list)
  }

  return (
    <>
      <h2 className={styles.sectionTitle}>Quests awaiting approval</h2>
      {completions.length === 0 ? (
        <p className={styles.empty}>All clear, Commander! No quests waiting.</p>
      ) : (
        [...byWeek.entries()].map(([weekKey, items]) => (
          <div key={weekKey}>
            <p className={styles.note}>Week of {weekRangeLabel(weekKey)}</p>
            <div className={styles.list}>
              {items.map((c) => {
                const player = playerById.get(c.playerId)
                return (
                  <div key={c.id} className={styles.row}>
                    {player ? <AvatarBadge avatarId={player.avatarId} size="small" /> : null}
                    <div className={styles.rowMain}>
                      <span className={styles.rowTitle}>
                        {player?.name ?? '?'} · {c.choreName}
                      </span>
                      <span className={styles.rowSub}>
                        +{c.points} pts · claimed{' '}
                        {new Date(c.claimedAt).toLocaleString(undefined, {
                          weekday: 'short',
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className={styles.rowActions}>
                      <PixelButton
                        variant="teal"
                        size="small"
                        clickSound={false}
                        onClick={() => {
                          dispatch({ type: 'APPROVE_COMPLETION', id: c.id })
                          sfx.play('coin')
                        }}
                      >
                        ✔ Approve
                      </PixelButton>
                      <PixelButton
                        variant="danger"
                        size="small"
                        clickSound={false}
                        onClick={() => {
                          dispatch({ type: 'REJECT_COMPLETION', id: c.id })
                          sfx.play('reject')
                        }}
                      >
                        ✕ Reject
                      </PixelButton>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))
      )}

      <h2 className={styles.sectionTitle}>Prizes to deliver</h2>
      {redemptions.length === 0 ? (
        <p className={styles.empty}>No prizes waiting to be delivered.</p>
      ) : (
        <div className={styles.list}>
          {redemptions.map((r) => {
            const player = playerById.get(r.playerId)
            return (
              <div key={r.id} className={styles.row}>
                {player ? <AvatarBadge avatarId={player.avatarId} size="small" /> : null}
                <div className={styles.rowMain}>
                  <span className={styles.rowTitle}>
                    {player?.name ?? '?'} · {r.prizeName}
                  </span>
                  <span className={styles.rowSub}>
                    {r.cost} pts spent ·{' '}
                    {new Date(r.redeemedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
                <div className={styles.rowActions}>
                  <PixelButton
                    variant="gold"
                    size="small"
                    clickSound={false}
                    onClick={() => {
                      dispatch({ type: 'FULFILL_REDEMPTION', id: r.id })
                      sfx.play('fanfare')
                    }}
                  >
                    ★ Delivered
                  </PixelButton>
                  <PixelButton
                    variant="ghost"
                    size="small"
                    onClick={() => dispatch({ type: 'CANCEL_REDEMPTION', id: r.id })}
                  >
                    Refund
                  </PixelButton>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}
