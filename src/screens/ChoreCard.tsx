import { choreIcons } from '../assets'
import { PointsBadge } from '../components/PointsBadge'
import type { WeekChoreEntry } from '../state/selectors'
import styles from './ChoreCard.module.css'

interface Props {
  entry: WeekChoreEntry
  onClaim: () => void
}

export function ChoreCard({ entry, onClaim }: Props) {
  const { chore, completion } = entry
  const status = completion === null ? 'todo' : completion.status === 'pending' ? 'pending' : 'done'

  const body = (
    <>
      <img className={styles.icon} src={choreIcons[chore.iconId]} alt="" />
      <span className={styles.name}>{chore.name}</span>
      {chore.description ? <span className={styles.desc}>{chore.description}</span> : null}
      <PointsBadge points={chore.points} size="small" />
      {status === 'todo' ? (
        <span className={`${styles.status} ${styles.statusTodo}`}>▶ Tap to complete!</span>
      ) : status === 'pending' ? (
        <span className={`${styles.status} ${styles.statusPending}`}>⧗ Awaiting approval</span>
      ) : (
        <span className={`${styles.status} ${styles.statusDone}`}>✔ Done! +{completion!.points} pts</span>
      )}
    </>
  )

  if (status === 'todo') {
    return (
      <button type="button" className={`${styles.card} ${styles.todo}`} onClick={onClaim}>
        {body}
      </button>
    )
  }
  return (
    <div className={`${styles.card} ${status === 'pending' ? styles.pending : styles.done}`}>
      {body}
    </div>
  )
}
