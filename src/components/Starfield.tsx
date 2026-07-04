import { decor } from '../assets'
import styles from './Starfield.module.css'

/** Fixed cosmic backdrop: nebula glows + two parallax star layers. */
export function Starfield() {
  return (
    <div className={styles.field} aria-hidden="true">
      <div
        className={`${styles.layer} ${styles.far}`}
        style={{ backgroundImage: `url(${decor['star-tile']})` }}
      />
      <div
        className={`${styles.layer} ${styles.near}`}
        style={{ backgroundImage: `url(${decor['star-tile-bright']})` }}
      />
    </div>
  )
}
