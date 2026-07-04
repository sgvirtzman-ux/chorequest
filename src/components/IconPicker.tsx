import styles from './IconPicker.module.css'

interface Props {
  icons: Record<string, string>
  value: string
  onChange: (iconId: string) => void
  label: string
}

export function IconPicker({ icons, value, onChange, label }: Props) {
  return (
    <div className={styles.grid} role="radiogroup" aria-label={label}>
      {Object.entries(icons).map(([id, url]) => (
        <button
          key={id}
          type="button"
          role="radio"
          aria-checked={value === id}
          aria-label={id}
          className={`${styles.cell} ${value === id ? styles.selected : ''}`}
          onClick={() => onChange(id)}
        >
          <img src={url} alt="" />
        </button>
      ))}
    </div>
  )
}
