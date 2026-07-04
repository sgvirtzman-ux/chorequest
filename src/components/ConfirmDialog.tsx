import type { ReactNode } from 'react'
import { Modal } from './Modal'
import { PixelButton } from './PixelButton'
import styles from './ConfirmDialog.module.css'

interface Props {
  title: string
  message: ReactNode
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'pink' | 'teal' | 'gold' | 'danger'
  /** suppress the standard click blip (e.g. when confirm triggers its own jingle) */
  confirmSound?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel = 'Yes!',
  cancelLabel = 'Not yet',
  variant = 'teal',
  confirmSound = true,
  onConfirm,
  onCancel,
}: Props) {
  return (
    <Modal title={title} onClose={onCancel} color={variant === 'danger' ? 'pink' : 'teal'}>
      <div className={styles.message}>{message}</div>
      <div className={styles.buttons}>
        <PixelButton variant="ghost" onClick={onCancel}>
          {cancelLabel}
        </PixelButton>
        <PixelButton variant={variant} clickSound={confirmSound} onClick={onConfirm}>
          {confirmLabel}
        </PixelButton>
      </div>
    </Modal>
  )
}
