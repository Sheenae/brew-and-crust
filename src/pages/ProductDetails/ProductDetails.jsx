import { useState, useMemo } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { FiHeart, FiChevronRight, FiCheck } from 'react-icons/fi'
import products from '../../data/products.json'
import reviewsData from '../../data/reviews.json'
import extrasData from '../../data/extras.json'
import Rating from '../../components/Rating/Rating.jsx'
import Badge from '../../components/Badge/Badge.jsx'
import Button from '../../components/Button/Button.jsx'
import QuantityStepper from '../../components/QuantityStepper/QuantityStepper.jsx'
import ProductCard from '../../components/ProductCard/ProductCard.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import { useCart } from '../../contexts/CartContext.jsx'
import { useWishlist } from '../../contexts/WishlistContext.jsx'
import styles from './ProductDetails.module.css'

const TABS = ['Description', 'Ingredients', 'Nutrition', 'Reviews']

export default function ProductDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()

  const product = products.find((p) => p.id === id)

  const [activeImage, setActiveImage] = useState(0)
  const [sizeId, setSizeId] = useState(product?.sizes[0]?.id)
  const [selectedExtras, setSelectedExtras] = useState([])
  const [quantity, setQuantity] = useState(1)
  const [notes, setNotes] = useState('')
  const [tab, setTab] = useState('Description')

  const related = useMemo(() => {
    if (!product) return []
    return products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
  }, [product])

  const productReviews = useMemo(
    () => reviewsData.filter((r) => r.productId === id),
    [id],
  )

  if (!product) {
    return (
      <div className="container">
        <EmptyState
          title="Product not found"
          message="This item may have been removed from the menu."
          actionLabel="Back to shop"
          onAction={() => navigate('/shop')}
        />
      </div>
    )
  }

  const size = product.sizes.find((s) => s.id === sizeId) || product.sizes[0]
  const unitPrice = product.price + (size.priceDelta || 0) + selectedExtras.reduce((s, e) => s + e.price, 0)
  const saved = isWishlisted(product.id)

  const toggleExtra = (extra) => {
    setSelectedExtras((prev) =>
      prev.some((e) => e.id === extra.id) ? prev.filter((e) => e.id !== extra.id) : [...prev, extra],
    )
  }

  const handleAddToCart = () => {
    addItem(product, {
      sizeId: size.id,
      sizeLabel: size.label,
      priceDelta: size.priceDelta || 0,
      extras: selectedExtras,
      quantity,
      notes,
    })
  }

  return (
    <div className={`container ${styles.page}`}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <FiChevronRight size={13} />
        <Link to="/shop">Shop</Link>
        <FiChevronRight size={13} />
        <Link to={`/shop?category=${product.category}`}>{product.category}</Link>
        <FiChevronRight size={13} />
        <span>{product.name}</span>
      </nav>

      <div className={styles.top}>
        <div className={styles.gallery}>
          <div className={styles.mainImage}>
            <img src={product.images[activeImage]} alt={product.name} />
            {product.tags.includes('bestseller') && (
              <span className={styles.stampCorner}>
                <Badge variant="stamp" tone="copper">Best seller</Badge>
              </span>
            )}
          </div>
          {product.images.length > 1 && (
            <div className={styles.thumbs}>
              {product.images.map((img, i) => (
                <button
                  key={img}
                  className={i === activeImage ? styles.thumbActive : ''}
                  onClick={() => setActiveImage(i)}
                  aria-label={`Show image ${i + 1}`}
                >
                  <img src={img} alt="" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className={styles.info}>
          <span className={styles.category}>{product.category}</span>
          <h1 className={styles.name}>{product.name}</h1>
          <Rating value={product.rating} count={product.reviewCount} size={16} />
          <p className={styles.price}>${unitPrice.toFixed(2)}</p>
          <p className={styles.desc}>{product.description}</p>

          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>Size</span>
            <div className={styles.pillRow}>
              {product.sizes.map((s) => (
                <button
                  key={s.id}
                  className={sizeId === s.id ? styles.pillActive : styles.pill}
                  onClick={() => setSizeId(s.id)}
                >
                  {s.label}
                  {s.priceDelta ? ` (${s.priceDelta > 0 ? '+' : ''}$${s.priceDelta.toFixed(2)})` : ''}
                </button>
              ))}
            </div>
          </div>

          {product.extrasEligible && (
            <div className={styles.optionGroup}>
              <span className={styles.optionLabel}>Extras</span>
              <div className={styles.pillRow}>
                {extrasData.map((extra) => {
                  const active = selectedExtras.some((e) => e.id === extra.id)
                  return (
                    <button
                      key={extra.id}
                      className={active ? styles.pillActive : styles.pill}
                      onClick={() => toggleExtra(extra)}
                    >
                      {active && <FiCheck size={13} />} {extra.name} (+${extra.price.toFixed(2)})
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className={styles.optionGroup}>
            <span className={styles.optionLabel}>Special instructions</span>
            <textarea
              className={styles.notes}
              placeholder="e.g. extra hot, light ice, no whip…"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
            />
          </div>

          <div className={styles.buyRow}>
            <QuantityStepper value={quantity} onChange={setQuantity} size="lg" />
            <Button size="lg" onClick={handleAddToCart} fullWidth>
              Add to cart — ${(unitPrice * quantity).toFixed(2)}
            </Button>
            <button
              className={`${styles.favBtn} ${saved ? styles.favActive : ''}`}
              onClick={() => toggleWishlist(product.id, product.name)}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from favorites' : 'Add to favorites'}
            >
              <FiHeart fill={saved ? 'currentColor' : 'none'} />
            </button>
          </div>
          <p className={styles.stock}>
            {product.stock > 10 ? 'In stock' : `Only ${product.stock} left today`}
          </p>
        </div>
      </div>

      <div className={styles.tabs}>
        <div className={styles.tabHeaders} role="tablist">
          {TABS.map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              className={tab === t ? styles.tabActive : ''}
              onClick={() => setTab(t)}
            >
              {t}
            </button>
          ))}
        </div>
        <div className={styles.tabPanel}>
          {tab === 'Description' && <p>{product.description}</p>}
          {tab === 'Ingredients' && (
            <ul className={styles.tagList}>
              {product.ingredients.map((ing) => <li key={ing}>{ing}</li>)}
            </ul>
          )}
          {tab === 'Nutrition' && (
            <div className={styles.nutritionGrid}>
              <div><strong>{product.nutrition.calories}</strong><span>Calories</span></div>
              <div><strong>{product.nutrition.caffeineMg}mg</strong><span>Caffeine</span></div>
              <div><strong>{product.nutrition.sugarG}g</strong><span>Sugar</span></div>
            </div>
          )}
          {tab === 'Reviews' && (
            productReviews.length === 0 ? (
              <p className={styles.noReviews}>No reviews yet for this item.</p>
            ) : (
              <div className={styles.reviewList}>
                {productReviews.map((r) => (
                  <div key={r.id} className={styles.reviewCard}>
                    <div className={styles.reviewHead}>
                      <strong>{r.author}</strong>
                      <Rating value={r.rating} />
                    </div>
                    <p>{r.comment}</p>
                    <span className={styles.reviewDate}>{r.date}</span>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className={styles.related}>
          <h2>You might also like</h2>
          <div className={styles.relatedGrid}>
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}
    </div>
  )
}
