import { prizeIcons } from '../assets'
import { PixelButton } from '../components/PixelButton'
import { PointsBadge } from '../components/PointsBadge'
import type { Prize } from '../types'
import styles from './PrizeCard.module.css'

interface Props {
  prize: Prize
  bank: number
  onRedeem: () => void
}

export function PrizeCard({ prize, bank, onRedeem }: Props) {
  const affordable = bank >= prize.cost
  return (
    <div className={`${styles.card} ${affordable ? styles.affordable : ''}`}>
      <img className={styles.icon} src={prizeIcons[prize.iconId]} alt="" />
      <span className={styles.name}>{prize.name}</span>
      {prize.description ? <span className={styles.desc}>{prize.description}</span> : null}
      <PointsBadge points={prize.cost} size="small" label="cost" />
      {affordable ? (
        <PixelButton variant="gold" size="small" onClick={onRedeem}>
          Cash in!
        </PixelButton>
      ) : (
        <span className={styles.need}>Need {prize.cost - bank} more pts</span>
      )}
    </div>
  )
}
