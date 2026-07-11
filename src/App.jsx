import { Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import StorefrontLayout from './layouts/StorefrontLayout.jsx'
import AdminLayout from './layouts/AdminLayout.jsx'
import Landing from './pages/Landing/Landing.jsx'
import Shop from './pages/Shop/Shop.jsx'
import ProductDetails from './pages/ProductDetails/ProductDetails.jsx'
import Cart from './pages/Cart/Cart.jsx'
import Checkout from './pages/Checkout/Checkout.jsx'
import NotFound from './pages/NotFound/NotFound.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import AdminProducts from './pages/Admin/AdminProducts.jsx'
import AdminOrders from './pages/Admin/AdminOrders.jsx'
import AdminCustomers from './pages/Admin/AdminCustomers.jsx'
import AdminInventory from './pages/Admin/AdminInventory.jsx'
import AdminPromotions from './pages/Admin/AdminPromotions.jsx'
import AdminAnalytics from './pages/Admin/AdminAnalytics.jsx'
import AdminSettings from './pages/Admin/AdminSettings.jsx'
import POS from './pages/POS/POS.jsx'

export default function App() {
  return (
    <AnimatePresence mode="wait">
      <Routes>
        <Route element={<StorefrontLayout />}>
          <Route path="/" element={<Landing />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="analytics" element={<AdminAnalytics />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>
        <Route path="/pos" element={<POS />} />
        <Route path="*" element={<StorefrontLayout />}>
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </AnimatePresence>
  )
}
