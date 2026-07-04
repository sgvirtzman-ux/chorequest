import type { ReactNode } from 'react'
import type { Player } from '../types'
import { AvatarBadge } from './AvatarBadge'
import { PixelButton } from './PixelButton'
import { PointsBadge } from './PointsBadge'
import styles from './ScreenHeader.module.css'

interface Props {
  title?: string
  player?: Player
  onBack: () => void
  backLabel?: string
  children?: ReactNode
}

export function ScreenHeader({ title, player, onBack, backLabel = 'Back', children }: Props) {
  return (
    <header className={styles.header}>
      <div className={styles.left}>
        <PixelButton variant="ghost" size="small" onClick={onBack} aria-label={backLabel}>
          ◀ {backLabel}
        </PixelButton>
        {player ? (
          <>
            <AvatarBadge avatarId={player.avatarId} size="small" />
            <span className={styles.playerName}>{player.name}</span>
          </>
        ) : null}
        {title ? <h1 className={styles.title}>{title}</h1> : null}
      </div>
      <div className={styles.right}>
        {player ? <PointsBadge points={player.pointsBank} label="points bank" /> : null}
        {children}
      </div>
    </header>
  )
}
