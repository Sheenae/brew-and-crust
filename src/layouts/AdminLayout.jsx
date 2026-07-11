import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import AdminSidebar from '../components/admin/AdminSidebar.jsx'
import AdminTopbar from '../components/admin/AdminTopbar.jsx'
import styles from './AdminLayout.module.css'

const TITLES = {
  '/admin': 'Dashboard',
  '/admin/products': 'Products',
  '/admin/orders': 'Orders',
  '/admin/customers': 'Customers',
  '/admin/inventory': 'Inventory',
  '/admin/promotions': 'Promotions',
  '/admin/analytics': 'Analytics',
  '/admin/settings': 'Settings',
}

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const title = TITLES[pathname] || 'Admin'

  return (
    <div className={styles.shell}>
      <AdminSidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />
      {sidebarOpen && <div className={styles.scrim} onClick={() => setSidebarOpen(false)} />}
      <div className={styles.main}>
        <AdminTopbar title={title} onMenuClick={() => setSidebarOpen((o) => !o)} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  )
}
