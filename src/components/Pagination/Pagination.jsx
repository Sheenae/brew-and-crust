import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import styles from './Pagination.module.css'

export default function Pagination({ page, pageCount, onChange }) {
  if (pageCount <= 1) return null
  return (
    <div className={styles.wrap}>
      <button onClick={() => onChange(page - 1)} disabled={page === 1} aria-label="Previous page">
        <FiChevronLeft />
      </button>
      <span>Page {page} of {pageCount}</span>
      <button onClick={() => onChange(page + 1)} disabled={page === pageCount} aria-label="Next page">
        <FiChevronRight />
      </button>
    </div>
  )
}
