import { Link } from 'react-router-dom'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { FiDollarSign, FiShoppingBag, FiBox, FiUsers, FiArrowRight } from 'react-icons/fi'
import orders from '../../data/orders.json'
import customers from '../../data/customers.json'
import inventory from '../../data/inventory.json'
import products from '../../data/products.json'
import sales from '../../data/sales.json'
import notifications from '../../data/notifications.json'
import StatCard from '../../components/admin/StatCard.jsx'
import StatusPill from '../../components/admin/StatusPill.jsx'
import tableStyles from '../../components/admin/AdminTable.module.css'
import styles from './AdminDashboard.module.css'

const COLORS = ['#B5651D', '#7C8B6F', '#2B1B14', '#944F16', '#5F6C55', '#D9A86C', '#A63D2F']

export default function AdminDashboard() {
  const totalRevenue = orders.reduce((s, o) => s + (o.status !== 'cancelled' ? o.total : 0), 0)
  const totalOrders = orders.length
  const totalProducts = products.length
  const totalCustomers = customers.length

  const lowStock = inventory
    .filter((i) => i.stock <= i.reorderLevel)
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId) }))
    .sort((a, b) => a.stock - b.stock)

  const recentOrders = orders.slice(0, 6)
  const recentCustomers = [...customers].sort((a, b) => new Date(b.lastOrder) - new Date(a.lastOrder)).slice(0, 5)

  return (
    <div className={styles.page}>
      <div className={styles.statGrid}>
        <StatCard icon={FiDollarSign} label="Revenue (7 days)" value={`$${totalRevenue.toFixed(0)}`} delta="12.4%" deltaDirection="up" />
        <StatCard icon={FiShoppingBag} label="Orders" value={totalOrders} delta="8.1%" deltaDirection="up" />
        <StatCard icon={FiBox} label="Products" value={totalProducts} delta="2 new" deltaDirection="up" />
        <StatCard icon={FiUsers} label="Customers" value={totalCustomers} delta="3.2%" deltaDirection="down" />
      </div>

      <div className={styles.chartRow}>
        <div className={`${tableStyles.panel} ${styles.chartPanelWide}`}>
          <div className={tableStyles.panelHead}>
            <h2>Revenue this week</h2>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={260}>
              <AreaChart data={sales.last7Days}>
                <defs>
                  <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#B5651D" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#B5651D" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,27,20,0.08)" vertical={false} />
                <XAxis dataKey="day" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(43,27,20,0.15)' }} />
                <Area type="monotone" dataKey="revenue" stroke="#B5651D" strokeWidth={2} fill="url(#revFill)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${tableStyles.panel} ${styles.chartPanelNarrow}`}>
          <div className={tableStyles.panelHead}>
            <h2>Orders by category</h2>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={sales.categoryBreakdown}
                  dataKey="value"
                  nameKey="category"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {sales.categoryBreakdown.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(43,27,20,0.15)' }} />
              </PieChart>
            </ResponsiveContainer>
            <ul className={styles.legend}>
              {sales.categoryBreakdown.map((c, i) => (
                <li key={c.category}>
                  <span style={{ background: COLORS[i % COLORS.length] }} />
                  {c.category} <strong>{c.value}%</strong>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className={styles.chartRow}>
        <div className={`${tableStyles.panel} ${styles.chartPanelWide}`}>
          <div className={tableStyles.panelHead}>
            <h2>Top products</h2>
          </div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={sales.topProducts} layout="vertical" margin={{ left: 24 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,27,20,0.08)" horizontal={false} />
                <XAxis type="number" tickLine={false} axisLine={false} fontSize={12} />
                <YAxis type="category" dataKey="name" tickLine={false} axisLine={false} fontSize={12} width={130} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(43,27,20,0.15)' }} />
                <Bar dataKey="unitsSold" fill="#B5651D" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`${tableStyles.panel} ${styles.chartPanelNarrow}`}>
          <div className={tableStyles.panelHead}>
            <h2>Low stock alerts</h2>
            <Link to="/admin/inventory" className={styles.viewAll}>View all <FiArrowRight size={13} /></Link>
          </div>
          <ul className={styles.stockList}>
            {lowStock.slice(0, 5).map((i) => (
              <li key={i.productId}>
                <img src={i.product.image} alt="" />
                <div>
                  <strong>{i.product.name}</strong>
                  <span>{i.sku}</span>
                </div>
                <span className={styles.stockCount}>{i.stock} left</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.chartRow}>
        <div className={`${tableStyles.panel} ${styles.chartPanelWide}`}>
          <div className={tableStyles.panelHead}>
            <h2>Recent orders</h2>
            <Link to="/admin/orders" className={styles.viewAll}>View all <FiArrowRight size={13} /></Link>
          </div>
          <div className={tableStyles.tableWrap}>
            <table className={tableStyles.table}>
              <thead>
                <tr>
                  <th>Order</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td className={tableStyles.mono}>{o.id}</td>
                    <td>{o.customer}</td>
                    <td className={tableStyles.muted}>{o.items}</td>
                    <td className={tableStyles.strong}>${o.total.toFixed(2)}</td>
                    <td><StatusPill status={o.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className={`${tableStyles.panel} ${styles.chartPanelNarrow}`}>
          <div className={tableStyles.panelHead}>
            <h2>Recent customers</h2>
            <Link to="/admin/customers" className={styles.viewAll}>View all <FiArrowRight size={13} /></Link>
          </div>
          <ul className={styles.customerList}>
            {recentCustomers.map((c) => (
              <li key={c.id}>
                <span className={tableStyles.avatar}>{c.name.split(' ').map((n) => n[0]).join('')}</span>
                <div>
                  <strong>{c.name}</strong>
                  <span>{c.orders} orders · ${c.totalSpent.toFixed(0)} spent</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={`${tableStyles.panel}`}>
        <div className={tableStyles.panelHead}>
          <h2>Notifications</h2>
        </div>
        <ul className={styles.notifList}>
          {notifications.map((n) => (
            <li key={n.id} className={!n.read ? styles.unreadNotif : ''}>
              <span className={styles.notifDot} />
              <p>{n.message}</p>
              <span className={styles.notifTime}>{n.time}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
