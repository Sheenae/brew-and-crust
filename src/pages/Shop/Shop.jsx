import { useMemo, useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { FiSearch, FiX } from 'react-icons/fi'
import products from '../../data/products.json'
import categories from '../../data/categories.json'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import { SkeletonCard } from '../../components/Skeleton/Skeleton.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import Button from '../../components/Button/Button.jsx'
import styles from './Shop.module.css'

const SORT_OPTIONS = [
  { id: 'popular', label: 'Most popular' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Highest rated' },
]

const MAX_PRICE = Math.ceil(Math.max(...products.map((p) => p.price)))

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'

  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('popular')
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 500)
    return () => clearTimeout(t)
  }, [])

  const setCategory = (id) => {
    if (id === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', id)
    }
    setSearchParams(searchParams)
  }

  const filtered = useMemo(() => {
    let list = products.filter((p) => p.price <= maxPrice)
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory)
    if (query.trim()) {
      const q = query.trim().toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q))
    }
    switch (sort) {
      case 'price-asc': list = [...list].sort((a, b) => a.price - b.price); break
      case 'price-desc': list = [...list].sort((a, b) => b.price - a.price); break
      case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break
      default: list = [...list].sort((a, b) => b.reviewCount - a.reviewCount)
    }
    return list
  }, [activeCategory, query, sort, maxPrice])

  const clearFilters = () => {
    setQuery('')
    setSort('popular')
    setMaxPrice(MAX_PRICE)
    setCategory('all')
  }

  return (
    <div className={`container ${styles.page}`}>
      <div className={styles.header}>
        <h1>Shop the menu</h1>
        <p>{loading ? 'Loading products…' : `${filtered.length} products`}</p>
      </div>

      <div className={styles.toolbar}>
        <div className={styles.searchBox}>
          <FiSearch />
          <input
            type="text"
            placeholder="Search coffee, pastry, tea…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search products"
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Clear search">
              <FiX />
            </button>
          )}
        </div>

        <div className={styles.priceFilter}>
          <label htmlFor="price">Max price: ${maxPrice}</label>
          <input
            id="price"
            type="range"
            min="2"
            max={MAX_PRICE}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
          />
        </div>

        <select
          className={styles.sortSelect}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort products"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </div>

      <div className={styles.body}>
        <aside className={styles.sidebar}>
          <h3>Categories</h3>
          <ul className={styles.categoryList}>
            <li>
              <button
                className={activeCategory === 'all' ? styles.activeCat : ''}
                onClick={() => setCategory('all')}
              >
                All products
                <span>{products.length}</span>
              </button>
            </li>
            {categories.map((c) => (
              <li key={c.id}>
                <button
                  className={activeCategory === c.id ? styles.activeCat : ''}
                  onClick={() => setCategory(c.id)}
                >
                  {c.icon} {c.name}
                  <span>{products.filter((p) => p.category === c.id).length}</span>
                </button>
              </li>
            ))}
          </ul>
          <Button variant="ghost" size="sm" onClick={clearFilters}>Clear filters</Button>
        </aside>

        <div className={styles.grid}>
          {loading ? (
            Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
          ) : filtered.length === 0 ? (
            <div className={styles.emptyWrap}>
              <EmptyState
                icon={FiSearch}
                title="No products match your filters"
                message="Try widening your price range or clearing the search."
                actionLabel="Clear filters"
                onAction={clearFilters}
              />
            </div>
          ) : (
            filtered.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </div>
    </div>
  )
}
