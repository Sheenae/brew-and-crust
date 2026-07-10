import { FiCreditCard, FiSmartphone, FiDollarSign } from 'react-icons/fi'
import styles from '../Checkout.module.css'

const METHODS = [
  { id: 'card', label: 'Credit Card', icon: FiCreditCard },
  { id: 'gcash', label: 'GCash', icon: FiSmartphone },
  { id: 'maya', label: 'Maya', icon: FiSmartphone },
  { id: 'cash', label: 'Cash', icon: FiDollarSign },
]

export default function PaymentStep({ form }) {
  const { register, watch, formState: { errors } } = form
  const payment = watch('payment')

  return (
    <div className={styles.stepCard}>
      <h2>Payment</h2>
      <p className={styles.stepHint}>This is a simulated checkout — no real payment is processed.</p>

      <div className={styles.paymentGrid}>
        {METHODS.map((m) => {
          const Icon = m.icon
          const active = payment === m.id
          return (
            <label key={m.id} className={`${styles.paymentCard} ${active ? styles.paymentCardActive : ''}`}>
              <input type="radio" value={m.id} {...register('payment')} />
              <Icon size={20} />
              <span>{m.label}</span>
            </label>
          )
        })}
      </div>

      {payment === 'card' && (
        <div className={styles.cardFields}>
          <div className={styles.field}>
            <label htmlFor="cardNumber">Card number</label>
            <input
              id="cardNumber"
              {...register('cardNumber', {
                required: 'Card number is required',
                minLength: { value: 12, message: 'Enter a valid card number' },
              })}
              placeholder="4242 4242 4242 4242"
              inputMode="numeric"
            />
            {errors.cardNumber && <span className={styles.error}>{errors.cardNumber.message}</span>}
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="cardExpiry">Expiry</label>
              <input
                id="cardExpiry"
                {...register('cardExpiry', { required: 'Expiry is required' })}
                placeholder="MM/YY"
              />
              {errors.cardExpiry && <span className={styles.error}>{errors.cardExpiry.message}</span>}
            </div>
            <div className={styles.field}>
              <label htmlFor="cardCvc">CVC</label>
              <input
                id="cardCvc"
                {...register('cardCvc', { required: 'CVC is required' })}
                placeholder="123"
                inputMode="numeric"
              />
              {errors.cardCvc && <span className={styles.error}>{errors.cardCvc.message}</span>}
            </div>
          </div>
        </div>
      )}

      {(payment === 'gcash' || payment === 'maya') && (
        <p className={styles.walletNote}>You'll be redirected to {payment === 'gcash' ? 'GCash' : 'Maya'} to confirm payment. (Simulated)</p>
      )}
      {payment === 'cash' && (
        <p className={styles.walletNote}>Pay with cash on pickup or delivery.</p>
      )}
    </div>
  )
}
