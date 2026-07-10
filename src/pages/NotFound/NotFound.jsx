import { Link } from 'react-router-dom'
import Button from '../../components/Button/Button.jsx'
import styles from './NotFound.module.css'

export default function NotFound() {
  return (
    <div className={`container ${styles.page}`}>
      <span className={styles.code}>404</span>
      <h1>This table's not set.</h1>
      <p>The page you're looking for doesn't exist — maybe it sold out.</p>
      <Button as={Link} to="/" size="lg">Back to home</Button>
    </div>
  )
}
