import { useMemo, useState } from 'react'
import { FiPlus, FiEdit2, FiTrash2, FiSearch } from 'react-icons/fi'
import productsData from '../../data/products.json'
import categories from '../../data/categories.json'
import inventory from '../../data/inventory.json'
import Button from '../../components/Button/Button.jsx'
import Modal from '../../components/Modal/Modal.jsx'
import Pagination from '../../components/Pagination/Pagination.jsx'
import StatusPill from '../../components/admin/StatusPill.jsx'
import tableStyles from '../../components/admin/AdminTable.module.css'

const PAGE_SIZE = 8

function stockFor(productId) {
  return inventory.find((i) => i.productId === productId)?.stock ?? 0
}

export default function AdminProducts() {
  const [products, setProducts] = useState(productsData)
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState({ name: '', category: 'coffee', price: '' })

  const filtered = useMemo(() => {
    let list = products
    if (category !== 'all') list = list.filter((p) => p.category === category)
    if (query.trim()) {
      const q = query.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q))
    }
    return list
  }, [products, category, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const openAdd = () => {
    setEditing(null)
    setForm({ name: '', category: 'coffee', price: '' })
    setModalOpen(true)
  }

  const openEdit = (p) => {
    setEditing(p)
    setForm({ name: p.name, category: p.category, price: p.price })
    setModalOpen(true)
  }

  const handleSave = (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.price) return
    if (editing) {
      setProducts((prev) => prev.map((p) => (p.id === editing.id ? { ...p, ...form, price: Number(form.price) } : p)))
    } else {
      const newProduct = {
        ...form,
        id: `p${Date.now()}`,
        price: Number(form.price),
        rating: 0,
        reviewCount: 0,
        image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&q=80',
        images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200&q=80'],
        tags: [],
        description: 'New product — description coming soon.',
        ingredients: [],
        nutrition: { calories: 0, caffeineMg: 0, sugarG: 0 },
        sizes: [{ id: 'one', label: 'Standard', priceDelta: 0 }],
        extrasEligible: false,
        stock: 0,
      }
      setProducts((prev) => [newProduct, ...prev])
    }
    setModalOpen(false)
  }

  const handleDelete = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
  }

  return (
    <div className={tableStyles.panel}>
      <div className={tableStyles.panelHead}>
        <h2>Products ({filtered.length})</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <div className={tableStyles.searchBox}>
            <FiSearch size={15} />
            <input
              placeholder="Search products…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1) }}
            />
          </div>
          <select
            className={tableStyles.select}
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1) }}
          >
            <option value="all">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <Button size="sm" icon={FiPlus} onClick={openAdd}>Add product</Button>
        </div>
      </div>

      <div className={tableStyles.tableWrap}>
        <table className={tableStyles.table}>
          <thead>
            <tr>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Rating</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((p) => {
              const stock = stockFor(p.id)
              return (
                <tr key={p.id}>
                  <td>
                    <div className={tableStyles.avatarName}>
                      <img src={p.image} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: 'cover' }} />
                      <span className={tableStyles.strong}>{p.name}</span>
                    </div>
                  </td>
                  <td className={tableStyles.muted} style={{ textTransform: 'capitalize' }}>{p.category}</td>
                  <td className={tableStyles.mono}>${Number(p.price).toFixed(2)}</td>
                  <td className={tableStyles.muted}>{stock}</td>
                  <td className={tableStyles.muted}>{p.rating ? `${p.rating.toFixed(1)} ★` : '—'}</td>
                  <td><StatusPill status={stock === 0 ? 'out' : stock <= 10 ? 'low' : 'in stock'} /></td>
                  <td>
                    <div className={tableStyles.rowActions}>
                      <button className={tableStyles.iconAction} onClick={() => openEdit(p)} aria-label={`Edit ${p.name}`}>
                        <FiEdit2 size={15} />
                      </button>
                      <button className={tableStyles.iconAction} onClick={() => handleDelete(p.id)} aria-label={`Delete ${p.name}`}>
                        <FiTrash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} pageCount={pageCount} onChange={setPage} />

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit product' : 'Add product'}
        footer={
          <>
            <Button variant="ghost" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editing ? 'Save changes' : 'Add product'}</Button>
          </>
        }
      >
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
            Product name
            <input
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--color-line)', background: 'var(--color-parchment)' }}
              placeholder="e.g. Hazelnut Cold Brew"
            />
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
            Category
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--color-line)', background: 'var(--color-parchment)' }}
            >
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, fontWeight: 600 }}>
            Price (USD)
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              style={{ padding: '10px 12px', borderRadius: 10, border: '1.5px solid var(--color-line)', background: 'var(--color-parchment)' }}
              placeholder="4.50"
            />
          </label>
        </form>
      </Modal>
    </div>
  )
}
