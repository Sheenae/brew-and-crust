import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowLeft, FiClock } from 'react-icons/fi'
import products from '../../data/products.json'
import categories from '../../data/categories.json'
import POSProductGrid from './components/POSProductGrid.jsx'
import POSOrderPanel from './components/POSOrderPanel.jsx'
import POSCustomizeModal from './components/POSCustomizeModal.jsx'
import POSReceiptModal from './components/POSReceiptModal.jsx'
import POSSplitPaymentModal from './components/POSSplitPaymentModal.jsx'
import styles from './POS.module.css'

const TAX_RATE = 0.08

function lineKey(productId, sizeId, extraIds = []) {
  return [productId, sizeId, [...extraIds].sort().join('+')].join('::')
}

export default function POS() {
  const [category, setCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState([])
  const [customizing, setCustomizing] = useState(null)
  const [customer, setCustomer] = useState(null)
  const [discount, setDiscount] = useState({ type: 'percent', value: 0 })
  const [splitOpen, setSplitOpen] = useState(false)
  const [receipt, setReceipt] = useState(null)

  const filteredProducts = useMemo(() => {
    let list = products
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [category, query])

  const isSimple = (product) => product.sizes.length === 1 && !product.extrasEligible

  const addSimple = (product) => {
    const size = product.sizes[0]
    const key = lineKey(product.id, size.id, [])
    setOrder((prev) => {
      const existing = prev.find((it) => it.key === key)
      if (existing) return prev.map((it) => (it.key === key ? { ...it, quantity: it.quantity + 1 } : it))
      return [
        ...prev,
        {
          key, productId: product.id, name: product.name, image: product.image,
          sizeId: size.id, sizeLabel: size.label, extras: [], notes: '',
          unitPrice: product.price + (size.priceDelta || 0), quantity: 1,
        },
      ]
    })
  }

  const handleTapProduct = (product) => {
    if (isSimple(product)) addSimple(product)
    else setCustomizing(product)
  }

  const addCustomized = (product, { sizeId, sizeLabel, priceDelta, extras, quantity, notes }) => {
    const key = lineKey(product.id, sizeId, extras.map((e) => e.id))
    setOrder((prev) => {
      const existing = prev.find((it) => it.key === key)
      if (existing) return prev.map((it) => (it.key === key ? { ...it, quantity: it.quantity + quantity } : it))
      const unitPrice = product.price + priceDelta + extras.reduce((s, e) => s + e.price, 0)
      return [
        ...prev,
        { key, productId: product.id, name: product.name, image: product.image, sizeId, sizeLabel, extras, notes, unitPrice, quantity },
      ]
    })
    setCustomizing(null)
  }

  const updateQuantity = (key, quantity) => {
    if (quantity < 1) {
      setOrder((prev) => prev.filter((it) => it.key !== key))
      return
    }
    setOrder((prev) => prev.map((it) => (it.key === key ? { ...it, quantity } : it)))
  }

  const updateNotes = (key, notes) => {
    setOrder((prev) => prev.map((it) => (it.key === key ? { ...it, notes } : it)))
  }

  const removeItem = (key) => setOrder((prev) => prev.filter((it) => it.key !== key))
  const clearOrder = () => { setOrder([]); setDiscount({ type: 'percent', value: 0 }); setCustomer(null) }

  const totals = useMemo(() => {
    const subtotal = order.reduce((s, it) => s + it.unitPrice * it.quantity, 0)
    const discountAmt = discount.type === 'percent'
      ? subtotal * (discount.value / 100)
      : Math.min(discount.value, subtotal)
    const discounted = Math.max(subtotal - discountAmt, 0)
    const tax = discounted * TAX_RATE
    const total = discounted + tax
    const itemCount = order.reduce((s, it) => s + it.quantity, 0)
    return { subtotal, discountAmt, tax, total, itemCount }
  }, [order, discount])

  const finalizeOrder = (paymentDetails) => {
    const id = `POS-${Math.floor(100000 + Math.random() * 900000)}`
    setReceipt({
      id,
      time: new Date(),
      customer,
      items: order,
      totals,
      payment: paymentDetails,
    })
    setSplitOpen(false)
  }

  const handlePay = (method) => {
    if (order.length === 0) return
    if (method === 'split') { setSplitOpen(true); return }
    finalizeOrder([{ method, amount: totals.total }])
  }

  const handleNewOrder = () => {
    clearOrder()
    setReceipt(null)
  }

  return (
    <div className={styles.shell}>
      <header className={styles.topbar}>
        <Link to="/admin" className={styles.back}><FiArrowLeft /> Exit POS</Link>
        <span className={styles.title}>Brew &amp; Crust — Point of Sale</span>
        <span className={styles.clock}>
          <FiClock size={14} />
          {new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
        </span>
      </header>

      <div className={styles.body}>
        <POSProductGrid
          categories={categories}
          category={category}
          onCategoryChange={setCategory}
          query={query}
          onQueryChange={setQuery}
          products={filteredProducts}
          onTapProduct={handleTapProduct}
        />
        <POSOrderPanel
          order={order}
          totals={totals}
          customer={customer}
          onSetCustomer={setCustomer}
          discount={discount}
          onSetDiscount={setDiscount}
          onUpdateQuantity={updateQuantity}
          onUpdateNotes={updateNotes}
          onRemoveItem={removeItem}
          onClearOrder={clearOrder}
          onPay={handlePay}
        />
      </div>

      {customizing && (
        <POSCustomizeModal
          product={customizing}
          onClose={() => setCustomizing(null)}
          onAdd={addCustomized}
        />
      )}

      {splitOpen && (
        <POSSplitPaymentModal
          total={totals.total}
          onClose={() => setSplitOpen(false)}
          onConfirm={(payments) => finalizeOrder(payments)}
        />
      )}

      {receipt && (
        <POSReceiptModal receipt={receipt} onNewOrder={handleNewOrder} />
      )}
    </div>
  )
}
