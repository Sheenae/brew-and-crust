import { useMemo, useState } from 'react'
import { FiSearch, FiMail, FiPhone } from 'react-icons/fi'
import customersData from '../../data/customers.json'
import ordersData from '../../data/orders.json'
import Modal from '../../components/Modal/Modal.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import StatusPill from '../../components/admin/StatusPill.jsx'
import tableStyles from '../../components/admin/AdminTable.module.css'

const PAGE_SIZE = 8
const SEGMENTS = ['all', 'VIP', 'Regular', 'New']

function initials(name) {
  return name.split(' ').map((n) => n[0]).join('')
}

export default function AdminCustomers() {
  const [query, setQuery] = useState('')
  const [segment, setSegment] = useState('all')
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState(null)

  const filtered = useMemo(() => {
    let list = customersData
    if (segment !== 'all') list = list.filter((c) => c.segment === segment)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((c) => c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    }
    return list
  }, [segment, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const customerOrders = viewing ? ordersData.filter((o) => o.customer === viewing.name) : []

  return (
    <div className={tableStyles.panel}>
      <div className={tableStyles.panelHead}>
        <h2>Customers ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className={tableStyles.searchBox}>
            <FiSearch size={15} />
            <input
              placeholder="Search name or email…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            />
          </div>
          <select
            className={tableStyles.select}
            value={segment}
            onChange={(e) => { setSegment(e.target.value); setPage(1) }}
          >
            {SEGMENTS.map((s) => <option key={s} value={s}>{s === 'all' ? 'All segments' : s}</option>)}
          </select>
        </div>
      </div>

      <div className={tableStyles.tableWrap}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Customer</th>
              <th>Joined</th>
              <th>Orders</th>
              <th>Total spent</th>
              <th>Last order</th>
              <th>Segment</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((c) => (
              <tr key={c.id} onClick={() => setViewing(c)} style={{ cursor: 'pointer' }}>
                <td>
                  <div className={tableStyles.avatarName}>
                    <span className={tableStyles.avatar}>{initials(c.name)}</span>
                    <div>
                      <div className={tableStyles.strong}>{c.name}</div>
                      <div className={tableStyles.muted} style={{ fontSize: 12 }}>{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className={tableStyles.muted}>{c.joined}</td>
                <td className={tableStyles.muted}>{c.orders}</td>
                <td className={tableStyles.strong}>${c.totalSpent.toFixed(2)}</td>
                <td className={tableStyles.muted}>{c.lastOrder}</td>
                <td><StatusPill status={c.segment === 'VIP' ? 'active' : c.segment === 'New' ? 'scheduled' : 'in stock'} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} />

      <Modal open={!!viewing} onClose={() => setViewing(null)} title={viewing?.name}>
        {viewing && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
            <div style={{ display: 'flex', gap: 20, fontSize: 13, color: 'var(--color-espresso-soft)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiMail size={14} /> {viewing.email}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><FiPhone size={14} /> {viewing.phone}</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              <div style={{ background: 'var(--color-parchment)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{viewing.orders}</div>
                <div style={{ fontSize: 12, color: 'var(--color-espresso-soft)' }}>Orders</div>
              </div>
              <div style={{ background: 'var(--color-parchment)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>${viewing.totalSpent.toFixed(0)}</div>
                <div style={{ fontSize: 12, color: 'var(--color-espresso-soft)' }}>Spent</div>
              </div>
              <div style={{ background: 'var(--color-parchment)', borderRadius: 10, padding: 14, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: 22 }}>{viewing.segment}</div>
                <div style={{ fontSize: 12, color: 'var(--color-espresso-soft)' }}>Segment</div>
              </div>
            </div>
            <div>
              <h3 style={{ fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--color-espresso-soft)', marginBottom: 10 }}>
                Order history
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {customerOrders.length === 0 && <p style={{ fontSize: 13, color: 'var(--color-espresso-soft)' }}>No orders found for this customer.</p>}
                {customerOrders.map((o) => (
                  <div key={o.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, padding: '8px 0', borderBottom: '1px solid var(--color-line)' }}>
                    <span className={tableStyles.mono}>{o.id}</span>
                    <span>${o.total.toFixed(2)}</span>
                    <StatusPill status={o.status} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
