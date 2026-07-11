import { useState } from 'react'
import { FiUser, FiX, FiTrash2, FiEdit3, FiCreditCard, FiSmartphone, FiDollarSign, FiLayers, FiShoppingBag } from 'react-icons/fi'
import customersData from '../../../data/customers.json'
import QuantityStepper from '../../../components/QuantityStepper/QuantityStepper.jsx'
import Button from '../../../components/Button/Button.jsx'
import EmptyState from '../../../components/EmptyState/EmptyState.jsx'
import styles from './POSOrderPanel.module.css'

const DISCOUNT_CHIPS = [0, 5, 10, 15]

export default function POSOrderPanel({
  order, totals, customer, onSetCustomer, discount, onSetDiscount,
  onUpdateQuantity, onUpdateNotes, onRemoveItem, onClearOrder, onPay,
}) {
  const [customerQuery, setCustomerQuery] = useState('')
  const [customerOpen, setCustomerOpen] = useState(false)
  const [notesOpenKey, setNotesOpenKey] = useState(null)

  const matches = customerQuery.trim()
    ? customersData.filter((c) => c.name.toLowerCase().includes(customerQuery.toLowerCase())).slice(0, 5)
    : []

  return (
    <aside className={styles.panel}>
      <div className={styles.customerRow}>
        {customer ? (
          <div className={styles.customerChip}>
            <FiUser size={14} />
            <span>{customer.name}</span>
            <button onClick={() => onSetCustomer(null)} aria-label="Remove customer"><FiX size={13} /></button>
          </div>
        ) : (
          <div className={styles.customerSearch}>
            <FiUser size={14} />
            <input
              placeholder="Walk-in customer — search to attach"
              value={customerQuery}
              onChange={(e) => { setCustomerQuery(e.target.value); setCustomerOpen(true) }}
              onFocus={() => setCustomerOpen(true)}
            />
            {customerOpen && matches.length > 0 && (
              <div className={styles.customerDropdown}>
                {matches.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => { onSetCustomer(c); setCustomerQuery(''); setCustomerOpen(false) }}
                  >
                    {c.name} <span>{c.email}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className={styles.orderList}>
        {order.length === 0 ? (
          <EmptyState icon={FiShoppingBag} title="No items yet" message="Tap a product to start the order." />
        ) : (
          order.map((item) => (
            <div key={item.key} className={styles.orderItem}>
              <img src={item.image} alt="" />
              <div className={styles.itemBody}>
                <div className={styles.itemHead}>
                  <div>
                    <strong>{item.name}</strong>
                    <span className={styles.itemMeta}>
                      {item.sizeLabel}
                      {item.extras.length > 0 && ` · ${item.extras.map((e) => e.name).join(', ')}`}
                    </span>
                  </div>
                  <button className={styles.removeBtn} onClick={() => onRemoveItem(item.key)} aria-label={`Remove ${item.name}`}>
                    <FiTrash2 size={14} />
                  </button>
                </div>

                {notesOpenKey === item.key ? (
                  <input
                    autoFocus
                    className={styles.notesInput}
                    placeholder="Add a note…"
                    value={item.notes}
                    onChange={(e) => onUpdateNotes(item.key, e.target.value)}
                    onBlur={() => setNotesOpenKey(null)}
                  />
                ) : (
                  <button className={styles.notesToggle} onClick={() => setNotesOpenKey(item.key)}>
                    <FiEdit3 size={11} /> {item.notes ? item.notes : 'Add note'}
                  </button>
                )}

                <div className={styles.itemFooter}>
                  <QuantityStepper size="sm" value={item.quantity} onChange={(q) => onUpdateQuantity(item.key, q)} />
                  <span className={styles.itemPrice}>${(item.unitPrice * item.quantity).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      <div className={styles.discountRow}>
        <span className={styles.discountLabel}>Discount</span>
        <div className={styles.chips}>
          {DISCOUNT_CHIPS.map((v) => (
            <button
              key={v}
              className={discount.type === 'percent' && discount.value === v ? styles.chipActive : styles.chip}
              onClick={() => onSetDiscount({ type: 'percent', value: v })}
            >
              {v === 0 ? 'None' : `${v}%`}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.summary}>
        <div><span>Subtotal</span><span>${totals.subtotal.toFixed(2)}</span></div>
        {totals.discountAmt > 0 && <div className={styles.discountLine}><span>Discount</span><span>-${totals.discountAmt.toFixed(2)}</span></div>}
        <div><span>Tax (8%)</span><span>${totals.tax.toFixed(2)}</span></div>
        <div className={styles.total}><span>Total</span><span>${totals.total.toFixed(2)}</span></div>
      </div>

      <div className={styles.payGrid}>
        <button className={styles.payBtn} disabled={order.length === 0} onClick={() => onPay('Cash')}>
          <FiDollarSign size={18} /> Cash
        </button>
        <button className={styles.payBtn} disabled={order.length === 0} onClick={() => onPay('Card')}>
          <FiCreditCard size={18} /> Card
        </button>
        <button className={styles.payBtn} disabled={order.length === 0} onClick={() => onPay('GCash')}>
          <FiSmartphone size={18} /> GCash
        </button>
        <button className={styles.payBtn} disabled={order.length === 0} onClick={() => onPay('Maya')}>
          <FiSmartphone size={18} /> Maya
        </button>
      </div>
      <button className={styles.splitBtn} disabled={order.length === 0} onClick={() => onPay('split')}>
        <FiLayers size={15} /> Split payment
      </button>

      {order.length > 0 && (
        <Button variant="ghost" size="sm" onClick={onClearOrder}>Clear order</Button>
      )}
    </aside>
  )
}
