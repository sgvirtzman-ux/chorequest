import { avatars } from '../assets'
import styles from './AvatarBadge.module.css'

interface Props {
  avatarId: string
  name?: string
  size?: 'small' | 'medium' | 'large'
  layout?: 'column' | 'row'
}

export function AvatarBadge({ avatarId, name, size = 'medium', layout = 'column' }: Props) {
  const src = avatars[avatarId] ?? avatars['unicorn']
  const classes = [
    styles.badge,
    layout === 'row' ? styles.row : '',
    size === 'small' ? styles.small : size === 'large' ? styles.large : '',
  ]
    .filter(Boolean)
    .join(' ')
  return (
    <span className={classes}>
      <img className={styles.sprite} src={src} alt="" />
      {name ? <span className={styles.name}>{name}</span> : null}
    </span>
  )
}
