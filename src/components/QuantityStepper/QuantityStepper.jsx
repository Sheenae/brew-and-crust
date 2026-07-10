import { FiMinus, FiPlus } from 'react-icons/fi'
import styles from './QuantityStepper.module.css'

export default function QuantityStepper({ value, onChange, min = 1, max = 20, size = 'md' }) {
  return (
    <div className={`${styles.stepper} ${styles[size]}`}>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label="Decrease quantity"
      >
        <FiMinus />
      </button>
      <span aria-live="polite">{value}</span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label="Increase quantity"
      >
        <FiPlus />
      </button>
    </div>
  )
}
