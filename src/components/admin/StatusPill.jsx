import styles from './StatusPill.module.css'

const MAP = {
  fulfilled: 'sage',
  processing: 'copper',
  cancelled: 'error',
  refunded: 'espresso',
  active: 'sage',
  expired: 'error',
  scheduled: 'copper',
  'in stock': 'sage',
  low: 'copper',
  out: 'error',
}

export default function StatusPill({ status }) {
  const tone = MAP[status?.toLowerCase()] || 'espresso'
  return <span className={`${styles.pill} ${styles[tone]}`}>{status}</span>
}
