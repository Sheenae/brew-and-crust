import { motion } from 'framer-motion'
import { FiCheckCircle } from 'react-icons/fi'
import Button from '../../../components/Button/Button.jsx'
import styles from '../Checkout.module.css'

export default function SuccessScreen({ orderId, onContinue }) {
  return (
    <div className={`container ${styles.successPage}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className={styles.successCard}
      >
        <div className={styles.successIcon}>
          <FiCheckCircle size={40} />
        </div>
        <span className="stamp" style={{ color: 'var(--color-sage-dark)' }}>Order confirmed</span>
        <h1>Thanks — your order is in!</h1>
        <p>Order <strong>{orderId}</strong> has been placed. We'll text you when it's ready.</p>
        <Button size="lg" onClick={onContinue}>Continue shopping</Button>
      </motion.div>
    </div>
  )
}
