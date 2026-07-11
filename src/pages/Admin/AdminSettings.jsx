import { useState } from 'react'
import Button from '../../components/Button/Button.jsx'
import { useToast } from '../../contexts/ToastContext.jsx'
import tableStyles from '../../components/admin/AdminTable.module.css'
import styles from './AdminSettings.module.css'

export default function AdminSettings() {
  const { showToast } = useToast()
  const [store, setStore] = useState({
    name: 'Brew & Crust',
    email: 'admin@brewandcrust.co',
    phone: '(02) 8123 4567',
    address: '128 Roastery Lane',
    currency: 'USD',
    taxRate: '8',
  })
  const [notifPrefs, setNotifPrefs] = useState({ orders: true, lowStock: true, marketing: false })

  const handleSave = (e) => {
    e.preventDefault()
    showToast('Settings saved', 'success')
  }

  return (
    <div className={styles.page}>
      <form onSubmit={handleSave} className={tableStyles.panel}>
        <div className={tableStyles.panelHead}><h2>Store information</h2></div>
        <div className={styles.formGrid}>
          <label className={styles.field}>
            Store name
            <input value={store.name} onChange={(e) => setStore((s) => ({ ...s, name: e.target.value }))} />
          </label>
          <label className={styles.field}>
            Support email
            <input type="email" value={store.email} onChange={(e) => setStore((s) => ({ ...s, email: e.target.value }))} />
          </label>
          <label className={styles.field}>
            Phone
            <input value={store.phone} onChange={(e) => setStore((s) => ({ ...s, phone: e.target.value }))} />
          </label>
          <label className={styles.field}>
            Address
            <input value={store.address} onChange={(e) => setStore((s) => ({ ...s, address: e.target.value }))} />
          </label>
          <label className={styles.field}>
            Currency
            <select value={store.currency} onChange={(e) => setStore((s) => ({ ...s, currency: e.target.value }))}>
              <option value="USD">USD ($)</option>
              <option value="PHP">PHP (₱)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </label>
          <label className={styles.field}>
            Tax rate (%)
            <input type="number" value={store.taxRate} onChange={(e) => setStore((s) => ({ ...s, taxRate: e.target.value }))} />
          </label>
        </div>
        <div className={styles.formFooter}>
          <Button type="submit">Save changes</Button>
        </div>
      </form>

      <div className={tableStyles.panel}>
        <div className={tableStyles.panelHead}><h2>Notification preferences</h2></div>
        <div className={styles.toggleList}>
          {[
            { key: 'orders', label: 'New order alerts', desc: 'Get notified whenever a new order is placed.' },
            { key: 'lowStock', label: 'Low stock alerts', desc: 'Get notified when items drop below reorder level.' },
            { key: 'marketing', label: 'Marketing performance', desc: 'Weekly summary of promo and newsletter performance.' },
          ].map((item) => (
            <label key={item.key} className={styles.toggleRow}>
              <div>
                <strong>{item.label}</strong>
                <span>{item.desc}</span>
              </div>
              <input
                type="checkbox"
                checked={notifPrefs[item.key]}
                onChange={(e) => setNotifPrefs((p) => ({ ...p, [item.key]: e.target.checked }))}
              />
            </label>
          ))}
        </div>
      </div>
    </div>
  )
}
