import { FiArrowUp, FiArrowDown } from 'react-icons/fi'
import styles from './StatCard.module.css'

export default function StatCard({ icon: Icon, label, value, delta, deltaDirection = 'up' }) {
  return (
    <div className={styles.card}>
      <div className={styles.iconWrap}><Icon size={18} /></div>
      <div className={styles.body}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
        {delta && (
          <span className={`${styles.delta} ${deltaDirection === 'up' ? styles.up : styles.down}`}>
            {deltaDirection === 'up' ? <FiArrowUp size={12} /> : <FiArrowDown size={12} />}
            {delta}
          </span>
        )}
      </div>
    </div>
  )
}
