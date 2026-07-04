import { useState } from 'react'
import type { Player, Prize } from '../types'
import { sfx } from '../audio/chiptune'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { PixelPanel } from '../components/PixelPanel'
import { ScreenHeader } from '../components/ScreenHeader'
import { useAppDispatch, useAppState } from '../state/AppStateContext'
import { getPlayerPendingRedemptions } from '../state/selectors'
import { PrizeCard } from './PrizeCard'
import styles from './ShopScreen.module.css'

export function ShopScreen({ player }: { player: Player }) {
  const { data } = useAppState()
  const dispatch = useAppDispatch()
  const [confirming, setConfirming] = useState<Prize | null>(null)

  const prizes = data.prizes
    .filter((p) => !p.archived)
    .slice()
    .sort((a, b) => a.cost - b.cost)
  const pendingLoot = getPlayerPendingRedemptions(data, player.id)

  return (
    <div className={styles.screen}>
      <ScreenHeader
        player={player}
        onBack={() => dispatch({ type: 'NAVIGATE', screen: 'dashboard' })}
      />

      <h1 className={styles.heading}>✦ Cosmic Prize Shop ✦</h1>
      <p className={styles.subtext}>
        Save your points or cash them in — glowing prizes are within reach!
      </p>

      <div className={styles.grid}>
        {prizes.map((prize) => (
          <PrizeCard
            key={prize.id}
            prize={prize}
            bank={player.pointsBank}
            onRedeem={() => {
              sfx.play('click')
              setConfirming(prize)
            }}
          />
        ))}
      </div>

      {pendingLoot.length > 0 ? (
        <PixelPanel color="gold" title="★ Your loot on the way">
          <div className={styles.lootList}>
            {pendingLoot.map((r) => (
              <div key={r.id} className={styles.lootRow}>
                <span>{r.prizeName}</span>
                <span className={styles.lootStatus}>
                  −{r.cost} pts · waiting for a parent
                </span>
              </div>
            ))}
          </div>
        </PixelPanel>
      ) : null}

      {confirming ? (
        <ConfirmDialog
          title="Cash in points?"
          message={
            <>
              Trade <strong>{confirming.cost} points</strong> for{' '}
              <strong>{confirming.name}</strong>?
              <br />
              You'll have {player.pointsBank - confirming.cost} points left. A parent
              will deliver your prize!
            </>
          }
          confirmLabel="Cash in!"
          variant="gold"
          confirmSound={false}
          onConfirm={() => {
            dispatch({ type: 'REDEEM_PRIZE', playerId: player.id, prizeId: confirming.id })
            sfx.play('fanfare')
            setConfirming(null)
          }}
          onCancel={() => setConfirming(null)}
        />
      ) : null}
    </div>
  )
}
