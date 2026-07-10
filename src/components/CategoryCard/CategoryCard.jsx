import { Link } from 'react-router-dom'
import styles from './CategoryCard.module.css'

export default function CategoryCard({ category }) {
  return (
    <Link to={`/shop?category=${category.id}`} className={styles.card}>
      <span className={styles.icon}>{category.icon}</span>
      <span className={styles.name}>{category.name}</span>
      <span className={styles.desc}>{category.description}</span>
    </Link>
  )
}
