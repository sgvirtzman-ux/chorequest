import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { PixelPanel } from './PixelPanel'
import styles from './Modal.module.css'

interface Props {
  title: string
  onClose: () => void
  children: ReactNode
  wide?: boolean
  color?: 'teal' | 'pink' | 'gold'
}

export function Modal({ title, onClose, children, wide, color = 'pink' }: Props) {
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    dialogRef.current?.focus()
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div
        ref={dialogRef}
        className={`${styles.dialog} ${wide ? styles.wide : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        tabIndex={-1}
      >
        <PixelPanel color={color}>
          <div className={styles.titleRow}>
            <h2 className={styles.title}>{title}</h2>
            <button type="button" className={styles.close} onClick={onClose} aria-label="Close">
              ✕
            </button>
          </div>
          {children}
        </PixelPanel>
      </div>
    </div>,
    document.body,
  )
}
