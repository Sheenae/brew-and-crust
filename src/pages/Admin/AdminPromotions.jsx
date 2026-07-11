import { useState } from 'react'
import { FiPlus, FiTrash2 } from 'react-icons/fi'
import promotionsData from '../../data/promotions.json'
import Button from '../../components/Button/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import StatusPill from '../../components/admin/StatusPill.jsx'
import tableStyles from '../../components/admin/AdminTable.module.css'

export default function AdminPromotions() {
  const [promotions, setPromotions] = useState(promotionsData)
  const [modalOpen, setModalOpen] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'Percentage', value: '', limit: '' })

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.code.trim() || !form.value) return
    setPromotions((prev) => [
      {
        id: `promo${Date.now()}`,
        code: form.code.toUpperCase(),
        type: form.type,
        value: form.type === 'Percentage' ? `${form.value}%` : `$${form.value}`,
        usage: 0,
        limit: Number(form.limit) || 100,
        status: 'active',
        expires: '2026-12-31',
      },
      ...prev,
    ])
    setForm({ code: '', type: 'Percentage', value: '', limit: '' })
    setModalOpen(false)
  }

  const handleDelete = (id) => setPromotions((prev) => prev.filter((p) => p.id !== id))

  return (
    <div className={tableStyles.panel}>
      <div className={tableStyles.panelHead}>
        <h2>Promotions ({promotions.length})</h2>
        <Button size="sm" icon={FiPlus} onClick={() => setModalOpen(true)}>New promotion</Button>
      </div>

      <div className={tableStyles.tableWrap}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Code</th>
              <th>Type</th>
              <th>Value</th>
              <th>Usage</th>
              <th>Expires</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {promotions.map((p) => (
              <tr key={p.id}>
                <td className={`${tableStyles.mono} ${tableStyles.strong}`}>{p.code}</td>
                <td className={tableStyles.muted}>{p.type}</td>
                <td className={tableStyles.strong}>{p.value}</td>
                <td className={tableStyles.muted}>{p.usage} / {p.limit}</td>
                <td className={tableStyles.muted}>{p.expires}</td>
                <td><StatusPill status={p.status} /></td>
                <td>
                  <button className={tableStyles.iconAction} onClick={() => handleDelete(p.id)} aria-label={`Delete ${p.code}`}>
                    <FiTrash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="New promotion"
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Create promotion</Button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
            Promo code
            <input
              value={form.code}
              onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
              placeholder="e.g. FALL20"
              style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--color-line)', background: 'var(--color-parchment)' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
            Discount type
            <select
              value={form.type}
              onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--color-line)', background: 'var(--color-parchment)' }}
            >
              <option>Percentage</option>
              <option>Fixed amount</option>
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
            {form.type === 'Percentage' ? 'Percent off' : 'Amount off ($)'}
            <input
              type="number"
              value={form.value}
              onChange={(e) => setForm((f) => ({ ...f, value: e.target.value }))}
              placeholder={form.type === 'Percentage' ? '10' : '5'}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--color-line)', background: 'var(--color-parchment)' }}
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
            Usage limit
            <input
              type="number"
              value={form.limit}
              onChange={(e) => setForm((f) => ({ ...f, limit: e.target.value }))}
              placeholder="500"
              style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--color-line)', background: 'var(--color-parchment)' }}
            />
          </label>
        </form>
      </Modal>
    </div>
  )
}
