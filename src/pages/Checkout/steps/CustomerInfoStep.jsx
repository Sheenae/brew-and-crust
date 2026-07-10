import styles from '../Checkout.module.css'

export default function CustomerInfoStep({ form }) {
  const { register, formState: { errors } } = form

  return (
    <div className={styles.stepCard}>
      <h2>Customer information</h2>
      <p className={styles.stepHint}>We'll use this to send order updates.</p>

      <div className={styles.field}>
        <label htmlFor="name">Full name</label>
        <input
          id="name"
          {...register('name', { required: 'Name is required' })}
          placeholder="Jamie Rivera"
        />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          {...register('email', {
            required: 'Email is required',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'Enter a valid email' },
          })}
          placeholder="jamie@example.com"
        />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <label htmlFor="phone">Phone</label>
        <input
          id="phone"
          type="tel"
          {...register('phone', {
            required: 'Phone number is required',
            minLength: { value: 7, message: 'Enter a valid phone number' },
          })}
          placeholder="09XX XXX XXXX"
        />
        {errors.phone && <span className={styles.error}>{errors.phone.message}</span>}
      </div>
    </div>
  )
}
