import { sfx } from '../audio/chiptune'
import { AvatarBadge } from '../components/AvatarBadge'
import { Modal } from '../components/Modal'
import { PointsBadge } from '../components/PointsBadge'
import { useAppDispatch, useAppState } from '../state/AppStateContext'
import styles from './PlayerSelectModal.module.css'

export function PlayerSelectModal({ onClose }: { onClose: () => void }) {
  const { data } = useAppState()
  const dispatch = useAppDispatch()

  return (
    <Modal title="Choose your hero" onClose={onClose}>
      {data.players.length === 0 ? (
        <p className={styles.empty}>
          No heroes yet! Parents: open ⚙ settings on the title screen to add players.
        </p>
      ) : (
        <div className={styles.grid}>
          {data.players.map((p) => (
            <button
              key={p.id}
              type="button"
              className={styles.card}
              onClick={() => {
                sfx.play('start')
                dispatch({ type: 'SELECT_PLAYER', playerId: p.id })
              }}
            >
              <AvatarBadge avatarId={p.avatarId} name={p.name} />
              <PointsBadge points={p.pointsBank} size="small" />
            </button>
          ))}
        </div>
      )}
    </Modal>
  )
}
