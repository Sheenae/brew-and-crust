import { useCart } from '../../../contexts/CartContext.jsx'
import Button from '../../../components/Button/Button.jsx'
import styles from '../Checkout.module.css'

const PAYMENT_LABELS = { card: 'Credit Card', gcash: 'GCash', maya: 'Maya', cash: 'Cash' }

export default function ReviewStep({ form, onPlaceOrder }) {
  const { items, totals } = useCart()
  const values = form.getValues()

  return (
    <div className={styles.stepCard}>
      <h2>Review your order</h2>
      <p className={styles.stepHint}>Double check everything before you place your order.</p>

      <div className={styles.reviewBlock}>
        <h3>Customer</h3>
        <p>{values.name} · {values.email} · {values.phone}</p>
      </div>

      <div className={styles.reviewBlock}>
        <h3>Fulfillment</h3>
        <p>
          {values.fulfillment === 'pickup'
            ? 'Pickup at 128 Roastery Lane'
            : `Delivery to ${values.address}, ${values.city} ${values.zip}`}
        </p>
      </div>

      <div className={styles.reviewBlock}>
        <h3>Payment</h3>
        <p>{PAYMENT_LABELS[values.payment]}{values.payment === 'card' && values.cardNumber ? ` ending in ${values.cardNumber.slice(-4)}` : ''}</p>
      </div>

      <div className={styles.reviewBlock}>
        <h3>Items</h3>
        <ul className={styles.reviewItems}>
          {items.map((it) => (
            <li key={it.key}>
              <span>{it.quantity}× {it.name} ({it.sizeLabel})</span>
              <span>${(it.unitPrice * it.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <Button size="lg" fullWidth onClick={onPlaceOrder}>
        Place order — ${totals.total.toFixed(2)}
      </Button>
    </div>
  )
}
