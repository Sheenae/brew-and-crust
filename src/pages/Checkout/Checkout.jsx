import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheck } from 'react-icons/fi'
import { useCart } from '../../contexts/CartContext.jsx'
import CustomerInfoStep from './steps/CustomerInfoStep.jsx'
import DeliveryStep from './steps/DeliveryStep.jsx'
import PaymentStep from './steps/PaymentStep.jsx'
import ReviewStep from './steps/ReviewStep.jsx'
import SuccessScreen from './steps/SuccessScreen.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { FiShoppingBag } from 'react-icons/fi'
import styles from './Checkout.module.css'

const STEPS = ['Customer Info', 'Delivery', 'Payment', 'Review']

export default function Checkout() {
  const { items, totals, clearCart } = useCart()
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [orderId, setOrderId] = useState(null)

  const form = useForm({
    mode: 'onTouched',
    defaultValues: {
      name: '', email: '', phone: '',
      fulfillment: 'pickup',
      address: '', city: '', zip: '',
      payment: 'card',
      cardNumber: '', cardExpiry: '', cardCvc: '',
    },
  })

  const stepFields = [
    ['name', 'email', 'phone'],
    ['fulfillment', 'address', 'city', 'zip'],
    ['payment', 'cardNumber', 'cardExpiry', 'cardCvc'],
    [],
  ]

  const goNext = async () => {
    const fields = stepFields[stepIndex]
    const valid = fields.length === 0 || (await form.trigger(fields))
    if (!valid) return
    if (stepIndex < STEPS.length - 1) setStepIndex((i) => i + 1)
  }

  const goBack = () => setStepIndex((i) => Math.max(0, i - 1))

  const placeOrder = () => {
    const id = `BC-${Math.floor(100000 + Math.random() * 900000)}`
    setOrderId(id)
    clearCart()
  }

  if (orderId) {
    return <SuccessScreen orderId={orderId} onContinue={() => navigate('/shop')} />
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <EmptyState
          icon={FiShoppingBag}
          title="Your cart is empty"
          message="Add something from the menu before checking out."
          actionLabel="Browse the shop"
          onAction={() => navigate('/shop')}
        />
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <h1 className={styles.title}>Checkout</h1>

      <ol className={styles.stepper}>
        {STEPS.map((label, i) => (
          <li key={label} className={i <= stepIndex ? styles.stepDone : ''}>
            <span className={styles.stepDot}>
              {i < stepIndex ? <FiCheck size={13} /> : i + 1}
            </span>
            <span className={styles.stepLabel}>{label}</span>
          </li>
        ))}
      </ol>

      <div className={styles.layout}>
        <div className={styles.formPanel}>
          <AnimatePresence mode="wait">
            <motion.div
              key={stepIndex}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.2 }}
            >
              {stepIndex === 0 && <CustomerInfoStep form={form} />}
              {stepIndex === 1 && <DeliveryStep form={form} />}
              {stepIndex === 2 && <PaymentStep form={form} />}
              {stepIndex === 3 && <ReviewStep form={form} onPlaceOrder={placeOrder} />}
            </motion.div>
          </AnimatePresence>

          <div className={styles.nav}>
            {stepIndex > 0 && (
              <button type="button" className={styles.backBtn} onClick={goBack}>Back</button>
            )}
            {stepIndex < STEPS.length - 1 && (
              <button type="button" className={styles.nextBtn} onClick={goNext}>
                Continue
              </button>
            )}
          </div>
        </div>

        <aside className={styles.summary}>
          <h2>Order summary</h2>
          <ul className={styles.summaryItems}>
            {items.map((it) => (
              <li key={it.key}>
                <span>{it.quantity}× {it.name}</span>
                <span>${(it.unitPrice * it.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
          <div className={styles.summaryRows}>
            <div><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
            {totals.discount > 0 && <div><span>Discount</span><span>-${totals.discount.toFixed(2)}</span></div>}
            <div><span>Tax</span><span>${totals.tax.toFixed(2)}</span></div>
            <div><span>Delivery</span><span>{totals.delivery === 0 ? 'Free' : `$${totals.delivery.toFixed(2)}`}</span></div>
          </div>
          <div className={styles.summaryTotal}>
            <span>Total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
