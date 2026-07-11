import { useMemo, useState } from 'react'
import { FiSearch, FiAlertTriangle, FiEdit2 } from 'react-icons/fi'
import inventoryData from '../../data/inventory.json'
import products from '../../data/products.json'
import Modal from '../../components/Modal/Modal.jsx'
import Button from '../../components/Button/Button.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import StatusPill from '../../components/admin/StatusPill.jsx'
import tableStyles from '../../components/admin/AdminTable.module.css'
import styles from './AdminInventory.module.css'

const PAGE_SIZE = 8

function withProduct(list) {
  return list.map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
}

export default function AdminInventory() {
  const [inventory, setInventory] = useState(withProduct(inventoryData))
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)
  const [editing, setEditing] = useState(null)
  const [newStock, setNewStock] = useState(0)

  const lowStock = inventory.filter((i) => i.stock <= i.reorderLevel)

  const filtered = useMemo(() => {
    if (!query.trim()) return inventory
    const q = query.toLowerCase()
    return inventory.filter((i) => i.product.name.toLowerCase().includes(q) || i.sku.toLowerCase().includes(q))
  }, [inventory, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openEdit = (item) => {
    setEditing(item)
    setNewStock(item.stock)
  }

  const saveStock = () => {
    setInventory((prev) => prev.map((i) => (i.productId === editing.productId ? { ...i, stock: Number(newStock) } : i)))
    setEditing(null)
  }

  const statusFor = (item) => {
    if (item.stock === 0) return 'out'
    if (item.stock <= item.reorderLevel) return 'low'
    return 'in stock'
  }

  return (
    <div className={styles.page}>
      {lowStock.length > 0 && (
        <div className={styles.alertBanner}>
          <FiAlertTriangle size={18} />
          <span><strong>{lowStock.length} items</strong> are at or below their reorder level.</span>
        </div>
      )}

      <div className={tableStyles.panel}>
        <div className={tableStyles.panelHead}>
          <h2>Inventory ({filtered.length})</h2>
          <div className={tableStyles.searchBox}>
            <FiSearch size={15} />
            <input
              placeholder="Search by product or SKU…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            />
          </div>
        </div>

        <div className={tableStyles.tableWrap}>
          <table className={tableStyles.table}>
            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Warehouse</th>
                <th>Stock</th>
                <th>Reorder level</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((i) => (
                <tr key={i.productId}>
                  <td>
                    <div className={tableStyles.avatarName}>
                      <img src={i.product.image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                      <span className={tableStyles.strong}>{i.product.name}</span>
                    </div>
                  </td>
                  <td className={tableStyles.mono}>{i.sku}</td>
                  <td className={tableStyles.muted}>{i.warehouse}</td>
                  <td className={tableStyles.strong}>{i.stock}</td>
                  <td className={tableStyles.muted}>{i.reorderLevel}</td>
                  <td><StatusPill status={statusFor(i)} /></td>
                  <td>
                    <button className={tableStyles.iconAction} onClick={() => openEdit(i)} aria-label={`Adjust stock for ${i.product.name}`}>
                      <FiEdit2 size={15} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Pagination page={page} pageCount={pageCount} onChange={setPage} />
      </div>

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        title={editing ? `Adjust stock — ${editing.product.name}` : ''}
        footer={
          <>
            <Button variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
            <Button onClick={saveStock}>Save</Button>
          </>
        }
      >
        <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
          Stock quantity
          <input
            type="number"
            min="0"
            value={newStock}
            onChange={(e) => setNewStock(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--color-line)', background: 'var(--color-parchment)' }}
          />
        </label>
      </Modal>
    </div>
  )
}
