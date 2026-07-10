import { FiCoffee, FiTruck } from 'react-icons/fi'
import styles from '../Checkout.module.css'

export default function DeliveryStep({ form }) {
  const { register, watch, formState: { errors } } = form
  const fulfillment = watch('fulfillment')

  return (
    <div className={styles.stepCard}>
      <h2>Delivery</h2>
      <p className={styles.stepHint}>How should we get your order to you?</p>

      <div className={styles.optionCards}>
        <label className={`${styles.optionCard} ${fulfillment === 'pickup' ? styles.optionCardActive : ''}`}>
          <input type="radio" value="pickup" {...register('fulfillment')} />
          <FiCoffee size={20} />
          <div>
            <strong>Pickup</strong>
            <span>Ready in 15–20 min · 128 Roastery Lane</span>
          </div>
        </label>
        <label className={`${styles.optionCard} ${fulfillment === 'delivery' ? styles.optionCardActive : ''}`}>
          <input type="radio" value="delivery" {...register('fulfillment')} />
          <FiTruck size={20} />
          <div>
            <strong>Delivery</strong>
            <span>Arrives in 30–45 min</span>
          </div>
        </label>
      </div>

      {fulfillment === 'delivery' && (
        <>
          <div className={styles.field}>
            <label htmlFor="address">Delivery address</label>
            <input
              id="address"
              {...register('address', { required: 'Address is required for delivery' })}
              placeholder="123 Main Street, Apt 4B"
            />
            {errors.address && <span className={styles.error}>{errors.address.message}</span>}
          </div>
          <div className={styles.fieldRow}>
            <div className={styles.field}>
              <label htmlFor="city">City</label>
              <input
                id="city"
                {...register('city', { required: 'City is required' })}
                placeholder="Quezon City"
              />
              {errors.city && <span className={styles.error}>{errors.city.message}</span>}
            </div>
            <div className={styles.field}>
              <label htmlFor="zip">ZIP / Postal code</label>
              <input
                id="zip"
                {...register('zip', { required: 'ZIP code is required' })}
                placeholder="1100"
              />
              {errors.zip && <span className={styles.error}>{errors.zip.message}</span>}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
