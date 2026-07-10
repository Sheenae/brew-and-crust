import { Link } from 'react-router-dom'
import { FiHeart } from 'react-icons/fi'
import { motion } from 'framer-motion'
import Badge from '../Badge/Badge.jsx'
import Rating from '../Rating/Rating.jsx'
import Button from '../Button/Button.jsx'
import { useCart } from '../../contexts/CartContext.jsx'
import { useWishlist } from '../../contexts/WishlistContext.jsx'
import styles from './ProductCard.module.css'

export default function ProductCard({ product }) {
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const saved = isWishlisted(product.id)

  const handleQuickAdd = (e) => {
    e.preventDefault()
    const size = product.sizes[0]
    addItem(product, { sizeId: size.id, sizeLabel: size.label, priceDelta: size.priceDelta || 0 })
  }

  return (
    <motion.article
      className={styles.card}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/product/${product.id}`} className={styles.imageLink}>
        <div className={styles.imageWrap}>
          <img src={product.image} alt={product.name} loading="lazy" />
          {product.tags?.includes('bestseller') && (
            <span className={styles.stampCorner}>
              <Badge variant="stamp" tone="copper">Best seller</Badge>
            </span>
          )}
          {product.tags?.includes('new') && !product.tags?.includes('bestseller') && (
            <span className={styles.stampCorner}>
              <Badge variant="stamp" tone="sage">New</Badge>
            </span>
          )}
        </div>
        <button
          type="button"
          className={`${styles.favBtn} ${saved ? styles.favActive : ''}`}
          onClick={(e) => {
            e.preventDefault()
            toggleWishlist(product.id, product.name)
          }}
          aria-pressed={saved}
          aria-label={saved ? 'Remove from favorites' : 'Add to favorites'}
        >
          <FiHeart fill={saved ? 'currentColor' : 'none'} />
        </button>
      </Link>

      <div className={styles.body}>
        <span className={styles.category}>{product.category}</span>
        <Link to={`/product/${product.id}`}>
          <h3 className={styles.name}>{product.name}</h3>
        </Link>
        <Rating value={product.rating} count={product.reviewCount} />
        <div className={styles.footer}>
          <span className={styles.price}>${product.price.toFixed(2)}</span>
          <Button size="sm" onClick={handleQuickAdd}>Add</Button>
        </div>
      </div>
    </motion.article>
  )
}
