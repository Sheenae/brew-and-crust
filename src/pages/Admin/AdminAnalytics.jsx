import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts'
import { FiTrendingUp, FiShoppingCart, FiPercent, FiUsers } from 'react-icons/fi'
import sales from '../../data/sales.json'
import customers from '../../data/customers.json'
import StatCard from '../../components/admin/StatCard.jsx'
import tableStyles from '../../components/admin/AdminTable.module.css'
import styles from './AdminAnalytics.module.css'

const COLORS = ['#B5651D', '#7C8B6F', '#2B1B14', '#944F16', '#5F6C55', '#D9A86C', '#A63D2F']

export default function AdminAnalytics() {
  const totalRevenue6mo = sales.last6Months.reduce((s, m) => s + m.revenue, 0)
  const totalOrders6mo = sales.last6Months.reduce((s, m) => s + m.orders, 0)
  const avgOrderValue = totalRevenue6mo / totalOrders6mo
  const vipCount = customers.filter((c) => c.segment === 'VIP').length

  return (
    <div className={styles.page}>
      <div className={styles.statGrid}>
        <StatCard icon={FiTrendingUp} label="Revenue (6mo)" value={`$${(totalRevenue6mo / 1000).toFixed(1)}k`} delta="14.8%" deltaDirection="up" />
        <StatCard icon={FiShoppingCart} label="Orders (6mo)" value={totalOrders6mo.toLocaleString()} delta="9.6%" deltaDirection="up" />
        <StatCard icon={FiPercent} label="Avg order value" value={`$${avgOrderValue.toFixed(2)}`} delta="1.2%" deltaDirection="down" />
        <StatCard icon={FiUsers} label="VIP customers" value={vipCount} delta="4 new" deltaDirection="up" />
      </div>

      <div className={tableStyles.panel}>
        <div className={tableStyles.panelHead}><h2>Revenue &amp; orders trend</h2></div>
        <div className={styles.chartBody}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={sales.last6Months}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,27,20,0.08)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} />
              <YAxis yAxisId="left" tickLine={false} axisLine={false} fontSize={12} width={50} />
              <YAxis yAxisId="right" orientation="right" tickLine={false} axisLine={false} fontSize={12} width={50} />
              <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(43,27,20,0.15)' }} />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="revenue" name="Revenue ($)" stroke="#B5651D" strokeWidth={2.5} dot={{ r: 3 }} />
              <Line yAxisId="right" type="monotone" dataKey="orders" name="Orders" stroke="#7C8B6F" strokeWidth={2.5} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.row}>
        <div className={tableStyles.panel}>
          <div className={tableStyles.panelHead}><h2>Category mix</h2></div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={sales.categoryBreakdown} dataKey="value" nameKey="category" outerRadius={95} label={(d) => `${d.category} ${d.value}%`} labelLine={false}>
                  {sales.categoryBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(43,27,20,0.15)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={tableStyles.panel}>
          <div className={tableStyles.panelHead}><h2>Top products by revenue</h2></div>
          <div className={styles.chartBody}>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={sales.topProducts}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(43,27,20,0.08)" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} fontSize={11} interval={0} angle={-20} textAnchor="end" height={70} />
                <YAxis tickLine={false} axisLine={false} fontSize={12} width={40} />
                <Tooltip contentStyle={{ borderRadius: 10, border: 'none', boxShadow: '0 8px 24px rgba(43,27,20,0.15)' }} />
                <Bar dataKey="revenue" fill="#944F16" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
