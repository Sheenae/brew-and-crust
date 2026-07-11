import { useMemo, useState } from 'react'
import { FiSearch, FiEye } from 'react-icons/fi'
import ordersData from '../../data/orders.json'
import Modal from '../../components/Modal/Modal.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import StatusPill from '../../components/admin/StatusPill.jsx'
import Button from '../../components/Button/Button.jsx'
import tableStyles from '../../components/admin/AdminTable.module.css'

const PAGE_SIZE = 8
const STATUSES = ['all', 'processing', 'fulfilled', 'cancelled', 'refunded']

export default function AdminOrders() {
  const [orders, setOrders] = useState(ordersData)
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('all')
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState(null)

  const filtered = useMemo(() => {
    let list = orders
    if (status !== 'all') list = list.filter((o) => o.status === status)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((o) => o.id.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q))
    }
    return list
  }, [orders, status, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const updateStatus = (id, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)))
    setViewing((v) => (v && v.id === id ? { ...v, status: newStatus } : v))
  }

  return (
    <div className={tableStyles.panel}>
      <div className={tableStyles.panelHead}>
        <h2>Orders ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className={tableStyles.searchBox}>
            <FiSearch size={15} />
            <input
              placeholder="Search order ID or customer…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            />
          </div>
          <select
            className={tableStyles.select}
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1) }}
          >
            {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All statuses' : s}</option>)}
          </select>
        </div>
      </div>

      <div className={tableStyles.tableWrap}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Order</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Items</th>
              <th>Total</th>
              <th>Payment</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((o) => (
              <tr key={o.id}>
                <td className={tableStyles.mono}>{o.id}</td>
                <td className={tableStyles.strong}>{o.customer}</td>
                <td className={tableStyles.muted}>{new Date(o.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</td>
                <td className={tableStyles.muted}>{o.items}</td>
                <td className={tableStyles.strong}>${o.total.toFixed(2)}</td>
                <td className={tableStyles.muted}>{o.payment}</td>
                <td><StatusPill status={o.status} /></td>
                <td>
                  <button className={tableStyles.iconAction} onClick={() => setViewing(o)} aria-label={`View order ${o.id}`}>
                    <FiEye size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} />

      <Modal
        open={!!viewing}
        onClose={() => setViewing(null)}
        title={viewing ? `Order ${viewing.id}` : ''}
        footer={
          viewing && (
            <>
              <Button variant="outline" size="sm" onClick={() => updateStatus(viewing.id, 'processing')}>Mark processing</Button>
              <Button variant="sage" size="sm" onClick={() => updateStatus(viewing.id, 'fulfilled')}>Mark fulfilled</Button>
              <Button variant="outline" size="sm" onClick={() => updateStatus(viewing.id, 'refunded')}>Refund</Button>
            </>
          )
        }
      >
        {viewing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <strong>{viewing.customer}</strong>
                <p style={{ color: 'var(--color-espresso-soft)', fontSize: 13 }}>{viewing.email}</p>
              </div>
              <StatusPill status={viewing.status} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
              <div><span style={{ color: 'var(--color-espresso-soft)' }}>Date</span><br />{new Date(viewing.date).toLocaleString()}</div>
              <div><span style={{ color: 'var(--color-espresso-soft)' }}>Fulfillment</span><br />{viewing.fulfillment}</div>
              <div><span style={{ color: 'var(--color-espresso-soft)' }}>Payment</span><br />{viewing.payment}</div>
              <div><span style={{ color: 'var(--color-espresso-soft)' }}>Items</span><br />{viewing.items}</div>
            </div>
            <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>Total</span>
              <span>${viewing.total.toFixed(2)}</span>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
