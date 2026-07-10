import { motion } from 'framer-motion'
import { FiCheckCircle, FiInfo, FiAlertCircle, FiX } from 'react-icons/fi'
import styles from './Toast.module.css'

const ICONS = {
  success: FiCheckCircle,
  info: FiInfo,
  error: FiAlertCircle,
}

export default function Toast({ message, type = 'info', onDismiss }) {
  const Icon = ICONS[type] || FiInfo
  return (
    <motion.div
      role="status"
      className={`${styles.toast} ${styles[type]}`}
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 16, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      <Icon size={18} />
      <span>{message}</span>
      <button className={styles.close} onClick={onDismiss} aria-label="Dismiss notification">
        <FiX size={16} />
      </button>
    </motion.div>
  )
}
