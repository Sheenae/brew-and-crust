import { useState } from 'react'
import { FiCheck } from 'react-icons/fi'
import extrasData from '../../../data/extras.json'
import Modal from '../../../components/Modal/Modal.jsx'
import Button from '../../../components/Button/Button.jsx'
import QuantityStepper from '../../../components/QuantityStepper/QuantityStepper.jsx'
import styles from './POSCustomizeModal.module.css'

export default function POSCustomizeModal({ product, onClose, onAdd }) {
  const [sizeId, setSizeId] = useState(product.sizes[0].id)
  const [extras, setExtras] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')

  const size = product.sizes.find((s) => s.id === sizeId) || product.sizes[0]
  const unitPrice = product.price + (size.priceDelta || 0) + extras.reduce((s, e) => s + e.price, 0)

  const toggleExtra = (extra) => {
    setExtras((prev) => (prev.some((e) => e.id === extra.id) ? prev.filter((e) => e.id !== extra.id) : [...prev, extra]))
  }

  const handleAdd = () => {
    onAdd(product, { sizeId: size.id, sizeLabel: size.label, priceDelta: size.priceDelta || 0, extras, quantity, notes })
  }

  return (
    <Modal
      open
      onClose={onClose}
      title={product.name}
      width={480}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={handleAdd}>Add — ${(unitPrice * quantity).toFixed(2)}</Button>
        </>
      }
    >
      <div className={styles.wrap}>
        {product.sizes.length > 1 && (
          <div className={styles.group}>
            <span className={styles.label}>Size</span>
            <div className={styles.pillRow}>
              {product.sizes.map((s) => (
                <button
                  key={s.id}
                  className={sizeId === s.id ? styles.pillActive : styles.pill}
                  onClick={() => setSizeId(s.id)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {product.extrasEligible && (
          <div className={styles.group}>
            <span className={styles.label}>Extras</span>
            <div className={styles.pillRow}>
              {extrasData.map((extra) => {
                const active = extras.some((e) => e.id === extra.id)
                return (
                  <button key={extra.id} className={active ? styles.pillActive : styles.pill} onClick={() => toggleExtra(extra)}>
                    {active && <FiCheck size={12} />} {extra.name}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        <div className={styles.group}>
          <span className={styles.label}>Notes</span>
          <textarea
            className={styles.notes}
            rows={2}
            placeholder="e.g. extra hot, light ice…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className={styles.qtyRow}>
          <span className={styles.label}>Quantity</span>
          <QuantityStepper value={quantity} onChange={setQuantity} size="lg" />
        </div>
      </div>
    </Modal>
  )
}
