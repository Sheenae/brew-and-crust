import { FiCheckCircle, FiPrinter } from 'react-icons/fi'
import Modal from '../../../components/Modal/Modal.jsx'
import Button from '../../../components/Button/Button.jsx'
import { useToast } from '../../../contexts/ToastContext.jsx'
import styles from './POSReceiptModal.module.css'

export default function POSReceiptModal({ receipt, onNewOrder }) {
  const { showToast } = useToast()

  const handlePrint = () => {
    showToast('Receipt sent to printer', 'success')
  }

  return (
    <Modal
      open
      onClose={onNewOrder}
      title="Payment complete"
      width={420}
      footer={
        <>
          <Button variant="outline" icon={FiPrinter} onClick={handlePrint}>Print receipt</Button>
          <Button onClick={onNewOrder}>New order</Button>
        </>
      }
    >
      <div className={styles.confirmed}>
        <FiCheckCircle size={32} />
        <span>Payment approved</span>
      </div>

      <div className={styles.receipt}>
        <div className={styles.receiptHead}>
          <strong>Brew &amp; Crust</strong>
          <span>128 Roastery Lane</span>
          <span>{receipt.time.toLocaleString()}</span>
          <span className={styles.receiptId}>{receipt.id}</span>
        </div>

        {receipt.customer && (
          <div className={styles.receiptCustomer}>Customer: {receipt.customer.name}</div>
        )}

        <div className={styles.receiptItems}>
          {receipt.items.map((it) => (
            <div key={it.key} className={styles.receiptLine}>
              <span>{it.quantity}× {it.name} ({it.sizeLabel})</span>
              <span>${(it.unitPrice * it.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className={styles.receiptTotals}>
          <div><span>Subtotal</span><span>${receipt.totals.subtotal.toFixed(2)}</span></div>
          {receipt.totals.discountAmt > 0 && <div><span>Discount</span><span>-${receipt.totals.discountAmt.toFixed(2)}</span></div>}
          <div><span>Tax</span><span>${receipt.totals.tax.toFixed(2)}</span></div>
          <div className={styles.receiptTotal}><span>Total</span><span>${receipt.totals.total.toFixed(2)}</span></div>
        </div>

        <div className={styles.receiptPayment}>
          {receipt.payment.map((p, i) => (
            <div key={i}><span>{p.method}</span><span>${p.amount.toFixed(2)}</span></div>
          ))}
        </div>

        <p className={styles.thanks}>Thank you for visiting Brew &amp; Crust!</p>
      </div>
    </Modal>
  )
}
