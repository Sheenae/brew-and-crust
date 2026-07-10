import styles from './Badge.module.css'

/**
 * variant "stamp" renders the signature ink-stamp mark (used for
 * bestseller/new/fresh callouts). Other variants are plain pill tags.
 */
export default function Badge({ children, variant = 'default', tone = 'copper' }) {
  if (variant === 'stamp') {
    return <span className={`stamp ${styles.stampTone} ${styles[tone]}`}>{children}</span>
  }
  return <span className={`${styles.badge} ${styles[tone]}`}>{children}</span>
}
