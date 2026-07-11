import { useState } from 'react'
import { FiMenu, FiSearch, FiBell, FiMoon, FiSun } from 'react-icons/fi'
import notifications from '../../data/notifications.json'
import { useTheme } from '../../contexts/ThemeContext.jsx'
import styles from './AdminTopbar.module.css'

export default function AdminTopbar({ title, onMenuClick }) {
  const { theme, toggleTheme } = useTheme()
  const [notifOpen, setNotifOpen] = useState(false)
  const unread = notifications.filter((n) => !n.read).length

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <button className={styles.menuBtn} onClick={onMenuClick} aria-label="Toggle sidebar">
          <FiMenu />
        </button>
        <h1>{title}</h1>
      </div>

      <div className={styles.right}>
        <div className={styles.search}>
          <FiSearch size={15} />
          <input type="text" placeholder="Search orders, products, customers…" aria-label="Admin search" />
        </div>

        <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle dark mode">
          {theme === 'light' ? <FiMoon /> : <FiSun />}
        </button>

        <div className={styles.notifWrap}>
          <button
            className={styles.iconBtn}
            onClick={() => setNotifOpen((o) => !o)}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <FiBell />
            {unread > 0 && <span className={styles.dot}>{unread}</span>}
          </button>
          {notifOpen && (
            <div className={styles.notifPanel}>
              <div className={styles.notifHead}>Notifications</div>
              {notifications.slice(0, 6).map((n) => (
                <div key={n.id} className={`${styles.notifItem} ${!n.read ? styles.unread : ''}`}>
                  <p>{n.message}</p>
                  <span>{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.profile}>
          <span className={styles.avatar}>BC</span>
          <div className={styles.profileText}>
            <strong>Store Admin</strong>
            <span>admin@brewandcrust.co</span>
          </div>
        </div>
      </div>
    </header>
  )
}
