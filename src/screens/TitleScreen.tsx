import { useState } from 'react'
import { avatars, decor } from '../assets'
import { PixelButton } from '../components/PixelButton'
import { useAppDispatch, useAppState } from '../state/AppStateContext'
import { getPendingApprovalsCount } from '../state/selectors'
import { PlayerSelectModal } from './PlayerSelectModal'
import styles from './TitleScreen.module.css'

export function TitleScreen() {
  const { data } = useAppState()
  const dispatch = useAppDispatch()
  const [selectOpen, setSelectOpen] = useState(false)
  const pending = getPendingApprovalsCount(data)

  return (
    <div className={styles.screen}>
      <img className={styles.planet} src={decor.planet} alt="" aria-hidden="true" />
      <img className={styles.rainbowLeft} src={decor.rainbow} alt="" aria-hidden="true" />
      <img className={styles.starTL} src={decor['star-small']} alt="" aria-hidden="true" />

      <img className={styles.logo} src={decor.logo} alt="ChoreQuest" />
      <p className={styles.subtitle}>A cosmic chore adventure</p>

      <div className={styles.heroes} aria-hidden="true">
        <img src={avatars['unicorn']} alt="" />
        <img src={avatars['space-elf']} alt="" />
        <img src={avatars['space-hero']} alt="" />
      </div>

      <PixelButton
        variant="gold"
        size="big"
        className={styles.start}
        onClick={() => setSelectOpen(true)}
      >
        ★ Press Start ★
      </PixelButton>

      <PixelButton
        variant="ghost"
        size="small"
        className={styles.parents}
        onClick={() => dispatch({ type: 'NAVIGATE', screen: 'admin' })}
      >
        ⚙ Parents
        {pending > 0 ? <span className={styles.pendingBadge}>{pending}</span> : null}
      </PixelButton>

      {selectOpen ? <PlayerSelectModal onClose={() => setSelectOpen(false)} /> : null}
    </div>
  )
}
