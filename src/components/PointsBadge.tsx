import { decor } from '../assets'
import styles from './PointsBadge.module.css'

interface Props {
  points: number
  size?: 'small' | 'medium' | 'big'
  label?: string
}

export function PointsBadge({ points, size = 'medium', label }: Props) {
  const classes = [
    styles.badge,
    size === 'big' ? styles.big : size === 'small' ? styles.small : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes} title={label ?? 'points'}>
      <img src={decor.coin} alt="" />
      {/* key remount re-triggers the pop animation whenever the value changes */}
      <span key={points} className={styles.value}>
        {points}
      </span>
    </span>
  )
}
