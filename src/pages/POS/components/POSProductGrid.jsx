import { FiSearch } from 'react-icons/fi'
import styles from './POSProductGrid.module.css'

export default function POSProductGrid({
  categories, category, onCategoryChange, query, onQueryChange, products, onTapProduct,
}) {
  return (
    <section className={styles.panel}>
      <div className={styles.searchBar}>
        <FiSearch size={16} />
        <input
          type="text"
          placeholder="Search menu…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search products"
        />
      </div>

      <div className={styles.categories}>
        <button
          className={category === 'all' ? styles.catActive : styles.cat}
          onClick={() => onCategoryChange('all')}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            className={category === c.id ? styles.catActive : styles.cat}
            onClick={() => onCategoryChange(c.id)}
          >
            <span>{c.icon}</span> {c.name}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {products.length === 0 && <p className={styles.empty}>No items match your search.</p>}
        {products.map((p) => (
          <button key={p.id} className={styles.tile} onClick={() => onTapProduct(p)}>
            <img src={p.image} alt="" />
            <span className={styles.tileName}>{p.name}</span>
            <span className={styles.tilePrice}>${p.price.toFixed(2)}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
