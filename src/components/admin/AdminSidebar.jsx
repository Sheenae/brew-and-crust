import { NavLink, Link } from 'react-router-dom'
import {
  FiGrid, FiBox, FiShoppingBag, FiUsers, FiArchive,
  FiTag, FiBarChart2, FiSettings, FiArrowLeftCircle, FiMonitor,
} from 'react-icons/fi'
import styles from './AdminSidebar.module.css'

const NAV = [
  { to: '/admin', label: 'Dashboard', icon: FiGrid, end: true },
  { to: '/admin/products', label: 'Products', icon: FiBox },
  { to: '/admin/orders', label: 'Orders', icon: FiShoppingBag },
  { to: '/admin/customers', label: 'Customers', icon: FiUsers },
  { to: '/admin/inventory', label: 'Inventory', icon: FiArchive },
  { to: '/admin/promotions', label: 'Promotions', icon: FiTag },
  { to: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
  { to: '/admin/settings', label: 'Settings', icon: FiSettings },
]

export default function AdminSidebar({ open, onNavigate }) {
  return (
    <aside className={`${styles.sidebar} ${open ? styles.open : ''}`}>
      <Link to="/admin" className={styles.logo}>
        <span className={styles.logoMark}>B&amp;C</span>
        <span>Admin</span>
      </Link>

      <nav className={styles.nav}>
        {NAV.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) => `${styles.link} ${isActive ? styles.active : ''}`}
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <Link to="/pos" className={styles.posLink}>
        <FiMonitor size={17} />
        Open POS
      </Link>

      <Link to="/" className={styles.exit}>
        <FiArrowLeftCircle size={17} />
        Back to store
      </Link>
    </aside>
  )
}
