import type { HTMLAttributes, ReactNode } from 'react'
import styles from './PixelPanel.module.css'

interface Props extends HTMLAttributes<HTMLDivElement> {
  color?: 'teal' | 'pink' | 'gold' | 'dim'
  title?: string
  children: ReactNode
}

export function PixelPanel({ color = 'teal', title, className, children, ...rest }: Props) {
  const classes = [styles.panel, color !== 'teal' ? styles[color] : '', className ?? '']
    .filter(Boolean)
    .join(' ')
  return (
    <div className={classes} {...rest}>
      {title ? <div className={styles.title}>{title}</div> : null}
      {children}
    </div>
  )
}
