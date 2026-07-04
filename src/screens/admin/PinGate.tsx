import { useState } from 'react'
import { sfx } from '../../audio/chiptune'
import { PixelButton } from '../../components/PixelButton'
import { useAppDispatch, useAppState } from '../../state/AppStateContext'
import styles from './PinGate.module.css'

export function PinGate() {
  const { data } = useAppState()
  const dispatch = useAppDispatch()
  const [entered, setEntered] = useState('')
  const [shaking, setShaking] = useState(false)

  const pressKey = (digit: string) => {
    if (shaking) return
    sfx.play('click')
    const next = entered + digit
    if (next.length < 4) {
      setEntered(next)
      return
    }
    if (next === data.settings.parentPin) {
      dispatch({ type: 'UNLOCK_ADMIN' })
      return
    }
    // wrong PIN: buzz, shake, reset
    sfx.play('error')
    setEntered(next)
    setShaking(true)
    window.setTimeout(() => {
      setShaking(false)
      setEntered('')
    }, 450)
  }

  return (
    <div className={styles.gate}>
      <h1 className={styles.title}>⚙ Parent Zone</h1>
      <div className={`${styles.dots} ${shaking ? styles.shake : ''}`} aria-label="PIN entry">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`${styles.dot} ${i < entered.length ? styles.dotFilled : ''}`}
          />
        ))}
      </div>
      <div className={styles.pad}>
        {['1', '2', '3', '4', '5', '6', '7', '8', '9', '←', '0', '✕'].map((key) => (
          <button
            key={key}
            type="button"
            className={styles.key}
            onClick={() => {
              if (key === '←') {
                setEntered((v) => v.slice(0, -1))
              } else if (key === '✕') {
                dispatch({ type: 'NAVIGATE', screen: 'title' })
              } else {
                pressKey(key)
              }
            }}
            aria-label={key === '←' ? 'delete digit' : key === '✕' ? 'back to title' : key}
          >
            {key}
          </button>
        ))}
      </div>
      {data.settings.parentPin === '1234' ? (
        <p className={styles.hint}>
          Default PIN is 1234 — change it in Settings once you're in.
        </p>
      ) : null}
      <PixelButton variant="ghost" size="small" onClick={() => dispatch({ type: 'NAVIGATE', screen: 'title' })}>
        ◀ Back to title
      </PixelButton>
    </div>
  )
}
