import { useState } from 'react'
import Modal from '../../../components/Modal/Modal.jsx'
import Button from '../../../components/Button/Button.jsx'
import styles from './POSSplitPaymentModal.module.css'

const METHODS = ['Cash', 'Card', 'GCash', 'Maya']

export default function POSSplitPaymentModal({ total, onClose, onConfirm }) {
  const [rows, setRows] = useState([
    { method: 'Cash', amount: (total / 2).toFixed(2) },
    { method: 'Card', amount: (total / 2).toFixed(2) },
  ])

  const sum = rows.reduce((s, r) => s + (Number(r.amount) || 0), 0)
  const remaining = total - sum
  const balanced = Math.abs(remaining) < 0.01

  const updateRow = (i, field, value) => {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, [field]: value } : r)))
  }

  const addRow = () => setRows((prev) => [...prev, { method: 'Cash', amount: '0.00' }])
  const removeRow = (i) => setRows((prev) => prev.filter((_, idx) => idx !== i))

  return (
    <Modal
      open
      onClose={onClose}
      title="Split payment"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button disabled={!balanced} onClick={() => onConfirm(rows.map((r) => ({ method: r.method, amount: Number(r.amount) })))}>
            Confirm payment
          </Button>
        </>
      }
    >
      <div className={styles.wrap}>
        <p className={styles.total}>Total due: <strong>${total.toFixed(2)}</strong></p>

        {rows.map((r, i) => (
          <div key={i} className={styles.row}>
            <select value={r.method} onChange={(e) => updateRow(i, 'method', e.target.value)}>
              {METHODS.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <input
              type="number"
              step="0.01"
              value={r.amount}
              onChange={(e) => updateRow(i, 'amount', e.target.value)}
            />
            {rows.length > 2 && (
              <button type="button" onClick={() => removeRow(i)} aria-label="Remove payment row">×</button>
            )}
          </div>
        ))}

        <button type="button" className={styles.addRow} onClick={addRow}>+ Add another method</button>

        <p className={balanced ? styles.balanced : styles.unbalanced}>
          {balanced ? 'Amounts match the total.' : `${remaining > 0 ? 'Remaining' : 'Over by'}: $${Math.abs(remaining).toFixed(2)}`}
        </p>
      </div>
    </Modal>
  )
}
