import styles from './NumberStepper.module.css'

interface Props {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label: string
}

export function NumberStepper({ value, onChange, min = 0, max = 9999, step = 1, label }: Props) {
  return (
    <span className={styles.stepper} role="group" aria-label={label}>
      <button
        type="button"
        className={styles.btn}
        disabled={value - step < min}
        onClick={() => onChange(Math.max(min, value - step))}
        aria-label={`decrease ${label}`}
      >
        −
      </button>
      <span className={styles.value} aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        className={styles.btn}
        disabled={value + step > max}
        onClick={() => onChange(Math.min(max, value + step))}
        aria-label={`increase ${label}`}
      >
        +
      </button>
    </span>
  )
}
