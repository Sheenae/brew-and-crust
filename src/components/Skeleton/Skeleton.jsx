import styles from './Skeleton.module.css'

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <div className={`${styles.shimmer} ${styles.image}`} />
      <div className={styles.body}>
        <div className={`${styles.shimmer} ${styles.line}`} style={{ width: '40%' }} />
        <div className={`${styles.shimmer} ${styles.line}`} style={{ width: '80%' }} />
        <div className={`${styles.shimmer} ${styles.line}`} style={{ width: '55%' }} />
      </div>
    </div>
  )
}

export default function Skeleton({ width = '100%', height = '16px', radius = '6px' }) {
  return <div className={styles.shimmer} style={{ width, height, borderRadius: radius }} />
}
