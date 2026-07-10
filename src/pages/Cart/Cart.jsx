import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FiTrash2, FiArrowLeft, FiShoppingBag, FiTag } from 'react-icons/fi'
import { useCart } from '../../contexts/CartContext.jsx'
import QuantityStepper from '../../components/QuantityStepper/QuantityStepper.jsx'
import Button from '../../components/Button/Button.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import styles from './Cart.module.css'

export default function Cart() {
  const { items, updateQuantity, removeItem, totals, couponCode, couponInfo, applyCoupon, removeCoupon } = useCart()
  const [couponInput, setCouponInput] = useState('')
  const navigate = useNavigate()

  const handleApplyCoupon = (e) => {
    e.preventDefault()
    if (!couponInput.trim()) return
    applyCoupon(couponInput)
    setCouponInput('')
  }

  if (items.length === 0) {
    return (
      <div className="container">
        <EmptyState
          icon={FiShoppingBag}
          title="Your cart is empty"
          message="Looks like you haven't added anything yet. Browse the menu to get started."
          actionLabel="Browse the shop"
          onAction={() => navigate('/shop')}
        />
      </div>
    )
  }

  return (
    <div className={`container ${styles.page}`}>
      <Link to="/shop" className={styles.back}>
        <FiArrowLeft /> Continue shopping
      </Link>
      <h1 className={styles.title}>Your cart</h1>

      <div className={styles.layout}>
        <div className={styles.items}>
          {items.map((item) => (
            <div key={item.key} className={styles.item}>
              <img src={item.image} alt={item.name} className={styles.itemImage} />
              <div className={styles.itemBody}>
                <div className={styles.itemHead}>
                  <div>
                    <h3>{item.name}</h3>
                    <span className={styles.itemMeta}>
                      {item.sizeLabel}
                      {item.extras.length > 0 && ` · ${item.extras.map((e) => e.name).join(', ')}`}
                    </span>
                    {item.notes && <span className={styles.itemNotes}>Note: {item.notes}</span>}
                  </div>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.key)}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <FiTrash2 />
                  </button>
                </div>
                <div className={styles.itemFooter}>
                  <QuantityStepper
                    value={item.quantity}
                    onChange={(q) => updateQuantity(item.key, q)}
                  />
                  <span className={styles.itemPrice}>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <aside className={styles.summary}>
          <h2>Order summary</h2>

          <form className={styles.couponForm} onSubmit={handleApplyCoupon}>
            <div className={styles.couponInput}>
              <FiTag />
              <input
                type="text"
                placeholder="Coupon code (try BREW10)"
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                disabled={!!couponCode}
              />
            </div>
            {couponCode ? (
              <Button type="button" variant="outline" size="sm" onClick={removeCoupon}>Remove</Button>
            ) : (
              <Button type="submit" variant="outline" size="sm">Apply</Button>
            )}
          </form>

          <div className={styles.rows}>
            <div className={styles.row}>
              <span>Subtotal</span>
              <span>${totals.subtotal.toFixed(2)}</span>
            </div>
            {totals.discount > 0 && (
              <div className={`${styles.row} ${styles.discountRow}`}>
                <span>Discount {couponInfo && `(${couponInfo.label})`}</span>
                <span>-${totals.discount.toFixed(2)}</span>
              </div>
            )}
            <div className={styles.row}>
              <span>Estimated tax</span>
              <span>${totals.tax.toFixed(2)}</span>
            </div>
            <div className={styles.row}>
              <span>Delivery fee</span>
              <span>{totals.delivery === 0 ? 'Free' : `$${totals.delivery.toFixed(2)}`}</span>
            </div>
            {totals.delivery > 0 && (
              <p className={styles.freeDeliveryNote}>
                Add ${(totals.freeDeliveryThreshold - totals.subtotal + totals.discount).toFixed(2)} more for free delivery
              </p>
            )}
          </div>

          <div className={styles.totalRow}>
            <span>Estimated total</span>
            <span>${totals.total.toFixed(2)}</span>
          </div>

          <Button fullWidth size="lg" onClick={() => navigate('/checkout')}>
            Checkout
          </Button>
        </aside>
      </div>
    </div>
  )
}
