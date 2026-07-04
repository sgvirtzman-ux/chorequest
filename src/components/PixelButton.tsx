import type { ButtonHTMLAttributes, MouseEvent } from 'react'
import { sfx } from '../audio/chiptune'
import styles from './PixelButton.module.css'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'pink' | 'teal' | 'gold' | 'danger' | 'ghost'
  size?: 'small' | 'medium' | 'big'
  /** set false for buttons that trigger their own jingle */
  clickSound?: boolean
}

export function PixelButton({
  variant = 'pink',
  size = 'medium',
  clickSound = true,
  className,
  onClick,
  ...rest
}: Props) {
  const classes = [
    styles.btn,
    variant !== 'pink' ? styles[variant] : '',
    size === 'big' ? styles.big : size === 'small' ? styles.small : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ')

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    if (clickSound) sfx.play('click')
    onClick?.(e)
  }

  return <button type="button" className={classes} onClick={handleClick} {...rest} />
}
