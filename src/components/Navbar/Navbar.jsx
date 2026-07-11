import { useState, useEffect } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { FiShoppingBag, FiMenu, FiX, FiMoon, FiSun, FiHeart } from 'react-icons/fi'
import { useCart } from '../../contexts/CartContext.jsx'
import { useTheme } from '../../contexts/ThemeContext.jsx'
import { useWishlist } from '../../contexts/WishlistContext.jsx'
import styles from './Navbar.module.css'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/shop', label: 'Shop' },
]

export default function Navbar() {
  const { totals } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { ids } = useWishlist()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.bar}`}>
        <Link to="/" className={styles.logo}>
          <span className={styles.logoMark}>B&amp;C</span>
          <span className={styles.logoText}>Brew &amp; Crust</span>
        </Link>

        <nav className={styles.desktopNav} aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.actions}>
          <button className={styles.iconBtn} onClick={toggleTheme} aria-label="Toggle dark mode">
            {theme === 'light' ? <FiMoon /> : <FiSun />}
          </button>
          <span className={styles.iconBtn} aria-label={`${ids.length} favorites saved`}>
            <FiHeart fill={ids.length > 0 ? 'currentColor' : 'none'} />
            {ids.length > 0 && <span className={styles.dot}>{ids.length}</span>}
          </span>
          <Link to="/cart" className={styles.cartBtn} aria-label="Cart">
            <FiShoppingBag />
            {totals.itemCount > 0 && <span className={styles.dot}>{totals.itemCount}</span>}
          </Link>
          <button
            className={styles.iconBtn}
            onClick={() => setOpen((o) => !o)}
            aria-label="Toggle menu"
            aria-expanded={open}
          >
            {open ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>

      {open && (
        <nav className={styles.mobileNav} aria-label="Mobile">
          {LINKS.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to="/cart" onClick={() => setOpen(false)}>Cart</NavLink>
          <NavLink to="/admin" onClick={() => setOpen(false)}>Admin</NavLink>
        </nav>
      )}
    </header>
  )
}
