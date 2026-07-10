import { FiStar } from 'react-icons/fi'
import styles from './Rating.module.css'

export default function Rating({ value = 0, count, size = 14 }) {
  const rounded = Math.round(value * 2) / 2
  return (
    <div className={styles.wrap} aria-label={`Rated ${value} out of 5`}>
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((n) => (
          <FiStar
            key={n}
            size={size}
            className={n <= rounded ? styles.filled : styles.empty}
          />
        ))}
      </div>
      <span className={styles.value}>{value.toFixed(1)}</span>
      {typeof count === 'number' && <span className={styles.count}>({count})</span>}
    </div>
  )
}
