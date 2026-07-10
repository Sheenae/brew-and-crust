import Button from '../Button/Button.jsx'
import styles from './EmptyState.module.css'

export default function EmptyState({ icon: Icon, title, message, actionLabel, onAction }) {
  return (
    <div className={styles.wrap}>
      {Icon && (
        <div className={styles.iconWrap}>
          <Icon size={28} />
        </div>
      )}
      <h3 className={styles.title}>{title}</h3>
      {message && <p className={styles.message}>{message}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm">{actionLabel}</Button>
      )}
    </div>
  )
}
